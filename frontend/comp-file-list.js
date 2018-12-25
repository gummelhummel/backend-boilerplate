import m from "mithril";
import tagl from "tagl-mithril";
import Size from './comp-disk-size';


const { mark, h2, div, pre, img, a, label, input, h3, p, abbr } = tagl(m);

const whenImage = (mimetype, expr) => {
  return (mimetype || "").indexOf("image") >= 0 ? expr : null;
};

export default {
  view(vnode) {
    console.log(vnode.attrs.files);
    return [
      h2("Files"),
      div.row(
        vnode.attrs.files.map((file, idx) => [
          div.card(
            div.section(
              file.originalname,
              m.trust("&nbsp;"),
              m(Size, { size: file.size })
            ),
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
            ])
          )
        ])
      )
    ];
  }
};
