const { src, dest } = require("gulp");

const copy = ({ source, destination, base }) => {
  return src(source, { base }).pipe(dest(destination));
};

/** Passthrough assets */
module.exports = ({ paths }) => {
  const assetsTask = () => {
    const assets = Array.isArray(paths.assets) ? paths.assets : [paths.assets];
    return Promise.allSettled(
      assets.map((path) =>
        copy({
          source: path.source,
          destination: path.destination,
          base: path.base,
        })
      )
    );
  };
  assetsTask.displayName = "assets";
  return assetsTask;
};
