import m from "mithril";

import tagl from "tagl-mithril";

const {
  form,
  formfield,
  a,
  input,
  h1,
  ol,
  li,
  section,
  article,
  header,
  footer
} = tagl(m);

let dataService = (() => {
  return {
    listCollections: cb => {
      m.request({ url: "/api/data" }).then(cb);
    },
    addCollection: (name, cb) => {
      m.request({ url: `/api/data/${name}` }).then(cb);
    }
  };
})();

let collections = [];
let newCollectionName = '';

let update = ()=>dataService.listCollections(l => (collections = l));

update();

m.mount(document.body, {
  view(vnode) {
    return [
      h1("Collections"),
      ol(collections.map(li)),
      form(
        formfield(
          input({
            value:newCollectionName,
              oninput:m.withAttr('value',v=>newCollectionName=v)
          }),
          a.button(
            {
              onclick: ()=> dataService.addCollection(newCollectionName,update)
            },
            "+"
          )
        )
      )
    ];
  }
});
