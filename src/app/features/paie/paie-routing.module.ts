import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaieOverviewComponent } from './paie-overview/paie-overview.component';

const routes: Routes = [
  { path: '', component: PaieOverviewComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaieRoutingModule {}
