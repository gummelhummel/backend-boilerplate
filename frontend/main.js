import m from "mithril";
import tagl from "tagl-mithril";
import L from "leaflet";

const {
  h1,
  div,
  footer,
  nav,
  button,
  a,
  input,
  form,
  formfield,
  label,
  header
} = tagl(m);

let location = null;

setInterval(
  () =>
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

const Map = vnode => {
  let map = null;
  let marker = null;
  return {
    onupdate: () => {
      if (map && !marker && location) {
        marker = L.marker(location).addTo(map);
      } else if (marker) {
        marker.setLatLng(location);
      }
      map && map.setView(location);
    },
    view: () => {
      return div.$map({ style: "height:90vh; width:100%" });
    },
    oncreate: () => {
      map = L.map(vnode.dom).setView([50.505, 7.22], 13);
      L.Control.Watermark = L.Control.extend({
        onAdd: function(map) {
          var img = L.DomUtil.create("img");

          // img.innerHtml = "Hello World";

          //  img.src = '../../docs/images/logo.png';
          // img.style.width = "200px";

          return img;
        },

        onRemove: function(map) {
          // Nothing to do here
        }
      });

      L.control.watermark = function(opts) {
        return new L.Control.Watermark(opts);
      };

      L.control.watermark({ position: "bottomleft" }).addTo(map);

     // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {
        L.tileLayer("/map/{s}/{z}/{x}/{y}?{query}", {
        query: `tileSet=1`,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
      }).addTo(map);
    }
  };
};

const geolocByAddress = (address, cb) =>
  m
    .request({
      url: `http://nominatim.openstreetmap.org/search/${address}?format=json&addressdetails=0&limit=1`
    })
    .then();

let showSearch = false;

if (true)
  m.mount(document.body, {
    view(vnode) {
      return [
        m(Map, { location }),
        [
          showSearch?input():null, 
          header(
            button.primary(
              {
                onclick: () => {
                  showSearch = !showSearch;
                }
              },
              "🔍"
            )
          )
        ]
      ];
    }
  });
