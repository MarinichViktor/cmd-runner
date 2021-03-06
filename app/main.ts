import { app, BrowserWindow, screen, ipcMain, dialog, Menu } from 'electron';
import * as path                               from 'path';
import * as fs                                 from 'fs';
import * as url                    from 'url';
import { ChildProcess, spawn }                                  from 'child_process';

// import { CMD_DATA, CMD_ERR, CMD_EXIT, CmdInterface, SPAWN_CMD } from '../src/app/core/services/command/command.service';
export const SPAWN_CMD = 'spawn';
export const SPAWN_CMD_OK = 'spawn-ok';
export const CMD_DATA = 'data';
export const CMD_ERR = 'err';
export const CMD_EXIT = 'exit';
export const CMD_CLOSE = 'close';

export interface CmdInterface {
  name: string,
  cmd: string,
  dir: string
}
let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    let pathIndex = './index.html';

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
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}
const commands : { [key: string]: ChildProcess} = {};

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.whenReady().then(() => {
    const window = createWindow();

    ipcMain.on(SPAWN_CMD, (event, cmd: CmdInterface) => {
      console.log('received new cmd')
      const comd = spawn("/bin/bash", ["-l", "-c", cmd.cmd], {
        cwd: cmd.dir
      });

      commands[cmd.name] = comd;
      comd.stdout.on('data', (data: Uint8Array) => {
        const strData = Buffer.from(data.buffer).toString()
        window.webContents.send(`${CMD_DATA}:${cmd.name}`, strData);
      });

      comd.stderr.on('data', (data: Uint8Array) => {
        const strData = Buffer.from(data.buffer).toString()
        window.webContents.send(`${CMD_ERR}:${cmd.name}`, strData);
      });
      comd.on('close', (code) => {
        console.log('cmd close called');
        window.webContents.send(`${CMD_EXIT}:${cmd.name}`);
      });

      event.returnValue = cmd.name;
    });

    ipcMain.on(CMD_CLOSE, (event, name: string) => {
      const c = commands[name];
      const res = process.kill(commands[name].pid, 2);
      window.webContents.send(`${CMD_EXIT}:${name}`);
    });

    ipcMain.on("open-file", event => {
      // event.returnValue = cmd.name;
      const files = dialog.showOpenDialogSync(win);
      console.log('files', files)
      let result: string;

      if (files.length > 0) {
        const data = fs.readFileSync(files[0]);
        result = JSON.parse(data.toString('utf8'));
      }

      event.returnValue = result;
    });

    const menu = Menu.buildFromTemplate([
      {
        label: 'File',
        submenu: [
          {
            label: 'Load projects',
            click: async () => {
              const files = dialog.showOpenDialogSync(win);
              console.log('files', files)
              let result: string;

              if (files.length > 0) {
                const data = fs.readFileSync(files[0]);
                result = JSON.parse(data.toString('utf8'));

                console.log('send result', result);
                window.webContents.send("load-projects", result);
              }
            }
          },
          process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' },
        ]
      }
      ]);
    Menu.setApplicationMenu(menu);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    Object.entries(commands).forEach(([_, cmd]) => {
      process.kill(cmd.pid, 2);
    });

    app.quit();
  });

  app.on('activate', () => {
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
} catch (e) {
  // Catch Error
  // throw e;
}
