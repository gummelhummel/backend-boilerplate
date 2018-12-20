const express = require("express");

module.exports = async () => {
  const app = express();
  const config = require("./conf")();
  const database = require("./src/database")(config);
  const services = require("./src/services")(database);

  const { route } = require("./src/routers")(express, services);
  route(app);

  return app;
};
