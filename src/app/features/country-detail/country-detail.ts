import { DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { catchError, filter, Observable, of, switchMap } from 'rxjs';
import { ICountry } from '../../models/country.model';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Country } from '../../core/services/country';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-country-detail',
  imports: [DecimalPipe, RouterLink, MatButton, MatIconModule],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.scss',
})
export class CountryDetail {
  private router = inject(Router);
  private countryService = inject(Country);

  name = input.required<string>();

  private country$ = toObservable(this.name).pipe(
    filter((name) => !!name),
    switchMap((name) =>
      this.countryService.getCountryByName(name.toLocaleLowerCase()),
    ),
    catchError((error) => {
      console.error('Failed to fetch country:', error);
      this.router.navigate(['/404']);
      return of(null);
    }),
  );

  private borderCountries$ = this.country$.pipe(
    switchMap((country) => {
      if (!country || !country.borders || country.borders.length === 0) {
        return of([]);
      }
      return this.countryService.getCountriesByCodes(country.borders);
    }),
  );

  country = toSignal(this.country$);
  borderCountries = toSignal(this.borderCountries$, { initialValue: [] });

  getFirstNativeName(country: ICountry): string {
    const key = Object.keys(country.name.nativeName)[0];
    return country.name.nativeName[key].common;
  }

  getCurrencies(country: ICountry): string {
    return Object.values(country.currencies)
      .map((c) => c.name)
      .join(', ');
  }

  getLanguages(country: ICountry): string {
    return Object.values(country.languages).join(', ');
  }
}
