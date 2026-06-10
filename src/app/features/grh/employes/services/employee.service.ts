import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Employee, StatutEmploye } from '../models/employee.model';

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1', matricule: 'EMP-001',
    nom: 'Martin', prenom: 'Sophie', sexe: 'F',
    dateNaissance: '1990-03-15', lieuNaissance: 'Paris', nationalite: 'Française', numeroCNI: '900315-75-001',
    adresse: '12 rue des Fleurs', ville: 'Paris', codePostal: '75001', pays: 'France',
    telephone: '+226 70 12 34 56', email: 'sophie.martin@sigrh.bf',
    contactsUrgence: [{ nom: 'Martin', prenom: 'Jean', lien: 'Père', telephone: '+226 76 98 76 54' }],
    enfants: [], personnesCharge: [],
    poste: 'Analyste Financier', service: 'Finance', direction: 'Direction Financière',
    dateEmbauche: '2022-01-15', statut: 'Actif', typeContrat: 'CDI',
    categoriePro: 'Cadre', echelon: '3', grade: 'A', niveau: 'II',
    primeLogement: 50000, primeTransport: 30000, primeResponsabilite: 0,
    autresIndemnites: [],
    exonerationsFiscales: [], exonerationsSociales: [], avantagesParticuliers: [],
    salaireBase: 450000, salaireBrut: 530000, modePaiement: 'Virement bancaire',
    banque: 'Ecobank', iban: 'BF9800100100000000000000001',
    documents: [
      { id: 'd1', libelle: 'Contrat CDI', categorie: 'Contrat', dateAjout: '2022-01-15' },
      { id: 'd2', libelle: 'Licence Finance', categorie: 'Diplôme', dateAjout: '2022-01-15' }
    ],
    observations: 'Excellente collaboratrice, très rigoureuse.',
    evaluations: [{ date: '2023-12-15', periode: '2023', note: 4.5, commentaire: 'Très bon travail', evaluateur: 'M. Kabore' }],
    historiqueActions: [{ date: '2022-01-15', type: 'Embauche', description: 'Prise de poste CDI', auteur: 'Service RH' }]
  },
  {
    id: '2', matricule: 'EMP-002',
    nom: 'Bernard', prenom: 'Thomas', sexe: 'M',
    dateNaissance: '1988-07-22', lieuNaissance: 'Bobo-Dioulasso', nationalite: 'Burkinabè', numeroCNI: 'B8807220012',
    adresse: '45 avenue Kwame Nkrumah', ville: 'Ouagadougou', codePostal: '01 BP 0001', pays: 'Burkina Faso',
    telephone: '+226 70 23 45 67', email: 'thomas.bernard@sigrh.bf',
    contactsUrgence: [{ nom: 'Bernard', prenom: 'Aline', lien: 'Épouse', telephone: '+226 76 87 65 43' }],
    conjoint: { nom: 'Bernard', prenom: 'Aline', dateNaissance: '1992-05-10', profession: 'Enseignante' },
    enfants: [
      { nom: 'Bernard', prenom: 'Lucas', dateNaissance: '2015-08-12', sexe: 'M' },
      { nom: 'Bernard', prenom: 'Emma', dateNaissance: '2018-03-22', sexe: 'F' }
    ],
    personnesCharge: [],
    poste: 'Développeur Full Stack', service: 'Informatique', direction: 'Direction SI',
    dateEmbauche: '2021-06-01', statut: 'Actif', typeContrat: 'CDI',
    categoriePro: 'Cadre', echelon: '4', grade: 'B', niveau: 'III',
    primeLogement: 50000, primeTransport: 30000, primeResponsabilite: 25000,
    autresIndemnites: [{ libelle: 'Prime performance', montant: 50000 }],
    exonerationsFiscales: [], exonerationsSociales: [],
    avantagesParticuliers: ['Téléphone de service'],
    salaireBase: 500000, salaireBrut: 655000, modePaiement: 'Virement bancaire',
    banque: 'BICIAB', iban: 'BF9800200200000000000000002',
    documents: [
      { id: 'd3', libelle: 'Contrat CDI', categorie: 'Contrat', dateAjout: '2021-06-01' },
      { id: 'd4', libelle: 'Master Informatique', categorie: 'Diplôme', dateAjout: '2021-06-01' }
    ],
    observations: '',
    evaluations: [],
    historiqueActions: [{ date: '2021-06-01', type: 'Embauche', description: 'Prise de poste CDI', auteur: 'Service RH' }]
  },
  {
    id: '3', matricule: 'EMP-003',
    nom: 'Dubois', prenom: 'Claire', nomJeuneFille: 'Traoré', sexe: 'F',
    dateNaissance: '1995-11-08', lieuNaissance: 'Koudougou', nationalite: 'Burkinabè', numeroCNI: 'B9511080034',
    adresse: '8 rue du Gouverneur', ville: 'Ouagadougou', codePostal: '01 BP 0002', pays: 'Burkina Faso',
    telephone: '+226 75 34 56 78', email: 'claire.dubois@sigrh.bf',
    contactsUrgence: [{ nom: 'Traoré', prenom: 'Moussa', lien: 'Frère', telephone: '+226 70 11 22 33' }],
    enfants: [{ nom: 'Dubois', prenom: 'Inès', dateNaissance: '2020-04-15', sexe: 'F' }],
    personnesCharge: [],
    poste: 'Chargée des Ressources Humaines', service: 'Ressources Humaines', direction: 'Direction Générale',
    dateEmbauche: '2023-03-01', statut: "Période d'essai", typeContrat: 'CDD',
    categoriePro: 'Agent de maîtrise', echelon: '1', grade: 'C', niveau: 'I',
    primeLogement: 30000, primeTransport: 25000, primeResponsabilite: 0,
    autresIndemnites: [],
    exonerationsFiscales: [{ libelle: 'Exo. enfant à charge', montant: 5000 }],
    exonerationsSociales: [], avantagesParticuliers: [],
    salaireBase: 280000, salaireBrut: 335000, modePaiement: 'Virement bancaire',
    banque: 'Coris Bank', iban: 'BF9800300300000000000000003',
    documents: [
      { id: 'd5', libelle: 'Contrat CDD', categorie: 'Contrat', dateAjout: '2023-03-01' }
    ],
    observations: "En cours d'intégration.",
    evaluations: [],
    historiqueActions: [{ date: '2023-03-01', type: 'Embauche', description: 'Recrutement CDD 6 mois', auteur: 'Service RH' }]
  },
  {
    id: '4', matricule: 'EMP-004',
    nom: 'Leroy', prenom: 'Marc', sexe: 'M',
    dateNaissance: '1985-01-30', lieuNaissance: 'Fada N\'Gourma', nationalite: 'Burkinabè', numeroCNI: 'B8501300045',
    adresse: '22 avenue de la Nation', ville: 'Ouagadougou', codePostal: '01 BP 0003', pays: 'Burkina Faso',
    telephone: '+226 70 45 67 89', email: 'marc.leroy@sigrh.bf',
    contactsUrgence: [{ nom: 'Leroy', prenom: 'Suzanne', lien: 'Mère', telephone: '+226 76 44 55 66' }],
    conjoint: { nom: 'Leroy', prenom: 'Fatima', dateNaissance: '1988-09-14', profession: 'Commerçante' },
    enfants: [
      { nom: 'Leroy', prenom: 'Ali', dateNaissance: '2012-06-20', sexe: 'M' },
      { nom: 'Leroy', prenom: 'Safi', dateNaissance: '2014-02-10', sexe: 'F' },
      { nom: 'Leroy', prenom: 'Idriss', dateNaissance: '2017-11-05', sexe: 'M' }
    ],
    personnesCharge: [{ nom: 'Leroy', prenom: 'Suzanne', lien: 'Mère' }],
    poste: 'Responsable Commercial', service: 'Commerce', direction: 'Direction Commerciale',
    dateEmbauche: '2019-09-15', statut: 'Actif', typeContrat: 'CDI',
    categoriePro: 'Cadre', echelon: '5', grade: 'A', niveau: 'IV',
    primeLogement: 60000, primeTransport: 35000, primeResponsabilite: 40000,
    autresIndemnites: [{ libelle: 'Commission ventes', montant: 75000 }],
    exonerationsFiscales: [{ libelle: 'Exo. enfants à charge (3)', montant: 15000 }],
    exonerationsSociales: [], avantagesParticuliers: ['Voiture de service', 'Téléphone', 'Carburant'],
    salaireBase: 620000, salaireBrut: 830000, modePaiement: 'Virement bancaire',
    banque: 'BOA Burkina', iban: 'BF9800400400000000000000004',
    documents: [
      { id: 'd6', libelle: 'Contrat CDI', categorie: 'Contrat', dateAjout: '2019-09-15' },
      { id: 'd7', libelle: 'MBA Commerce International', categorie: 'Diplôme', dateAjout: '2019-09-15' },
      { id: 'd8', libelle: 'Avenant 2021', categorie: 'Contrat', dateAjout: '2021-01-01' }
    ],
    observations: 'Excellent commercial, atteint systématiquement ses objectifs.',
    evaluations: [
      { date: '2022-12-20', periode: '2022', note: 4.8, commentaire: 'Performance exceptionnelle', evaluateur: 'DG' },
      { date: '2023-12-20', periode: '2023', note: 4.6, commentaire: 'Très bonne année', evaluateur: 'DG' }
    ],
    historiqueActions: [
      { date: '2019-09-15', type: 'Embauche', description: 'Prise de poste CDI', auteur: 'Service RH' },
      { date: '2021-01-01', type: 'Avancement', description: 'Passage échelon 5', auteur: 'Service RH' }
    ]
  },
  {
    id: '5', matricule: 'EMP-005',
    nom: 'Ouédraogo', prenom: 'Aminata', sexe: 'F',
    dateNaissance: '1993-06-12', lieuNaissance: 'Ouagadougou', nationalite: 'Burkinabè', numeroCNI: 'B9306120056',
    adresse: '5 rue des Jardins', ville: 'Ouagadougou', codePostal: '01 BP 0004', pays: 'Burkina Faso',
    telephone: '+226 77 56 78 90', email: 'aminata.ouedraogo@sigrh.bf',
    contactsUrgence: [{ nom: 'Ouédraogo', prenom: 'Issouf', lien: 'Père', telephone: '+226 70 23 45 67' }],
    enfants: [], personnesCharge: [],
    poste: 'Comptable Principal', service: 'Comptabilité', direction: 'Direction Financière',
    dateEmbauche: '2020-11-02', statut: 'Actif', typeContrat: 'CDI',
    categoriePro: 'Cadre', echelon: '3', grade: 'B', niveau: 'II',
    primeLogement: 45000, primeTransport: 30000, primeResponsabilite: 15000,
    autresIndemnites: [],
    exonerationsFiscales: [], exonerationsSociales: [], avantagesParticuliers: [],
    salaireBase: 380000, salaireBrut: 470000, modePaiement: 'Virement bancaire',
    banque: 'UBA Burkina', iban: 'BF9800500500000000000000005',
    documents: [
      { id: 'd9', libelle: 'Contrat CDI Comptable', categorie: 'Contrat', dateAjout: '2020-11-02' },
      { id: 'd10', libelle: 'DUT Comptabilité', categorie: 'Diplôme', dateAjout: '2020-11-02' }
    ],
    observations: '',
    evaluations: [{ date: '2023-11-30', periode: '2023', note: 4.2, commentaire: 'Bon travail', evaluateur: 'DAF' }],
    historiqueActions: [{ date: '2020-11-02', type: 'Embauche', description: 'Prise de poste', auteur: 'Service RH' }]
  },
  {
    id: '6', matricule: 'EMP-006',
    nom: 'Sawadogo', prenom: 'Ibrahim', sexe: 'M',
    dateNaissance: '1991-09-25', lieuNaissance: 'Dédougou', nationalite: 'Burkinabè', numeroCNI: 'B9109250067',
    adresse: '17 boulevard du Faso', ville: 'Ouagadougou', codePostal: '01 BP 0005', pays: 'Burkina Faso',
    telephone: '+226 70 67 89 01', email: 'ibrahim.sawadogo@sigrh.bf',
    contactsUrgence: [{ nom: 'Sawadogo', prenom: 'Mariam', lien: 'Épouse', telephone: '+226 76 55 44 33' }],
    conjoint: { nom: 'Sawadogo', prenom: 'Mariam', dateNaissance: '1994-03-18', profession: 'Infirmière' },
    enfants: [{ nom: 'Sawadogo', prenom: 'Youssouf', dateNaissance: '2019-07-08', sexe: 'M' }],
    personnesCharge: [],
    poste: 'Ingénieur Réseaux', service: 'Informatique', direction: 'Direction SI',
    dateEmbauche: '2022-04-18', statut: 'Actif', typeContrat: 'CDI',
    categoriePro: 'Cadre', echelon: '2', grade: 'B', niveau: 'II',
    primeLogement: 50000, primeTransport: 30000, primeResponsabilite: 20000,
    autresIndemnites: [],
    exonerationsFiscales: [{ libelle: 'Exo. enfant à charge', montant: 5000 }],
    exonerationsSociales: [], avantagesParticuliers: ['Téléphone de service'],
    salaireBase: 420000, salaireBrut: 525000, modePaiement: 'Virement bancaire',
    banque: 'Ecobank', iban: 'BF9800600600000000000000006',
    documents: [
      { id: 'd11', libelle: 'Contrat CDI', categorie: 'Contrat', dateAjout: '2022-04-18' },
      { id: 'd12', libelle: 'Licence Réseaux & Télécoms', categorie: 'Diplôme', dateAjout: '2022-04-18' }
    ],
    observations: '',
    evaluations: [],
    historiqueActions: [{ date: '2022-04-18', type: 'Embauche', description: 'Prise de poste', auteur: 'Service RH' }]
  },
  {
    id: '7', matricule: 'EMP-007',
    nom: 'Kaboré', prenom: 'Rasmata', sexe: 'F',
    dateNaissance: '1987-04-03', lieuNaissance: 'Ziniaré', nationalite: 'Burkinabè', numeroCNI: 'B8704030078',
    adresse: '33 rue de la Paix', ville: 'Ouagadougou', codePostal: '01 BP 0006', pays: 'Burkina Faso',
    telephone: '+226 76 78 90 12', email: 'rasmata.kabore@sigrh.bf',
    contactsUrgence: [{ nom: 'Kaboré', prenom: 'Boureima', lien: 'Époux', telephone: '+226 70 33 44 55' }],
    conjoint: { nom: 'Kaboré', prenom: 'Boureima', dateNaissance: '1984-11-22', profession: 'Ingénieur' },
    enfants: [
      { nom: 'Kaboré', prenom: 'Fatimata', dateNaissance: '2013-09-14', sexe: 'F' },
      { nom: 'Kaboré', prenom: 'Seydou', dateNaissance: '2016-05-28', sexe: 'M' }
    ],
    personnesCharge: [],
    poste: 'Directrice des Ressources Humaines', service: 'Ressources Humaines', direction: 'Direction Générale',
    dateEmbauche: '2015-07-20', statut: 'Actif', typeContrat: 'CDI',
    categoriePro: 'Cadre supérieur', echelon: '7', grade: 'A', niveau: 'V',
    primeLogement: 80000, primeTransport: 40000, primeResponsabilite: 100000,
    autresIndemnites: [{ libelle: 'Prime de direction', montant: 80000 }],
    exonerationsFiscales: [{ libelle: 'Exo. enfants à charge (2)', montant: 10000 }],
    exonerationsSociales: [], avantagesParticuliers: ['Voiture de service', 'Logement de fonction', 'Téléphone'],
    salaireBase: 900000, salaireBrut: 1210000, modePaiement: 'Virement bancaire',
    banque: 'SGBB', iban: 'BF9800700700000000000000007',
    documents: [
      { id: 'd13', libelle: 'Contrat CDI DRH', categorie: 'Contrat', dateAjout: '2015-07-20' },
      { id: 'd14', libelle: 'Master RH', categorie: 'Diplôme', dateAjout: '2015-07-20' },
      { id: 'd15', libelle: 'CIE RH', categorie: 'Diplôme', dateAjout: '2015-07-20' }
    ],
    observations: 'Leader reconnu, pilote la transformation RH de la structure.',
    evaluations: [
      { date: '2022-12-30', periode: '2022', note: 5, commentaire: 'Excellence professionnelle', evaluateur: 'DG' },
      { date: '2023-12-30', periode: '2023', note: 4.9, commentaire: 'Excellent leadership', evaluateur: 'DG' }
    ],
    historiqueActions: [
      { date: '2015-07-20', type: 'Embauche', description: 'Recrutement DRH', auteur: 'DG' },
      { date: '2019-01-01', type: 'Promotion', description: 'Nomination Directrice', auteur: 'DG' }
    ]
  },
  {
    id: '8', matricule: 'EMP-008',
    nom: 'Zongo', prenom: 'Patrice', sexe: 'M',
    dateNaissance: '1996-02-14', lieuNaissance: 'Tenkodogo', nationalite: 'Burkinabè', numeroCNI: 'B9602140089',
    adresse: '9 cité SONABEL', ville: 'Ouagadougou', codePostal: '01 BP 0007', pays: 'Burkina Faso',
    telephone: '+226 71 89 01 23', email: 'patrice.zongo@sigrh.bf',
    contactsUrgence: [{ nom: 'Zongo', prenom: 'Alice', lien: 'Mère', telephone: '+226 76 22 33 44' }],
    enfants: [], personnesCharge: [],
    poste: 'Assistant Administratif', service: 'Administration', direction: 'Secrétariat Général',
    dateEmbauche: '2024-02-01', statut: "Période d'essai", typeContrat: 'CDD',
    categoriePro: 'Employé', echelon: '1', grade: 'D', niveau: 'I',
    primeLogement: 20000, primeTransport: 20000, primeResponsabilite: 0,
    autresIndemnites: [],
    exonerationsFiscales: [], exonerationsSociales: [], avantagesParticuliers: [],
    salaireBase: 180000, salaireBrut: 220000, modePaiement: 'Virement bancaire',
    banque: 'Coris Bank', iban: 'BF9800800800000000000000008',
    documents: [
      { id: 'd16', libelle: 'Contrat CDD 6 mois', categorie: 'Contrat', dateAjout: '2024-02-01' },
      { id: 'd17', libelle: 'BTS Administration', categorie: 'Diplôme', dateAjout: '2024-02-01' }
    ],
    observations: "En cours d'intégration et de formation.",
    evaluations: [],
    historiqueActions: [{ date: '2024-02-01', type: 'Embauche', description: 'Contrat CDD période essai', auteur: 'Service RH' }]
  }
];

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: Employee[] = [...MOCK_EMPLOYEES];
  private employeesSubject = new BehaviorSubject<Employee[]>(this.employees);

  employees$: Observable<Employee[]> = this.employeesSubject.asObservable();

  getAll(): Observable<Employee[]> {
    return this.employees$;
  }

  getById(id: string): Observable<Employee | undefined> {
    return of(this.employees.find(e => e.id === id));
  }

  create(data: Omit<Employee, 'id'>): Observable<Employee> {
    const employee: Employee = { ...data, id: Date.now().toString() } as Employee;
    this.employees = [...this.employees, employee];
    this.employeesSubject.next(this.employees);
    return of(employee);
  }

  update(id: string, data: Partial<Employee>): Observable<Employee> {
    this.employees = this.employees.map(e => e.id === id ? { ...e, ...data } : e);
    this.employeesSubject.next(this.employees);
    return of(this.employees.find(e => e.id === id)!);
  }

  delete(id: string): Observable<void> {
    this.employees = this.employees.filter(e => e.id !== id);
    this.employeesSubject.next(this.employees);
    return of(undefined);
  }

  search(query: string, statut?: StatutEmploye | '', service?: string): Employee[] {
    return this.employees.filter(e => {
      const q = query.toLowerCase();
      const matchQuery = !query ||
        e.nom.toLowerCase().includes(q) ||
        e.prenom.toLowerCase().includes(q) ||
        e.matricule.toLowerCase().includes(q) ||
        e.poste.toLowerCase().includes(q) ||
        e.service.toLowerCase().includes(q);
      const matchStatut = !statut || e.statut === statut;
      const matchService = !service || e.service === service;
      return matchQuery && matchStatut && matchService;
    });
  }

  getServices(): string[] {
    return [...new Set(this.employees.map(e => e.service))].sort();
  }

  generateMatricule(): string {
    const maxNum = this.employees.reduce((max, e) => {
      const num = parseInt(e.matricule.replace('EMP-', '')) || 0;
      return Math.max(max, num);
    }, 0);
    return `EMP-${String(maxNum + 1).padStart(3, '0')}`;
  }
}
