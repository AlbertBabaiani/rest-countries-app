import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { NotFound } from './features/not-found/not-found';

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
      import('./features/country-detail/country-detail').then(
        (m) => m.CountryDetail,
      ),
    title: 'Country Details',
  },
  {
    path: '**',
    component: NotFound,
    title: '404 - Page Not Found',
  },
];
