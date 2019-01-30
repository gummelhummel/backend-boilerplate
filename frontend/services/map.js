import m from "mithril";

let map = null;

let revealers = [];

export default {
  registerMap(map_) {
    map = map_;
  },
  map() {
    return map;
  },
  registerClick(cb) {
    map && map.on("click", cb);
  },
  unregisterClick(cb) {
    map && map.off("click", cb);
  },
  reveal: () => {
    revealers.forEach(c => c());
  },
  addRevealer: cb => revealers.push(cb)
};
