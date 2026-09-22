import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Employee, StatutEmploye, STATUT_COLORS } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';

import { DbRefService, RefItem } from '../../../donnees-base/services/db-ref.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone: false
})
export class EmployeeListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  module = APP_MODULES.find(m => m.id === 'grh')!;

  displayedColumns = ['matricule', 'nom', 'grade', 'poste', 'fonction', 'service', 'dateEmbauche', 'dateRetraite', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Employee>();

  searchQuery = '';
  selectedStatut: StatutEmploye | '' = '';
  selectedService = '';

  readonly statuts: (StatutEmploye | '')[] = ['', 'Actif', 'Inactif', 'Suspendu', "Période d'essai", 'Congé maladie', 'Détaché'];
  services: string[] = [];
  paramGroupes: RefItem[] = [];
  paramRetraite: RefItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private dbRefService: DbRefService,
    private moduleNav: ModuleNavService,
    private router: Router
  ) {}

  get totalEmployes(): number {
    return this.dataSource.data.length;
  }

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.services = this.employeeService.getServices();
    this.employeeService.employees$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.applyFilters();
    });
    this.dbRefService.getItems('param-groupe').pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.paramGroupes = list || [];
    });
    this.dbRefService.getItems('param-retraite').pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.paramRetraite = list || [];
    });
    this.applyFilters();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    const results = this.employeeService.search(this.searchQuery, this.selectedStatut, this.selectedService);
    this.dataSource.data = results;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatut = '';
    this.selectedService = '';
    this.applyFilters();
  }

  viewEmployee(id: string): void {
    this.router.navigate(['/grh/employes', id]);
  }

  editEmployee(id: string): void {
    this.router.navigate(['/grh/employes', id]);
  }

  deleteEmployee(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Supprimer cet employé ?')) {
      this.employeeService.delete(id).subscribe();
    }
  }

  newEmployee(): void {
    this.router.navigate(['/grh/employes/nouveau']);
  }

  getInitials(emp: Employee): string {
    const p = emp.prenom?.charAt(0) || '';
    const n = emp.nom?.charAt(0) || '';
    return `${p}${n}`.toUpperCase() || '??';
  }

  getAvatarColor(emp: Employee): string {
    const colors = ['#0060B3', '#0060B3', '#1B3A6B', '#FFC700', '#004080', '#004080', '#1B4B9A', '#CC8800'];
    if (!emp.nom || !emp.prenom) return '#0060B3';
    const idx = (emp.nom.charCodeAt(0) + emp.prenom.charCodeAt(0)) % colors.length;
    return colors[idx];
  }

  getGradeConcat(emp: Employee): string {
    if (!emp) return '—';

    // 1. Si déjà au format standardisé arabe (ex: CL2E02, C1E01, HCEX)
    let directGrade = (emp.grade || '').trim().toUpperCase();
    if (/^(C|CL|HC)\d*(E\d+|EX)$/i.test(directGrade)) {
      return directGrade;
    }

    // 2. Si le grade direct contient des chiffres romains (ex: CLIIE02 -> CL2E02)
    const romanDirectMatch = directGrade.match(/^CL\s*(VIII|VII|VI|V|IV|III|II|I)\s*(E\d+|EX)?$/i);
    if (romanDirectMatch) {
      const romanMap: Record<string, string> = {
        'VIII': '8', 'VII': '7', 'VI': '6', 'V': '5', 'IV': '4', 'III': '3', 'II': '2', 'I': '1'
      };
      const rNum = romanMap[romanDirectMatch[1].toUpperCase()] || romanDirectMatch[1];
      const echPart = romanDirectMatch[2] ? romanDirectMatch[2].toUpperCase() : '';
      if (echPart) {
        return `CL${rNum}${echPart}`;
      }
      directGrade = `CL${rNum}`;
    }

    // 3. Déterminer le code de la catégorie (ex: 'CLASSE II' -> 'CL2', '1ère CATEGORIE' -> 'C1')
    const rawCat = (emp.categoriePro || (emp as any).categorie || '').trim().toUpperCase();
    const catCode = this.getCatCodeDisplay(rawCat);

    // 4. Déterminer le code de l'échelon (ex: 'Échelon 2' -> 'E02')
    const rawEch = (emp.echelon || '').trim().toUpperCase();
    const echCode = this.getEchelonCodeDisplay(rawEch);

    if (catCode && echCode) {
      return `${catCode}${echCode}`;
    }

    return directGrade || catCode || echCode || '—';
  }

  getCatCodeDisplay(str: string): string {
    if (!str) return '';
    const upper = str.toUpperCase().trim();

    // Classes bancaires (CL1 à CL8) - Tester impérativement de VIII à I pour éviter les faux positifs
    if (upper.includes('CLASSE VIII') || upper === 'VIII' || upper === 'CL8' || upper === 'CLASSE 8' || upper === 'CL VIII') return 'CL8';
    if (upper.includes('CLASSE VII') || upper === 'VII' || upper === 'CL7' || upper === 'CLASSE 7' || upper === 'CL VII') return 'CL7';
    if (upper.includes('CLASSE VI') || upper === 'VI' || upper === 'CL6' || upper === 'CLASSE 6' || upper === 'CL VI') return 'CL6';
    if (upper.includes('CLASSE V') || upper === 'V' || upper === 'CL5' || upper === 'CLASSE 5' || upper === 'CL V') return 'CL5';
    if (upper.includes('CLASSE IV') || upper === 'IV' || upper === 'CL4' || upper === 'CLASSE 4' || upper === 'CL IV') return 'CL4';
    if (upper.includes('CLASSE III') || upper === 'III' || upper === 'CL3' || upper === 'CLASSE 3' || upper === 'CL III') return 'CL3';
    if (upper.includes('CLASSE II') || upper === 'II' || upper === 'CL2' || upper === 'CLASSE 2' || upper === 'CL II') return 'CL2';
    if (upper.includes('CLASSE I') || upper === 'I' || upper === 'CL1' || upper === 'CLASSE 1' || upper === 'CL I') return 'CL1';

    // Catégories d'exécution et maîtrise (C1 à C7)
    if (upper.includes('1ERE') || upper.includes('1ÈRE') || upper.includes('1RE') || upper.includes('CATEGORIE 1') || upper.includes('CAT 1') || upper === '1' || upper === 'C1') return 'C1';
    if (upper.includes('2EME') || upper.includes('2ÈME') || upper.includes('2E') || upper.includes('CATEGORIE 2') || upper.includes('CAT 2') || upper === '2' || upper === 'C2') return 'C2';
    if (upper.includes('3EME') || upper.includes('3ÈME') || upper.includes('3E') || upper.includes('CATEGORIE 3') || upper.includes('CAT 3') || upper === '3' || upper === 'C3') return 'C3';
    if (upper.includes('4EME') || upper.includes('4ÈME') || upper.includes('4E') || upper.includes('CATEGORIE 4') || upper.includes('CAT 4') || upper === '4' || upper === 'C4') return 'C4';
    if (upper.includes('5EME') || upper.includes('5ÈME') || upper.includes('5E') || upper.includes('CATEGORIE 5') || upper.includes('CAT 5') || upper === '5' || upper === 'C5') return 'C5';
    if (upper.includes('6EME') || upper.includes('6ÈME') || upper.includes('6E') || upper.includes('CATEGORIE 6') || upper.includes('CAT 6') || upper === '6' || upper === 'C6') return 'C6';
    if (upper.includes('7EME') || upper.includes('7ÈME') || upper.includes('7E') || upper.includes('CATEGORIE 7') || upper.includes('CAT 7') || upper === '7' || upper === 'C7') return 'C7';

    // Hors Catégorie
    if (upper.includes('HORS') || upper.startsWith('HC')) return 'HC';

    // Regex générique pour attraper CL + chiffre ou chiffre romain
    if (upper.startsWith('CL') || upper.includes('CLASSE')) {
      const romanMap: Record<string, string> = {
        'VIII': '8', 'VII': '7', 'VI': '6', 'V': '5', 'IV': '4', 'III': '3', 'II': '2', 'I': '1'
      };
      const match = upper.match(/VIII|VII|VI|IV|V|III|II|I|\d+/);
      if (match) {
        const val = romanMap[match[0]] || match[0];
        return `CL${val}`;
      }
    }

    if (upper.startsWith('C') && /^C\d+/.test(upper)) {
      return upper.match(/^C\d+/)?.[0] || upper;
    }

    const num = upper.replace(/[^0-9]/g, '');
    if (num) return `C${num}`;

    return upper;
  }

  getEchelonCodeDisplay(str: string): string {
    if (!str) return '';
    const upper = str.toUpperCase().trim();
    if (upper.includes('EXCEPT') || upper.endsWith('EX')) return 'EX';
    if (upper.startsWith('E') && !upper.startsWith('ECH')) {
      const num = parseInt(upper.substring(1), 10);
      if (!isNaN(num)) return num < 10 ? `E0${num}` : `E${num}`;
    }
    const numStr = upper.replace(/[^0-9]/g, '');
    if (numStr) {
      const num = parseInt(numStr, 10);
      return num < 10 ? `E0${num}` : `E${num}`;
    }
    return upper;
  }

  getDateRetraite(emp: Employee): { dateStr: string; yearsLeft: number | null } {
    let birthDate: Date | null = null;
    if (emp.dateNaissance) {
      birthDate = new Date(emp.dateNaissance);
    }

    const fonction = (emp.fonction || emp.poste || '').toLowerCase();
    const cat = (emp.categoriePro || '').toUpperCase();

    // 1. Détermination du Groupe de l'employé via le Paramétrage Groupe (catégories rattachées)
    let groupe = '';
    const match = (this.paramGroupes || []).find((g: any) => Array.isArray(g.categories) && g.categories.includes(cat));
    if (match) {
      groupe = match.grade || match.libelle || match.code || '';
    }

    if (!groupe) {
      if (cat.startsWith('CL5') || cat.startsWith('CL6') || cat.startsWith('CL7') || cat.startsWith('CL8')) {
        groupe = 'GROUPE III';
      } else if (cat.startsWith('CL1') || cat.startsWith('CL2') || cat.startsWith('CL3') || cat.startsWith('CL4')) {
        groupe = 'GROUPE II';
      } else if (cat.startsWith('C')) {
        groupe = 'GROUPE I';
      } else {
        groupe = 'GROUPE I';
      }
    }

    // 2. Récupération de l'âge de retraite paramétré dans les données de base pour ce Groupe
    let ageRetraite = 60;
    const param = (this.paramRetraite || []).find((p: any) =>
      (p.libelle && p.libelle.includes(groupe)) ||
      (p.grade && p.grade.includes(groupe)) ||
      (p.code && p.code.includes(groupe))
    );
    if (param && (param.taux || param.montant)) {
      ageRetraite = Number(param.taux || param.montant);
    } else {
      ageRetraite = groupe === 'GROUPE III' ? 65 : 60;
    }

    if (!birthDate || isNaN(birthDate.getTime())) {
      if (emp.dateEmbauche) {
        const emb = new Date(emp.dateEmbauche);
        if (!isNaN(emb.getTime())) {
          const retYear = emb.getFullYear() + 35;
          const retDate = new Date(retYear, emb.getMonth(), emb.getDate());
          const now = new Date();
          const yearsLeft = retYear - now.getFullYear();
          return {
            dateStr: retDate.toLocaleDateString('fr-FR'),
            yearsLeft
          };
        }
      }
      return { dateStr: '—', yearsLeft: null };
    }

    const retYear = birthDate.getFullYear() + ageRetraite;
    const retDate = new Date(retYear, birthDate.getMonth(), birthDate.getDate());
    const now = new Date();
    const yearsLeft = Math.ceil((retDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365.25));

    return {
      dateStr: retDate.toLocaleDateString('fr-FR'),
      yearsLeft: Math.max(0, yearsLeft)
    };
  }

  getStatutStyle(statut: StatutEmploye) {
    return STATUT_COLORS[statut] || { color: '#0060B3', background: '#e0f2fe' };
  }
}
