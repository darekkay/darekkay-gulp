const gulp = require("gulp");
const gulpDebug = require("gulp-debug");

const createWatcher = (config, task) => {
  const watchGlob = Array.isArray(config)
    ? config.flatMap((item) => item.watch || item.source)
    : config.watch || config.source;

  return () => gulp.watch(watchGlob, task);
};

const logFiles = (title, debug) =>
  gulpDebug({
    title,
    showFiles: !!debug,
    showCount: !!debug,
  });

module.exports = {
  createWatcher,
  logFiles,
};
