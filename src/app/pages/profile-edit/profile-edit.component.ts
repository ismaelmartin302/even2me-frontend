import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IApiResponseUser } from '../../services/models/user-api.interface';
import { UsersApiService } from '../../services/users-api.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-edit',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  user: IApiResponseUser | null = null;
  private userSubscription: Subscription | undefined;
  selectedFile: File | null = null;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private usersApiService: UsersApiService,
    private userService: UserService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      nickname: [''],
      biography: [''],
      location: [''],
      website: [''],
      avatar: ['']
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.profileForm.patchValue({
          username: this.user.username,
          nickname: this.user.nickname,
          biography: this.user.biography,
          location: this.user.location,
          website: this.user.website,
        });
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

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      const userData = this.profileForm.value;

      this.usersApiService.updateUser(this.user.id, userData).subscribe(
        () => {
          console.log('Profile updated successfully');
          this.router.navigate(['/profile']);
        },
        error => {
          console.error('Error updating profile', error);
        }
      );
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string | ArrayBuffer | null;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
