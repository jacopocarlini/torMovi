const {ipcRenderer} = require('electron')
const path = require('path')
const url = require('url')
var icn=require('./lib/ilcorsaronero');

var div = document.getElementById('box');
var button = document.getElementById('button');


button.addEventListener('click', function () {
        ipcRenderer.send('open-player-window');
});

let $ = require('jQuery');
$.getJSON( "https://api.themoviedb.org/3/discover/movie?api_key=89b43c0850f63d51b9a2fde38e6db2f6&language=it-IT&sort_by=popularity.desc&include_adult=false&page=1", function( data ) {
  var items = [];
  var counter = 0;
  $.each(data.results, function (key, val) {
      // items.push("<img id='" + key + "'" + "src=' http://image.tmdb.org/t/p/w185//" + val.poster_path + "'>");
      // items.push("<a href='http://localhost:8888/movie/" + val.title + "'>" + val.title + "</a>");
      icn.search(val.title, "BDRiP", function(err, res){
        if(res.length!=0){
          items.push("<div class='wrapperImage'><a onclick='return movie(this);' href='#'><img width='190' height='279' src='http://image.tmdb.org/t/p/w185//"+val.poster_path+"' class='image'><h2 class='title'>"+val.title+"</h2></a></div>");
        }
        counter++;
        if(counter==20) $("#box").append(items.join());
      });
  });

});



function movie(movie){
    console.log(movie.textContent);
    ipcRenderer.send('open-movie-window', movie.textContent);
}
