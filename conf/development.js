const pkg = require("../package");

module.exports = {
  appname: pkg.name,
  db: {
    type: 'inmemory-with-sync'
  },
  jwt : {
    issuer:'d',
    audience:'dd',
    secret:'admin',    
  }
};
