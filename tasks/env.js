/** Set the node environment */
module.exports = ({}) => (environment) => {
  const task = () => {
    process.env.NODE_ENV = environment;
    return Promise.resolve();
  };
  task.displayName = "env";
  return task;
};
