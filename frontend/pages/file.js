import m from "mithril";
import tagl from "tagl-mithril";

import marked from "marked";

import UserService from "../services/user";
import DataService from "../services/data";

const { a, div, h1, textarea, span } = tagl(m);

let file = null;

let content = "";
let preview = true;

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

/*
 * This ugliness can be replaced by a text model closure.
 */
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
        h1("File ", vnode.attrs.id),
        a.small.button({ onclick: () => (preview = !preview) }, "preview"),
        a.small.button({ onclick: () => ugly.insertAtCaret(":-)") }, ":-("),
        a.small.button(
          {
            onclick: () => {
              let url = prompt("Please enter the URL");
              let text = prompt("Please enter the link text");
              ugly.insertAtCaret(`[${text}](${url} "${url}")`);
            }
          },
          span.iconLink()
        ),
        div.row(
          div[preview ? "col-md-6" : "col-md-12"](
            m(InsertableTextArea, {
              value: content,
              oninput: m.withAttr("value", v => (content = v))
            })
          ),
          preview ? div["col-md-6"](m.trust(marked(content))) : null
        ),
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
