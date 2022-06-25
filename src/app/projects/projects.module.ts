import { NgModule } from '@angular/core';
import { ProjectsComponent } from './projects/projects.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProjectContext } from './project.context';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProjectComponent } from './project/project.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  imports: [
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatToolbarModule
  ],
  declarations: [
    ProjectsComponent,
    SidebarComponent,
    ProjectComponent,
  ],
  providers: [
    ProjectContext,
  ],
})
export class ProjectsModule {
}
