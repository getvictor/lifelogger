/**
 * Controller for the home page.
 */
angular.module('app').controller('HomeController', function($scope, AlertService, DropboxService, Utils) {

  AlertService.clearAll();

  $scope.movesDays = {};

  var drawTimeline = function(records) {
    var DATE_FORMAT = "YYYYMMDDTHHmmssZ";
    var visData = [];
    angular.forEach(records, function(value) {
      var record = JSON.parse(value.get('data'));
      angular.forEach(record.segments, function(segment) {
        var item = {
          start: moment(segment.startTime, DATE_FORMAT).toDate(),
          end: moment(segment.endTime, DATE_FORMAT).toDate(),
          className: segment.type,
          type: 'range'
        };
        if (!visData.length || item.start >= visData[visData.length-1].end) {
          switch(segment.type) {
          case 'place':
            item.content = segment.place.name;
            item.title = segment.place.name;
            break;
          case 'move':
            item.content = 'move';
            item.title = 'move';
            break;
          default:
            item.content = segment.type;
            item.title = segment.type;
          }
          visData.push(item);
        }
      });
    });
    if (visData.length) {
      // Select start date 2 days before the last date
      var lastDate = visData[visData.length-1].end;
      var start = new Date(lastDate);
      start.setDate(start.getDate() - 2);
      new vis.Timeline($('#timeline')[0], new vis.DataSet(visData), {
        stack: false,
        start: start
      });
    }
  };

  DropboxService.getDataSources(function(dataSources) {
    $scope.dataSources = dataSources;
    angular.forEach(dataSources, function(value, key) {
      if (value.type === 'integration' && value.name === 'moves') {
        // Fetch moves data
        DropboxService.getData('moves_data', 'moves_data', function(records) {
          drawTimeline(records);
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
