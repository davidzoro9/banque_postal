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

const routes: Routes = [
  { path: '', component: PaieOverviewComponent },
  { path: 'bulletins/generer', component: GenererBulletinsComponent },
  { path: 'bulletins/historique', component: HistoriqueBulletinsComponent },
  { path: 'elements/rubriques', component: RubriquesPaieComponent },
  { path: 'elements/cotisations', component: CotisationsPaieComponent },
  { path: 'declarations/dsn', component: DsnComponent },
  { path: 'declarations/urssaf', component: UrssafComponent },
  { path: 'parametrage', component: ParametragePaieComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaieRoutingModule {}
