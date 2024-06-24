const gulp = require('gulp');
const gulp_zip = require('gulp-zip');
const pconf = require('./package.json');

const conf = {
  firefox: {
    build: 'build/firefox/',
    debug: 'debug/firefox/',
  },
  chrome: {
    build: 'build/chrome/',
    debug: 'debug/chrome/',
  }
};

// snakk om quick'n'dirty shit

function chromeDebug() {
  return gulp.src(['src/chrome/**', 'src/common/**', 'src/manifest.json'])
    .pipe(gulp.dest(conf.chrome.debug));
}
function chromeBuild() {
  return gulp.src(['src/chrome/**', 'src/common/**', 'src/manifest.json'])
    .pipe(gulp.dest(conf.chrome.build + 'tmp'))
    .pipe(gulp_zip('chrome-' + pconf.version + '.zip'))
    .pipe(gulp.dest(conf.chrome.build));
}

function firefoxDebug() {
  return gulp.src(['src/firefox/**', 'src/common/**', 'src/manifest.json'])
    .pipe(gulp.dest(conf.firefox.debug));
}
function firefoxBuild() {
  return gulp.src(['src/firefox/**', 'src/common/**', 'src/manifest.json'])
    .pipe(gulp.dest(conf.firefox.build + 'tmp'))
    .pipe(gulp_zip('firefox-' + pconf.version + '.zip'))
    .pipe(gulp.dest(conf.firefox.build));
}

function debugWatch() {
  gulp.watch('src/**', gulp.series(chromeDebug, firefoxDebug));
}

const build = gulp.parallel(chromeBuild, firefoxBuild);
const debug = gulp.parallel(chromeDebug, firefoxDebug);
const watch = gulp.series(debug, debugWatch);

exports.build = build;
exports.debug = debug;
exports.watch = watch;
exports.default = build;
