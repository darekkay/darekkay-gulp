const { src, dest } = require("gulp");
const htmlmin = require("gulp-htmlmin");

/*
 * Process all content files:
 *
 * - Minify
 */
module.exports = ({ paths }) => {
  const contentTask = () => {
    return src(paths.content)
      .pipe(
        htmlmin({
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true, // TODO: ES6 is not minified: https://github.com/samvloeberghs/kwerri-oss/pull/43
        })
      )
      .pipe(dest(paths.destination));
  };
  contentTask.displayName = "content";
  return contentTask;
};
