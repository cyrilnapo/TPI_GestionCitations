import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './quote-form.component.html',
  styleUrl: './quote-form.component.css',
})
export class QuoteFormComponent implements OnInit {
  private readonly quoteService = inject(QuoteService);
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  editId: number | null = null;
  isEditMode = false;
  submitting = false;
  movies: Movie[] = [];

  readonly form = this.fb.nonNullable.group({
    text: ['', Validators.required],
    character_name: ['', Validators.required],
    actor_name: ['', Validators.required],
    movie_id: [0 as number, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.movieService.getAll().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.applyQueryParams();
      },
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      this.isEditMode = true;
      this.quoteService.getById(this.editId).subscribe({
        next: (quote) => {
          this.form.patchValue({
            text: quote.text,
            character_name: quote.character_name,
            actor_name: quote.actor_name,
            movie_id: quote.movie_id,
          });
        },
        error: () => this.snackBar.open('Citation introuvable.', 'Fermer', { duration: 4000 }),
      });
    }
  }

  private applyQueryParams(): void {
    const movieId = this.route.snapshot.queryParamMap.get('movie_id');
    if (movieId && !this.isEditMode) {
      this.form.patchValue({ movie_id: +movieId });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { text, character_name, actor_name, movie_id } = this.form.getRawValue();
    const payload = { text, character_name, actor_name, movie_id };

    this.submitting = true;

    if (this.isEditMode && this.editId) {
      this.quoteService.update(this.editId, payload).subscribe({
        next: (quote) => this.router.navigate(['/quotes', quote.id]),
        error: (err) => this.handleError(err),
      });
    } else {
      this.quoteService.create(payload).subscribe({
        next: (quote) => this.router.navigate(['/quotes', quote.id]),
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
