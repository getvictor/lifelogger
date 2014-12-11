/**
 * Controller for the navigation bar.
 */
angular.module('app').controller('NavbarController', function($scope, $location,
    AuthenticationService, ApigeeClient) {

  $scope.isAuthenticated = function() {
    return AuthenticationService.isAuthenticated();
  };

  $scope.urlMatches = function(url) {
    return $location.url() === url;
  };

  $scope.logout = function() {
    ApigeeClient.logout(function() {
      $location.path('/login');
    }, function(error) {
      alert("Could not Logout");
    });
  };

});
