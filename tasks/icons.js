const gulp = require("gulp");
const svgSprite = require("gulp-svg-sprite");
const dependents = require("gulp-dependents");
const plumber = require("gulp-plumber");

const defaultConfig = (fileName) => ({
  mode: {
    inline: true,
    symbol: {
      dest: "",
      sprite: fileName || "sprite.svg",
      example: false,
    },
  },
  shape: {
    id: {
      generator: "icon-%s",
    },
  },
  svg: {
    xmlDeclaration: false,
    doctypeDeclaration: false,
    namespaceClassnames: false, // when true, classes are prefixed with "a"
  },
});

/**
 * Combine all SVG icons into a single icon sprite.
 */
module.exports = ({ paths, svgSpriteOptions = {} }) => {
  const iconsTask = () => {
    const icons = Array.isArray(paths.icons) ? paths.icons : [paths.icons];
    return Promise.allSettled(
      icons.map(({ source, destination, fileName }) =>
        gulp
          .src(source + "/**/*.svg", {
            since: gulp.lastRun(iconsTask),
          })
          .pipe(plumber())
          .pipe(dependents())
          .pipe(svgSprite({ ...defaultConfig(fileName), ...svgSpriteOptions }))
          .pipe(gulp.dest(destination))
      )
    );
  };
  iconsTask.displayName = "icons";

  const watchGlob = Array.isArray(paths.icons)
    ? paths.icons.map((path) => path.watch || path.source)
    : paths.icons.watch || paths.icons.source;
  iconsTask.watcher = () => gulp.watch(watchGlob, iconsTask);

  return iconsTask;
};
