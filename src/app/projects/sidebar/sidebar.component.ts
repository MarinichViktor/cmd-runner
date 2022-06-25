import { Component, OnInit } from '@angular/core';
import { ProjectContext } from '../project.context';
import { Project } from '../project';
import { filter, tap } from 'rxjs';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
  selectedProject: Project;

  constructor(readonly projectContext: ProjectContext, readonly projectService: ProjectService) { }

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

  startProject(project: Project) {
    this.projectService.start(project).subscribe(() => console.log('get response'))
  }

  stopProject(project: Project) {
    project.stop();
  }
}
