import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Theme } from '../../core/services/theme';

@Component({
  selector: 'header[app-header]',
  imports: [RouterLink, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  themeService = inject(Theme);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
