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
  enabledTasks.watch = () => {
    Object.entries(enabledTasks).forEach(([__, task]) => {
      // call all available watchers
      if (task && task.watcher) task.watcher();
    });
  };
  enabledTasks.watch.displayName = "watch";
  return enabledTasks;
};

// re-export gulp
module.exports = {
  gulp,
  tasks,
};
