module.exports = ['$rootScope', '$resource', 'CommonServers', function($rootScope, $resource, CommonServers) {
  'use strict';
  var self = this;
  var testsResource = function() {
    return $resource('http://' + CommonServers.active + '/tests');
  };
  var testResource = function() {
    return $resource('http://' + CommonServers.active + '/tests/:test_id', { test_id : '@_id' }, {
      update : { method : 'PUT' }
    });
  };

  self.items = [];
  self.busy = false;
  self.editing = false;

  self.setActive = function(id) {
    if (self.busy) {
      return;
    }

    self.editing = false;

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

  self.edit = function(test) {
    self.active = false;
    self.editing = angular.copy(test) || {
      type : 'website'
    };
  };

  self.save = function(test) {
    self.busy = true;
    var isNew = !test._id;
    (isNew ? testsResource() : testResource())[isNew ? 'save' : 'update']({}, test, function() {
      self.items = testsResource().query();
      self.items.$promise.then(function() {
        self.editing = false;
        self.busy = false;
      });
    });
  };

  return self;
}];