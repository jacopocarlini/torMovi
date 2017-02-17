if (process.platform == 'win32')
    process.env['VLC_PLUGIN_PATH'] = require('path').join(__dirname, 'node_modules/wcjs-prebuilt/bin/plugins');

const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const url = require('url');
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1200, height: 800})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app/views/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.setMenu(null);
  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

var mdb = require('moviedb')('89b43c0850f63d51b9a2fde38e6db2f6');
var icn = require('./app/lib/ilcorsaronero.js');
var movies = null;

ipcMain.on('home', (event, i) =>{
    win.loadURL('file://' + __dirname + '/app/views/index.html');
});

ipcMain.on('open-movie-window', (event, i) =>{
  var res={};
  mdb.movieInfo({id: movies[i].id, language: 'it-IT'}, function (err, info) {
      if (err) throw err;
      icn.search(info.title, "BDRiP", function (err, data) {
          if (err) throw err;
          res.id = movies[i].id;
          res.title = info.title;
          res.year = info.release_date.substring(0, 4);
          res.poster = info.poster_path;
          res.plot = info.overview;
          res.rate = info.vote_average;
          res.genres = info.genres;
          res.torrent=data;
          mdb.movieCredits({id: movies[i].id}, function (err, cred) {
              if (err) throw err;
              res.cred = cred;
              win.loadURL('file://' + __dirname + '/app/views/movie.html');
              ipcMain.on('info', (event, dumb)=> {
                event.sender.send('info',res );
              });
          });
      });
  });


});

ipcMain.on('set-movies', (event, m) =>{
    movies=m;
});

ipcMain.on('open-player-window', (event, magnet) => {
    win.loadURL('file://' + __dirname + '/app/views/player.html');
    ipcMain.on('play', (event, dumb)=> {
        event.sender.send('play', magnet)
    });
});
