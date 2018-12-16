const express = require("express"),
  api = express.Router(),
  fs = require("fs"),
  crypto = require("crypto"),
  config = require("../config"),
  fn = require("./fn"),
  cache = require("./cache");

api.use("*", (req, res, next) => {
  res.locals.path = req.originalUrl.slice(
    0,
    req.originalUrl.lastIndexOf("/") !== 1
      ? req.originalUrl.lastIndexOf("/") + 1
      : req.originalUrl.length
  );

  res.locals.id = crypto
    .createHash("md5")
    .update(req.originalUrl)
    .digest("hex");

  if (config.useAllowCrossDomain)
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      "Access-Control-Allow-Headers": "Content-Type"
    });

  next();
});

api.get("*", (_, res) => {
  fn.getContent(res.locals.path, res.locals.id, content => {
    if (content) res.status(200).json(content);
    else res.status(404).json([]);
  });
});

api.post("*", (req, res) => {
  fn.getContent(res.locals.path, res.locals.id, content => {
    if (!content) {
      req.body._me = {
        id: res.locals.id,
        path: res.locals.path
      };
      cache.set(res.locals.id, req.body);
      fn.saveContent(res.locals.path, res.locals.id, req.body, err => {
        if (err) res.status(409).send(err);
        else res.status(201).json(cache.get(res.locals.id));
      });
    } else res.send(409);
  });
});

api.put("*", (req, res) => {
  fn.getContent(res.locals.path, res.locals.id, content => {
    if (content) {
      req.body._me = {
        id: res.locals.id,
        path: res.locals.path
      };
      fs.writeFile(
        "." + res.locals.path + res.locals.id,
        JSON.stringify(req.body),
        err => {}
      );
      cache.set(res.locals.id, req.body);
      res.status(200).json(cache.get(res.locals.id));
    } else res.status(404).json([]);
  });
});

api.patch("*", (req, res) => {
  fn.getContent(res.locals.path, res.locals.id, content => {
    if (content) {
      for (let key in req.body) content[key] = req.body[key];
      fs.writeFile(
        "." + res.locals.path + res.locals.id,
        JSON.stringify(content),
        err => {}
      );
      cache.set(res.locals.id, content);
      res.status(200).json(cache.get(res.locals.id));
    } else res.status(404).json([]);
  });
});

api.delete("*", (_, res) => {
  fs.unlink("." + res.locals.path + res.locals.id, err => {});
  cache.set(res.locals.id, null);
  res.status(204).send();
});

module.exports = api;