const gulp = require("gulp");

const tasks = (config) => {
  const enabledTasks = {
    // load tasks only when configured
    assets: config.paths.assets && require("./tasks/assets")(config),
    clean: require("./tasks/clean")(config),
    content: config.paths.content && require("./tasks/content")(config),
    env: require("./tasks/env")(config),
    purge: config.paths.purge && require("./tasks/purge")(config),
    scripts: config.paths.scripts && require("./tasks/scripts")(config),
    styles: config.paths.styles && require("./tasks/styles")(config),
    icons: config.paths.icons && require("./tasks/icons")(config),
  };
  enabledTasks.watch = (...tasksToWatch) => {
    const watcher = () => {
      tasksToWatch.forEach((taskToWatch) => {
        // we pass explicit tasks to watch to prevent watching for tasks that are not used (e.g. "content" being only used in production, but not development)
        if (taskToWatch.watcher) taskToWatch.watcher();
      });
    };
    watcher.displayName = "watch";
    return watcher;
  };
  return enabledTasks;
};

// re-export gulp
module.exports = {
  gulp,
  tasks,
};
