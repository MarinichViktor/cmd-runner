import { NgModule } from '@angular/core';
import { ProjectsComponent } from './projects/projects.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProjectContext } from './project.context';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    CommonModule
  ],
  declarations: [
    ProjectsComponent,
    SidebarComponent,
  ],
  providers: [
    ProjectContext,
  ],
})
export class ProjectsModule {
}
