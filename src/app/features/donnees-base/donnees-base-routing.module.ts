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
  { path: 'admin/type-indemnite',  component: DbRefListComponent, data: { title: 'Type indemnité',      icon: 'paid',               type: 'type-indemnite'  } },
  { path: 'admin/param-indemnite', component: DbRefListComponent, data: { title: "Paramétrage d'indemnité", icon: 'settings_suggest',   type: 'param-indemnite' } },
  { path: 'admin/type-contrat',    component: DbRefListComponent, data: { title: 'Type contrat',        icon: 'article',            type: 'type-contrat'    } },
  { path: 'admin/type-conge',      component: DbRefListComponent, data: { title: 'Type congé / absence',icon: 'beach_access',       type: 'type-conge'      } },
  { path: 'admin/type-retenue-employe', component: DbRefListComponent, data: { title: 'Types de retenue (par employé)', icon: 'money_off', type: 'type-retenue-employe' } },
  { path: 'admin/type-retenue-emploi',  component: DbRefListComponent, data: { title: 'Types de retenue (par emploi)',  icon: 'money_off', type: 'type-retenue-emploi' } },
  { path: 'admin/profil',               component: DbRefListComponent, data: { title: 'Profil de poste / Rôle', icon: 'admin_panel_settings', type: 'profil' } },
  { path: 'admin/ville',                component: DbRefListComponent, data: { title: 'Villes (Burkina Faso)', icon: 'location_city', type: 'ville' } },

  // ─── Gestion de carrière et compétence ────────────────────────────────────
  { path: 'carriere/categorie',    component: DbRefListComponent, data: { title: 'Catégorie professionnelle', icon: 'category',      type: 'categorie'       } },
  { path: 'carriere/grade',        component: DbRefListComponent, data: { title: 'Grade',               icon: 'military_tech',      type: 'grade'           } },
  { path: 'carriere/echelon',      component: DbRefListComponent, data: { title: 'Échelon / Niveau',    icon: 'signal_cellular_alt',type: 'echelon'         } },
  { path: 'carriere/competences',  component: DbRefListComponent, data: { title: 'Référentiel compétences', icon: 'psychology',    type: 'competences'     } },
  { path: 'carriere/type-formation',component: DbRefListComponent,data: { title: 'Type de formation',   icon: 'school',             type: 'type-formation'  } },
  { path: 'carriere/type-evaluation',component:DbRefListComponent,data: { title: "Type d'évaluation",   icon: 'star_rate',          type: 'type-evaluation' } },

  // ─── Gestion paie ─────────────────────────────────────────────────────────
  { path: 'paie/rubrique',         component: DbRefListComponent, data: { title: 'Rubrique de paie',    icon: 'receipt_long',       type: 'rubrique'        } },
  { path: 'paie/cotisation',       component: DbRefListComponent, data: { title: 'Type de cotisation',  icon: 'percent',            type: 'cotisation'      } },
  { path: 'paie/bareme',           component: DbRefListComponent, data: { title: 'Barème fiscal',       icon: 'calculate',          type: 'bareme'          } },
  { path: 'paie/mode-paiement',    component: DbRefListComponent, data: { title: 'Mode de paiement',    icon: 'payments',           type: 'mode-paiement'   } },
  { path: 'paie/calendrier',       component: DbRefListComponent, data: { title: 'Calendrier de paie',  icon: 'calendar_month',     type: 'calendrier-paie' } },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonneesBaseRoutingModule {}
