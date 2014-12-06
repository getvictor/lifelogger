/**
 * Service responsible for storing authentication state.
 */
angular.module('app').factory('AuthenticationService', function(DBClientService) {

  return {
    isAuthenticated: function() {
      return DBClientService.isAuthenticated();
    },
    signOut: function(callback) {
      DBClientService.signOut(callback);
    }
  };

});
