module.exports = ['$rootScope', '$timeout', '$resource', 'CommonServers', 'CommonTests', 'CommonHeatmaps', function($rootScope, $timeout, $resource, CommonServers, CommonTests, CommonHeatmaps) {
  'use strict';
  var self = this,
    angular = require('angular');

  var usersResource = function() {
    return $resource('http://' + CommonServers.active + '/tests/:testId/users');
  };
  var userResource = function() {
    return $resource('http://' + CommonServers.active + '/users/:userId');
  };

  self.items = [];
  self.busy = false;

  self.setActive = function(user) {
    if (self.busy || user.busy || !CommonTests.active) {
      return;
    }

    if (self.active) {
      CommonServers.fayeClient.unsubscribe('/tests/' + CommonTests.active + '/user/' + self.active);
    }

    self.active = user._id;
    self.events.onInit(user._id);
  };

  $rootScope.$on('server:disconnected', function() {
    self.items = [];
    self.setActive();
  });

  $rootScope.$on('server:connected', function() {
    // nothing yet
  });

  $rootScope.$on('test:selected', function(e, id) {
    self.busy = true;

    self.items = usersResource().query({ testId : id });
    self.items.$promise.then(function() {
      self.busy = false;
    });

    CommonServers.fayeClient.subscribe('/tests/' + id + '/users', function(data) {
      if (data.added && !self.busy) {
        $timeout(function() {
          self.items.push(data.added);
        }, 0, true);
      }

      if (data.changed && data.changed !== self.active && !self.busy) {
        var userReference = self.items.filter(function(userItem) {
          return userItem._id === data.changed;
        })[0];

        if (!userReference) { return; }
        $timeout(function() {
          userReference.busy = true;
        }, 0, true);

        $timeout(function() {
          userResource().get({ userId : data.changed }, function(userData) {
            angular.extend(userReference, userData, { busy : false });
          });
        }, 500, false);
      }
    });
  });

  $rootScope.$on('test:unselected', function(e, id) {
    self.items = [];

    if (!id) {
      return;
    }

    CommonServers.fayeClient.unsubscribe('/tests/' + id + '/users');
    if (self.active) {
      CommonServers.fayeClient.unsubscribe('/tests/' + id + '/user/' + self.active);
    }
  });

  self.events = {
    onInit : function(id) {
      var currentUser = self.items.filter(function(item) {
        return item._id === id;
      })[0];

      if (currentUser.is_running) {
        self.events.onRunningTest(CommonTests.active, currentUser);
      } else {
        self.events.onFinishedTest(CommonTests.active, currentUser);
      }
    },
    onRunningTest : function(testId, user) {
      if (!user) { return; }

      self.dataRunning = user;
      CommonHeatmaps.unload();

      CommonServers.fayeClient.subscribe('/tests/' + CommonTests.active + '/user/' + user._id, function(data) {
        if (data && data.db) {
          $timeout(function() {
            angular.extend(self.dataRunning, data.db);
          }, 0, true);
        }

        if (data && typeof data.eye !== 'undefined') {
          $timeout(function() {
            self.dataRunning.eye = data.eye;
          }, 0, true);
        }
      });
    },
    onFinishedTest : function(testId, user) {
      if (!user) { return; }

      self.dataRunning = null;

      CommonHeatmaps.init();
      CommonHeatmaps.load(user._id);
    }
  };

  return self;
}];