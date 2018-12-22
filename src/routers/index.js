const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("express-jwt");

module.exports = (express, services, config) => {
  var jwtCheck = jwt({
    secret: config.jwt.secret,
    audience: config.jwt.audience,
    issuer: config.jwt.issuer
  });

  const fileRouter = (() => {
    const files = require('./files')(config, services);
    const fileRouter = express();

    fileRouter.post('/', files.upload);
    fileRouter.get('/:fname', files.get);

    return fileRouter;
  })(config, services);

  const userRouter = (() => {
    const users = require("./users")(config, services);

    const userRouter = express();

    userRouter.post("/", users.createUser);
    userRouter.post("/session", users.createSession);

    return userRouter;
  })();

  const apiDataRouter = (() => {
    const apidata = require("./api-data")(services.data);

    const data = express();
    // Delete everything
    data.delete("", jwtCheck, apidata.clear);

    // List collections
    data.get("/", apidata.list);

    // List all keys in one collection
    data.get("/:collection/", apidata.listCollection);

    // Request an item by id
    data.get("/:collection/:id", apidata.get);

    // create a new object in a collection
    data.post("/:collection", jwtCheck, apidata.save);

    // Patch an existing object (only overwrite the fields sent in body)
    data.patch("/:collection/:id", jwtCheck, apidata.update);

    // Overwrite an existing object
    data.put("/:collection/:id", jwtCheck, apidata.save);

    return data;
  })();

  return {
    route: app => {
      app.get("/", (req, res) => {
        res.sendFile("index.html", {
          root: path.join(__dirname, "../../dist")
        });
      });

      app.use(bodyParser.json());

      app.use("/api/users", userRouter);
      app.use("/api/data", apiDataRouter);
      app.use("/api/files", fileRouter);

      // assets for frontend
      app.get("/*", express.static("dist", { redirect: false }));

      app.all("/*", (req, res) => {
        console.log("404", req.originalUrl, req.method);
        res.status(404).sendFile("404.html", {
          root: path.join(__dirname, "../../frontend")
        });
      });
    }
  };
};
