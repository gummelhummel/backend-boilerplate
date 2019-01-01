const { expect } = require("chai");
const { testUtils, queryApi } = require("./helpers");

describe("Api Data", () => {
  testUtils.startApi();

  beforeEach(async () => await testUtils.deleteAllData());

  describe("GET /api/data/", () => {
    describe("When there is no data", () => {
      it("returns an empty list", async () => {
        const { body } = await queryApi("GET", "/api/data/");
        expect(body).to.deep.equal([]);
      });

      it("returns 200", async () => {
        const { statusCode } = await queryApi("GET", "/api/data/");
        expect(statusCode).to.equal(200);
      });
    });

    describe("When there is some data", () => {
      beforeEach(async () => {
        await testUtils.addProduct();
      });

      it("returns a list of collections", async () => {
        const { body } = await queryApi("GET", "/api/data/");
        expect(body).to.deep.equal(["products"]);
      });

      it("returns 200", async () => {
        const { statusCode } = await queryApi("GET", "/api/data/");
        expect(statusCode).to.equal(200);
      });
    });
  });

  describe("GET /api/data/:collection/:id", () => {
    describe("When there is some data", () => {
      beforeEach(async () => {
        await testUtils.deleteAllData();

        const { body } = await queryApi("GET", "/api/data/products/");

        await testUtils.addProduct();
      });

      it("lists the ids in the collection", async () => {
        const { body } = await queryApi("GET", "/api/data/products/");
        expect(body).length(1);
      });
    });

    describe("When there is no data", () => {
      it("returns some html", async () => {
        const { body } = await queryApi("GET", "/index.html");
        expect(body).to.include("<!DOCTYPE html>");
      });
    });
  });

  describe("POST /api/data/search/:collection", () => {
    beforeEach(async () => {
      await testUtils.deleteAllData();
      const { body1 } = await queryApi("GET", "/api/data/products/");
      await testUtils.addProduct({ kaleidoscope: 123 });
      await testUtils.addProduct({ kaleidoscope: 125 });
      await testUtils.addProduct({ kaleidoscope: 127 });
      await testUtils.addProduct({ kaleidoscope: 127 });
      await testUtils.addProduct();
      const { body } = await queryApi("GET", "/api/data/products/");
      body.forEach(async o => {
        const { body } = await queryApi("GET", `/api/data/products/${o._id}`);
      });
    });

    it("returns 200", async () => {
      const { statusCode } = await queryApi(
        "POST",
        "/api/data/search/products"
      );
      expect(statusCode).to.equal(200);
    });

    it("an empty search will return everything (one object)", async () => {
      const { body } = await queryApi("POST", "/api/data/search/products", {
        body: {}
      });
      expect(body).length(5);
    });

    it("a search can return one object", async () => {
      const { body } = await queryApi("POST", "/api/data/search/products", {
        body: {
          kaleidoscope: 125
        }
      });
      expect(body).length(1);
    });

    it("a search can return two objects", async () => {
      const { body } = await queryApi("POST", "/api/data/search/products", {
        body: {
          kaleidoscope: 127
        }
      });
      expect(body).length(2);
    });

    it("a search can return no objects", async () => {
      const { body } = await queryApi("POST", "/api/data/search/products", {
        body: {
          kaleidoscope: 1270
        }
      });
      expect(body).length(0);
    });

    it("a more interesting search can also be performed", async () => {
      const { body } = await queryApi("POST", "/api/data/search/products", {
        body: {
          kaleidoscope: { $ne: 127 }
        }
      });
      expect(body).length(3);
      body.map(o => o.kaleidoscope).forEach(b => console.log(b));

      body.forEach(o => expect(o.kaleidoscope).not.to.equal(127));
    });
  });
});
