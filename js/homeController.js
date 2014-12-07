/**
 * Controller for the home page.
 */
angular.module('app').controller('HomeController', function($scope, AlertsService, DBClientService) {

  $scope.AlertsService = AlertsService;
  AlertsService.clearAll();

  DBClientService.listTrackers(function(trackers) {
    $scope.trackers = trackers;
    $scope.$apply();
  }, function(err) {
    AlertsService.error(err);
    $scope.$apply();
  });

});
