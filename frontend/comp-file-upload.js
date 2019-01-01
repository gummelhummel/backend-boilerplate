import m from "mithril";
import tagl from "tagl-mithril";
import U from './service-user';


const { label, form, formfield, input, button } = tagl(m);

const upload = (files) => {
    var data = new FormData()
    for (var i = 0; i < files.length; i++) {
        data.append("file", files[i])
    }
    U.request({
        method: "POST",
        url:'/api/files',
        data: data,
    });
}

export default {
  view(vnode) {
    return [
        form(
          formfield(
            label({for:'fileinput'},'Select a file'),
            input.$fileinput({
              type: "file",
              multiple:true,
              placeholder: "Select a file",
              oninput: m.withAttr("files", v => upload(v) )
            })
          ),
          button({ onclick: upload }, "Upload")
        )
      ];
  }
};
