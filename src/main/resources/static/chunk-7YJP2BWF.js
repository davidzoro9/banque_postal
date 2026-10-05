import {
  environment
} from "./chunk-FA5ALSQZ.js";
import {
  HttpClient,
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-YWFD3R2X.js";

// src/app/features/paie/services/bulletin-pdf.service.ts
var BulletinPdfService = class _BulletinPdfService {
  http;
  constructor(http) {
    this.http = http;
  }
  /**
   * Télécharge le PDF d'un bulletin existant en base par son ID
   */
  getBulletinPdf(bulletinId) {
    return this.http.get(`${environment.apiUrl}/bulletins/${bulletinId}/pdf`, {
      responseType: "blob"
    });
  }
  /**
   * Génère et télécharge le PDF à la volée (preview) à partir d'un objet Bulletin
   */
  previewBulletinPdf(dto) {
    return this.http.post(`${environment.apiUrl}/bulletins/pdf/preview`, dto, {
      responseType: "blob"
    });
  }
  /**
   * Ouvre directement le PDF officiel dans un nouvel onglet via son endpoint URL REST
   * Évite les avertissements Chrome "Insecure download blocked" causés par les URLs blob: sur HTTP
   */
  ouvrirBulletinDirect(bulletinId) {
    window.open(`${environment.apiUrl}/bulletins/${bulletinId}/pdf`, "_blank");
  }
  /**
   * Ouvre directement le Registre de Paie officiel dans un nouvel onglet via son endpoint URL REST
   */
  ouvrirRegistrePaieDirect(sessionPaieId) {
    window.open(`${environment.apiUrl}/bulletins/session/${sessionPaieId}/registre/pdf`, "_blank");
  }
  /**
   * Télécharge le Registre Général de Paie PDF d'une session par son ID
   */
  getRegistrePaiePdf(sessionPaieId) {
    return this.http.get(`${environment.apiUrl}/bulletins/session/${sessionPaieId}/registre/pdf`, {
      responseType: "blob"
    });
  }
  /**
   * Ouvre le PDF dans un nouvel onglet avec visualiseur intégré et possibilité d'impression/sauvegarde
   */
  ouvrirEtTelechargerPdf(blob, filename) {
    const file = new Blob([blob], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    const win = window.open(fileURL, "_blank");
    if (!win) {
      const a = document.createElement("a");
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
  telechargerPdfDirect(blob, filename) {
    const file = new Blob([blob], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(fileURL), 1e4);
  }
  static \u0275fac = function BulletinPdfService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BulletinPdfService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BulletinPdfService, factory: _BulletinPdfService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BulletinPdfService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  BulletinPdfService
};
//# sourceMappingURL=chunk-7YJP2BWF.js.map
