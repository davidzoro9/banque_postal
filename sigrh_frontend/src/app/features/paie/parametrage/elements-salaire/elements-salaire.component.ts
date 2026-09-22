import { Component, OnInit } from '@angular/core';
import { SalaryParametrageService, SalaryCategoryDto, SalaryElementDto } from '../../services/salary-parametrage.service';
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

@Component({
  selector: 'app-elements-salaire',
  templateUrl: './elements-salaire.component.html',
  styleUrls: ['./elements-salaire.component.scss'],
  standalone: false
})
export class ElementsSalaireComponent implements OnInit {
  elementsList: SalaryElementModel[] = [];
  filteredList: SalaryElementModel[] = [];
  categoriesList: Array<{ id: number; code: string; name: string; type: 'GAIN' | 'RETENUE' | 'PATRONALE' }> = [];

  searchQuery: string = '';
  categoryFilter: string = '';
  typeFilter: string = '';

  successMessage: string = '';
  errorMessage: string = '';

  showDialog: boolean = false;
  editingElement: SalaryElementModel | null = null;
  formModel: SalaryElementModel = this.getEmptyForm();
  isSaving: boolean = false;
  isLoading: boolean = false;

  constructor(private parametrageService: SalaryParametrageService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.parametrageService.getAllCategories().pipe(
      catchError(err => {
        console.error('Erreur chargement catégories:', err);
        return of([]);
      })
    ).subscribe(data => {
      if (data && data.length > 0) {
        this.categoriesList = data.map(c => ({
          id: Number(c.id),
          code: c.code || '',
          name: c.name || '',
          type: (c.type || 'GAIN') as 'GAIN' | 'RETENUE' | 'PATRONALE'
        }));
      } else {
        this.categoriesList = [];
      }
      this.loadElements();
    });
  }

