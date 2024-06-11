import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private loggedInSource = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSource.asObservable();

  setLoggedIn(value: boolean) {
    this.loggedInSource.next(value);
  }
}
