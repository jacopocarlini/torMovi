if (process.platform == 'win32')
    process.env['VLC_PLUGIN_PATH'] = require('path').join(__dirname, 'node_modules/wcjs-prebuilt/bin/plugins');
// var wjp = require("./node_modules/wcjs-prebuilt/index.js");
var wjs = require("wcjs-player");
var path = require('path');
var icn=require('../lib/ilcorsaronero');
const {ipcRenderer} = require('electron')

ipcRenderer.on('play', (event, magnetURI) => {



// var magnetURI = 'magnet:?xt=urn:btih:06365dde7c82bf0624b5bd64badbd215375a4c6e&dn=Suicide+Squad+-+Extended+%282016%29.H264.Italian.English.Ac3.5.1.iCV-MIRCrew&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce'
// var magnetURI = "magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4"

var torrentStream = require('torrent-stream');

var engine = torrentStream(magnetURI);

engine.on('ready', function() {
    engine.files.forEach(function(file) {
        console.log('filename:', file.name);
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

          var type = "mkv";
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
});
})

ipcRenderer.send('play')
