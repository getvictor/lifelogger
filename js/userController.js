/**
 * Controller for Login and Register views.
 */
angular.module('app').controller('UserController', function($scope, $location, $log,
    AuthenticationService, AlertService, ApigeeClient) {

  $scope.AlertService = AlertService;
  AlertService.clearAll();

  $scope.login = function(username, password) {
    // Clear alerts.
    AlertService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

      var user = {
        username: $scope.username,
        password: $scope.password
      };

      ApigeeClient.login(user, function() {
        $location.path("/");
      }, AlertService.error);

    }

  };

  $scope.register = function register() {
    // Clear alerts;
    AlertService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {
      var user = {
          username: $scope.username,
          name: $scope.name,
          email: $scope.email,
          password: $scope.password
      };
      ApigeeClient.signup(user).success(function(data) {
        alert('Now login.');
      }).error(function(data, status) {
        if (data && data.error_description) {
          AlertService.error({message: data.error_description});
        } else {
          AlertService.error(data);
        }
      });

    }
  };

});
