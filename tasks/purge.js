/* eslint-disable unicorn/better-regex */
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const plumber = require("gulp-plumber");
const minify = require("gulp-clean-css");
const purgecss = require("@fullhuman/postcss-purgecss");

const { logFiles } = require("./utils/");

/** Purge unused CSS */
module.exports = ({ paths, purgeCssOptions = {}, debug }) => {
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

              return [...broadMatches, ...innerMatches];
            },

            safelist: [
              // theme picker
              "data-theme",
              "data-theme-icon",

              // https://github.com/tailwindlabs/tailwindcss/issues/3043
              ":focus",
              ":focus-visible",
              "::-moz-focus-inner",
              "::-webkit-file-upload-button",
            ],

            ...purgeCssOptions,
          }),
        ])
      )
      .pipe(minify())
      .pipe(logFiles("[purge]", paths.purge.debug ?? debug))
      .pipe(gulp.dest(paths.purge.destination));
  };
  purgeTask.displayName = "purge";

  return purgeTask;
};
