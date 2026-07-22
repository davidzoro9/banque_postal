import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaieRoutingModule } from './paie-routing.module';
import { PaieOverviewComponent } from './paie-overview/paie-overview.component';
import { GenererBulletinsComponent } from './bulletins/generer-bulletins/generer-bulletins.component';
import { HistoriqueBulletinsComponent } from './bulletins/historique-bulletins/historique-bulletins.component';
import { RubriquesPaieComponent } from './elements/rubriques-paie/rubriques-paie.component';
import { CotisationsPaieComponent } from './elements/cotisations-paie/cotisations-paie.component';
import { DsnComponent } from './declarations/dsn/dsn.component';
import { UrssafComponent } from './declarations/urssaf/urssaf.component';
import { ParametragePaieComponent } from './parametrage-paie/parametrage-paie.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    PaieOverviewComponent,
    GenererBulletinsComponent,
    HistoriqueBulletinsComponent,
    RubriquesPaieComponent,
    CotisationsPaieComponent,
    DsnComponent,
    UrssafComponent,
    ParametragePaieComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaieRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class PaieModule {}
