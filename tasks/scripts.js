const gulp = require("gulp");
const dependents = require("gulp-dependents");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const minify = require("gulp-minify");

/**
 * Process all scripts:
 *
 * - Concat all script files
 * - Run Babel
 * - Minify
 */
module.exports = ({ paths }) => {
  const scriptFiles = paths.scripts.source + "/**/*.js";
  const scriptsTask = () => {
    return gulp
      .src([scriptFiles], {
        since: gulp.lastRun(scriptsTask),
      })
      .pipe(concat("index.js"))
      .pipe(plumber())
      .pipe(dependents())
      .pipe(
        babel({
          presets: ["@babel/env"],
        })
      )
      .pipe(minify({ ext: { min: ".min.js" }, noSource: true }))
      .pipe(gulp.dest(paths.scripts.destination));
  };
  scriptsTask.displayName = "scripts";
  scriptsTask.watcher = () => gulp.watch(scriptFiles, scriptsTask);

  return scriptsTask;
};
