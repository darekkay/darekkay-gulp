const gulp = require("gulp");
const postcss = require("gulp-postcss");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const minify = require("gulp-clean-css");
const purgecss = require("@fullhuman/postcss-purgecss");

/** Purge unused CSS */
module.exports = ({ paths, purgeCssOptions = {} }) => {
  const purgeTask = () => {
    return gulp
      .src(paths.purge.css)
      .pipe(plumber())
      .pipe(
        postcss([
          purgecss({
            content: paths.purge.content,

            defaultExtractor: (content) => {
              // Capture as liberally as possible, including things like `h-(screen-1.5)`
              const broadMatches =
                content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

              // Capture classes within other delimiters like .block(class="w-1/2") in Pug
              const innerMatches =
                content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];

              return broadMatches.concat(innerMatches);
            },

            ...purgeCssOptions,
          }),
        ])
      )
      .pipe(minify())
      .pipe(gulp.dest(paths.purge.destination));
  };
  purgeTask.displayName = "purge";

  return purgeTask;
};
