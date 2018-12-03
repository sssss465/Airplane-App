var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["**/*.*"],
        browser: "google chrome",
        port: 3001,
    });
});

gulp.task('nodemon', function (cb) {
    nodemon({
      script: './bin/www'
    })
    .on('start', function () {
      cb();
    })
    .on('error', function(err) {
     // Make sure failure causes gulp to exit
     throw err;
   });
});