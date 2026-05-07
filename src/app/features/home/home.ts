import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatFormField,
  MatLabel,
  MatOption,
  MatSelect,
} from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Country } from '../../core/services/country';
import { CountryCard } from './country-card/country-card';

export type SortOption = 'name-asc' | 'name-desc' | 'pop-asc' | 'pop-desc';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    CountryCard,
    MatProgressSpinnerModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatInput,
    MatIconModule,
    MatSlideToggle,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private coreService = inject(Country);

  readonly regions = signal<string[]>([
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ]);

  sortOptions = signal<{ value: SortOption; label: string }[]>([
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'pop-asc', label: 'Population (Lowest First)' },
    { value: 'pop-desc', label: 'Population (Highest First)' },
  ]);
  sortBy = signal<SortOption>('name-asc');

  searchTerm = signal<string>('');
  selectedRegion = signal<string>('');
  searchByCapital = signal<boolean>(false);

  isLoading = computed(() => this.countries().length === 0);
  countries = this.coreService.countries;

  filteredCountries = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const region = this.selectedRegion();
    const byCapital = this.searchByCapital();
    const allCountries = this.countries();
    const sortMethod = this.sortBy();

    const filtered = allCountries.filter((country) => {
      const regionMatch = !region || country.region === region;

      if (byCapital) {
        const capitalMatch =
          !term ||
          (country.capital &&
            country.capital[0] &&
            country.capital[0].toLowerCase().includes(term));
        return regionMatch && capitalMatch;
      } else {
        const nameMatch = country.name.common.toLowerCase().includes(term);
        return regionMatch && nameMatch;
      }
    });

    return filtered.sort((a, b) => {
      switch (sortMethod) {
        case 'name-asc':
          return a.name.common.localeCompare(b.name.common);
        case 'name-desc':
          return b.name.common.localeCompare(a.name.common);
        case 'pop-asc':
          return a.population - b.population;
        case 'pop-desc':
          return b.population - a.population;
        default:
          return 0;
      }
    });
  });
}
