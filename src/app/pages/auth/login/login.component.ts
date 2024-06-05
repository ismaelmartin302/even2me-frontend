import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = {email: '', password: ''};
  constructor(private readonly authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.credentials).subscribe((response) => {
      if (response) {
        this.router.navigate(['/home']);
        }
        });
  }
}
