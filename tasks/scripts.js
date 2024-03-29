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
    const scripts = Array.isArray(paths.scripts)
      ? paths.scripts
      : [paths.scripts];

    return Promise.allSettled(
      scripts.map(({ source, destination, fileName, debug: scriptsDebug }) =>
        gulp
          .src(source)
          .pipe(concat(fileName || "index.js"))
          .pipe(plumber())
          .pipe(dependents())
          .pipe(
            gulpif(
              useBabel,
              babel({
                presets: ["@babel/env"],
              }),
            ),
          )
          .pipe(minify({ ext: { min: ".min.js" }, noSource: true }))
          .pipe(logFiles("[scripts]", scriptsDebug ?? debug))
          .pipe(gulp.dest(destination)),
      ),
    );
  };
  scriptsTask.displayName = "scripts";

  scriptsTask.watcher = createWatcher(paths.scripts, scriptsTask);

  return scriptsTask;
};
