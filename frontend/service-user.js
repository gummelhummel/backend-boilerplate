import m from "mithril";

let user = null;

user = JSON.parse(localStorage.getItem("user"));

const save = () => {
  localStorage.setItem("user", JSON.stringify(user));
};

module.exports = {
  loggedIn: () => user != null,
  logout: () => {
    user = null;
    save();
  },
  login: (username, password, cb) =>
    m
      .request({
        url: "/api/users/session",
        method: "POST",
        data: {
          username,
          password
        }
      })
      .then(response => {
        console.log(response);
        user = response;
        save();
        cb();
      }),
  signup: (username, password) =>
    m.request({
      url: "/api/users",
      method: "POST",
      data: {
        username,
        password
      }
    }),
  request: options => {
    let headers = options.headers || {};
    if (user) {
      headers["Authorization"] = "Bearer " + user.access_token;
    }
    options.headers = headers;
    return m.request({ ...options });
  }
};
