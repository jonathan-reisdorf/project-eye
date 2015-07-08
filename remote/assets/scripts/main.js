var angular = require('angular');
var application = angular.module('application', []);
application
  .factory('CommonStorage', require('./storage'))
  .factory('CommonServers', require('./servers'))
  .controller('AppCtrl', require('./app'));
