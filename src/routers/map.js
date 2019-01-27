const bodyParser = require("body-parser");
const https = require("https");
const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const express = require("express");

var app = express();
app.use("1", (req, res) => {
  req.on("");
  req.query;
});

module.exports = app => {
  app.use("/map/search/:search", (req, res) => {
    let url = `https://nominatim.openstreetmap.org/search/${
      req.params.search
    }?format=json`;
    mkdirp(`maps/`);
    console.log(req.headers, req.agent);
    let filename = crypto
      .createHash("md5")
      .update(req.params.search)
      .digest("hex");
    fs.exists(filename, exists =>
      exists //
        ? fs.createReadStream(filename).pipe(res) //
        : https.request(
            url,
            {
              headers: {
                referer: "http://eismaenners.de",
                "User-Agent":
                  "Mozilla/5.0 (X11; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0"
              }
            },
            response => {
              response.pipe(fs.createWriteStream(filename));
              response.pipe(res);
            }
          )
    );
  });

  app.use("/map/:s/:z/:x/:y", (req, res) => {
    let p = req.params;
    let tileSets = [
      {
        name: "wikimedia",
        url: ({ x, y, z, s }) =>
          `https://maps.wikimedia.org/osm-intl/${z}/${x}/${y}.png`
      },
      {
        name: "osm",
        url: ({ x, y, z, s }) =>
          `https://${s}.tile.openstreetmap.org/${z}/${x}/${p.y}.png`
      },
      {
        name: "topomap",
        url: ({ x, y, z, s }) =>
          `https://${s}.tile.opentopomap.org/${z}/${x}/${y}.png`
      }
    ];
    let tileSet = tileSets[req.query.tileSet || 0];
    const file = `maps/${tileSet.name}/${p.z}/${p.x}/${p.y}.png`;
    mkdirp(`maps/${tileSet.name}/${p.z}/${p.x}/`);
    fs.exists(file, bool => {
      if (bool) {
        fs.createReadStream(file).pipe(res);
      } else {
        let url = tileSet.url(p);
        console.log("Fetching " + url);
        https.get(url, mapResponse => {
          req.on("close", () => {
            if (!mapResponse.complete) {
              fs.unlink(file, err => console.log(err));
            }
          });
          mapResponse.pipe(fs.createWriteStream(file));
          mapResponse.pipe(res);
        });
      }
    });
  });

  let fakeMarkers = [];
  fs.readFile("src/routers/markers.json", (err, data) => {
    if (err) console.log(err);
    else fakeMarkers = JSON.parse(data.toString());
    console.log(fakeMarkers);
  });

  app.get("/fakesearch/:search", (req, res) => {
    let search = req.params.search;
    let num = Math.floor(Math.random() * fakeMarkers.length * 1.0);
    let responseData = [];
    for (let i = 0; i < num; i++) {
      let idx = Math.floor(Math.random() * fakeMarkers.length);
      responseData.push(fakeMarkers[idx]);
    }
    res.status(200).send(responseData);
  });
};
