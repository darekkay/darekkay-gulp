const gulp = require("gulp");

const { createWatcher } = require("./utils/");

const copy = ({ source, destination, base }) => {
  return gulp.src(source, { base }).pipe(gulp.dest(destination));
};

/** Passthrough assets */
module.exports = ({ paths }) => {
  const assetsTask = () => {
    const assets = Array.isArray(paths.assets) ? paths.assets : [paths.assets];
    return Promise.allSettled(
      assets.map((path) =>
        copy({
          source: path.source,
          destination: path.destination || paths.destination,
          base: path.base,
        })
      )
    );
  };
  assetsTask.displayName = "assets";

  assetsTask.watcher = createWatcher(paths.assets, assetsTask);

  return assetsTask;
};
