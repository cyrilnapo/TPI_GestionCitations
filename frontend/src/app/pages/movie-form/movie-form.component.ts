import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.css',
})
export class MovieFormComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  editId: number | null = null;
  isEditMode = false;
  submitting = false;

  readonly form = this.fb.nonNullable.group({
    title_fr: ['', Validators.required],
    title_en: ['', Validators.required],
    release_date: ['', Validators.required],
    image_path: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      this.isEditMode = true;
      this.movieService.getById(this.editId).subscribe({
        next: (movie) => {
          this.form.patchValue({
            title_fr: movie.title_fr,
            title_en: movie.title_en,
            release_date: movie.release_date,
            image_path: movie.image_path ?? '',
          });
        },
        error: () => this.snackBar.open('Film introuvable.', 'Fermer', { duration: 4000 }),
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title_fr, title_en, release_date, image_path } = this.form.getRawValue();
    const payload = { title_fr, title_en, release_date, image_path: image_path || undefined };

    this.submitting = true;

    if (this.isEditMode && this.editId) {
      this.movieService.update(this.editId, payload).subscribe({
        next: (movie) => this.router.navigate(['/movies', movie.id]),
        error: (err) => this.handleError(err),
      });
    } else {
      this.movieService.create(payload).subscribe({
        next: (movie) => this.router.navigate(['/movies', movie.id]),
        error: (err) => this.handleError(err),
      });
    }
  }

  private handleError(error: any): void {
    this.submitting = false;
    const message = error?.error?.message || 'Une erreur est survenue.';
    this.snackBar.open(message, 'Fermer', { duration: 5000 });
  }
}
