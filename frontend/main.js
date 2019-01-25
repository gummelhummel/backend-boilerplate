import m from "mithril";
import tagl from "tagl-mithril";
import L from "leaflet";

const { h1, div, input } = tagl(m);

const Map = vnode => {
  return {
    view: () => div.$map({ style: "height:100vh" }),
    oncreate: () => {
      const map = L.map(vnode.dom).setView([51.505, -0.09], 13);

      L.Control.Watermark = L.Control.extend({
        onAdd: function(map) {
          var img = L.DomUtil.create("span");

          img.innerHtml = "Hello World";

          //  img.src = '../../docs/images/logo.png';
          img.style.width = "200px";

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

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {      
//      L.tileLayer("/map/{z}/{x}/{y}.png?{foo}", {
        foo: "bar",
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

if (true)
  m.mount(document.body, {
    view(vnode) {
      return [
          m(Map)
      ];
    }
  });
/*
const map = L.map(document.querySelector("#map")).setView([51.505, -0.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {
  foo: "bar",
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(map);
*/
