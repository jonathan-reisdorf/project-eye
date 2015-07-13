module.exports = function(control) {
  'use strict';
  var db = require('./_db');

  // SCHEMA: _id, name, url, description, intro
  db.generic('tests', control.server);

  // SCHEMA: _id, name, test_id, is_running, last_page_url
  var userDbMethods = db.generic('users', control.server);
  control.server.get('/tests/:test_id/users', userDbMethods.findBy);
};