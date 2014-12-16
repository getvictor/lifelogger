/**
 * Utilities.
 */
angular.module('app').service('Utils', function($location, $rootScope) {

  this.apply = function(scope) {
    if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
      scope.$apply();
    }
  };

  this.path = function(routePath, scope) {
    $location.path(routePath);
    this.apply(scope);
  };

});
