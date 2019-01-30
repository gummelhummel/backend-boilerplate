import m from "mithril";
import tagl from "tagl-mithril";
import File from './file';

const {
  h2,
  div,
} = tagl(m);

export default {
  view(vnode) {
    return [
      h2("Files"),
      div.row(
        vnode.attrs.files.map((file, idx) => [
          m(File,{file,idx})          
        ])
      )
    ];
  }
};
