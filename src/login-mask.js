import m from "mithril";
import tagl from "tagl-mithril";

import userService from "./user-service";

const { a, div, input, form, fieldset, legend, label } = tagl(m);

let email = "";
let password = "";

const login = () => userService.login(email, password);
const signup = () => userService.signup(email, password);

export default {
  view: vnode => [
    form(
      fieldset(
        legend("Login"),
        label({ for: "email" }, "Email"),
        input.$email({
          oninput: m.withAttr("value", v => (email = v)),
          value: email,
          type: "email",
          placeholder: "email@gudrun.de"
        }),
        label({ for: "password" }, "Password"),
        input.$password({
          oninput: m.withAttr("value", v => (password = v)),
          value: password,
          type: "password",
          placeholder: ""
        }),
        a.button.tertiary({ onclick: login }, "Submit")
      )
    )
  ]
};
