/**
 * Controller for the storage page.
 */
angular.module('app').controller('StorageController', function($scope, $location, $window,
    AlertService, OPTS, DBClientService, UserDTO) {

  var client = new Dropbox.Client({key: OPTS.DROPBOX_APP_KEY});
  client.authDriver(new Dropbox.AuthDriver.Popup({
    receiverUrl: $window.location.origin + $window.location.pathname + 'dropbox_oauth_receiver.html'
  }));

  var updateDropboxAuthenticationStatus = function(error, client) {
    if (error) {
      alert('Authentication error');
      console.log(error);
    }
    if (client.isAuthenticated()) {
      var credentials = client.credentials();

      var storage = UserDTO.user.get('storage');
      if (!storage) {
        storage = {};
        UserDTO.user.set('storage', storage);
      }
      storage.name = 'dropbox';
      storage.credentials = credentials;
      UserDTO.user.save(function(error, result) {
        if (error) {
          AlertService.error(error);
        }
      });

      $location.path('/');
      // Update AngularJS if needed.
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$apply();
      }
    }
  };

  // Try to finish OAuth authorization.
  // client.authenticate({interactive: false}, updateDropboxAuthenticationStatus);

  $scope.loginDropbox = function() {
    client.authenticate({interactive: true}, updateDropboxAuthenticationStatus);
  };

});
