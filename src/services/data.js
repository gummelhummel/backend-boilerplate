module.exports = database => {

  return {
    clear: database.clear,
    save: database.save,
    createCollection: database.createCollection,
    listCollections : database.listCollections,
    listCollection : database.listCollection,
    clearCollection: database.clearCollection,
    get: database.get,
    search: database.search,
    remove: database.remove,
    update: database.save,    
  };
};
