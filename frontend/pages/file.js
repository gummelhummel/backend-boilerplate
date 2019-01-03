import m from "mithril";
import tagl from "tagl-mithril";

import UserService from "../services/user";
import DataService from "../services/data";
import { write } from "fs";

const { a, div, h1, textarea } = tagl(m);

let file = null;

let content = "";

let updateFile = id =>
  DataService.get("_files", id, l => {
    file = l;
    UserService.request({
      url: `/api/files/${id}`,
      deserialize: d => d
    }).then(c => (content = c));
  });

let writeFile = (id, data) => {
  UserService.request({
    url: `/api/files/${id}`,
    serialize: d=>d,
    data,
    method: "PATCH"
  });
};

export default {
  onupdate(vnode) {
    if (this.id !== vnode.attrs.id) {
        this.id = vnode.attrs.id;
      updateFile(vnode.attrs.id);
    }
  },
  view(vnode) {
    return [
      div.container(
        h1("file ", vnode.attrs.id),
        textarea.fullWidth.halfHeight({
          value: content,
          oninput: m.withAttr("value", v => (content = v))
        }),
        div.buttonGroup(
          a.primary.button(
            {
              onclick: () => {
                writeFile(vnode.attrs.id, content);
              }
            },
            "Save"
          ),
          a.secondary.button("Save"),
          a.tertiary.button("Save")
        )
      )
    ];
  }
};
