const noop = () => {};

const uuid = (() => {
  let cd = Date.now();
  let nounce = 0;

  return {
    draw: () => {
      let _cd = Date.now();
      if (_cd === cd) {
        nounce++;
      } else {
        cd = _cd;
        nounce = 0;
      }
      return _cd + "." + nounce;
    }
  };
})();

const d = e => {
  console.log(e);
  return e;
};

module.exports = (
  config,
  read = async () => {
    return {};
  },
  write = async () => {}
) => {
  let localRead = () => read(config);
  const collections = {};
   localRead().then(v=>{
     for (const k in v) collections[k] = v[k];
   });
  let localWrite = () =>  write(collections);

  const getCollection = n => {
    if (!(n in collections)) {
      _createCollection(n);
    }
    return collections[n];
  };

  const _createCollection = name => {
    if (!collections[name]) {
      collections[name] = [];
      localWrite();
    }
  };

  return {
    createCollection: async name => {
      _createCollection(name);
    },
    clearCollection: async name => {
      delete collections[name];
      localWrite();
    },
    save: async (collectionName, obj) => {
      let { _id } = obj;
      const collection = getCollection(collectionName);
      if (_id) {
        collections[collectionName] = collection.map(o =>
          o._id === _id ? obj : o
        );
      } else {
        _id = uuid.draw();
        collection.push({ ...obj, _id: _id });
      }
      localWrite();
      return _id;
    },
    listCollections: async () => {
      return Object.keys(collections);
    },
    clear: async () => {
      for (const o in collections) delete collections[o];
      localWrite();
    },
    listCollection: async (name, keys = []) => {
      const collection = getCollection(name);
      if (keys.length === 0) keys.push("_id");

      return collection.map(o =>
        keys.reduce((obj, k) => {
          obj[k] = o[k];
          return obj;
        }, {})
      );
    },

    get: async (collectionName, id) => {
      const collection = getCollection(collectionName);
      const result = collection.filter(o => o._id === id);
      return result[0] || undefined;
    }
  };
};
