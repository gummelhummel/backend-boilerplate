import m from "mithril";
import tagl from "tagl-mithril";

import UserService from "./services/user";
import UserLogin from "./components/user-login";

import ImagePage from "./pages/images";
import FilesPage from "./pages/files";
import FilePage from "./pages/file";
import MarkdownPage from "./pages/markdown";
import CollectionsPage from './pages/collections'
import MapPage from './pages/map';

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
    m.route(vnode.dom, "/home", {
      "/login": UserLogin,
      "/home": MapPage,
      "/files": FilesPage,
      "/files/:id": FilePage,
      "/documents": CollectionsPage,
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
              label.button.drawerToggle.persistent({ for: "drawer-control" }),
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
//      footer(m(UserLogin))
      //   pre(JSON.stringify(files, undefined, 2))
    ];
  }
});


