module.exports = (function() {
  let cache = {};
  return {
    get: key => {
      return cache[key];
    },
    set: (key, val) => {
      cache[key] = val;
    }
  };
})();
