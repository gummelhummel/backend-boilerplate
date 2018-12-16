const fs = require("fs"),
  cache = require("./cache");

exports.getContent = (path, id, callback) => {
  if (cache.get(id)) callback(cache.get(id));
  else {
    const file = "." + path + id;
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
      fs.writeFile("." + path + id, JSON.stringify(content), err => {
        if (err) callback(err);
        else callback();
      });
    else callback(false);
  });
};
