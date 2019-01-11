var optional = value => {
  var isPresent = () => !!value;
  var map = fn => (isPresent() ? optional(fn(value)) : optional(null));
  var ifPresent = fn => (isPresent() ? fn(value) : null);
  return {
    isPresent,
    map,
    ifPresent
  };
};

var plus = (a, b) => a + b;

var range = (startInclusive, endExclusive) => {
  let result = [];
  for (let i = startInclusive; i < endExclusive; i++) {
    result.push(i);
  }
  return result;
};

var nFrom = (start, number) => {
  return range(start, start + number);
};

var interval = (startInclusive, endInclusive) => {
  return range(startInclusive, endInclusive + 1);
};

var zipWith = (fn, ...arrs) => {
  arguments.l;
  return range(0, Math.min(...arrs.map(arr => arr.length))).map(i =>
    fn(...arrs.map(arr => arr[i]))
  );
};

var tail = arr => {
  return arr[arr.length - 1];
};

var head = arr => {
  return arr[0];
};

var isEmpty = arr => {
  return arr.length === 0;
};

var withoutLast = (arr = []) => {
  return arr.length > 1 ? arr.slice(0, arr.length - 1) : [];
};

var flatten = (arr, depth = 100) => {
  var merged = [];
  for (let step = 0; step < depth; step++) {
    if (merged.length === 0) {
      merged = arr.slice(0);
    }
    let l1 = merged.length;
    merged = [].concat.apply([], merged);
    let l2 = merged.length;
    if (l1 === l2) break;
  }
  return merged;
};

var foldLeft = (arr, start, fn) => {
  return arr.reduce(fn, start);
};
var foldRight = (arr, start, fn) => {
  return arr.reverse().reduce(fn, start);
};

var and = (acc, curr) => acc && curr;
var not = fn => !fn;

var id = n => n;
var succ = n => n + 1;
var pred = n => n - 1;

var directions = [id, succ, pred];

const contains = (arr, e) => {
  return arr.indexOf(e) >= 0;
};

const without = (arr1, arr2) => {
  return arr1.filter(e => !contains(arr2, e));
};

const unique = arr => {
  let r = [];
  arr.forEach(e => (!contains(r, e) ? r.push(e) : 0));
  return r;
};

const reverse = arr =>
  range(0, arr.length)
    .map(i => arr.length - 1 - i)
    .map(i => arr[i]);

const withoutIndex = (arr, n) => {
  let r = arr.slice(0, arr.length);
  r.splice(n, 1);
  return r;
};

const permut = a => {
  if (a.length === 1) return a;
  let result = [];
  a.forEach((e, idx) => {
    const c = a.slice();
    c.splice(idx, 1);
    const r = permut(c);
    r.forEach(el => result.push(flatten([e, el])));
  });
  return result;
};

const getFive = a => {
  const result = [];
  a.forEach(e1 =>
    a.map(e2 =>
      a.map(e3 => a.map(e4 => a.map(e5 => result.push([e1, e2, e3, e4, e5]))))
    )
  );
  return result;
};

const allNTuples = (arr, n, sol = []) => {
  return n === 0
    ? sol
    : flatten(
        arr.map((a, i) =>
          allNTuples(
            withoutIndex(arr, i),
            n - 1,
            sol.length > 0 ? sol.map(s => [...s, a]) : [[a]]
          )
        ),
        1
      );
};

const deepEqual = (o1, o2) => {
  return Array.isArray(o1) || typeof o1 === "object"
    ? Object.keys(o1).length === Object.keys(o2).length &&
        Object.keys(o1).every(k => deepEqual(o1[k], o2[k]))
    : o1 === o2;
};

const fail = msg => {
  throw new Error(msg);
};

const failCB = msg => () => {
  throw new Error(msg);
};

const when = (cond, cb) => (cond ? cb() : (() => {})());
const whenNot = (cond, cb) => when(!cond, cb);

