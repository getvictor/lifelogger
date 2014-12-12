angular.module('app', [ 'ngRoute', 'ui.bootstrap', 'ui.validate']);

angular.module('app').constant('OPTS', {
  TIMEOUT: 30000,
  DROPBOX_APP_KEY: 'maqecjch0jcdmev',
  APIGEE_ORG_NAME: 'victoreda',
  APIGEE_APP_NAME: 'lifelogger',
  USER_PROXY: 'https://victoreda-prod.apigee.net/lifelogger-user'
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
  // Go to home page.
  otherwise({
    redirectTo : '/'
  });
});

angular.module('app').run(function($rootScope, $location, $window, AuthenticationService, ApigeeClient, UserDTO) {
  $rootScope.APP_TITLE = APP_TITLE;

  // Load user if authenticated
  if (AuthenticationService.isAuthenticated()) {
    ApigeeClient.getUser(function() {}, function(error) {
      alert("Could not load user. Please Logout and Login again.");
    });
  }

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

angular.module('app').controller('TestController', function($scope, AlertService, UserDTO) {

  $scope.AlertService = AlertService;
  AlertService.clearAll();

  $scope.submit = function register() {
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

  $scope.submitDataSource = function register() {
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

});
