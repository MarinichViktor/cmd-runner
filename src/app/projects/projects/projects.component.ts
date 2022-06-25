import { AfterViewInit, ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { ProjectContext } from '../project.context';
import { ProjectService } from '../project.service';
import { filter, switchMap, takeUntil, tap } from 'rxjs';
import { Project } from '../project';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  term: Terminal;
  fitAddon: FitAddon;

  isOpened = false;
  selectedProject: Project;
  content: string = "";

  constructor(readonly projectContext: ProjectContext, private projServ: ProjectService, private ngZone: NgZone) {
    this.term = new Terminal();
    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);
    // (window as any).fitAddon = this.fitAddon
    this.fitAddon.activate(this.term);
  }

  ngOnInit(): void {
    }

  ngAfterViewInit(): void {
    this.term.open(document.getElementById('term') as HTMLElement);
    this.term.onResize((evt) => {
      console.log('xterm on resize', evt)
      // this.fitAddon.fit();
      // this.term.resize(evt.cols, evt.rows);
      // this.fitAddon.fit();
      // setTimeout(() => {
        this.fitAddon.fit();
      // }, 0)
    });
    window.onresize = () => {
    //   console.log('window on resize')
    //   // document.getElementById('term2').style.width = "90vw"
    //   setTimeout(() => {
        this.fitAddon.fit();
    //   }, 0)
    //   // const props = this.fitAddon.proposeDimensions();
    //   //  console.log('props dim', props)
    //   // this.term.resize(props.cols, props.rows);
    }
    // this.term.write(LINES);
    this.projectContext.selectionChange$
      .pipe(
        filter(p => !!p),
        tap((project) => {
            this.selectedProject = project;
        }),
        switchMap((project) => project.started$),
        switchMap(() => this.selectedProject.data$),
        tap((data) => {
          this.ngZone.run(() => {
            // this.content += data
            data.split("\n").forEach(s => {
              this.term.writeln(s);
            })
            console.log('************************************');
            console.log('*content', this.content, "content end");
          });
        })
      )
      .subscribe(e => console.log('evt', e), e => console.log('err', e), () => console.log('done'));
  }

  startProject() {
    this.projServ.start(this.selectedProject).subscribe(() => console.log('get response'))
  }

  stopProject() {
    this.selectedProject.stop();
  }
}
