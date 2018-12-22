import m from "mithril";
import tagl from "tagl-mithril";

import userService from "./user-service";

import UserLogin from "./comp-user-login";

import FileUpload from "./comp-file-upload";

const {
  form,
  formfield,
  a,
  input,
  h1,
  ol,
  li,
  section,
  article,
  header,
  footer
} = tagl(m);

let dataService = (() => {
  return {
    listCollections: cb => {
      userService.request({ url: "/api/data" }).then(cb);
    },
    addCollection: (name, cb) => {
      userService.request({ url: `/api/data/${name}`, method:'POST', data:{
        hey:'data'
      } }).then(cb);
    }
  };
})();

let collections = [];
let newCollectionName = "";

let update = () => dataService.listCollections(l => (collections = l));

update();

m.mount(document.body, {
  view(vnode) {
    return [
      m(FileUpload,{},'ll'),
      h1("Collections 2"),
      ol(collections.map(e => li(e))),
      userService.loggedIn()
        ? form(
            formfield(
              input({
                value: newCollectionName,
                oninput: m.withAttr("value", v => (newCollectionName = v))
              }),
              a.button(
                {
                  onclick: () =>
                    dataService.addCollection(newCollectionName, update)
                },
                "+"
              )
            )
          )
        : null,
      footer(m(UserLogin))
    ];
  }
});
