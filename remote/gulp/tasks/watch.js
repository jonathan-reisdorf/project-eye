'use strict';

var gulp  = require('gulp'),
    paths = require('../config').paths;

gulp.task('styles:watch', function () {
    gulp.watch(paths.assets.styles, ['styles']);
});

gulp.task('scripts:watch', function () {
    gulp.watch(paths.assets.jshint, ['scripts']);
});

gulp.task('watch', ['styles:watch', 'scripts:watch']);