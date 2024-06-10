import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UsersApiService } from '../../../services/users-api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.password_confirmation) {
        this.error = 'Passwords do not match';
        return;
      }

      this.authService.register(this.registerForm.value).subscribe(
        () => {
          this.router.navigate(['/home']);
        },
        (error) => {
          this.error = 'Registration failed';
          console.error('Registration error', error);
        }
      );
    }
  }
}
