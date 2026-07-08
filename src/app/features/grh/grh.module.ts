import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Routing
import { GrhRoutingModule } from './grh-routing.module';

// Components
import { GrhOverviewComponent } from './grh-overview/grh-overview.component';
import { EmployeeListComponent } from './employes/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employes/employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './employes/employee-form/employee-form.component';
import { ParametresRhComponent } from './parametres-rh/parametres-rh.component';

// Section components
import { InfosPersonnellesComponent } from './employes/sections/infos-personnelles/infos-personnelles.component';
import { FamilleComponent } from './employes/sections/famille/famille.component';
import { InfosProComponent } from './employes/sections/infos-pro/infos-pro.component';
import { CategorieComponent } from './employes/sections/categorie/categorie.component';
import { IndemnitesComponent } from './employes/sections/indemnites/indemnites.component';
import { ExonerationsComponent } from './employes/sections/exonerations/exonerations.component';
import { SalaireComponent } from './employes/sections/salaire/salaire.component';
import { DossierComponent } from './employes/sections/dossier/dossier.component';
import { NotesRhComponent } from './employes/sections/notes-rh/notes-rh.component';
import { CongesFormComponent } from './conges/conges-form/conges-form.component';
import { CongesListComponent } from './conges/conges-list/conges-list.component';
import { AbsencesFormComponent } from './absences/absences-form/absences-form.component';
import { AbsencesListComponent } from './absences/absences-list/absences-list.component';
import { ContratsListComponent } from './contrats/contrats-list/contrats-list.component';
import { ContratsForm } from './contrats/contrats-form/contrats-form';

@NgModule({
  declarations: [
    GrhOverviewComponent,
    EmployeeListComponent,
    EmployeeDetailComponent,
    EmployeeFormComponent,
    ParametresRhComponent,
    InfosPersonnellesComponent,
    FamilleComponent,
    InfosProComponent,
    CategorieComponent,
    IndemnitesComponent,
    ExonerationsComponent,
    SalaireComponent,
    DossierComponent,
    NotesRhComponent,
    CongesFormComponent,
    CongesListComponent,
    AbsencesFormComponent,
    AbsencesListComponent,
    ContratsListComponent,
    ContratsForm
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GrhRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatStepperModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class GrhModule {}
