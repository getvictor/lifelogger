/**
 * Controller for the navigation bar.
 */
angular.module('app').controller('NavbarController', function($scope, $location,
    AuthenticationService, ApigeeClient, DropboxService) {

  $scope.isAuthenticated = function() {
    return AuthenticationService.isAuthenticated();
  };

  $scope.urlMatches = function(url) {
    return $location.url() === url;
  };

  $scope.logout = function() {
    DropboxService.logout();
    ApigeeClient.logout(function() {
      $location.path('/login');
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$apply();
      }
    }, function(error) {
      alert("Could not Logout");
    });
  };

});
