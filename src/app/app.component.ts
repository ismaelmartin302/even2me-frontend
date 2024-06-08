import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell as farBell, faComment as farComment, faCalendar as farCalendar, faHeart as farHeart, faUser as farUser, faCalendarXmark as farCalendarXmark } from '@fortawesome/free-regular-svg-icons';
import { faBars, faBell, faCalendar, faCalendarXmark, faComment, faHeart, faHouse, faLink, faLocationDot, faMagnifyingGlass, faPlus, faRetweet, faUser, faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { MenuComponent } from './layout/menu/menu.component';
import { IApiResponseUser } from './services/models/user-api.interface';
import { UsersApiService } from './services/users-api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [UsersApiService],
  imports: [RouterOutlet, FontAwesomeModule, MenuComponent, HttpClientModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(library: FaIconLibrary, public router: Router, private cdr: ChangeDetectorRef) {
    library.addIcons(farHeart, farUser, farComment, farCalendarXmark, farCalendar, farBell);
    library.addIcons(faHeart, faUser, faLink, faRetweet, faCalendarXmark, faComment, faCalendar, faBell, faPlus, faHouse, faUserPlus, faUserMinus, faMagnifyingGlass, faLocationDot, faBars);
  }
  currentUrl: string = this.router.url;

  private readonly _usersApiService = inject(UsersApiService)
  
  users: IApiResponseUser[] = [];
  ngOnInit(): void {
    this._usersApiService.getUsers().subscribe((users) => {
      this.users = users
      this.currentUrl = this.router.url
      this.cdr.detectChanges();
      console.log(this.currentUrl)
    });
  }
} 
