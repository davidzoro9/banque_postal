import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

import { DonneesBaseRoutingModule } from './donnees-base-routing.module';
import { DbOverviewComponent } from './db-overview/db-overview.component';
import { DbRefListComponent } from './db-ref-list/db-ref-list.component';

@NgModule({
  declarations: [
    DbOverviewComponent,
    DbRefListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DonneesBaseRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule
  ]
})
export class DonneesBaseModule {}
