module.exports = data => {
  return {
    get: async (req, res) => {
      let d = await data.get(req.params.collection, req.params.id);
      
      d?res.status(200).send(d):res.status(404).end();
    },
    list: async (req, res) => {
      let path = req.path[0];
      let k = await data.listCollections();
      res.status(200).send(k);
    },
    listCollection: async (req, res) => {
      let path = req.path[0];
      let k = await data.listCollection(req.params.collection);
      k === null ? res.status(404).end() : res.status(200).send(k);
    },
    clear: async (req, res) => {
      await data.clear();
      res.status(204).end();
    },
    save: async (req, res) => {
      let path = req.path[0];
      let _id = await data.save(req.params.collection, req.body);
      res.status(201).end(_id);
    },
    search: async (req, res) => {
      let result = await data.search(req.params.collection, req.body);
      res.status(200).send(result);
    },
    update: async (req, res) => {},
    remove: async (req, res) => {
      let result = await data.remove(req.params.collection, req.params.id);
      res.status(204).send(result);
    }
  };
};
