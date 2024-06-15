import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsersApiService } from '../../services/users-api.service';
import { EventsApiService } from '../../services/events-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  providers: [EventsApiService, UsersApiService],
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent {
  searchForm: FormGroup;
  searchResults: any[] = [];
  searchType: string = 'all'; // 'all', 'users', 'events'

  constructor(
    private fb: FormBuilder,
    private usersApiService: UsersApiService,
    private eventsApiService: EventsApiService,
    public router: Router
  ) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  ngOnInit(): void {
  }

  onSearch(): void {
    const query = this.searchForm.get('query')?.value;
    if (query) {
      this.searchResults = [];
      if (this.searchType === 'all' || this.searchType === 'users') {
        this.usersApiService.searchUsers(query).subscribe(users => {
          this.searchResults.push(...users);
        });
      }
      if (this.searchType === 'all' || this.searchType === 'events') {
        this.eventsApiService.searchEvents(query).subscribe(events => {
          this.searchResults.push(...events);
        });
      }
    }
  }

  navigateToProfile(username: string): void {
    this.router.navigate(['/user', username]);
  }

  navigateToEvent(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }
}
