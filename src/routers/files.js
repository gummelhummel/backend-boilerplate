const express = require("express");
const path = require("path");
const fs = require("fs");

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

  const unlink = async filename =>
    new Promise((res, rej) => fs.unlink(filename, (err, data) => res(!!err)));

  const remove = async (req, res) => {
    let item = await services.data.get("_files", req.params.id);
    if (item) {
      const filename = path.join(__dirname, "../../tmp/uploads", item.filename);
      let err = await unlink(filename);
      if (err) {
        let result = await services.data.remove("_files", req.params.id);
        res.status(500).send(result);
      } else {
        let result = await services.data.remove("_files", req.params.id);
        res.status(204).send(result);
      }
    } else {
      next();
    }
  };

  const writeFile = async (filename, body) =>
    new Promise((res, rej) => fs.writeFile(filename, body, (err, data) => res(!!err)));


  const update = async (req,res)=>{
    let item = await services.data.get("_files", req.params.id);
    if (item) {
      const filename = path.join(__dirname, "../../tmp/uploads", item.filename);
      let err = await writeFile(filename, req.body);
      let result = err;
      if (err) {
        //let result = await services.data.update("_files", req.params.id);
        res.status(500).send(result);
      } else {
        //let result = await services.data.update("_files", req.params.id);
        res.status(201).send(result);
      }
    } else {
      next();
    }
  };

  return {
    get,
    upload,
    list,
    remove,
    update
  };
};
