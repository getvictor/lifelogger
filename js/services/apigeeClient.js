angular.module('app').service('ApigeeClient', function($http, $log, $window, OPTS, UserDTO) {

  var clientCreds = {
      orgName: OPTS.APIGEE_ORG_NAME,
      appName: OPTS.APIGEE_APP_NAME
  };
  var dataClient = new Apigee.Client(clientCreds);

  // TODO: Add logout and timeout callbacks.

  this.signup = function(user) {
    return $http.post(OPTS.USER_PROXY + '/signup', user);
  };

  this.getUser = function(successCallback, errorCallback) {
    dataClient.getEntity({
      type: 'user',
      uuid: $window.localStorage.userUuid
    }, function(error, result) {
      if (error) {
        errorCallback(error);
      } else {
        UserDTO.user = this;
        $window.localStorage.apigeeToken = dataClient.token;
        successCallback();
      }
    });
  };

  this.login = function(user, successCallback, errorCallback) {
    var getUser = this.getUser;
    dataClient.login(user.username, user.password, function (error, response) {
      if (error) {
        errorCallback(error);
      } else {
        // success — user has been logged in
        $window.localStorage.userUuid = response.user.uuid;
        getUser(function() {
          $window.localStorage.apigeeToken = dataClient.token;
          successCallback();
        }, function(error) {
          errorCallback(error);
        });
      }
    });
  };

  this.logout = function(successCallback, errorCallback) {
    var callback = function() {
      delete $window.localStorage.apigeeToken;
      successCallback();
    };
    if (UserDTO.user) {
      dataClient.logoutAndDestroyToken(UserDTO.user.get('username'), null, null, function(error, response) {
        if (error) {
          errorCallback(error);
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  };

});
