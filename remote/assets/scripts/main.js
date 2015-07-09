var angular = require('angular');
var application = angular.module('application', []);

require('./directives')(application);

application
  .factory('CommonStorage', require('./storage'))
  .factory('CommonServers', require('./servers'))
  .factory('CommonTests', require('./tests'))
  .controller('AppCtrl', require('./app'));
