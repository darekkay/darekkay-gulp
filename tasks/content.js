const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");

const { logFiles } = require("./utils/");

/**
 * Process all content files:
 *
 * - Minify
 */
module.exports = ({ paths, debug }) => {
  const contentTask = () => {
    return gulp
      .src(paths.content)
      .pipe(
        htmlmin({
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true, // TODO: ES6 is not minified: https://github.com/samvloeberghs/kwerri-oss/pull/43
        }),
      )
      .pipe(logFiles("[content]", debug))
      .pipe(gulp.dest(paths.destination));
  };
  contentTask.displayName = "content";

  contentTask.watcher = () => gulp.watch(paths.content, contentTask);

  return contentTask;
};
