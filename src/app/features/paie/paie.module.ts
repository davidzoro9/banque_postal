import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaieRoutingModule } from './paie-routing.module';
import { PaieOverviewComponent } from './paie-overview/paie-overview.component';
import { GenererBulletinsComponent } from './bulletins/generer-bulletins/generer-bulletins.component';
import { BulletinIndividuelComponent } from './bulletins/bulletin-individuel/bulletin-individuel.component';
import { HistoriqueBulletinsComponent } from './bulletins/historique-bulletins/historique-bulletins.component';
import { CategoriesElementsComponent } from './parametrage/categories-elements/categories-elements.component';
import { ElementsSalaireComponent } from './parametrage/elements-salaire/elements-salaire.component';
import { AvoirsComponent } from './variables/avoirs/avoirs.component';
import { PrecomptesComponent } from './variables/precomptes/precomptes.component';
import { TropPercusComponent } from './variables/trop-percus/trop-percus.component';
import { RubriquesPaieComponent } from './elements/rubriques-paie/rubriques-paie.component';
import { CotisationsPaieComponent } from './elements/cotisations-paie/cotisations-paie.component';
import { DsnComponent } from './declarations/dsn/dsn.component';
import { UrssafComponent } from './declarations/urssaf/urssaf.component';
import { ParametragePaieComponent } from './parametrage-paie/parametrage-paie.component';
import { TypesRetenuesComponent } from './types-retenues/types-retenues.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    PaieOverviewComponent,
    GenererBulletinsComponent,
    BulletinIndividuelComponent,
    HistoriqueBulletinsComponent,
    CategoriesElementsComponent,
    ElementsSalaireComponent,
    AvoirsComponent,
    PrecomptesComponent,
    TropPercusComponent,
    RubriquesPaieComponent,
    CotisationsPaieComponent,
    DsnComponent,
    UrssafComponent,
    ParametragePaieComponent,
    TypesRetenuesComponent
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
    MatNativeDateModule
  ]
})
export class PaieModule {}
