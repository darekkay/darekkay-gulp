const gulp = require("gulp");
const { sass } = require("@mr-hope/gulp-sass");
const dependents = require("gulp-dependents");
const postcss = require("gulp-postcss");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const minify = require("gulp-clean-css");

const { createWatcher, logFiles } = require("./utils/");

const defaultPostcssPlugins = ["autoprefixer"];

/**
 * Process all styles:
 *
 * - Concat all style files
 * - Compile SASS/SCSS to CSS
 * - Process PostCSS
 *   - Autoprefixer
 * - Minify
 */
module.exports = ({ paths, postcssPlugins, debug }) => {
  const stylesTask = () => {
    const styles = Array.isArray(paths.styles) ? paths.styles : [paths.styles];
    return Promise.allSettled(
      styles.map(({ source, destination, fileName, debug: stylesDebug }) =>
        gulp
          .src(source)
          .pipe(concat(fileName || "styles.css"))
          .pipe(plumber())
          .pipe(dependents())
          .pipe(sass().on("error", sass.logError))
          .pipe(
            postcss(
              (postcssPlugins || defaultPostcssPlugins).map((plugin) =>
                require(plugin),
              ),
            ),
          )
          .pipe(minify())
          .pipe(logFiles("[styles]", stylesDebug ?? debug))
          .pipe(gulp.dest(destination)),
      ),
    );
  };
  stylesTask.displayName = "styles";

  stylesTask.watcher = createWatcher(paths.styles, stylesTask);

  return stylesTask;
};
