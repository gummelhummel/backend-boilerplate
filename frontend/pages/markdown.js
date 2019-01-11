import marked from "marked";
import m from "mithril";
import tagl from "tagl-mithril";

import UserService from "../services/user";

const { a, div } = tagl(m);

export default {
  oninit(vnode) {
    this.onupdate(vnode);  
  },

  onupdate(vnode) {
    if (vnode.attrs.id !== this.id) {
      this.id = vnode.attrs.id;
      m.request({
        url: `/api/files/${this.id}`,
        deserialize: d => d
      }).then(r => (this.content = r));
    }
  },
  view(vnode) {
    return div.container(
      UserService.whenLoggedIn(
        a.button({ onclick: () => m.route.set(`/files/${vnode.attrs.id}`) }, "✎")
      ),
      div.row(
        div["col-md-12"](
          this.content ? m.trust(marked(this.content)) : div.spinner()
        )
      )
    );
  }
};
