import { Component, OnInit } from '@angular/core';
import { DbRefService, RefItem } from '../../donnees-base/services/db-ref.service';
import { EmployeeService } from '../employes/services/employee.service';
import { Employee } from '../employes/models/employee.model';
import { ModuleNavService } from '../../../core/services/module-nav.service';

@Component({
  selector: 'app-organigramme',
  templateUrl: './organigramme.component.html',
  styleUrls: ['./organigramme.component.scss'],
  standalone: false
})
export class OrganigrammeComponent implements OnInit {
  agences: RefItem[] = [];
  directions: RefItem[] = [];
  departements: RefItem[] = [];
  services: RefItem[] = [];
  employees: Employee[] = [];
  selectedAgence = 'Agence Centrale';

  constructor(
    private dbRefService: DbRefService,
    private employeeService: EmployeeService,
    private moduleNav: ModuleNavService
  ) { }

  ngOnInit(): void {


    this.dbRefService.getItems('agence').subscribe(items => {
      this.agences = items || [];
    });
    this.dbRefService.getItems('direction').subscribe(items => {
      this.directions = items || [];
    });
    this.dbRefService.getItems('departement').subscribe(items => {
      this.departements = items || [];
    });
    this.dbRefService.getItems('service').subscribe(items => {
      this.services = items || [];
    });
    this.employeeService.getAll().subscribe(emps => {
      this.employees = emps || [];
    });
  }

  getEmployeesForUnit(type: 'direction' | 'departement' | 'service', unitName: string): Employee[] {
    const nameLower = unitName.toLowerCase();
    return this.employees.filter(e => {
      if (type === 'direction') return (e.direction || '').toLowerCase().includes(nameLower);
      if (type === 'departement') return (e.departement || '').toLowerCase().includes(nameLower);
      if (type === 'service') return (e.service || '').toLowerCase().includes(nameLower);
      return false;
    });
  }
}
