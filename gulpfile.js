'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var livereload = require('gulp-livereload');
var html2js = require('gulp-ng-html2js');
var concat = require('gulp-concat');

/*
	A more sophisticated browserify build & watch
	https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
 */

// add custom browserify options here
var customOpts = {
  background: {
    entries: ['./src/scripts/background.js'],
    debug: true,
    dest: { fileName: 'background.js', path: './dist/scripts' }
  },
  popup: {
    entries: ['./src/scripts/popup.js'],
    debug: true,
    dest: { fileName: 'popup.js', path: './dist/scripts/' }
  },
  content: {
    entries: ['./src/scripts/content.js'],
    debug: true,
    dest: { fileName: 'content.js', path: './dist/scripts' }
  }
};

function bundle(bundler, options) {
  options = options || {};
  return bundler.bundle()
    // log errors if they happen
    .on('error', util.log.bind(util, 'Browserify Error'))
    .pipe(source(options.fileName))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(options.path))
    .pipe(livereload());
}

// you can run `gulp js` to build the file
gulp.task('js:background', function(){
  var opts = assign({}, browserify.args, customOpts.background);
  var b = browserify(opts);
  // add transformations here
  // i.e. b.transform(coffeeify);
  return bundle(b, customOpts.background.dest);
});

gulp.task('js:popup', function(){
  var opts = assign({}, browserify.args, customOpts.popup);
  var b = browserify(opts);
  // add transformations here
  // i.e. b.transform(coffeeify);
  return bundle(b, customOpts.popup.dest);
});

gulp.task('js:content', function(){
  var opts = assign({}, browserify.args, customOpts.content);
  var b = browserify(opts);
  // add transformations here
  // i.e. b.transform(coffeeify);
  return bundle(b, customOpts.content.dest);
});

gulp.task('watchify:background', function(){
  var opts = assign({}, watchify.args, customOpts.background);
  var b = watchify(browserify(opts));

  // add transformations here
  // i.e. b.transform(coffeeify);

  b.on('update', bundle.bind(null, b, customOpts.background.dest)); // on any dep update, runs the bundler
  b.on('log', util.log); // output build logs to terminal

  return bundle(b, customOpts.background.dest);
});

gulp.task('watchify:popup', function(){
  var opts = assign({}, watchify.args, customOpts.popup);
  var b = watchify(browserify(opts));

  // add transformations here
  // i.e. b.transform(coffeeify);

  b.on('update', bundle.bind(null, b, customOpts.popup.dest)); // on any dep update, runs the bundler
  b.on('log', util.log); // output build logs to terminal

  return bundle(b, customOpts.popup.dest);
});

gulp.task('watchify:content', function(){
  var opts = assign({}, watchify.args, customOpts.content);
  var b = watchify(browserify(opts));

  // add transformations here
  // i.e. b.transform(coffeeify);

  b.on('update', bundle.bind(null, b, customOpts.content.dest)); // on any dep update, runs the bundler
  b.on('log', util.log); // output build logs to terminal

  return bundle(b, customOpts.content.dest);
});

var assets = [
  './src/assets/**/*.*',
  './src/scripts/**/*.html'
];
gulp.task('assets', function(){
  gulp.src(assets)
		.pipe(gulp.dest('./dist/assets'))
    .pipe(livereload());
});

var html = ['./src/assets/**/*.html', '!./src/assets/popup.html'];
gulp.task('html', function(){
  gulp.src(html)
      .pipe(html2js({
          moduleName: "adpure.tpls"
      }))
      .pipe(concat("adpure-templates.js"))
      .pipe(gulp.dest("./dist/scripts"))
      .pipe(livereload());

});

gulp.task('manifest', function(){
  gulp.src([
    './src/manifest.json'
    ])
		.pipe(gulp.dest('./dist'))
    .pipe(livereload());
});

gulp.task('clean', function(done) {
  del(['./dist'], done);
});

gulp.task('watch', ['watchify:popup', 'watchify:content', 'watchify:background'], function() {
    livereload.listen({
      port: process.env.LIVERELOAD_PORT || 35729
    });
    gulp.watch('./src/manifest.json', ['manifest']);
    gulp.watch(assets, ['assets']);
    gulp.watch(html, ['html']);
});


gulp.task('build', ['js:popup', 'js:content', 'js:background', 'html', 'assets', 'manifest']);

gulp.task('default', ['watch']);
