import {Subject} from 'rxjs';

export class Process {
  constructor(readonly dataSource: Subject<string>,
              readonly exitSource: Subject<void>,
              readonly closeSource: Subject<void>) {
  }
}
