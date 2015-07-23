module.exports = ['$rootScope', '$timeout', '$resource', 'CommonServers', function($rootScope, $timeout, $resource, CommonServers) {
  'use strict';
  var self = this,
    angular = require('angular');
    require('simpleheat');

  var heatmapsResource = function() {
    return $resource('http://' + CommonServers.active + '/users/:userId/heatmaps');
  };

  self.items = [];
  self.active = null;

  self.config = {
    radius : 25,
    blur : 10
  };

  self.init = function() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    self.unload();
  };

  self.unload = function() {
    self.items = [];
    self.active = null;
  };

  self.load = function(userId) {
    self.busy = true;
    self.items = heatmapsResource().query({ userId : userId });
    self.items.$promise.then(function(data) {
      self.select(data[0]);
      self.busy = false;
    });
  };

  self.select = function(heatmapItem) {
    if (!heatmapItem) {
      heatmapItem = self.active;
    } else {
      self.active = heatmapItem;
    }

    self.active = heatmapItem;
    self.active.last_page_url = heatmapItem.url;
  };

  self.toggleReplay = function() {
    if (!self.active) { return; }

    self.active.eye = !self.active.eye;
    var history = angular.copy(self.active.history);

    var renderPoint = function() {
      if (!self.active.eye || !history) { return; }
      self.active.eye = history.shift();

      if (history[0]) {
        $timeout(renderPoint, history[0][2], true);
      } else {
        $timeout(function() {
          self.active.eye = false;
        }, 30, true);
      }
    };

    $timeout(renderPoint, 0, true);
  };

  return self;
}];