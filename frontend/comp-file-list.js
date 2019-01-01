import m from "mithril";
import tagl from "tagl-mithril";
import Size from "./comp-disk-size";
import Abbr from "./comp-abbr";
import UserService from "./service-user";

const {
  video,
  source,
  mark,
  h2,
  div,
  pre,
  img,
  a,
  label,
  input,
  h3,
  p,
  abbr
} = tagl(m);

const whenImage = (mimetype, expr) => {
  return (mimetype || "").indexOf("image") >= 0 ? expr : null;
};

const whenVideo = (mimetype, expr) => {
  return (mimetype || "").indexOf("video") >= 0 ? expr : null;
};

const mimemap = {
  "image/png": {
    name: "PNG Graphic",
    icon: "🖼️"
  },
  "image/jpeg": {
    name: "JPEG Graphic",
    icon: "🖼️"
  },
  "text/plain": {
    icon: "📝"
  },
  "video/mp4": {
    icon: "📽️"
  }
};

const deleteFile = (id, cb) => {
  return () => {
    if (confirm("Are you sure?")) {
      UserService.request({
        url: `/api/files/${id}`,
        method: "DELETE"
      }).then(cb || (() => {}));
    }
  };
};

export default {
  view(vnode) {
    console.log(vnode.attrs.files);
    return [
      h2("Files"),
      div.row(
        vnode.attrs.files.map((file, idx) => [
          div.file.card(
            div.section(
              mimemap[file.mimetype] ? mimemap[file.mimetype].icon + " " : "",
              m(Abbr, { text: file.originalname }),
              m.trust("&nbsp;"),
              m(Size, { size: file.size })
            ),
            UserService.loggedIn()
              ? div.section(
                  a.button("⚓"),
                  a.button("♥"),
                  a.button("⚐⚑"),
                  a.button("✎"),
                  a.button(
                    { onclick: deleteFile(file._id, vnode.attrs.ondelete) },
                    "🗑️"
                  ),
                  a.button({ href: `/api/files/${file._id}` }, "⬇💾")
                )
              : null,
            div.section(pre(JSON.stringify(file, undefined, 2))),
            whenImage(file.mimetype, [
              img.section.media({
                width: "100%",
                src: `/api/files/${file._id}`
              }),
              label({ for: `modal-control-${idx}` }, "Show"),
              input.modal[`#modal-control-${idx}`]({ type: "checkbox" }),
              div(
                div.card.large.mmm(
                  label.modalClose({ for: `modal-control-${idx}` }),
                  h3.section(file.originalname),
                  img.media({
                    width: "100%",
                    src: `/api/files/${file._id}`
                  })
                )
              )
            ]),
            whenVideo(file.mimetype, [
              video.section.media(
                {
                  width: "100%",
                  controls: true
                },
                source({ src: `/api/files/${file._id}` })
              ),
              label({ for: `modal-control-${idx}` }, "Show"),
              input.modal[`#modal-control-${idx}`]({ type: "checkbox" }),
              div(
                div.card.large.mmm(
                  label.modalClose({ for: `modal-control-${idx}` }),
                  h3.section(file.originalname),
                  video.section.media(
                    {
                      width: "100%"
                    },
                    source({ src: `/api/files/${file._id}` })
                  )
                )
              )
            ])
          )
        ])
      )
    ];
  }
};
