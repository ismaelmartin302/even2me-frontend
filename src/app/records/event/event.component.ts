import { Component, Input } from '@angular/core';
import { IApiResponseEvent } from '../../services/models/event-api.interface';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent {

  @Input({ required: true }) event?: IApiResponseEvent;

}
