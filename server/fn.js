const fs = require("fs"),
  cache = require("./cache"),
  config = require("../config");

exports.getContent = (path, id, callback) => {
  if (cache.get(id)) callback(cache.get(id));
  else {
    const file = config.dataDir + path + id;
    fs.stat(file, (err, stat) => {
      if (err) callback(false);
      else
        fs.readFile(file, (err, content) => {
          if (err) callback(false);
          else {
            cache.set(id, JSON.parse(content));
            callback(cache.get(id));
          }
        });
    });
  }
};

exports.saveContent = (path, id, content, callback) => {
  const mkdirp = (p, t, cb) => {
    t.push(p.shift());
    fs.mkdir(t.join("/"), err => {
      if (p.length > 0) mkdirp(p, t, cb);
      else cb(p);
    });
  };
  mkdirp(path.split("/").filter(Boolean), [], p => {
    if (p)
      fs.writeFile(path + id, JSON.stringify(content), err => {
        if (err) callback(err);
        else callback();
      });
    else callback(false);
  });
};

exports.me = l => {
  return {
    id: l.id,
    file: l.file,
    path: l.path
  };
};

exports.filterObjectKeys = (obj, keys) => {
  if (keys === "") return obj;
  let o = {};
  keys.map(k => (o[k] = obj[k]));
  return o;
};
