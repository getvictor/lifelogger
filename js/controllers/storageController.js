/**
 * Controller for the storage page.
 */
angular.module('app').controller('StorageController', function($scope, $location, $window,
    AlertService, OPTS, DropboxService, UserDTO, Utils) {

  AlertService.clearAll();

  $scope.loginDropbox = function() {
    DropboxService.getClient();
    DropboxService.login(function() {
      var storage = UserDTO.user.get('storage');
      if (!storage) {
        storage = {};
        UserDTO.user.set('storage', storage);
      }
      storage.name = 'dropbox';
      storage.credentials = DropboxService.getCredentials();
      UserDTO.user.save(function(error, result) {
        if (error) {
          AlertService.error(error);
        } else {
          Utils.path('/', $scope);
        }
      });
    }, function(error) {
      AlertService.error(error);
    });
  };

});
