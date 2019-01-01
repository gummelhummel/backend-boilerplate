import m from "mithril";
import tagl from "tagl-mithril";
import U from "./service-user";

const { label, form, formfield, input, button } = tagl(m);

const upload = (
  files,
  cb = () => {
    console.log("No Event defined");
  }
) => {
  var data = new FormData();
  for (var i = 0; i < files.length; i++) {
    data.append("file", files[i]);
  }
  U.request({
    method: "POST",
    url: "/api/files",
    data: data
  }).then(cb);
};

export default {
  view(vnode) {
    console.log(vnode.attrs.onupload)
    return [
      form(
        formfield(
          label({ for: "fileinput" }, "Select a file"),
          input.$fileinput({
            type: "file",
            multiple: true,
            placeholder: "Select a file",
            oninput: m.withAttr("files", v => upload(v, vnode.attrs.onupload))
          })
        ),
     //   button({ onclick: upload }, "Upload")
      )
    ];
  }
};
