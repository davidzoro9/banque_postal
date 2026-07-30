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

const routes: Routes = [
  { path: '', component: GrhOverviewComponent },
  { path: 'organigramme',                    component: OrganigrammeComponent },
  { path: 'employes',                        component: EmployeeListComponent },
  { path: 'employes/nouveau',                component: EmployeeFormComponent },
  { path: 'employes/:id/modifier',           component: EmployeeFormComponent },
  { path: 'employes/:id/infos-personnelles', component: EmployeeDetailComponent },
  { path: 'employes/:id/famille',            component: EmployeeDetailComponent },
  { path: 'employes/:id/infos-pro',          component: EmployeeDetailComponent },
  { path: 'employes/:id/categorie',          component: EmployeeDetailComponent },
  { path: 'employes/:id/indemnites',         component: EmployeeDetailComponent },
  { path: 'employes/:id/exonerations',       component: EmployeeDetailComponent },
  { path: 'employes/:id/retenues',           component: EmployeeDetailComponent },
  { path: 'employes/:id/salaire',            component: EmployeeDetailComponent },
  { path: 'employes/:id/dossier',            component: EmployeeDetailComponent },
  { path: 'employes/:id/notes-rh',           component: EmployeeDetailComponent },
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
