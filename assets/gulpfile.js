const gulp          = require('gulp');
const browserSync   = require('browser-sync').create();
const $             = require('gulp-load-plugins')();
const autoprefixer  = require('autoprefixer');
const fs            = require('fs')
const browsers      = JSON.parse(fs.readFileSync('./.browserslistrc'))
const gutil         = require('gulp-util');

const sassPaths = [
  'node_modules/foundation-sites/scss',
  'node_modules/motion-ui/src'
];

function sass() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths,
      outputStyle: 'compressed' // if css compressed **file size**
    })
      .on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer({ browsers: browsers.browserslist })
    ]))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
}

// Run jekyll build command.
function jekyll() {
  const shellCommand = 'cd .. && bundle exec jekyll build --disable-disk-cache --config _config.yml';
  return gulp.src('/', {allowEmpty: true})
      .pipe($.run(shellCommand))
      .on('error', gutil.log)
      .pipe(gulp.dest('assets'))
}

function serve() {
  browserSync.init({
    server: "../_site/"
  });

  gulp.watch('scss/**/*.scss', gulp.series([sass, jekyll]));
  gulp.watch(['../**/*.html', '!../_site/**/*.html'], gulp.series(jekyll)).on('change', browserSync.reload);
}

gulp.task('sass', sass);
gulp.task('serve', gulp.series('sass', serve));
gulp.task('default', gulp.series('sass', serve));
