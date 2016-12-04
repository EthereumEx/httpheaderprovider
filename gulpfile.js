var gulp = require('gulp');
var mocha = require('gulp-mocha');
var minify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('test', function() {
  return gulp.src(['test/test-*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    }));
});
