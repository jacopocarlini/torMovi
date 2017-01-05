
var icn=require('./lib/ilcorsaronero');
let $ = require('jQuery');
const {ipcRenderer} = require('electron')
var movie = null;

ipcRenderer.on('info', (event, m) => {
  movie = m;
  console.log(movie) // prints "pong"

  $("#box").append(movie.title);

  for(var i in movie.torrent){
    $("#box").append("<li><a onclick='return play("+i+");' href='#'>"+movie.torrent[i].name+"</a>"+ movie.torrent[i].size+" </li>");
  }



})


ipcRenderer.send('info');

function play(i){
    console.log(movie.torrent[i].link);
    icn.getMagnet(movie.torrent[i].link, function(err, res){
      ipcRenderer.send('open-player-window', res);
    });
}
