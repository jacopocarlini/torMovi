var movie = null;
var mdb = require('moviedb')('89b43c0850f63d51b9a2fde38e6db2f6');

ipcRenderer.on('info', (event, data) => {
  movie = data;
  $('.info-title').html("");
  $('.info-title').append(data.title);
  $('.vote').html("");
  $('.vote').append(data.rate);
  $('.plot').html("");
  $('.plot').append(data.plot);
  $('.year').html("");
  $('.year').append(data.year);
  $('.info-image').attr('src','http://image.tmdb.org/t/p/w342//'+data.poster);
  $('.links').html("");
  for(var i in movie.torrent){
    $(".links").append("<li><a onclick='return play("+i+");' href='#'>"+movie.torrent[i].name+"</a><div class='blue-color'> "+ movie.torrent[i].size+"</div> </li>");
  }
  $('.genres').html("");
  for(var i in movie.genres){
    $(".genres").append("-"+data.genres[i].name);
  }
  $('.cast').html("");
  for(var i = 0 ; i <5 ; i++){
    if(i!=4) $(".cast").append(data.cred.cast[i].name+", ");
    else $(".cast").append(data.cred.cast[i].name);
  }
  var d = [];
  $('.director').html("");
  for(var i in data.cred.crew){
    if(data.cred.crew[i].job=="Director") d.push(data.cred.crew[i].name);
  }
  $(".director").append(d.join(", "));

})


ipcRenderer.send('info');
var icn  = require('../lib/ilcorsaronero.js');
function play(i){
    console.log(movie.torrent[i]);
    icn.getMagnet(movie.torrent[i].link, function(err, res){
      ipcRenderer.send('open-player-window', res);
    });
}


function home(){
  ipcRenderer.send('home');
}
