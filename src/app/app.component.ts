import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {flatMap, from, interval, Subject} from "rxjs";
import {LINES} from "./constants";
import {DomSanitizer} from "@angular/platform-browser";
import { Terminal } from 'xterm';


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

  constructor(readonly sanitizer: DomSanitizer) {
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
