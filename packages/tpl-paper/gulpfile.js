/**
 * Learned from https://www.typescriptlang.org/docs/handbook/gulp.html
 */

const gulp = require('gulp'),
  less = require('gulp-less'),
  path = require('path'),
  sh = require('shelljs'),
  fs = require('fs-extra');

const json = require('./package.json');
json.main = 'mandoc.config.js';
delete json.scripts;
delete json.files;
delete json.directories;

function distDir(dir) {
  return path.resolve('./dist', dir || '');
}

gulp.task('less-files', function () {
  return gulp.src(path.resolve('./source', 'style.less'))
    .pipe(less({
      paths: [path.join(path.resolve('./source'))]
    }))
    .pipe(gulp.dest(distDir('source')));
});

gulp.task('js-files', function () {
  return gulp.src(path.resolve('./source', '**/*.js'))
    .pipe(gulp.dest(distDir('source')));
});

gulp.task('layout-dir', function () {
  return gulp.src('./layout/**/*.njk')
    .pipe(gulp.dest(distDir('layout')));
});

gulp.task('package.json', function (done) {
  fs.writeJson(distDir('package.json'), json, {
    spaces: 2,
  }).then(done);
});

gulp.task('mandoc.config.js', function () {
  return gulp.src('./mandoc.config.js')
    .pipe(gulp.dest(distDir()));
});

gulp.task('build', gulp.series(function (done) {
  sh.rm('-rf', './dist');
  done();
}, 'mandoc.config.js',
  'package.json',
  'layout-dir',
  'js-files',
  'less-files'));
