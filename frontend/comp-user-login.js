import m from "mithril";
import tagl from "tagl-mithril";
import userService from "./user-service";

const { form, formfield, input, label, a } = tagl(m);

let email = "";
let password = "";

export default {
  view(vnode) {
    return userService.loggedIn()
      ? form(a.button.secondary({ onclick: () => userService.logout() }, "Logout"))
      : [
          form(
            formfield(
              label("Email"),
              input({
                type: "text",
                oninput: m.withAttr("value", v => (email = v))
              })
            ),
            formfield(
              label("Password"),
              input({
                type: "password",
                oninput: m.withAttr("value", v => (password = v))
              })
            ),
            a.button.tertiary(
              { onclick: () => userService.login(email, password,m.redraw) },
              "Login"
            )
          )
        ];
  }
};
