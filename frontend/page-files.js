import m from "mithril";
import tagl from "tagl-mithril";

import UserService from "./service-user";
import DataService from "./service-data";

import FileUpload from "./comp-file-upload";
import FileList from "./comp-file-list";

const { h1 } = tagl(m);

let files = [];
let updateFiles = () =>
  DataService.listCollection("_files", l => {
    files = l.map(p => p._id);
    files.forEach((id, idx) =>
      DataService.get("_files", id, f => (files[idx] = f))
    );
  });
updateFiles();

export default {
  view(vnode) {
    return [
      UserService.loggedIn()
        ? m(FileUpload, { onupload: updateFiles }, "ll")
        : null,
      m(FileList, { files: files, ondelete: updateFiles }, "ll")
    ];
  }
};
