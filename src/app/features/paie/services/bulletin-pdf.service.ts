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
   * Ouvre le PDF officiel de manière authentifiée (avec jeton Bearer HTTP)
   */
  ouvrirBulletinDirect(bulletinId: number): void {
    this.getBulletinPdf(bulletinId).subscribe({
      next: (blob) => {
        this.ouvrirEtTelechargerPdf(blob, `bulletin-${bulletinId}.pdf`);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du bulletin PDF authentifié', err);
      }
    });
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
   * Ouvre le Registre de Paie officiel de manière authentifiée
   */
  ouvrirRegistrePaieDirect(sessionPaieId: number): void {
    this.getRegistrePaiePdf(sessionPaieId).subscribe({
      next: (blob) => {
        this.ouvrirEtTelechargerPdf(blob, `registre-paie-${sessionPaieId}.pdf`);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du registre PDF authentifié', err);
      }
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
    setTimeout(() => URL.revokeObjectURL(fileURL), 30000);
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
