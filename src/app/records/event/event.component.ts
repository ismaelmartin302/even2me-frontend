import { Component, Input } from '@angular/core';
import { IApiResponseEvent } from '../../services/models/event-api.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FontAwesomeModule, DatePipe],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent {
  imagen_visible: boolean = false;
  @Input({ required: true }) event?: IApiResponseEvent;
  constructor(private router: Router) {}
  ocultar_imagen() {
    this.imagen_visible = false;
  }

  mostrar_imagen() {
    this.imagen_visible = true;
  }
  goToUserProfile(username: string): void {
    this.router.navigate(['/user', username]);
  }
}
