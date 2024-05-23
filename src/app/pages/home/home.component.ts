import { Component, inject, Input, OnInit } from '@angular/core';
import { UsersApiService } from '../../services/users-api.service';
import { HttpClientModule } from '@angular/common/http';
import { IApiResponseUser } from '../../services/models/user-api.interface';
import { UserComponent } from '../../records/user/user.component';
import { IApiResponseEvent } from '../../services/models/event-api.interface';
import { EventsApiService } from '../../services/events-api.service';
import { EventComponent } from '../../records/event/event.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, EventComponent, FontAwesomeModule],
  providers: [EventsApiService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly _eventsApiService = inject(EventsApiService)
  events: IApiResponseEvent[] = [];
  ngOnInit(): void {
      this._eventsApiService.getEvents().subscribe((data) => (this.events = data))
  }
}
