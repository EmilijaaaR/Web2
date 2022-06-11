import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  public isMealAdded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }
}
