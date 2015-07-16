module.exports = ['$rootScope', '$resource', 'CommonServers', function($rootScope, $resource, CommonServers) {
  'use strict';
  var self = this,
    angular = require('angular'),
    simpleheat = require('simpleheat');

  var heatmapsResource = function() {
    return $resource('http://' + CommonServers.active + '/users/:userId/heatmaps');
  };

  self.items = [];

  self.init = function() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    self.items = [];
  };

  self.unload = function() {
    self.items = [];
  };

  self.load = function(userId) {
    self.busy = true;
    self.items = heatmapsResource().query({ userId : userId });
    self.items.$promise.then(function(data) {
      self.busy = false;
    });
  };

  return self;
}];