'use strict';

var gulp = require('gulp'),
    paths = require('../config').paths;

gulp.task('copy', function() {
    var path       = require('path');

    return gulp.src(paths.assets.copy, { base : path.join(process.cwd(), paths.assets.root + 'templates') })
        .pipe(gulp.dest(paths.public.root));
});