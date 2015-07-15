module.exports = ['$rootScope', '$timeout', '$resource', 'CommonServers', 'CommonTests', function($rootScope, $timeout, $resource, CommonServers, CommonTests) {
  'use strict';
  var self = this,
    angular = require('angular');
  var usersResource = function(testId) {
    return $resource('http://' + CommonServers.active + '/tests/' + testId + '/users');
  };

  self.items = [];
  self.busy = false;

  self.setActive = function(id) {
    if (self.busy || !CommonTests.active) {
      return;
    }

    if (self.active) {
      CommonServers.fayeClient.unsubscribe('/tests/' + CommonTests.active + '/user/' + self.active);
    }

    self.active = id;
    self.events.onInit(id);
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

    self.items = usersResource(id).query();
    self.items.$promise.then(function() {
      self.busy = false;
    });

    CommonServers.fayeClient.subscribe('/tests/' + id + '/users', function(data) {
      if (data.added && !self.busy) {
        $timeout(function() {
          self.items.push(data.added);
        }, 0, true);
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

      CommonServers.fayeClient.subscribe('/tests/' + CommonTests.active + '/user/' + user._id, function(data) {
        console.log('received data!', data);
      });

      console.log(user);
      self.dataRunning = angular.copy(user);
    },
    onFinishedTest : function(testId, user) {
      if (!user) { return; }

      self.dataRunning = null;
      // show heatmap
    }
  };

  return self;
}];