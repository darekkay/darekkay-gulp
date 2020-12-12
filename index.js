const gulp = require("gulp");

const tasks = (config) => ({
  assets: require("./tasks/assets")(config),
  clean: require("./tasks/clean")(config),
  content: require("./tasks/content")(config),
  env: require("./tasks/env")(config),
  purge: require("./tasks/purge")(config),
  scripts: require("./tasks/scripts")(config),
  styles: require("./tasks/styles")(config),
});

// re-export gulp
module.exports = {
  gulp,
  tasks,
};
