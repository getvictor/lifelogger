/**
 * Controller for the Moves redirect page.
 */
angular.module('app').controller('MovesRedirectUriController', function($http, $location, $scope,
    AlertService, DropboxService, OPTS, UserDTO, Utils) {

  AlertService.clearAll();

  $scope.status = 'Connecting to Moves ...';

  var movesCode = $location.$$search.code;
  var movesToken;

  var addMoves = function() {
    $scope.status = 'Fetching Moves data (could take a while) ...';
    movesToken.name = 'moves';
    movesToken.valid = true;
    movesToken.type = 'integration';
    DropboxService.saveDataSource(movesToken, function() {
      // empty
    }, function(error) {
      AlertService.error('Could not save Moves data.');
    });
    var dropboxCredentials = UserDTO.user.get('storage').credentials;
    $http.post(OPTS.BACKEND_NORMALIZE + '/moves/getAll', {
      movesToken: movesToken.access_token,
      dropboxToken: dropboxCredentials.token,
      dropboxUid: dropboxCredentials.uid
    }).success(function(data) {
      $location.path('/');
      $location.url($location.path());
      Utils.apply($scope);
    }).error(function(data, status) {
      AlertService.error('Could not fetch Moves data.');
    });
  };

  $http.post(OPTS.BACKEND_NORMALIZE + '/moves/getToken', {
    code: movesCode,
    redirectUri: OPTS.MOVES_REDIRECT_URI
  }).success(function(data) {
    movesToken = data;
    addMoves();
  }).error(function(data, status) {
    AlertService.error('Could not connect to Moves.');
  });


});
