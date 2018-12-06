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

app.use("*", (req, res, next) => {
  res.locals.id = crypto
    .createHash("md5")
    .update(req.baseUrl)
    .digest("hex");
  next();
});

app.get("*", (_, res) => {
  getContent(res.locals.id, content => {
    if (content) res.status(200).json(content);
    else res.status(404).json([]);
  });
});

app.post("*", (req, res) => {
  getContent(res.locals.id, content => {
    if (!content) {
      cache[res.locals.id] = req.body;
      fs.writeFile(data + res.locals.id, JSON.stringify(req.body), err => {
        if (err) res.status(409).send();
        else res.status(201).json(cache[res.locals.id]);
      });
    } else res.status(409).send();
  });
});

app.put("*", (req, res) => {
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
