/**
 * Controller for the alert messages.
 */
angular.module('app').controller('AlertBaseController', function($scope, $rootScope, AlertService) {

  $scope.AlertService = AlertService;

});
