module.exports = database => {
  const data = require("./data")(database);

  return {
    data
  };
};
