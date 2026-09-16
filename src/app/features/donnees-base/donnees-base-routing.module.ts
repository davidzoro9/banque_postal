import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbOverviewComponent } from './db-overview/db-overview.component';
import { DbRefListComponent } from './db-ref-list/db-ref-list.component';

const routes: Routes = [
  { path: '', component: DbOverviewComponent },

  // ─── Gestion administrative ───────────────────────────────────────────────
  { path: 'admin/emploi',          component: DbRefListComponent, data: { title: 'Emploi',              icon: 'work',               type: 'emploi'          } },
  { path: 'admin/fonction',        component: DbRefListComponent, data: { title: 'Fonction',            icon: 'badge',              type: 'fonction'        } },
  { path: 'admin/departement',     component: DbRefListComponent, data: { title: 'Département',         icon: 'domain',             type: 'departement'     } },
  { path: 'admin/direction',       component: DbRefListComponent, data: { title: 'Direction',           icon: 'business',           type: 'direction'       } },
  { path: 'admin/service',         component: DbRefListComponent, data: { title: 'Service',             icon: 'group_work',         type: 'service'         } },
  { path: 'admin/grille-salariale',component: DbRefListComponent, data: { title: 'Grille salariale',    icon: 'table_chart',        type: 'grille-salariale'} },
  { path: 'admin/agence',          component: DbRefListComponent, data: { title: 'Agence',              icon: 'store',              type: 'agence'          } },
  { path: 'admin/banque',          component: DbRefListComponent, data: { title: 'Banque',              icon: 'money_on',           type: 'banque'          } },
  { path: 'admin/type-indemnite',  component: DbRefListComponent, data: { title: 'Liste des indemnités',icon: 'paid',               type: 'type-indemnite'  } },
  { path: 'admin/param-indemnite', component: DbRefListComponent, data: { title: 'Grille indemnitaire',     icon: 'settings_suggest',   type: 'param-indemnite' } },
  { path: 'admin/type-contrat',    component: DbRefListComponent, data: { title: 'Type contrat',        icon: 'article',            type: 'type-contrat'    } },
  { path: 'admin/type-conge',      component: DbRefListComponent, data: { title: 'Type congé / absence',icon: 'beach_access',       type: 'type-conge'      } },
  { path: 'admin/type-retenue-employe', component: DbRefListComponent, data: { title: 'Types de retenues', icon: 'money_off', type: 'type-retenue-employe' } },
  { path: 'admin/type-retenue-emploi',  component: DbRefListComponent, data: { title: 'Retenues',  icon: 'tune', type: 'type-retenue-emploi' } },
  { path: 'admin/profil',               component: DbRefListComponent, data: { title: 'Profil de poste / Rôle', icon: 'admin_panel_settings', type: 'profil' } },
  { path: 'admin/ville',                component: DbRefListComponent, data: { title: 'Villes (Burkina Faso)', icon: 'location_city', type: 'ville' } },
  { path: 'admin/param-retraite',        component: DbRefListComponent, data: { title: 'Paramétrage retraite', icon: 'event_repeat', type: 'param-retraite' } },
  { path: 'admin/param-prise-en-charge', component: DbRefListComponent, data: { title: 'Prise en charge famille', icon: 'family_restroom', type: 'param-prise-en-charge' } },
  { path: 'admin/regimes-securite-sociale', component: DbRefListComponent, data: { title: 'Régimes de sécurité sociale', icon: 'health_and_safety', type: 'regime-securite-social' } },

  // ─── Gestion de carrière et compétence ────────────────────────────────────
  { path: 'carriere/categorie',    component: DbRefListComponent, data: { title: 'Catégorie professionnelle', icon: 'category',      type: 'categorie'       } },
  { path: 'carriere/grade',        component: DbRefListComponent, data: { title: 'Groupe',              icon: 'military_tech',      type: 'grade'           } },
  { path: 'carriere/param-groupe', component: DbRefListComponent, data: { title: 'Paramétrage Groupe',  icon: 'tune',               type: 'param-groupe'    } },
  { path: 'carriere/echelon',      component: DbRefListComponent, data: { title: 'Échelon / Niveau',    icon: 'signal_cellular_alt',type: 'echelon'         } },
  { path: 'carriere/competences',  component: DbRefListComponent, data: { title: 'Référentiel compétences', icon: 'psychology',    type: 'competences'     } },
  { path: 'carriere/type-formation',component: DbRefListComponent,data: { title: 'Type de formation',   icon: 'school',             type: 'type-formation'  } },
  { path: 'carriere/type-evaluation',component:DbRefListComponent,data: { title: "Type d'évaluation",   icon: 'star_rate',          type: 'type-evaluation' } },

  // ─── Gestion paie ─────────────────────────────────────────────────────────
  { path: 'paie/rubrique',         component: DbRefListComponent, data: { title: 'Rubrique de paie',    icon: 'receipt_long',       type: 'rubrique'        } },
  { path: 'paie/bareme',           component: DbRefListComponent, data: { title: 'Barème fiscal',       icon: 'calculate',          type: 'bareme'          } },
  { path: 'paie/mode-paiement',    component: DbRefListComponent, data: { title: 'Mode de paiement',    icon: 'payments',           type: 'mode-paiement'   } },

  // ─── Alias direct (sans préfixe) ────────────────────────────────────
  { path: 'grille-salariale',      redirectTo: 'admin/grille-salariale', pathMatch: 'full' },
  { path: 'type-indemnite',        redirectTo: 'admin/type-indemnite',   pathMatch: 'full' },
  { path: 'param-indemnite',       redirectTo: 'admin/param-indemnite',  pathMatch: 'full' },
  { path: 'emploi',                redirectTo: 'admin/emploi',           pathMatch: 'full' },
  { path: 'fonction',              redirectTo: 'admin/fonction',         pathMatch: 'full' },
  { path: 'agence',                redirectTo: 'admin/agence',           pathMatch: 'full' },
  { path: 'banque',                redirectTo: 'admin/banque',           pathMatch: 'full' },
  { path: 'departement',           redirectTo: 'admin/departement',      pathMatch: 'full' },
  { path: 'direction',             redirectTo: 'admin/direction',        pathMatch: 'full' },
  { path: 'service',               redirectTo: 'admin/service',          pathMatch: 'full' },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonneesBaseRoutingModule {}
