import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Quote } from '../../models/quote.model';
import { AuthService } from '../../services/auth.service';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quote-detail',
  standalone: true,
  imports: [RouterLink, AsyncPipe, MatSnackBarModule],
  templateUrl: './quote-detail.component.html',
  styleUrl: './quote-detail.component.css',
})
export class QuoteDetailComponent implements OnInit {
  private readonly quoteService = inject(QuoteService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  readonly authService = inject(AuthService);

  quote: Quote | null = null;
  loading = true;

  readonly currentUser$ = this.authService.user$;

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.quoteService.getById(id).subscribe({
      next: (quote) => {
        this.quote = quote;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Citation introuvable.', 'Fermer', { duration: 4000 });
      },
    });
  }

  delete(): void {
    if (!this.quote) return;
    if (!confirm('Supprimer cette citation ?')) return;

    this.quoteService.delete(this.quote.id).subscribe({
      next: () => this.router.navigate(['/quotes']),
      error: () =>
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 4000 }),
    });
  }
}
