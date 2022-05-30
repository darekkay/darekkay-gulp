const gulp = require("gulp");
const svgSprite = require("gulp-svg-sprite");
const dependents = require("gulp-dependents");
const plumber = require("gulp-plumber");

const { createWatcher, logFiles } = require("./utils/");

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
module.exports = ({ paths, svgSpriteOptions = {}, debug }) => {
  const iconsTask = () => {
    const icons = Array.isArray(paths.icons) ? paths.icons : [paths.icons];
    return Promise.allSettled(
      icons.map(({ source, destination, fileName, debug: iconsDebug }) =>
        gulp
          .src(source)
          .pipe(plumber())
          .pipe(dependents())
          .pipe(svgSprite({ ...defaultConfig(fileName), ...svgSpriteOptions }))
          .pipe(logFiles("[icons]", iconsDebug ?? debug))
          .pipe(gulp.dest(destination))
      )
    );
  };
  iconsTask.displayName = "icons";

  iconsTask.watcher = createWatcher(paths.icons, iconsTask);

  return iconsTask;
};
