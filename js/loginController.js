/**
 * Controller for the login page.
 */
angular.module('app').controller('LoginController', function($scope, $location, $window,
    OPTS, dbClientService) {

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
      dbClientService.setDropboxClient(client);
      $location.url('/');
      $scope.$apply();
    }
  };

  // Try to finish OAuth authorization.
  client.authenticate({interactive: false}, updateDropboxAuthenticationStatus);

  $scope.loginDropbox = function() {
    client.authenticate({interactive: true}, updateDropboxAuthenticationStatus);
  };

});
