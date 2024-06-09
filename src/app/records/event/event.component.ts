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
    return !!(this.event?.likes?.some((like: { id: number }) => like.id === this.userId));
  }

  toggleLike(): void {
    if (this.event && this.event.likes) {
        const wasLiked = this.isLiked();

        // Actualización optimista del UI
        if (wasLiked) {
            this.event.likes = this.event.likes.filter(like => like.id !== this.userId);
            this.event.likes_count = (this.event.likes_count ?? 0) - 1;
        } else {
            this.event.likes.push({ id: this.userId, username: 'current_user' });
            this.event.likes_count = (this.event.likes_count ?? 0) + 1;
        }

        // Hacer la llamada al servidor
        const likeObservable = wasLiked
            ? this.usersApiService.unlikeEvent(this.event.id!, this.userId)
            : this.usersApiService.likeEvent(this.event.id!, this.userId);

        likeObservable.subscribe({
            next: () => {
                // La llamada al servidor fue exitosa, no hacer nada adicional
            },
            error: () => {
                // Revertir cambios en caso de error
                if (this.event && this.event.likes) {
                    if (wasLiked) {
                        this.event.likes.push({ id: this.userId, username: 'current_user' });
                        this.event.likes_count = (this.event.likes_count ?? 0) + 1;
                    } else {
                        this.event.likes = this.event.likes.filter(like => like.id !== this.userId);
                        this.event.likes_count = (this.event.likes_count ?? 0) - 1;
                    }
                }
            }
        });
    }
}
}
