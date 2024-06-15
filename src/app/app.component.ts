import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell as farBell, faComment as farComment, faCalendar as farCalendar, faHeart as farHeart, faUser as farUser, faCalendarXmark as farCalendarXmark } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faBars, faBell, faCalendar, faCalendarXmark, faCheck, faCoins, faComment, faEllipsisVertical, faHeart, faHouse, faImage, faLink, faLocationDot, faMagnifyingGlass, faPlus, faRetweet, faUser, faUserGroup, faUserMinus, faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { MenuComponent } from './layout/menu/menu.component';
import { IApiResponseUser } from './services/models/user-api.interface';
import { UsersApiService } from './services/users-api.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';
import { ExploreComponent } from './pages/explore/explore.component';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [UsersApiService, AuthService],
  imports: [RouterOutlet, FontAwesomeModule, MenuComponent, HttpClientModule, RouterLink, ExploreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isLoggedIn: boolean = false;
  user: any = null;
  loading: boolean = true;
  constructor(library: FaIconLibrary, public router: Router, private cdr: ChangeDetectorRef, private authService: AuthService, private sharedService: SharedService) {
    library.addIcons(farHeart, farUser, farComment, farCalendarXmark, farCalendar, farBell);
    library.addIcons(faHeart, faUser, faLink, faRetweet, faImage, faCalendarXmark, faXmark, faCheck, faComment, faCalendar, faBell, faPlus, faHouse, faUserPlus, faCoins, faUserGroup, faUserMinus, faMagnifyingGlass, faArrowRightFromBracket, faEllipsisVertical, faLocationDot, faBars);
  }
  currentUrl: string = this.router.url;

  private readonly _usersApiService = inject(UsersApiService)

  users: IApiResponseUser[] = [];

  ngOnInit(): void {
    this._usersApiService.getUsers().subscribe(users => {
      this.users = users;
      this.currentUrl = this.router.url;
      this.cdr.detectChanges();
      console.log(this.currentUrl);
    });

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.sharedService.setLoggedIn(isLoggedIn);

      if (isLoggedIn) {
        this.authService.getUser().subscribe(user => {
          this.user = user;
          this.loading = false;
          this.cdr.detectChanges();
        }, () => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      } else {
        this.user = null;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  logout() {
    this.authService.logout();
    this.cdr.detectChanges();
  }
} 
