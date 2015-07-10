'use strict';

var gulp = require('gulp'),
    paths = require('../config').paths;

gulp.task('server', function() {
    var connect = require('gulp-connect');

    return connect.server({
        port : 7778,
        root : paths.public.root
    });
});