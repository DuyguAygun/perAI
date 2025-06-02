import {Component, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink, Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {AuthService} from '../../auth/auth.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, NgIf, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
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
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  isSubmitted: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (this.signupForm.invalid) {
      this.errorMessage = this.getFormErrors();
      return;
    }

    if (this.signupForm.value.password !== this.signupForm.value.repeatPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    const signupData = {
      name: this.signupForm.value.firstname,
      lastName: this.signupForm.value.surname,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    this.authService.signup(signupData)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: async (response) => {
          console.log('Signup successful:', response);
          try {
            await this.router.navigate(['/login']);
          } catch (error) {
            console.error('Navigation failed:', error);
            this.errorMessage = 'Failed to navigate to login page';
          }
        },
        error: (error: any) => {
          this.errorMessage = error.message || 'Signup failed';
        }
      });
  }

  private getFormErrors(): string {
    const errors: string[] = [];
    const controls = this.signupForm.controls;

    if (controls['firstname'].errors?.['required'] || controls['surname'].errors?.['required'] || controls['email'].errors?.['required'] || controls['password'].errors?.['required'] || controls['repeatPassword'].errors?.['required']) {
      errors.push('Empty places detected');
    }

    if (controls['email'].errors?.['email']) {
      errors.push('Invalid email format');
    }

    if (controls['password'].errors?.['minlength']) {
      errors.push('Password must be at least 8 characters');
    }

    if (controls['repeatPassword'].errors?.['minlength']) {
      errors.push('Repeat Password must be at least 8 characters');
    }

    if (controls['password'].value !== controls['repeatPassword'].value) {
      errors.push('Passwords must match');
    }

    return errors.join('. ');
  }
}
