import { Component, OnInit } from '@angular/core';
import { ProjectContext } from '../project.context';
import { Project } from '../project';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
  constructor(readonly projectsContext: ProjectContext) { }

  ngOnInit(): void {
  }

  selectProject(project: Project) {
    this.projectsContext.selectProject(project)
  }
}
