import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthenticated$ = this.authService.isAuthenticated$;
  readonly isAdmin$ = this.authService.isAdmin$;

  ngOnInit(): void {
    this.authService.refreshProfile().subscribe();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
    });
  }
}
