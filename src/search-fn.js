const deepEqualAsymmetric = (o1, o2) => {
  if (typeof o1 === "object") {
    if ("$lt" in o1) return o2 < o1["$lt"];
    if ("$gt" in o1) return o2 > o1["$gt"];
    if ("$le" in o1) return o2 <= o1["$le"];
    if ("$ge" in o1) return o2 >= o1["$ge"];
    if ("$before" in o1) return o1["$before"] < o2;
    if ("$after" in o1) return o1 > o2;
    if ("$contains" in o1) return (o2 || "").indexOf(o1["$contains"]) >= 0;
    if ("$ne" in o1) return o2 !== o1["$ne"];
    if ("$in" in o1) return !!o1["$in"].find(e => e === o2);
  }

  if (typeof o1 === "string") return o1 === o2;
  if (typeof o1 === "number") return o1 === o2;
  if (typeof o1 === "bigint") return o1 === o2;
  if (typeof o1 === "boolean") return o1 === o2;
  if (typeof o1 === "symbol") return o1 === o2;
  if (typeof o1 === "undefined") return o1 === o2;

  return Object.keys(o1).every(k => deepEqualAsymmetric(o1[k], o2[k]));
};

const createPredicate = example => {
  return obj => {
    return deepEqualAsymmetric(example, obj);
  };
};

const search = (collection, example) => {
  let predicate = createPredicate(example);
  return collection.filter(predicate);
};

module.exports = {
  search
};
