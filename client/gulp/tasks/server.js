'use strict';

var gulp = require('gulp'),
    paths = require('../config').paths;

gulp.task('server', function() {
    var connect  = require('gulp-connect'),
      modRewrite = require('connect-modrewrite');

    var server = connect.server({
        port : 7778,
        root : paths.public.root,
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