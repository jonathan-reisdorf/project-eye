module.exports = ['CommonServers', 'CommonTests', 'CommonUsers', function(CommonServers, CommonTests, CommonUsers) {
  'use strict';
  var self = this;

  self.servers = CommonServers;
  self.tests = CommonTests;
  self.users = CommonUsers;
}];