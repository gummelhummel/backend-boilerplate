const express = require("express");
const path = require("path");

let k = express();

k.get("", (req, res) => {
  res.contentType();
});

module.exports = (config, services) => {
  const upload = (req, res) => {
    req.files.forEach(file => services.data.save("_files", file));
    res.status(201).send({ msg: "successfully uploaded" });
  };

  const get = async (req, res) => {
    let file = await services.data.get("_files", req.params.id);
    if (file) {
      res.contentType(file.mimetype).sendFile(file.filename, {
        root: path.join(__dirname, "../../tmp/uploads")
      });
    } else {
      next();
    }
  };

  const list = (req, res) => {
    console.log(req.originalUrl);
  };

  return {
    get,
    upload,
    list
  };
};
