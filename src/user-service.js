import m from "mithril";

export default {
  signup: (email, password) => {
    m.request({
      url: "/users",
      method: "POST",
      data: {
        username:email,
        password
      }
    });
  },
  login: (email, password) => {
    m.request({
        url: "/sessions/create",
        method: "POST",
        data: {
          username:email,
          password
        }
      });  
  },
  request: options => {
    return loggedIn
      ? m.request({
          ...options,
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        })
      : m.request(options);
  }
};
