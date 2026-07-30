import { Component } from '@angular/core';
import { InactivityService } from './core/services/inactivity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  constructor(private inactivityService: InactivityService) {}
}
