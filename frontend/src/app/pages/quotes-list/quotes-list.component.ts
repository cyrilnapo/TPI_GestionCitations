import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Quote } from '../../models/quote.model';
import { AuthService } from '../../services/auth.service';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quotes-list',
  standalone: true,
  imports: [RouterLink, FormsModule, AsyncPipe],
  templateUrl: './quotes-list.component.html',
  styleUrl: './quotes-list.component.css',
})
export class QuotesListComponent implements OnInit {
  private readonly quoteService = inject(QuoteService);
  readonly authService = inject(AuthService);

  allQuotes: Quote[] = [];
  filteredQuotes: Quote[] = [];
  searchQuery = '';
  loading = true;

  readonly isAuthenticated$ = this.authService.isAuthenticated$;

  ngOnInit(): void {
    this.quoteService.getAll().subscribe({
      next: (quotes) => {
        this.allQuotes = quotes;
        this.filteredQuotes = quotes;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredQuotes = this.allQuotes;
      return;
    }
    this.filteredQuotes = this.allQuotes.filter(
      (quote) =>
        quote.text.toLowerCase().includes(q) ||
        quote.character_name.toLowerCase().includes(q) ||
        quote.actor_name.toLowerCase().includes(q),
    );
  }
}
