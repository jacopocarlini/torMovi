if (process.platform == 'win32')
    process.env['VLC_PLUGIN_PATH'] = require('path').join(__dirname, 'node_modules/wcjs-prebuilt/bin/plugins');
// var wjp = require("./node_modules/wcjs-prebuilt/index.js");
var wjs = require("wcjs-player");
var path = require('path');
var icn=require('../lib/ilcorsaronero');
var torrentStream = require('torrent-stream');

ipcRenderer.on('play', (event, magnetURI) => {
  console.log(__dirname);
  var p = path.resolve('./download');
  console.log(p);
var engine = torrentStream(magnetURI, {tmp: './download', });
engine.on('ready', function() {
        var file = engine.files[0];
        console.log('filename:', file.name);
        var type = file.name.substring(file.name.length - 3, file.name.length);
        // stream is readable stream to containing the file content
        var express = require('express');
        var route = express();
        route.get('/play', function(req, res){
          console.log("play");
          var range = req.headers.range;
          if (!range) {
              // 416 Wrong range
              console.log("416");
              return res.sendStatus(416);
          }
          var positions = range.replace(/bytes=/, "").split("-");
          var start = parseInt(positions[0], 10);
          var total = file.length;
          var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
          var chunksize = (end - start) + 1;

          res.writeHead(200, {
              "Content-Range": "bytes " + start + "-" + end + "/" + total,
              "Accept-Ranges": "bytes",
              "Content-Length": chunksize,
              "Content-Type": "video/" + type
          });
          var stream = ((file).createReadStream({start:start, end:end}));
          stream.pipe(res);
        })
        route.listen(8888);
        var player = new wjs("#player").addPlayer({
            autoplay: true,
            wcjs: require('wcjs-prebuilt')
        });
        player.addPlaylist("http://localhost:8888/play");
        console.log("vai");

});
})

ipcRenderer.send('play')
