module.exports = (config, services) => {
  const upload = (req, res) => {
    console.log(req.originalUrl);
    console.log(req);
    res.status(201).send("File transfered");
  };

  const get = (req, res) => {
    console.log(req.originalUrl);
  };

  const list = (req, res) => {
    console.log(req.originalUrl);
  };

  return {
    get,
    upload,
    list
  };
};
