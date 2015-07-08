var angular = require('angular');
var application = angular.module('application', []);

require('./directives')(application);

application
  .factory('CommonStorage', require('./storage'))
  .factory('CommonServers', require('./servers'))
  .controller('AppCtrl', require('./app'));
