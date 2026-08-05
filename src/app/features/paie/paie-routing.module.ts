import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaieOverviewComponent } from './paie-overview/paie-overview.component';
import { GenererBulletinsComponent } from './bulletins/generer-bulletins/generer-bulletins.component';
import { HistoriqueBulletinsComponent } from './bulletins/historique-bulletins/historique-bulletins.component';
import { RubriquesPaieComponent } from './elements/rubriques-paie/rubriques-paie.component';
import { CotisationsPaieComponent } from './elements/cotisations-paie/cotisations-paie.component';
import { DsnComponent } from './declarations/dsn/dsn.component';
import { UrssafComponent } from './declarations/urssaf/urssaf.component';
import { ParametragePaieComponent } from './parametrage-paie/parametrage-paie.component';
import { TypesRetenuesComponent } from './types-retenues/types-retenues.component';

const routes: Routes = [
  { path: '', component: PaieOverviewComponent },
  { path: 'bulletins/generer', component: GenererBulletinsComponent },
  { path: 'bulletins/historique', component: HistoriqueBulletinsComponent },
  { path: 'bulletins', redirectTo: 'bulletins/generer', pathMatch: 'full' },
  { path: 'generer', redirectTo: 'bulletins/generer', pathMatch: 'full' },
  { path: 'valider', redirectTo: 'bulletins/generer', pathMatch: 'full' },
  { path: 'cloture', redirectTo: 'bulletins/generer', pathMatch: 'full' },
  { path: 'historique', redirectTo: 'bulletins/historique', pathMatch: 'full' },
  { path: 'elements/rubriques', component: RubriquesPaieComponent },
  { path: 'elements/cotisations', component: CotisationsPaieComponent },
  { path: 'types-retenues', component: TypesRetenuesComponent },
  { path: 'parametrage', component: ParametragePaieComponent },
  { path: 'declarations/dsn', component: DsnComponent },
  { path: 'declarations/urssaf', component: UrssafComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaieRoutingModule {}
