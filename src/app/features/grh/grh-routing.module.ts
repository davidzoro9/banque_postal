import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrhOverviewComponent } from './grh-overview/grh-overview.component';
import { EmployeeListComponent } from './employes/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employes/employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './employes/employee-form/employee-form.component';
import { ParametresRhComponent } from './parametres-rh/parametres-rh.component';
import { CongesFormComponent } from './conges/conges-form/conges-form.component';
import { CongesListComponent } from './conges/conges-list/conges-list.component';
import { AbsencesFormComponent } from './absences/absences-form/absences-form.component';
import { AbsencesListComponent } from './absences/absences-list/absences-list.component';
import { ContratsListComponent } from './contrats/contrats-list/contrats-list.component';
import { ContratsForm } from './contrats/contrats-form/contrats-form';
import { OrganigrammeComponent } from './organigramme/organigramme.component';

// Section components
import { InfosPersonnellesComponent } from './employes/sections/infos-personnelles/infos-personnelles.component';
import { FamilleComponent } from './employes/sections/famille/famille.component';
import { InfosProComponent } from './employes/sections/infos-pro/infos-pro.component';
import { CategorieComponent } from './employes/sections/categorie/categorie.component';
import { IndemnitesComponent } from './employes/sections/indemnites/indemnites.component';
import { ExonerationsComponent } from './employes/sections/exonerations/exonerations.component';
import { RetenuesComponent } from './employes/sections/retenues/retenues.component';
import { SalaireComponent } from './employes/sections/salaire/salaire.component';
import { DossierComponent } from './employes/sections/dossier/dossier.component';
import { NotesRhComponent } from './employes/sections/notes-rh/notes-rh.component';

const routes: Routes = [
  { path: '', component: GrhOverviewComponent },
  { path: 'organigramme',                    component: OrganigrammeComponent },
  { path: 'employes',                        component: EmployeeListComponent },
  { path: 'employes/nouveau',                component: EmployeeFormComponent },
  { path: 'employes/:id/modifier',           component: EmployeeFormComponent },
  { path: 'employes/:id/infos-personnelles', component: InfosPersonnellesComponent },
  { path: 'employes/:id/famille',            component: FamilleComponent },
  { path: 'employes/:id/infos-pro',          component: InfosProComponent },
  { path: 'employes/:id/categorie',          component: CategorieComponent },
  { path: 'employes/:id/indemnites',         component: IndemnitesComponent },
  { path: 'employes/:id/exonerations',       component: ExonerationsComponent },
  { path: 'employes/:id/retenues',           component: RetenuesComponent },
  { path: 'employes/:id/salaire',            component: SalaireComponent },
  { path: 'employes/:id/dossier',            component: DossierComponent },
  { path: 'employes/:id/notes-rh',           component: NotesRhComponent },
  { path: 'employes/:id',                    component: EmployeeDetailComponent },
  { path: 'conges',                          component: CongesListComponent },
  { path: 'conges/nouveau',                  component: CongesFormComponent },
  { path: 'absences',                        component: AbsencesListComponent },
  { path: 'absences/nouveau',                component: AbsencesFormComponent },
  { path: 'contrats',                        component: ContratsListComponent },
  { path: 'contrats/nouveau',                component: ContratsForm },
  { path: 'contrats/renouvellements',        component: ContratsListComponent },
  { path: 'parametres-rh',                   component: ParametresRhComponent },
  { path: '**',                              redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrhRoutingModule {}
