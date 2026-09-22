import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { EtatsSyntheseComponent } from './etats-synthese/etats-synthese.component';

const routes: Routes = [
  { path: '', component: PaieOverviewComponent },
  
  // États de synthèse (sous-menus individuels)
  { path: 'etats-synthese', component: EtatsSyntheseComponent },
  { path: 'etats-synthese/:code', component: EtatsSyntheseComponent },
  { path: 'etats', redirectTo: 'etats-synthese/livre-paie', pathMatch: 'full' },
  
  // 1. Traitements & Bulletins
  { path: 'lots', component: GenererBulletinsComponent },
  { path: 'bulletins', redirectTo: 'lots', pathMatch: 'full' },
  { path: 'bulletins/individuel', redirectTo: 'bulletins', pathMatch: 'full' },
  { path: 'bulletins/lot', redirectTo: 'lots', pathMatch: 'full' },
  { path: 'bulletins/generer', redirectTo: 'lots', pathMatch: 'full' },
  { path: 'bulletins/historique', component: HistoriqueBulletinsComponent },

  // 2. Éléments Variables
  { path: 'variables/avoirs', component: AvoirsComponent },
  { path: 'variables/rappels', component: AvoirsComponent },
  { path: 'variables/precomptes', component: PrecomptesComponent },
  { path: 'variables/trop-percus', component: TropPercusComponent },
  { path: 'avoirs', redirectTo: 'variables/avoirs', pathMatch: 'full' },
  { path: 'rappels', redirectTo: 'variables/avoirs', pathMatch: 'full' },
  { path: 'precomptes', redirectTo: 'variables/precomptes', pathMatch: 'full' },
  { path: 'trop-percus', redirectTo: 'variables/trop-percus', pathMatch: 'full' },

  // 3. Paramétrage de la Paie
  { path: 'parametrage/categories', component: CategoriesElementsComponent },
  { path: 'parametrage/elements', component: ElementsSalaireComponent },
  { path: 'parametrage/cotisations', component: CotisationsPaieComponent },
  { path: 'elements/rubriques', component: ElementsSalaireComponent },
  { path: 'elements/cotisations', component: CotisationsPaieComponent },
  { path: 'types-retenues', component: TypesRetenuesComponent },
  { path: 'parametrage', component: ParametragePaieComponent },
  
  // 4. Déclarations
  { path: 'declarations/dsn', component: DsnComponent },
  { path: 'declarations/urssaf', component: UrssafComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaieRoutingModule {}
