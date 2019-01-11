import m from "mithril";
import tagl from "tagl-mithril";
import Size from "./disk-size";
import Abbr from "./abbr";
import UserService from "../services/user";

const {
  video,
  source,
  audio,
  h2,
  div,
  pre,
  img,
  a,
  label,
  input,
  h3,
  p,
  abbr,
  mark
} = tagl(m);

const when = contained => (mimetype, expr) => {
  return (mimetype || "").indexOf(contained) >= 0 ? expr : null;
};

const whenImage = when("image");
const whenVideo = when("video");
const whenAudio = when("audio");
const whenMarkdown = when("markdown");

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
  },
  "audio/x-ms-wma": {
    icon: "🎶"
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
         //         a.button("⚓"),
           //       a.button("♥"),
                  //  a.button("⚐⚑"),
                  whenMarkdown(
                    file.mimetype,
                    a.button(
                      { onclick: () => m.route.set(`/files/${file._id}`) },
                      "✎"
                    )
                  ),
                  a.button(
                    { onclick: deleteFile(file._id, vnode.attrs.ondelete) },
                    "🗑️"
                  ),
                  a.button({ href: `/api/files/${file._id}` }, "⬇💾")
                )
              : null,
            //            div.section(pre(JSON.stringify(file, undefined, 2))),
            div.section(mark(file.mimetype)),
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
              )
            ]),
            whenAudio(file.mimetype, [
              audio.section.media(
                {
                  width: "100%",
                  controls: true
                },
                source({
                  src: `/api/files/${file._id}`,
                  type: `${file.mimetype}`
                }),
                " Your browser does not support the audio element."
              )
            ])
          )
        ])
      )
    ];
  }
};
