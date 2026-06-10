import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'grh',
        loadChildren: () => import('./features/grh/grh.module').then(m => m.GrhModule)
      },
      {
        path: 'carrieres',
        loadChildren: () => import('./features/carrieres/carrieres.module').then(m => m.CarrieresModule)
      },
      {
        path: 'paie',
        loadChildren: () => import('./features/paie/paie.module').then(m => m.PaieModule)
      },
      {
        path: 'donnees-base',
        loadChildren: () => import('./features/donnees-base/donnees-base.module').then(m => m.DonneesBaseModule)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
