import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Movie } from '../../models/movie.model';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [RouterLink, AsyncPipe, MatSnackBarModule],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetailComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  readonly authService = inject(AuthService);

  movie: Movie | null = null;
  loading = true;

  readonly currentUser$ = this.authService.user$;
  readonly isAuthenticated$ = this.authService.isAuthenticated$;

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.movieService.getById(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Film introuvable.', 'Fermer', { duration: 4000 });
      },
    });
  }

  delete(): void {
    if (!this.movie) return;
    if (!confirm('Supprimer ce film ?')) return;

    this.movieService.delete(this.movie.id).subscribe({
      next: () => this.router.navigate(['/movies']),
      error: () => this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 4000 }),
    });
  }
}
