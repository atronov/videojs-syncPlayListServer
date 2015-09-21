var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    fs = require("fs"),
    uuid = require("uuid"),
    playlist = require("./routes/playlist"),
    app = express();

app.use('/', express.static(path.join(__dirname, "public")));

// тут лежат видео-файлы
app.use("/video", express.static(path.join(__dirname, "video")));

playlist.init();
app.use(playlist);

module.exports = app;