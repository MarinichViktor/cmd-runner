import { Process } from '../process';
import { Observable, Subject } from 'rxjs';

export class Project {
  private _process?: Process;
  started$ = new Subject<void>;
  completed$ = new Subject<void>;
  data$: Observable<string>;

  set process(p: Process|undefined) {
    this._process = p;
    if (p) {
      this.data$ = p.dataSource;
      this.started$.next();
    } else {
      this.completed$.next();
    }
  }

  get isRunning() {
    return !!this._process;
  }


  get exit$() {
    return this._process?.exitSource.asObservable()
  }

  constructor(
    readonly name: string,
    readonly cmd: string,
    readonly dir: string,
  ) {
  }

  stop() {
    if (!this.isRunning) {
      throw new Error("Project not running");
    }

    this._process?.closeSource.next();
    this._process?.closeSource.complete();
  }
}
