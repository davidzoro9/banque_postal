import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TropPercuService, TropPercuModel } from '../../services/trop-percu.service';
import { EmployeeService } from '../../../grh/employes/services/employee.service';
import { Employee } from '../../../grh/employes/models/employee.model';
import { environment } from '../../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-trop-percus',
  templateUrl: './trop-percus.component.html',
  styleUrls: ['./trop-percus.component.scss'],
  standalone: false
})
export class TropPercusComponent implements OnInit {
  tropPercusList: TropPercuModel[] = [];
  filteredList: TropPercuModel[] = [];
  employeesList: Employee[] = [];
  elementsList: Array<{ id: number; name: string; code: string }> = [];

  searchQuery: string = '';
  statutFilter: string = '';
  moisFilter: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  showDialog: boolean = false;
  editingItem: TropPercuModel | null = null;
  formModel: Partial<TropPercuModel> = this.getEmptyForm();
  isSaving: boolean = false;
  agentSearchText: string = '';

  // Mois disponibles pour sélection rapide (Mois courant et précédents/suivants)
  moisList: Array<{ code: string; label: string }> = [];

  get filteredEmployeesForSelect(): Employee[] {
    if (!this.agentSearchText || !this.agentSearchText.trim()) {
      return this.employeesList;
    }
    const term = this.agentSearchText.trim().toLowerCase();
    return this.employeesList.filter(emp =>
      (emp.matricule && emp.matricule.toLowerCase().includes(term)) ||
      (emp.nom && emp.nom.toLowerCase().includes(term)) ||
      (emp.prenom && emp.prenom.toLowerCase().includes(term)) ||
      (emp.fonction && emp.fonction.toLowerCase().includes(term))
    );
  }

  constructor(
    private tropPercuService: TropPercuService,
    private employeeService: EmployeeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initMoisList();
    this.loadEmployees();
    this.loadElements();
    this.loadTropPercus();
  }

  private initMoisList(): void {
    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const now = new Date();
    const currentYear = now.getFullYear();
    const list: Array<{ code: string; label: string }> = [];

    // Génère pour l'année précédente, courante et suivante
    for (let y = currentYear - 1; y <= currentYear + 1; y++) {
      for (let m = 1; m <= 12; m++) {
        const mm = m < 10 ? `0${m}` : `${m}`;
        const code = `${mm}/${y}`;
        const label = `${moisNoms[m - 1]} ${y}`;
        list.push({ code, label });
      }
    }
    this.moisList = list;
  }

  getCurrentMonthCode(): string {
    const now = new Date();
    const m = now.getMonth() + 1;
    const mm = m < 10 ? `0${m}` : `${m}`;
    return `${mm}/${now.getFullYear()}`;
  }

  getPreviousMonthCode(): string {
    const now = new Date();
    let m = now.getMonth(); // mois précédent (0-indexé équivaut au mois-1 en 1-indexé)
    let y = now.getFullYear();
    if (m === 0) {
      m = 12;
      y = y - 1;
    }
    const mm = m < 10 ? `0${m}` : `${m}`;
    return `${mm}/${y}`;
  }

  loadEmployees(): void {
    this.employeeService.getAll().pipe(
      catchError(() => of([]))
    ).subscribe(emps => {
      this.employeesList = emps || [];
    });
  }

  loadElements(): void {
    this.http.get<any[]>(`${environment.apiUrl}/salary-elements`).pipe(
      catchError(() => of([]))
    ).subscribe(data => {
      // Filtrer STRICTEMENT les rubriques dédiées au trop-perçu (exclure CNSS, prêts, etc.)
      const allowed = (data || []).filter(el => {
        const code = (el.code || '').toUpperCase();
        const name = (el.name || el.libelle || '').toLowerCase();
        return code.includes('TROP_PERCU') || name.includes('trop-perçu') || name.includes('trop perçu');
      }).map(el => ({
        id: el.id,
        name: el.name || el.libelle,
        code: el.code
      }));

      if (allowed.length === 0) {
        this.elementsList = [
          { id: 1, name: 'Trop-perçu sur salaire de base', code: 'RET_TROP_PERCU_SAL' },
          { id: 2, name: 'Trop-perçu sur primes & indemnités', code: 'RET_TROP_PERCU_PRIME' },
          { id: 3, name: 'Trop-perçu & Régularisation diverse', code: 'RET_TROP_PERCU' }
        ];
      } else {
        this.elementsList = allowed;
      }

      if (!this.formModel.salaryElementId && this.elementsList.length > 0) {
        this.formModel.salaryElementId = this.elementsList[0].id;
      }
    });
  }

