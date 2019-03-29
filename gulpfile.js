const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const beeper = require("beeper");

function plumbError() {
  return plumber({
    errorHandler: function(err) {
      notify.onError({
        templateOptions: {
          date: new Date()
        },
        title: "Gulp error in " + err.plugin,
        message: err.formatted
      })(err);
      beeper();
      this.emit("end");
    }
  });
}

function css() {
  return gulp
    .src(["src/scss/*"])
    .pipe(plumbError())
    .pipe(sass())
    .pipe(gulp.dest("dist/assets/css"))
    .pipe(browsersync.stream());
}

function js() {
  return gulp
    .src(["node_modules/bootstrap/dist/js/bootstrap.js", "src/js/*.js"])
    .pipe(plumbError())
    .pipe(gulp.dest("dist/assets/js"))
    .pipe(browsersync.stream());
}

function browserSync(done) {
  browsersync.init({
    server: "./dist"
  });
  done();
}

function watchFiles() {
  gulp.watch(["src/scss/*.scss"], css);
  gulp.watch(["src/js/*.js"], js);
  gulp.watch("dist/*.html").on("change", browsersync.reload);
}

const build = gulp.series(gulp.parallel(css, js, browserSync), watchFiles);

exports.default = build;
