module.exports = ['$rootScope', '$resource', 'CommonServers', function($rootScope, $resource, CommonServers) {
  'use strict';
  var self = this,
    angular = require('angular');
    require('simpleheat');

  var heatmapsResource = function() {
    return $resource('http://' + CommonServers.active + '/users/:userId/heatmaps');
  };

  self.items = [];
  self.active = null;
  self.heat = null;

  self.config = {
    radius : 25,
    blur : 0
  };

  self.init = function() {
    self.heat = simpleheat('canvas');
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
    self.active.screen_width = 1920; // debug
    self.active.screen_height = 1080; // debug
    self.active.last_page_url = heatmapItem.url;

    self.heat.data(self.active.accumulated);
    self.heat.radius(+self.config.radius, +self.config.blur);
  };

  self.render = function() {
    console.time('draw');
    self.heat.draw();
    console.timeEnd('draw');
    self.animationFrame = null;
  };

  self.adjust = function() {
    self.heat.radius(+self.config.radius, +self.config.blur);
    self.animationFrame = self.animationFrame || window.requestAnimationFrame(self.render);
  };

  return self;
}];