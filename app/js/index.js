/**
 * Created by jadac_000 on 13/02/2017.
 */
const {ipcRenderer} = require('electron');
const {app, BrowserWindow} = require('electron');
var mdb = require('moviedb')('your api key');
var $ = require('jquery');
var page = 1;

mdb.discoverMovie({
        language: 'it-IT', sort_by: 'popularity.desc',
        include_adult: 'false', include_video: 'false',
        page: page, year: '2016'
    }, function (err, data) {
      var items = [];
      var i = 0;
      page++;
      ipcRenderer.send('set-movies', data.results);
      $.each(data.results, function (key, val) {
          items.push("<div class='wrapperImage  col-sm-3 col-md-3 col-lg-2'  id='" + key + "' > <a class='link' onCLick='return movie("+key+");' href='#'> <img width='190' height='280'  src='http://image.tmdb.org/t/p/w185//" + val.poster_path + "' class='image'> </a> <h2 class='title' width='150'> <a href=''>" + setTitle(val.title) + "</a> <h2 class='rate'>"+val.vote_average+"</h2> </h2></div>");
      });
      $("<div>", {
          "class": "row",
          html: items.join("")
      }).appendTo(".box");
      $(window).scroll(load);
  });

mdb.genreMovieList({language: "it-IT"}, function (err, data) {
    if (err) throw err;
    var items = [];
    m=data.results;
    ipcRenderer.send('set-movies', data.results);
    $.each(data.genres, function (key, val) {
       items.push("<li> <a id = '"+val.id+"' onClick = 'filter(this.id);'>"+val.name+" </a></li>");
    });
    $("#genres").append(items.join(""));
});



//tools
function filter(gnr) {
    console.log(gnr);
    mdb.discoverMovie({
            language: 'it-IT', sort_by: 'popularity.desc',
            include_adult: 'false', include_video: 'false',
            page: 1, year: '2016', with_genres:gnr
        }, function (err, data) {
        var items = [];
        var i = 0;
        $.each(data.results, function (key, val) {
            items.push("<div class='wrapperImage  col-sm-3 col-md-3 col-lg-2'  id='" + key + "' > <a class='link' href='http://localhost:8888/info/" + val.id + "'> <img width='190' height='280'  src='http://image.tmdb.org/t/p/w185//" + val.poster_path + "' class='image'> </a> <h2 class='title' width='150'> <a href=''>" + setTitle(val.title) + "</a> <h2 class='rate'>"+val.vote_average+"</h2> </h2></div>");
        });
        $(".row").remove();
        $("<div>", {
            "class": "row",
            html: items.join("")
        }).appendTo(".box");
    });
}

function setTitle(title) {
    if (title.length > 20) {
        title = title.substring(0, 20) + "...";
    }
    return title
}

var screenWidht = 6;
var selected = null;
var drop = false;
document.onkeydown = function (evt) {
    screenWidht=Math.floor($(window).width()/200);

    evt = evt || window.event;
    if (selected == null) {
        // $("#0").children().children(".image").addClass("imageSelected");
        $("#0").children().children(".image").hover();
        selected = 0;
        return;
    }
    if(evt.keyCode==13){
        if (selected>=0) $("#"+selected).children()[0].click();
        else{
            $("#"+selected)[0].click();
            drop=true;
        }
        return;
    }
    switch (evt.keyCode) {
        case 37: //left
            if (selected > -3) {
                if (selected >= 0) $("#" + selected).children().children(".image").removeClass("imageSelected");
                else $("#" + selected).removeClass("linkSelected");

                selected--;
                if (selected >= 0) {
                    $("#" + selected).children().children(".image").addClass("imageSelected");
                    var center = ($(window).height() / 2) - 200;
                    var top = $("#" + selected).offset().top;
                    if (top > center) {
                        $(window).scrollTop(top - center);
                    }
                    else {
                        location.href = "#";
                    }
                }
                else $("#" + selected).addClass("linkSelected");
            }
            break;

        case 38: //up
            if (selected < screenWidht) {
                //navbar
                if (selected >= 0) {
                    $("#" + selected).children().children(".image").removeClass("imageSelected");
                    selected = -1;
                    $("#" + selected).addClass("linkSelected");
                }
            } else {
                $("#" + selected).children().children(".image").removeClass("imageSelected");
                selected = selected - screenWidht;
                $("#" + selected).children().children(".image").addClass("imageSelected");
                var center = ($(window).height() / 2) - 200;
                var top = $("#" + selected).offset().top;
                if (top > center) {
                    $(window).scrollTop(top - center);
                }
                else {
                    location.href = "#";
                }
            }
            break;

        case 39: //right
            if (selected < $(".row").children().length-1) {
                if (selected < 0) {
                    $("#" + selected).removeClass("linkSelected");
                    selected++;
                    if (selected < 0) {
                        $("#" + selected).addClass("linkSelected");
                    }
                    else {
                        $("#" + selected).children().children(".image").addClass("imageSelected");
                    }
                }
                else {
                    $("#" + selected).children().children(".image").removeClass("imageSelected");
                    selected++;
                    $("#" + selected).children().children(".image").addClass("imageSelected");
                    var center = ($(window).height() / 2) - 200;
                    var top = $("#" + selected).offset().top;
                    if (top > center) {
                        $(window).scrollTop(top - center);
                    }
                }
            }

            break;
        case 40: //down
            $("#" + selected).children().children(".image").removeClass("imageSelected");
            if (selected + screenWidht < $(".row").children().length-1) {
                if (selected < 0) {
                    $("#" + selected).removeClass("linkSelected");
                    selected = 0;
                    $("#" + selected).children().children(".image").addClass("imageSelected");
                }
                else {
                    selected = selected + screenWidht;
                    $("#" + selected).children().children(".image").addClass("imageSelected");
                    // location.href = "#";
                    // location.href = "#"+selected;
                    var center = ($(window).height() / 2) - 200;
                    var top = $("#" + selected).offset().top;
                    if (top > center) {
                        $(window).scrollTop(top - center);
                    }
                }
            }
            else{
                selected = $(".row").children().length-1;
                $("#" + selected).children().children(".image").addClass("imageSelected");
                var center = ($(window).height() / 2) - 200;
                var top = $("#" + selected).offset().top;
                if (top > center) {
                    $(window).scrollTop(top - center);
                }
            }
            break;
    }
}


function movie(i){
    console.log(i);
    ipcRenderer.send('open-movie-window', i);
}

function home(){
  ipcRenderer.send('home');
}

function load(){
  console.log('load');
   if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      $(window).unbind('scroll');
       console.log("near bottom!");
       mdb.discoverMovie({
               language: 'it-IT', sort_by: 'popularity.desc',
               include_adult: 'false', include_video: 'false',
               page: page, year: '2016'
           }, function (err, data) {
             var items = [];
             var i = 0;
             page++;
             ipcRenderer.send('set-movies', data.results);
             $.each(data.results, function (key, val) {
                 items.push("<div class='wrapperImage  col-sm-3 col-md-3 col-lg-2'  id='" + key + "' > <a class='link' onCLick='return movie("+key+");' href='#'> <img width='190' height='280'  src='http://image.tmdb.org/t/p/w185//" + val.poster_path + "' class='image'> </a> <h2 class='title' width='150'> <a href=''>" + setTitle(val.title) + "</a> <h2 class='rate'>"+val.vote_average+"</h2> </h2></div>");
             });
             $('.row').append(items.join(""));
             $(window).scroll(load);
         });
   }
 }
