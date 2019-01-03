import m from "mithril";
import tagl from "tagl-mithril";

import UserService from "../services/user";
import DataService from "../services/data";

import FileUpload from "../components/file-upload";
import FileList from "../components/file-list";

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
