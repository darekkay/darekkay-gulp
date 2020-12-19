const { src, dest } = require("gulp");

/* Passthrough assets */
const copy = ({ source, destination }) => {
  return src(`${source}/**/*`).pipe(dest(destination));
};

module.exports = ({ paths }) => {
  const assetsTask = () => {
    const assets = Array.isArray(paths.assets) ? paths.assets : [paths.assets]; // support arrays or objects

    return Promise.all(
      assets.map((path) =>
        copy({ source: path.source, destination: path.destination })
      )
    );
  };
  assetsTask.displayName = "assets";
  return assetsTask;
};
