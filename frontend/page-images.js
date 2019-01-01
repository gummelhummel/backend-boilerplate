import m from "mithril";
import tagl from "tagl-mithril";
import UserService from "./service-user";

const { a, h1, img, div, span } = tagl(m);

let images = [];

const update = () => {
  UserService.request({
    url: "/api/data/search/_files",
    method: "POST",
    data: {
      mimetype: {$contains:"image"}
    }
  }).then(imagesResponse => (images = imagesResponse));
};

update();

class Image {
  oncreate(vnode) {
    this.selected = false;
  }
  view(vnode) {
    let image = vnode.attrs.image;
    return img.image[this.selected ? "selected" : "not_selected"]({
      onmousedown: () => (this.selected = !this.selected),
      width: "100%",
      src: `/api/files/${image._id}`
    });
  }
}

class ImagePage {
  view(vnode) {
    return [
      h1("ImagePage ",span({
          onclick:update,
        style:"cursor: pointer"
      },'🔄')),
      div.container(
        div.row(
          images.map(image =>
            div["col-md-3"](
              span.highlighted.tooltip(
                { "aria-label": JSON.stringify(image.originalname, null, 2) },
                m(Image, { image })
              )
            )
          )
        )
      )
    ];
  }
}

export default ImagePage;
