import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Employee } from '../../models/employee.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

function parseCategoryCode(cat: string): string {
  if (!cat) return '';
  const upper = cat.toUpperCase().trim();
  if (upper.includes('CL8') || upper.includes('VIII')) return 'CL8';
  if (upper.includes('CL7') || upper.includes('VII')) return 'CL7';
  if (upper.includes('CL6') || upper.includes('VI')) return 'CL6';
  if (upper.includes('CL5') || upper.includes('V')) return 'CL5';
  if (upper.includes('CL4') || upper.includes('IV')) return 'CL4';
  if (upper.includes('CL3') || upper.includes('III')) return 'CL3';
  if (upper.includes('CL2') || upper.includes('II')) return 'CL2';
  if (upper.includes('CL1') || upper.includes('CLASSE I')) return 'CL1';
  if (upper.includes('C7') || upper.includes('7')) return 'C7';
  if (upper.includes('C6') || upper.includes('6')) return 'C6';
  if (upper.includes('C5') || upper.includes('5')) return 'C5';
  if (upper.includes('C4') || upper.includes('4')) return 'C4';
  if (upper.includes('C3') || upper.includes('3')) return 'C3';
  if (upper.includes('C2') || upper.includes('2')) return 'C2';
  if (upper.includes('C1') || upper.includes('1')) return 'C1';
  return '';
}

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss'],
  standalone: false
})
export class CategorieComponent implements OnInit {
  employee?: Employee;
  empId = '';
  grilleItems: RefItem[] = [];
  situationSalarialeData: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;

      const targetMat = e.matricule || this.empId;
      this.http.get<any>(`${environment.apiUrl}/employes/${targetMat}/situation-salariale`).subscribe({
        next: (data) => { this.situationSalarialeData = data; },
        error: () => {}
      });
    });

    this.dbRefService.getItems('grille-salariale').subscribe(items => {
      this.grilleItems = items || [];
    });
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  get summary() {
    const e = this.employee;
    if (!e) return null;

    let cat = parseCategoryCode(e.categoriePro) || e.categoriePro || '';
    let ech = (e.echelon || 'E01').trim();
    if (ech) {
      const num = parseInt(ech.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num)) ech = num < 10 ? `E0${num}` : `E${num}`;
    }

    let grade = e.grade?.trim() || '';
    if (grade && grade.length >= 3 && !grade.includes('GROUPE')) {
      const match = grade.match(/^(C[1-7]|CL[1-8])(E\d{2})$/i);
      if (match) {
        cat = match[1].toUpperCase();
        ech = match[2].toUpperCase();
      }
    } else {
      if (!cat) cat = 'C1';
      grade = `${cat}${ech}`;
    }

    // Dynamic lookup from Grille Salariale (Données de base)
    let base = e.salaireBase || 0;
    if (this.grilleItems && this.grilleItems.length > 0) {
      const targetGrade = grade.toUpperCase();
      const matchGrid = this.grilleItems.find(item => {
        const itemGrade = (item.grade || '').toUpperCase().replace(/\s+/g, '');
        const itemCat = (item.categorie || item.code || '').toUpperCase();
        const itemEch = (item.echellon || '').toUpperCase();
        return itemGrade === targetGrade || (itemCat === cat && itemEch === ech);
      });
      if (matchGrid && matchGrid.montant) {
        base = matchGrid.montant;
      }
    }

    let totalIndemnites = 0;
    let indemnitesBareme: any[] = [];

    if (this.situationSalarialeData) {
      totalIndemnites = this.situationSalarialeData.totalIndemnites || 0;
      indemnitesBareme = this.situationSalarialeData.indemnitesBareme || [];
    } else {
      totalIndemnites = (e.primeLogement || 0) + (e.primeTransport || 0) + (e.primeResponsabilite || 0);
    }

    return {
      grade: grade,
      categorie: cat,
      echelon: ech,
      fonction: e.fonction || 'Agent simple',
      salaireBase: base,
      totalIndemnites: totalIndemnites,
      indemnitesBareme: indemnitesBareme
    };
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
