import { Component, OnInit } from '@angular/core';
import { SalaryParametrageService, SalaryCategoryDto, SalaryElementDto, AdminReferenceCodeDto } from '../../services/salary-parametrage.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface SalaryElementModel {
  id: number;
  code: string;
  codeCorrespondant?: string;
  name: string;
  categoryId: number;
  categoryName: string;
  categoryCode?: string;
  rate?: number;
  formula: string;
  formule?: string;
  calculationMethod: 'MONTANT_FIXE' | 'FORMULE_COMPLEXE' | 'RIEN' | string;
  calculMethod?: string;
  methodCalcul?: string;
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
  adminCodesList: AdminReferenceCodeDto[] = [];
  adminCodesFilter: string = '';

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
    this.loadAdminCodes();
  }

  loadAdminCodes(): void {
    this.parametrageService.getAdminReferenceCodes().subscribe({
      next: (codes) => {
        this.adminCodesList = codes || [];
      },
      error: (err) => {
        console.error('Erreur chargement codes admin:', err);
      }
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    this.parametrageService.getAllCategories().subscribe({
      next: (data) => {
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
      },
      error: (err) => {
        console.error('Erreur chargement catégories:', err);
        this.categoriesList = [];
        this.loadElements();
      }
    });
  }

  loadElements(): void {
    this.parametrageService.getAllElements().subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data && data.length > 0) {
          this.elementsList = data.map((r: SalaryElementDto) => {
            const numCatId = r.categoryId != null ? Number(r.categoryId) : 0;
            const matchingCat = this.categoriesList.find(c => c.id === numCatId);
            const catName = r.categoryName || (matchingCat ? matchingCat.name : '');
            const catCode = r.categoryCode || (matchingCat ? matchingCat.code : '');
            const elType = (r.type || (matchingCat ? matchingCat.type : 'GAIN')) as 'GAIN' | 'RETENUE' | 'PATRONALE';

            let method: 'MONTANT_FIXE' | 'FORMULE_COMPLEXE' | 'RIEN' = 'MONTANT_FIXE';
            const mc = (r.methodCalcul || '').toUpperCase();
            if (mc.includes('FORMULE') || mc.includes('POURCENTAGE')) {
              method = 'FORMULE_COMPLEXE';
            } else if (mc.includes('RIEN') || mc.includes('AUCUN') || mc.includes('NONE')) {
              method = 'RIEN';
            } else {
              method = 'MONTANT_FIXE';
            }

            return {
              id: Number(r.id),
              code: (r.code || '').trim().toLowerCase(),
              codeCorrespondant: (r.codeCorrespondant || '').trim().toLowerCase(),
              name: (r.name || '').trim().toUpperCase(),
              categoryId: numCatId,
              categoryName: catName,
              categoryCode: catCode,
              rate: r.rate,
              formula: r.formule || r.formula || '',
              formule: r.formule || r.formula || '',
              calculationMethod: method,
              calculMethod: method,
              methodCalcul: method,
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
      },
      error: (err) => {
        console.error('Erreur chargement éléments:', err);
        this.isLoading = false;
        this.elementsList = [];
        this.applyFilter();
      }
    });
  }

  applyFilter(): void {
    let list = [...this.elementsList];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(e =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.code && e.code.toLowerCase().includes(q)) ||
        (e.codeCorrespondant && e.codeCorrespondant.toLowerCase().includes(q))
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

  // --- FORÇAGE DE CASSE ---
  onCodeChange(): void {
    if (this.formModel.code) {
      this.formModel.code = this.formModel.code.toLowerCase().trim();
    }
  }

  onCodeCorrespondantChange(): void {
    if (this.formModel.codeCorrespondant) {
      this.formModel.codeCorrespondant = this.formModel.codeCorrespondant.toLowerCase().trim();
    }
  }

  onNameChange(): void {
    if (this.formModel.name) {
      this.formModel.name = this.formModel.name.toUpperCase();
    }
  }

  selectAdminCode(code: string): void {
    this.formModel.codeCorrespondant = code.toLowerCase().trim();
  }

  insertIntoFormula(token: string): void {
    const current = this.formModel.formule || this.formModel.formula || '';
    const separator = current && !current.endsWith(' ') && !token.startsWith(' ') && !token.startsWith('*') && !token.startsWith('/') ? ' ' : '';
    this.formModel.formule = (current ? current + separator : '') + token;
    this.formModel.formula = this.formModel.formule;
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

  onMethodChange(val: string): void {
    if (val === 'FORMULE_COMPLEXE') {
      this.formModel.calculationMethod = 'FORMULE_COMPLEXE';
    } else if (val === 'RIEN') {
      this.formModel.calculationMethod = 'RIEN';
      this.formModel.formule = '';
      this.formModel.formula = '';
    } else {
      this.formModel.calculationMethod = 'MONTANT_FIXE';
    }
    this.formModel.methodCalcul = this.formModel.calculationMethod;
    if (this.formModel.calculationMethod === 'MONTANT_FIXE' && !this.formModel.codeCorrespondant) {
      this.formModel.codeCorrespondant = this.formModel.code;
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

    let method: 'MONTANT_FIXE' | 'FORMULE_COMPLEXE' | 'RIEN' = 'MONTANT_FIXE';
    const mc = (el.calculationMethod || el.methodCalcul || '').toUpperCase();
    if (mc.includes('FORMULE') || mc.includes('POURCENTAGE')) {
      method = 'FORMULE_COMPLEXE';
    } else if (mc.includes('RIEN') || mc.includes('AUCUN') || mc.includes('NONE')) {
      method = 'RIEN';
    } else {
      method = 'MONTANT_FIXE';
    }

    this.formModel = {
      ...el,
      code: (el.code || '').toLowerCase().trim(),
      codeCorrespondant: (el.codeCorrespondant || el.code || '').toLowerCase().trim(),
      name: (el.name || '').toUpperCase().trim(),
      categoryId: catId,
      categoryName: catName,
      type: resolvedType,
      calculationMethod: method,
      methodCalcul: method
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
    const catType = cat ? cat.type : (this.formModel.type || 'GAIN');

    let finalMethod = 'MONTANT_FIXE';
    if (this.formModel.calculationMethod === 'FORMULE_COMPLEXE') {
      finalMethod = 'FORMULE_COMPLEXE';
    } else if (this.formModel.calculationMethod === 'RIEN') {
      finalMethod = 'RIEN';
    }
    const finalCode = this.formModel.code.toLowerCase().trim();
    let finalCodeCorrespondant = this.formModel.codeCorrespondant
      ? this.formModel.codeCorrespondant.toLowerCase().trim()
      : finalCode;
    if (finalCodeCorrespondant === 'sal_base' || finalCodeCorrespondant === 'sal_mensuel' || finalCodeCorrespondant === 'salbase') {
      finalCodeCorrespondant = 'salaire_base';
    } else if (finalCodeCorrespondant === 'sursalaire') {
      finalCodeCorrespondant = 'sur_salaire';
    }

    const payload: SalaryElementDto = {
      code: finalCode,
      codeCorrespondant: finalCodeCorrespondant,
      name: this.formModel.name.toUpperCase().trim(),
      categoryId: numCatId,
      salaryCategoryId: numCatId,
      categoryName: catName,
      rate: this.formModel.rate,
      formule: this.formModel.formule || this.formModel.formula || '',
      formula: this.formModel.formule || this.formModel.formula || '',
      methodCalcul: finalMethod,
      isCotisable: this.formModel.isCotisable,
      isImposable: this.formModel.isImposable,
      ordre: Number(this.formModel.ordre || 1),
      statut: this.formModel.statut ? 'ACTIF' : 'INACTIF',
      type: catType
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
    let methodCalculVal = 'MONTANT_FIXE';
    if (el.calculationMethod === 'FORMULE_COMPLEXE') {
      methodCalculVal = 'FORMULE_COMPLEXE';
    } else if (el.calculationMethod === 'RIEN') {
      methodCalculVal = 'RIEN';
    }
    const payload: SalaryElementDto = {
      code: el.code.toLowerCase().trim(),
      codeCorrespondant: el.codeCorrespondant ? el.codeCorrespondant.toLowerCase().trim() : el.code.toLowerCase().trim(),
      name: el.name.toUpperCase().trim(),
      categoryId: el.categoryId,
      salaryCategoryId: el.categoryId,
      rate: el.rate,
      formule: el.formule,
      methodCalcul: methodCalculVal,
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
    this.loadAdminCodes();
  }

  private getEmptyForm(): SalaryElementModel {
    return {
      id: 0,
      code: '',
      codeCorrespondant: '',
      name: '',
      categoryId: 1,
      categoryName: '',
      formula: '',
      formule: '',
      calculationMethod: 'MONTANT_FIXE',
      calculMethod: 'MONTANT_FIXE',
      methodCalcul: 'MONTANT_FIXE',
      isCotisable: true,
      isImposable: true,
      ordre: 1,
      statut: true,
      type: 'GAIN'
    };
  }
}
