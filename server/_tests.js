module.exports = function(control) {
  'use strict';
  var db = require('./_db');
  db.generic('tests', control.server);
  db.generic('users', control.server);
};