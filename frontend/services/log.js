import m from 'mithril';

const uuid = (() => {
  let cd = Date.now();
  let nounce = 0;

  return {
    draw: () => {
      let _cd = Date.now();
      if (_cd === cd) {
        nounce++;
      } else {
        cd = _cd;
        nounce = 0;
      }
      return _cd + "." + nounce;
    }
  };
})();

var logs = [];

const deleteById = id => {
  logs = logs.filter(l => l.id !== id);
  m.redraw();
};

const log = (msg, type = "", timeout = 0) => {
  let id = uuid.draw();
  logs.push({
    msg,
    id,
    type,
    showDismiss: timeout > 0
  });
  if (timeout > 0) {
    setTimeout(() => deleteById(id), timeout);
  }
};

export default {
  list: () => logs,
  error: (msg, timeout = 0) => log(msg, "error", timeout),
  warn: (msg, timeout = 0) => log(msg, "warning", timeout),
  info: (msg, timeout = 5000) => log(msg, "info", timeout),
  trace: (msg, timeout = 0) => log(msg, "trace", timeout),
  deleteById
};
