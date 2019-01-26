const bodyParser = require("body-parser");
const https = require("https");
const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");

module.exports = (express, services) => {
  const apiDataRouter = (() => {
    const apidata = require("./api-data")(services.data);

    const data = express();
    // Delete everything
    data.delete("", apidata.clear);

    // List collections
    data.get("/", apidata.list);

    // List all keys in one collection
    data.get("/:collection/", apidata.listCollection);

    // Request an item by id
    data.get("/:collection/:id", apidata.get);

    // create a new object in a collection
    data.post("/:collection", apidata.save);

    // Patch an existing object (only overwrite the fields sent in body)
    data.patch("/:collection/:id", apidata.update);

    // Overwrite an existing object
    data.put("/:collection/:id", apidata.save);

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

      app.use("/api/data", apiDataRouter);

      app.use("/map/:s/:z/:x/:y", (req, res) => {
        let p = req.params;
        const file = `maps/${p.z}/${p.x}/${p.y}.png`;
        mkdirp(`maps/${p.z}/${p.x}/`);
        fs.exists(file, bool => {
          if (bool) fs.createReadStream(file).pipe(res);
          else
            https.get(
              `https://${p.s}.tile.openstreetmap.org/${p.z}/${p.x}/${p.y}.png`,
              mapResponse => {
                mapResponse.pipe(fs.createWriteStream(file));
                mapResponse.pipe(res);
              }
            );
        });
      });

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
