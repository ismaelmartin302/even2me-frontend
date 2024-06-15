import { Component, Input } from '@angular/core';
import { IApiResponseEvent } from '../../services/models/event-api.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { UsersApiService } from '../../services/users-api.service';
import { AuthService } from '../../services/auth.service';
import { EventsApiService } from '../../services/events-api.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FontAwesomeModule, DatePipe, NgClass],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent {
  imagen_visible: boolean = false;
  userId: number = 0;
  showDeleteModal: boolean = false;
  @Input() isLoggedIn: boolean = false;

  @Input({ required: true }) event?: IApiResponseEvent;

  constructor(private router: Router, private usersApiService: UsersApiService, private authService: AuthService, private eventApiService: EventsApiService) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      this.userId = user ? user.id : null;
    });
  }
  ocultar_imagen() {
    this.imagen_visible = false;
  }

  mostrar_imagen() {
    this.imagen_visible = true;
  }

  goToUserProfile(username: string): void {
    this.router.navigate(['/user', username]);
  }

  goToEvent(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }
  scrollToComments(eventId: number): void {
    this.router.navigate(['/event', eventId], { fragment: 'comments-section' });
  }
  isLiked(): boolean {
    return !!(this.event?.likes?.some((like: { id: number }) => like.id === this.userId));
  }
  isNaN(value: any): boolean {
    return isNaN(value);
  }
  toggleLike(): void {
    if (this.event && this.event.likes && this.isLoggedIn) {
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
  canDeleteEvent(): boolean {
    return this.authService.isLoggedIn() && this.event?.user_id === this.userId;
  }
  openDeleteModal(): void {
    this.showDeleteModal = true;
  }
  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  deleteEvent(): void {
    if (this.event) {
      console.log(this.event.id)
      this.eventApiService.deleteEvent(this.event.id).subscribe({
        next: () => {
          alert('Evento eliminado con éxito.');
          window.location.reload();
        },
        error: (err) => {
          console.error('Error eliminando el evento:', err);
          alert('Hubo un error al eliminar el evento.');
        }
      });
      this.closeDeleteModal();  // Cerrar el modal después de la eliminación
    }
  }
}
