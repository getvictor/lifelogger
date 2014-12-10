/**
 * Controller for the add/edit tracker page.
 */
angular.module('app').controller('EditTrackerController', function($scope, $location,
    TrackerToEdit, DBClientService, AlertService) {

  $scope.AlertService = AlertService;
  AlertService.clearAll();

  if (TrackerToEdit.value) {
    $scope.edit = true;
    $scope.name = timezoneToEdit.value.name;
    TrackerToEdit.value = null;
  }

  $scope.addTracker = function() {
    AlertService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

      // Save in the DB.
      var tracker = {
          name: $scope.name
      };
      DBClientService.saveTracker({
        name: encodeURIComponent($scope.name)
      }, function() {
        // Go back to home page.
        $location.path('/');
        $scope.$apply();
      }, function(error) {
        AlertService.error(error);
      });

    }
  };

  $scope.editTracker = function() {
    AlertService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

      // Update in the DB.

    }
  };
});