const testDeepEqual = () => {
  whenNot(true, failCB("whenNot should not throw on true condition"));
  whenNot(deepEqual({}, {}), failCB("two empty objects should be equal"));
  when(
    deepEqual({ n1: "" }, { n2: "" }),
    failCB("two non empty objects should be equal")
  );
  when(
    deepEqual({ p: 1, n1: "" }, { n1: "" }),
    failCB("two non empty objects should be equal")
  );

  when(
    deepEqual({ n1: "" }, { p: 1, n1: "" }),
    failCB("two non empty objects should be equal")
  );
  whenNot(
    deepEqual({ n1: "" }, { n1: "" }),
    failCB("two non empty objects should be equal")
  );
  whenNot(
    deepEqual({ n1: { n1: "" } }, { n1: { n1: "" } }),
    failCB("two nested objects should be equal")
  );
  when(
    deepEqual({ n1: { n1: "" } }, { n1: { n1: "1" } }),
    failCB("two nested objects should be not equal")
  );
  when(
    deepEqual(false, true),
    failCB("two not equal booleans should not be equal")
  );
  when(
    deepEqual([0], [1]),
    failCB("two different arrays should be considered different")
  );
  when(
    deepEqual([0], [0, 1]),
    failCB("two different arrays should be considered different")
  );
  whenNot(
    deepEqual([0, 1, 2], [0, 1, 2]),
    failCB("two equal booleans should be equal")
  );
  whenNot(
    deepEqual([0, {}, []], [0, {}, []]),
    failCB("two equal arrays should be equal")
  );
  whenNot(deepEqual(true, true), failCB("two equal booleans should be equal"));
  when(
    deepEqual({ n1: { n1: "" } }, { n1: { n1: "1" } }),
    failCB("two objects should be equal")
  );
  whenNot(deepEqual(1, 1), failCB("two ones should be equal"));
  whenNot(deepEqual(0, 0), failCB("two zeros should be equal"));
};

const expect = (o1, o2, msg) => {
  whenNot(deepEqual(o1, o2), () => {
    console.error("Inspect theese two objects", o1, o2);
    fail(msg);
  });
};

const testAllNTuples = () => {
  expect(allNTuples([0, 1, 2], 0), [], "n===0 should return []");
  expect(
    allNTuples([0, 1, 2], 1),
    [[0], [1], [2]],
    "n===1 should return arrays containing each element"
  );
  expect(
    allNTuples([0, 1, 2], 2),
    [[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]],
    "n===2 should return all two combinations in given order"
  );
  expect(
    allNTuples([0, 1, 2], 3),
    [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]],
    "n===2 should return all two combinations in given order"
  );
  expect(
    allNTuples([0, 1, 2, 3], 3),
    [
      [0, 1, 2],
      [0, 1, 3],
      [0, 2, 1],
      [0, 2, 3],
      [0, 3, 1],
      [0, 3, 2],
      [1, 0, 2],
      [1, 0, 3],
      [1, 2, 0],
      [1, 2, 3],
      [1, 3, 0],
      [1, 3, 2],
      [2, 0, 1],
      [2, 0, 3],
      [2, 1, 0],
      [2, 1, 3],
      [2, 3, 0],
      [2, 3, 1],
      [3, 0, 1],
      [3, 0, 2],
      [3, 1, 0],
      [3, 1, 2],
      [3, 2, 0],
      [3, 2, 1]
    ],
    "n===3 should return all two combinations in given order"
  );
};

const testAll = () => {
  testDeepEqual();
  testAllNTuples();

  console.error("All tests passed");
};

export default {
  flatten,
  foldLeft,
  foldRight,
  and,
  withoutLast,
  head,
  tail,
  nFrom,
  range,
  interval,
  optional,
  plus,
  id,
  succ,
  pred,
  zipWith,
  not,
  isEmpty,
  contains,
  without,
  unique,
  reverse,
  withoutIndex,
  permut,
  allNTuples,
  testAll
};
