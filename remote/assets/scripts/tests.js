module.exports = ['$rootScope', '$resource', 'CommonStorage', 'CommonServers', function($rootScope, $resource, CommonStorage, CommonServers) {
  'use strict';
  var self = this;
  var testsResource = function() {
    return $resource('http://' + CommonServers.active + '/tests');
  };
  var testsUsersResource = function(testId) {
    return $resource('http://' + CommonServers.active + '/tests/' + testId + '/users');
  };

  self.items = [];
  self.users = [];

  self.busy = false;

  self.setActive = function(id) {
    if (self.busy) {
      return;
    }

    var active = id || self.active || (self.items[0] || {})._id;
    if (active && !self.items.filter(function(item) {
      return item._id === active;
    }).length) {
      active = (self.items[0] || {})._id;
    }

    if (self.active === active) {
      return;
    }

    self.unsubscribe();
    self.active = active;

    if (!self.active) {
      return;
    }

    self.subscribe();
  };

  self.setActiveUser = function(id) {
    if (self.busy) {
      return;
    }

    console.log('selected user:', id);
  }

  $rootScope.$on('server:disconnected', function() {
    self.items = [];
    self.setActive();
  });

  $rootScope.$on('server:connected', function() {
    self.items = testsResource().query();
    self.items.$promise.then(function() {
      self.setActive();
    });

    CommonServers.fayeClient.subscribe('/server_messages', function() {});
  });

  self.add = function() {
    var name = prompt('Please enter the test name:');
    if (!name) { return; }

    var url = prompt('Please enter the test URL:');
    if (!url) { return; }

    testsResource().save({}, {
      name : name,
      url : url
    }, function() {
      self.items = testsResource().query();
    });
  };

  self.subscribe = function() {
    self.busy = true;
    CommonServers.fayeClient.subscribe('/tests/' + self.active + '/users', function(data) {
      // do sth
    });

    self.users = testsUsersResource(self.active).query();
    self.users.$promise.then(function() {
      self.busy = false;
    });
  };

  self.unsubscribe = function() {
    self.users = [];
    if (self.active) {
      CommonServers.fayeClient.unsubscribe('/tests/' + self.active + '/users');
    }
  };

  return self;
}];