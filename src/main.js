import m from "mithril";
import tagl from "tagl-mithril";
import { text } from "body-parser";
import { createRequireFromPath } from "module";

const {
  div,
  abbr,
  ul,
  ol,
  li,
  section,
  article,
  nav,
  h1,
  p,
  footer,
  header,
  a,
  label,
  pre,
  button,
  br,
  input,
  textarea
} = tagl(m);

let path = [];
let list = [];
let content = "";

const fetchPath = (
  _path = path,
  cb = r => {
    console.log("r", r);
    if (Array.isArray(r)) {
      list = r;
      content = "";
    } else {
      list = [];
      content = r;
    }
  }
) => {
  m.request({
    url: `http://localhost:3000/api/data/${(_path || []).join("/")}`,
    deserialize: function(value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
  }).then(cb);
};

let topmenu = [];
fetchPath((path = []), r => (topmenu = r));

let newPath = "";
let newData = "";

const createPath = () => {
  console.log(newPath);
  m.request({
    method: "POST",
    url: `http://localhost:3000/api/data/${[...path, newPath].join("/")}`,
    data: newData !== "" ? { content: newData } : undefined
  });
  newPath = "";
  newData = "";
};

m.mount(document.querySelector("#app"), {
  view(vnode) {
    return [
      header(
        a.logo.button("Stuff"),
        topmenu.map(t =>
          a.button(
            {
              onclick: () => {
                path = [t];
                fetchPath();
              }
            },
            t
          )
        )
      ),

      nav(
        label.drawerToggle.persistent({ for: "drawer-control" }),
        input.drawer.persistent.$drawerControl({ type: "checkbox" }),
        div(
          label.drawerClose({ for: "drawer-control" }),
          m("a[href='#']", "Home")
        ),

        div.buttonGroup(
          a.button(
            {
              onclick: () => {
                path = [];
                fetchPath();
              }
            },
            "/"
          ),
          path.map((item, idx) =>
            a.button(
              {
                onclick: () => {
                  path.splice(idx + 1, path.length - idx);
                  fetchPath();
                }
              },
              item
            )
          )
        )
      ),
      section(
        article(
          ol(
            list.map(item =>
              li(
                a(
                  {
                    onclick: () => {
                      path.push(item);
                      fetchPath();
                    }
                  },
                  item
                )
              )
            ),
            content.length === 0
              ? li(
                  input({
                    value: newPath,
                    oninput: m.withAttr("value", v => (newPath = v))
                  }),
                  button(
                    {
                      onclick: () => {
                        createPath();
                      }
                    },
                    "+"
                  ),
                  br(),
                  textarea({
                    value: newData,
                    oninput: m.withAttr("value", v => (newData = v))
                  })
                )
              : pre(JSON.stringify(content, null, 2))
          )
        )
      ),
      footer()
    ];
  }
});

fetchPath();
