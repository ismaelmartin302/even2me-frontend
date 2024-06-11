import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsersApiService } from '../../services/users-api.service';
import { IApiResponseFollower, IApiResponseFollowing, IApiResponseUser } from '../../services/models/user-api.interface';
import { IApiResponseEvent } from '../../services/models/event-api.interface';
import { EventComponent } from '../../records/event/event.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { forkJoin, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule, EventComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: IApiResponseUser | null = null;
  isExpanded: boolean = false;
  username: string = '';
  events: IApiResponseEvent[] = [];
  followers: IApiResponseFollower[] = [];
  followings: IApiResponseFollowing[] = [];
  showFollowersPopup: boolean = false;
  showFollowingsPopup: boolean = false;
  private userSubscription: Subscription | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private usersApiService: UsersApiService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        const usernameParam = params.get('username');
        if (usernameParam) {
          this.username = usernameParam;
          return this.usersApiService.getUserByUsername(this.username);
        } else if (this.router.url === '/profile') {
          return this.userService.user$.pipe(
            switchMap(user => {
              if (user) {
                this.user = user;
                this.username = user.username;
                return forkJoin({
                  events: this.usersApiService.getUserEvents(this.username),
                  followers: this.usersApiService.getUserFollowers(this.username),
                  followings: this.usersApiService.getUserFollowings(this.username)
                });
              } else {
                throw new Error('User is not loaded');
              }
            })
          );
        } else {
          throw new Error('Username is required');
        }
      })
    ).subscribe(
      result => {
        if (result) {
          console.error("CARGA BIEN")
        }
      },
      error => {
        console.error('Error loading user data', error);
      }
    );
  }
  
    
 
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getBiography(): SafeHtml {
    if (this.user) {
      if (this.isExpanded) {
        return this.sanitizer.bypassSecurityTrustHtml(this.user.biography);
      } else {
        return this.sanitizer.bypassSecurityTrustHtml(this.limitar_Caracteres(this.user.biography));
      }
    }
    return '';
  }

  limitar_Caracteres(texto: string): string {
    if (texto.length >= 200) {
      return texto.substring(0, 200) + '... <span class="text-secondary clickable"> [Mostrar Más] </span>';
    } else {
      return texto;
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleFollowersPopup(): void {
    this.showFollowersPopup = !this.showFollowersPopup;
  }

  toggleFollowingsPopup(): void {
    this.showFollowingsPopup = !this.showFollowingsPopup;
  }

  goToUserProfile(username: string): void {
    this.router.navigate(['/user', username]);
  }

  closePopupOutside(event: Event, popupType: 'followers' | 'followings'): void {
    const popupContent = (event.target as HTMLElement).closest('.popup-content');
    if (!popupContent) {
      if (popupType === 'followers') {
        this.showFollowersPopup = false;
      } else {
        this.showFollowingsPopup = false;
      }
    }
  }
}