  loadElements(): void {
    this.parametrageService.getAllElements().pipe(
      catchError(err => {
        console.error('Erreur chargement éléments:', err);
        return of([]);
      })
    ).subscribe(data => {
      this.isLoading = false;
      if (data && data.length > 0) {
        this.elementsList = data.map((r: SalaryElementDto) => {
          const numCatId = r.categoryId != null ? Number(r.categoryId) : 0;
          const matchingCat = this.categoriesList.find(c => c.id === numCatId);
          const catName = r.categoryName || (matchingCat ? matchingCat.name : '');
          const elType = (r.type || (matchingCat ? matchingCat.type : 'GAIN')) as 'GAIN' | 'RETENUE' | 'PATRONALE';

          return {
            id: Number(r.id),
            code: (r.code || '').trim(),
            name: r.name || '',
            categoryId: numCatId,
            categoryName: catName,
            rate: r.rate,
            formula: r.formule || r.formula || '',
            formule: r.formule || r.formula || '',
            calculationMethod: (r.methodCalcul || 'MONTANT_FIXE') as any,
            calculMethod: (r.methodCalcul || 'MONTANT_FIXE') as any,
            isCotisable: r.isCotisable !== undefined ? r.isCotisable : true,
            isImposable: r.isImposable !== undefined ? r.isImposable : true,
            ordre: r.ordre || 1,
            statut: r.statut !== undefined ? r.statut === 'ACTIF' || r.statut === true : true,
            type: elType
          };
        });
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
      const filterId = Number(this.categoryFilter);
      list = list.filter(e => e.categoryId === filterId);
    }
    if (this.typeFilter) {
      list = list.filter(e => e.type === this.typeFilter);
    }
    this.filteredList = list;
  }

  onCategoryChange(catId: any): void {
    const numId = Number(catId);
    this.formModel.categoryId = numId;
    const cat = this.categoriesList.find(c => c.id === numId);
    if (cat) {
      this.formModel.categoryName = cat.name;
      this.formModel.type = cat.type;
    }
  }

  openAddModal(): void {
    this.editingElement = null;
    this.formModel = this.getEmptyForm();
    if (this.categoriesList.length > 0) {
      const firstCat = this.categoriesList[0];
      this.formModel.categoryId = firstCat.id;
      this.formModel.categoryName = firstCat.name;
      this.formModel.type = firstCat.type;
    }
    this.showDialog = true;
  }

  openEditModal(el: SalaryElementModel): void {
    this.editingElement = el;
    let matchingCat = this.categoriesList.find(c => c.id === el.categoryId);
    if (!matchingCat && el.categoryName) {
      matchingCat = this.categoriesList.find(c => c.name.toLowerCase().trim() === el.categoryName.toLowerCase().trim());
    }
    const catId = matchingCat ? matchingCat.id : (this.categoriesList.length > 0 ? this.categoriesList[0].id : el.categoryId);
    const catName = matchingCat ? matchingCat.name : el.categoryName;
    const resolvedType = el.type || (matchingCat ? matchingCat.type : 'GAIN');

    this.formModel = {
      ...el,
      categoryId: catId,
      categoryName: catName,
      type: resolvedType
    };
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
    const numCatId = Number(this.formModel.categoryId);
    const cat = this.categoriesList.find(c => c.id === numCatId);
    const catName = cat ? cat.name : this.formModel.categoryName;

    const payload: SalaryElementDto = {
      code: this.formModel.code.trim().toUpperCase(),
      name: this.formModel.name.trim(),
      categoryId: numCatId,
      salaryCategoryId: numCatId,
      categoryName: catName,
      rate: this.formModel.rate,
      formule: this.formModel.formule || this.formModel.formula,
      formula: this.formModel.formule || this.formModel.formula,
      methodCalcul: this.formModel.calculationMethod,
      isCotisable: this.formModel.isCotisable,
      isImposable: this.formModel.isImposable,
      ordre: Number(this.formModel.ordre || 1),
      statut: this.formModel.statut ? 'ACTIF' : 'INACTIF',
      type: this.formModel.type
    };

    if (this.editingElement && this.editingElement.id) {
      this.parametrageService.updateElement(this.editingElement.id, payload).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.closeModal();
          this.successMessage = `L'élément "${res?.name || this.formModel.name}" (${res?.code || this.formModel.code}) a été mis à jour avec succès.`;
          this.loadElements();
          setTimeout(() => this.successMessage = '', 4500);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Erreur mise à jour élément:', err);
          this.errorMessage = `Erreur lors de la mise à jour: ${err?.error?.message || err?.message || 'Erreur serveur'}`;
          setTimeout(() => this.errorMessage = '', 6000);
        }
      });
    } else {
      this.parametrageService.createElement(payload).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.closeModal();
          this.successMessage = `L'élément "${res?.name || this.formModel.name}" (${res?.code || this.formModel.code}) a été créé avec succès.`;
          this.loadElements();
          setTimeout(() => this.successMessage = '', 4500);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Erreur création élément:', err);
          this.errorMessage = `Erreur lors de la création: ${err?.error?.message || err?.message || 'Erreur serveur'}`;
          setTimeout(() => this.errorMessage = '', 6000);
        }
      });
    }
  }

  toggleStatut(el: SalaryElementModel): void {
    const newStatut = !el.statut;
    const payload: SalaryElementDto = {
      code: el.code,
      name: el.name,
      categoryId: el.categoryId,
      salaryCategoryId: el.categoryId,
      rate: el.rate,
      formule: el.formule,
      methodCalcul: el.calculationMethod,
      isCotisable: el.isCotisable,
      isImposable: el.isImposable,
      ordre: el.ordre,
      statut: newStatut ? 'ACTIF' : 'INACTIF',
      type: el.type
    };

    this.parametrageService.updateElement(el.id, payload).pipe(
      catchError(err => {
        console.error('Erreur toggle statut élément:', err);
        return of(null);
      })
    ).subscribe(() => {
      this.loadElements();
    });
  }

  deleteElement(el: SalaryElementModel): void {
    if (confirm(`Confirmez-vous la suppression de l'élément de salaire "${el.name}" (${el.code}) ?`)) {
      this.parametrageService.deleteElement(el.id).subscribe({
        next: () => {
          this.successMessage = `L'élément "${el.name}" (${el.code}) a été supprimé avec succès.`;
          this.loadElements();
          setTimeout(() => this.successMessage = '', 4500);
        },
        error: (err) => {
          console.error('Erreur suppression élément:', err);
          this.errorMessage = `Erreur lors de la suppression: ${err?.error?.message || err?.message || 'Erreur serveur'}`;
          setTimeout(() => this.errorMessage = '', 6000);
        }
      });
    }
  }

  reinitialiserDonneesTest(): void {
    this.loadCategories();
  }

  private getEmptyForm(): SalaryElementModel {
    return {
      id: 0,
      code: '',
      name: '',
      categoryId: 1,
      categoryName: '',
      formula: '',
      formule: '',
      calculationMethod: 'MONTANT_FIXE',
      isCotisable: true,
      isImposable: true,
      ordre: 1,
      statut: true,
      type: 'GAIN'
    };
  }
}
