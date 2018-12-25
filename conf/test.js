const pkg = require("../package");

module.exports = {
  appname: pkg.name,
  db: {
    type: 'inmemory'
  },
  jwt:{
    secret: 'aa'
  }
};
