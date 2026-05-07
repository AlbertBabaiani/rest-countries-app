import { DecimalPipe } from '@angular/common';
import { Component, DOCUMENT, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { catchError, filter, of, switchMap } from 'rxjs';
import { CountryModel } from '../../models/country.model';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Country } from '../../core/services/country';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-country-detail',
  imports: [DecimalPipe, RouterLink, MatButton, MatIconModule],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.scss',
})
export class CountryDetail {
  private router = inject(Router);
  private countryService = inject(Country);

  private titleService = inject(Title);
  private document = inject(DOCUMENT);

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

  getFirstNativeName(country: CountryModel): string {
    const key = Object.keys(country.name.nativeName)[0];
    return country.name.nativeName[key].common;
  }

  getCurrencies(country: CountryModel): string {
    return Object.values(country.currencies)
      .map((c) => c.name)
      .join(', ');
  }

  getLanguages(country: CountryModel): string {
    return Object.values(country.languages).join(', ');
  }

  // Title and FavIcons

  constructor() {
    effect((onCleanup) => {
      const currentCountry = this.country();

      if (currentCountry) {
        this.titleService.setTitle(
          `${currentCountry.name.common} | Where in the world?`,
        );

        const faviconLink = this.getOrCreateFaviconLink();
        faviconLink.href = currentCountry.flags.svg;

        onCleanup(() => {
          this.titleService.setTitle('Where in the world?');
          faviconLink.href = 'favicon.ico';
        });
      }
    });
  }

  private getOrCreateFaviconLink(): HTMLLinkElement {
    let link = this.document.querySelector(
      "link[rel~='icon']",
    ) as HTMLLinkElement;
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'icon';
      this.document.head.appendChild(link);
    }
    return link;
  }
}
