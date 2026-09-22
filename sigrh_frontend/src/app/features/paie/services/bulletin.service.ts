import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface BulletinLineDto {
  id?: number;
  code: string;
  libelle: string;
  typeLigne: 'GAIN' | 'RETENUE' | 'CHARGE_PATRONALE' | string;
  category?: string;
  baseCalcul?: number;
  tauxSalarial?: number;
  montantSalarial?: number;
  tauxPatronal?: number;
  montantPatronal?: number;
  montant?: number;
  imposableIuts?: boolean;
  soumisCnss?: boolean;
}

export interface BulletinDto {
  id?: number;
  sessionPaieId?: number;
  codeSession?: string;
  employeeId?: number;
  matricule?: string;
  nom?: string;
  prenom?: string;
  employeeName?: string;
  emploi?: string;
  service?: string;
  dateEmbauche?: string;
  numeroCnss?: string;
  situationMatrimoniale?: string;
  situationFamiliale?: string;
  partsFiscales?: number;
  classification?: string;
  anciennete?: number;
  ancienneteAnnees?: number;
  banque?: string;
  numeroCompteBancaire?: string;
  categorie?: string;
  echelon?: string;
  grade?: string;
  regimeSecuriteSocialLibelle?: string;
  periode?: string;
  sessionPeriode?: string;
  typeSession?: string;
  dateDebut?: string;
  dateFin?: string;
  dateFrom?: string;
  dateTo?: string;
  workedDays?: number;
  scheduledWorkingDays?: number;
  joursPresents?: number;
  salaireBase?: number;
  surSalaire?: number;
  primeAnciennete?: number;
  totalIndemnites?: number;
  salaireBrut?: number;
  baseCnss?: number;
  cotisationCnssAgent?: number;
  cotisationCarfoAgent?: number;
  cotisationCrraeAgent?: number;
  impotIUTS?: number;
  retenueFSP?: number;
  totalRetenues?: number;
  partPatronaleCnss?: number;
  partPatronaleCarfo?: number;
  partPatronaleCrrae?: number;
  totalChargesPatronales?: number;
  salaireNet?: number;
  salaireNetPrecedent?: number;
  ecartNet?: number;
  justificationEcart?: string;
  statut?: string;
  etat?: string;
  dateCalcul?: string;
  dateValidation?: string;
  lines?: BulletinLineDto[];
}

@Injectable({
  providedIn: 'root'
})
export class BulletinService {
  private readonly apiUrl = `${environment.apiUrl}/bulletins`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BulletinDto[]> {
    return this.http.get<BulletinDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<BulletinDto> {
    return this.http.get<BulletinDto>(`${this.apiUrl}/${id}`);
  }

  getBySession(sessionId: number): Observable<BulletinDto[]> {
    return this.http.get<BulletinDto[]>(`${this.apiUrl}/session/${sessionId}`);
  }

  getByEmployee(employeeId: number): Observable<BulletinDto[]> {
    return this.http.get<BulletinDto[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  saveIndividual(dto: BulletinDto): Observable<BulletinDto> {
    return this.http.post<BulletinDto>(this.apiUrl, dto);
  }

  update(id: number, dto: BulletinDto): Observable<BulletinDto> {
    return this.http.put<BulletinDto>(`${this.apiUrl}/${id}`, dto);
  }

  updateJustification(id: number, justification: string): Observable<BulletinDto> {
    return this.http.put<BulletinDto>(`${this.apiUrl}/${id}/justification`, { justification });
  }

  generateForSession(sessionId: number, employeeIds?: number[]): Observable<BulletinDto[]> {
    return this.http.post<BulletinDto[]>(`${this.apiUrl}/generer/session/${sessionId}`, employeeIds || []);
  }

  recalculerTous(): Observable<BulletinDto[]> {
    return this.http.post<BulletinDto[]>(`${this.apiUrl}/recalculer-tout`, {});
  }

  recalculerSession(sessionId: number): Observable<BulletinDto[]> {
    return this.http.post<BulletinDto[]>(`${this.apiUrl}/session/${sessionId}/recalculer`, {});
  }

  recalculerBulletin(bulletinId: number): Observable<BulletinDto> {
    return this.http.post<BulletinDto>(`${this.apiUrl}/${bulletinId}/recalculer`, {});
  }

  validateSession(sessionId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/valider/session/${sessionId}`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
