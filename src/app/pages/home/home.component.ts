import { Component, inject, Input, OnInit } from '@angular/core';
import { UsersApiService } from '../../services/users-api.service';
import { HttpClientModule } from '@angular/common/http';
import { IApiResponseUser } from '../../services/models/user-api.interface';
import { UserComponent } from '../../records/user/user.component';
import { IApiResponseEvent } from '../../services/models/event-api.interface';
import { EventsApiService } from '../../services/events-api.service';
import { EventComponent } from '../../records/event/event.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, EventComponent, FontAwesomeModule],
  providers: [EventsApiService, UsersApiService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly _eventsApiService = inject(EventsApiService)
  private readonly _usersApiService = inject(UsersApiService)
  events: IApiResponseEvent[] = [];
  users: IApiResponseUser[] = [];
  isLoggedIn: boolean = false;
  constructor(private sharedService: SharedService) {}
  ngOnInit(): void {
    this._eventsApiService.getEvents().subscribe((events) => {
      this.events = events;
    });
    this._usersApiService.getUsers().subscribe((users) => {
      this.users = users
    });
    this.sharedService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }
}
