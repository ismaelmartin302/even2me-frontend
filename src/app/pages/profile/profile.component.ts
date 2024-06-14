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
import { forkJoin, of, Subscription, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { EventsApiService } from '../../services/events-api.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule, EventComponent],
  providers: [EventsApiService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
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
  isLoggedIn: boolean = false;
  currentUserId: number | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private usersApiService: UsersApiService,
    private userService: UserService,
    private router: Router,
    private sharedService: SharedService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.sharedService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
      }
    });
    this.userSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        const usernameParam = params.get('username');
        if (usernameParam) {
          this.username = usernameParam;
          return this.usersApiService.getUserByUsername(this.username).pipe(
            catchError(error => {
              if (error.status === 404) {
                this.router.navigate(['/404']);
              }
              return throwError(error);
            })
          );
        } else if (this.router.url === '/profile') {
          return this.userService.user$.pipe(
            switchMap(user => {
              if (user) {
                this.user = user;
                this.username = user.username;
                return forkJoin({
                  user: of(user),
                  events: this.usersApiService.getUserEvents(this.username),
                  followers: this.usersApiService.getUserFollowers(this.username),
                  followings: this.usersApiService.getUserFollowings(this.username)
                });
              } else {
                return of(null);
              }
            })
          );
        } else {
          return of(null);
        }
      })
    ).subscribe(
      result => {
        if (result) {
          if ('user' in result && 'events' in result && 'followers' in result && 'followings' in result) {
            this.user = result.user;
            this.events = result.events;
            this.followers = result.followers;
            this.followings = result.followings;
          } else if ('id' in result) {
            this.user = result;
            this.loadUserDetails();
          }
        } else {
          console.error('User is not loaded');
        }
      },
      error => {
        console.error('Error loading user data', error);
      }
    );
  }

  private loadUserDetails(): void {
    if (this.user) {
      forkJoin({
        events: this.usersApiService.getUserEvents(this.username),
        followers: this.usersApiService.getUserFollowers(this.username),
        followings: this.usersApiService.getUserFollowings(this.username)
      }).subscribe(
        ({ events, followers, followings }) => {
          this.events = events;
          this.followers = followers;
          this.followings = followings;
        },
        error => {
          console.error('Error loading user details', error);
        }
      );
    }
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
  isFollowing(): boolean {
    return this.followers.some(follower => follower.follower_id === this.currentUserId);
  }

  followUser(): void {
    if (this.user && this.currentUserId !== null) {
      this.usersApiService.followUser(this.currentUserId, this.user.id).subscribe((follower: IApiResponseFollower) => {
        this.followers.push(follower);
      });
    }
  }

  unfollowUser(): void {
    if (this.user && this.currentUserId !== null) {
      this.usersApiService.unfollowUser(this.currentUserId, this.user.id).subscribe(() => {
        this.followers = this.followers.filter(follower => follower.follower_id !== this.currentUserId);
      });
    }
  }
}
