/**
 * Controller for the home page.
 */
angular.module('app').controller('HomeController', function($scope, AlertService, DropboxService, Utils) {

  AlertService.clearAll();

  $scope.movesDays = {};

  DropboxService.getDataSources(function(dataSources) {
    $scope.dataSources = dataSources;
    angular.forEach(dataSources, function(value, key) {
      if (value.type === 'integration' && value.name === 'moves') {
        // Fetch moves data
        DropboxService.getData('moves_data', 'moves_data', function(records) {
          angular.forEach(records, function(value, key) {
            $scope.movesDays[value.getId()] = value.get('data');
          });
          Utils.apply($scope);
        }, function(error) {
          AlertService.error(error);
          Utils.apply($scope);
        });
      }
    });
    Utils.apply($scope);
  }, function(error) {
    AlertService.error(error);
    Utils.apply($scope);
  });

});
