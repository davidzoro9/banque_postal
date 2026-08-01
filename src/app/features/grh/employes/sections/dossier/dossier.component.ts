import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, DocumentRH } from '../../models/employee.model';

@Component({
  selector: 'app-dossier',
  templateUrl: './dossier.component.html',
  styleUrls: ['./dossier.component.scss'],
  standalone: false
})
export class DossierComponent implements OnInit {
  employee?: Employee;
  empId = '';
  saving = false;
  isEditing = false;
  documents: DocumentRH[] = [];
  showAddForm = false;

  newDoc = { libelle: '' };

  selectedFileName = '';
  selectedFileBase64 = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.documents = [...e.documents];
    });
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    if (this.employee) {
      this.documents = [...this.employee.documents];
    }
    this.showAddForm = false;
    this.isEditing = false;
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFileName = file.name;
      if (!this.newDoc.libelle) {
        this.newDoc.libelle = file.name.split('.').slice(0, -1).join('.');
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addDoc(): void {
    if (!this.newDoc.libelle.trim()) return;
    const doc: DocumentRH = {
      id:        `doc-${Date.now()}`,
      libelle:   this.newDoc.libelle.trim(),
      dateAjout: new Date().toISOString().slice(0, 10),
      url:       this.selectedFileBase64 || undefined
    };
    this.documents = [...this.documents, doc];
    this.newDoc = { libelle: '' };
    this.selectedFileName = '';
    this.selectedFileBase64 = '';
    this.showAddForm = false;
  }

  removeDoc(id: string): void {
    this.documents = this.documents.filter(d => d.id !== id);
  }

  openFile(doc: DocumentRH): void {
    if (!doc.url) return;
    const win = window.open();
    if (win) {
      win.document.write(`<iframe src="${doc.url}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`);
    } else {
      const a = document.createElement('a');
      a.href = doc.url;
      a.download = doc.libelle;
      a.click();
    }
  }

  getCatIcon(cat?: string): string {
    if (!cat) return 'description';
    const map: Record<string, string> = {
      'Contrat':              'description',
      'Diplôme':              'school',
      'Pièce administrative': 'badge',
      'Document numérisé':    'scanner'
    };
    return map[cat] || 'description';
  }

  save(next?: string): void {
    this.saving = true;
    this.employeeService.update(this.empId, { documents: this.documents }).subscribe({
      next: () => {
        this.saving = false;
        this.isEditing = false;
        if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      },
      error: (err) => {
        this.saving = false;
        console.error('Erreur lors de l\'enregistrement du dossier:', err);
        alert('Erreur lors de l\'enregistrement du dossier : ' + (err.error?.message || err.message || 'Fichier trop lourd ou erreur réseau.'));
      }
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
