if (process.platform == 'win32')
    process.env['VLC_PLUGIN_PATH'] = require('path').join(__dirname, 'node_modules/wcjs-prebuilt/bin/plugins');

const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const path = require('path')
const url = require('url')
var movies = null;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app/views/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // win.loadURL("http://localhost:8888/")
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

var icn = require('./app/lib/ilcorsaronero.js');
ipcMain.on('open-movie-window', (event, i) =>{
    win.loadURL('file://' + __dirname + '/app/views/movie.html');
    ipcMain.on('info', (event, dumb)=> {
      icn.search(movies[i].title, "BDRiP", function (err, data) {
          if (err) throw err;
          // data.title = info.title;
          // data.year = info.release_date.substring(0, 4);
          // data.poster = info.poster_path;
          // data.plot = info.overview;
          // data.rate = info.vote_average;
          // data.genres = info.genres;
          movies[i].torrent = data;
          event.sender.send('info', movies[i]);

      });

    });
});

ipcMain.on('movies-list', (event, m) =>{
    movies=m;
});


ipcMain.on('open-player-window', (event, magnet) => {
    console.log("ricevuto");
    win.loadURL('file://' + __dirname + '/app/views/player.html');
    ipcMain.on('play', (event, dumb)=> {
        event.sender.send('play', magnet)
    });
});
