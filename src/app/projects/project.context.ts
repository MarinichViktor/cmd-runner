import { Injectable } from '@angular/core';
import { Project } from './project';
import { Subject } from 'rxjs';

@Injectable()
export class ProjectContext {
  projects: Project[] = [
    new Project("Sandbox cat", "cat main.go", '/home/vmaryn/projects/go/sandbox'),
    new Project("Sandbox docker", "docker compose up", '/home/vmaryn/projects/go/sandbox'),
    new Project("Sandbox ls", "ls", '/home/vmaryn/projects/go/sandbox'),
  ];

  private selectionChangeSource = new Subject<Project>;
  readonly selectionChange$ = this.selectionChangeSource.asObservable();

  constructor() {
    if (this.projects.length) {
       this.selectionChangeSource.next(this.projects[0]);
    }
  }

  selectProject(p: Project) {
    this.selectionChangeSource.next(p)
    console.log('select p', p.name);
  }
}
