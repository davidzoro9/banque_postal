import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProfilsRoutingModule } from './profils-routing.module';
import { ProfilsOverviewComponent } from './profils-overview/profils-overview.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { HabilitationsMatrixComponent } from './habilitations-matrix/habilitations-matrix.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ManuelUtilisateurComponent } from './manuel-utilisateur/manuel-utilisateur.component';

@NgModule({
  declarations: [
    ProfilsOverviewComponent,
    RolesListComponent,
    HabilitationsMatrixComponent,
    UsersListComponent,
    ManuelUtilisateurComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProfilsRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule
  ]
})
export class ProfilsModule {}
// Module Profils & Habilitations
