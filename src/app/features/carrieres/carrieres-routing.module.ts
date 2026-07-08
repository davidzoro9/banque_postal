import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrieresOverviewComponent } from './carrieres-overview/carrieres-overview.component';
import { CompetencesComponent } from './competences/competences.component';
import { FormationsComponent } from './formations/formations.component';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { MobiliteComponent } from './mobilite/mobilite.component';

const routes: Routes = [
  { path: '', component: CarrieresOverviewComponent },
  { path: 'competences/referentiel', component: CompetencesComponent },
  { path: 'competences/evaluation', component: CompetencesComponent },
  { path: 'formations/plan', component: FormationsComponent },
  { path: 'formations/catalogue', component: FormationsComponent },
  { path: 'formations/suivi', component: FormationsComponent },
  { path: 'evaluations/entretiens', component: EvaluationsComponent },
  { path: 'evaluations/objectifs', component: EvaluationsComponent },
  { path: 'mobilite', component: MobiliteComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrieresRoutingModule {}
