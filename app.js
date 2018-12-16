const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  config = require("./config"),
  api = require("./backend/api");

const app = express();

app.use(bodyParser.json());
app.use(morgan("combined"));
app.use("/api/data/", api);
app.use("/", express.static("dist", { redirect: false }));
app.get("*", (_, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});
app.listen(config.port);
