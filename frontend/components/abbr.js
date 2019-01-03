import m from "mithril";
import tagl from "tagl-mithril";

const { span, abbr } = tagl(m);

export default {
  view(vnode) {
    let t = vnode.attrs.text || "";
    let w = vnode.attrs.width || 20;
    return span(t.length > w ? abbr({ title: t }, t.substr(0, w), "...") : t);
  }
};
