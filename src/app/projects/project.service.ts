import { Injectable, NgZone } from '@angular/core';
import { Process }             from '../process';
import { Observable, ReplaySubject, Subject, tap } from 'rxjs';
import { ElectronService } from '../electron.service';
import { ProjectContext } from './project.context';
import { Project } from './project';

export const SPAWN_CMD = 'spawn';
export const SPAWN_CMD_OK = 'spawn-ok';
export const CMD_DATA = 'data';
export const CMD_ERR = 'err';
export const CMD_EXIT = 'exit';
export const CMD_CLOSE = 'close';

export interface CommandRunArgs {
  name: string,
  cmd: string,
  dir: string
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private electron: ElectronService, private cmdContext: ProjectContext, private zone: NgZone) {
  }

  start(project: Project): Observable<Process> {
    return this.startProcess(project).pipe(
      tap(process => project.process = process)
    )
  }

  private startProcess(project: Project): Observable<Process> {
    const id = this.electron.ipcRenderer.sendSync(SPAWN_CMD, {name: project.name, dir: project.dir, cmd: project.cmd});
    const dataSource = new ReplaySubject<string>(500);
    const exitSource = new Subject<void>();
    const closeSource = new Subject<void>();

    return new Observable<Process>((subscriber) => {
      const command = new Process(dataSource, exitSource, closeSource);


      this.electron.ipcRenderer.on(`${CMD_DATA}:${id}`, (event, data: string) => {
        console.log('new data', `${CMD_DATA}:${id}`, data);
        dataSource.next(data);
      });
      this.electron.ipcRenderer.on(`${CMD_ERR}:${id}`, (event, data: string) => {
        console.log('new err', `${CMD_DATA}:${id}`, data);
        dataSource.next(data);
      });
      this.electron.ipcRenderer.on(`${CMD_EXIT}:${id}`, (event,) => {
        console.log('new exit', `${CMD_DATA}:${id}`);
        dataSource.next("\nCommand exited.... \n");
        dataSource.complete();

        exitSource.next();
        exitSource.complete();

        this.zone.run(() => {
          project.process = undefined;
        });
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
