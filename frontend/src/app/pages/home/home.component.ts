import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { Quote } from '../../models/quote.model';
import { MovieService } from '../../services/movie.service';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly quoteService = inject(QuoteService);

  randomQuote: Quote | null = null;
  recentMovies: Movie[] = [];
  loading = true;

  ngOnInit(): void {
    this.quoteService.getRandom().subscribe({
      next: (quote) => (this.randomQuote = quote),
      error: () => (this.randomQuote = null),
    });

    this.movieService.getAll().subscribe({
      next: (movies) => {
        this.recentMovies = movies.slice(0, 6);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
