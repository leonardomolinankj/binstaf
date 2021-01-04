import path from 'path';

import { app, BrowserWindow } from 'electron';

const debug = /--debug/.test(process.argv[3]);

if (debug) require('electron-reload')(__dirname);

let window: BrowserWindow;

function createWindow() {
    window = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        title: app.getName(),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: false,
            enableWebSQL: false,
            sandbox: true,
        },
    });
    window.loadFile(path.join(__dirname, '..', 'index.html'));
    window.webContents.openDevTools();

    if (debug) {
        window.webContents.openDevTools();
        // window.maximize();
    }

    window.once('ready-to-show', () => {
        window.show();
    });
}

const isFirstInstance = app.requestSingleInstanceLock();

if (!isFirstInstance) {
    app.quit();
}

app.on('ready', () => {
    createWindow();
});


app.once('ready', () => {
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
