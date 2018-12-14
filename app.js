const express = require("express"),
  api = express.Router(),
  path = require("path"),
  bodyParser = require("body-parser"),
  crypto = require("crypto"),
  morgan = require("morgan"),
  fs = require("fs");

const app = express();
let cache = {};

app.use(bodyParser.json());
app.use(morgan("combined"));

const getContent = (path, id, callback) => {
  if (cache[id]) callback(cache[id]);
  else {
    const file = "." + path + id;
    fs.stat(file, (err, stat) => {
      if (err) callback(false);
      else
        fs.readFile(file, (err, content) => {
          if (err) callback(false);
          else {
            cache[id] = content = JSON.parse(content);
            callback(content);
          }
        });
    });
  }
};

const saveContent = (path, id, content, callback) => {
  const mkdirp = (p, t, cb) => {
    t.push(p.shift());
    fs.mkdir(t.join("/"), (err) => {
      if (p.length > 0) mkdirp(p, t, cb);
      else cb(p);
    })
  }
  mkdirp(path.split("/").filter(Boolean), [], (p) => {
    if (p)
      fs.writeFile("." + path + id, JSON.stringify(content), err => {
        if (err) callback(err);
        else callback();
      });
    else
      callback(false);
  });
}

api.use("*", (req, res, next) => {
  res.locals.path = req.originalUrl.slice(0, req.originalUrl.lastIndexOf("/") !== 1 ? req.originalUrl.lastIndexOf("/") + 1 : req.originalUrl.length)
  res.locals.id = crypto
    .createHash("md5")
    .update(req.originalUrl)
    .digest("hex");
  next();
});

api.get("*", (_, res) => {
  getContent(res.locals.path, res.locals.id, content => {
    if (content) res.status(200).json(content);
    else res.status(404).json([]);
  });
});

api.post("*", (req, res) => {
  getContent(res.locals.path, res.locals.id, content => {
    if (!content) {
      req.body._me = {
        id: res.locals.id,
        path: res.locals.path
      };
      cache[res.locals.id] = req.body;
      saveContent(res.locals.path, res.locals.id, req.body, err => {
        if (err) res.status(409).send(err);
        else res.status(201).json(cache[res.locals.id]);
      });
    } else res.send(409);
  });
});

api.put("*", (req, res) => {
  getContent(res.locals.path, res.locals.id, content => {
    if (content) {
      req.body._me = {
        id: res.locals.id,
        path: res.locals.path
      };
      fs.writeFile("." + res.locals.path + res.locals.id, JSON.stringify(req.body), err => { });
      res.status(200).json(req.body);
    } else res.status(404).json([]);
  });
});

api.patch("*", (req, res) => {
  getContent(res.locals.path, res.locals.id, content => {
    if (content) {
      for (let key in req.body) content[key] = req.body[key];
      fs.writeFile("." + res.locals.path + res.locals.id, JSON.stringify(content), err => { });
      res.status(200).json(content);
    } else res.status(404).json([]);
  });
});

api.delete("*", (_, res) => {
  fs.unlink("." + res.locals.path + res.locals.id, err => { });
  cache[res.locals.id] = null;
  res.status(204).send();
});

app.use("/api/data/", api);
app.use("/", express.static("dist", { redirect: false }));
app.get("*", (req, res, next) => {
  res.sendFile(path.resolve("dist/index.html"));
});
app.listen(3000);
