angular.module('app', [ 'ngRoute', 'ui.bootstrap', 'ui.validate']);

angular.module('app').constant('OPTS', {
  TIMEOUT: 30000,
  DROPBOX_APP_KEY: 'maqecjch0jcdmev'
});

// Configure routes.
angular.module('app').config(function($routeProvider) {
  $routeProvider.
  // Login user.
  when('/login', {
    templateUrl : 'views/login.html',
    controller : 'LoginController',
    access : { requiredAuthentication: false },
    title : 'Login'
  }).
  // Show home page.
  when('/', {
    templateUrl : 'views/home.html',
    controller : 'HomeController',
    access : { requiredAuthentication: true },
    title : 'Home'
  }).
  // Add tracker.
  when('/addTracker', {
    redirectTo : '/editTracker'
  }).
  // Edit tracker
  when('/editTracker', {
    templateUrl : 'views/editTracker.html',
    controller : 'EditTrackerController',
    access : { requiredAuthentication: true },
    title : 'Edit Tracker'
  }).
  // Go to home page.
  otherwise({
    redirectTo : '/'
  });
});

angular.module('app').run(function($rootScope, $location, $window, AuthenticationService) {
  $rootScope.APP_TITLE = APP_TITLE;

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
      }
    }
  });
});

// The tracker to edit.
angular.module('app').value('TrackerToEdit', {
  value: null
});
