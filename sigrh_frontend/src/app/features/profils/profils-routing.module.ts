import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfilsOverviewComponent } from './profils-overview/profils-overview.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { HabilitationsMatrixComponent } from './habilitations-matrix/habilitations-matrix.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ManuelUtilisateurComponent } from './manuel-utilisateur/manuel-utilisateur.component';

const routes: Routes = [
  { path: '', component: ProfilsOverviewComponent },
  { path: 'roles', component: RolesListComponent },
  { path: 'habilitations', component: HabilitationsMatrixComponent },
  { path: 'utilisateurs', component: UsersListComponent },
  { path: 'manuel', component: ManuelUtilisateurComponent },
  { path: 'guides', component: ManuelUtilisateurComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilsRoutingModule {}
