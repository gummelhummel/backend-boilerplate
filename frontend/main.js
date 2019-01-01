import m from "mithril";
import tagl from "tagl-mithril";

import UserService from "./service-user";
import UserLogin from "./comp-user-login";
import FileUpload from "./comp-file-upload";
import FileList from "./comp-file-list";

import ImagePage from "./page-images";

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
      UserService.request({ url: `/api/data/${collection}` }).then(cb);
    },
    listCollections: cb => {
      UserService.request({ url: "/api/data" }).then(cb);
    },
    get: (collection, id, cb) => {
      UserService.request({ url: `/api/data/${collection}/${id}` }).then(cb);
    },
    addCollection: (name, cb) => {
      UserService.request({
        url: `/api/data/${name}`,
        method: "POST",
        data: {
          hey: "data"
        }
      }).then(cb);
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
          return [            UserService.loggedIn()?
            m(FileUpload, {}, "ll"):null, m(FileList, { files: files }, "ll")];
        }
      },
      "/documents": {
        view(vnode) {
          return [
            h1("Collections"),
            ol(collections.map(e => li(e))),
            UserService.loggedIn()
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
      "/images": ImagePage,
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
        a.button.logo("☃ ContEase"),
        UserService.loggedIn()
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
