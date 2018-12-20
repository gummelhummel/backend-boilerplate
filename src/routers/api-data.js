module.exports = data => {
  return {
    get: async (req, res) => {
      let d = await data.get(req.params.collection, req.params.id);
      res.status(200).send(d);
    },
    list: async (req, res) => {
      let path = req.path[0];
      let k = await data.listCollections();
      res.status(200).send(k);
    },
    listCollection: async (req, res) => {
      let path = req.path[0];
      let k = await data.listCollection(req.params.collection);
      res.status(200).send(k);
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
    update: async (req, res) => {}
  };
};
