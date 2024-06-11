import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersApiService } from '../../../services/users-api.service';
import { Router } from '@angular/router';
import { IApiResponseEvent } from '../../../services/models/event-api.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService } from '../../../services/user.service';
import { IApiResponseUser } from '../../../services/models/user-api.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit, OnDestroy {
  user: IApiResponseUser | null = null;
  eventForm: FormGroup;
  customCapacitySelected = false;
  private userSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private usersApiService: UsersApiService,
    private userService: UserService,
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
        user_id: ['', Validators.required] // Inicializar sin user_id
      });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        console.log('User ID:', this.user.id);
        this.eventForm.patchValue({ user_id: this.user.id });
      } else {
        console.error('User is not loaded');      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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
      this.eventForm.get('capacity')?.setValidators(Validators.required);
      this.eventForm.get('capacity')?.updateValueAndValidity();
    } else {
      this.eventForm.get('capacity')?.clearValidators();
      this.eventForm.get('capacity')?.updateValueAndValidity();
    }
  }
}
