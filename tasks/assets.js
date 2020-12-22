const { src, dest } = require("gulp");

const copy = ({ source, destination }) => {
  return src(`${source}/**/*`).pipe(dest(destination));
};

/** Passthrough assets */
module.exports = ({ paths }) => {
  const assetsTask = () => {
    const assets = Array.isArray(paths.assets) ? paths.assets : [paths.assets];
    return Promise.allSettled(
      assets.map((path) =>
        copy({ source: path.source, destination: path.destination })
      )
    );
  };
  assetsTask.displayName = "assets";
  return assetsTask;
};
