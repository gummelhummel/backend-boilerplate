import m from "mithril";
import tagl from "tagl-mithril";

import UserService from "./service-user";
import UserLogin from "./comp-user-login";
import FileUpload from "./comp-file-upload";
import FileList from "./comp-file-list";

import ImagePage from "./page-images";
import FilePage from "./page-files";
import MarkdownPage from "./page-markdown";

import dataService from "./service-data";

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

let collections = [];
let newCollectionName = "";

let update = () => dataService.listCollections(l => (collections = l));

update();

let pages = [];

const updatePageList = () => {
  UserService.request({
    url: "/api/data/search/_files",
    method: "POST",
    data: {
      mimetype: { $contains: "markdown" }
    }
  }).then(_pages => (pages = _pages));
};

updatePageList();

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
      "/files": FilePage,
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
      "/profile": Page,
      "/page/:id": MarkdownPage
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
        a.button.logo(
          {
            onclick: () => {
              m.route.set("/home");
            }
          },
          "☃ ContEase"
        ),
        pages.map(page=>a.button({ onclick: () => m.route.set(`/page/${page._id}`) }, page.originalname.replace('.md',''))),        
        a.button({ href: "/404" }, "404"),
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
