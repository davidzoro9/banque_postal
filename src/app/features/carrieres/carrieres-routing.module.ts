import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrieresOverviewComponent } from './carrieres-overview/carrieres-overview.component';

const routes: Routes = [
  { path: '', component: CarrieresOverviewComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrieresRoutingModule {}
