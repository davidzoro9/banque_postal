import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

// Component Modules
import { CarrieresRoutingModule } from './carrieres-routing.module';
import { CarrieresOverviewComponent } from './carrieres-overview/carrieres-overview.component';
import { CompetencesComponent } from './competences/competences.component';
import { FormationsComponent } from './formations/formations.component';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { MobiliteComponent } from './mobilite/mobilite.component';

@NgModule({
  declarations: [
    CarrieresOverviewComponent,
    CompetencesComponent,
    FormationsComponent,
    EvaluationsComponent,
    MobiliteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CarrieresRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule
  ]
})
export class CarrieresModule {}
