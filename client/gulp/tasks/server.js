'use strict';

var gulp = require('gulp'),
    config = require('../config');

gulp.task('server', function() {
    var connect  = require('gulp-connect'),
      modRewrite = require('connect-modrewrite');

    var server = connect.server({
        port : config.serverPort,
        root : config.paths.public.root,
        middleware : function() {
          return [
            modRewrite([
              '^/test/.*$ /test.html [L]'
            ])
          ];
        }
    });

    return server;
});