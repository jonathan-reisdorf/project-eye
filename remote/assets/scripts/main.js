var angular = require('angular');
require('angular-resource');
var application = angular.module('application', ['ngResource']);

require('./directives')(application);

application
  .factory('CommonStorage', require('./storage'))
  .factory('CommonServers', require('./servers'))
  .factory('CommonTests', require('./tests'))
  .controller('AppCtrl', require('./app'));
