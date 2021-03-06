/*------------------------------------------------------------------------------*/
/* Dependencies
/*------------------------------------------------------------------------------*/

var gulp           = require('gulp'),
    $              = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'], replaceString: /\bgulp[\-.]/}),
    argv           = require('yargs').argv,
    browserSync    = require('browser-sync'),
    runSequence    = require('run-sequence')
;

/*------------------------------------------------------------------------------*/
/* File Destinations
/*------------------------------------------------------------------------------*/

var paths = {
  'root'           : './',
  'vhost'          : 'wct2015.dev',
  'port'           : 3000,
// html
  'htmlDest'       : 'src/html/',
// images
  'imageDest'      : 'files/',
  'imagePath'      : 'src/images/',
// jade
  'jadePath'       : 'src/jade/',
// scss
  'scssPath'       : 'src/scss/',
// css
  'cssDest'        : './'
};

var gulpSassConf = {
  includePaths   : [],
  outputStyle    : 'expanded'
};

/*------------------------------------------------------------------------------*/
/* Initializing bower_components
/*------------------------------------------------------------------------------*/

gulp.task('bower:install', $.shell.task(['bower install']));

gulp.task('install:foundation', function() {
  return gulp.src('src/shell/', {read: false})
    .pipe($.shell(['bash src/shell/foundation.sh']));
});

/*------------------------------------------------------------------------------*/
/* BrowserSync
/*------------------------------------------------------------------------------*/

gulp.task('browser-sync', function() {
  var args = {};
  if (argv.mode == 'server' ) {
    args.server =  { baseDir: paths.root };
    args.startPath = paths.htmlDest;
  } else {
    args.proxy =  paths.vhost;
    args.open = 'external';
  };
  browserSync.init(args);
});

gulp.task('bs-reload', function() {
  browserSync.reload()
});

/*------------------------------------------------------------------------------*/
/* Image tasks
/*------------------------------------------------------------------------------*/

gulp.task('image-min', function() {
  return gulp.src(paths.imageDest + '**/*.*')
    .pipe($.imagemin({ optimizationLevel: 3 }))
    .pipe(gulp.dest(paths.imageDest))
    .pipe(browserSync.reload({ stream: true }));
});

// gulp.task('sprite', function() {
//   var spriteData = gulp.src(paths.imagePath + 'sprite/*.png')
//   .pipe($.spritesmith({
//     imgName: 'sprite.png',
//     imgPath: '../images/sprite.png',
//     cssName: '_m-sprite.scss',
//     algorithm: 'top-down',
//     padding: 20
//   }));
//   spriteData.img.pipe(gulp.dest(paths.imageDest));
//   spriteData.css.pipe(gulp.dest(paths.scssPath + 'module'));
// });

// gulp.task('sprite-svg', function() {
//   return gulp.src(paths.imagePath + 'sprite-svg/*.svg')
//     .pipe($.svgSprite({
//       dest: './',
//       mode: { symbol: { dest: './' } }
//     }))
//     .pipe($.rename({
//       basename: 'symbol',
//       dirname: './',
//       prefix: 'sprite' + '.'
//     }))
//     .pipe(gulp.dest(paths.imageDest));
// });

/*------------------------------------------------------------------------------*/
/* Jade Tasks
/*------------------------------------------------------------------------------*/

gulp.task('jade', function() {
  return gulp.src(paths.jadePath + '**/*.jade')
    .pipe($.data(function(file) {
      return require('./setting.json');
    }))
    .pipe($.plumber())
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest(paths.htmlDest))
    .pipe(browserSync.reload({ stream: true }));
});

/*------------------------------------------------------------------------------*/
/* Sass tasks
/*------------------------------------------------------------------------------*/

gulp.task('sass', function () {
  return gulp.src(paths.scssPath + '*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.cssGlobbing({ extensions: ['.scss'] }))
    .pipe($.sass(gulpSassConf).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: paths.scssPath
    }))
    .pipe(gulp.dest(paths.cssDest))
    .pipe(browserSync.reload({ stream: true }));
});


/*------------------------------------------------------------------------------*/
/* Gulp tasks
/*------------------------------------------------------------------------------*/

gulp.task('watch', function() {
  // gulp.watch([paths.imageDest + 'sprite/*.png'], ['sprite']);
  // gulp.watch([paths.imagePath + 'sprite-svg/*.svg'], ['sprite-svg'])
  gulp.watch([paths.htmlDest  + '*.html'], ['bs-reload']);
  gulp.watch([paths.jadePath  + '**/*.jade'], ['jade']);
  gulp.watch([paths.scssPath  + '**/*.scss'], ['sass']);
});

gulp.task('default', [
  'browser-sync',
  'image-min',
  'jade',
  'sass',
  // 'sprite',
  // 'sprite-svg',
  'watch'
]);

gulp.task('init', function(cb) {
  runSequence('bower:install', 'install:foundation', cb);
});
