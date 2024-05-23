import { Component, Input } from '@angular/core';
import { IApiResponseEvent } from '../../services/models/event-api.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FontAwesomeModule, DatePipe],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent {

  @Input({ required: true }) event?: IApiResponseEvent;

}
