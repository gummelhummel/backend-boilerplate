import m from "mithril";
import tagl from "tagl-mithril";

import userService from "./user-service";

import UserLogin from "./comp-user-login";

import FileUpload from "./comp-file-upload";
import FileList from "./comp-file-list";

const {
  form,
  formfield,
  a,
  input,
  h1,
  nav,
  ol,
  li,
  section,
  article,
  label,
  header,
  footer,
  pre,
  div
} = tagl(m);

let dataService = (() => {
  return {
    listCollection: (collection, cb) => {
      userService.request({ url: `/api/data/${collection}` }).then(cb);
    },
    listCollections: cb => {
      userService.request({ url: "/api/data" }).then(cb);
    },
    get: (collection, id, cb) => {
      userService.request({ url: `/api/data/${collection}/${id}` }).then(cb);
    },
    addCollection: (name, cb) => {
      userService
        .request({
          url: `/api/data/${name}`,
          method: "POST",
          data: {
            hey: "data"
          }
        })
        .then(cb);
    }
  };
})();

let collections = [];
let newCollectionName = "";
let files = [];

let update = () => dataService.listCollections(l => (collections = l));
let updateFiles = () =>
  dataService.listCollection("_files", l => {
    files = l.map(p => p._id);
    files.forEach((id, idx) =>
      dataService.get("_files", id, f => (files[idx] = f))
    );
  });

update();
updateFiles();

class Page {
  view(vnode) {
    return h1("Page");
  }
}

class Router {
  oncreate(vnode) {
    m.route(vnode.dom, "/", {
      "/": UserLogin,
      "/home": Page,
      "/files": {
        view(vnode) {
          return [m(FileUpload, {}, "ll"), m(FileList, { files: files }, "ll")];
        }
      },
      "/documents": {
        view(vnode) {
          return [
            h1("Collections"),
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
              : null
          ];
        }
      },
      "/images": Page,
      "/profile": Page
    });
  }
  view(vnode) {
    return div.$router();
  }
}

m.mount(document.body, {
  view(vnode) {
    return [
      header(
        a.button.logo("ContEase"),
        userService.loggedIn()
          ? [
              label.drawerToggle.persistent({ for: "drawer-control" }),
              input.drawer.persistent.$drawerControl({
                type: "checkbox",
                for: "drawer-control"
              }),
              nav["col-md-4"](
                label.drawerClose({ for: "drawer-control" }),
                a(
                  {
                    onclick: () => {
                      m.route.set("/home");
                    }
                  },
                  "Home"
                ),
                a(
                  {
                    onclick: () => {
                      m.route.set("/files");
                    }
                  },
                  "Files"
                ),
                a(
                  {
                    onclick: () => {
                      m.route.set("/documents");
                    }
                  },
                  "Documents"
                ),
                a(
                  {
                    onclick: () => {
                      m.route.set("/images");
                    }
                  },
                  "Images"
                ),
                a(
                  {
                    onclick: () => {
                      m.route.set("/profile");
                    }
                  },
                  "My Profile"
                )
              )
            ]
          : null
      ),
      m(Router),
      footer(m(UserLogin))
      //   pre(JSON.stringify(files, undefined, 2))
    ];
  }
});
