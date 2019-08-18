// Load all the modules from package.json
var gulp = require("gulp"),
  plumber = require("gulp-plumber"),
  autoprefixer = require("gulp-autoprefixer"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync").create();

var config = {
  nodeDir: "./node_modules"
};

// Default error handler
var onError = function(err) {
  console.log("An error occured:", err.message);
  this.emit("end");
};

// JS to watch
var jsFiles = ["./src/**/*.js"];

// Sass files to watch
var cssFiles = ["./src/scss/**/*.scss"];

// automatically reloads the page when files changed
var browserSyncWatchFiles = [
  "./dist/assets/css/*.css",
  "./dist/assets/js/**/*.min.js",
  "./dist/**/*.php",
  "./dist/**/*.html"
];

// see: https://www.browsersync.io/docs/options/
var browserSyncOptions = {
  watchTask: true,
  proxy: "http://localhost/clients/project-folder/dist"
};

gulp.task("scripts", function() {
  return gulp
    .src([
      "node_modules/tether/dist/js/tether.js",
      "node_modules/popper.js/dist/umd/popper.js",
      "node_modules/jquery/dist/jquery.js",
      "node_modules/bootstrap/dist/js/bootstrap.js",
      "src/js/*.js"
    ])
    .pipe(gulp.dest("./dist/assets/js"))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./dist/assets/js"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// Sass - Creates a regular and minified .css file in root
gulp.task("sass", function() {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(plumber())
    .pipe(
      sass({
        errLogToConsole: true,
        precision: 8,
        noCache: true
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(gulp.dest("./dist/assets/css/"))
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./dist/assets/css/"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// Starts browser-sync task for starting the server.
gulp.task("browser-sync", function() {
  browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});

// Start the livereload server and watch files for change
gulp.task("watch", function() {
  // don't listen to whole js folder, it'll create an infinite loop
  gulp.watch(jsFiles, gulp.parallel("scripts"));

  gulp.watch(cssFiles, gulp.parallel("sass"));
});

gulp.task("default", gulp.parallel("watch", "scripts", "sass", "browser-sync"));
