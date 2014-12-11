/**
 * Controller for the home page.
 */
angular.module('app').controller('HomeController', function($scope, AlertService, DBClientService) {

  $scope.AlertService = AlertService;
  AlertService.clearAll();

  /*
  DBClientService.listTrackers(function(trackers) {
    $scope.trackers = trackers;
    $scope.$apply();
  }, function(err) {
    AlertService.error(err);
    $scope.$apply();
  });
  */

});
