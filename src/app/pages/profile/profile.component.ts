import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsersApiService } from '../../services/users-api.service';
import { IApiResponseFollower, IApiResponseFollowing, IApiResponseUser } from '../../services/models/user-api.interface';
import { IApiResponseEvent } from '../../services/models/event-api.interface';
import { EventComponent } from '../../records/event/event.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule, EventComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user: IApiResponseUser | null = null;
  isExpanded: boolean = false;
  username: string = '';
  events: IApiResponseEvent[] = [];
  followers: IApiResponseFollower[] = [];
  followings: IApiResponseFollowing[] = [];
  showFollowersPopup: boolean = false;
  showFollowingsPopup: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private usersApiService: UsersApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username') || '';
      this.loadUser();
      this.loadUserEvents();
      this.loadUserFollowers();
      this.loadUserFollowings();
      this.showFollowersPopup = false;
      this.showFollowingsPopup = false;
    });
  }

  loadUser(): void {
    this.usersApiService.getUserByUsername(this.username).subscribe(
      data => {
        this.user = data;
      },
      error => {
        console.error('Error fetching user', error);
      }
    );
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
  loadUserEvents(): void {
    this.usersApiService.getUserEvents(this.username).subscribe(
      data => {
        this.events = data;
      },
      error => {
        console.error('Error fetching user events', error);
      }
    );
  }

  loadUserFollowers(): void {
    this.usersApiService.getUserFollowers(this.username).subscribe(
      data => {
        this.followers = data;
        console.log(data)
      },
      error => {
        console.error('Error fetching user followers', error);
      }
    );
  }

  loadUserFollowings(): void {
    this.usersApiService.getUserFollowings(this.username).subscribe(
      data => {
        this.followings = data;
      },
      error => {
        console.error('Error fetching user followings', error);
      }
    );
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
