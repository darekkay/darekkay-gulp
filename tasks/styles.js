const gulp = require("gulp");
const sass = require("gulp-sass");
const dependents = require("gulp-dependents");
const postcss = require("gulp-postcss");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const minify = require("gulp-clean-css");
const purgecss = require("@fullhuman/postcss-purgecss");

const defaultPostcssPlugins = ["autoprefixer"];

/*
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
  const styleFiles = paths.styles.source + "/**/{*.css,*.sass,*.scss}";
  const stylesTask = () => {
    return gulp
      .src([styleFiles], {
        since: gulp.lastRun(stylesTask),
      })
      .pipe(concat("styles.css"))
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
      .pipe(gulp.dest(paths.styles.destination));
  };
  stylesTask.displayName = "styles";
  stylesTask.watcher = () => gulp.watch(styleFiles, stylesTask);

  return stylesTask;
};
