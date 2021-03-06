"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        var pathIndex = './index.html';
        if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
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
var commands = {};
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.whenReady().then(function () {
        var window = createWindow();
        electron_1.ipcMain.on(exports.SPAWN_CMD, function (event, cmd) {
            console.log('received new cmd');
            var comd = (0, child_process_1.spawn)("/bin/bash", ["-l", "-c", cmd.cmd], {
                cwd: cmd.dir
            });
            commands[cmd.name] = comd;
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
            var c = commands[name];
            var res = process.kill(commands[name].pid, 2);
            window.webContents.send("".concat(exports.CMD_EXIT, ":").concat(name));
        });
        electron_1.ipcMain.on("open-file", function (event) {
            // event.returnValue = cmd.name;
            var files = electron_1.dialog.showOpenDialogSync(win);
            console.log('files', files);
            var result;
            if (files.length > 0) {
                var data = fs.readFileSync(files[0]);
                result = JSON.parse(data.toString('utf8'));
            }
            event.returnValue = result;
        });
        var menu = electron_1.Menu.buildFromTemplate([
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Load projects',
                        click: function () { return __awaiter(void 0, void 0, void 0, function () {
                            var files, result, data;
                            return __generator(this, function (_a) {
                                files = electron_1.dialog.showOpenDialogSync(win);
                                console.log('files', files);
                                if (files.length > 0) {
                                    data = fs.readFileSync(files[0]);
                                    result = JSON.parse(data.toString('utf8'));
                                    console.log('send result', result);
                                    window.webContents.send("load-projects", result);
                                }
                                return [2 /*return*/];
                            });
                        }); }
                    },
                    process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' },
                ]
            }
        ]);
        electron_1.Menu.setApplicationMenu(menu);
    });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        Object.entries(commands).forEach(function (_a) {
            var _ = _a[0], cmd = _a[1];
            process.kill(cmd.pid, 2);
        });
        electron_1.app.quit();
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