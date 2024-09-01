import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  loginData = {
    email: '',
    password: '',
  };

  private authService = inject(AuthService);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  onSubmit() {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorService.setError('Please enter both email and password.');
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.errorService.clearError();
        this.router.navigate(['/']);
      },
      error: (errorMessage) => {
        this.errorService.setError('Login failed: ' + errorMessage);
      },
    });
  }
}
