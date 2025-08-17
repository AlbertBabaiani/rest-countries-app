import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Country } from '../../services/country';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { ICountry } from '../../models/country.model';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-country-detail',
  imports: [AsyncPipe, DecimalPipe, RouterLink, MatButton, MatIconModule],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.scss',
})
export class CountryDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private countryService = inject(Country);

  country$!: Observable<ICountry | null>;
  borderCountries$!: Observable<ICountry[]>;

  ngOnInit() {
    this.country$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.countryService.getCountryByName(
          params.get('name')?.toLocaleLowerCase() || ''
        )
      ),
      catchError((error) => {
        console.error('Failed to fetch country:', error);
        this.router.navigate(['/404']);
        return of(null);
      })
    );
    this.borderCountries$ = this.country$.pipe(
      switchMap((country) => {
        if (!country || !country.borders || country.borders.length === 0) {
          return of([]);
        }
        return this.countryService.getCountriesByCodes(country.borders);
      })
    );
  }

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
