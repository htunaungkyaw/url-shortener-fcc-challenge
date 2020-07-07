"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dns = require("dns");

var cors = require("cors");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const links = [];
let id = 0;
app.post("/api/shorturl/new", (req, res) => {
  const { url } = req.body;
  const REGEX = /^https?:\/\//i;
  const modifiedURL = url.replace(REGEX, "");
  dns.lookup(modifiedURL, (err, addresses, family) => {
    if (err) {
      return res.json({
        error: "invalid URL",
      });
    } else {
      id++;
      const newShortURL = {
        original_url: url,
        short_url: id + "",
      };
      links.push(newShortURL);

      res.json(newShortURL);
    }
  });
});
app.get("/api/shorturl/:id", (req, res) => {
  const { id } = req.params;
  const shortURL = links.find((link) => link.short_url == id);
  if (shortURL) {
    return res.redirect(shortURL.original_url);
  } else {
    return res.json({
      error: "No short URL",
    });
  }
});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
