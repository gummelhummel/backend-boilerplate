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

      // Delete everything
      app.delete("/api/data", apidata.clear);

      // List collections
      app.get("/api/data/", apidata.list);

      // List all keys in one collection
      app.get("/api/data/:collection/", apidata.listCollection);

      // Request an item by id
      app.get("/api/data/:collection/:id", apidata.get);

      // create a new object in a collection
      app.post("/api/data/:collection", apidata.save);     

      // Patch an existing object (only overwrite the fields sent in body)
      app.patch("/api/data/:collection/:id", apidata.update);
      
      // Overwrite an existing object 
      app.put("/api/data/:collection/:id", apidata.save);
      
      // assets for frontend
      app.get("/*", express.static("dist", { redirect: false }));

      app.all("/*", (req, res) => {
        console.log('404')
        res.status(404).sendFile("404.html", {
          root: path.join(__dirname, "../../frontend")
        });
      });
    }
  };
};
