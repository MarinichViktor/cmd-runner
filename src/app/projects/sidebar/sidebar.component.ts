import { Component, OnInit } from '@angular/core';
import { ProjectContext } from '../project.context';
import { Project } from '../project';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
  selectedProject: Project;

  constructor(readonly projectContext: ProjectContext) { }

  ngOnInit(): void {
    this.projectContext.selectionChange$
      .pipe(
        filter(p => !!p),
        tap((project) => {
          this.selectedProject = project;
        })
      )
        .subscribe()

  }

  selectProject(project: Project) {
    this.projectContext.selectProject(project)
  }
}
