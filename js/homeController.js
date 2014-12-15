/**
 * Controller for the home page.
 */
angular.module('app').controller('HomeController', function($scope, AlertService, DropboxService) {

  AlertService.clearAll();

  DropboxService.getDataSources(function(dataSources) {
    $scope.dataSources = dataSources;
    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
      $scope.$apply();
    }
  }, function(error) {
    AlertService.error(error);
    $scope.$apply();
  });

});
