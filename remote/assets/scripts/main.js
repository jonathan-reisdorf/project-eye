var angular = require('angular');
require('angular-resource');
var application = angular.module('application', ['ngResource']);

require('./directives')(application);
require('./filters')(application);

application
  .factory('CommonStorage', require('./storage'))
  .factory('CommonServers', require('./servers'))
  .factory('CommonTests', require('./tests'))
  .factory('CommonUsers', require('./users'))
  .controller('AppCtrl', require('./app'));
