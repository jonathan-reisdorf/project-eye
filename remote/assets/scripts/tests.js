module.exports = ['$rootScope', '$resource', 'CommonServers', function($rootScope, $resource, CommonServers) {
  'use strict';
  var self = this;
  var testsResource = function() {
    return $resource('http://' + CommonServers.active + '/tests');
  };

  self.items = [];
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

    $rootScope.$emit('test:unselected', self.active);
    self.active = active;

    if (!self.active) {
      return;
    }

    $rootScope.$emit('test:selected', self.active);
  };

  $rootScope.$on('server:disconnected', function() {
    self.items = [];
    self.setActive();
  });

  $rootScope.$on('server:connected', function() {
    self.busy = true;
    self.items = testsResource().query();
    self.items.$promise.then(function() {
      self.busy = false;
      self.setActive();
    });

    CommonServers.fayeClient.subscribe('/server_messages', function() {});
  });

  self.add = function() {
    var config = {
      name : prompt('Please enter the test name:'),
      url : prompt('Please enter the test URL:'),
      description : prompt('Please enter the test description:'),
      intro : prompt('Please enter the test intro:')
    };
    if (!config.name || !config.url || !config.description || !config.intro) { return; }

    self.busy = true;
    testsResource().save({}, config, function() {
      self.items = testsResource().query();
      self.items.$promise.then(function() {
        self.busy = false;
      });
    });
  };

  return self;
}];