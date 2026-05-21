import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { MovieFormComponent } from './pages/movie-form/movie-form.component';
import { MoviesListComponent } from './pages/movies-list/movies-list.component';
import { MyContentComponent } from './pages/my-content/my-content.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { QuoteDetailComponent } from './pages/quote-detail/quote-detail.component';
import { QuoteFormComponent } from './pages/quote-form/quote-form.component';
import { QuotesListComponent } from './pages/quotes-list/quotes-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies', component: MoviesListComponent },
  { path: 'movies/add', component: MovieFormComponent },
  { path: 'movies/:id/edit', component: MovieFormComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: 'quotes', component: QuotesListComponent },
  { path: 'quotes/add', component: QuoteFormComponent },
  { path: 'quotes/:id/edit', component: QuoteFormComponent },
  { path: 'quotes/:id', component: QuoteDetailComponent },
  { path: 'my-content', component: MyContentComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', component: NotFoundComponent } // other routes
];
