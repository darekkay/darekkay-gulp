const gulp = require("gulp");
const gulpif = require("gulp-if");
const dependents = require("gulp-dependents");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const minify = require("gulp-minify");

const { createWatcher, logFiles } = require("./utils/");

/**
 * Process all scripts:
 *
 * - Concat all script files
 * - Run Babel
 * - Minify
 */
module.exports = ({ paths, useBabel = false, debug }) => {
  const scriptsTask = () => {
    return gulp
      .src(paths.scripts.source, {
        since: gulp.lastRun(scriptsTask),
      })
      .pipe(concat("index.js"))
      .pipe(plumber())
      .pipe(dependents())
      .pipe(
        gulpif(
          useBabel,
          babel({
            presets: ["@babel/env"],
          })
        )
      )
      .pipe(minify({ ext: { min: ".min.js" }, noSource: true }))
      .pipe(logFiles("[scripts]", debug))
      .pipe(gulp.dest(paths.scripts.destination));
  };
  scriptsTask.displayName = "scripts";

  scriptsTask.watcher = createWatcher(paths.scripts, scriptsTask);

  return scriptsTask;
};
