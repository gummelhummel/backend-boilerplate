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
  pre,
  button,
  br,
  input,
  textarea
} = tagl(m);

let path = [];
let list = [];
let content = "";

const fetchCurrentPath = () => {
  m.request({
    url: `http://localhost:3000/api/data/${path.join("/")}`
  }).then(r => {
    console.log("r", r);
    if (Array.isArray(r)) {
      list = r;
      content = "";
    } else {
      list = [];
      content = r;
    }
  });
};

let newPath = "";
let newData = "";

const createPath = () => {
  console.log(newPath);
  m.request({
    method: "POST",
    url: `http://localhost:3000/api/data/${[...path, newPath].join("/")}`,
    data: newData !== "" ? newData : undefined
  });
  newPath = "";
  newData = "";
};

m.mount(document.querySelector("#app"), {
  view(vnode) {
    return [
      nav(
        path.map((item, idx) =>
          a(
            {
              onclick: () => {
                path.splice(idx, path.length - idx);
                fetchCurrentPath();
              }
            },
            item
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
                      fetchCurrentPath();
                    }
                  },
                  item
                )
              )
            ),
            li(
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
          ),
          pre(JSON.stringify(content, null, 2))
        )
      ),
      footer()
    ];
  }
});

fetchCurrentPath();
