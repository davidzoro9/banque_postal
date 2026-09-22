import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrieresService, MobiliteDemande } from '../services/carrieres.service';
import { EmployeeService } from '../../grh/employes/services/employee.service';
import { Employee } from '../../grh/employes/models/employee.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mobilite',
  templateUrl: './mobilite.component.html',
  styleUrls: ['./mobilite.component.scss'],
  standalone: false
})
export class MobiliteComponent implements OnInit {
  mobilites$!: Observable<MobiliteDemande[]>;
  employees$!: Observable<Employee[]>;

  showAddForm = false;
  saving = false;

  newMobility = {
    employeeId: '',
    typeMobility: 'Promotion' as MobiliteDemande['typeMobility'],
    posteCible: '',
    serviceCible: '',
    commentaires: ''
  };

  readonly typesMobility: MobiliteDemande['typeMobility'][] = [
    'Promotion',
    'Mutation géographique',
    'Reconversion professionnelle'
  ];

  constructor(
    private carrieresService: CarrieresService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mobilites$ = this.carrieresService.mobilites$;
    this.employees$ = this.employeeService.getAll();
  }

  addMobility(employees: Employee[]): void {
    const selectedEmp = employees.find(e => e.id === this.newMobility.employeeId);
    if (!selectedEmp) return;

    this.saving = true;

    const formattedDate = new Date().toISOString().slice(0, 10);
    const name = `${selectedEmp.prenom} ${selectedEmp.nom}`;

    this.carrieresService.addMobility({
      employeeId: selectedEmp.id,
      employeeName: name,
      typeMobility: this.newMobility.typeMobility,
      posteCible: this.newMobility.posteCible.trim(),
      serviceCible: this.newMobility.serviceCible.trim(),
      dateDemande: formattedDate,
      commentaires: this.newMobility.commentaires.trim(),
      statut: 'En attente'
    }).subscribe(() => {
      this.saving = false;
      this.newMobility = {
        employeeId: '',
        typeMobility: 'Promotion',
        posteCible: '',
        serviceCible: '',
        commentaires: ''
      };
      this.showAddForm = false;
    });
  }

  changeStatus(id: string, status: MobiliteDemande['statut']): void {
    this.carrieresService.updateMobilityStatus(id, status).subscribe();
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  goBack(): void {
    this.router.navigate(['/carrieres']);
  }
}
