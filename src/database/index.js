module.exports = config => {
  const database = require("./" + config.db.type)(config);

  return {
    get: database.get,
    clear: database.clear,
    save: database.save,
    createCollection: database.createCollection,
    listCollections: database.listCollections,
    listCollection: database.listCollection,
    search: database.search,
    remove: database.remove,
  };
};
