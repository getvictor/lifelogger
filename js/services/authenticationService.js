/**
 * Service responsible for storing authentication state.
 */
angular.module('app').service('AuthenticationService', function($window) {

  this.isAuthenticated = function() {
    return !!$window.localStorage.apigeeToken;
  };

  this.signOut = function() {
    // TODO: Is this needed?
  };

});
