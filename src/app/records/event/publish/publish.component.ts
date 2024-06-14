import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  customPriceSelected = false;
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
      price: ['', Validators.required],
      capacity: [''],
      category: [''],
      picture: [''],
      website: [''],
      starts_at: ['', [Validators.required, this.dateValidator]],
      finish_in: [''],
      user_id: ['', Validators.required]
    }, {
      validators: this.finishDateAfterStartDateValidator
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        console.log('User ID:', this.user.id);
        this.eventForm.patchValue({ user_id: this.user.id });
      } else {
        console.error('User is not loaded');
      }
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

  onPriceChange(value: string): void {
    this.customPriceSelected = value === 'custom';
    if (this.customPriceSelected) {
      this.eventForm.get('price')?.setValue('');
      this.eventForm.get('price')?.setValidators(Validators.required);
      this.eventForm.get('price')?.updateValueAndValidity();
    } else {
      this.eventForm.get('price')?.setValidators(null);
      this.eventForm.get('price')?.updateValueAndValidity();
    }
  }
  onStartDateChange(): void {
    const startDateControl = this.eventForm.get('starts_at');
    const finishDateControl = this.eventForm.get('finish_in');

    if (startDateControl && finishDateControl) {
      const startDate = new Date(startDateControl.value);
      finishDateControl.setValidators([this.dateValidator, this.finishDateAfterStartDateValidator.bind(this)]);
      finishDateControl.updateValueAndValidity();
    }
  }
  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const now = new Date();
    if (selectedDate < now) {
      return { 'invalidDate': true };
    }
    return null;
  }

  finishDateAfterStartDateValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const startDate = group.root.get('starts_at')?.value;
    const finishDate = group.value;
    if (!finishDate || finishDate == '') {
      return null; // No error if finish date is not provided
    }
    if (startDate && finishDate && new Date(finishDate) < new Date(startDate)) {
      return { 'finishDateBeforeStartDate': true };
    }
    return null;
  }
}
