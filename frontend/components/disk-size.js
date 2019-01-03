import m from "mithril";
import tagl from "tagl-mithril";

const { mark, h2, div, pre, img, a, label, input, h3, p, abbr } = tagl(m);

const du = (sizeInBytes = 0) => {
  const sizes = Object.freeze([
    {
      name: "TiB",
      longName: "Tibibyte (1024 x 1024 x 1024 x 1024 Byte)",
      mult: 1024 * 1024 * 1024 * 1024
    },
    {
      name: "GiB",
      longName: "Gibibyte (1024 x 1024 x 1024 Byte)",
      mult: 1024 * 1024 * 1024
    },
    {
      name: "MiB",
      longName: "Mebibyte (1024 x 1024 Byte)",
      mult: 1024 * 1024
    },
    {
      name: "KiB",
      longName: "Kibibyte (1024 Byte)",
      mult: 1024
    },
    {
      name: "B",
      longName: "Bytes",
      mult: 1
    }
  ]);
  let cSize = sizes.filter(size => sizeInBytes / size.mult > 1)[0] || {
    name: "B",
    longName: "Bytes",
    mult: 1
  };
  cSize.in =
    cSize.mult === 1
      ? sizeInBytes
      : Math.round((sizeInBytes / cSize.mult) * 100) / 100;

  return cSize;
};

export default {
  view(vnode) {
    let s = du(vnode.attrs.size);
    return mark.tag([
      "" + s.in,
      m.trust("&nbsp;"),
      abbr({ title: s.longName }, s.name)
    ]);
  }
};
