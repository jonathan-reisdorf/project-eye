'use strict';

var gulp = require('gulp'),
    config = require('../config');

gulp.task('browser', function() {
  return require('node-thrust')(function(err, api) { 
    var window = api.window({ root_url: 'http://localhost:' + config.serverPort });
    window.show(function() {
      // @todo: inject client_userscript code
      // @todo: remove iframe fullscreen request from frontend and add sth else there
    });

    window.move(config.showBrowserOnSecondaryScreen ? 4000 : 0, 0);
    window.set_kiosk(true);
  });
});