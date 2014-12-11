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

  this.login = function(user, successCallback, errorCallback) {
    dataClient.login(user.username, user.password, function (error, response) {
      if (error) {
        errorCallback(error);
      } else {
        // success — user has been logged in
        UserDTO.user = response.user;
        $window.localStorage.apigeeToken = dataClient.token;
        successCallback();
      }
    });
  };

  this.logout = function(successCallback, errorCallback) {
    dataClient.logoutAndDestroyToken(UserDTO.user.username, null, null, function(error, response) {
      if (error) {
        errorCallback(error);
      } else {
        delete $window.localStorage.apigeeToken;
        successCallback();
      }
    });
  };

});
