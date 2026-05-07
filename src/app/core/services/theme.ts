import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  theme = signal<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      localStorage.setItem('theme', currentTheme);
      document.body.className = currentTheme;
    });
  }

  toggleTheme() {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }
}
