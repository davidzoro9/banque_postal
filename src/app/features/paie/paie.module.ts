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
import { CategoriesElementsComponent } from './parametrage/categories-elements/categories-elements.component';
import { ElementsSalaireComponent } from './parametrage/elements-salaire/elements-salaire.component';
import { AvoirsComponent } from './variables/avoirs/avoirs.component';
import { PrecomptesComponent } from './variables/precomptes/precomptes.component';
import { TropPercusComponent } from './variables/trop-percus/trop-percus.component';
import { CotisationsPaieComponent } from './elements/cotisations-paie/cotisations-paie.component';
import { DsnComponent } from './declarations/dsn/dsn.component';
import { UrssafComponent } from './declarations/urssaf/urssaf.component';
import { ParametragePaieComponent } from './parametrage-paie/parametrage-paie.component';
import { TypesRetenuesComponent } from './types-retenues/types-retenues.component';
import { EtatsSyntheseComponent } from './etats-synthese/etats-synthese.component';
import { CalculatriceSimulationComponent } from './simulation/calculatrice-simulation.component';
import { ComptesComptablesComponent } from './parametrage/comptes-comptables/comptes-comptables.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    PaieOverviewComponent,
    GenererBulletinsComponent,
    HistoriqueBulletinsComponent,
    CategoriesElementsComponent,
    ElementsSalaireComponent,
    AvoirsComponent,
    PrecomptesComponent,
    TropPercusComponent,
    CotisationsPaieComponent,
    DsnComponent,
    UrssafComponent,
    ParametragePaieComponent,
    TypesRetenuesComponent,
    EtatsSyntheseComponent,
    CalculatriceSimulationComponent,
    ComptesComptablesComponent
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSnackBarModule
  ]
})
export class PaieModule {}
