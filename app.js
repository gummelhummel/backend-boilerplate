const express = require("express"),
  bodyParser = require("body-parser"),
  crypto = require("crypto"),
  fs = require("fs"),
  data = "./data/";

const app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

app.use(allowCrossDomain);
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

app.use("*", (req, res, next) => {
  res.locals.id = crypto
    .createHash("md5")
    .update(req.baseUrl)
    .digest("hex");
  next();
});

const list = (res, path) => {
  res.end("l" + path);
};

const fetch = (res, path) => {
  res.end("f" + path);
};

app.get('/',(req,res)=>{
   res.status(200).sendFile("dist/index.html", { root: __dirname });
})

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
  if (path[path.length - 1] === "/") {
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

app.post("*", (req, res) => {
  getContent(res.locals.id, content => {
    if (!content) {
      req.body._me = {
        id: res.locals.id,
        url: req.originalUrl
      };
      cache[res.locals.id] = req.body;
      saveContent(
        req.originalUrl,
        res.locals.id,
        JSON.stringify(req.body),
        err => {
          if (err) res.status(409).send();
          else res.status(201).json(cache[res.locals.id]);
        }
      );
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
