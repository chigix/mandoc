/**
 * Learned from https://www.typescriptlang.org/docs/handbook/gulp.html
 */

const gulp = require('gulp'),
  ts = require('gulp-typescript'),
  rename = require('gulp-rename'),
  path = require('path'),
  sh = require('shelljs'),
  fs = require('fs-extra');

const json = require('./package.json');
delete json.scripts;
delete json.files;
delete json.directories;
json.main = './index.js';
json.module = './_esm5.index.js';
json.es2015 = './_esm2015.index.js';

function distDir(dir) {
  return path.resolve('./dist', dir || '');
}

gulp.task('ts-compiling', gulp.series(
  _ => gulp.src('src/index.ts')
    .pipe(ts.createProject({
      extends: "../../tsconfig.base.json",
      compilerOptions: {
        module: "commonjs",
        target: "es5",
        sourceMap: false,
      },
    })()).pipe(gulp.dest(distDir())),
  _ => gulp.src('src/index.ts')
    .pipe(ts.createProject({
      extends: "../../tsconfig.base.json",
      compilerOptions: {
        module: "es2015",
        target: "es5",
        moduleResolution: "node",
        sourceMap: false,
      },
    })()).pipe(rename('_esm5.index.js')).pipe(gulp.dest(distDir())),
  _ => gulp.src('src/index.ts')
    .pipe(ts.createProject({
      extends: "../../tsconfig.base.json",
      compilerOptions: {
        module: "es2015",
        target: "es2015",
        moduleResolution: "node",
        sourceMap: false,
      },
    })()).pipe(rename('_esm2015.index.js')).pipe(gulp.dest(distDir())),
));

gulp.task('docs', function () {
  gulp.src('../../LICENSE').pipe(gulp.dest(distDir()));
  return gulp.src('*.md')
    .pipe(gulp.dest(distDir()));
});

gulp.task('package.json', function (done) {
  fs.writeJson(distDir('package.json'), json, {
    spaces: 2,
  }).then(done);
});

gulp.task('build', gulp.series(function (done) {
  sh.rm('-rf', './dist');
  done();
}, 'ts-compiling',
  'package.json',
  'docs'));
