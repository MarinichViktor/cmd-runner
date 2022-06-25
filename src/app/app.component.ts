import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import {flatMap, from, interval, Subject} from "rxjs";
import {LINES} from "./constants";
import {DomSanitizer} from "@angular/platform-browser";
import { Terminal } from 'xterm';
import { ElectronService } from './electron.service';
import { Project } from './projects/project';
import { ProjectContext } from './projects/project.context';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'project-runner';

  source = new Subject<string>();
  items: string[] = []
  term = new Terminal({cols: 125, rows: 50});

  constructor(readonly electronService: ElectronService, readonly projectContext: ProjectContext, private ngZone: NgZone) {
    this.electronService.ipcRenderer.on("load-projects", (event, projects) => {
      this.ngZone.run(() => {
        this.projectContext.projects = Object.entries(projects as {[key: string]: any}).map(([key, value]) => {
          return new Project(key, value.cmd, value.dir)
        });
      });
    });
  }

  // ngAfterViewInit(): void {
  //   const lines = LINES.split("\n");
  //   let i = 0 ;
  //   this.term.open(document.getElementById('term') as HTMLElement);
  //   this.term.write(LINES);
  //   // const subs = interval(100).subscribe(() => {
  //   //
  //   //   // if (i > 200) {
  //   //   //   console.log('called exited')
  //   //   //   subs.unsubscribe();
  //   //   // }
  //   //
  //   //   this.term.writeln(lines[i] + "\n", () => {
  //   //     console.log('written line');
  //   //   });
  //   //   // console.log('called next')
  //   //   // this.source.next(lines[i]);
  //   //   // if (this.items.length > 100) {
  //   //   //   this.items.shift();
  //   //   // }
  //   //   //
  //   //   // this.items.push(line);
  //   //   // document.querySelector('#some')?.scrollIntoView();
  //   //   i++;
  //   // });
  // }

  ngOnInit() {
    // const lines = LINES.split("\n");
    // let i = 0 ;
    // const subs = interval(300).subscribe(() => {
    //   console.log('called subsc')
    //   if (lines.length - 5 < i) {
    //     console.log('called exited')
    //     subs.unsubscribe();
    //   }
    //
    //   console.log('called next')
    //   this.source.next(lines[i]);
    //   if (this.items.length > 100) {
    //     this.items.shift();
    //   }
    //   let line = lines[i].replace(/[^\x20-\x7E]/g, '');
    //   this.items.push(line);
    //   document.querySelector('#some')?.scrollIntoView();
    //   i++;
    // });


  }


}
