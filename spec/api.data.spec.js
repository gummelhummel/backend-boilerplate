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
});
