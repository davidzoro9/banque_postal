import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BulletinPdfService {

  constructor(private http: HttpClient) {}

  /**
   * Télécharge le PDF d'un bulletin existant en base par son ID
   */
  getBulletinPdf(bulletinId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/bulletins/${bulletinId}/pdf`, {
      responseType: 'blob'
    });
  }

  /**
   * Génère et télécharge le PDF à la volée (preview) à partir d'un objet Bulletin
   */
  previewBulletinPdf(dto: any): Observable<Blob> {
    return this.http.post(`${environment.apiUrl}/bulletins/pdf/preview`, dto, {
      responseType: 'blob'
    });
  }

  /**
   * Ouvre directement le PDF officiel dans un nouvel onglet via son endpoint URL REST
   * Évite les avertissements Chrome "Insecure download blocked" causés par les URLs blob: sur HTTP
   */
  ouvrirBulletinDirect(bulletinId: number): void {
    window.open(`${environment.apiUrl}/bulletins/${bulletinId}/pdf`, '_blank');
  }

  /**
   * Ouvre directement le Registre de Paie officiel dans un nouvel onglet via son endpoint URL REST
   */
  ouvrirRegistrePaieDirect(sessionPaieId: number): void {
    window.open(`${environment.apiUrl}/bulletins/session/${sessionPaieId}/registre/pdf`, '_blank');
  }

  /**
   * Télécharge le Registre Général de Paie PDF d'une session par son ID
   */
  getRegistrePaiePdf(sessionPaieId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/bulletins/session/${sessionPaieId}/registre/pdf`, {
      responseType: 'blob'
    });
  }

  /**
   * Ouvre le PDF dans un nouvel onglet avec visualiseur intégré et possibilité d'impression/sauvegarde
   */
  ouvrirEtTelechargerPdf(blob: Blob, filename: string): void {
    const file = new Blob([blob], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    
    const win = window.open(fileURL, '_blank');
    if (!win) {
      // Si les popups sont bloquées, téléchargement direct du fichier PDF
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  /**
   * Déclenche directement le téléchargement du fichier PDF
   */
  telechargerPdfDirect(blob: Blob, filename: string): void {
    const file = new Blob([blob], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
  }
}
