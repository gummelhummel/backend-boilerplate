const { expect } = require("chai");
const config = require("../conf")();

describe("Database", () => {
  it("can be cleared on start", async () => {
    const database = require("../src/database")(config);
    await database.clear();
  });

  it("a collection can be created", async () => {
    const database = require("../src/database")(config);
    await database.createCollection("name");
    expect(await database.listCollections()).to.contain("name");
  });

  it("can save an object", async () => {
    const database = require("../src/database")(config);
    await database.createCollection("name");
    expect(
      await database.save("name", {
        test: "test"
      })
    ).to.be.string("");
  });

  it("can get a saved object", async () => {
    const database = require("../src/database")(config);
    await database.createCollection("name");
    let obj = {
      test: "test"
    };
    let id = await database.save("name", obj);
    expect(await database.get("name", id)).to.deep.equal({ ...obj, _id: id });
  });

  it("returns undefined if object not found", async () => {
    const database = require("../src/database")(config);
    await database.createCollection("name");
    let id = 123;
    expect(await database.get("name", id)).to.deep.equal(undefined);
  });

  it("creates a collection when collection not found", async () => {
    const database = require("../src/database")(config);
    await database.get("noname", "aa");
    expect(await database.listCollections()).to.contain("noname");
  });

  it("listCollection will return an sparse set of objects", async () => {
    const database = require("../src/database")(config);
    const nn = 10;
    for (let k = 0; k < nn; k++) {
      await database.save("test", { num: Math.random(), name: "kk" + k });
    }
    expect(await database.listCollection("test")).to.have.length(nn);
    let res = await database.listCollection("test", ["_id"]);
    res.forEach(e => {
      expect(e).to.have.property("_id");
      expect(e).not.have.property("num");
    });
  });
});
