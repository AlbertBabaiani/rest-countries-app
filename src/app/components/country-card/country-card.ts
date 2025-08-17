import { Component, input, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICountry } from '../../models/country.model';
import { MatCard, MatCardContent, MatCardImage } from '@angular/material/card';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-country-card',
  imports: [RouterLink, MatCard, MatCardImage, MatCardContent, DecimalPipe],
  templateUrl: './country-card.html',
  styleUrl: './country-card.scss',
})
export class CountryCard {
  country = input.required<ICountry>();
}
