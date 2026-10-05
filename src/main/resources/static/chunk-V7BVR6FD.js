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

// src/app/features/grh/services/utilisateur.service.ts
var UtilisateurService = class _UtilisateurService {
  http;
  constructor(http) {
    this.http = http;
  }
  getAll() {
    return this.http.get(`${environment.apiUrl}/utilisateurs/all`);
  }
  create(user) {
    return this.http.post(`${environment.apiUrl}/utilisateurs/create`, user);
  }
  update(id, user) {
    return this.http.put(`${environment.apiUrl}/utilisateurs/${id}`, user);
  }
  updatePassword(id, password) {
    return this.http.put(`${environment.apiUrl}/utilisateurs/${id}/password`, { password });
  }
  delete(id) {
    return this.http.delete(`${environment.apiUrl}/utilisateurs/${id}`);
  }
  static \u0275fac = function UtilisateurService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UtilisateurService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UtilisateurService, factory: _UtilisateurService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UtilisateurService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  UtilisateurService
};
//# sourceMappingURL=chunk-V7BVR6FD.js.map
