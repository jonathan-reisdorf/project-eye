module.exports = ['CommonServers', 'CommonTests', 'CommonUsers', 'CommonHeatmaps', function(CommonServers, CommonTests, CommonUsers, CommonHeatmaps) {
  'use strict';
  var self = this;

  self.servers = CommonServers;
  self.tests = CommonTests;
  self.users = CommonUsers;
  self.heatmaps = CommonHeatmaps;
}];