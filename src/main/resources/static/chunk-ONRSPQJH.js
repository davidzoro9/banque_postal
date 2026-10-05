import {
  environment
} from "./chunk-FA5ALSQZ.js";
import {
  BehaviorSubject,
  HttpClient,
  Injectable,
  __spreadProps,
  __spreadValues,
  catchError,
  map,
  setClassMetadata,
  throwError,
  timeout,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-YWFD3R2X.js";

// src/app/core/services/auth.service.ts
var AuthService = class _AuthService {
  http;
  userSubject = new BehaviorSubject(null);
  currentUser$ = this.userSubject.asObservable();
  permissionsMatrix = [];
  constructor(http) {
    this.http = http;
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      try {
        this.userSubject.next(JSON.parse(saved));
      } catch (e) {
      }
    }
    this.loadHabilitations();
  }
  loadHabilitations() {
    this.http.get(`${environment.apiUrl}/habilitations`).subscribe({
      next: (matrix) => {
        if (matrix && matrix.length > 0) {
          this.permissionsMatrix = matrix;
          this.refreshUserPermissions();
        }
      },
      error: () => {
      }
    });
  }
  get currentUser() {
    return this.userSubject.value;
  }
  isAuthenticated() {
    return this.userSubject.value !== null;
  }
  isAgentRole(role) {
    if (!role)
      return false;
    const r = role.trim().toUpperCase();
    return r === "AGENT" || r === "EMPLOYE" || r === "EMPLOYEE" || r === "COLLABORATEUR" || r.includes("AGENT") || r.includes("EMPLOYE");
  }
  getPermissionsForRole(role) {
    const matrix = this.permissionsMatrix;
    if (Array.isArray(matrix) && matrix.length > 0) {
      const perms2 = /* @__PURE__ */ new Set();
      matrix.forEach((item) => {
        if (item.rolesAccess && item.rolesAccess[role] === true && item.actionCode) {
          perms2.add(item.actionCode);
          if (item.actionCode === "DB_VIEW")
            perms2.add("donnees-base.view");
          if (item.actionCode === "EMP_VIEW") {
            perms2.add("grh.view");
            perms2.add("carrieres.view");
          }
          if (item.actionCode === "PAIE_VIEW")
            perms2.add("paie.view");
          if (item.actionCode === "CONGE_VIEW")
            perms2.add("conges.view");
          if (item.actionCode === "MON_ESPACE_VIEW")
            perms2.add("mon-espace.view");
          if (item.actionCode === "PROFIL_EDIT" || item.actionCode === "USER_MANAGE")
            perms2.add("profils.view");
        }
      });
      return Array.from(perms2);
    }
    const perms = /* @__PURE__ */ new Set();
    if (role === "ADMIN" || role === "RH" || role === "DRH") {
      ["DB_VIEW", "DB_GRILLE_EDIT", "DB_INDEMNITE_EDIT", "DB_REF_EDIT", "EMP_VIEW", "EMP_CREATE", "EMP_EDIT", "EMP_DELETE", "PAIE_VIEW", "PAIE_VARIABLES", "PAIE_GENERATE", "PAIE_VALIDATE", "PAIE_CLOTURE", "PAIE_EXPORT", "CONGE_VIEW", "CONGE_DEMANDE", "CONGE_VALIDATE", "MON_ESPACE_VIEW", "MON_ESPACE_BULLETINS", "PROFIL_EDIT", "USER_MANAGE", "MANUAL_VIEW", "donnees-base.view", "grh.view", "carrieres.view", "paie.view", "conges.view", "mon-espace.view", "profils.view"].forEach((p) => perms.add(p));
    } else if (role === "GESTIONNAIRE_PAIE") {
      ["DB_VIEW", "DB_INDEMNITE_EDIT", "EMP_VIEW", "EMP_EDIT", "PAIE_VIEW", "PAIE_VARIABLES", "PAIE_GENERATE", "PAIE_EXPORT", "CONGE_VIEW", "CONGE_DEMANDE", "MON_ESPACE_VIEW", "MON_ESPACE_BULLETINS", "MANUAL_VIEW", "donnees-base.view", "grh.view", "paie.view", "conges.view", "mon-espace.view"].forEach((p) => perms.add(p));
    } else if (role === "VALIDATEUR") {
      ["DB_VIEW", "EMP_VIEW", "PAIE_VIEW", "PAIE_VALIDATE", "PAIE_EXPORT", "CONGE_VIEW", "CONGE_DEMANDE", "CONGE_VALIDATE", "MON_ESPACE_VIEW", "MON_ESPACE_BULLETINS", "MANUAL_VIEW", "paie.view", "conges.view", "mon-espace.view"].forEach((p) => perms.add(p));
    } else if (role === "CONSULTANT") {
      ["DB_VIEW", "EMP_VIEW", "PAIE_VIEW", "PAIE_EXPORT", "CONGE_VIEW", "MON_ESPACE_VIEW", "MANUAL_VIEW", "paie.view", "conges.view"].forEach((p) => perms.add(p));
    } else {
      ["mon-espace.view", "MON_ESPACE_VIEW", "MON_ESPACE_BULLETINS", "CONGE_VIEW", "CONGE_DEMANDE", "MANUAL_VIEW"].forEach((p) => perms.add(p));
    }
    return Array.from(perms);
  }
  refreshUserPermissions() {
    if (this.currentUser) {
      const updatedUser = __spreadProps(__spreadValues({}, this.currentUser), {
        permissions: this.getPermissionsForRole(this.currentUser.role)
      });
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      this.userSubject.next(updatedUser);
    }
  }
  login(email, password) {
    return this.http.post(`${environment.apiUrl}/utilisateurs/login`, { email, password }).pipe(timeout(4e3), map((res) => {
      const role = res.role || "EMPLOYE";
      const permissions = this.getPermissionsForRole(role);
      const user = {
        id: String(res.id),
        nom: res.nom,
        prenom: res.prenom,
        email: res.email,
        username: res.username || res.email,
        matricule: res.username,
        role,
        permissions,
        avatar: "",
        poste: role === "ADMIN" ? "Administrateur" : this.isAgentRole(role) ? "Collaborateur Salari\xE9" : role,
        department: ""
      };
      localStorage.setItem("currentUser", JSON.stringify(user));
      this.userSubject.next(user);
      return user;
    }), catchError((err) => {
      if (err.status === 401 || err.status === 403 || err.error && (err.error.message || err.error.error)) {
        const msg = err.error?.message || err.error?.error || "Identifiant ou mot de passe incorrect.";
        return throwError(() => new Error(msg));
      }
      console.error("[AuthService] Erreur de connexion au backend Spring Boot:", err);
      return throwError(() => new Error("Impossible de joindre le serveur d'authentification. Veuillez vous assurer que le backend Spring Boot est actif."));
    }));
  }
  logout() {
    localStorage.removeItem("currentUser");
    this.userSubject.next(null);
  }
  hasPermission(permission) {
    if (!this.currentUser)
      return false;
    const role = this.currentUser.role;
    const perms = this.getPermissionsForRole(role);
    return perms.includes(permission);
  }
  getInitials() {
    const user = this.currentUser;
    if (!user)
      return "?";
    return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  AuthService
};
//# sourceMappingURL=chunk-ONRSPQJH.js.map
