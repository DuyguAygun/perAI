import {Component, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink, Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {AuthService} from '../../auth/auth.service';
import {finalize} from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    style: `
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
      position: fixed;
      top: 0;
      left: 0;
    `
  }
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isSubmitted: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = this.getFormErrors();
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value)
      .pipe(
        switchMap(() => this.authService.getCurrentUser()),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: async (user) => {
          console.log('Current user:', user);

          try {
            if (user.role === 'TEACHER') {
              await this.router.navigate(['/teacherdictionary']);
            } else {
              await this.router.navigate(['/dictionary']);
            }
          } catch (error) {
            console.error('Navigation failed:', error);
            this.errorMessage = 'Failed to navigate to main page';
          }
        },
        error: (error: string) => {
          this.errorMessage = error;
        }
      });
  }

  private getFormErrors(): string {
    const errors: string[] = [];
    const controls = this.loginForm.controls;

    if (controls['email'].errors?.['required'] || controls['password'].errors?.['required']) {
      errors.push('All fields are required');
    }

    if (controls['email'].errors?.['email']) {
      errors.push('Please enter a valid email address');
    }

    if (controls['password'].errors?.['minlength']) {
      errors.push('Password must be at least 8 characters');
    }

    return errors.join('. ');
  }
}
