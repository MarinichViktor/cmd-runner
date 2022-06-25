import { Injectable } from '@angular/core';
import { Project } from './project';
import { BehaviorSubject, ReplaySubject, skip, Subject } from 'rxjs';

@Injectable()
export class ProjectContext {
  projects: Project[] = [
    new Project("Sandbox ng", "ng serve --port 5000", '/home/vmaryn/projects/js/proj_runner'),
    new Project("Sandbox docker", "docker compose up", '/home/vmaryn/projects/go/sandbox'),
    new Project("Sandbox ls", "ls", '/home/vmaryn/projects/go/sandbox'),
  ];
  private selectionChangeSource = new ReplaySubject<Project>(1);
  readonly selectionChange$ = this.selectionChangeSource;

  constructor() {
    if (this.projects.length) {
      console.log('selected project', this.projects[0]);
       this.selectionChangeSource.next(this.projects[0]);
    }
  }

  selectProject(p: Project) {
    this.selectionChangeSource.next(p)
    console.log('select p', p.name);
  }
}
