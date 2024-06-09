import { Component, Input } from '@angular/core';
import { IApiResponseEvent } from '../../services/models/event-api.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { UsersApiService } from '../../services/users-api.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FontAwesomeModule, DatePipe, NgClass],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent {
  imagen_visible: boolean = false;
  userId: number = 2;
  @Input({ required: true }) event?: IApiResponseEvent;
  constructor(private router: Router, private usersApiService: UsersApiService) {}
  ocultar_imagen() {
    this.imagen_visible = false;
  }

  mostrar_imagen() {
    this.imagen_visible = true;
  }
  goToUserProfile(username: string): void {
    this.router.navigate(['/user', username]);
  }

  isLiked(): boolean {
    return !!(this.event && this.event.likes && this.event.likes.some((like: { id: number }) => like.id === this.userId));
}

toggleLike(): void {
    console.log(this.event);
    if (this.event && this.event.likes) {
        if (this.isLiked()) {
            this.usersApiService.unlikeEvent(this.event.id, this.userId).subscribe(() => {
                if (this.event && this.event.likes) {
                    this.event.likes = this.event.likes.filter(like => like.id !== this.userId);
                    this.event.likes_count--;
                }
            });
        } else {
            this.usersApiService.likeEvent(this.event.id, this.userId).subscribe(() => {
                if (this.event && this.event.likes) {
                    this.event.likes.push({ id: this.userId, username: 'current_user' });
                    this.event.likes_count++;
                }
            });
        }
    }
}



}
