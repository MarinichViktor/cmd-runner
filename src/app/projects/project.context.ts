import { Injectable } from '@angular/core';
import { Project } from './project';
import { BehaviorSubject, ReplaySubject, skip, Subject } from 'rxjs';

@Injectable()
export class ProjectContext {
  private _projects: Project[] = [];

  get projects() {
    return this._projects
  }

  set projects(p: Project[]) {
    this._projects = p;
    this.saveToStorage(p);
  }

  private selectionChangeSource = new ReplaySubject<Project>(1);
  readonly selectionChange$ = this.selectionChangeSource;

  constructor() {
    const projs = this.loadFromStorage();
    if (projs && projs.length > 0) {
      this._projects = projs;
      this.selectionChangeSource.next(this._projects[0]);
    }
  }

  selectProject(p: Project) {
    this.selectionChangeSource.next(p)
    console.log('select p', p.name);
  }

  private saveToStorage(projs: Project[]) {
    const items = projs.map(p => ({
      name: p.name,
      dir: p.dir,
      cmd: p.cmd,
    }));
    window.localStorage.setItem('projects', JSON.stringify(items))
  }

  private loadFromStorage(): Project[] {
    const backup = window.localStorage.getItem('projects');
    if (backup) {
     return JSON.parse(backup).map((p: any) => new Project(p.name, p.cmd, p.dir));
    }

    return null;
  }
}
