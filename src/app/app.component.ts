import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell as farBell, faComment as farComment, faCalendar as farCalendar, faHeart as farHeart, faUser as farUser, faCalendarXmark as farCalendarXmark } from '@fortawesome/free-regular-svg-icons';
import { faBars, faBell, faCalendar, faCalendarXmark, faComment, faHeart, faHouse, faLink, faLocationDot, faMagnifyingGlass, faRetweet, faUser, faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FontAwesomeModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(farHeart, farUser, farComment, farCalendarXmark, farCalendar, farBell);
    library.addIcons(faHeart, faUser, faLink, faRetweet, faCalendarXmark, faComment, faCalendar, faBell, faHouse, faUserPlus, faUserMinus, faMagnifyingGlass, faLocationDot, faBars);
  }
} 
