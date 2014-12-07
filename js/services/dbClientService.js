angular.module('app').service('DBClientService', function() {

  var client;
  var openDatastores = {};

  this.setDropboxClient = function(dropboxClient) {
    client = dropboxClient;
  };

  this.isAuthenticated = function() {
    if (!client) return false;
    return client.isAuthenticated();
  }

  var openOrCreateDatastore = function(datastoreId, successCallback, errorCallback) {
    if (openDatastores[datastoreId]) {
      successCallback(openDatastores[datastoreId]);
    } else {
      var manager = client.getDatastoreManager();
      manager.openOrCreateDatastore(datastoreId, function(error, datastore) {
        if (error) {
          errorCallback({message: 'Could not open trackers datastore.'});
        } else {
          openDatastores[datastoreId] = datastore;
          successCallback(openDatastores[datastoreId]);
        }
      });
    }
  };

  this.saveTracker = function(tracker, successCallback, errorCallback) {
    var datastoreId = 'trackers';
    var writeRecord = function(datastore) {
      // TODO: Check for duplicate tracker name.
      try {
        var table = datastore.getTable('trackers');
        table.insert({
          name: tracker.name,
          valid: true
        });
        successCallback();
      } catch (err) {
        errorCallback(err);
      }
    };
    openOrCreateDatastore(datastoreId, writeRecord, errorCallback);
  };

  this.listTrackers = function(successCallback, errorCallback) {
    openOrCreateDatastore('trackers', function(datastore) {
      try {
        var table = datastore.getTable('trackers');
        var records = table.query({valid: true});
        var trackers = [];
        for (var i = 0; i < records.length; i++) {
          trackers[i] = records[i].getFields();
        }
        successCallback(trackers);
      } catch (err) {
        errorCallback(err);
      }

    }, errorCallback);
  };

  this.signOut = function(callback) {
    if (client) {
      client.signOut({mustInvalidate: true}, function(error) {
        if (error) {
          alert('SignOut Failure!');
        } else {
          console.log('SignOut successful');
          client = null;
          callback();
        }
      });
    } else {
      callback();
    }
  };

});
