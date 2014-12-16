/**
 * Controller for the 'Add Data Source' page.
 */
angular.module('app').controller('AddDataSourceController', function($scope, $window, AlertService, OPTS) {

  AlertService.clearAll();

  $scope.movesClientId = OPTS.MOVES_CLIENT_ID;
  $scope.movesRedirectUri = OPTS.MOVES_REDIRECT_URI;

});
