import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IApiResponseEvent } from '../../services/models/event-api.interface';
import { EventsApiService } from '../../services/events-api.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsersApiService } from '../../services/users-api.service';
import { DatePipe, NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-post',
  providers: [EventsApiService],
  standalone: true,
  imports: [FontAwesomeModule, DatePipe, NgClass, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  @ViewChild('commentsSection', { static: false }) commentsSection!: ElementRef;
  event: IApiResponseEvent | null = null;
  private eventSubscription: Subscription | undefined;
  imagen_visible: boolean = false;
  userId: number = 0;
  isLoggedIn: boolean = false;
  newComment: string = '';
  loggedInUser = {
    avatar: '',
    nickname: ''
  };

  constructor(
    private route: ActivatedRoute,
    private eventsApiService: EventsApiService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private usersApiService: UsersApiService,
    private authService: AuthService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      this.userId = user ? user.id : null;
      this.loggedInUser = user ? { avatar: user.avatar, nickname: user.nickname } : { avatar: '', nickname: '' };
    });

    this.eventSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.eventsApiService.getEventById(+id);
        } else {
          throw new Error('Event ID is required');
        }
      })
    ).subscribe(
      event => {
        this.event = event;
      },
      error => {
        console.error('Error loading event data', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
  goToUserProfile(username: string): void {
    this.router.navigate(['/user', username]);
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

  scrollToComments() {
    this.commentsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  postComment(): void {
    if (this.newComment.trim() && this.event) {
      const commentData = {
        user_id: this.userId,
        event_id: this.event.id,
        content: this.newComment
      };

      this.http.post('http://127.0.0.1:8000/api/comments', commentData).subscribe({
        next: (comment: any) => {
          // Chequeo para asegurar que el comentario tenga el usuario y el avatar
          if (comment && comment.user && comment.user.avatar) {
            this.event?.comments.push(comment);
          } else {
            window.location.reload();
            console.error('El comentario no tiene un usuario o avatar');
          }
          this.newComment = '';
        },
        error: (error) => {
          console.error('Error posting comment', error);
        }
      });
    }
  }
}
