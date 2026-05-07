import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CountryModel } from '../../models/country.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class Country {
  private http = inject(HttpClient);
  private baseUrl = 'https://restcountries.com/v3.1';

  readonly countries: Signal<CountryModel[]> = toSignal(
    this.http.get<CountryModel[]>(
      `${this.baseUrl}/all?fields=name,capital,flags,population,region`,
    ),
    { initialValue: [] },
  );

  getCountryByName(name: string): Observable<CountryModel> {
    return this.http
      .get<CountryModel[]>(`${this.baseUrl}/name/${name}?fullText=true`)
      .pipe(map((countries) => countries[0]));
  }

  getCountriesByCodes(codes: string[]): Observable<CountryModel[]> {
    return this.http.get<CountryModel[]>(
      `${this.baseUrl}/alpha?codes=${codes.join(',')}`,
    );
  }
}