  loadTropPercus(): void {
    this.loading = true;
    this.errorMessage = '';
    this.tropPercuService.getAll().pipe(
      catchError(err => {
        this.errorMessage = 'Erreur lors du chargement des trop-perçus depuis PostgreSQL.';
        return of([]);
      })
    ).subscribe(data => {
      this.tropPercusList = data || [];
      this.applyFilter();
      this.loading = false;
    });
  }

  applyFilter(): void {
    let list = [...this.tropPercusList];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(item =>
        (item.employeeName && item.employeeName.toLowerCase().includes(q)) ||
        (item.matricule && item.matricule.toLowerCase().includes(q)) ||
        (item.motif && item.motif.toLowerCase().includes(q)) ||
        (item.salaryElementName && item.salaryElementName.toLowerCase().includes(q))
      );
    }

    if (this.statutFilter) {
      list = list.filter(item => item.statut === this.statutFilter);
    }

    if (this.moisFilter) {
      list = list.filter(item => item.moisApplication === this.moisFilter);
    }

    this.filteredList = list;
  }

  openAddModal(): void {
    this.editingItem = null;
    this.formModel = this.getEmptyForm();
    this.agentSearchText = '';
    this.showDialog = true;
  }

  openEditModal(item: TropPercuModel): void {
    this.editingItem = item;
    this.formModel = { ...item };
    this.agentSearchText = item.employeeName || '';
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
    this.editingItem = null;
    this.isSaving = false;
  }

  onEmployeeSelect(): void {
    const selected = this.employeesList.find(e => String(e.id) === String(this.formModel.employeeId));
    if (selected) {
      this.formModel.employeeName = `${selected.nom} ${selected.prenom}`;
      this.formModel.matricule = selected.matricule;
      this.agentSearchText = `${selected.matricule} - ${selected.nom} ${selected.prenom}`;
    }
  }

  saveItem(): void {
    if (!this.formModel.employeeId || !this.formModel.amount || !this.formModel.moisApplication) {
      alert('Veuillez renseigner l\'agent, le mois de déduction et le montant.');
      return;
    }

    this.isSaving = true;
    const payload: Partial<TropPercuModel> = {
      employeeId: Number(this.formModel.employeeId),
      salaryElementId: this.formModel.salaryElementId ? Number(this.formModel.salaryElementId) : undefined,
      moisOrigine: this.formModel.moisOrigine || this.getPreviousMonthCode(),
      moisApplication: this.formModel.moisApplication || this.getCurrentMonthCode(),
      amount: Number(this.formModel.amount),
      motif: this.formModel.motif || 'Régularisation trop-perçu sur salaire',
      statut: this.formModel.statut || 'EN_ATTENTE'
    };

    if (this.editingItem && this.editingItem.id) {
      this.tropPercuService.update(this.editingItem.id, payload).subscribe({
        next: (updated) => {
          this.showFlash('Trop-perçu mis à jour avec succès.');
          this.closeModal();
          this.loadTropPercus();
        },
        error: (err) => {
          alert('Erreur lors de la mise à jour du trop-perçu.');
          this.isSaving = false;
        }
      });
    } else {
      this.tropPercuService.create(payload).subscribe({
        next: (created) => {
          this.showFlash('Nouveau trop-perçu enregistré dans PostgreSQL.');
          this.closeModal();
          this.loadTropPercus();
        },
        error: (err) => {
          alert('Erreur lors de l\'enregistrement du trop-perçu.');
          this.isSaving = false;
        }
      });
    }
  }

  deleteItem(item: TropPercuModel): void {
    if (confirm(`Confirmez-vous la suppression de ce trop-perçu de ${item.amount} FCFA pour ${item.employeeName} ?`)) {
      this.tropPercuService.delete(item.id!).subscribe({
        next: () => {
          this.showFlash('Trop-perçu supprimé avec succès.');
          this.loadTropPercus();
        },
        error: () => alert('Erreur lors de la suppression.')
      });
    }
  }

  marquerApplique(item: TropPercuModel): void {
    const nouveauStatut = item.statut === 'APPLIQUE' ? 'EN_ATTENTE' : 'APPLIQUE';
    this.tropPercuService.changerStatut(item.id!, nouveauStatut).subscribe({
      next: () => {
        this.showFlash(`Statut mis à jour : ${nouveauStatut}`);
        this.loadTropPercus();
      },
      error: () => alert('Erreur lors de la modification du statut.')
    });
  }

  private showFlash(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 4000);
  }

  private getEmptyForm(): Partial<TropPercuModel> {
    return {
      employeeId: undefined,
      salaryElementId: this.elementsList.length > 0 ? this.elementsList[0].id : undefined,
      moisOrigine: this.getPreviousMonthCode(),
      moisApplication: this.getCurrentMonthCode(),
      amount: undefined,
      motif: '',
      statut: 'EN_ATTENTE'
    };
  }
}