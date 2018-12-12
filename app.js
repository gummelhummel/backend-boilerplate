const express = require("express"),
  bodyParser = require("body-parser"),
  crypto = require("crypto"),
  fs = require("fs"),
  data = "./data/";

const app = express();

app.use(bodyParser.json());

let cache = {};

const getContent = (id, callback) => {
  if (cache[id]) callback(cache[id]);
  else
    fs.stat(data + id, (err, stat) => {
      if (err) callback(false);
      else
        fs.readFile(data + id, (err, data) => {
          if (err) callback(false);
          else {
            cache[id] = content = JSON.parse(data);
            callback(content);
          }
        });
    });
};

const mkdirp = (currentPosition, path, callback) => {
  const next = path.shift();
  fs.mkdir(currentPosition + next, err => {
    if (!err && path.length > 0)
      mkdirp(currentPosition + next + "/", path, callback);
    else callback();
  });
};

const saveContent = (path, id, content, callback) => {
  let folder = path.split("/");
  folder.shift();
  folder.pop();
  mkdirp(data, folder, () => {
    fs.writeFile(
      data + path.slice(0, path.lastIndexOf("/")) + "/" + id,
      JSON.stringify(content),
      callback
    );
  });
};

app.use("*", (req, res, next) => {
  res.locals.id = crypto
    .createHash("md5")
    .update(req.baseUrl)
    .digest("hex");
  next();
});

app.get("*", (req, res) => {
  getContent(res.locals.id, content => {
    if (content) res.status(200).json(content);
    else res.status(404).json([]);
  });
});

app.post("*", (req, res) => {
  getContent(res.locals.id, content => {
    if (!content) {
      req.body._me = {
        id: res.locals.id,
        url: req.originalUrl
      };
      cache[res.locals.id] = req.body;
      saveContent(req.originalUrl, res.locals.id, req.body, err => {
        if (err) res.status(409).send();
        else res.status(201).json(cache[res.locals.id]);
      });
    } else res.status(409).send();
  });
});

app.put("*", (req, res) => {
  getContent(res.locals.id, content => {
    if (content) {
      fs.writeFile(data + res.locals.id, JSON.stringify(content), err => {});
      res.status(200).json(content);
    } else res.status(404).json([]);
  });
});

app.patch("*", (req, res) => {
  getContent(res.locals.id, content => {
    if (content) {
      for (let key in req.body) content[key] = req.body[key];
      fs.writeFile(data + res.locals.id, JSON.stringify(content), err => {});
      res.status(200).json(content);
    } else res.status(404).json([]);
  });
});

app.delete("*", (_, res) => {
  fs.unlink(data + res.locals.id, err => {});
  cache[res.locals.id] = null;
  res.status(204).send();
});

app.listen(3000);
