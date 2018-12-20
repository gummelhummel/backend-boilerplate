const { expect } = require("chai");
const { testUtils, queryApi } = require("./helpers");

describe("App", () => {
  testUtils.startApi();

  describe("GET /", () => {
    it("returns some html", async () => {
    const { body } = await queryApi("GET", "/");
    expect(body).to.include("<!DOCTYPE html>");
    });
  });

  describe("GET /index.html", () => {
    it("returns some html", async () => {
    const { body } = await queryApi("GET", "/index.html");
    expect(body).to.include("<!DOCTYPE html>");
    });
  });
});
