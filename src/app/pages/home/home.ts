import { Component, computed, inject, signal } from '@angular/core';
import { Country } from '../../services/country';
import { ICountry } from '../../models/country.model';
import { FormsModule } from '@angular/forms';
import { CountryCard } from '../../components/country-card/country-card';
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
  regions = signal<string[]>([
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ]);

  private countryService = inject(Country);

  countries = signal<ICountry[]>([]);

  isLoading = signal<boolean>(true);

  searchTerm = signal<string>('');
  selectedRegion = signal<string>('');

  searchByCapital = signal<boolean>(false);

  filteredCountries = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const region = this.selectedRegion();
    const byCapital = this.searchByCapital();

    return this.countries().filter((country) => {
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
  });

  ngOnInit() {
    this.countryService.getAllCountries().subscribe((data) => {
      this.isLoading.set(false);
      this.countries.set(data);
    });
  }
}
