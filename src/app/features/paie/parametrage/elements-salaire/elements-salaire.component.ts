import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface SalaryElementModel {
  id: number;
  code: string;
  name: string;
  categoryId: number;
  categoryName: string;
  rate?: number;
  formula: string;
  formule?: string;
  calculationMethod: 'MONTANT_FIXE' | 'POURCENTAGE' | 'FORMULE_COMPLEXE' | 'SAISIE_MANUELLE' | 'FIXE' | 'FORMULE' | 'GRILLE' | string;
  calculMethod?: string;
  isCotisable: boolean;
  isImposable: boolean;
  ordre: number;
  statut: boolean;
  type: 'GAIN' | 'RETENUE' | 'PATRONALE';
}

const STORAGE_KEY = 'bpbf_salary_elements_storage';

export const DEFAULT_BANK_ELEMENTS: SalaryElementModel[] = [];

@Component({
  selector: 'app-elements-salaire',
  templateUrl: './elements-salaire.component.html',
  styleUrls: ['./elements-salaire.component.scss'],
  standalone: false
})
export class ElementsSalaireComponent implements OnInit {
  elementsList: SalaryElementModel[] = [];
  filteredList: SalaryElementModel[] = [];
  categoriesList: Array<{ id: number; name: string; type: string }> = [];

  searchQuery: string = '';
  categoryFilter: string = '';
  typeFilter: string = '';

