import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [RouterLink, FormsModule, AsyncPipe],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.css',
})
export class MoviesListComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  readonly authService = inject(AuthService);

  allMovies: Movie[] = [];
  filteredMovies: Movie[] = [];
  searchQuery = '';
  loading = true;

  readonly isAuthenticated$ = this.authService.isAuthenticated$;

  ngOnInit(): void {
    this.movieService.getAll().subscribe({
      next: (movies) => {
        this.allMovies = movies;
        this.filteredMovies = movies;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredMovies = this.allMovies;
      return;
    }
    this.filteredMovies = this.allMovies.filter(
      (m) => m.title_fr.toLowerCase().includes(q) || m.title_en.toLowerCase().includes(q),
    );
  }
}
