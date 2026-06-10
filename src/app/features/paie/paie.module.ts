import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PaieRoutingModule } from './paie-routing.module';
import { PaieOverviewComponent } from './paie-overview/paie-overview.component';

@NgModule({
  declarations: [PaieOverviewComponent],
  imports: [CommonModule, PaieRoutingModule, MatCardModule, MatIconModule, MatButtonModule]
})
export class PaieModule {}
