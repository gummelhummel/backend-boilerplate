import m from "mithril";
import tagl from "tagl-mithril";

import UserService from "../services/user";
import DataService from "../services/data";
import { write } from "fs";

const { a, div, h1, textarea } = tagl(m);

let file = null;

let content = "";

HTMLTextAreaElement.prototype.insertAtCaret = function(text) {
  text = text || "";
  if (document.selection) {
    this.focus();
    var sel = document.selection.createRange();
    sel.text = text;
  } else if (this.selectionStart || this.selectionStart === 0) {
    var startPos = this.selectionStart;
    var endPos = this.selectionEnd;
    this.value =
      this.value.substring(0, startPos) +
      text +
      this.value.substring(endPos, this.value.length);
    this.selectionStart = startPos + text.length;
    this.selectionEnd = startPos + text.length;
  } else {
    this.value += text;
  }
  this.oninput({ currentTarget: { value: this.value } });
  this.focus();
};

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
    serialize: d => d,
    data,
    method: "PUT"
  });
};

let ugly = null;

class InsertableTextArea {
  oncreate(vnode) {
    ugly = vnode.dom;
  }
  view(vnode) {
    return textarea.fullWidth.halfHeight(Object.assign({}, vnode.attrs));
  }
}

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
        a.button({ onclick: () => ugly.insertAtCaret("Hello") }),
        m(InsertableTextArea, {
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
