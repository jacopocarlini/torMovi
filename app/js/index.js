const {ipcRenderer} = require('electron')
const path = require('path')
const url = require('url')
var icn=require('./lib/ilcorsaronero');

var div = document.getElementById('box');


var m = [];
let $ = require('jQuery');
$.getJSON( "https://api.themoviedb.org/3/discover/movie?api_key=89b43c0850f63d51b9a2fde38e6db2f6&language=it-IT&sort_by=popularity.desc&include_adult=false&page=1", function( data ) {
  var items = [];
  var m = [];
  var counter = 0;
  $.each(data.results, function (key, val) {
      // items.push("<img id='" + key + "'" + "src=' http://image.tmdb.org/t/p/w185//" + val.poster_path + "'>");
      // items.push("<a href='http://localhost:8888/movie/" + val.title + "'>" + val.title + "</a>");
      icn.search(val.title, "BDRiP", function(err, res){
        if(res.length!=0){
          var json={};
          json.id=val.id;
          json.title=val.title;
          json.torrent=res;
          json.tmdb=val;
          m.push(json);
          // items.push("<div class='wrapperImage'><a onclick='return movie(this);' href='#'><img width='190' height='279' src='http://image.tmdb.org/t/p/w185//"+val.poster_path+"' class='image'><h2 class='title'>"+val.title+"</h2></a></div>");
        }
        counter++;
        // if(counter==20) $("#box").append(items.join());
        if(counter == 20){
          ipcRenderer.send('movies-list', m);
          for(var i in m){
            items.push("<div class='wrapperImage'><a onclick='return movie("+i+");' href='#'><img width='190' height='279' src='http://image.tmdb.org/t/p/w185//"+m[i].tmdb.poster_path+"' class='image'><h2 class='title'>"+m[i].title+"</h2></a></div>");
          }
          $("#box").append(items.join());
        }
      });
  });

});



function movie(i){
    console.log(i);
    ipcRenderer.send('open-movie-window', i);
}
