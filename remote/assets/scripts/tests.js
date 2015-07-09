module.exports = ['$rootScope', '$resource', 'CommonStorage', function($scope, $resource, CommonStorage) {
  'use strict';
  var self = this;
  var resource = $resource('http://localhost:7777/tests');

  self.items = [];

  self.setActive = function(id) {
    var active = id || self.active || (self.items[0] || {})._id;
    if (active && !self.items.filter(function(item) {
      return item._id === active;
    }).length) {
      active = (self.items[0] || {})._id;
    }

    if (self.active === active) {
      return;
    }

    self.active = active;

    if (!self.active) {
      return;
    }

    // now: do sth
  };

  self.init = function(client) {
    self.items = resource.query();
    self.items.$promise.then(function() {
      self.setActive();
    });

    client.subscribe('/eye_position', function(data) {
      // do sth
    });
  };

  self.add = function() {
    var name = prompt('Please enter the test name:');
    if (!name) { return; }

    var url = prompt('Please enter the test URL:');
    if (!url) { return; }

    resource.save({}, {
      name : name,
      url : url
    }, function() {
      self.items = resource.query();
    });
  };

  return self;
}];