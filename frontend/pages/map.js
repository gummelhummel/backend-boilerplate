import m from "mithril";
import tagl from "tagl-mithril";
import L from "leaflet";

import MapService from "../services/map";
import LogService from "../services/log";
import DataService from "../services/data";

import images from "../images/*.png";

console.log(images.crosshair);

var crosshair = L.icon({
  iconUrl: images.crosshair,
  //  shadowUrl: 'leaf-shadow.png',

  iconSize: [64, 64], // size of the icon
  //shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [32, 32], // point of the icon which will correspond to marker's location
  //shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const range = (s, e) => {
  let r = [];
  for (let i = s; i < e; i++) r.push(i);
  return r;
};

var myIcons = range(0, 9).map(n =>
  L.divIcon({ className: `marker-type-${n} marker-base` })
);

const {
  p,
  h1,
  div,
  footer,
  nav,
  button,
  a,
  b,
  input,
  form,
  formfield,
  label,
  header
} = tagl(m);

let location = null;

setInterval(
  () =>
    navigator.geolocation &&
    navigator.geolocation.getCurrentPosition(
      pos => {
        location = [pos.coords.latitude, pos.coords.longitude];
        console.log(pos);
        m.redraw();
      },
      err => {
        console.log("error", err);
      },
      {
        enableHighAccuracy: false
      }
    ),
  2000
);

const searches = [];
let searchResults = (() => {
  let fresh = false;
  let results = [];
  return {
    fresh: () => fresh,
    results: () => {
      fresh = false;
      return results;
    },
    setResults: r => {
      results = r;
      fresh = true;
    }
  };
})();

DataService.search("_files", { location: { $ex: true } }, e =>
  searchResults.setResults(
    e.map(r => {
      var link = document.createElement("a");
      link.textContent = "download image";
      link.href = `/api/files/${r._id}`;
      link.text = r.originalname;
      link.innerHTML = r.originalname;
      /*link.addEventListener('click', function(ev) {
          link.href = canvas.toDataURL();
          link.download = "mypainting.png";
      }, false);*/

      console.log(r,link)
      r.dom = link;
      r.title = r.originalname;
      return r // Object.assign(r, { title: r.originalname, dom: link });
    })
  )
);

const geolocByAddress = (address, cb) =>
  m
    .request({
      url: `http://nominatim.openstreetmap.org/search/${address}?format=json&addressdetails=0&limit=1`
    })
    .then();

let showSearch = false;
let showAdd = false;

let searchText = "";
let addText = "";

let follow = true;

const Navigation = vnode => {
  return {
    view(vnode) {
      return div.hoverTools([
        showSearch
          ? formfield(
              input({
                value: searchText,
                oninput: m.withAttr("value", v => (searchText = v))
              }),
              button.primary(
                {
                  onclick: () => {
                    showSearch = false;
                    m.request({
                      url: `/fakesearch/${searchText}`
                    }).then(searchResults.setResults);
                  }
                },
                "🔍"
              )
            )
          : showAdd
          ? formfield(
              input({
                value: addText,
                oninput: m.withAttr("value", v => (addText = v))
              }),
              button.primary({ onclick: () => addPOI() }, "+")
            )
          : div.buttonGroup_([
              button[follow ? "primary" : "success"](
                { onclick: () => (follow = !follow) },
                "👣"
              ),
              button.primary(
                {
                  onclick: () => {
                    showSearch = !showSearch;
                  }
                },
                "🔍"
              ),
              button.primary(
                {
                  onclick: () => {
                    showAdd = !showAdd;
                  }
                },
                "+"
              )
            ])
      ]);
    }
  };
};

const Log = vnode => {
  return {
    view(vnode) {
      return div.hoverTools(
        LogService.list().map(entry => p[entry.type](entry.msg))
      );
    }
  };
};

const Map = vnode => {
  let map = null;
  let marker = null;
  let markers = [];
  return {
    onupdate: vnode => {
      if (map && !marker && vnode.attrs.location) {
        marker = L.marker(vnode.attrs.location, { icon: crosshair }).addTo(map);
      } else if (marker) {
        marker.setLatLng(vnode.attrs.location);
      }
      vnode.attrs.follow &&
        map &&
        vnode.attrs.location &&
        map.setView(vnode.attrs.location);
      console.log("results: ", vnode.attrs.searchResults);
      if (vnode.attrs.searchResults.fresh()) {
        markers.forEach(m => m.remove());
        vnode.attrs.searchResults.results().forEach(result => {
          markers.push(
            L.marker(result.location, {
              icon: myIcons[JSON.stringify(result).length % myIcons.length],
              title: result.title
            })
              .bindPopup(result.dom || result.comment)
              .addTo(map)
          );
        });
      }
    },
    view: () => {
      return div.$map({ style: "height:92vh; width:100%" });
    },
    oncreate: () => {
      map = L.map(vnode.dom).setView([50.505, 7.22], 13);
      MapService.registerMap(map);

      L.Control.Watermark = L.Control.extend({
        onAdd: function(map) {
          var overlay = L.DomUtil.create("div");

          m.mount(overlay, {
            view(vnode) {
              return m(Navigation);
            }
          });

          return overlay;
        },

        onRemove: function(map) {
          // Nothing to do here
        }
      });

      L.control.watermark = function(opts) {
        return new L.Control.Watermark(opts);
      };

      L.control.watermark({ position: "bottomleft" }).addTo(map);

      L.Control.Log = L.Control.extend({
        onAdd: function(map) {
          var overlay = L.DomUtil.create("div");

          m.mount(overlay, {
            view(vnode) {
              return m(Log);
            }
          });

          return overlay;
        },

        onRemove: function(map) {
          // Nothing to do here
        }
      });

      L.control.log = function(opts) {
        return new L.Control.Log(opts);
      };

      L.control.log({ position: "bottomright" }).addTo(map);

      // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {
      const baseLayers = [
        L.tileLayer("/map/{s}/{z}/{x}/{y}?{query}", {
          query: `tileSet=0`,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(map),
        L.tileLayer("/map/{s}/{z}/{x}/{y}?{query}", {
          query: `tileSet=1`,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(map)
        /*        L.tileLayer("/map/{s}/{z}/{x}/{y}?{query}", {
          query: `tileSet=2`,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(map)*/
      ];

      L.control.layers(baseLayers).addTo(map);
    }
  };
};

export default {
  view(vnode) {
    return [
      m(Map, { location, searchResults, follow })
      // nav.toggle['col-md-4'](h1(
      //   'hello'
      // ))
    ];
  }
};
