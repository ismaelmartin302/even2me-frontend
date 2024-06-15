import { Component } from '@angular/core';
import { UsersApiService } from '../../services/users-api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [FontAwesomeModule, DatePipe],
  providers: [UsersApiService, AuthService],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  likes: any[] = [];

  constructor(private usersApiService: UsersApiService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(): void {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.usersApiService.getUserLikes(user.id).subscribe(likes => {
          this.likes = likes;
        });
      }
    });
  }
  goToUserProfile(username: string): void {
    this.router.navigate(['/user', username]);
  }

  goToEvent(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }
  isNaN(value: any): boolean {
    return isNaN(value);
  }
}
