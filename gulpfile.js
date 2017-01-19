var gulp = require('gulp'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    imagemin = require('gulp-imagemin'),
    uglifyCss = require('gulp-uglifycss'),
    del = require('del'),
    runSequence = require('run-sequence'),
    Dgeni = require('dgeni');

gulp.task('clean', function() {
  return del([
    'dist/**/*'
  ]);
});

gulp.task('dgeni', function() {
  try {
    var dgeni = new Dgeni([require('./docs/dgeni-conf')]);
    return dgeni.generate();
  } catch(error) {
    console.log(error.stack);
    throw error;
  }
});

gulp.task('build-lib', function() {
  return gulp.src('bower_components/**/*')
    .pipe(gulp.dest('dist/bower_components'));
})

gulp.task('build-root', function() {
  return gulp.src(['app/index.html', 'app/goryd-logo.svg','app/goryd-favicon.png'])
    .pipe(gulp.dest('dist'));
});

gulp.task('build-images', function() {
  return gulp.src(['app/assets/images/**', 'app/assets/icons/**'])
    .pipe(gulp.dest('dist/images'));
});

gulp.task('build-fonts', function () {
  return gulp.src('app/assets/fonts/**')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build-templates', function () {
  return gulp.src('app/templates/*.html')
    .pipe(gulp.dest('dist/templates/'));
});

gulp.task('build-js', function() {
  return gulp.src(['!app/js/svg-assets-cache.js','!app/js/accounts.js','!app/js/myListing.js','!app/js/filters.js','!app/js/services.js','!app/js/fb.js', '!app/js/directive.wizard.js','!app/js/controller.home.list.js','!app/js/controller.home.list.rightAside.js','app/js/*.js'])
    // .pipe(uglify())
    .pipe(concat('goryd.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build-main-js', function() {
  return gulp.src(['app/main.js', 'app/js/svg-assets-cache.js','app/js/accounts.js','app/js/myListing.js','app/js/filters.js','app/js/services.js','app/js/fb.js','app/js/directive.wizard.js','app/js/controller.home.list.js','app/js/controller.home.list.rightAside.js',])
  // .pipe(minify())
  .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build-css', function() {
  return gulp.src('app/**/*.css')
    // .pipe(uglifyCss())
    .pipe(concat('goryd.min.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('build', function() {
  return runSequence(['build-root', 'build-main-js', 'build-js', 'build-css', 'build-templates'], 'jshint');
});

gulp.task('watch-js', function() {
  gulp.watch('app/**/*.js', ['build']);
});

gulp.task('watch-img', function() {
  gulp.watch('app/assets/images/**', ['build-images','build']);
});

gulp.task('watch-css', function() {
  gulp.watch('app/css/*.css', ['build']);
});

gulp.task('watch-html', function() {
  gulp.watch('app/**/*.html', ['build']);
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 8005,
    host: '0.0.0.0'
  });
});

gulp.task('jshint', function() {
  return gulp.src('app/**/*js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// default task
gulp.task('default', function() {
  return runSequence('clean', 'build', 'build-fonts', 'build-images', 'build-lib',
    ['watch-js', 'watch-css', 'watch-html', 'watch-img','connect']
  );
});

// task to run in production
gulp.task('build-prod', function() {
  return runSequence('clean', 'build-root', 'build-main-js', 'build-js', 'build-css', 'build-templates', 'build-fonts', 'build-images', 'build-lib');
});
