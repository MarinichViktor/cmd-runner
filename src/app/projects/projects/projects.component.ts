import { AfterViewInit, ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { ProjectContext } from '../project.context';
import { ProjectService } from '../project.service';
import { filter, mergeMap, of, Subscription, switchMap, takeUntil, tap } from 'rxjs';
import { Project } from '../project';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProjectsComponent {
  // term: Terminal;
  // fitAddon: FitAddon;
  //
  // isOpened = false;
  // selectedProject: Project;
  // content: string = "";
  //
  // constructor(readonly projectContext: ProjectContext, private projServ: ProjectService, private ngZone: NgZone) {
  //   this.term = new Terminal();
  //   this.fitAddon = new FitAddon();
  //   this.term.loadAddon(this.fitAddon);
  //   // (window as any).fitAddon = this.fitAddon
  //   this.fitAddon.activate(this.term);
  // }
  //
  // ngOnInit(): void {
  //   }
  //
  // ngAfterViewInit(): void {
  //   this.term.open(document.getElementById('term') as HTMLElement);
  //   this.term.onResize((evt) => {
  //     console.log('xterm on resize', evt)
  //       this.fitAddon.fit();
  //   });
  //   window.onresize = () => {
  //       this.fitAddon.fit();
  //   }
  //   console.log('after view inti called)))))))))))))))))))))))))))')
  //   // this.term.write(LINES);
  //
  //   let subscription: Subscription;
  //   this.projectContext.selectionChange$
  //     .pipe(
  //       filter(p => !!p),
  //       tap((project) => {
  //         this.content = "";
  //         this.selectedProject = project;
  //         this.term.reset();
  //
  //         if (subscription) {
  //           subscription.unsubscribe();
  //         }
  //
  //         subscription = this.selectedProject.started$.asObservable().pipe(
  //           mergeMap(() => this.selectedProject.data$),
  //           tap((data) => {
  //             this.ngZone.run(() => {
  //               this.content += data
  //               data.split("\n").forEach(s => {
  //                 this.term.writeln(s);
  //               })
  //               console.log('************************************');
  //               console.log('*content', this.content, "content end");
  //             });
  //           })
  //         ).subscribe(e => console.log('1evt', e), e => console.log('1err', e), () => console.log('1done'));
  //
  //       })
  //     )
  //     .subscribe(e => console.log('0evt', e), e => console.log('0err', e), () => console.log('0done'));
  //
  //   // this.projectContext.selectionChange$
  //   //   .pipe(
  //   //     filter(p => !!p),
  //   //     tap((project) => {
  //   //         this.content = "";
  //   //         this.selectedProject = project;
  //   //         this.term.reset();
  //   //     }),
  //   //     switchMap((project) => {
  //   //       console.log('switch map fired', this.selectedProject.name);
  //   //       return of(project);
  //   //     }),
  //   //     mergeMap((project) => project.started$),
  //   //     mergeMap((project) => this.selectedProject.data$),
  //   //     // switchMap(() => this.selectedProject.data$),
  //   //     tap((data) => {
  //   //       this.ngZone.run(() => {
  //   //         this.content += data
  //   //         data.split("\n").forEach(s => {
  //   //           this.term.writeln(s);
  //   //         })
  //   //         console.log('************************************');
  //   //         console.log('*content', this.content, "content end");
  //   //       });
  //   //     })
  //   //   )
  //   //   .subscribe(e => console.log('evt', e), e => console.log('err', e), () => console.log('done'));
  // }
  //
  // startProject() {
  //   this.projServ.start(this.selectedProject).subscribe(() => console.log('get response'))
  // }
  //
  // stopProject() {
  //   this.selectedProject.stop();
  // }
}
