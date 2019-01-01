import m from "mithril";

let user = null;

module.exports = {
  loggedIn: () => user != null,
  logout: () => (user = null),
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
