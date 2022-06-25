"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMD_CLOSE = exports.CMD_EXIT = exports.CMD_ERR = exports.CMD_DATA = exports.SPAWN_CMD_OK = exports.SPAWN_CMD = void 0;
var electron_1 = require("electron");
var path = require("path");
var fs = require("fs");
var url = require("url");
var child_process_1 = require("child_process");
// import { CMD_DATA, CMD_ERR, CMD_EXIT, CmdInterface, SPAWN_CMD } from '../src/app/core/services/command/command.service';
exports.SPAWN_CMD = 'spawn';
exports.SPAWN_CMD_OK = 'spawn-ok';
exports.CMD_DATA = 'data';
exports.CMD_ERR = 'err';
exports.CMD_EXIT = 'exit';
exports.CMD_CLOSE = 'close';
var win = null;
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            contextIsolation: false, // false if you want to run e2e test with Spectron
        },
    });
    if (serve) {
        var debug = require('electron-debug');
        debug();
        require('electron-reloader')(module);
        win.loadURL('http://localhost:4200');
    }
    else {
        // Path when running electron executable
        var pathIndex = './index.html';
        if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
            // Path when running electron in local folder
            pathIndex = '../dist/index.html';
        }
        win.loadURL(url.format({
            pathname: path.join(__dirname, pathIndex),
            protocol: 'file:',
            slashes: true
        }));
    }
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    return win;
}
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    var commands_1 = {};
    electron_1.app.whenReady().then(function () {
        var window = createWindow();
        electron_1.ipcMain.on(exports.SPAWN_CMD, function (event, cmd) {
            console.log('received new cmd');
            var comd = (0, child_process_1.spawn)("/bin/bash", ["-c", cmd.cmd], {
                cwd: cmd.dir
            });
            commands_1[cmd.name] = comd;
            comd.stdout.on('data', function (data) {
                var strData = Buffer.from(data.buffer).toString();
                window.webContents.send("".concat(exports.CMD_DATA, ":").concat(cmd.name), strData);
            });
            comd.stderr.on('data', function (data) {
                var strData = Buffer.from(data.buffer).toString();
                window.webContents.send("".concat(exports.CMD_ERR, ":").concat(cmd.name), strData);
            });
            comd.on('close', function (code) {
                console.log('cmd close called');
                window.webContents.send("".concat(exports.CMD_EXIT, ":").concat(cmd.name));
            });
            event.returnValue = cmd.name;
        });
        electron_1.ipcMain.on(exports.CMD_CLOSE, function (event, name) {
            var c = commands_1[name];
            // if (c.connected) {
            console.log('kill cmd', commands_1[name].pid);
            // commands[name].kill(9);
            var res = process.kill(commands_1[name].pid, 2);
            // console.log('send exit', res);
            window.webContents.send("".concat(exports.CMD_EXIT, ":").concat(name));
            // } else {
            //   console.log('command not connected');
            // }
        });
    });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
    // const comd = spawn("/bin/bash", ["-c", "docker compose up"], {
    //   cwd: '/home/vmaryn/projects/go/sandbox'
    // });
    //
    // comd.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });
    //
    // comd.stderr.on('data', (data) => {
    //   console.error(`stderr: ${data}`);
    // });
    //
    // comd.on('close', (code) => {
    //   console.log(`child process exited with code ${code}`);
    // });
    //
    // setTimeout(() => {
    //   comd.kill("SIGINT");
    // }, 15000);
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=main.js.map