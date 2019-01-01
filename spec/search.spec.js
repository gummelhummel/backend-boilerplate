const { expect } = require("chai");
const { testUtils, queryApi } = require("./helpers");

const fn = require("../src/search-fn");

let testCollection = [
  {
    _id: 1,
    name: "Georg",
    age: 78,
    nationality: "D",
    lastmodified: Date.parse("2018-12-31 3:13:56:222 PM")
  },
  {
    _id: 2,
    name: "Hans",
    age: 21,
    nationality: "A",
    lastmodified: Date.parse("2018-11-31 3:13:56:222 PM")
  },
  {
    _id: 3,
    name: "Joachim",
    age: 36,
    nationality: "D",
    lastmodified: Date.parse("2018-10-31 3:13:56:222 PM")
  },
  {
    _id: 4,
    name: "Gregor",
    age: 178,
    nationality: "RO",
    lastmodified: Date.parse("2010-12-31 3:13:56:222 PM")
  },
  {
    _id: 5,
    name: "Waldemar",
    age: 5,
    nationality: "D",
    lastmodified: Date.parse("1970-12-31 3:13:56:222 PM")
  }
];

describe("Search", () => {
  testUtils.startApi();

    describe("special queries",()=>{
        it("will return all elements on an empty query",async()=>{
            expect(fn.search(testCollection,{})).to.deep.equal(testCollection);
        });
    });

  describe("exact match", () => {
    it("returns a value with exactly matching id field", async () => {
      expect(fn.search(testCollection, { _id: 1 })).to.deep.equal([
        testCollection[0]
      ]);
    });

    it("returns multiple entries with same nationality", () => {
      expect(fn.search(testCollection, { nationality: "D" })).to.deep.equal([
        testCollection[0],
        testCollection[2],
        testCollection[4]
      ]);
    });

    it("returns no entries when a not existing property is requested", () => {
      expect(fn.search(testCollection, { klo: "" })).to.deep.equal([]);
    });

    it("returns one entry when requesting an age that is only contained once", () => {
      expect(fn.search(testCollection, { age: 178 })).to.deep.equal([
        testCollection[3]
      ]);
    });
  });

  describe("numeric queries", () => {
    it("{age: {$lt: 128}}", () => {
      expect(fn.search(testCollection, { age: { $lt: 128 } })).to.deep.equal(
        testCollection.filter(e => e.age < 128)
      );
    });
    it("{age: {$gt: 128}}", () => {
      expect(fn.search(testCollection, { age: { $gt: 128 } })).to.deep.equal(
        testCollection.filter(e => e.age > 128)
      );
    });
    it("{age: {$ge: 78}}", () => {
      expect(fn.search(testCollection, { age: { $ge: 78 } })).to.deep.equal(
        testCollection.filter(e => e.age >= 78)
      );
    });
    it("{age: {$le: 78}}", () => {
      expect(fn.search(testCollection, { age: { $le: 78 } })).to.deep.equal(
        testCollection.filter(e => e.age <= 78)
      );
    });
  });

  describe("boolean queries", () => {
    it("{age: { $ne: 178 },_id: {$gt:2}}", () => {
      expect(
        fn.search(testCollection, { age: { $ne: 178 }, _id: { $gt: 2 } })
      ).to.deep.equal(testCollection.filter(e => e.age !== 178 && e._id > 2));
    });

    it("{age: { $in: [178, 36] },_id: {$gt:2}}", () => {
      expect(
        fn.search(testCollection, { age: { $in: [178, 36] }, _id: { $gt: 2 } })
      ).to.deep.equal(
        testCollection.filter(e => (e.age === 178 || e.age === 36) && e._id > 2)
      );
    });

    it("{age: { $in: [1780, 236] },_id: {$gt:2}}", () => {
      expect(
        fn.search(testCollection, {
          age: { $in: [1780, 236] },
          _id: { $gt: 2 }
        })
      ).to.deep.equal(
        testCollection.filter(
          e => (e.age === 1780 || e.age === 236) && e._id > 2
        )
      );
    });
  });

  describe("mixed queries", () => {
    it("{age: {$lt: 128}, nationality: 'D'}", () => {
      expect(
        fn.search(testCollection, { age: { $lt: 128 }, nationality: "D" })
      ).to.deep.equal(
        testCollection.filter(e => e.age < 128 && e.nationality === "D")
      );
    });
    it("{age: { $lt: 128 },_id: {$lt:3}}", () => {
      expect(
        fn.search(testCollection, { age: { $lt: 128 }, _id: { $lt: 3 } })
      ).to.deep.equal(testCollection.filter(e => e.age < 128 && e._id < 3));
    });

    it("{nationality: { $in: ['D', 'RO'] },_id: {$ge:2}}", () => {
        expect(
          fn.search(testCollection, { nationality: { $in: ['D', 'RO'] }, _id: { $ge: 2 } })
        ).to.deep.equal(
          testCollection.filter(e => (e.nationality === 'D' || e.nationality === 'RO') && e._id >= 2)
        );
      });

  });
});
