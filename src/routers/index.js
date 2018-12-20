const bodyParser = require("body-parser");
const path = require("path");

module.exports = (express, services) => {
  const apidata = require("./api-data")(services.data);
  return {
    route: app => {
      app.get("/", (req, res) => {
        res.sendFile("index.html", {
          root: path.join(__dirname, "../../dist")
        });
      });

      app.use(bodyParser.json());

      app.delete("/api/data", apidata.clear);
      app.get("/api/data/", apidata.list);
      app.get("/api/data/:collection/", apidata.listCollection);
      app.get("/api/data/:collection/:id", apidata.get);
      app.post("/api/data/:collection", apidata.save);
      app.patch("/api/data/:collection/:id", apidata.save);
      app.put("/api/data/:collection/:id", apidata.save);
      app.get("/*", express.static("dist", { redirect: false }));

      app.route("/*", (req, res) => {
        console.log("Somebody tries something");
      });
    }
  };
};
