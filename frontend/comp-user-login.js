import m from "mithril";
import tagl from "tagl-mithril";
import userService from "./user-service";

const { form, formfield, input, label, button } = tagl(m);

let email = "";
let password = "";

export default {
  view(vnode) {
    return userService.loggedIn()
      ? form(button.secondary({ onclick: () => userService.logout() }, "Logout"))
      : [
          form(
            formfield(
              label("Email"),
              input({
                type: "email",
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
            button.tertiary(
              { onclick: () => userService.login(email, password) },
              "Login"
            )
          )
        ];
  }
};
