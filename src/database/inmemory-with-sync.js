const fs = require("fs");
const inmemory = require("./inmemory");

const standardFileName = "test.db";

module.exports = config => {
  const fileName = config.fileName || standardFileName;

  const read = async () =>
    new Promise((res, rej) =>
      fs.readFile(fileName, (err, data) => res(err ? {} : JSON.parse(data)))
    );

  const write = async data =>
    new Promise((res, rej) =>
      fs.writeFile(fileName, JSON.stringify(data), (err, data) => res)
    );
    
  return inmemory(config, read, write);
};
