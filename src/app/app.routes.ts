import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'countries',
    pathMatch: 'full',
  },
  {
    path: 'countries',
    component: Home,
    title: 'Where in the world?',
  },
  {
    path: 'country/:name',
    loadComponent: () =>
      import('./pages/country-detail/country-detail').then(
        (m) => m.CountryDetail
      ),
    title: 'Country Details',
  },
  {
    path: '**',
    component: NotFound,
    title: '404 - Page Not Found',
  },
];
