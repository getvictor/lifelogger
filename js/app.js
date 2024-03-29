angular.module('app', [ 'ngRoute', 'ui.bootstrap', 'ui.validate', 'dropbox']);

angular.module('app').constant('OPTS', {
  TIMEOUT: 30000,
  APIGEE_ORG_NAME: 'victoreda',
  APIGEE_APP_NAME: 'lifelogger',
  USER_PROXY: 'https://victoreda-prod.apigee.net/lifelogger-user',
  MOVES_CLIENT_ID: 'BGg13T3W7nHi69oD8M2X2o7S0OzHP7V3',
  MOVES_REDIRECT_URI: window.location.origin + window.location.pathname + '#/movesRedirectUri',
  BACKEND_NORMALIZE: 'https://victoreda-prod.apigee.net/lifelogger-normalize'
});

// Configure routes.
angular.module('app').config(function($routeProvider) {
  $routeProvider.
  // Login user.
  when('/login', {
    templateUrl : 'views/login.html',
    controller : 'UserController',
    access : { requiredAuthentication: false },
    title : 'Login'
  }).
  // Register user.
  when('/register', {
    templateUrl : 'views/register.html',
    controller : 'UserController',
    access : { requiredAuthentication: false },
    title : 'Create Account'
  }).
  // Show home page.
  when('/', {
    templateUrl : 'views/home.html',
    controller : 'HomeController',
    access : { requiredAuthentication: true, requiredStorage: true },
    title : 'Home'
  }).
  // Select data source.
  when('/storage', {
    templateUrl : 'views/storage.html',
    controller : 'StorageController',
    access : { requiredAuthentication: true },
    title : 'Home'
  }).
  // Show test page.
  when('/test', {
    templateUrl : 'views/test.html',
    controller : 'TestController',
    access : { requiredAuthentication: true },
    title : 'Test'
  }).
  // Add data source
  when('/addDataSource', {
    templateUrl : 'views/addDataSource.html',
    controller : 'AddDataSourceController',
    access : { requiredAuthentication: true, requiredStorage: true },
    title : 'Add Data Source'
  }).
  // Add tracker.
  when('/addTracker', {
    redirectTo : '/editTracker'
  }).
  // Edit tracker
  when('/editTracker', {
    templateUrl : 'views/editTracker.html',
    controller : 'EditTrackerController',
    access : { requiredAuthentication: true, requiredStorage: true },
    title : 'Edit Tracker'
  }).
  when('/movesRedirectUri', {
    templateUrl: 'views/movesRedirectUri.html',
    controller: 'MovesRedirectUriController',
    access : { requiredAuthentication: true, requiredStorage: true },
    title : 'Load Moves Data'
  }).
  // Go to home page.
  otherwise({
    redirectTo : '/'
  });
});

angular.element(document).ready(function() {
  var startApp = function() {
    angular.bootstrap(document, ["app"]);
  };

});

angular.module('app').run(function($http, $location, $rootScope, $routeParams, $window,
    AlertService, AuthenticationService, ApigeeClient, DropboxService, OPTS, UserDTO, Utils) {
  $rootScope.APP_TITLE = APP_TITLE;

  var loading = false;

  // Load user if authenticated
  if (AuthenticationService.isAuthenticated()) {
    loading = true;
    var currentLocation = $location.path();
    ApigeeClient.getUser(function() {
      // Load storage credentials
      if (UserDTO.hasStorage()) {
        var storage = UserDTO.user.get('storage');
        switch (storage.name) {
        case 'dropbox':
          DropboxService.setClient(storage.credentials);
          break;
        }
        loading = false;
        $rootScope.$emit('userUpdated');
        // Don't reload if the location did not change
        if ($location.path() === currentLocation) {
          $('#loadingCover').hide();
        } else {
          Utils.path(currentLocation, $rootScope);
        }
      }
    }, function(error) {
      alert("Could not load user. Please Logout and Login again.");
      $('#loadingCover').hide();
    });
  }

  $rootScope.$on('$viewContentLoaded', function() {
    if (!loading) {
      $('#loadingCover').hide();
    }
  });

  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    // Update page title.
    $rootScope.pageTitle = nextRoute.title;

    // Redirect to the login page if not authenticated.
    if (nextRoute && nextRoute.access) {
      console.log((currentRoute ? currentRoute.originalPath : 'null') + ' -> ' + nextRoute.originalPath);

      var isAuthenticated = AuthenticationService.isAuthenticated();
      if (nextRoute.access.requiredAuthentication && !isAuthenticated) {
        $location.path("/login");
      } else if (isAuthenticated &&
          // A logged in user should not be going back to register/login.
          (nextRoute.originalPath === '/register' || nextRoute.originalPath === '/login')) {
        $location.path("/");
      } else if (isAuthenticated && nextRoute.access.requiredStorage && !UserDTO.hasStorage()) {
        $location.path("/storage");
      }
    }
  });
});

// The user.
angular.module('app').value('UserDTO', {
  user: null,
  hasStorage: function() {
    if (this.user) {
      var storage = this.user.get('storage');
      return storage && storage.name;
    }
    return false;
  }
});

// The tracker to edit.
angular.module('app').value('TrackerToEdit', {
  value: null
});

angular.module('app').controller('TestController', function($location, $scope, AlertService, DropboxService, UserDTO, Utils) {

  $scope.AlertService = AlertService;
  AlertService.clearAll();

  $scope.submit = function () {
    // Clear alerts;
    AlertService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

      UserDTO.user.set($scope.name, $scope.value);
      UserDTO.user.save(function(error, result) {
        if (error) {
          AlertService.error(error);
        } else {
          AlertService.info('User updated');
        }
      });

    }
  };

  $scope.submitDataSource = function () {
    // Clear alerts;
    AlertService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

      var dataSource = UserDTO.user.get('dataSource');
      dataSource.name = 'dropbox';
      dataSource[$scope.name] = $scope.value;
      UserDTO.user.save(function(error, result) {
        if (error) {
          AlertService.error(error);
        } else {
          AlertService.info('User updated');
        }
      });

    }
  };

  $scope.deleteDataSource = function () {
    // Clear alerts;
    AlertService.clearAll();
    $scope.submitted = true;

    if ($scope.form.$valid) {

      DropboxService.deleteDataSource($scope.recordId, function() {
        Utils.path('/', $scope);
      }, function(error) {
        AlertService.error(error);
      });

    }
  };

});
