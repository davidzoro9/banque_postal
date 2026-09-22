import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'sgrh-theme';
  private themeSubject = new BehaviorSubject<Theme>(this.loadSavedTheme());

  theme$ = this.themeSubject.asObservable();

  get isDark(): boolean {
    return this.themeSubject.value === 'dark';
  }

  get current(): Theme {
    return this.themeSubject.value;
  }

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  toggle(): void {
    const next: Theme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  private applyTheme(theme: Theme): void {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark-theme');
    } else {
      html.classList.remove('dark-theme');
    }
  }

  private loadSavedTheme(): Theme {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  }
}
