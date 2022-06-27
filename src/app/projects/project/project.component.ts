import { Component, NgZone, OnInit } from '@angular/core';
import { ProjectContext } from '../project.context';
import { ProjectService } from '../project.service';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { filter, mergeMap, Subscription, tap } from 'rxjs';
import { Project } from '../project';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass']
})
export class ProjectComponent implements OnInit {
  term: Terminal;
  fitAddon: FitAddon;

  isOpened = false;
  selectedProject: Project;
  content: string = "";

  constructor(readonly projectContext: ProjectContext, private projServ: ProjectService, private ngZone: NgZone) {
    this.term = new Terminal();
    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);
    this.fitAddon.activate(this.term);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.term.open(document.getElementById('term') as HTMLElement);
    this.fitAddon.fit();
    this.term.onResize((evt) => {
      console.log('xterm on resize', evt)
      this.fitAddon.fit();
    });
    window.onresize = () => {
      this.fitAddon.fit();
    }

    let subscription: Subscription;
    this.projectContext.selectionChange$
      .pipe(
        filter(p => !!p),
        tap((project) => {
          this.content = "";
          this.selectedProject = project;
          this.term.clear();
          this.term.reset();

          if (subscription) {
            subscription.unsubscribe();
          }

          setTimeout(() => {
            subscription = this.selectedProject.started$.asObservable().pipe(
              mergeMap(() => this.selectedProject.data$),
              tap((data) => {
                this.ngZone.run(() => {
                  this.content += data
                  data.split("\n").forEach(s => this.term.writeln(s))
                });
              })
            ).subscribe(e => console.log('1evt', e), e => console.log('1err', e), () => console.log('1done'));
          }, 50);
        })
      )
      .subscribe(e => console.log('0evt', e), e => console.log('0err', e), () => console.log('0done'));
  }

  startProject() {
    this.projServ.start(this.selectedProject).subscribe(() => console.log('get response'))
  }

  stopProject() {
    this.selectedProject.stop();
  }

}
