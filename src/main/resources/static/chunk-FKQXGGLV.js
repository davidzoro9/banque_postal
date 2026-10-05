import {
  environment
} from "./chunk-FA5ALSQZ.js";
import {
  BehaviorSubject,
  HttpClient,
  Injectable,
  Subject,
  __spreadProps,
  __spreadValues,
  catchError,
  map,
  of,
  setClassMetadata,
  tap,
  throwError,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-YWFD3R2X.js";

// src/app/features/grh/employes/services/employee.service.ts
var createDefaultEmployee = (partial) => {
  return __spreadProps(__spreadValues({}, partial), {
    id: partial.id || `emp-${Date.now()}`,
    matricule: partial.matricule || "EMP-000",
    nom: partial.nom || "",
    prenom: partial.prenom || "",
    sexe: partial.sexe || "M",
    dateNaissance: partial.dateNaissance || "1990-01-01",
    lieuNaissance: partial.lieuNaissance || "Ouagadougou",
    nationalite: partial.nationalite || "Burkinab\xE8",
    numeroCNI: partial.numeroCNI || "B0000000",
    situationFamiliale: partial.situationFamiliale || partial.situationMatrimoniale || "C\xE9libataire",
    situationMatrimoniale: partial.situationFamiliale || partial.situationMatrimoniale || "C\xE9libataire",
    adresse: partial.adresse || "Ouagadougou",
    ville: partial.ville || "Ouagadougou",
    codePostal: partial.codePostal || "",
    pays: partial.pays || "Burkina Faso",
    telephone: partial.telephone || "+226 70 00 00 00",
    email: partial.email || "contact@bpbf.bf",
    contactsUrgence: partial.contactsUrgence || [],
    enfants: partial.enfants || [],
    personnesCharge: partial.personnesCharge || [],
    poste: partial.poste || "Agent Bancaire",
    fonction: partial.fonction || "Agent simple",
    service: partial.service || "Service Op\xE9rations",
    direction: partial.direction || "Direction G\xE9n\xE9rale (DG)",
    departement: partial.departement || "Direction G\xE9n\xE9rale",
    dateEmbauche: partial.dateEmbauche || "2020-01-01",
    statut: partial.statut || "Actif",
    typeContrat: partial.typeContrat || "CDI",
    categoriePro: partial.categoriePro || "CL1",
    echelon: partial.echelon || "E01",
    grade: partial.grade && !partial.grade.toUpperCase().includes("GROUPE") && !partial.grade.toUpperCase().includes("GRADE") ? partial.grade : `${partial.categoriePro || "CL1"}${partial.echelon || "E01"}`,
    niveau: partial.niveau || "Niveau 1",
    primeLogement: partial.primeLogement || 0,
    primeTransport: partial.primeTransport || 0,
    primeResponsabilite: partial.primeResponsabilite || 0,
    vehiculeFourni: partial.vehiculeFourni ?? false,
    logementFourni: partial.logementFourni ?? false,
    autresIndemnites: partial.autresIndemnites || [],
    exonerationsFiscales: partial.exonerationsFiscales || [],
    exonerationsSociales: partial.exonerationsSociales || [],
    avantagesParticuliers: partial.avantagesParticuliers || [],
    salaireBase: partial.salaireBase ?? 0,
    salaireBrut: partial.salaireBrut ?? 0,
    modePaiement: partial.modePaiement || "Virement bancaire",
    banque: partial.banque || "Banque Postale du Burkina Faso (BPBF)",
    iban: partial.iban || "",
    documents: partial.documents || [],
    observations: partial.observations || "",
    evaluations: partial.evaluations || [],
    historiqueActions: partial.historiqueActions || []
  });
};
var EmployeeService = class _EmployeeService {
  http;
  employees = [];
  employeesSubject = new BehaviorSubject([]);
  employees$ = this.employeesSubject.asObservable();
  constructor(http) {
    this.http = http;
    this.initLocalEmployees();
    this.refresh();
  }
  initLocalEmployees() {
    this.employees = [];
    this.employeesSubject.next([]);
  }
  saveToLocal() {
  }
  toBackend(emp) {
    const result = __spreadValues({}, emp);
    if (emp.ancienneteReprise !== void 0) {
      result.ancienneteReprise = Number(emp.ancienneteReprise) || 0;
    }
    const extraDataObj = {};
    if (emp.categoriePro) {
      extraDataObj.categorie = emp.categoriePro;
      extraDataObj.categoriePro = emp.categoriePro;
    }
    if (emp.echelon)
      extraDataObj.echelon = emp.echelon;
    if (emp.grade)
      extraDataObj.grade = emp.grade;
    if (emp.fonction)
      extraDataObj.fonction = emp.fonction;
    if (emp.salaireBase !== void 0)
      extraDataObj.salaireBase = emp.salaireBase;
    if (emp.primeLogement !== void 0)
      extraDataObj.primeLogement = emp.primeLogement;
    result.extraData = JSON.stringify(extraDataObj);
    result.fonction_id = emp.fonctionId ? Number(emp.fonctionId) : null;
    result.emploi_id = emp.emploiId ? Number(emp.emploiId) : null;
    result.department_id = emp.departmentId ? Number(emp.departmentId) : null;
    result.direction_id = emp.directionId ? Number(emp.directionId) : null;
    result.service_id = emp.serviceId ? Number(emp.serviceId) : null;
    result.agence_id = emp.agenceId ? Number(emp.agenceId) : null;
    result.gradeId = emp.gradeId ? Number(emp.gradeId) : null;
    result.categorieId = emp.categorieId ? Number(emp.categorieId) : null;
    result.echelonId = emp.echelonId ? Number(emp.echelonId) : null;
    result.grilleSalarialeId = emp.grilleSalarialeId ? Number(emp.grilleSalarialeId) : null;
    result.regimeSecuriteSocialId = emp.regimeSecuriteSocialId ? Number(emp.regimeSecuriteSocialId) : null;
    if (emp.superviseurId !== void 0) {
      result.superviseur_id = emp.superviseurId ? Number(emp.superviseurId) : null;
    }
    if (emp.contactsUrgence)
      result.contactsUrgenceJson = JSON.stringify(emp.contactsUrgence);
    if (emp.autresIndemnites)
      result.autresIndemnitesJson = JSON.stringify(emp.autresIndemnites);
    if (emp.exonerationsFiscales)
      result.exonerationsFiscalesJson = JSON.stringify(emp.exonerationsFiscales);
    if (emp.exonerationsSociales)
      result.exonerationsSocialesJson = JSON.stringify(emp.exonerationsSociales);
    if (emp.avantagesParticuliers)
      result.avantagesParticuliersJson = JSON.stringify(emp.avantagesParticuliers);
    if (emp.documents)
      result.documentsJson = JSON.stringify(emp.documents);
    if (emp.evaluations)
      result.evaluationsJson = JSON.stringify(emp.evaluations);
    if (emp.historiqueActions)
      result.historiqueActionsJson = JSON.stringify(emp.historiqueActions);
    delete result.contactsUrgence;
    delete result.conjoint;
    delete result.enfants;
    delete result.personnesCharge;
    delete result.autresIndemnites;
    delete result.exonerationsFiscales;
    delete result.exonerationsSociales;
    delete result.avantagesParticuliers;
    delete result.documents;
    delete result.evaluations;
    delete result.historiqueActions;
    delete result.fonctionId;
    delete result.emploiId;
    delete result.departmentId;
    delete result.directionId;
    delete result.serviceId;
    delete result.agenceId;
    delete result.regimeSecuriteSocialCode;
    delete result.regimeSecuriteSocialLibelle;
    return result;
  }
  toFrontend(db) {
    const result = __spreadValues({}, db);
    result.situationFamiliale = db.situationFamiliale || db.situationMatrimoniale || "C\xE9libataire";
    result.situationMatrimoniale = result.situationFamiliale;
    result.ancienneteReprise = db.ancienneteReprise != null ? Number(db.ancienneteReprise) : 0;
    try {
      result.contactsUrgence = db.contactsUrgenceJson ? JSON.parse(db.contactsUrgenceJson) : [];
    } catch (e) {
      result.contactsUrgence = [];
    }
    try {
      result.autresIndemnites = db.autresIndemnitesJson ? JSON.parse(db.autresIndemnitesJson) : [];
    } catch (e) {
      result.autresIndemnites = [];
    }
    try {
      result.exonerationsFiscales = db.exonerationsFiscalesJson ? JSON.parse(db.exonerationsFiscalesJson) : [];
    } catch (e) {
      result.exonerationsFiscales = [];
    }
    try {
      result.exonerationsSociales = db.exonerationsSocialesJson ? JSON.parse(db.exonerationsSocialesJson) : [];
    } catch (e) {
      result.exonerationsSociales = [];
    }
    try {
      result.avantagesParticuliers = db.avantagesParticuliersJson ? JSON.parse(db.avantagesParticuliersJson) : [];
    } catch (e) {
      result.avantagesParticuliers = [];
    }
    try {
      result.documents = db.documentsJson ? JSON.parse(db.documentsJson) : [];
    } catch (e) {
      result.documents = [];
    }
    try {
      result.evaluations = db.evaluationsJson ? JSON.parse(db.evaluationsJson) : [];
    } catch (e) {
      result.evaluations = [];
    }
    if (db.extraData) {
      try {
        const extra = typeof db.extraData === "string" ? JSON.parse(db.extraData) : db.extraData;
        if (extra.categoriePro || extra.categorie)
          result.categoriePro = extra.categoriePro || extra.categorie;
        if (extra.echelon)
          result.echelon = extra.echelon;
        if (extra.grade)
          result.grade = extra.grade;
        if (extra.fonction)
          result.fonction = extra.fonction;
        if (extra.salaireBase)
          result.salaireBase = Number(extra.salaireBase);
        if (extra.primeLogement)
          result.primeLogement = Number(extra.primeLogement);
      } catch (e) {
      }
    }
    if (result.grade && (!result.categoriePro || result.categoriePro === "CL1")) {
      const g = String(result.grade).trim();
      const eIdx = g.indexOf("E");
      if (eIdx > 0) {
        result.categoriePro = g.substring(0, eIdx);
        result.echelon = g.substring(eIdx);
      }
    }
    result.fonctionId = db.fonction_id != null ? String(db.fonction_id) : void 0;
    result.emploiId = db.emploi_id != null ? String(db.emploi_id) : void 0;
    result.departmentId = db.department_id != null ? String(db.department_id) : void 0;
    result.directionId = db.direction_id != null ? String(db.direction_id) : void 0;
    result.serviceId = db.service_id != null ? String(db.service_id) : void 0;
    result.agenceId = db.agence_id != null ? String(db.agence_id) : void 0;
    result.gradeId = db.gradeId != null ? String(db.gradeId) : void 0;
    result.categorieId = db.categorieId != null ? String(db.categorieId) : void 0;
    result.echelonId = db.echelonId != null ? String(db.echelonId) : void 0;
    result.grilleSalarialeId = db.grilleSalarialeId != null ? String(db.grilleSalarialeId) : void 0;
    result.regimeSecuriteSocialId = db.regimeSecuriteSocialId != null ? String(db.regimeSecuriteSocialId) : void 0;
    result.regimeSecuriteSocialCode = db.regimeSecuriteSocialCode || "";
    result.regimeSecuriteSocialLibelle = db.regimeSecuriteSocialLibelle || "";
    result.superviseurId = db.superviseurId != null ? String(db.superviseurId) : db.superviseur_id != null ? String(db.superviseur_id) : void 0;
    result.superviseurNom = db.superviseurNom || "";
    result.superviseurPrenom = db.superviseurPrenom || "";
    result.superviseurMatricule = db.superviseurMatricule || "";
    result.fonction = db.fonctionLibelle || result.fonction || "";
    result.poste = db.emploiLibelle || result.poste || "";
    result.service = db.serviceLibelle || result.service || "";
    result.agence = db.agenceLibelle || result.agence || "";
    result.direction = db.directionLibelle || result.direction || "";
    result.departement = db.departmentLibelle || result.departement || "";
    result.categoriePro = db.categorieLibelle || result.categoriePro || "";
    result.echelon = db.echelonLibelle || result.echelon || "";
    result.grade = db.grade || db.grilleSalarialeLibelle || result.grade || "";
    if (result.grade) {
      const romanDirectMatch = String(result.grade).trim().match(/^CL\s*(VIII|VII|VI|V|IV|III|II|I)\s*(E\d+|EX)?$/i);
      if (romanDirectMatch) {
        const romanMap = { "VIII": "8", "VII": "7", "VI": "6", "V": "5", "IV": "4", "III": "3", "II": "2", "I": "1" };
        const rNum = romanMap[romanDirectMatch[1].toUpperCase()] || romanDirectMatch[1];
        const echPart = romanDirectMatch[2] ? romanDirectMatch[2].toUpperCase() : "";
        result.grade = `CL${rNum}${echPart}`;
      }
    }
    return createDefaultEmployee(result);
  }
  getEmployeesDirect() {
    return this.employees;
  }
  refresh() {
    this.http.get(`${environment.apiUrl}/employes/all`).pipe(map((list) => list.map((item) => this.toFrontend(item)))).subscribe({
      next: (list) => {
        this.employees = list;
        this.employeesSubject.next(this.employees);
      },
      error: (err) => {
        console.error("[EmployeeService] Erreur lors du chargement des employ\xE9s:", err);
      }
    });
  }
  getAll() {
    return this.http.get(`${environment.apiUrl}/employes/all`).pipe(map((list) => list.map((item) => this.toFrontend(item))), tap((list) => {
      this.employees = list;
      this.employeesSubject.next(this.employees);
    }), catchError((err) => {
      this.employees = [];
      this.employeesSubject.next([]);
      return throwError(() => err);
    }));
  }
  getById(id) {
    return this.http.get(`${environment.apiUrl}/employes/${id}`).pipe(map((item) => this.toFrontend(item)), tap((employee) => {
      const index = this.employees.findIndex((item) => String(item.id) === String(employee.id));
      if (index >= 0) {
        this.employees[index] = employee;
      } else {
        this.employees.push(employee);
      }
      this.employeesSubject.next([...this.employees]);
    }));
  }
  getFamily(id) {
    return this.http.get(`${environment.apiUrl}/employes/${id}/famille`);
  }
  createFamilyMember(id, data) {
    return this.http.post(`${environment.apiUrl}/employes/${id}/famille`, data);
  }
  updateFamilyMember(id, memberId, data) {
    return this.http.put(`${environment.apiUrl}/employes/${id}/famille/${memberId}`, data);
  }
  deleteFamilyMember(id, memberId) {
    return this.http.delete(`${environment.apiUrl}/employes/${id}/famille/${memberId}`);
  }
  getSalaryInformation(id) {
    return this.http.get(`${environment.apiUrl}/employes/${id}/informations-salariales`);
  }
  updateSalaryInformation(id, data) {
    return this.http.put(`${environment.apiUrl}/employes/${id}/informations-salariales`, data);
  }
  recalculateSalaryInformation(id) {
    return this.http.post(`${environment.apiUrl}/employes/${id}/informations-salariales/recalculer`, null);
  }
  simulateSalary(id, salaireBase, surSalaire, ancienneteReprise) {
    const params = {};
    if (salaireBase != null)
      params["salaireBase"] = String(salaireBase);
    if (surSalaire != null)
      params["surSalaire"] = String(surSalaire);
    if (ancienneteReprise != null)
      params["ancienneteReprise"] = String(ancienneteReprise);
    return this.http.get(`${environment.apiUrl}/employes/${id}/informations-salariales/simulation`, { params });
  }
  getSalarySituation(id) {
    return this.http.get(`${environment.apiUrl}/employes/${id}/situation-salariale`);
  }
  getEmployeeIndemnities(id) {
    return this.http.get(`${environment.apiUrl}/employes/${id}/indemnites`);
  }
  toggleIndemnite(employeeId, indemniteId) {
    return this.http.put(`${environment.apiUrl}/employes/${employeeId}/indemnites/${indemniteId}/toggle`, {});
  }
  deleteIndemnite(employeeId, indemniteId) {
    return this.http.delete(`${environment.apiUrl}/employes/${employeeId}/indemnites/${indemniteId}`);
  }
  updateAvantages(id, avantages) {
    return this.http.put(`${environment.apiUrl}/employes/${id}/avantages`, avantages).pipe(map((item) => {
      const updated = this.toFrontend(item);
      this.employees = this.employees.map((e) => String(e.id) === String(id) ? updated : e);
      this.employeesSubject.next(this.employees);
      return updated;
    }));
  }
  getEmployeeExemptions(id) {
    return this.http.get(`${environment.apiUrl}/employes/${id}/exonerations`);
  }
  create(data) {
    const backendData = this.toBackend(data);
    return this.http.post(`${environment.apiUrl}/employes/create`, backendData).pipe(map((item) => {
      const emp = this.toFrontend(item);
      this.employees.unshift(emp);
      this.employeesSubject.next(this.employees);
      return emp;
    }));
  }
  update(id, data) {
    const current = this.employees.find((employee) => String(employee.id) === String(id));
    const backendData = this.toBackend(current ? __spreadValues(__spreadValues({}, current), data) : data);
    return this.http.put(`${environment.apiUrl}/employes/${id}`, backendData).pipe(map((item) => {
      const updated = this.toFrontend(item);
      this.employees = this.employees.map((e) => String(e.id) === String(id) ? updated : e);
      this.employeesSubject.next(this.employees);
      return updated;
    }));
  }
  updateSuperviseur(id, superviseurId) {
    const params = {};
    if (superviseurId != null && String(superviseurId).trim() !== "") {
      params.superviseurId = String(superviseurId);
    }
    return this.http.put(`${environment.apiUrl}/employes/${id}/superviseur`, null, { params }).pipe(map((item) => {
      const updated = this.toFrontend(item);
      this.employees = this.employees.map((e) => String(e.id) === String(id) ? updated : e);
      this.employeesSubject.next(this.employees);
      return updated;
    }));
  }
  delete(id) {
    return this.http.delete(`${environment.apiUrl}/employes/${id}`).pipe(tap(() => {
      this.employees = this.employees.filter((e) => String(e.id) !== String(id));
      this.employeesSubject.next(this.employees);
    }));
  }
  search(query, statut, service) {
    return this.employees.filter((e) => {
      const q = query.toLowerCase();
      const matchQuery = !query || e.nom.toLowerCase().includes(q) || e.prenom.toLowerCase().includes(q) || e.matricule.toLowerCase().includes(q) || e.poste && e.poste.toLowerCase().includes(q) || e.service && e.service.toLowerCase().includes(q);
      const matchStatut = !statut || e.statut === statut;
      const matchService = !service || e.service === service;
      return matchQuery && matchStatut && matchService;
    });
  }
  getServices() {
    return [...new Set(this.employees.map((e) => e.service))].filter((s) => !!s).sort();
  }
  generateMatricule() {
    const maxNum = this.employees.reduce((max, e) => {
      const num = parseInt(e.matricule.replace("EMP-", "")) || 0;
      return Math.max(max, num);
    }, 0);
    return `EMP-${String(maxNum + 1).padStart(3, "0")}`;
  }
  static \u0275fac = function EmployeeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EmployeeService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EmployeeService, factory: _EmployeeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmployeeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/donnees-base/services/db-ref.service.ts
var BACKEND_MAP = {
  "banque": {
    segment: "banques",
    getAllPath: "/all",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      description: dto.description || "",
      actif: dto.actif ?? true
    }),
    toBack: (item) => ({
      code: item.code,
      libelle: item.libelle,
      description: item.description,
      actif: item.actif
    }),
    toBackUpdate: (item) => ({
      id: item.id ? Number(item.id) : null,
      code: item.code,
      libelle: item.libelle,
      description: item.description,
      actif: item.actif
    })
  },
  "regime-securite-social": {
    segment: "regime-securite-social",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      description: dto.description || "",
      actif: dto.actif ?? true
    }),
    toBack: (item) => ({
      code: item.code,
      libelle: item.libelle,
      description: item.description,
      actif: item.actif
    }),
    toBackUpdate: (item) => ({
      id: item.id ? Number(item.id) : null,
      code: item.code,
      libelle: item.libelle,
      description: item.description,
      actif: item.actif
    })
  },
  "grille-salariale": {
    segment: "grillesalariale",
    getAllPath: "",
    toFront: (dto) => {
      const catCode = dto.categorieCode || dto.categorieLibelle || "";
      const echCode = dto.echelonCode || dto.echelonLibelle || "";
      const gradeCode = dto.gradeCode || (catCode && echCode ? `${catCode}${echCode}` : dto.gradeLibelle || "");
      return {
        id: String(dto.id),
        code: gradeCode,
        libelle: dto.gradeLibelle || gradeCode,
        categorie: catCode,
        echellon: echCode,
        grade: gradeCode,
        categorieId: dto.categorieId ? String(dto.categorieId) : void 0,
        categorieCode: dto.categorieCode || "",
        categorieLibelle: dto.categorieLibelle || "",
        echelonId: dto.echelonId ? String(dto.echelonId) : void 0,
        echelonCode: dto.echelonCode || "",
        echelonLibelle: dto.echelonLibelle || "",
        gradeId: dto.gradeId ? String(dto.gradeId) : void 0,
        gradeCode: dto.gradeCode || "",
        gradeLibelle: dto.gradeLibelle || "",
        montant: dto.basicSalary != null ? Number(dto.basicSalary) : dto.salaireBase != null ? Number(dto.salaireBase) : 0,
        description: `Base: ${dto.basicSalary || dto.salaireBase || 0}`,
        actif: true
      };
    },
    toBack: (item) => ({
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      echelonId: item.echelonId ? Number(item.echelonId) : null,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      basicSalary: item.montant || 0
    }),
    toBackUpdate: (item) => ({
      id: item.id ? Number(item.id) : null,
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      echelonId: item.echelonId ? Number(item.echelonId) : null,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      basicSalary: item.montant || 0
    })
  },
  "emploi": {
    segment: "emplois",
    getAllPath: "/all",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code || `EMP-${dto.id}`,
      libelle: dto.name || dto.libelle || dto.code || "Emploi",
      description: dto.description || "",
      ordre: dto.ordre != null ? Number(dto.ordre) : void 0,
      actif: true
    }),
    toBack: (item) => ({ code: item.code, name: item.libelle, description: item.description, ordre: item.ordre }),
    toBackUpdate: (item) => ({ id: item.id ? Number(item.id) : null, code: item.code, name: item.libelle, description: item.description, ordre: item.ordre })
  },
  "direction": {
    segment: "directions",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.name || dto.libelle,
      name: dto.name || dto.libelle,
      description: dto.description || "",
      actif: true,
      parentDirectionId: dto.parentDirectionId ? String(dto.parentDirectionId) : void 0,
      parentDirectionLibelle: dto.parentDirectionLibelle || "",
      departementId: dto.departmentId ? String(dto.departmentId) : void 0,
      departementLibelle: dto.departmentLibelle || "",
      departmentLibelle: dto.departmentLibelle || "",
      agenceId: dto.agenceId ? String(dto.agenceId) : void 0,
      agenceLibelle: dto.agenceLibelle || "",
      directeurId: dto.directeurId ? String(dto.directeurId) : void 0,
      directeurLibelle: dto.directeurLibelle || ""
    }),
    toBack: (item) => ({
      code: item.code,
      name: item.libelle || item.name,
      description: item.description,
      parentDirectionId: item.parentDirectionId ? Number(item.parentDirectionId) : null,
      departmentId: item.departementId ? Number(item.departementId) : null,
      agenceId: item.agenceId ? Number(item.agenceId) : null,
      directeurId: item.directeurId ? Number(item.directeurId) : null
    }),
    toBackUpdate: (item) => ({
      id: Number(item.id),
      code: item.code,
      name: item.libelle || item.name,
      description: item.description,
      parentDirectionId: item.parentDirectionId ? Number(item.parentDirectionId) : null,
      departmentId: item.departementId ? Number(item.departementId) : null,
      agenceId: item.agenceId ? Number(item.agenceId) : null,
      directeurId: item.directeurId ? Number(item.directeurId) : null
    })
  },
  "departement": {
    segment: "departments",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.name || dto.libelle,
      name: dto.name || dto.libelle,
      description: dto.description || "",
      actif: true,
      directeurId: dto.directeurId ? String(dto.directeurId) : void 0,
      directeurLibelle: dto.directeurLibelle || "",
      directionId: dto.directionId ? String(dto.directionId) : void 0,
      directionLibelle: dto.directionLibelle || ""
    }),
    toBack: (item) => ({
      code: item.code,
      name: item.libelle || item.name,
      description: item.description,
      directeurId: item.directeurId ? Number(item.directeurId) : null,
      directionId: item.directionId ? Number(item.directionId) : null
    }),
    toBackUpdate: (item) => ({
      id: Number(item.id),
      code: item.code,
      name: item.libelle || item.name,
      description: item.description,
      directeurId: item.directeurId ? Number(item.directeurId) : null,
      directionId: item.directionId ? Number(item.directionId) : null
    })
  },
  "service": {
    segment: "services",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.name || dto.libelle,
      name: dto.name || dto.libelle,
      description: dto.description || "",
      actif: true,
      directionId: dto.directionId ? String(dto.directionId) : void 0,
      directionLibelle: dto.directionLibelle || "",
      departementId: dto.departmentId ? String(dto.departmentId) : void 0,
      departementLibelle: dto.departmentLibelle || "",
      departmentLibelle: dto.departmentLibelle || "",
      directeurId: dto.directeurId ? String(dto.directeurId) : void 0,
      directeurLibelle: dto.directeurLibelle || ""
    }),
    toBack: (item) => ({
      code: item.code,
      name: item.libelle || item.name,
      description: item.description,
      directionId: item.directionId ? Number(item.directionId) : null,
      departmentId: item.departementId ? Number(item.departementId) : null,
      directeurId: item.directeurId ? Number(item.directeurId) : null
    }),
    toBackUpdate: (item) => ({
      id: Number(item.id),
      code: item.code,
      name: item.libelle || item.name,
      description: item.description,
      directionId: item.directionId ? Number(item.directionId) : null,
      departmentId: item.departementId ? Number(item.departementId) : null,
      directeurId: item.directeurId ? Number(item.directeurId) : null
    })
  },
  "profil": {
    segment: "ref-data/profil",
    getAllPath: "/all",
    toFront: (dto) => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || "", actif: dto.actif }),
    toBack: (item) => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif })
  },
  "ville": {
    segment: "ref-data/ville",
    getAllPath: "/all",
    toFront: (dto) => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || "", actif: dto.actif }),
    toBack: (item) => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif })
  },
  "categorie": {
    segment: "categorie",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      description: dto.description || "",
      tauxAbattement: dto.tauxAbattement ?? (["V", "VI", "VII", "VIII"].includes(dto.code) ? 20 : 25),
      actif: dto.actif ?? true
    }),
    toBack: (item) => ({ code: item.code, libelle: item.libelle, description: item.description, tauxAbattement: item.tauxAbattement, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, tauxAbattement: item.tauxAbattement, actif: item.actif })
  },
  "grade": {
    segment: "grade",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      description: dto.description || "",
      actif: dto.actif ?? true
    }),
    toBack: (item) => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif })
  },
  "echelon": {
    segment: "echelon",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      description: dto.description || "",
      actif: dto.actif ?? true
    }),
    toBack: (item) => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif })
  },
  "fonction": {
    segment: "fonctions",
    getAllPath: "/all",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code || `FCT-${dto.id}`,
      libelle: dto.name || dto.libelle || dto.code || "Fonction",
      description: dto.description || "",
      actif: dto.actif ?? true,
      typeNomination: dto.typeNomination ? dto.typeNomination : "NON_NOMMEE",
      ordre: dto.ordre != null ? Number(dto.ordre) : void 0,
      indemnites: dto.indemnites || []
    }),
    toBack: (item) => ({
      code: item.code,
      name: item.libelle,
      description: item.description || "",
      typeNomination: item.typeNomination || "NON_NOMMEE",
      ordre: item.ordre,
      actif: item.actif ?? true,
      indemnites: item.indemnites || []
    }),
    toBackUpdate: (item) => ({
      id: item.id ? Number(item.id) : null,
      code: item.code,
      name: item.libelle,
      description: item.description || "",
      typeNomination: item.typeNomination || "NON_NOMMEE",
      ordre: item.ordre,
      actif: item.actif ?? true,
      indemnites: item.indemnites || []
    })
  },
  "type-contrat": {
    segment: "typecontrat",
    getAllPath: "",
    toFront: (dto) => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: "", actif: true }),
    toBack: (item) => ({ code: item.code, name: item.libelle }),
    toBackUpdate: (item) => ({ id: item.id, code: item.code, name: item.libelle })
  },
  "type-indemnite": {
    segment: "typeindemnite",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.name,
      description: "",
      actif: dto.actif ?? true,
      tauxExoneration: dto.tauxExoneration ?? 0,
      plafondExoneration: dto.plafondExoneration ?? 0
    }),
    toBack: (item) => ({
      code: item.code,
      name: item.libelle,
      tauxExoneration: item.tauxExoneration ?? 0,
      plafondExoneration: item.plafondExoneration ?? 0,
      actif: item.actif
    }),
    toBackUpdate: (item) => ({
      id: item.id,
      code: item.code,
      name: item.libelle,
      tauxExoneration: item.tauxExoneration ?? 0,
      plafondExoneration: item.plafondExoneration ?? 0,
      actif: item.actif
    })
  },
  "param-indemnite": {
    segment: "paramindemnite",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code || `PI-${dto.id}`,
      libelle: dto.typeIndemniteLibelle || dto.typeIndemnite || dto.name || "Indemnit\xE9",
      description: `Fonction: ${dto.fonctionLibelle || "-"}, Grade: ${dto.gradeLibelle || "-"}, Cat: ${dto.categorieLibelle || "-"}`,
      actif: dto.actif ?? true,
      montant: dto.taux || dto.montant || 0,
      typeIndemniteId: dto.typeIndemniteId ? String(dto.typeIndemniteId) : void 0,
      typeIndemniteLibelle: dto.typeIndemniteLibelle || dto.typeIndemnite || dto.name || "",
      typeIndemnite: dto.typeIndemniteLibelle || dto.typeIndemnite || dto.name || "",
      fonctionId: dto.fonctionId ? String(dto.fonctionId) : void 0,
      fonctionLibelle: dto.fonctionLibelle || dto.fonction || "",
      fonction: dto.fonctionLibelle || dto.fonction || "",
      gradeId: dto.gradeId ? String(dto.gradeId) : void 0,
      gradeLibelle: dto.gradeLibelle || dto.grade || "",
      grade: dto.gradeLibelle || dto.grade || "",
      categorieId: dto.categorieId ? String(dto.categorieId) : void 0,
      categorieLibelle: dto.categorieLibelle || dto.categorie || "",
      categorie: dto.categorieLibelle || dto.categorie || "",
      emploiId: dto.emploiId ? String(dto.emploiId) : void 0,
      emploiLibelle: dto.emploiLibelle || dto.emploi || "",
      emploi: dto.emploiLibelle || dto.emploi || "",
      taux: dto.taux ?? dto.montant ?? 0,
      tauxExoneration: dto.tauxExoneration ?? 0,
      plafondExoneration: dto.plafondExoneration ?? 0,
      regleType: dto.regleType || "ORDINAIRE",
      typeNomination: dto.typeNomination || "TOUTES"
    }),
    toBack: (item) => ({
      code: item.code,
      typeIndemniteId: item.typeIndemniteId ? Number(item.typeIndemniteId) : null,
      fonctionId: item.fonctionId ? Number(item.fonctionId) : null,
      emploiId: item.emploiId ? Number(item.emploiId) : null,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      taux: item.taux ?? item.montant ?? 0,
      tauxExoneration: item.tauxExoneration ?? 0,
      plafondExoneration: item.plafondExoneration ?? 0,
      regleType: item.regleType || "ORDINAIRE",
      typeNomination: item.typeNomination || "TOUTES",
      actif: item.actif
    }),
    toBackUpdate: (item) => ({
      id: item.id,
      code: item.code,
      typeIndemniteId: item.typeIndemniteId ? Number(item.typeIndemniteId) : null,
      fonctionId: item.fonctionId ? Number(item.fonctionId) : null,
      emploiId: item.emploiId ? Number(item.emploiId) : null,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      taux: item.taux ?? item.montant ?? 0,
      tauxExoneration: item.tauxExoneration ?? 0,
      plafondExoneration: item.plafondExoneration ?? 0,
      regleType: item.regleType || "ORDINAIRE",
      typeNomination: item.typeNomination || "TOUTES",
      actif: item.actif
    })
  },
  "param-groupe": {
    segment: "paramgroupe",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      gradeId: dto.gradeId ? String(dto.gradeId) : void 0,
      gradeLibelle: dto.gradeLibelle || "",
      grade: dto.gradeLibelle || "",
      libelle: dto.gradeLibelle || dto.libelle || "",
      categorieId: dto.categorieId ? String(dto.categorieId) : void 0,
      categorieLibelle: dto.categorieLibelle || "",
      categorie: dto.categorieLibelle || "",
      description: dto.description || "",
      actif: dto.actif ?? true
    }),
    toBack: (item) => ({
      code: item.code,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      libelle: item.libelle || item.gradeLibelle || item.grade || "",
      description: item.description,
      actif: item.actif
    }),
    toBackUpdate: (item) => ({
      id: item.id,
      code: item.code,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      libelle: item.libelle || item.gradeLibelle || item.grade || "",
      description: item.description,
      actif: item.actif
    })
  },
  "param-retraite": {
    segment: "paramretraite",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      gradeId: dto.gradeId ? String(dto.gradeId) : void 0,
      gradeLibelle: dto.gradeLibelle || "",
      grade: dto.gradeLibelle || "",
      libelle: dto.gradeLibelle || dto.libelle || "",
      taux: dto.taux || 0,
      description: dto.description || "",
      actif: dto.actif ?? true
    }),
    toBack: (item) => ({
      code: item.code,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      libelle: item.libelle || item.gradeLibelle || item.grade || "",
      taux: item.taux,
      description: item.description,
      actif: item.actif
    }),
    toBackUpdate: (item) => ({
      id: item.id,
      code: item.code,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      libelle: item.libelle || item.gradeLibelle || item.grade || "",
      taux: item.taux,
      description: item.description,
      actif: item.actif
    })
  },
  "param-prise-en-charge": {
    segment: "parampriseencharge",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      taux: dto.taux || 0,
      description: dto.description || "",
      actif: dto.actif ?? true
    }),
    toBack: (item) => ({
      code: item.code,
      libelle: item.libelle,
      taux: item.taux,
      description: item.description,
      actif: item.actif
    }),
    toBackUpdate: (item) => ({
      id: item.id,
      code: item.code,
      libelle: item.libelle,
      taux: item.taux,
      description: item.description,
      actif: item.actif
    })
  },
  "type-conge": {
    segment: "typeabsenceconge",
    getAllPath: "",
    toFront: (dto) => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: "", actif: true }),
    toBack: (item) => ({ code: item.code, name: item.libelle }),
    toBackUpdate: (item) => ({ id: item.id, code: item.code, name: item.libelle })
  },
  "type-retenue-employe": {
    segment: "type-retenue",
    getAllPath: "",
    toFront: (dto) => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || "", actif: dto.actif ?? true }),
    toBack: (item) => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif })
  },
  "type-retenue-emploi": {
    segment: "type-retenue-emploi",
    getAllPath: "",
    toFront: (dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      typeRetenueId: dto.typeRetenueId ? String(dto.typeRetenueId) : void 0,
      typeRetenueLibelle: dto.typeRetenueLibelle || dto.typeRetenue || "",
      typeRetenue: dto.typeRetenueLibelle || dto.typeRetenue || "",
      regimeSecuriteSocialId: dto.regimeSecuriteSocialId ? String(dto.regimeSecuriteSocialId) : void 0,
      regimeSecuriteSocialCode: dto.regimeSecuriteSocialCode || "",
      regimeSecuriteSocialLibelle: dto.regimeSecuriteSocialLibelle || "",
      taux: dto.taux ?? 0,
      baseCalcul: dto.baseCalcul || "REMUNERATION_BRUTE",
      description: dto.description || "",
      actif: dto.actif ?? true
    }),
    toBack: (item) => ({
      code: item.code,
      libelle: item.libelle,
      typeRetenueId: item.typeRetenueId ? Number(item.typeRetenueId) : null,
      regimeSecuriteSocialId: item.regimeSecuriteSocialId ? Number(item.regimeSecuriteSocialId) : null,
      taux: item.taux,
      baseCalcul: item.baseCalcul || "REMUNERATION_BRUTE",
      description: item.description,
      actif: item.actif
    }),
    toBackUpdate: (item) => ({
      id: item.id,
      code: item.code,
      libelle: item.libelle,
      typeRetenueId: item.typeRetenueId ? Number(item.typeRetenueId) : null,
      regimeSecuriteSocialId: item.regimeSecuriteSocialId ? Number(item.regimeSecuriteSocialId) : null,
      taux: item.taux,
      baseCalcul: item.baseCalcul || "REMUNERATION_BRUTE",
      description: item.description,
      actif: item.actif
    })
  },
  "agence": {
    segment: "agences",
    getAllPath: "",
    toFront: (dto) => ({ id: String(dto.id), code: dto.codeAgence || dto.code, libelle: dto.nomAgence || dto.libelle, description: dto.ville || dto.description || "", actif: dto.actif ?? true }),
    toBack: (item) => ({ codeAgence: item.code, nomAgence: item.libelle, ville: item.description, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, codeAgence: item.code, nomAgence: item.libelle, ville: item.description, actif: item.actif })
  },
  "bareme": {
    segment: "baremes-iuts",
    getAllPath: "",
    toFront: (dto) => ({ id: String(dto.id), code: dto.codeTranche || dto.code, libelle: dto.codeTranche || dto.libelle, description: `Taux: ${dto.tauxImposition}%`, actif: dto.actif ?? true }),
    toBack: (item) => ({ codeTranche: item.code, tauxImposition: item.taux, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, codeTranche: item.code, tauxImposition: item.taux, actif: item.actif })
  },
  "rubrique": {
    segment: "rubriques-paie",
    getAllPath: "",
    toFront: (dto) => ({ id: String(dto.id), code: dto.codeRubrique || dto.code, libelle: dto.libelle, description: dto.formuleCalcul || dto.description || "", actif: dto.actif ?? true }),
    toBack: (item) => ({ codeRubrique: item.code, libelle: item.libelle, formuleCalcul: item.description, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, codeRubrique: item.code, libelle: item.libelle, formuleCalcul: item.description, actif: item.actif })
  },
  "mode-paiement": {
    segment: "modes-paiement",
    getAllPath: "",
    toFront: (dto) => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || dto.banqueNom || "", actif: dto.actif ?? true }),
    toBack: (item) => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif })
  },
  "exoneration": {
    segment: "exonerations-fiscales",
    getAllPath: "",
    toFront: (dto) => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.baseCalcul || dto.description || "", actif: dto.actif ?? true }),
    toBack: (item) => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif })
  },
  "retenue": {
    segment: "retenues-salariales",
    getAllPath: "",
    toFront: (dto) => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.typeRetenue || "", montant: dto.montantTotal, taux: dto.taux, actif: dto.actif ?? true }),
    toBack: (item) => ({ code: item.code, libelle: item.libelle, typeRetenue: item.typeRetenue, montantTotal: item.montant, taux: item.taux, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, code: item.code, libelle: item.libelle, typeRetenue: item.typeRetenue, montantTotal: item.montant, taux: item.taux, actif: item.actif })
  },
  "prise-en-charge-famille": {
    segment: "prises-en-charge-famille",
    getAllPath: "",
    toFront: (dto) => ({ id: String(dto.id), code: `${dto.nomMembre || ""}_${dto.prenomMembre || ""}`, libelle: `${dto.nomMembre || ""} ${dto.prenomMembre || ""} (${dto.lienParente || ""})`, description: `Taux: ${dto.tauxPriseEnCharge}%`, actif: dto.actif ?? true }),
    toBack: (item) => ({ nomMembre: item.code, prenomMembre: item.libelle, lienParente: item.description, actif: item.actif }),
    toBackUpdate: (item) => ({ id: item.id, nomMembre: item.code, prenomMembre: item.libelle, lienParente: item.description, actif: item.actif })
  }
};
var DbRefService = class _DbRefService {
  http;
  cache = {};
  refChanges$ = new Subject();
  constructor(http) {
    this.http = http;
  }
  getSubject(type) {
    if (!this.cache[type]) {
      this.cache[type] = new BehaviorSubject([]);
    }
    return this.cache[type];
  }
  getItems$(type) {
    this.getItems(type).subscribe();
    return this.getSubject(type).asObservable();
  }
  notifyChange(type, action, item) {
    const list = this.getCurrentItems(type);
    this.getSubject(type).next(list);
    this.refChanges$.next({ type, action, item });
  }
  // ─── Vérifie si ce type a un backend réel ─────────────────────────────────
  hasBackend(type) {
    return !!BACKEND_MAP[type];
  }
  notifyItemsUpdated(type, items) {
    this.getSubject(type).next(items);
    this.refChanges$.next({ type, action: "update", item: items && items.length > 0 ? items[0] : void 0 });
  }
  getCurrentItems(type) {
    const subject = this.getSubject(type);
    return subject.value || [];
  }
  mutationError(err, fallback) {
    const backendMessage = typeof err?.error === "string" ? err.error : err?.error?.message || err?.message;
    return new Error(backendMessage || fallback);
  }
  // ─── GET ALL ───────────────────────────────────────────────────────────────
  getItems(type) {
    const mapping = BACKEND_MAP[type];
    if (mapping) {
      const url = `${environment.apiUrl}/${mapping.segment}${mapping.getAllPath}`;
      return this.http.get(url).pipe(map((dtos) => Array.isArray(dtos) && dtos.length > 0 ? dtos.map((dto) => mapping.toFront(dto)) : []), tap((items) => {
        this.getSubject(type).next(items);
      }), catchError((err) => {
        console.warn(`[DbRefService] Backend error for "${type}":`, err.message);
        this.getSubject(type).next([]);
        return throwError(() => err);
      }));
    }
    const genericUrl = `${environment.apiUrl}/ref-data/${type}/all`;
    return this.http.get(genericUrl).pipe(map((dtos) => Array.isArray(dtos) && dtos.length > 0 ? dtos.map((dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      description: dto.description || "",
      actif: dto.actif ?? true
    })) : []), tap((items) => {
      this.getSubject(type).next(items);
    }), catchError((err) => {
      console.warn(`[DbRefService] Backend error for generic "${type}":`, err.message);
      this.getSubject(type).next([]);
      return throwError(() => err);
    }));
  }
  isSameItem(a, b, type, originalCode) {
    if (a.id && b.id && String(a.id) === String(b.id))
      return true;
    const targetCode = (originalCode || b.code || "").trim().toUpperCase();
    const aCode = (a.code || "").trim().toUpperCase();
    const bCode = (b.code || "").trim().toUpperCase();
    if (type === "grille-salariale") {
      const aCat = (a.categorie || a.code || "").trim().toUpperCase();
      const targetCat = (b.categorie || targetCode || "").trim().toUpperCase();
      const aEch = String(a.echellon || "1").trim();
      const bEch = String(b.echellon || "1").trim();
      return (aCat === targetCat || aCode === targetCode) && aEch === bEch;
    }
    if (type === "param-indemnite") {
      const aTypeInd = (a.typeIndemnite || a.libelle || "").trim().toUpperCase();
      const bTypeInd = (b.typeIndemnite || b.libelle || "").trim().toUpperCase();
      return aCode.length > 0 && (aCode === targetCode || aCode === bCode) || aTypeInd.length > 0 && aTypeInd === bTypeInd && a.grade === b.grade && a.fonction === b.fonction && a.categorie === b.categorie;
    }
    return aCode.length > 0 && (aCode === targetCode || aCode === bCode);
  }
  // ─── ADD ───────────────────────────────────────────────────────────────────
  addItem(type, item) {
    const mapping = BACKEND_MAP[type];
    const currentList = this.getCurrentItems(type);
    const addLocalState = (newItem) => {
      const newList = [...currentList.filter((i) => !this.isSameItem(i, newItem, type)), newItem];
      this.notifyItemsUpdated(type, newList);
      return newList;
    };
    if (mapping) {
      const body = mapping.toBack(item);
      const baseUrl = `${environment.apiUrl}/${mapping.segment}`;
      return this.http.post(baseUrl, body).pipe(map((dto) => mapping.toFront(dto)), map((newItem) => addLocalState(newItem)), catchError((err) => {
        if (err.status !== 404 && err.status !== 405) {
          console.error(`[DbRefService] Backend post error for ${type}:`, err);
          return throwError(() => this.mutationError(err, `Impossible d'enregistrer ${type} dans la base de donn\xE9es.`));
        }
        return this.http.post(`${baseUrl}/create`, body).pipe(map((dto) => mapping.toFront(dto)), map((newItem) => addLocalState(newItem)), catchError((err2) => {
          console.error(`[DbRefService] Backend post error for ${type}:`, err2);
          return throwError(() => this.mutationError(err2, `Impossible d'enregistrer ${type} dans la base de donn\xE9es.`));
        }));
      }));
    }
    const genericBody = {
      code: item.code,
      libelle: item.libelle,
      description: item.description || "",
      grade: item.grade || null,
      categorie: item.categorie || null,
      taux: item.taux != null ? Number(item.taux) : null,
      typeRetenue: item.typeRetenue || null,
      actif: item.actif ?? true
    };
    return this.http.post(`${environment.apiUrl}/ref-data/${type}`, genericBody).pipe(map((dto) => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      description: dto.description || "",
      grade: dto.grade,
      categorie: dto.categorie,
      taux: dto.taux,
      typeRetenue: dto.typeRetenue,
      actif: dto.actif ?? true
    })), map((newItem) => addLocalState(newItem)), catchError((err) => {
      console.error(`[DbRefService] Backend generic save error for ${type}:`, err);
      return throwError(() => this.mutationError(err, `Impossible d'enregistrer ${type} dans la base de donn\xE9es.`));
    }));
  }
  // ─── UPDATE ────────────────────────────────────────────────────────────────
  updateItem(type, originalCode, updatedItem) {
    const mapping = BACKEND_MAP[type];
    const id = updatedItem.id;
    const currentList = this.getCurrentItems(type);
    const updateLocalState = (itemToSave) => {
      let found = false;
      const newList = currentList.map((i) => {
        if (this.isSameItem(i, itemToSave, type, originalCode)) {
          found = true;
          return __spreadValues(__spreadValues({}, i), itemToSave);
        }
        return i;
      });
      const finalItems = found ? newList : [...currentList, itemToSave];
      this.notifyItemsUpdated(type, finalItems);
      return finalItems;
    };
    if (mapping && id) {
      const body = mapping.toBackUpdate(updatedItem);
      return this.http.put(`${environment.apiUrl}/${mapping.segment}/${id}`, body).pipe(map((dto) => mapping.toFront(dto)), map((updated) => updateLocalState(updated)), catchError((err) => {
        console.error(`[DbRefService] Backend update error for ${type}:`, err);
        return throwError(() => this.mutationError(err, `Impossible de modifier ${type} dans la base de donn\xE9es.`));
      }));
    }
    if (id) {
      const genericBody = {
        code: updatedItem.code,
        libelle: updatedItem.libelle,
        description: updatedItem.description || "",
        grade: updatedItem.grade || null,
        categorie: updatedItem.categorie || null,
        taux: updatedItem.taux != null ? Number(updatedItem.taux) : null,
        typeRetenue: updatedItem.typeRetenue || null,
        actif: updatedItem.actif ?? true
      };
      return this.http.put(`${environment.apiUrl}/ref-data/${type}/${id}`, genericBody).pipe(map((dto) => ({
        id: String(dto.id),
        code: dto.code,
        libelle: dto.libelle,
        description: dto.description || "",
        grade: dto.grade,
        categorie: dto.categorie,
        taux: dto.taux,
        typeRetenue: dto.typeRetenue,
        actif: dto.actif ?? true
      })), map((updated) => updateLocalState(updated)), catchError((err) => {
        console.error(`[DbRefService] Backend generic update error for ${type}:`, err);
        return throwError(() => this.mutationError(err, `Impossible de modifier ${type} dans la base de donn\xE9es.`));
      }));
    }
    return throwError(() => new Error(`Impossible de modifier ${type} : identifiant manquant.`));
  }
  // ─── DELETE ────────────────────────────────────────────────────────────────
  deleteItem(type, item) {
    const mapping = BACKEND_MAP[type];
    const subject = this.getSubject(type);
    const currentList = this.getCurrentItems(type);
    const deleteLocalState = () => {
      const newList = currentList.filter((i) => !this.isSameItem(i, item, type, item.code));
      this.notifyItemsUpdated(type, newList);
      return newList;
    };
    if (mapping && item.id) {
      return this.http.delete(`${environment.apiUrl}/${mapping.segment}/${item.id}`, { responseType: "text" }).pipe(map(() => deleteLocalState()), catchError((err) => {
        console.error(`[DbRefService] Backend delete error for ${type}:`, err);
        return throwError(() => this.mutationError(err, `Impossible de supprimer ${type} de la base de donn\xE9es.`));
      }));
    }
    if (item.id) {
      return this.http.delete(`${environment.apiUrl}/ref-data/${type}/${item.id}`, { responseType: "text" }).pipe(map(() => deleteLocalState()), catchError((err) => {
        console.error(`[DbRefService] Backend generic delete error for ${type}:`, err);
        return throwError(() => this.mutationError(err, `Impossible de supprimer ${type} de la base de donn\xE9es.`));
      }));
    }
    return throwError(() => new Error(`Impossible de supprimer ${type} : identifiant manquant.`));
  }
  // ─── TOGGLE STATUS ─────────────────────────────────────────────────────────
  toggleItemStatus(type, code) {
    const currentList = this.getCurrentItems(type);
    const item = currentList.find((i) => (i.code || "").toUpperCase() === (code || "").toUpperCase());
    if (!item)
      return of(currentList);
    const updatedItem = __spreadProps(__spreadValues({}, item), { actif: !item.actif });
    return this.updateItem(type, code, updatedItem);
  }
  getParamPriseEnCharge() {
    const list = this.getCurrentItems("param-prise-en-charge") || [];
    const stdItem = list.find((i) => i.code === "PEC-AGE-STD" && i.actif !== false);
    const etudItem = list.find((i) => i.code === "PEC-AGE-ETUD" && i.actif !== false);
    const conjItem = list.find((i) => i.code === "PEC-CONJOINT" && i.actif !== false);
    const capItem = list.find((i) => i.code === "PEC-MAX-CHRG" && i.actif !== false);
    return {
      ageMaxStd: stdItem && stdItem.taux != null ? Number(stdItem.taux) : 18,
      ageMaxEtud: etudItem && etudItem.taux != null ? Number(etudItem.taux) : 20,
      maxCap: capItem && capItem.taux != null ? Number(capItem.taux) : 4,
      conjointActif: conjItem ? conjItem.taux !== 0 && conjItem.actif !== false : true
    };
  }
  static \u0275fac = function DbRefService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DbRefService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DbRefService, factory: _DbRefService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DbRefService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  EmployeeService,
  DbRefService
};
//# sourceMappingURL=chunk-FKQXGGLV.js.map
