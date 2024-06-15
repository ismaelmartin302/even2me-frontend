import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IApiResponseUser } from './models/user-api.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<IApiResponseUser | null> = new BehaviorSubject<IApiResponseUser | null>(null);
  public user$: Observable<IApiResponseUser | null> = this.userSubject.asObservable();

  constructor(private authService: AuthService) {
    this.loadUser();
  }

  private loadUser(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getUser().subscribe(user => {
        console.log('User loaded in UserService:', user);
        this.userSubject.next(user);
      }, error => {
        console.error('Error loading user in UserService:', error);
      });
    }
  }

  public getUser(): IApiResponseUser | null {
    const user = this.userSubject.value;
    console.log('Retrieved user from BehaviorSubject:', user);
    return user;
  }
}