  showDialog: boolean = false;
  editingElement: SalaryElementModel | null = null;
  formModel: SalaryElementModel = this.getEmptyForm();
  isSaving: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadElements();
  }

  loadCategories(): void {
    this.http.get<any[]>(`${environment.apiUrl}/salary-categories`).pipe(
      catchError(() => of([]))
    ).subscribe(data => {
      if (data && data.length > 0) {
        this.categoriesList = data.map(c => ({
          id: c.id,
          name: c.name || c.libelle || 'Catégorie',
          type: c.type || 'GAIN'
        }));
      } else {
        const catStorage = localStorage.getItem('bpbf_salary_categories_storage');
        if (catStorage) {
          try {
            const list = JSON.parse(catStorage);
            this.categoriesList = list.map((c: any) => ({ id: c.id, name: c.name, type: 'GAIN' }));
          } catch (e) {}
        }
      }
    });
  }

  loadElements(): void {
    const categoryMapByCode: Record<string, { catName: string; type: 'GAIN' | 'RETENUE' | 'PATRONALE' }> = {
      'REM_DUE_NET': { catName: 'Rémunération due', type: 'GAIN' },
      'SAL_MENSUEL': { catName: 'Salaire de base', type: 'GAIN' },
      'HEURE_SUP': { catName: 'Salaire de base', type: 'GAIN' },
      'SURSALAIRE': { catName: 'Salaire de base', type: 'GAIN' },
      'RAPPEL_SALAIRE': { catName: 'Salaire de base', type: 'GAIN' },
      'CONGE_PAYE': { catName: 'Salaire de base', type: 'GAIN' },
      'INDEM_FONCTION': { catName: 'Indemnités', type: 'GAIN' },
      'INDEM_TRANSPORT': { catName: 'Indemnités', type: 'GAIN' },
      'INDEM_LOGEMENT': { catName: 'Indemnités', type: 'GAIN' },
      'PRIME_ANC': { catName: 'Primes', type: 'GAIN' },
      'PRIME_GRATIF': { catName: 'Primes', type: 'GAIN' },
      'ALLOC_FAMILIALE': { catName: 'Primes', type: 'GAIN' },
      'COTIS_CNSS': { catName: 'Cotisation sécurité sociale', type: 'RETENUE' },
      'COTIS_CARFO': { catName: 'Cotisation sécurité sociale', type: 'RETENUE' },
      'RETENUE_IUTS': { catName: 'IUTS', type: 'RETENUE' },
      'PRET_EQUIP': { catName: 'Retenue', type: 'RETENUE' },
      'AVANCE_SAL': { catName: 'Retenue', type: 'RETENUE' },
      'PRET_SCOLAIRE': { catName: 'Retenue', type: 'RETENUE' },
      'PRET_VEHICULE': { catName: 'Retenue', type: 'RETENUE' },
      'RET_MUTUELLE': { catName: 'Retenue', type: 'RETENUE' },
      'RET_ASSURANCE': { catName: 'Retenue', type: 'RETENUE' },
      'SAISIE_ARRET': { catName: 'Retenue', type: 'RETENUE' },
      'RET_VIVRES': { catName: 'Retenue', type: 'RETENUE' },
      'RET_DIVERS': { catName: 'Retenue', type: 'RETENUE' },
      'CHG_PAT_CNSS': { catName: 'Charges patronales', type: 'PATRONALE' },
      'COT_PAT_CNSS': { catName: 'Cotisations patronales', type: 'PATRONALE' },
      'COTIS_EMP_NON_REV': { catName: 'Cotisations non reversées', type: 'RETENUE' }
    };

    this.http.get<any[]>(`${environment.apiUrl}/salary-elements`).pipe(
      catchError(() => of(null))
    ).subscribe(data => {
      if (data && data.length > 0) {
        this.elementsList = data.map((r: any) => {
          const code = (r.code || r.codeRubrique || '').trim();
          const fallback = categoryMapByCode[code];
          let catName = r.categoryName;
          if (!catName || catName === 'Catégorie') {
            catName = r.salaryCategory?.name || r.salaryCategory?.libelle || fallback?.catName || this.categoriesList.find(c => c.id === r.categoryId)?.name || 'Salaire de base';
          }
          const elType = fallback?.type || (r.type || (catName?.toLowerCase().includes('retenue') || catName?.toLowerCase().includes('cotis') || catName?.toLowerCase().includes('iuts') ? 'RETENUE' : (catName?.toLowerCase().includes('patronal') ? 'PATRONALE' : 'GAIN')));

          return {
            id: r.id,
            code: code,
            name: r.name || r.libelle || '',
            categoryId: r.categoryId || (r.salaryCategory ? r.salaryCategory.id : 1),
            categoryName: catName,
            rate: r.rate,
            formula: r.formule || r.formuleCalcul || '',
            formule: r.formule || r.formuleCalcul || '',
            calculationMethod: (r.methodCalcul || r.calculMethod || 'MONTANT_FIXE') as any,
            calculMethod: (r.methodCalcul || r.calculMethod || 'MONTANT_FIXE') as any,
            isCotisable: r.isCotisable !== undefined ? r.isCotisable : true,
            isImposable: r.isImposable !== undefined ? r.isImposable : true,
            ordre: r.ordre || 1,
            statut: r.statut !== undefined ? r.statut === 'ACTIF' || r.statut === true : true,
            type: elType as any
          };
        });
        this.saveToStorage();
      } else {
        this.elementsList = [];
      }
      this.applyFilter();
    });
  }

  applyFilter(): void {
    let list = [...this.elementsList];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(e =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.code && e.code.toLowerCase().includes(q))
      );
    }
    if (this.categoryFilter) {
      list = list.filter(e => String(e.categoryId) === this.categoryFilter);
    }
    if (this.typeFilter) {
      list = list.filter(e => e.type === this.typeFilter);
    }
    this.filteredList = list;
  }

  onCategoryChange(catId: any): void {
    const cat = this.categoriesList.find(c => String(c.id) === String(catId));
    if (cat) {
      this.formModel.categoryName = cat.name;
    }
  }

  openAddModal(): void {
    this.editingElement = null;
    this.formModel = this.getEmptyForm();
    this.showDialog = true;
  }

  openEditModal(el: SalaryElementModel): void {
    this.editingElement = el;
    this.formModel = { ...el };
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
    this.editingElement = null;
    this.isSaving = false;
  }

  saveElement(): void {
    if (!this.formModel.code || !this.formModel.name) return;

    this.isSaving = true;
    const cat = this.categoriesList.find(c => String(c.id) === String(this.formModel.categoryId));
    const catName = cat ? cat.name : 'Catégorie';

    const payload = {
      code: this.formModel.code.trim().toUpperCase(),
      name: this.formModel.name.trim(),
      categoryId: Number(this.formModel.categoryId),
      categoryName: catName,
      rate: this.formModel.rate,
      formule: this.formModel.formula,
      formula: this.formModel.formula,
      methodCalcul: this.formModel.calculationMethod,
      calculationMethod: this.formModel.calculationMethod,
      isCotisable: this.formModel.isCotisable,
      isImposable: this.formModel.isImposable,
      ordre: this.formModel.ordre,
      statut: this.formModel.statut ? 'ACTIF' : 'INACTIF',
      type: this.formModel.type
    };

    if (this.editingElement && this.editingElement.id) {
      const idx = this.elementsList.findIndex(e => e.id === this.editingElement!.id);
      if (idx !== -1) {
        this.elementsList[idx] = { ...this.editingElement, ...payload, statut: this.formModel.statut };
        this.saveToStorage();
      }

      this.http.put(`${environment.apiUrl}/salary-elements/${this.editingElement.id}`, payload).pipe(
        catchError(() => of(null))
      ).subscribe(() => {
        this.isSaving = false;
        this.applyFilter();
        this.closeModal();
      });
    } else {
      const newId = Date.now();
      const newItem: SalaryElementModel = {
        id: newId,
        ...payload,
        statut: this.formModel.statut
      };
      this.elementsList.unshift(newItem);
      this.saveToStorage();

      this.http.post(`${environment.apiUrl}/salary-elements`, payload).pipe(
        catchError(() => of(null))
      ).subscribe(() => {
        this.isSaving = false;
        this.applyFilter();
        this.closeModal();
      });
    }
  }

  toggleStatut(el: SalaryElementModel): void {
    el.statut = !el.statut;
    this.saveToStorage();

    this.http.put(`${environment.apiUrl}/salary-elements/${el.id}`, {
      ...el,
      statut: el.statut ? 'ACTIF' : 'INACTIF'
    }).pipe(catchError(() => of(null))).subscribe();
  }

  deleteElement(el: SalaryElementModel): void {
    if (confirm(`Supprimer l'élément "${el.name}" ?`)) {
      this.elementsList = this.elementsList.filter(e => e.id !== el.id);
      this.saveToStorage();
      this.applyFilter();

      this.http.delete(`${environment.apiUrl}/salary-elements/${el.id}`).pipe(
        catchError(() => of(null))
      ).subscribe();
    }
  }

  reinitialiserDonneesTest(): void {
    this.loadElements();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.elementsList));
    } catch (e) {}
  }

  private getFromStorage(): SalaryElementModel[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  private getEmptyForm(): SalaryElementModel {
    return {
      id: 0,
      code: '',
      name: '',
      categoryId: 1,
      categoryName: '',
      formula: '',
      calculationMethod: 'MONTANT_FIXE',
      isCotisable: true,
      isImposable: true,
      ordre: 1,
      statut: true,
      type: 'GAIN'
    };
  }
}
