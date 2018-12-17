const express = require("express"),
  api = express.Router(),
  path = require("path"),
  bodyParser = require("body-parser"),
  crypto = require("crypto"),
  morgan = require("morgan"),
  fs = require("fs");

let config = {
  useAllowCrossDomain: false
};

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
    fs.mkdir(t.join("/"), err => {
      if (p.length > 0) mkdirp(p, t, cb);
      else cb(p);
    });
  };
  mkdirp(path.split("/").filter(Boolean), [], p => {
    if (p)
      fs.writeFile("." + path + id, JSON.stringify(content), err => {
        if (err) callback(err);
        else callback();
      });
    else callback(false);
  });
};

if (config.useAllowCrossDomain) {
  var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    next();
  };

  app.use(allowCrossDomain);
}
app.use(bodyParser.json());

const mkdirp = (path, callback) => {
  const mkdir_rec = (p, pc, cb) => {
    if (pc.length > 0) {
      let np = p.concat(pc.splice(0, 1));
      fs.stat(np.join("/"), () =>
        fs.mkdir(np.join("/"), () => mkdir_rec(np, pc, cb))
      );
    } else {
      cb();
    }
  };
  mkdir_rec(
    [],
    path.split("/"),
    callback || (() => console.log("Created path: " + path))
  );
};

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
  next();
});

app.get("/", (req, res) => {
  res.status(200).sendFile("dist/index.html", { root: __dirname });
});

app.get("/api/data/*", (req, res) => {
  let path = req.params[0];
  fs.stat("data/" + path, (e, s) => {
    if (e) {
      res.status(404).end();
    } else {
      s.isDirectory()
        ? fs.readdir("data/" + path, (e, fls) => {
            res
              .status(200)
              .send(fls)
              .end();
          })
        : res.sendFile("data/" + path, { root: __dirname });
    }
  });
});

app.post("/api/data/*", (req, res) => {
  let path = req.params[0];
  console.log("body", req.body);
  if (
    path[path.length - 1] === "/" ||
    (req.body && Object.keys(req.body).length === 0)
  ) {
    mkdirp("data/" + path, () => res.status(200).end("Created path " + path));
  } else {
    fs.writeFile(
      "data/" + path,
      JSON.stringify(req.body),
      { flag: "w" },
      () => {
        res.status(200).end();
      }
    );
  }
});

api.put("*", (req, res) => {
  getContent(res.locals.path, res.locals.id, content => {
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
      res.status(200).json(req.body);
    } else res.status(404).json([]);
  });
});

api.patch("*", (req, res) => {
  getContent(res.locals.path, res.locals.id, content => {
    if (content) {
      for (let key in req.body) content[key] = req.body[key];
      fs.writeFile(
        "." + res.locals.path + res.locals.id,
        JSON.stringify(content),
        err => {}
      );
      res.status(200).json(content);
    } else res.status(404).json([]);
  });
});

api.delete("*", (_, res) => {
  fs.unlink("." + res.locals.path + res.locals.id, err => {});
  cache[res.locals.id] = null;
  res.status(204).send();
});

app.use("/api/data/", api);
app.use("/", express.static("dist", { redirect: false }));

app.use(require('./user-routes'));

app.get("*", (req, res, next) => {
  res.sendFile(path.resolve("dist/index.html"));
});
app.listen(3000);
