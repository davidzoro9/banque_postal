import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../core/models/app-module.model';

interface ParamItem { id: string; libelle: string; code: string; description?: string; actif: boolean; }

@Component({
  selector: 'app-parametres-rh',
  templateUrl: './parametres-rh.component.html',
  styleUrls: ['./parametres-rh.component.scss'],
  standalone: false
})
export class ParametresRhComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'grh')!;

  typesContrats: ParamItem[] = [
    { id: '1', libelle: 'CDI', code: 'CDI', description: 'Contrat à durée indéterminée', actif: true },
    { id: '2', libelle: 'CDD', code: 'CDD', description: 'Contrat à durée déterminée', actif: true },
    { id: '3', libelle: 'Stage', code: 'STG', description: 'Convention de stage', actif: true },
    { id: '4', libelle: 'Prestation', code: 'PRE', description: 'Contrat de prestation de service', actif: true },
    { id: '5', libelle: 'Apprentissage', code: 'APP', description: "Contrat d'apprentissage", actif: true }
  ];

  statutsEmployes: ParamItem[] = [
    { id: '1', libelle: 'Actif', code: 'ACTIF', description: 'Employé en activité', actif: true },
    { id: '2', libelle: 'Inactif', code: 'INACTIF', description: 'Employé sans activité', actif: true },
    { id: '3', libelle: 'Suspendu', code: 'SUSP', description: 'Contrat suspendu', actif: true },
    { id: '4', libelle: "Période d'essai", code: 'ESSAI', description: "En cours de période d'essai", actif: true },
    { id: '5', libelle: 'Congé maladie', code: 'MALADIE', description: 'En arrêt maladie', actif: true },
    { id: '6', libelle: 'Détaché', code: 'DETACHE', description: 'Détachement temporaire', actif: true }
  ];

  motifsSortie: ParamItem[] = [
    { id: '1', libelle: 'Démission', code: 'DEM', description: 'Départ volontaire', actif: true },
    { id: '2', libelle: 'Licenciement', code: 'LIC', description: 'Licenciement employeur', actif: true },
    { id: '3', libelle: 'Retraite', code: 'RET', description: 'Départ à la retraite', actif: true },
    { id: '4', libelle: 'Fin de contrat', code: 'FIN', description: 'Échéance du contrat CDD', actif: true },
    { id: '5', libelle: 'Décès', code: 'DEC', description: 'Décès du collaborateur', actif: true },
    { id: '6', libelle: 'Mutation', code: 'MUT', description: 'Mutation vers une autre structure', actif: true }
  ];

  paramsSpecifiques: ParamItem[] = [
    { id: '1', libelle: 'Durée période essai (CDI)', code: 'ESSAI_CDI', description: '3 mois renouvelable 1 fois', actif: true },
    { id: '2', libelle: 'Durée période essai (CDD)', code: 'ESSAI_CDD', description: '1 mois', actif: true },
    { id: '3', libelle: 'Préavis démission', code: 'PREAVIS_DEM', description: '1 mois pour non-cadres, 3 mois pour cadres', actif: true },
    { id: '4', libelle: 'Congés annuels', code: 'CONGE_ANNUEL', description: '2,5 jours par mois travaillé', actif: true }
  ];

  addForm!: FormGroup;
  showAddForm: { [key: string]: boolean } = {};
  activeTab = 0;

  readonly tabs = ['typesContrats', 'statutsEmployes', 'motifsSortie', 'paramsSpecifiques'];
  readonly tabLabels = ['Types de contrats', 'Statuts employés', 'Motifs de sortie', 'Paramètres spécifiques'];
  readonly tabIcons = ['article', 'toggle_on', 'logout', 'tune'];

  constructor(
    private fb: FormBuilder,
    private moduleNav: ModuleNavService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.buildAddForm();
  }

  private buildAddForm(): void {
    this.addForm = this.fb.group({
      libelle: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],
      actif: [true]
    });
  }

  getItems(tab: string): ParamItem[] {
    return (this as any)[tab] as ParamItem[];
  }

  toggleAdd(tab: string): void {
    this.showAddForm[tab] = !this.showAddForm[tab];
    if (this.showAddForm[tab]) this.addForm.reset({ actif: true });
  }

  addItem(tab: string): void {
    if (this.addForm.invalid) return;
    const items = this.getItems(tab);
    const v = this.addForm.value;
    items.push({ id: Date.now().toString(), ...v });
    this.showAddForm[tab] = false;
    this.addForm.reset({ actif: true });
  }

  deleteItem(tab: string, id: string): void {
    const arr = (this as any)[tab] as ParamItem[];
    const idx = arr.findIndex(i => i.id === id);
    if (idx !== -1) arr.splice(idx, 1);
  }

  toggleActif(item: ParamItem): void {
    item.actif = !item.actif;
  }
}
