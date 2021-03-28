const gulp = require("gulp");

const createWatcher = (config, task) => {
  const watchGlob = Array.isArray(config)
    ? config.map((item) => item.watch || item.source)
    : config.watch || config.source;

  return () => gulp.watch(watchGlob, task);
};

module.exports = {
  createWatcher,
};
