angular.module('dropbox', []);

angular.module('dropbox').constant('DROPBOX_OPTS', {
  AUTH_URL: 'dropbox_oauth_receiver.html',
  APP_KEY: 'maqecjch0jcdmev'
});

angular.module('dropbox').service('DropboxService', function($window, DROPBOX_OPTS) {

  var client;
  var openDatastores = {};
  var dataSources = [];

  var openOrCreateDatastore = function(datastoreId, successCallback, errorCallback) {
    if (openDatastores[datastoreId]) {
      successCallback(openDatastores[datastoreId]);
    } else {
      var manager = client.getDatastoreManager();
      manager.openOrCreateDatastore(datastoreId, function(error, datastore) {
        if (error) {
          errorCallback({message: 'Could not open ' + datastoreId + ' datastore.'});
        } else {
          openDatastores[datastoreId] = datastore;
          successCallback(openDatastores[datastoreId]);
        }
      });
    }
  };

  this.getClient = function() {
    if (client) return client;
    client = new Dropbox.Client({key: DROPBOX_OPTS.APP_KEY});
    client.authDriver(new Dropbox.AuthDriver.Popup({
      receiverUrl: $window.location.origin + $window.location.pathname + DROPBOX_OPTS.AUTH_URL
    }));
  };

  this.setClient = function(credentials) {
    client = new Dropbox.Client({
      key: DROPBOX_OPTS.APP_KEY,
      token: credentials.token,
      uid: credentials.uid
    });
  }

  this.login = function(successCallback, errorCallback) {
    var updateDropboxAuthenticationStatus = function(error, client) {
      if (error) {
        errorCallback(error);
      }
      if (client.isAuthenticated()) {
        successCallback();
      }
    };
    client.authenticate({interactive: true}, updateDropboxAuthenticationStatus);
  };

  this.logout = function() {
    if (client) client.reset();
  };

  this.getCredentials = function() { return client.credentials(); }

  this.getDataSources = function(successCallback, errorCallback) {
    openOrCreateDatastore('data_sources', function(datastore) {
      try {
        var table = datastore.getTable('data_sources');
        var records = table.query({valid: true});
        // Empty existing Data Sources
        while(dataSources.length > 0) {
          dataSources.pop();
        }
        for (var i = 0; i < records.length; i++) {
          dataSources[i] = records[i].getFields();
        }
        successCallback(dataSources);
      } catch (err) {
        errorCallback(err);
      }
    }, errorCallback);
  };

  this.saveTracker = function(tracker, successCallback, errorCallback) {
    var datastoreId = 'data_sources';
    var writeRecord = function(datastore) {
      // TODO: Check for duplicate tracker name.
      try {
        var table = datastore.getTable('data_sources');
        table.insert({
          name: tracker.name,
          valid: true
        });
        successCallback();
      } catch (error) {
        errorCallback(error);
      }
    };
    openOrCreateDatastore(datastoreId, writeRecord, errorCallback);
  };

  this.saveDataSource = function(dataSource, successCallback, errorCallback) {
    var datastoreId = 'data_sources';
    var writeRecord = function(datastore) {
      try {
        var table = datastore.getTable('data_sources');
        // Check if record already exists
        var records = table.query({name: dataSource.name});
        if (records.length) {
          records[0].update(dataSource);
        } else {
          table.insert(dataSource);
        }
        successCallback();
      } catch (error) {
        errorCallback(error);
      }
    };
    openOrCreateDatastore(datastoreId, writeRecord, errorCallback);
  };

  this.deleteDataSource = function(recordId, successCallback, errorCallback) {
    var datastoreId = 'data_sources';
    var writeRecord = function(datastore) {
      try {
        var table = datastore.getTable('data_sources');
        var record = table.get(recordId);
        record.deleteRecord();
        successCallback();
      } catch (error) {
        errorCallback(error);
      }
    };
    openOrCreateDatastore(datastoreId, writeRecord, errorCallback);
  };

});
