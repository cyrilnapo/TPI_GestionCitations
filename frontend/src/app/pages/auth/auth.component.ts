import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  private readonly formBuilder = inject(FormBuilder);

  isLoginMode = true;

  readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  readonly signupForm = this.formBuilder.nonNullable.group(
    {
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: [this.passwordMatchValidator],
    },
  );

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.isLoginMode = params.get('mode') !== 'signup';
    });
  }

  switchMode(mode: 'login' | 'signup'): void {
    this.isLoginMode = mode === 'login';

    this.router.navigate([], {
      queryParams: { mode: mode === 'signup' ? 'signup' : null },
    });
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.authService.login(username, password).subscribe({
      next: () => {
        this.loginForm.reset();
        this.router.navigate(['/']);
      },
      error: (error) => this.showError(error),
    });
  }

  submitSignup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.signupForm.getRawValue();
    this.authService.register(username, password).subscribe({
      next: () => {
        this.signupForm.reset();
        this.router.navigate(['/']);
      },
      error: (error) => this.showError(error),
    });
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value ?? '';
    const confirmPassword = group.get('confirmPassword')?.value ?? '';

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private showError(error: any): void {
    const message = error?.error?.message || 'Une erreur est survenue. Réessayez.';

    this.snackBar.open(message, 'Fermer', { duration: 5000 });
  }
}
