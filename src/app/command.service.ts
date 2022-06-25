import { Injectable }          from '@angular/core';
import { Command }             from './command';
import { Observable, Subject } from 'rxjs';
import { ElectronService } from 'ngx-electron';

export const SPAWN_CMD = 'spawn';
export const SPAWN_CMD_OK = 'spawn-ok';
export const CMD_DATA = 'data';
export const CMD_ERR = 'err';
export const CMD_EXIT = 'exit';
export const CMD_CLOSE = 'close';

export interface CmdInterface {
  cmd: string,
  dir: string
}

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  constructor(private electron: ElectronService) {
  }

  start(cmd: CmdInterface): Observable<Command> {
    const id = this.electron.ipcRenderer.sendSync(SPAWN_CMD, cmd);
    const dataSource = new Subject<string>();
    const errSource = new Subject<string>();
    const exitSource = new Subject<void>();
    const closeSource = new Subject<void>();

    return new Observable<Command>((subscriber) => {
      const command = new Command(dataSource, errSource, exitSource, closeSource);


      this.electron.ipcRenderer.on(`${CMD_DATA}:${id}`, (event, data: string) => {
        dataSource.next(data);
      });
      this.electron.ipcRenderer.on(`${CMD_ERR}:${id}`, (event, data: string) => {
        errSource.next(data);
      });
      this.electron.ipcRenderer.on(`${CMD_EXIT}:${id}`, (event,) => {
        exitSource.next();
        exitSource.complete();
      });
      const subscription = closeSource.subscribe(() => {
        this.electron.ipcRenderer.send(CMD_CLOSE, id);
        subscription.unsubscribe();
      });

      subscriber.next(command);
      subscriber.complete();
    });
  }
}
