import {Subject} from 'rxjs';

export class Command {
  constructor(readonly dataSource: Subject<string>,
              readonly errSource: Subject<string>,
              readonly exitSource: Subject<void>,
              readonly closeSource: Subject<void>) {
  }
}
