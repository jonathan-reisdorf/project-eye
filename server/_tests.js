module.exports = function(control) {
  'use strict';
  var db = require('./_db');

  // SCHEMA: _id, name, url, description, intro
  var testsDbMethods = db.generic('tests', control.server);

  // SCHEMA: _id, name, test_id, is_running, last_page_url, screen_width, screen_height
  var usersDbMethods = db.generic('users', control.server);
  control.server.get('/tests/:test_id/users', usersDbMethods.findBy);

  // SCHEMA: _id, user_id, url, accumulated, history, screen_width, screen_height
  var heatmapsDbMethods = db.generic('heatmaps', control.server);
  control.server.get('/users/:user_id/heatmaps', heatmapsDbMethods.findBy);

  return {
    testsDb : testsDbMethods,
    usersDb : usersDbMethods,
    heatmapsDb : heatmapsDbMethods
  };
};