import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersApiService } from '../../../services/users-api.service';
import { Router } from '@angular/router';
import { IApiResponseEvent } from '../../../services/models/event-api.interface';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './publish.component.html',
  styleUrl: './publish.component.scss'
})
export class PublishComponent {
  eventForm: FormGroup;

  constructor (
    private fb: FormBuilder,
    private usersApiService: UsersApiService,
    private router: Router
  ) {
      this.eventForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        location: ['', Validators.required],
        price: ['', Validators.required],
        capacity: ['', Validators.required],
        category: ['', Validators.required],
        picture: [''],
        website: [''],
        starts_at: ['', Validators.required],
        finish_in: ['', Validators.required],
        user_id: [1, Validators.required] // Assume user_id is 1 for now
      });
  }
  onSubmit() {
    if (this.eventForm.valid) {
      this.usersApiService.createEvent(this.eventForm.value).subscribe(
        (event: IApiResponseEvent) => {
          this.router.navigate(['/home', event.id]);
        },
        error => {
          console.error('Error creating event', error);
        }
      );
    }
  }
}
