const gulp = require("gulp");

const tasks = (config) => ({
  assets: config.paths.assets && require("./tasks/assets")(config),
  clean: require("./tasks/clean")(config),
  content: config.paths.content && require("./tasks/content")(config),
  env: require("./tasks/env")(config),
  purge: config.paths.purge && require("./tasks/purge")(config),
  scripts: config.paths.scripts && require("./tasks/scripts")(config),
  styles: config.paths.styles && require("./tasks/styles")(config),
  icons: config.paths.icons && require("./tasks/icons")(config),
});

// re-export gulp
module.exports = {
  gulp,
  tasks,
};
