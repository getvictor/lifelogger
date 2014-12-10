angular.module('app').service('ApigeeClient', function($http, $log, OPTS) {

  var clientCreds = {
      orgName: OPTS.APIGEE_ORG_NAME,
      appName: OPTS.APIGEE_APP_NAME
  };
  var dataClient = new Apigee.Client(clientCreds);

  // TODO: Add logout and timeout callbacks.

  this.signup = function(user) {
    return $http.post(OPTS.USER_PROXY + '/signup', user);
  };

});
