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

  res.locals.file = req.originalUrl
    .split("\\")
    .pop()
    .split("/")
    .pop();

  res.locals.id =
    crypto
      .createHash("md5")
      .update(req.originalUrl)
      .digest("hex") + ".json";

  if (config.useAllowCrossDomain)
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      "Access-Control-Allow-Headers": "Content-Type"
    });

  next();
});

api.get("*", (_, res) => {
  if (res.locals.file !== "")
    fn.getContent(res.locals.path, res.locals.id, content => {
      if (content) res.status(200).send(content);
      else res.status(404).send({});
    });
  else
    fs.readdir(config.dataDir + res.locals.path, (err, f) => {
      if (err) res.status(404).send([]);
      else
        res.status(200).send(
          f.filter(f => {
            return f.includes(".json");
          })
        );
    });
});

api.post("*", (req, res) => {
  fn.getContent(res.locals.path, res.locals.id, content => {
    if (!content) {
      req.body._me = fn.me(res.locals);
      cache.set(res.locals.id, req.body);
      fn.saveContent(
        config.dataDir + res.locals.path,
        res.locals.id,
        req.body,
        err => {
          if (err) {
            res.status(409).end();
          }
          res.status(201).send(cache.get(res.locals.id));
        }
      );
    } else res.status(409).end();
  });
});

api.put("*", (req, res) => {
  fn.getContent(res.locals.path, res.locals.id, content => {
    if (content) {
      req.body._me = fn.me(res.locals);
      fs.writeFile(
        config.dataDir + res.locals.path + res.locals.id,
        JSON.stringify(req.body),
        err => {
          if (err) res.status(500).send("Ooouuups");
          cache.set(res.locals.id, req.body);
          res.status(200).send(cache.get(res.locals.id));
        }
      );
    } else res.status(404).send({});
  });
});

api.patch("*", (req, res) => {
  fn.getContent(res.locals.path, res.locals.id, content => {
    if (content) {
      for (let key in req.body) content[key] = req.body[key];
      fs.writeFile(
        config.dataDir + res.locals.path + res.locals.id,
        JSON.stringify(content),
        err => {
          if (err) res.status(500).send("Ooouuups");
          cache.set(res.locals.id, content);
          res.status(200).send(cache.get(res.locals.id));
        }
      );
    } else res.status(404).send({});
  });
});

api.delete("*", (_, res) => {
  fs.unlink(config.dataDir + res.locals.path + res.locals.id, err => {
    if (err) res.status(500).send("Ooouuups");
    cache.set(res.locals.id, null);
    res.status(204).end();
  });
});

module.exports = api;
