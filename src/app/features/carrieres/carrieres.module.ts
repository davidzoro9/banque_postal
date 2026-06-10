import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CarrieresRoutingModule } from './carrieres-routing.module';
import { CarrieresOverviewComponent } from './carrieres-overview/carrieres-overview.component';

@NgModule({
  declarations: [CarrieresOverviewComponent],
  imports: [CommonModule, CarrieresRoutingModule, MatCardModule, MatIconModule, MatButtonModule]
})
export class CarrieresModule {}
