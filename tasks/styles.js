const gulp = require("gulp");
const sass = require("gulp-sass");
const dependents = require("gulp-dependents");
const postcss = require("gulp-postcss");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const minify = require("gulp-clean-css");

const defaultPostcssPlugins = ["autoprefixer"];

/**
 * Process all styles:
 *
 * - Concat all style files
 * - Compile SASS/SCSS to CSS
 * - Process PostCSS
 *   - Tailwind
 *   - Autoprefixer
 *   - Purge unused CSS
 * - Minify
 */
module.exports = ({ paths, postcssPlugins }) => {
  const stylesTask = () => {
    const styles = Array.isArray(paths.styles) ? paths.styles : [paths.styles];
    return Promise.allSettled(
      styles.map(({ source, destination, fileName }) =>
        gulp
          .src([source], {
            since: gulp.lastRun(stylesTask),
          })
          .pipe(concat(fileName || "styles.css"))
          .pipe(plumber())
          .pipe(dependents())
          .pipe(sass())
          .pipe(
            postcss(
              (postcssPlugins || defaultPostcssPlugins).map((plugin) =>
                require(plugin)
              )
            )
          )
          .pipe(minify())
          .pipe(gulp.dest(destination))
      )
    );
  };
  stylesTask.displayName = "styles";

  const watchGlob = Array.isArray(paths.styles)
    ? paths.styles.map((path) => path.watch || path.source)
    : paths.styles.watch || paths.styles.source;
  // TODO: fix watcher
  // when using index.scss > component.scss, a change to component.scss will not retrigger the build for index.scss
  stylesTask.watcher = () => gulp.watch(watchGlob, stylesTask);

  return stylesTask;
};
