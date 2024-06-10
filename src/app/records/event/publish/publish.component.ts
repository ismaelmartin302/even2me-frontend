import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersApiService } from '../../../services/users-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IApiResponseEvent } from '../../../services/models/event-api.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IApiResponseUser } from '../../../services/models/user-api.interface';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './publish.component.html',
  styleUrl: './publish.component.scss'
})
export class PublishComponent {
  user: IApiResponseUser | null = null;
  user_id: number = 1;
  eventForm: FormGroup;
  customCapacitySelected = false;

  constructor (
    private fb: FormBuilder,
    private usersApiService: UsersApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
      this.eventForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        location: ['', Validators.required],
        price: [''],
        capacity: [''],
        category: [''],
        picture: [''],
        website: [''],
        starts_at: ['', Validators.required],
        finish_in: ['',],
        user_id: [this.user_id, Validators.required]
      });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.loadUser();
    });
  }
  loadUser(): void {
    this.usersApiService.getUserByID(this.user_id).subscribe(
      data => {
        this.user = data;
      },
      error => {
        console.error('Error fetching user', error);
      }
    );
  }
  onSubmit() {
    if (this.eventForm.valid) {
      this.usersApiService.createEvent(this.eventForm.value).subscribe(
        (event: IApiResponseEvent) => {
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Error creating event', error);
        }
      );
    }
  }
  onCapacityChange(value: string): void {
    this.customCapacitySelected = value === 'personalizada';
    if (this.customCapacitySelected) {
      this.eventForm.get('customCapacity')?.setValidators(Validators.required);
      this.eventForm.get('customCapacity')?.updateValueAndValidity();
    } else {
      this.eventForm.get('customCapacity')?.clearValidators();
      this.eventForm.get('customCapacity')?.updateValueAndValidity();
    }
  }
}
