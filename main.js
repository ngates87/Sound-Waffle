var BrowserWindow = require('browser-window');
var app = require('app');
var mainWindow = null;
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
app.on('ready', function () {
    mainWindow = new BrowserWindow({ width: 1000, height: 625 });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.setTitle("Sound Cue Program");
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
