/**
 * Controller for the navigation bar.
 */
angular.module('app').controller('NavbarController', function($scope, $location,
    AuthenticationService) {

  $scope.isAuthenticated = function() {
    return AuthenticationService.isAuthenticated();
  };

  $scope.urlMatches = function(url) {
    return $location.url() === url;
  };

  $scope.logout = function() {
    AuthenticationService.signOut(function() {
      $location.url('/login');
      $scope.$apply();
    });
  };

});
