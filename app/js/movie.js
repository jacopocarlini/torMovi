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
var icn  = require('../lib/ilcorsaronero.js');
function play(i){
    console.log(movie.torrent[i]);
    icn.getMagnet(movie.torrent[i].link, function(err, res){
      ipcRenderer.send('open-player-window', res);
    });
}
