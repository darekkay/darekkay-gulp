const gulp = require("gulp");

const { createWatcher, logFiles } = require("./utils/");

const copy = ({ source, destination, base, debug }) => {
  return gulp
    .src(source, { base })
    .pipe(logFiles("[assets]", debug))
    .pipe(gulp.dest(destination));
};

/** Passthrough assets */
module.exports = ({ paths, debug }) => {
  const assetsTask = () => {
    const assets = Array.isArray(paths.assets) ? paths.assets : [paths.assets];
    return Promise.allSettled(
      assets.map((path) =>
        copy({
          source: path.source,
          destination: path.destination || paths.destination,
          base: path.base,
          debug: path.debug ?? debug,
        }),
      ),
    );
  };
  assetsTask.displayName = "assets";

  assetsTask.watcher = createWatcher(paths.assets, assetsTask);

  return assetsTask;
};
