import { Component, inject } from '@angular/core';
import { Theme } from '../../services/theme';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
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
