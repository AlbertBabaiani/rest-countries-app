import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButton, MatIconModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {}
