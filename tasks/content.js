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
      .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
      .pipe(dest(paths.destination));
  };
  contentTask.displayName = "content";
  return contentTask;
};
