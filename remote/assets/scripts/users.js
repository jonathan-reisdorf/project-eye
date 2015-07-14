module.exports = ['$rootScope', '$resource', 'CommonServers', 'CommonTests', function($rootScope, $resource, CommonServers, CommonTests) {
  'use strict';
  var self = this;
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

    CommonServers.fayeClient.subscribe('/tests/' + CommonTests.active + '/user/' + self.active, function(data) {
      console.log('received data!', data);
    });

    console.log('selected user:', id);
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
      // do sth
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

  return self;
}];