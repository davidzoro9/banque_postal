import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "./chunk-7YQZCKD6.js";
import {
  DbRefService,
  EmployeeService
} from "./chunk-FKQXGGLV.js";
import {
  MatTooltipModule
} from "./chunk-4WFLA3F7.js";
import {
  MatSelect,
  MatSelectModule
} from "./chunk-YW2FT4B4.js";
import "./chunk-GVHJNHWR.js";
import {
  MatFormField,
  MatFormFieldModule,
  MatInput,
  MatInputModule,
  MatLabel,
  MatSuffix
} from "./chunk-ERAYOYWZ.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  environment,
  ɵNgSelectMultipleOption
} from "./chunk-FA5ALSQZ.js";
import {
  APP_MODULES,
  ModuleNavService
} from "./chunk-RXXLECU7.js";
import {
  MatNativeDateModule
} from "./chunk-X5O3HNQ4.js";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle
} from "./chunk-FKBUH6YP.js";
import "./chunk-IY67KAVO.js";
import {
  MatOption
} from "./chunk-DODELRSD.js";
import {
  MatButton,
  MatButtonModule,
  MatIconModule
} from "./chunk-HVOECBWJ.js";
import {
  AsyncPipe,
  BehaviorSubject,
  CommonModule,
  Component,
  DatePipe,
  DecimalPipe,
  HttpClient,
  Injectable,
  NgModule,
  Router,
  RouterModule,
  __spreadProps,
  __spreadValues,
  map,
  setClassMetadata,
  tap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtextInterpolate4,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-YWFD3R2X.js";

// src/app/features/carrieres/services/carrieres.service.ts
var CarrieresService = class _CarrieresService {
  http;
  notationsSubject = new BehaviorSubject([]);
  avancementsSubject = new BehaviorSubject([]);
  reclassementsSubject = new BehaviorSubject([]);
  competencesSubject = new BehaviorSubject([]);
  catalogueSubject = new BehaviorSubject([]);
  sessionsSubject = new BehaviorSubject([]);
  evaluationsSubject = new BehaviorSubject([]);
  mobilitesSubject = new BehaviorSubject([]);
  notations$ = this.notationsSubject.asObservable();
  avancements$ = this.avancementsSubject.asObservable();
  reclassements$ = this.reclassementsSubject.asObservable();
  competences$ = this.competencesSubject.asObservable();
  catalogue$ = this.catalogueSubject.asObservable();
  sessions$ = this.sessionsSubject.asObservable();
  evaluations$ = this.evaluationsSubject.asObservable();
  mobilites$ = this.mobilitesSubject.asObservable();
  constructor(http) {
    this.http = http;
    this.refreshAll();
  }
  refreshAll() {
    this.fetchNotations().subscribe();
    this.fetchAvancements().subscribe();
    this.fetchReclassements().subscribe();
    this.fetchCompetences().subscribe();
    this.fetchCatalogue().subscribe();
    this.fetchSessions().subscribe();
    this.fetchEvaluations().subscribe();
    this.fetchMobilites().subscribe();
  }
  // --- Dashboard Stats ---
  getDashboardStats() {
    return this.http.get(`${environment.apiUrl}/carrieres/dashboard`);
  }
  // --- Notations & Évaluations de Performance ---
  fetchNotations(exercice) {
    const url = exercice ? `${environment.apiUrl}/carrieres/notations?exercice=${exercice}` : `${environment.apiUrl}/carrieres/notations`;
    return this.http.get(url).pipe(tap((list) => this.notationsSubject.next(list || [])));
  }
  saveNotation(notation) {
    return this.http.post(`${environment.apiUrl}/carrieres/notations`, notation).pipe(tap((saved) => {
      const list = this.notationsSubject.value;
      const index = list.findIndex((n) => n.id === saved.id);
      if (index >= 0) {
        list[index] = saved;
        this.notationsSubject.next([...list]);
      } else {
        this.notationsSubject.next([saved, ...list]);
      }
    }));
  }
  deleteNotation(id) {
    return this.http.delete(`${environment.apiUrl}/carrieres/notations/${id}`).pipe(tap(() => {
      this.notationsSubject.next(this.notationsSubject.value.filter((n) => n.id !== id));
    }));
  }
  // --- Avancements d'Échelon ---
  fetchAvancements(exercice) {
    const url = exercice ? `${environment.apiUrl}/carrieres/avancements?exercice=${exercice}` : `${environment.apiUrl}/carrieres/avancements`;
    return this.http.get(url).pipe(tap((list) => this.avancementsSubject.next(list || [])));
  }
  genererAvancements(exercice) {
    const url = exercice ? `${environment.apiUrl}/carrieres/avancements/generer?exercice=${exercice}` : `${environment.apiUrl}/carrieres/avancements/generer`;
    return this.http.post(url, {}).pipe(tap((list) => this.avancementsSubject.next(list || [])));
  }
  validerAvancement(id, validateur) {
    const v = validateur ? `?validateur=${encodeURIComponent(validateur)}` : "";
    return this.http.post(`${environment.apiUrl}/carrieres/avancements/${id}/valider${v}`, {}).pipe(tap((updated) => {
      const list = this.avancementsSubject.value.map((a) => a.id === id ? updated : a);
      this.avancementsSubject.next(list);
    }));
  }
  rejeterAvancement(id, motif) {
    const m = motif ? `?motif=${encodeURIComponent(motif)}` : "";
    return this.http.post(`${environment.apiUrl}/carrieres/avancements/${id}/rejeter${m}`, {}).pipe(tap((updated) => {
      const list = this.avancementsSubject.value.map((a) => a.id === id ? updated : a);
      this.avancementsSubject.next(list);
    }));
  }
  // --- Reclassements Professionnels ---
  fetchReclassements() {
    return this.http.get(`${environment.apiUrl}/carrieres/reclassements`).pipe(tap((list) => this.reclassementsSubject.next(list || [])));
  }
  saveReclassement(reclassement) {
    return this.http.post(`${environment.apiUrl}/carrieres/reclassements`, reclassement).pipe(tap((saved) => {
      this.reclassementsSubject.next([saved, ...this.reclassementsSubject.value]);
    }));
  }
  validerReclassement(id, validateur) {
    const v = validateur ? `?validateur=${encodeURIComponent(validateur)}` : "";
    return this.http.post(`${environment.apiUrl}/carrieres/reclassements/${id}/valider${v}`, {}).pipe(tap((updated) => {
      const list = this.reclassementsSubject.value.map((r) => r.id === id ? updated : r);
      this.reclassementsSubject.next(list);
    }));
  }
  // --- Competences ---
  fetchCompetences() {
    return this.http.get(`${environment.apiUrl}/carrieres/competences`).pipe(map((list) => (list || []).map((c) => this.toFrontendCompetence(c))), tap((list) => this.competencesSubject.next(list)));
  }
  addCompetence(comp) {
    const backendPayload = this.toBackendCompetence(comp);
    return this.http.post(`${environment.apiUrl}/carrieres/competences`, backendPayload).pipe(map((c) => this.toFrontendCompetence(c)), tap((newComp) => {
      this.competencesSubject.next([...this.competencesSubject.value, newComp]);
    }));
  }
  deleteCompetence(id) {
    return this.http.delete(`${environment.apiUrl}/carrieres/competences/${id}`).pipe(tap(() => {
      this.competencesSubject.next(this.competencesSubject.value.filter((c) => c.id !== id));
    }));
  }
  // --- Catalogue ---
  fetchCatalogue() {
    return this.http.get(`${environment.apiUrl}/carrieres/catalogue`).pipe(map((list) => (list || []).map((item) => ({
      id: String(item.id),
      titre: item.titre,
      description: item.description,
      duree: item.duree
    }))), tap((list) => this.catalogueSubject.next(list)));
  }
  addCourse(course) {
    return this.http.post(`${environment.apiUrl}/carrieres/catalogue`, course).pipe(map((item) => ({
      id: String(item.id),
      titre: item.titre,
      description: item.description,
      duree: item.duree
    })), tap((newCourse) => {
      this.catalogueSubject.next([...this.catalogueSubject.value, newCourse]);
    }));
  }
  // --- Sessions ---
  fetchSessions() {
    return this.http.get(`${environment.apiUrl}/carrieres/sessions`).pipe(map((list) => (list || []).map((item) => ({
      id: String(item.id),
      titre: item.titre,
      date: item.date,
      participants: item.participants,
      statut: item.statut,
      description: item.description,
      duree: item.duree
    }))), tap((list) => this.sessionsSubject.next(list)));
  }
  scheduleSession(sess) {
    return this.http.post(`${environment.apiUrl}/carrieres/sessions`, sess).pipe(map((item) => ({
      id: String(item.id),
      titre: item.titre,
      date: item.date,
      participants: item.participants,
      statut: item.statut,
      description: item.description,
      duree: item.duree
    })), tap((newSess) => {
      this.sessionsSubject.next([...this.sessionsSubject.value, newSess]);
    }));
  }
  updateSessionStatus(id, statut) {
    return this.http.patch(`${environment.apiUrl}/carrieres/sessions/${id}?statut=${statut}`, {}).pipe(map(() => {
      const list = this.sessionsSubject.value.map((s) => s.id === id ? __spreadProps(__spreadValues({}, s), { statut }) : s);
      this.sessionsSubject.next(list);
    }));
  }
  // --- Evaluations & Mobilites (Compat) ---
  fetchEvaluations() {
    return this.http.get(`${environment.apiUrl}/carrieres/evaluations`).pipe(map((list) => (list || []).map((item) => ({
      id: String(item.id),
      employeeId: String(item.employeeId),
      employeeName: item.employeeName,
      date: item.date,
      evaluateur: item.evaluateur,
      note: item.note,
      objectifs: item.objectifs,
      commentaires: item.commentaires
    }))), tap((list) => this.evaluationsSubject.next(list)));
  }
  fetchMobilites() {
    return this.http.get(`${environment.apiUrl}/carrieres/mobilites`).pipe(map((list) => (list || []).map((item) => ({
      id: String(item.id),
      employeeId: String(item.employeeId),
      employeeName: item.employeeName,
      typeMobility: item.typeMobility,
      posteCible: item.posteCible,
      serviceCible: item.serviceCible,
      dateDemande: item.dateDemande,
      commentaires: item.commentaires,
      statut: item.statut
    }))), tap((list) => this.mobilitesSubject.next(list)));
  }
  toFrontendCompetence(c) {
    return {
      id: String(c.id),
      libelle: c.libelle,
      categorie: c.categorie,
      description: c.description,
      niveaux: c.niveauxRaw ? c.niveauxRaw.split(",").map((s) => s.trim()) : []
    };
  }
  toBackendCompetence(c) {
    return {
      id: c.id ? Number(c.id) : void 0,
      libelle: c.libelle,
      categorie: c.categorie,
      description: c.description,
      niveauxRaw: c.niveaux ? c.niveaux.join(", ") : ""
    };
  }
  static \u0275fac = function CarrieresService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CarrieresService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CarrieresService, factory: _CarrieresService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarrieresService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/carrieres/carrieres-overview/carrieres-overview.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function CarrieresOverviewComponent_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "p");
    \u0275\u0275text(2, "Aucune proposition d'avancement g\xE9n\xE9r\xE9e pour le moment. Rendez-vous dans l'onglet ");
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "Avancements d'\xC9chelon");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " pour lancer la g\xE9n\xE9ration automatique.");
    \u0275\u0275elementEnd()();
  }
}
function CarrieresOverviewComponent_Conditional_60_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td")(6, "span", 21);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td")(9, "span", 22);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 20);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 23);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 24);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td")(21, "span", 25);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const a_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((a_r1.employee == null ? null : a_r1.employee.matricule) || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" \u2014 ", a_r1.employee == null ? null : a_r1.employee.nom, " ", a_r1.employee == null ? null : a_r1.employee.prenom, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((a_r1.echelonActuel == null ? null : a_r1.echelonActuel.libelle) || "E01");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((a_r1.echelonPropose == null ? null : a_r1.echelonPropose.libelle) || "E02");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(13, 15, a_r1.salaireBaseActuel, "1.0-0"), " F");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(16, 18, a_r1.salaireBasePropose, "1.0-0"), " F");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("+", \u0275\u0275pipeBind2(19, 21, a_r1.ecartSalaire, "1.0-0"), " F");
    \u0275\u0275advance(3);
    \u0275\u0275classProp("valide", a_r1.statut === "VALIDE")("propose", a_r1.statut === "PROPOSE")("rejete", a_r1.statut === "REJETE");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", a_r1.statut, " ");
  }
}
function CarrieresOverviewComponent_Conditional_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 19)(1, "thead")(2, "tr")(3, "th");
    \u0275\u0275text(4, "Matricule & Agent");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "\xC9chelon Actuel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "\xC9chelon Propos\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 20);
    \u0275\u0275text(10, "Salaire Base Actuel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 20);
    \u0275\u0275text(12, "Nouveau Salaire");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 20);
    \u0275\u0275text(14, "Gain Mensuel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Statut");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, CarrieresOverviewComponent_Conditional_60_For_19_Template, 23, 24, "tr", null, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r1.recentAvancements);
  }
}
var CarrieresOverviewComponent = class _CarrieresOverviewComponent {
  moduleNav;
  router;
  carrieresService;
  module = APP_MODULES.find((m) => m.id === "carrieres");
  stats = {
    totalEmployees: 0,
    totalNotations: 0,
    moyenneNotes: 0,
    avancementsProposes: 0,
    avancementsValides: 0,
    totalReclassements: 0
  };
  recentAvancements = [];
  recentNotations = [];
  loading = true;
  constructor(moduleNav, router, carrieresService) {
    this.moduleNav = moduleNav;
    this.router = router;
    this.carrieresService = carrieresService;
  }
  ngOnInit() {
    this.moduleNav.selectModule(this.module);
    this.loadData();
  }
  loadData() {
    this.loading = true;
    this.carrieresService.getDashboardStats().subscribe({
      next: (res) => {
        if (res)
          this.stats = res;
      },
      error: () => {
      }
    });
    this.carrieresService.fetchAvancements().subscribe({
      next: (res) => {
        this.recentAvancements = (res || []).slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
    this.carrieresService.fetchNotations().subscribe({
      next: (res) => {
        this.recentNotations = (res || []).slice(0, 5);
      },
      error: () => {
      }
    });
  }
  navigate(route) {
    this.router.navigate([route]);
  }
  static \u0275fac = function CarrieresOverviewComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CarrieresOverviewComponent)(\u0275\u0275directiveInject(ModuleNavService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(CarrieresService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CarrieresOverviewComponent, selectors: [["app-carrieres-overview"]], standalone: false, decls: 61, vars: 5, consts: [[1, "module-overview"], [1, "page-header"], [1, "ph-content"], [1, "kpi-grid"], [1, "kpi-card"], [1, "kpi-info"], [1, "kpi-value"], [1, "kpi-label"], [1, "kpi-sub"], [1, "kpi-card", "highlight"], [1, "kpi-value", "text-primary"], [1, "kpi-card", "success"], [1, "kpi-value", "text-success"], [1, "section-title"], [1, "quick-actions-row"], [1, "qa-btn", 3, "click"], [1, "table-card", "mb-4"], ["mat-button", "", "color", "primary", 3, "click"], [1, "empty-state"], [1, "data-table"], [1, "text-right"], [1, "badge-neutral"], [1, "badge-proposed"], [1, "text-right", "font-bold"], [1, "text-right", "text-success", "font-bold"], [1, "status-pill"]], template: function CarrieresOverviewComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h1");
      \u0275\u0275text(5, "Gestion des Carri\xE8res & Comp\xE9tences \u2014 Banque Postale");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p");
      \u0275\u0275text(7, "Pilotage des notations annuelles, avancements d'\xE9chelon (E01 \xE0 E15), reclassements cat\xE9goriels et plans de formation continue.");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(8, "div", 3)(9, "div", 4)(10, "div", 5)(11, "span", 6);
      \u0275\u0275text(12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "span", 7);
      \u0275\u0275text(14, "Notations Enregistr\xE9es");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "span", 8);
      \u0275\u0275text(16, "Collaborateurs \xE9valu\xE9s");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(17, "div", 4)(18, "div", 5)(19, "span", 6);
      \u0275\u0275text(20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "span", 7);
      \u0275\u0275text(22, "Moyenne Globale");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "span", 8);
      \u0275\u0275text(24, "Performance de la banque");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(25, "div", 9)(26, "div", 5)(27, "span", 10);
      \u0275\u0275text(28);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "span", 7);
      \u0275\u0275text(30, "Avancements Propos\xE9s");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "span", 8);
      \u0275\u0275text(32, "\xC9chelons n+1 en attente");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(33, "div", 11)(34, "div", 5)(35, "span", 12);
      \u0275\u0275text(36);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "span", 7);
      \u0275\u0275text(38, "Avancements Valid\xE9s");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "span", 8);
      \u0275\u0275text(40, "Pris en compte en paie");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(41, "div", 13);
      \u0275\u0275text(42, "Espaces Op\xE9rationnels");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "div", 14)(44, "button", 15);
      \u0275\u0275listener("click", function CarrieresOverviewComponent_Template_button_click_44_listener() {
        return ctx.navigate("/carrieres/evaluations");
      });
      \u0275\u0275text(45, " Notations & \xC9valuations ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "button", 15);
      \u0275\u0275listener("click", function CarrieresOverviewComponent_Template_button_click_46_listener() {
        return ctx.navigate("/carrieres/mobilite");
      });
      \u0275\u0275text(47, " Avancements d'\xC9chelon (E01-E15) ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "button", 15);
      \u0275\u0275listener("click", function CarrieresOverviewComponent_Template_button_click_48_listener() {
        return ctx.navigate("/carrieres/competences");
      });
      \u0275\u0275text(49, " Reclassements Professionnels ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "button", 15);
      \u0275\u0275listener("click", function CarrieresOverviewComponent_Template_button_click_50_listener() {
        return ctx.navigate("/carrieres/formations");
      });
      \u0275\u0275text(51, " Catalogue & Sessions Formations ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(52, "mat-card", 16)(53, "mat-card-header")(54, "mat-card-title");
      \u0275\u0275text(55, "Derni\xE8res Propositions d'Avancement d'\xC9chelon");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "button", 17);
      \u0275\u0275listener("click", function CarrieresOverviewComponent_Template_button_click_56_listener() {
        return ctx.navigate("/carrieres/mobilite");
      });
      \u0275\u0275text(57, " Voir tous les avancements ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(58, "mat-card-content");
      \u0275\u0275conditionalCreate(59, CarrieresOverviewComponent_Conditional_59_Template, 6, 0, "div", 18)(60, CarrieresOverviewComponent_Conditional_60_Template, 20, 0, "table", 19);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(12);
      \u0275\u0275textInterpolate(ctx.stats.totalNotations);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate1("", ctx.stats.moyenneNotes, " / 20");
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.stats.avancementsProposes);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.stats.avancementsValides);
      \u0275\u0275advance(23);
      \u0275\u0275conditional(ctx.recentAvancements.length === 0 ? 59 : 60);
    }
  }, dependencies: [MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatButton, DecimalPipe], styles: ["\n\n.module-overview[_ngcontent-%COMP%] {\n  max-width: 1300px;\n  margin: 0 auto;\n  padding: 20px;\n}\n.page-header[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  padding: 20px 24px;\n  background: var(--surface, #ffffff);\n  color: var(--on-surface, #1e293b);\n  border: 1px solid var(--border, #e2e8f0);\n  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.08));\n  margin-bottom: 24px;\n}\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 700;\n  margin: 0 0 4px;\n  color: #003366;\n}\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n}\n.kpi-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 16px;\n  margin-bottom: 24px;\n}\n@media (max-width: 900px) {\n  .kpi-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 600px) {\n  .kpi-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.kpi-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  padding: 18px 20px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.kpi-card.highlight[_ngcontent-%COMP%] {\n  border-left: 4px solid #0060B3;\n}\n.kpi-card.success[_ngcontent-%COMP%] {\n  border-left: 4px solid #16a34a;\n}\n.kpi-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.kpi-value[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 800;\n  color: #1e293b;\n}\n.kpi-value.text-primary[_ngcontent-%COMP%] {\n  color: #0060B3;\n}\n.kpi-value.text-success[_ngcontent-%COMP%] {\n  color: #16a34a;\n}\n.kpi-label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  color: #475569;\n}\n.kpi-sub[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #94a3b8;\n}\n.section-title[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 700;\n  color: #475569;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  margin-bottom: 12px;\n}\n.quick-actions-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  flex-wrap: wrap;\n  margin-bottom: 24px;\n}\n.qa-btn[_ngcontent-%COMP%] {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  padding: 10px 18px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  box-shadow: 0 2px 4px rgba(0, 96, 179, 0.2);\n}\n.qa-btn[_ngcontent-%COMP%]:hover {\n  background: #004885;\n  transform: translateY(-1px);\n}\n.table-card[_ngcontent-%COMP%] {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  background: #ffffff !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  margin-bottom: 24px;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%] {\n  padding: 16px 20px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid #f1f5f9;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  padding: 0 !important;\n  overflow-x: auto;\n}\n.data-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  text-align: left;\n  padding: 12px 20px;\n  font-weight: 600;\n  color: #64748b;\n  font-size: 12px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.data-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 14px 20px;\n  color: #1e293b;\n  border-bottom: 1px solid #f1f5f9;\n}\n.data-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: none;\n}\n.data-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] {\n  background: #f8fafc;\n}\n.text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.font-bold[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.text-success[_ngcontent-%COMP%] {\n  color: #16a34a;\n}\n.badge-neutral[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 3px 8px;\n  background: #f1f5f9;\n  color: #475569;\n  font-weight: 700;\n  border-radius: 6px;\n  font-size: 12px;\n}\n.badge-proposed[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 3px 8px;\n  background: #e0f2fe;\n  color: #0284c7;\n  font-weight: 700;\n  border-radius: 6px;\n  font-size: 12px;\n}\n.status-pill[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 20px;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.status-pill.propose[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #d97706;\n}\n.status-pill.valide[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.status-pill.rejete[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.empty-state[_ngcontent-%COMP%] {\n  padding: 36px 20px;\n  text-align: center;\n  color: #64748b;\n  font-size: 14px;\n}\n/*# sourceMappingURL=carrieres-overview.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarrieresOverviewComponent, [{
    type: Component,
    args: [{ selector: "app-carrieres-overview", standalone: false, template: `<div class="module-overview">
  <div class="page-header">
    <div class="ph-content">
      <div>
        <h1>Gestion des Carri\xE8res & Comp\xE9tences \u2014 Banque Postale</h1>
        <p>Pilotage des notations annuelles, avancements d'\xE9chelon (E01 \xE0 E15), reclassements cat\xE9goriels et plans de formation continue.</p>
      </div>
    </div>
  </div>

  <!-- KPI Grid (Real Data from PostgreSQL) -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-info">
        <span class="kpi-value">{{ stats.totalNotations }}</span>
        <span class="kpi-label">Notations Enregistr\xE9es</span>
        <span class="kpi-sub">Collaborateurs \xE9valu\xE9s</span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-info">
        <span class="kpi-value">{{ stats.moyenneNotes }} / 20</span>
        <span class="kpi-label">Moyenne Globale</span>
        <span class="kpi-sub">Performance de la banque</span>
      </div>
    </div>

    <div class="kpi-card highlight">
      <div class="kpi-info">
        <span class="kpi-value text-primary">{{ stats.avancementsProposes }}</span>
        <span class="kpi-label">Avancements Propos\xE9s</span>
        <span class="kpi-sub">\xC9chelons n+1 en attente</span>
      </div>
    </div>

    <div class="kpi-card success">
      <div class="kpi-info">
        <span class="kpi-value text-success">{{ stats.avancementsValides }}</span>
        <span class="kpi-label">Avancements Valid\xE9s</span>
        <span class="kpi-sub">Pris en compte en paie</span>
      </div>
    </div>
  </div>

  <!-- Quick Action Navigation Links -->
  <div class="section-title">Espaces Op\xE9rationnels</div>
  <div class="quick-actions-row">
    <button class="qa-btn" (click)="navigate('/carrieres/evaluations')">
      Notations & \xC9valuations
    </button>
    <button class="qa-btn" (click)="navigate('/carrieres/mobilite')">
      Avancements d'\xC9chelon (E01-E15)
    </button>
    <button class="qa-btn" (click)="navigate('/carrieres/competences')">
      Reclassements Professionnels
    </button>
    <button class="qa-btn" (click)="navigate('/carrieres/formations')">
      Catalogue & Sessions Formations
    </button>
  </div>

  <!-- Recent Promotions Table -->
  <mat-card class="table-card mb-4">
    <mat-card-header>
      <mat-card-title>Derni\xE8res Propositions d'Avancement d'\xC9chelon</mat-card-title>
      <button mat-button color="primary" (click)="navigate('/carrieres/mobilite')">
        Voir tous les avancements
      </button>
    </mat-card-header>
    <mat-card-content>
      @if (recentAvancements.length === 0) {
        <div class="empty-state">
          <p>Aucune proposition d'avancement g\xE9n\xE9r\xE9e pour le moment. Rendez-vous dans l'onglet <strong>Avancements d'\xC9chelon</strong> pour lancer la g\xE9n\xE9ration automatique.</p>
        </div>
      } @else {
        <table class="data-table">
          <thead>
            <tr>
              <th>Matricule & Agent</th>
              <th>\xC9chelon Actuel</th>
              <th>\xC9chelon Propos\xE9</th>
              <th class="text-right">Salaire Base Actuel</th>
              <th class="text-right">Nouveau Salaire</th>
              <th class="text-right">Gain Mensuel</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            @for (a of recentAvancements; track a.id) {
              <tr>
                <td>
                  <strong>{{ a.employee?.matricule || '\u2014' }}</strong> \u2014 {{ a.employee?.nom }} {{ a.employee?.prenom }}
                </td>
                <td><span class="badge-neutral">{{ a.echelonActuel?.libelle || 'E01' }}</span></td>
                <td><span class="badge-proposed">{{ a.echelonPropose?.libelle || 'E02' }}</span></td>
                <td class="text-right">{{ a.salaireBaseActuel | number:'1.0-0' }} F</td>
                <td class="text-right font-bold">{{ a.salaireBasePropose | number:'1.0-0' }} F</td>
                <td class="text-right text-success font-bold">+{{ a.ecartSalaire | number:'1.0-0' }} F</td>
                <td>
                  <span class="status-pill" [class.valide]="a.statut === 'VALIDE'" [class.propose]="a.statut === 'PROPOSE'" [class.rejete]="a.statut === 'REJETE'">
                    {{ a.statut }}
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </mat-card-content>
  </mat-card>
</div>
`, styles: ["/* src/app/features/carrieres/carrieres-overview/carrieres-overview.component.scss */\n.module-overview {\n  max-width: 1300px;\n  margin: 0 auto;\n  padding: 20px;\n}\n.page-header {\n  border-radius: 12px;\n  padding: 20px 24px;\n  background: var(--surface, #ffffff);\n  color: var(--on-surface, #1e293b);\n  border: 1px solid var(--border, #e2e8f0);\n  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.08));\n  margin-bottom: 24px;\n}\n.page-header h1 {\n  font-size: 20px;\n  font-weight: 700;\n  margin: 0 0 4px;\n  color: #003366;\n}\n.page-header p {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n}\n.kpi-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 16px;\n  margin-bottom: 24px;\n}\n@media (max-width: 900px) {\n  .kpi-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 600px) {\n  .kpi-grid {\n    grid-template-columns: 1fr;\n  }\n}\n.kpi-card {\n  border-radius: 12px;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  padding: 18px 20px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.kpi-card.highlight {\n  border-left: 4px solid #0060B3;\n}\n.kpi-card.success {\n  border-left: 4px solid #16a34a;\n}\n.kpi-info {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.kpi-value {\n  font-size: 24px;\n  font-weight: 800;\n  color: #1e293b;\n}\n.kpi-value.text-primary {\n  color: #0060B3;\n}\n.kpi-value.text-success {\n  color: #16a34a;\n}\n.kpi-label {\n  font-size: 13px;\n  font-weight: 600;\n  color: #475569;\n}\n.kpi-sub {\n  font-size: 11px;\n  color: #94a3b8;\n}\n.section-title {\n  font-size: 13px;\n  font-weight: 700;\n  color: #475569;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  margin-bottom: 12px;\n}\n.quick-actions-row {\n  display: flex;\n  gap: 12px;\n  flex-wrap: wrap;\n  margin-bottom: 24px;\n}\n.qa-btn {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  padding: 10px 18px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  box-shadow: 0 2px 4px rgba(0, 96, 179, 0.2);\n}\n.qa-btn:hover {\n  background: #004885;\n  transform: translateY(-1px);\n}\n.table-card {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  background: #ffffff !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  margin-bottom: 24px;\n}\n.table-card mat-card-header {\n  padding: 16px 20px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid #f1f5f9;\n}\n.table-card mat-card-title {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.table-card mat-card-content {\n  padding: 0 !important;\n  overflow-x: auto;\n}\n.data-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.data-table th {\n  text-align: left;\n  padding: 12px 20px;\n  font-weight: 600;\n  color: #64748b;\n  font-size: 12px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.data-table td {\n  padding: 14px 20px;\n  color: #1e293b;\n  border-bottom: 1px solid #f1f5f9;\n}\n.data-table tr:last-child td {\n  border-bottom: none;\n}\n.data-table tr:hover td {\n  background: #f8fafc;\n}\n.text-right {\n  text-align: right;\n}\n.font-bold {\n  font-weight: 700;\n}\n.text-success {\n  color: #16a34a;\n}\n.badge-neutral {\n  display: inline-block;\n  padding: 3px 8px;\n  background: #f1f5f9;\n  color: #475569;\n  font-weight: 700;\n  border-radius: 6px;\n  font-size: 12px;\n}\n.badge-proposed {\n  display: inline-block;\n  padding: 3px 8px;\n  background: #e0f2fe;\n  color: #0284c7;\n  font-weight: 700;\n  border-radius: 6px;\n  font-size: 12px;\n}\n.status-pill {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 20px;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.status-pill.propose {\n  background: #fef3c7;\n  color: #d97706;\n}\n.status-pill.valide {\n  background: #dcfce7;\n  color: #15803d;\n}\n.status-pill.rejete {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.empty-state {\n  padding: 36px 20px;\n  text-align: center;\n  color: #64748b;\n  font-size: 14px;\n}\n/*# sourceMappingURL=carrieres-overview.component.css.map */\n"] }]
  }], () => [{ type: ModuleNavService }, { type: Router }, { type: CarrieresService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CarrieresOverviewComponent, { className: "CarrieresOverviewComponent", filePath: "src/app/features/carrieres/carrieres-overview/carrieres-overview.component.ts", lineNumber: 13 });
})();

// src/app/features/carrieres/competences/competences.component.ts
var _forTrack02 = ($index, $item) => $item.id;
function CompetencesComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function CompetencesComponent_Conditional_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showReclassementForm = !ctx_r1.showReclassementForm);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.showReclassementForm ? "Fermer le formulaire" : "Nouveau Reclassement", " ");
  }
}
function CompetencesComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function CompetencesComponent_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showCompForm = !ctx_r1.showCompForm);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.showCompForm ? "Fermer" : "Ajouter une Comp\xE9tence", " ");
  }
}
function CompetencesComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.messageFeedback, " ");
  }
}
function CompetencesComponent_Conditional_24_Conditional_0_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emp_r5 = ctx.$implicit;
    \u0275\u0275property("value", emp_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate4(" ", emp_r5.matricule, " \u2014 ", emp_r5.nom, " ", emp_r5.prenom, " (", emp_r5.fonction || "Agent", ") ");
  }
}
function CompetencesComponent_Conditional_24_Conditional_0_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r6 = ctx.$implicit;
    \u0275\u0275property("value", m_r6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r6);
  }
}
function CompetencesComponent_Conditional_24_Conditional_0_For_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r7 = ctx.$implicit;
    \u0275\u0275property("value", cat_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", cat_r7.code, " \u2014 ", cat_r7.libelle);
  }
}
function CompetencesComponent_Conditional_24_Conditional_0_For_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const gr_r8 = ctx.$implicit;
    \u0275\u0275property("value", gr_r8.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", gr_r8.code, " \u2014 ", gr_r8.libelle);
  }
}
function CompetencesComponent_Conditional_24_Conditional_0_For_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ech_r9 = ctx.$implicit;
    \u0275\u0275property("value", ech_r9.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ech_r9.libelle || ech_r9.code);
  }
}
function CompetencesComponent_Conditional_24_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 13)(1, "mat-card-header")(2, "mat-card-title");
    \u0275\u0275text(3, "Acter un Reclassement Professionnel");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "mat-card-content")(5, "div", 15)(6, "mat-form-field", 16)(7, "mat-label");
    \u0275\u0275text(8, "Collaborateur concern\xE9 *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "mat-select", 17);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_24_Conditional_0_Template_mat_select_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newReclassement.employeeId, $event) || (ctx_r1.newReclassement.employeeId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("selectionChange", function CompetencesComponent_Conditional_24_Conditional_0_Template_mat_select_selectionChange_9_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSelectEmployee($event.value));
    });
    \u0275\u0275repeaterCreate(10, CompetencesComponent_Conditional_24_Conditional_0_For_11_Template, 2, 5, "mat-option", 18, _forTrack02);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "mat-form-field", 16)(13, "mat-label");
    \u0275\u0275text(14, "R\xE9f\xE9rence de l'Acte D\xE9cisionnel *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "input", 19);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_24_Conditional_0_Template_input_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newReclassement.referenceActe, $event) || (ctx_r1.newReclassement.referenceActe = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "mat-form-field", 16)(17, "mat-label");
    \u0275\u0275text(18, "Motif du Reclassement *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "mat-select", 20);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_24_Conditional_0_Template_mat_select_ngModelChange_19_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newReclassement.motif, $event) || (ctx_r1.newReclassement.motif = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(20, CompetencesComponent_Conditional_24_Conditional_0_For_21_Template, 2, 2, "mat-option", 18, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "mat-form-field", 16)(23, "mat-label");
    \u0275\u0275text(24, "Date d'Effet *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "input", 21);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_24_Conditional_0_Template_input_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newReclassement.dateEffet, $event) || (ctx_r1.newReclassement.dateEffet = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "div", 22)(27, "div", 23)(28, "h3");
    \u0275\u0275text(29, "Situation Actuelle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "p")(31, "strong");
    \u0275\u0275text(32, "Cat\xE9gorie :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "p")(35, "strong");
    \u0275\u0275text(36, "Grade :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "p")(39, "strong");
    \u0275\u0275text(40, "\xC9chelon :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "p")(43, "strong");
    \u0275\u0275text(44, "Salaire Base Actuel :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(45);
    \u0275\u0275pipe(46, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 24)(48, "h3");
    \u0275\u0275text(49, "Nouvelle Situation Reclass\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "div", 25)(51, "mat-form-field", 26)(52, "mat-label");
    \u0275\u0275text(53, "Nouvelle Cat\xE9gorie *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "mat-select", 20);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_24_Conditional_0_Template_mat_select_ngModelChange_54_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newReclassement.categorieNouvelleId, $event) || (ctx_r1.newReclassement.categorieNouvelleId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(55, CompetencesComponent_Conditional_24_Conditional_0_For_56_Template, 2, 3, "mat-option", 18, _forTrack02);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "mat-form-field", 26)(58, "mat-label");
    \u0275\u0275text(59, "Nouveau Grade / Groupe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "mat-select", 20);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_24_Conditional_0_Template_mat_select_ngModelChange_60_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newReclassement.gradeNouveauId, $event) || (ctx_r1.newReclassement.gradeNouveauId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(61, CompetencesComponent_Conditional_24_Conditional_0_For_62_Template, 2, 3, "mat-option", 18, _forTrack02);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "mat-form-field", 26)(64, "mat-label");
    \u0275\u0275text(65, "Nouvel \xC9chelon *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "mat-select", 20);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_24_Conditional_0_Template_mat_select_ngModelChange_66_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newReclassement.echelonNouveauId, $event) || (ctx_r1.newReclassement.echelonNouveauId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(67, CompetencesComponent_Conditional_24_Conditional_0_For_68_Template, 2, 2, "mat-option", 18, _forTrack02);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(69, "mat-form-field", 26)(70, "mat-label");
    \u0275\u0275text(71, "Nouveau Salaire de Base Sp\xE9cifique (FCFA)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "input", 27);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_24_Conditional_0_Template_input_ngModelChange_72_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newReclassement.salaireBaseNouveau, $event) || (ctx_r1.newReclassement.salaireBaseNouveau = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(73, "div", 28)(74, "mat-form-field", 26)(75, "mat-label");
    \u0275\u0275text(76, "Observations & Commentaires");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "textarea", 29);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_24_Conditional_0_Template_textarea_ngModelChange_77_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newReclassement.observations, $event) || (ctx_r1.newReclassement.observations = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(78, "div", 30)(79, "button", 31);
    \u0275\u0275listener("click", function CompetencesComponent_Conditional_24_Conditional_0_Template_button_click_79_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showReclassementForm = false);
    });
    \u0275\u0275text(80, "Annuler");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(81, "button", 32);
    \u0275\u0275listener("click", function CompetencesComponent_Conditional_24_Conditional_0_Template_button_click_81_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveReclassement());
    });
    \u0275\u0275text(82);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newReclassement.employeeId);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.employees);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newReclassement.referenceActe);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newReclassement.motif);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.motifsList);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newReclassement.dateEffet);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", (ctx_r1.selectedEmpForReclass == null ? null : ctx_r1.selectedEmpForReclass.categoriePro) || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", (ctx_r1.selectedEmpForReclass == null ? null : ctx_r1.selectedEmpForReclass.grade) || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", (ctx_r1.selectedEmpForReclass == null ? null : ctx_r1.selectedEmpForReclass.echelon) || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(46, 15, (ctx_r1.selectedEmpForReclass == null ? null : ctx_r1.selectedEmpForReclass.salaireBase) || 0, "1.0-0"), " F CFA");
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newReclassement.categorieNouvelleId);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.categories);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newReclassement.gradeNouveauId);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.grades);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newReclassement.echelonNouveauId);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.echelons);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newReclassement.salaireBaseNouveau);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newReclassement.observations);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r1.newReclassement.employeeId || !ctx_r1.newReclassement.referenceActe.trim() || ctx_r1.savingReclassement);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.savingReclassement ? "Application..." : "Valider & Appliquer le Reclassement", " ");
  }
}
function CompetencesComponent_Conditional_24_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "p");
    \u0275\u0275text(2, "Aucun reclassement enregistr\xE9 dans PostgreSQL. Utilisez le bouton ");
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "Nouveau Reclassement");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " pour acter une promotion cat\xE9gorielle.");
    \u0275\u0275elementEnd()();
  }
}
function CompetencesComponent_Conditional_24_Conditional_6_Conditional_1_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td")(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "br");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td")(12, "span", 35);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td")(15, "span", 36);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td")(18, "span", 37);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td")(21, "span", 38);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r10 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r10.referenceActe || "D\xE9cision DRH");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r10.dateEffet);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((r_r10.employee == null ? null : r_r10.employee.matricule) || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", r_r10.employee == null ? null : r_r10.employee.nom, " ", r_r10.employee == null ? null : r_r10.employee.prenom, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3(" ", (r_r10.categorieAncienne == null ? null : r_r10.categorieAncienne.libelle) || (r_r10.categorieAncienne == null ? null : r_r10.categorieAncienne.code) || "Cat 1", " / ", (r_r10.gradeAncien == null ? null : r_r10.gradeAncien.libelle) || "Grp 1", " / ", (r_r10.echelonAncien == null ? null : r_r10.echelonAncien.libelle) || "E01", " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3(" ", (r_r10.categorieNouvelle == null ? null : r_r10.categorieNouvelle.libelle) || (r_r10.categorieNouvelle == null ? null : r_r10.categorieNouvelle.code) || "Cat 2", " / ", (r_r10.gradeNouveau == null ? null : r_r10.gradeNouveau.libelle) || "Grp 2", " / ", (r_r10.echelonNouveau == null ? null : r_r10.echelonNouveau.libelle) || "E01", " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r10.motif || "Dipl\xF4me");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r10.statut);
  }
}
function CompetencesComponent_Conditional_24_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 34)(1, "thead")(2, "tr")(3, "th");
    \u0275\u0275text(4, "R\xE9f. Acte D\xE9cisionnel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Date Effet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Agent & Matricule");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Ancienne Situation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Nouvelle Situation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Motif");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Statut");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, CompetencesComponent_Conditional_24_Conditional_6_Conditional_1_For_19_Template, 23, 13, "tr", null, _forTrack02);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const reclassements_r11 = \u0275\u0275nextContext();
    \u0275\u0275advance(18);
    \u0275\u0275repeater(reclassements_r11);
  }
}
function CompetencesComponent_Conditional_24_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CompetencesComponent_Conditional_24_Conditional_6_Conditional_0_Template, 6, 0, "div", 33)(1, CompetencesComponent_Conditional_24_Conditional_6_Conditional_1_Template, 20, 0, "table", 34);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.length === 0 ? 0 : 1);
  }
}
function CompetencesComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CompetencesComponent_Conditional_24_Conditional_0_Template, 83, 18, "mat-card", 13);
    \u0275\u0275elementStart(1, "mat-card", 14)(2, "mat-card-header")(3, "mat-card-title");
    \u0275\u0275text(4, "Historique des Reclassements et D\xE9cisions");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "mat-card-content");
    \u0275\u0275conditionalCreate(6, CompetencesComponent_Conditional_24_Conditional_6_Template, 2, 1);
    \u0275\u0275pipe(7, "async");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.showReclassementForm ? 0 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional((tmp_2_0 = \u0275\u0275pipeBind1(7, 2, ctx_r1.reclassements$)) ? 6 : -1, tmp_2_0);
  }
}
function CompetencesComponent_Conditional_25_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 13)(1, "mat-card-header")(2, "mat-card-title");
    \u0275\u0275text(3, "Ajouter une Comp\xE9tence M\xE9tier Bancaire");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "mat-card-content")(5, "div", 39)(6, "mat-form-field", 16)(7, "mat-label");
    \u0275\u0275text(8, "Libell\xE9 de la comp\xE9tence *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 40);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_25_Conditional_0_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newComp.libelle, $event) || (ctx_r1.newComp.libelle = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "mat-form-field", 16)(11, "mat-label");
    \u0275\u0275text(12, "Famille / Cat\xE9gorie *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "mat-select", 20);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_25_Conditional_0_Template_mat_select_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newComp.categorie, $event) || (ctx_r1.newComp.categorie = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(14, "mat-option", 41);
    \u0275\u0275text(15, "Technique / M\xE9tier Bancaire");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "mat-option", 42);
    \u0275\u0275text(17, "Management & Pilotage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "mat-option", 43);
    \u0275\u0275text(19, "Soft Skills & Relation Client");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "mat-option", 44);
    \u0275\u0275text(21, "Organisation & Conformit\xE9");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(22, "mat-form-field", 26)(23, "mat-label");
    \u0275\u0275text(24, "Description & Crit\xE8res de Ma\xEEtrise");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "textarea", 45);
    \u0275\u0275twoWayListener("ngModelChange", function CompetencesComponent_Conditional_25_Conditional_0_Template_textarea_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newComp.description, $event) || (ctx_r1.newComp.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 30)(27, "button", 31);
    \u0275\u0275listener("click", function CompetencesComponent_Conditional_25_Conditional_0_Template_button_click_27_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showCompForm = false);
    });
    \u0275\u0275text(28, "Annuler");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "button", 32);
    \u0275\u0275listener("click", function CompetencesComponent_Conditional_25_Conditional_0_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addComp());
    });
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newComp.libelle);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newComp.categorie);
    \u0275\u0275advance(12);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newComp.description);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r1.newComp.libelle.trim() || ctx_r1.savingComp);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.savingComp ? "Enregistrement..." : "Enregistrer la Comp\xE9tence", " ");
  }
}
function CompetencesComponent_Conditional_25_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "p");
    \u0275\u0275text(2, "Aucune comp\xE9tence r\xE9f\xE9renc\xE9e. Cliquez sur ");
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "Ajouter une Comp\xE9tence");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " pour enrichir le r\xE9f\xE9rentiel.");
    \u0275\u0275elementEnd()();
  }
}
function CompetencesComponent_Conditional_25_Conditional_6_Conditional_1_For_15_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const lvl_r14 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(lvl_r14);
  }
}
function CompetencesComponent_Conditional_25_Conditional_6_Conditional_1_For_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "span", 37);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td")(10, "div", 47);
    \u0275\u0275repeaterCreate(11, CompetencesComponent_Conditional_25_Conditional_6_Conditional_1_For_15_For_12_Template, 2, 1, "span", 48, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td", 46)(14, "button", 49);
    \u0275\u0275listener("click", function CompetencesComponent_Conditional_25_Conditional_6_Conditional_1_For_15_Template_button_click_14_listener() {
      const c_r15 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.deleteComp(c_r15.id));
    });
    \u0275\u0275text(15, "Supprimer");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const c_r15 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r15.libelle);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r15.categorie);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r15.description || "\u2014");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(c_r15.niveaux);
  }
}
function CompetencesComponent_Conditional_25_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 34)(1, "thead")(2, "tr")(3, "th");
    \u0275\u0275text(4, "Comp\xE9tence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Famille");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Niveaux");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 46);
    \u0275\u0275text(12, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "tbody");
    \u0275\u0275repeaterCreate(14, CompetencesComponent_Conditional_25_Conditional_6_Conditional_1_For_15_Template, 16, 3, "tr", null, _forTrack02);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const compList_r16 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275repeater(compList_r16);
  }
}
function CompetencesComponent_Conditional_25_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CompetencesComponent_Conditional_25_Conditional_6_Conditional_0_Template, 6, 0, "div", 33)(1, CompetencesComponent_Conditional_25_Conditional_6_Conditional_1_Template, 16, 0, "table", 34);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.length === 0 ? 0 : 1);
  }
}
function CompetencesComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CompetencesComponent_Conditional_25_Conditional_0_Template, 31, 5, "mat-card", 13);
    \u0275\u0275elementStart(1, "mat-card", 14)(2, "mat-card-header")(3, "mat-card-title");
    \u0275\u0275text(4, "R\xE9f\xE9rentiel des Comp\xE9tences");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "mat-card-content");
    \u0275\u0275conditionalCreate(6, CompetencesComponent_Conditional_25_Conditional_6_Template, 2, 1);
    \u0275\u0275pipe(7, "async");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.showCompForm ? 0 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional((tmp_2_0 = \u0275\u0275pipeBind1(7, 2, ctx_r1.competences$)) ? 6 : -1, tmp_2_0);
  }
}
var CompetencesComponent = class _CompetencesComponent {
  carrieresService;
  employeeService;
  dbRefService;
  router;
  activeTab = "reclassements";
  // Reclassements
  reclassements$;
  employees = [];
  categories = [];
  grades = [];
  echelons = [];
  showReclassementForm = false;
  savingReclassement = false;
  selectedEmpForReclass = null;
  messageFeedback = "";
  newReclassement = {
    employeeId: null,
    dateDemande: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    dateEffet: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    categorieNouvelleId: null,
    gradeNouveauId: null,
    echelonNouveauId: null,
    salaireBaseNouveau: null,
    referenceActe: "",
    motif: "Dipl\xF4me ITB / Master",
    observations: ""
  };
  motifsList = [
    "Dipl\xF4me ITB / Master",
    "Promotion interne",
    "Concours professionnel",
    "Titularisation",
    "R\xE9gularisation administrative",
    "Changement de fili\xE8re"
  ];
  // Compétences Référentiel
  competences$;
  showCompForm = false;
  savingComp = false;
  newComp = {
    libelle: "",
    categorie: "Technique",
    description: "",
    niveauxRaw: "D\xE9butant, Interm\xE9diaire, Confirm\xE9, Expert"
  };
  constructor(carrieresService, employeeService, dbRefService, router) {
    this.carrieresService = carrieresService;
    this.employeeService = employeeService;
    this.dbRefService = dbRefService;
    this.router = router;
  }
  ngOnInit() {
    this.reclassements$ = this.carrieresService.reclassements$;
    this.competences$ = this.carrieresService.competences$;
    this.carrieresService.fetchReclassements().subscribe();
    this.carrieresService.fetchCompetences().subscribe();
    this.loadData();
  }
  loadData() {
    this.employeeService.getAll().subscribe({
      next: (list) => {
        this.employees = (list || []).filter((e) => e.statut !== "Inactif");
      }
    });
    this.dbRefService.getItems("categorie").subscribe((cats) => this.categories = cats || []);
    this.dbRefService.getItems("grade").subscribe((grs) => this.grades = grs || []);
    this.dbRefService.getItems("echelon").subscribe((echs) => this.echelons = echs || []);
  }
  onSelectEmployee(empId) {
    this.selectedEmpForReclass = this.employees.find((e) => String(e.id) === String(empId)) || null;
  }
  saveReclassement() {
    if (!this.newReclassement.employeeId || !this.selectedEmpForReclass)
      return;
    this.savingReclassement = true;
    this.messageFeedback = "";
    const emp = this.selectedEmpForReclass;
    const catNouv = this.categories.find((c) => String(c.id) === String(this.newReclassement.categorieNouvelleId));
    const gradeNouv = this.grades.find((g) => String(g.id) === String(this.newReclassement.gradeNouveauId));
    const echNouv = this.echelons.find((e) => String(e.id) === String(this.newReclassement.echelonNouveauId));
    const payload = {
      employee: { id: Number(emp.id) },
      dateDemande: this.newReclassement.dateDemande,
      dateEffet: this.newReclassement.dateEffet,
      categorieAncienne: emp.categorieId ? { id: Number(emp.categorieId) } : void 0,
      categorieNouvelle: catNouv ? { id: Number(catNouv.id) } : void 0,
      gradeAncien: emp.gradeId ? { id: Number(emp.gradeId) } : void 0,
      gradeNouveau: gradeNouv ? { id: Number(gradeNouv.id) } : void 0,
      echelonAncien: emp.echelonId ? { id: Number(emp.echelonId) } : void 0,
      echelonNouveau: echNouv ? { id: Number(echNouv.id) } : void 0,
      salaireBaseAncien: emp.salaireBase || 0,
      salaireBaseNouveau: this.newReclassement.salaireBaseNouveau ? Number(this.newReclassement.salaireBaseNouveau) : void 0,
      referenceActe: this.newReclassement.referenceActe.trim() || "D\xE9cision DRH",
      motif: this.newReclassement.motif,
      statut: "VALIDE",
      observations: this.newReclassement.observations.trim()
    };
    this.carrieresService.saveReclassement(payload).subscribe({
      next: () => {
        this.savingReclassement = false;
        this.showReclassementForm = false;
        this.messageFeedback = "Reclassement enregistr\xE9 et appliqu\xE9 avec succ\xE8s dans PostgreSQL !";
        this.carrieresService.fetchReclassements().subscribe();
        this.resetReclassementForm();
      },
      error: () => {
        this.savingReclassement = false;
        this.messageFeedback = "Erreur lors de l'enregistrement du reclassement.";
      }
    });
  }
  resetReclassementForm() {
    this.newReclassement = {
      employeeId: null,
      dateDemande: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      dateEffet: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      categorieNouvelleId: null,
      gradeNouveauId: null,
      echelonNouveauId: null,
      salaireBaseNouveau: null,
      referenceActe: "",
      motif: "Dipl\xF4me ITB / Master",
      observations: ""
    };
    this.selectedEmpForReclass = null;
  }
  addComp() {
    if (!this.newComp.libelle.trim())
      return;
    this.savingComp = true;
    const levels = this.newComp.niveauxRaw.split(",").map((l) => l.trim()).filter((l) => !!l);
    this.carrieresService.addCompetence({
      libelle: this.newComp.libelle.trim(),
      categorie: this.newComp.categorie,
      description: this.newComp.description.trim(),
      niveaux: levels
    }).subscribe({
      next: () => {
        this.savingComp = false;
        this.showCompForm = false;
        this.newComp = {
          libelle: "",
          categorie: "Technique",
          description: "",
          niveauxRaw: "D\xE9butant, Interm\xE9diaire, Confirm\xE9, Expert"
        };
      },
      error: () => {
        this.savingComp = false;
      }
    });
  }
  deleteComp(id) {
    if (confirm("Supprimer cette comp\xE9tence du r\xE9f\xE9rentiel ?")) {
      this.carrieresService.deleteCompetence(id).subscribe();
    }
  }
  goBack() {
    this.router.navigate(["/carrieres"]);
  }
  static \u0275fac = function CompetencesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CompetencesComponent)(\u0275\u0275directiveInject(CarrieresService), \u0275\u0275directiveInject(EmployeeService), \u0275\u0275directiveInject(DbRefService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CompetencesComponent, selectors: [["app-competences"]], standalone: false, decls: 26, vars: 8, consts: [[1, "section-page"], [1, "sec-breadcrumb"], [1, "link", 3, "click"], [1, "sep"], [1, "current"], [1, "header-container"], [1, "header-info"], [1, "header-actions"], [1, "btn-primary"], [1, "alert-info"], [1, "tabs-header"], [1, "tab-btn", 3, "click"], [1, "btn-primary", 3, "click"], [1, "add-card", "animate-fade-in", "mb-4"], [1, "table-card"], [1, "form-grid-reclass"], ["appearance", "outline"], [3, "ngModelChange", "selectionChange", "ngModel"], [3, "value"], ["matInput", "", "placeholder", "Ex: D\xE9cision N\xB0 2026/012/DG/DRH", 3, "ngModelChange", "ngModel"], [3, "ngModelChange", "ngModel"], ["matInput", "", "type", "date", 3, "ngModelChange", "ngModel"], [1, "comparison-reclass-box"], [1, "reclass-col", "current-box"], [1, "reclass-col", "target-box"], [1, "input-stack"], ["appearance", "outline", 1, "w-100"], ["matInput", "", "type", "number", "placeholder", "Laisser vide pour calcul auto selon grille", 3, "ngModelChange", "ngModel"], [1, "mt-3"], ["matInput", "", "rows", "2", "placeholder", "Pr\xE9cisions de la Direction G\xE9n\xE9rale...", 3, "ngModelChange", "ngModel"], [1, "form-actions-row"], [1, "btn-secondary", 3, "click"], [1, "btn-primary", 3, "click", "disabled"], [1, "empty-state"], [1, "data-table"], [1, "text-muted-info"], [1, "text-success-info", "font-bold"], [1, "badge-neutral"], [1, "status-pill", "valide"], [1, "form-grid"], ["matInput", "", "placeholder", "Ex: Analyse Financi\xE8re & Octroi de Cr\xE9dits", 3, "ngModelChange", "ngModel"], ["value", "Technique"], ["value", "Management"], ["value", "Soft Skills"], ["value", "Organisationnelle"], ["matInput", "", "rows", "2", "placeholder", "Crit\xE8res d'\xE9valuation et comp\xE9tences associ\xE9es...", 3, "ngModelChange", "ngModel"], [1, "text-right"], [1, "levels-tags"], [1, "level-tag"], [1, "btn-delete", 3, "click"]], template: function CompetencesComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "span", 2);
      \u0275\u0275listener("click", function CompetencesComponent_Template_span_click_2_listener() {
        return ctx.goBack();
      });
      \u0275\u0275text(3, "Carri\xE8res & Comp\xE9tences");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "span", 3);
      \u0275\u0275text(5, "\u203A");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span", 4);
      \u0275\u0275text(7, "Reclassements & Qualifications");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "div")(11, "h1");
      \u0275\u0275text(12, "Reclassements Professionnels & Qualifications");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p");
      \u0275\u0275text(14, "Gestion des changements de classe, cat\xE9gorie professionnelle et grade suite \xE0 obtention de dipl\xF4mes (ITB/Master) ou concours.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(15, "div", 7);
      \u0275\u0275conditionalCreate(16, CompetencesComponent_Conditional_16_Template, 2, 1, "button", 8)(17, CompetencesComponent_Conditional_17_Template, 2, 1, "button", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(18, CompetencesComponent_Conditional_18_Template, 2, 1, "div", 9);
      \u0275\u0275elementStart(19, "div", 10)(20, "button", 11);
      \u0275\u0275listener("click", function CompetencesComponent_Template_button_click_20_listener() {
        return ctx.activeTab = "reclassements";
      });
      \u0275\u0275text(21, " Reclassements Administratifs ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "button", 11);
      \u0275\u0275listener("click", function CompetencesComponent_Template_button_click_22_listener() {
        return ctx.activeTab = "referentiel";
      });
      \u0275\u0275text(23, " R\xE9f\xE9rentiel des Comp\xE9tences M\xE9tier ");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(24, CompetencesComponent_Conditional_24_Template, 8, 4);
      \u0275\u0275conditionalCreate(25, CompetencesComponent_Conditional_25_Template, 8, 4);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(16);
      \u0275\u0275conditional(ctx.activeTab === "reclassements" ? 16 : 17);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.messageFeedback ? 18 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("active", ctx.activeTab === "reclassements");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("active", ctx.activeTab === "referentiel");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.activeTab === "reclassements" ? 24 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeTab === "referentiel" ? 25 : -1);
    }
  }, dependencies: [DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgModel, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatFormField, MatLabel, MatInput, MatSelect, MatOption, AsyncPipe, DecimalPipe], styles: ["\n\n.section-page[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1300px;\n  margin: 0 auto;\n}\n.sec-breadcrumb[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: #64748b;\n  margin-bottom: 20px;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%] {\n  cursor: pointer;\n  font-weight: 500;\n  color: #0060B3;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .sep[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .current[_ngcontent-%COMP%] {\n  color: #1e293b;\n  font-weight: 600;\n}\n.header-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.header-info[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 700;\n  color: #003366;\n  margin: 0 0 4px;\n}\n.header-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  padding: 10px 18px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-primary[_ngcontent-%COMP%]:hover {\n  background: #004885;\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  background: #94a3b8;\n  cursor: not-allowed;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background: #f1f5f9;\n  color: #475569;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  padding: 10px 16px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background: #e2e8f0;\n}\n.btn-delete[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #ef4444;\n  border: 1px solid #fca5a5;\n  border-radius: 6px;\n  padding: 4px 10px;\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-delete[_ngcontent-%COMP%]:hover {\n  background: #fee2e2;\n}\n.alert-info[_ngcontent-%COMP%] {\n  background: #eff6ff;\n  border: 1px solid #bfdbfe;\n  color: #1e40af;\n  padding: 12px 16px;\n  border-radius: 8px;\n  font-size: 13px;\n  font-weight: 500;\n  margin-bottom: 20px;\n}\n.tabs-header[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  border-bottom: 2px solid #e2e8f0;\n  margin-bottom: 24px;\n}\n.tab-btn[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  padding: 12px 20px;\n  font-size: 14px;\n  font-weight: 600;\n  color: #64748b;\n  cursor: pointer;\n  position: relative;\n  transition: all 0.2s;\n}\n.tab-btn[_ngcontent-%COMP%]:hover {\n  color: #0060B3;\n}\n.tab-btn.active[_ngcontent-%COMP%] {\n  color: #0060B3;\n  border-bottom: 3px solid #0060B3;\n  margin-bottom: -2px;\n}\n.add-card[_ngcontent-%COMP%] {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;\n  background: #ffffff !important;\n  padding: 8px;\n}\n.add-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.form-grid-reclass[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 2fr 2fr 1.5fr 1fr;\n  gap: 16px;\n  margin-top: 12px;\n}\n@media (max-width: 900px) {\n  .form-grid-reclass[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  gap: 16px;\n  margin-top: 12px;\n}\n@media (max-width: 768px) {\n  .form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.comparison-reclass-box[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1.5fr;\n  gap: 20px;\n  margin-top: 16px;\n}\n@media (max-width: 768px) {\n  .comparison-reclass-box[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.reclass-col[_ngcontent-%COMP%] {\n  border-radius: 10px;\n  padding: 16px 20px;\n}\n.reclass-col[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 700;\n  margin: 0 0 12px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.current-box[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n}\n.current-box[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #475569;\n}\n.current-box[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #334155;\n  margin: 6px 0;\n}\n.target-box[_ngcontent-%COMP%] {\n  background: #eff6ff;\n  border: 1px solid #bfdbfe;\n}\n.target-box[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #1e40af;\n}\n.input-stack[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.w-100[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.form-actions-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 16px;\n}\n.table-card[_ngcontent-%COMP%] {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  background: #ffffff !important;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%] {\n  padding: 16px 20px;\n  border-bottom: 1px solid #f1f5f9;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  padding: 0 !important;\n  overflow-x: auto;\n}\n.data-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  font-weight: 600;\n  color: #64748b;\n  font-size: 11.5px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.data-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  color: #1e293b;\n  border-bottom: 1px solid #f1f5f9;\n}\n.data-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] {\n  background: #f8fafc;\n}\n.text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.font-bold[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.text-muted-info[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #64748b;\n}\n.text-success-info[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: #15803d;\n}\n.badge-neutral[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 3px 8px;\n  background: #f1f5f9;\n  color: #475569;\n  font-weight: 600;\n  border-radius: 6px;\n  font-size: 12px;\n}\n.status-pill[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 20px;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.status-pill.valide[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.levels-tags[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 4px;\n  flex-wrap: wrap;\n}\n.level-tag[_ngcontent-%COMP%] {\n  background: #f1f5f9;\n  border: 1px solid #e2e8f0;\n  border-radius: 4px;\n  padding: 2px 6px;\n  font-size: 11px;\n  color: #475569;\n}\n.empty-state[_ngcontent-%COMP%] {\n  padding: 40px 20px;\n  text-align: center;\n  color: #64748b;\n  font-size: 14px;\n}\n/*# sourceMappingURL=competences.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompetencesComponent, [{
    type: Component,
    args: [{ selector: "app-competences", standalone: false, template: `<div class="section-page">
  <div class="sec-breadcrumb">
    <span class="link" (click)="goBack()">Carri\xE8res & Comp\xE9tences</span>
    <span class="sep">\u203A</span>
    <span class="current">Reclassements & Qualifications</span>
  </div>

  <div class="header-container">
    <div class="header-info">
      <div>
        <h1>Reclassements Professionnels & Qualifications</h1>
        <p>Gestion des changements de classe, cat\xE9gorie professionnelle et grade suite \xE0 obtention de dipl\xF4mes (ITB/Master) ou concours.</p>
      </div>
    </div>
    
    <div class="header-actions">
      @if (activeTab === 'reclassements') {
        <button class="btn-primary" (click)="showReclassementForm = !showReclassementForm">
          {{ showReclassementForm ? 'Fermer le formulaire' : 'Nouveau Reclassement' }}
        </button>
      } @else {
        <button class="btn-primary" (click)="showCompForm = !showCompForm">
          {{ showCompForm ? 'Fermer' : 'Ajouter une Comp\xE9tence' }}
        </button>
      }
    </div>
  </div>

  @if (messageFeedback) {
    <div class="alert-info">
      {{ messageFeedback }}
    </div>
  }

  <!-- Onglets -->
  <div class="tabs-header">
    <button class="tab-btn" [class.active]="activeTab === 'reclassements'" (click)="activeTab = 'reclassements'">
      Reclassements Administratifs
    </button>
    <button class="tab-btn" [class.active]="activeTab === 'referentiel'" (click)="activeTab = 'referentiel'">
      R\xE9f\xE9rentiel des Comp\xE9tences M\xE9tier
    </button>
  </div>

  <!-- ONGLET 1 : RECLASSEMENTS PROFESSIONNELS -->
  @if (activeTab === 'reclassements') {
    @if (showReclassementForm) {
      <mat-card class="add-card animate-fade-in mb-4">
        <mat-card-header>
          <mat-card-title>Acter un Reclassement Professionnel</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="form-grid-reclass">
            <mat-form-field appearance="outline">
              <mat-label>Collaborateur concern\xE9 *</mat-label>
              <mat-select [(ngModel)]="newReclassement.employeeId" (selectionChange)="onSelectEmployee($event.value)">
                @for (emp of employees; track emp.id) {
                  <mat-option [value]="emp.id">
                    {{ emp.matricule }} \u2014 {{ emp.nom }} {{ emp.prenom }} ({{ emp.fonction || 'Agent' }})
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>R\xE9f\xE9rence de l'Acte D\xE9cisionnel *</mat-label>
              <input matInput [(ngModel)]="newReclassement.referenceActe" placeholder="Ex: D\xE9cision N\xB0 2026/012/DG/DRH">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Motif du Reclassement *</mat-label>
              <mat-select [(ngModel)]="newReclassement.motif">
                @for (m of motifsList; track m) {
                  <mat-option [value]="m">{{ m }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date d'Effet *</mat-label>
              <input matInput type="date" [(ngModel)]="newReclassement.dateEffet">
            </mat-form-field>
          </div>

          <!-- Situation Actuelle vs Nouvelle Situation -->
          <div class="comparison-reclass-box">
            <div class="reclass-col current-box">
              <h3>Situation Actuelle</h3>
              <p><strong>Cat\xE9gorie :</strong> {{ selectedEmpForReclass?.categoriePro || '\u2014' }}</p>
              <p><strong>Grade :</strong> {{ selectedEmpForReclass?.grade || '\u2014' }}</p>
              <p><strong>\xC9chelon :</strong> {{ selectedEmpForReclass?.echelon || '\u2014' }}</p>
              <p><strong>Salaire Base Actuel :</strong> {{ (selectedEmpForReclass?.salaireBase || 0) | number:'1.0-0' }} F CFA</p>
            </div>

            <div class="reclass-col target-box">
              <h3>Nouvelle Situation Reclass\xE9e</h3>
              <div class="input-stack">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Nouvelle Cat\xE9gorie *</mat-label>
                  <mat-select [(ngModel)]="newReclassement.categorieNouvelleId">
                    @for (cat of categories; track cat.id) {
                      <mat-option [value]="cat.id">{{ cat.code }} \u2014 {{ cat.libelle }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Nouveau Grade / Groupe</mat-label>
                  <mat-select [(ngModel)]="newReclassement.gradeNouveauId">
                    @for (gr of grades; track gr.id) {
                      <mat-option [value]="gr.id">{{ gr.code }} \u2014 {{ gr.libelle }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Nouvel \xC9chelon *</mat-label>
                  <mat-select [(ngModel)]="newReclassement.echelonNouveauId">
                    @for (ech of echelons; track ech.id) {
                      <mat-option [value]="ech.id">{{ ech.libelle || ech.code }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Nouveau Salaire de Base Sp\xE9cifique (FCFA)</mat-label>
                  <input matInput type="number" [(ngModel)]="newReclassement.salaireBaseNouveau" placeholder="Laisser vide pour calcul auto selon grille">
                </mat-form-field>
              </div>
            </div>
          </div>

          <div class="mt-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Observations & Commentaires</mat-label>
              <textarea matInput [(ngModel)]="newReclassement.observations" rows="2" placeholder="Pr\xE9cisions de la Direction G\xE9n\xE9rale..."></textarea>
            </mat-form-field>
          </div>

          <div class="form-actions-row">
            <button class="btn-secondary" (click)="showReclassementForm = false">Annuler</button>
            <button class="btn-primary" (click)="saveReclassement()" [disabled]="!newReclassement.employeeId || !newReclassement.referenceActe.trim() || savingReclassement">
              {{ savingReclassement ? 'Application...' : 'Valider & Appliquer le Reclassement' }}
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    }

    <!-- Tableau Historique des Reclassements -->
    <mat-card class="table-card">
      <mat-card-header>
        <mat-card-title>Historique des Reclassements et D\xE9cisions</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (reclassements$ | async; as reclassements) {
          @if (reclassements.length === 0) {
            <div class="empty-state">
              <p>Aucun reclassement enregistr\xE9 dans PostgreSQL. Utilisez le bouton <strong>Nouveau Reclassement</strong> pour acter une promotion cat\xE9gorielle.</p>
            </div>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th>R\xE9f. Acte D\xE9cisionnel</th>
                  <th>Date Effet</th>
                  <th>Agent & Matricule</th>
                  <th>Ancienne Situation</th>
                  <th>Nouvelle Situation</th>
                  <th>Motif</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                @for (r of reclassements; track r.id) {
                  <tr>
                    <td><strong>{{ r.referenceActe || 'D\xE9cision DRH' }}</strong></td>
                    <td>{{ r.dateEffet }}</td>
                    <td>
                      <strong>{{ r.employee?.matricule || '\u2014' }}</strong><br>
                      {{ r.employee?.nom }} {{ r.employee?.prenom }}
                    </td>
                    <td>
                      <span class="text-muted-info">
                        {{ r.categorieAncienne?.libelle || r.categorieAncienne?.code || 'Cat 1' }} /
                        {{ r.gradeAncien?.libelle || 'Grp 1' }} /
                        {{ r.echelonAncien?.libelle || 'E01' }}
                      </span>
                    </td>
                    <td>
                      <span class="text-success-info font-bold">
                        {{ r.categorieNouvelle?.libelle || r.categorieNouvelle?.code || 'Cat 2' }} /
                        {{ r.gradeNouveau?.libelle || 'Grp 2' }} /
                        {{ r.echelonNouveau?.libelle || 'E01' }}
                      </span>
                    </td>
                    <td><span class="badge-neutral">{{ r.motif || 'Dipl\xF4me' }}</span></td>
                    <td>
                      <span class="status-pill valide">{{ r.statut }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        }
      </mat-card-content>
    </mat-card>
  }

  <!-- ONGLET 2 : R\xC9F\xC9RENTIEL DES COMP\xC9TENCES -->
  @if (activeTab === 'referentiel') {
    @if (showCompForm) {
      <mat-card class="add-card animate-fade-in mb-4">
        <mat-card-header>
          <mat-card-title>Ajouter une Comp\xE9tence M\xE9tier Bancaire</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Libell\xE9 de la comp\xE9tence *</mat-label>
              <input matInput [(ngModel)]="newComp.libelle" placeholder="Ex: Analyse Financi\xE8re & Octroi de Cr\xE9dits">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Famille / Cat\xE9gorie *</mat-label>
              <mat-select [(ngModel)]="newComp.categorie">
                <mat-option value="Technique">Technique / M\xE9tier Bancaire</mat-option>
                <mat-option value="Management">Management & Pilotage</mat-option>
                <mat-option value="Soft Skills">Soft Skills & Relation Client</mat-option>
                <mat-option value="Organisationnelle">Organisation & Conformit\xE9</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Description & Crit\xE8res de Ma\xEEtrise</mat-label>
            <textarea matInput [(ngModel)]="newComp.description" rows="2" placeholder="Crit\xE8res d'\xE9valuation et comp\xE9tences associ\xE9es..."></textarea>
          </mat-form-field>

          <div class="form-actions-row">
            <button class="btn-secondary" (click)="showCompForm = false">Annuler</button>
            <button class="btn-primary" (click)="addComp()" [disabled]="!newComp.libelle.trim() || savingComp">
              {{ savingComp ? 'Enregistrement...' : 'Enregistrer la Comp\xE9tence' }}
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    }

    <mat-card class="table-card">
      <mat-card-header>
        <mat-card-title>R\xE9f\xE9rentiel des Comp\xE9tences</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (competences$ | async; as compList) {
          @if (compList.length === 0) {
            <div class="empty-state">
              <p>Aucune comp\xE9tence r\xE9f\xE9renc\xE9e. Cliquez sur <strong>Ajouter une Comp\xE9tence</strong> pour enrichir le r\xE9f\xE9rentiel.</p>
            </div>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th>Comp\xE9tence</th>
                  <th>Famille</th>
                  <th>Description</th>
                  <th>Niveaux</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (c of compList; track c.id) {
                  <tr>
                    <td><strong>{{ c.libelle }}</strong></td>
                    <td><span class="badge-neutral">{{ c.categorie }}</span></td>
                    <td>{{ c.description || '\u2014' }}</td>
                    <td>
                      <div class="levels-tags">
                        @for (lvl of c.niveaux; track lvl) {
                          <span class="level-tag">{{ lvl }}</span>
                        }
                      </div>
                    </td>
                    <td class="text-right">
                      <button class="btn-delete" (click)="deleteComp(c.id)">Supprimer</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        }
      </mat-card-content>
    </mat-card>
  }
</div>
`, styles: ["/* src/app/features/carrieres/competences/competences.component.scss */\n.section-page {\n  padding: 24px;\n  max-width: 1300px;\n  margin: 0 auto;\n}\n.sec-breadcrumb {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: #64748b;\n  margin-bottom: 20px;\n}\n.sec-breadcrumb .link {\n  cursor: pointer;\n  font-weight: 500;\n  color: #0060B3;\n}\n.sec-breadcrumb .link:hover {\n  text-decoration: underline;\n}\n.sec-breadcrumb .sep {\n  color: #cbd5e1;\n}\n.sec-breadcrumb .current {\n  color: #1e293b;\n  font-weight: 600;\n}\n.header-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.header-info h1 {\n  font-size: 20px;\n  font-weight: 700;\n  color: #003366;\n  margin: 0 0 4px;\n}\n.header-info p {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n}\n.btn-primary {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  padding: 10px 18px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-primary:hover {\n  background: #004885;\n}\n.btn-primary:disabled {\n  background: #94a3b8;\n  cursor: not-allowed;\n}\n.btn-secondary {\n  background: #f1f5f9;\n  color: #475569;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  padding: 10px 16px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-secondary:hover {\n  background: #e2e8f0;\n}\n.btn-delete {\n  background: transparent;\n  color: #ef4444;\n  border: 1px solid #fca5a5;\n  border-radius: 6px;\n  padding: 4px 10px;\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-delete:hover {\n  background: #fee2e2;\n}\n.alert-info {\n  background: #eff6ff;\n  border: 1px solid #bfdbfe;\n  color: #1e40af;\n  padding: 12px 16px;\n  border-radius: 8px;\n  font-size: 13px;\n  font-weight: 500;\n  margin-bottom: 20px;\n}\n.tabs-header {\n  display: flex;\n  gap: 8px;\n  border-bottom: 2px solid #e2e8f0;\n  margin-bottom: 24px;\n}\n.tab-btn {\n  background: transparent;\n  border: none;\n  padding: 12px 20px;\n  font-size: 14px;\n  font-weight: 600;\n  color: #64748b;\n  cursor: pointer;\n  position: relative;\n  transition: all 0.2s;\n}\n.tab-btn:hover {\n  color: #0060B3;\n}\n.tab-btn.active {\n  color: #0060B3;\n  border-bottom: 3px solid #0060B3;\n  margin-bottom: -2px;\n}\n.add-card {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;\n  background: #ffffff !important;\n  padding: 8px;\n}\n.add-card mat-card-header mat-card-title {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.form-grid-reclass {\n  display: grid;\n  grid-template-columns: 2fr 2fr 1.5fr 1fr;\n  gap: 16px;\n  margin-top: 12px;\n}\n@media (max-width: 900px) {\n  .form-grid-reclass {\n    grid-template-columns: 1fr;\n  }\n}\n.form-grid {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  gap: 16px;\n  margin-top: 12px;\n}\n@media (max-width: 768px) {\n  .form-grid {\n    grid-template-columns: 1fr;\n  }\n}\n.comparison-reclass-box {\n  display: grid;\n  grid-template-columns: 1fr 1.5fr;\n  gap: 20px;\n  margin-top: 16px;\n}\n@media (max-width: 768px) {\n  .comparison-reclass-box {\n    grid-template-columns: 1fr;\n  }\n}\n.reclass-col {\n  border-radius: 10px;\n  padding: 16px 20px;\n}\n.reclass-col h3 {\n  font-size: 14px;\n  font-weight: 700;\n  margin: 0 0 12px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.current-box {\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n}\n.current-box h3 {\n  color: #475569;\n}\n.current-box p {\n  font-size: 13px;\n  color: #334155;\n  margin: 6px 0;\n}\n.target-box {\n  background: #eff6ff;\n  border: 1px solid #bfdbfe;\n}\n.target-box h3 {\n  color: #1e40af;\n}\n.input-stack {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.w-100 {\n  width: 100%;\n}\n.form-actions-row {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 16px;\n}\n.table-card {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  background: #ffffff !important;\n}\n.table-card mat-card-header {\n  padding: 16px 20px;\n  border-bottom: 1px solid #f1f5f9;\n}\n.table-card mat-card-header mat-card-title {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.table-card mat-card-content {\n  padding: 0 !important;\n  overflow-x: auto;\n}\n.data-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.data-table th {\n  padding: 12px 16px;\n  font-weight: 600;\n  color: #64748b;\n  font-size: 11.5px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.data-table td {\n  padding: 12px 16px;\n  color: #1e293b;\n  border-bottom: 1px solid #f1f5f9;\n}\n.data-table tr:hover td {\n  background: #f8fafc;\n}\n.text-right {\n  text-align: right;\n}\n.font-bold {\n  font-weight: 700;\n}\n.text-muted-info {\n  font-size: 12px;\n  color: #64748b;\n}\n.text-success-info {\n  font-size: 12.5px;\n  color: #15803d;\n}\n.badge-neutral {\n  display: inline-block;\n  padding: 3px 8px;\n  background: #f1f5f9;\n  color: #475569;\n  font-weight: 600;\n  border-radius: 6px;\n  font-size: 12px;\n}\n.status-pill {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 20px;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.status-pill.valide {\n  background: #dcfce7;\n  color: #15803d;\n}\n.levels-tags {\n  display: flex;\n  gap: 4px;\n  flex-wrap: wrap;\n}\n.level-tag {\n  background: #f1f5f9;\n  border: 1px solid #e2e8f0;\n  border-radius: 4px;\n  padding: 2px 6px;\n  font-size: 11px;\n  color: #475569;\n}\n.empty-state {\n  padding: 40px 20px;\n  text-align: center;\n  color: #64748b;\n  font-size: 14px;\n}\n/*# sourceMappingURL=competences.component.css.map */\n"] }]
  }], () => [{ type: CarrieresService }, { type: EmployeeService }, { type: DbRefService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CompetencesComponent, { className: "CompetencesComponent", filePath: "src/app/features/carrieres/competences/competences.component.ts", lineNumber: 15 });
})();

// src/app/features/carrieres/formations/formations.component.ts
var _forTrack03 = ($index, $item) => $item.id;
function FormationsComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function FormationsComponent_Conditional_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showScheduleForm = !ctx_r1.showScheduleForm);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.showScheduleForm ? "Fermer" : "Planifier une Session", " ");
  }
}
function FormationsComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function FormationsComponent_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showAddCourseForm = !ctx_r1.showAddCourseForm);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.showAddCourseForm ? "Fermer" : "Ajouter un Module", " ");
  }
}
function FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 17);
    \u0275\u0275text(1, "Veuillez d'abord enregistrer des th\xE8mes dans le catalogue de formations.");
    \u0275\u0275elementEnd();
  }
}
function FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Conditional_6_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r5 = ctx.$implicit;
    \u0275\u0275property("value", c_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", c_r5.titre, " (", c_r5.duree, " h)");
  }
}
function FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "mat-form-field", 19)(2, "mat-label");
    \u0275\u0275text(3, "Module de formation *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-select", 20);
    \u0275\u0275twoWayListener("ngModelChange", function FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Conditional_6_Template_mat_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(4);
      \u0275\u0275twoWayBindingSet(ctx_r1.newSession.courseId, $event) || (ctx_r1.newSession.courseId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(5, FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Conditional_6_For_6_Template, 2, 3, "mat-option", 21, _forTrack03);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "mat-form-field", 19)(8, "mat-label");
    \u0275\u0275text(9, "Date programm\xE9e *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Conditional_6_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(4);
      \u0275\u0275twoWayBindingSet(ctx_r1.newSession.date, $event) || (ctx_r1.newSession.date = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "mat-datepicker-toggle", 23)(12, "mat-datepicker", null, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "mat-form-field", 19)(15, "mat-label");
    \u0275\u0275text(16, "Nombre de participants pr\xE9vus *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "input", 24);
    \u0275\u0275twoWayListener("ngModelChange", function FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Conditional_6_Template_input_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(4);
      \u0275\u0275twoWayBindingSet(ctx_r1.newSession.participants, $event) || (ctx_r1.newSession.participants = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 25)(19, "button", 26);
    \u0275\u0275listener("click", function FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Conditional_6_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.showScheduleForm = false);
    });
    \u0275\u0275text(20, "Annuler");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 27);
    \u0275\u0275listener("click", function FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Conditional_6_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r4);
      const courses_r6 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.scheduleSession(courses_r6));
    });
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const sessPicker_r7 = \u0275\u0275reference(13);
    const courses_r6 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newSession.courseId);
    \u0275\u0275advance();
    \u0275\u0275repeater(courses_r6);
    \u0275\u0275advance(5);
    \u0275\u0275property("matDatepicker", sessPicker_r7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newSession.date);
    \u0275\u0275advance();
    \u0275\u0275property("for", sessPicker_r7);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newSession.participants);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r1.newSession.courseId || !ctx_r1.newSession.date || ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.saving ? "Enregistrement..." : "Confirmer la Programmation", " ");
  }
}
function FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-card", 16)(1, "mat-card-header")(2, "mat-card-title");
    \u0275\u0275text(3, "Planifier une Nouvelle Session de Formation");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "mat-card-content");
    \u0275\u0275conditionalCreate(5, FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Conditional_5_Template, 2, 0, "p", 17)(6, FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Conditional_6_Template, 23, 7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const courses_r6 = ctx;
    \u0275\u0275advance(5);
    \u0275\u0275conditional(!courses_r6 || courses_r6.length === 0 ? 5 : 6);
  }
}
function FormationsComponent_Conditional_23_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FormationsComponent_Conditional_23_Conditional_0_Conditional_0_Template, 7, 1, "mat-card", 16);
    \u0275\u0275pipe(1, "async");
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_2_0 = \u0275\u0275pipeBind1(1, 1, ctx_r1.catalogue$)) ? 0 : -1, tmp_2_0);
  }
}
function FormationsComponent_Conditional_23_For_23_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function FormationsComponent_Conditional_23_For_23_Conditional_21_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const sess_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.changeStatus(sess_r9.id, "Confirm\xE9e"));
    });
    \u0275\u0275text(1, " Confirmer ");
    \u0275\u0275elementEnd();
  }
}
function FormationsComponent_Conditional_23_For_23_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 35);
    \u0275\u0275listener("click", function FormationsComponent_Conditional_23_For_23_Conditional_22_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const sess_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.changeStatus(sess_r9.id, "Termin\xE9e"));
    });
    \u0275\u0275text(1, " Cl\xF4turer ");
    \u0275\u0275elementEnd();
  }
}
function FormationsComponent_Conditional_23_For_23_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function FormationsComponent_Conditional_23_For_23_Conditional_23_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const sess_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.changeStatus(sess_r9.id, "Annul\xE9e"));
    });
    \u0275\u0275text(1, " Annuler ");
    \u0275\u0275elementEnd();
  }
}
function FormationsComponent_Conditional_23_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "br");
    \u0275\u0275elementStart(5, "span", 28);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td")(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275text(13, " agents");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td")(17, "span", 29);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td", 15)(20, "div", 30);
    \u0275\u0275conditionalCreate(21, FormationsComponent_Conditional_23_For_23_Conditional_21_Template, 2, 0, "button", 31);
    \u0275\u0275conditionalCreate(22, FormationsComponent_Conditional_23_For_23_Conditional_22_Template, 2, 0, "button", 32);
    \u0275\u0275conditionalCreate(23, FormationsComponent_Conditional_23_For_23_Conditional_23_Template, 2, 0, "button", 33);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const sess_r9 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(sess_r9.titre);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(sess_r9.description);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 15, sess_r9.date, "dd/MM/yyyy"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(sess_r9.participants);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", sess_r9.duree || 0, " h");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("valide", sess_r9.statut === "Confirm\xE9e" || sess_r9.statut === "Termin\xE9e")("propose", sess_r9.statut === "Planifi\xE9e")("rejete", sess_r9.statut === "Annul\xE9e");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", sess_r9.statut, " ");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(sess_r9.statut === "Planifi\xE9e" ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(sess_r9.statut === "Confirm\xE9e" ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(sess_r9.statut !== "Termin\xE9e" && sess_r9.statut !== "Annul\xE9e" ? 23 : -1);
  }
}
function FormationsComponent_Conditional_23_ForEmpty_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 37)(2, "p");
    \u0275\u0275text(3, "Aucune session de formation programm\xE9e.");
    \u0275\u0275elementEnd()()();
  }
}
function FormationsComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FormationsComponent_Conditional_23_Conditional_0_Template, 2, 3);
    \u0275\u0275elementStart(1, "mat-card", 13)(2, "mat-card-header")(3, "mat-card-title");
    \u0275\u0275text(4, "Calendrier des Sessions de Formation");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "mat-card-content")(6, "table", 14)(7, "thead")(8, "tr")(9, "th");
    \u0275\u0275text(10, "Th\xE8me & Module");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Date Programm\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Participants");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Dur\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Statut");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 15);
    \u0275\u0275text(20, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "tbody");
    \u0275\u0275repeaterCreate(22, FormationsComponent_Conditional_23_For_23_Template, 24, 18, "tr", null, _forTrack03, false, FormationsComponent_Conditional_23_ForEmpty_24_Template, 4, 0, "tr");
    \u0275\u0275pipe(25, "async");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.showScheduleForm ? 0 : -1);
    \u0275\u0275advance(22);
    \u0275\u0275repeater(\u0275\u0275pipeBind1(25, 2, ctx_r1.sessions$));
  }
}
function FormationsComponent_Conditional_24_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 16)(1, "mat-card-header")(2, "mat-card-title");
    \u0275\u0275text(3, "Enregistrer un Module au Catalogue");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "mat-card-content")(5, "div", 18)(6, "mat-form-field", 19)(7, "mat-label");
    \u0275\u0275text(8, "Intitul\xE9 du module *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 41);
    \u0275\u0275twoWayListener("ngModelChange", function FormationsComponent_Conditional_24_Conditional_0_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newCourse.titre, $event) || (ctx_r1.newCourse.titre = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "mat-form-field", 19)(11, "mat-label");
    \u0275\u0275text(12, "Volume horaire (heures) *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "input", 24);
    \u0275\u0275twoWayListener("ngModelChange", function FormationsComponent_Conditional_24_Conditional_0_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newCourse.duree, $event) || (ctx_r1.newCourse.duree = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "mat-form-field", 42)(15, "mat-label");
    \u0275\u0275text(16, "Objectifs p\xE9dagogiques & Public cible *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "textarea", 43);
    \u0275\u0275twoWayListener("ngModelChange", function FormationsComponent_Conditional_24_Conditional_0_Template_textarea_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.newCourse.description, $event) || (ctx_r1.newCourse.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 25)(19, "button", 26);
    \u0275\u0275listener("click", function FormationsComponent_Conditional_24_Conditional_0_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showAddCourseForm = false);
    });
    \u0275\u0275text(20, "Annuler");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 27);
    \u0275\u0275listener("click", function FormationsComponent_Conditional_24_Conditional_0_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addCourse());
    });
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newCourse.titre);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newCourse.duree);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newCourse.description);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r1.newCourse.titre.trim() || !ctx_r1.newCourse.description.trim() || ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.saving ? "Ajout..." : "Ajouter au Catalogue", " ");
  }
}
function FormationsComponent_Conditional_24_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-card", 39)(1, "mat-card-content")(2, "div", 44)(3, "span", 45);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "h3", 46);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 47);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const course_r13 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", course_r13.duree, " Heures");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(course_r13.titre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(course_r13.description);
  }
}
function FormationsComponent_Conditional_24_ForEmpty_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40)(1, "p");
    \u0275\u0275text(2, "Le catalogue des formations est actuellement vide.");
    \u0275\u0275elementEnd()();
  }
}
function FormationsComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FormationsComponent_Conditional_24_Conditional_0_Template, 23, 5, "mat-card", 16);
    \u0275\u0275elementStart(1, "div", 38);
    \u0275\u0275repeaterCreate(2, FormationsComponent_Conditional_24_For_3_Template, 9, 3, "mat-card", 39, _forTrack03, false, FormationsComponent_Conditional_24_ForEmpty_4_Template, 3, 0, "div", 40);
    \u0275\u0275pipe(5, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.showAddCourseForm ? 0 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(\u0275\u0275pipeBind1(5, 2, ctx_r1.catalogue$));
  }
}
var FormationsComponent = class _FormationsComponent {
  carrieresService;
  router;
  catalogue$;
  sessions$;
  activeTab = "plan";
  // 'plan' | 'catalogue'
  showScheduleForm = false;
  showAddCourseForm = false;
  saving = false;
  // Session form model
  newSession = {
    courseId: "",
    date: null,
    participants: 10
  };
  // Course form model
  newCourse = {
    titre: "",
    description: "",
    duree: 14
    // default hours
  };
  constructor(carrieresService, router) {
    this.carrieresService = carrieresService;
    this.router = router;
  }
  ngOnInit() {
    this.catalogue$ = this.carrieresService.catalogue$;
    this.sessions$ = this.carrieresService.sessions$;
    if (this.router.url.includes("/formations/catalogue")) {
      this.activeTab = "catalogue";
    } else {
      this.activeTab = "plan";
    }
  }
  scheduleSession(courses) {
    const selectedCourse = courses.find((c) => c.id === this.newSession.courseId);
    if (!selectedCourse || !this.newSession.date)
      return;
    this.saving = true;
    const dt = this.newSession.date;
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    this.carrieresService.scheduleSession({
      titre: selectedCourse.titre,
      date: formattedDate,
      participants: this.newSession.participants,
      statut: "Planifi\xE9e",
      description: selectedCourse.description,
      duree: selectedCourse.duree
    }).subscribe(() => {
      this.saving = false;
      this.newSession = { courseId: "", date: null, participants: 10 };
      this.showScheduleForm = false;
    });
  }
  addCourse() {
    if (!this.newCourse.titre.trim() || !this.newCourse.description.trim())
      return;
    this.saving = true;
    this.carrieresService.addCourse({
      titre: this.newCourse.titre.trim(),
      description: this.newCourse.description.trim(),
      duree: this.newCourse.duree
    }).subscribe(() => {
      this.saving = false;
      this.newCourse = { titre: "", description: "", duree: 14 };
      this.showAddCourseForm = false;
    });
  }
  changeStatus(id, status) {
    this.carrieresService.updateSessionStatus(id, status).subscribe();
  }
  goBack() {
    this.router.navigate(["/carrieres"]);
  }
  static \u0275fac = function FormationsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormationsComponent)(\u0275\u0275directiveInject(CarrieresService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormationsComponent, selectors: [["app-formations"]], standalone: false, decls: 25, vars: 7, consts: [["sessPicker", ""], [1, "section-page"], [1, "sec-breadcrumb"], [1, "link", 3, "click"], [1, "sep"], [1, "current"], [1, "header-container"], [1, "header-info"], [1, "header-actions"], [1, "btn-primary"], [1, "tabs-header"], [1, "tab-btn", 3, "click"], [1, "btn-primary", 3, "click"], [1, "table-card"], [1, "data-table"], [1, "text-right"], [1, "add-card", "animate-fade-in", "mb-4"], [1, "warning-text"], [1, "form-grid"], ["appearance", "outline"], [3, "ngModelChange", "ngModel"], [3, "value"], ["matInput", "", 3, "ngModelChange", "matDatepicker", "ngModel"], ["matIconSuffix", "", 3, "for"], ["matInput", "", "type", "number", "min", "1", 3, "ngModelChange", "ngModel"], [1, "form-actions-row"], [1, "btn-secondary", 3, "click"], [1, "btn-primary", 3, "click", "disabled"], [1, "sub-text"], [1, "status-pill"], [1, "actions-group"], [1, "btn-action-small"], [1, "btn-action-small", "accent"], [1, "btn-action-small", "danger"], [1, "btn-action-small", 3, "click"], [1, "btn-action-small", "accent", 3, "click"], [1, "btn-action-small", "danger", 3, "click"], ["colspan", "6", 1, "empty-state"], [1, "catalogue-grid"], [1, "course-card"], [1, "empty-state", "w-100"], ["matInput", "", "placeholder", "Ex: Risque Op\xE9rationnel & Lutte Anti-Blanchiment", 3, "ngModelChange", "ngModel"], ["appearance", "outline", 1, "w-100"], ["matInput", "", "rows", "3", "placeholder", "Description du programme et comp\xE9tences vis\xE9es...", 3, "ngModelChange", "ngModel"], [1, "course-card-header"], [1, "course-duration-badge"], [1, "course-title"], [1, "course-desc"]], template: function FormationsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "span", 3);
      \u0275\u0275listener("click", function FormationsComponent_Template_span_click_2_listener() {
        return ctx.goBack();
      });
      \u0275\u0275text(3, "Carri\xE8res & Comp\xE9tences");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "span", 4);
      \u0275\u0275text(5, "\u203A");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span", 5);
      \u0275\u0275text(7, "Plan de formation continue");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 6)(9, "div", 7)(10, "div")(11, "h1");
      \u0275\u0275text(12, "Plan & Sessions de Formation");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p");
      \u0275\u0275text(14, "Planification des sessions annuelles et catalogue des modules de formation bancaire BPBF.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(15, "div", 8);
      \u0275\u0275conditionalCreate(16, FormationsComponent_Conditional_16_Template, 2, 1, "button", 9)(17, FormationsComponent_Conditional_17_Template, 2, 1, "button", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 10)(19, "button", 11);
      \u0275\u0275listener("click", function FormationsComponent_Template_button_click_19_listener() {
        return ctx.activeTab = "plan";
      });
      \u0275\u0275text(20, " Sessions Planifi\xE9es ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "button", 11);
      \u0275\u0275listener("click", function FormationsComponent_Template_button_click_21_listener() {
        return ctx.activeTab = "catalogue";
      });
      \u0275\u0275text(22, " Catalogue des Modules ");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(23, FormationsComponent_Conditional_23_Template, 26, 4);
      \u0275\u0275conditionalCreate(24, FormationsComponent_Conditional_24_Template, 6, 4);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(16);
      \u0275\u0275conditional(ctx.activeTab === "plan" ? 16 : 17);
      \u0275\u0275advance(3);
      \u0275\u0275classProp("active", ctx.activeTab === "plan");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("active", ctx.activeTab === "catalogue");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.activeTab === "plan" ? 23 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeTab === "catalogue" ? 24 : -1);
    }
  }, dependencies: [DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, NgModel, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatFormField, MatLabel, MatSuffix, MatInput, MatSelect, MatOption, MatDatepicker, MatDatepickerInput, MatDatepickerToggle, AsyncPipe, DatePipe], styles: ["\n\n.section-page[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1300px;\n  margin: 0 auto;\n}\n.sec-breadcrumb[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: #64748b;\n  margin-bottom: 20px;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%] {\n  cursor: pointer;\n  font-weight: 500;\n  color: #0060B3;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .sep[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .current[_ngcontent-%COMP%] {\n  color: #1e293b;\n  font-weight: 600;\n}\n.header-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.header-info[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 700;\n  color: #003366;\n  margin: 0 0 4px;\n}\n.header-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  padding: 10px 18px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-primary[_ngcontent-%COMP%]:hover {\n  background: #004885;\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  background: #94a3b8;\n  cursor: not-allowed;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background: #f1f5f9;\n  color: #475569;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  padding: 10px 16px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background: #e2e8f0;\n}\n.tabs-header[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  border-bottom: 2px solid #e2e8f0;\n  margin-bottom: 24px;\n}\n.tab-btn[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  padding: 12px 20px;\n  font-size: 14px;\n  font-weight: 600;\n  color: #64748b;\n  cursor: pointer;\n  position: relative;\n  transition: all 0.2s;\n}\n.tab-btn[_ngcontent-%COMP%]:hover {\n  color: #0060B3;\n}\n.tab-btn.active[_ngcontent-%COMP%] {\n  color: #0060B3;\n  border-bottom: 3px solid #0060B3;\n  margin-bottom: -2px;\n}\n.add-card[_ngcontent-%COMP%] {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;\n  background: #ffffff !important;\n  padding: 8px;\n}\n.add-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n  margin-top: 12px;\n}\n@media (max-width: 768px) {\n  .form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.w-100[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.form-actions-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 16px;\n}\n.table-card[_ngcontent-%COMP%] {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  background: #ffffff !important;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%] {\n  padding: 16px 20px;\n  border-bottom: 1px solid #f1f5f9;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  padding: 0 !important;\n  overflow-x: auto;\n}\n.data-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  font-weight: 600;\n  color: #64748b;\n  font-size: 11.5px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.data-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  color: #1e293b;\n  border-bottom: 1px solid #f1f5f9;\n}\n.data-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] {\n  background: #f8fafc;\n}\n.text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.sub-text[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: #64748b;\n}\n.status-pill[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 20px;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.status-pill.valide[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.status-pill.propose[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #d97706;\n}\n.status-pill.rejete[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.actions-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  justify-content: flex-end;\n}\n.btn-action-small[_ngcontent-%COMP%] {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 6px;\n  padding: 4px 10px;\n  font-size: 11.5px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-action-small[_ngcontent-%COMP%]:hover {\n  background: #004885;\n}\n.btn-action-small.accent[_ngcontent-%COMP%] {\n  background: #16a34a;\n}\n.btn-action-small.accent[_ngcontent-%COMP%]:hover {\n  background: #15803d;\n}\n.btn-action-small.danger[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #dc2626;\n  border: 1px solid #fca5a5;\n}\n.btn-action-small.danger[_ngcontent-%COMP%]:hover {\n  background: #fee2e2;\n}\n.catalogue-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 20px;\n}\n.course-card[_ngcontent-%COMP%] {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  background: #ffffff !important;\n  transition: transform 0.2s;\n}\n.course-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08) !important;\n}\n.course-duration-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  background: #eff6ff;\n  color: #0060B3;\n  padding: 3px 8px;\n  border-radius: 6px;\n  font-size: 11.5px;\n  font-weight: 700;\n  margin-bottom: 8px;\n}\n.course-title[_ngcontent-%COMP%] {\n  font-size: 15px;\n  font-weight: 700;\n  color: #003366;\n  margin: 0 0 6px;\n}\n.course-desc[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: #475569;\n  line-height: 1.5;\n  margin: 0;\n}\n.empty-state[_ngcontent-%COMP%] {\n  padding: 40px 20px;\n  text-align: center;\n  color: #64748b;\n  font-size: 14px;\n}\n/*# sourceMappingURL=formations.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormationsComponent, [{
    type: Component,
    args: [{ selector: "app-formations", standalone: false, template: `<div class="section-page">
  <div class="sec-breadcrumb">
    <span class="link" (click)="goBack()">Carri\xE8res & Comp\xE9tences</span>
    <span class="sep">\u203A</span>
    <span class="current">Plan de formation continue</span>
  </div>

  <div class="header-container">
    <div class="header-info">
      <div>
        <h1>Plan & Sessions de Formation</h1>
        <p>Planification des sessions annuelles et catalogue des modules de formation bancaire BPBF.</p>
      </div>
    </div>
    
    <div class="header-actions">
      @if (activeTab === 'plan') {
        <button class="btn-primary" (click)="showScheduleForm = !showScheduleForm">
          {{ showScheduleForm ? 'Fermer' : 'Planifier une Session' }}
        </button>
      } @else {
        <button class="btn-primary" (click)="showAddCourseForm = !showAddCourseForm">
          {{ showAddCourseForm ? 'Fermer' : 'Ajouter un Module' }}
        </button>
      }
    </div>
  </div>

  <!-- S\xE9lecteur d'onglets personnalis\xE9s -->
  <div class="tabs-header">
    <button class="tab-btn" [class.active]="activeTab === 'plan'" (click)="activeTab = 'plan'">
      Sessions Planifi\xE9es
    </button>
    <button class="tab-btn" [class.active]="activeTab === 'catalogue'" (click)="activeTab = 'catalogue'">
      Catalogue des Modules
    </button>
  </div>

  <!-- ONGLET 1 : PLAN DE FORMATION -->
  @if (activeTab === 'plan') {
    <!-- Formulaire de planification -->
    @if (showScheduleForm) {
      @if (catalogue$ | async; as courses) {
        <mat-card class="add-card animate-fade-in mb-4">
          <mat-card-header>
            <mat-card-title>Planifier une Nouvelle Session de Formation</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (!courses || courses.length === 0) {
              <p class="warning-text">Veuillez d'abord enregistrer des th\xE8mes dans le catalogue de formations.</p>
            } @else {
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Module de formation *</mat-label>
                  <mat-select [(ngModel)]="newSession.courseId">
                    @for (c of courses; track c.id) {
                      <mat-option [value]="c.id">{{ c.titre }} ({{ c.duree }} h)</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Date programm\xE9e *</mat-label>
                  <input matInput [matDatepicker]="sessPicker" [(ngModel)]="newSession.date">
                  <mat-datepicker-toggle matIconSuffix [for]="sessPicker"></mat-datepicker-toggle>
                  <mat-datepicker #sessPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Nombre de participants pr\xE9vus *</mat-label>
                  <input matInput type="number" min="1" [(ngModel)]="newSession.participants">
                </mat-form-field>
              </div>

              <div class="form-actions-row">
                <button class="btn-secondary" (click)="showScheduleForm = false">Annuler</button>
                <button class="btn-primary" (click)="scheduleSession(courses)" [disabled]="!newSession.courseId || !newSession.date || saving">
                  {{ saving ? 'Enregistrement...' : 'Confirmer la Programmation' }}
                </button>
              </div>
            }
          </mat-card-content>
        </mat-card>
      }
    }

    <!-- Liste des sessions planifi\xE9es -->
    <mat-card class="table-card">
      <mat-card-header>
        <mat-card-title>Calendrier des Sessions de Formation</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table class="data-table">
          <thead>
            <tr>
              <th>Th\xE8me & Module</th>
              <th>Date Programm\xE9e</th>
              <th>Participants</th>
              <th>Dur\xE9e</th>
              <th>Statut</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (sess of sessions$ | async; track sess.id) {
              <tr>
                <td>
                  <strong>{{ sess.titre }}</strong><br>
                  <span class="sub-text">{{ sess.description }}</span>
                </td>
                <td>{{ sess.date | date:'dd/MM/yyyy' }}</td>
                <td><strong>{{ sess.participants }}</strong> agents</td>
                <td>{{ sess.duree || 0 }} h</td>
                <td>
                  <span class="status-pill" [class.valide]="sess.statut === 'Confirm\xE9e' || sess.statut === 'Termin\xE9e'" [class.propose]="sess.statut === 'Planifi\xE9e'" [class.rejete]="sess.statut === 'Annul\xE9e'">
                    {{ sess.statut }}
                  </span>
                </td>
                <td class="text-right">
                  <div class="actions-group">
                    @if (sess.statut === 'Planifi\xE9e') {
                      <button class="btn-action-small" (click)="changeStatus(sess.id, 'Confirm\xE9e')">
                        Confirmer
                      </button>
                    }
                    @if (sess.statut === 'Confirm\xE9e') {
                      <button class="btn-action-small accent" (click)="changeStatus(sess.id, 'Termin\xE9e')">
                        Cl\xF4turer
                      </button>
                    }
                    @if (sess.statut !== 'Termin\xE9e' && sess.statut !== 'Annul\xE9e') {
                      <button class="btn-action-small danger" (click)="changeStatus(sess.id, 'Annul\xE9e')">
                        Annuler
                      </button>
                    }
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="empty-state">
                  <p>Aucune session de formation programm\xE9e.</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </mat-card-content>
    </mat-card>
  }

  <!-- ONGLET 2 : CATALOGUE DES COURS -->
  @if (activeTab === 'catalogue') {
    @if (showAddCourseForm) {
      <mat-card class="add-card animate-fade-in mb-4">
        <mat-card-header>
          <mat-card-title>Enregistrer un Module au Catalogue</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Intitul\xE9 du module *</mat-label>
              <input matInput [(ngModel)]="newCourse.titre" placeholder="Ex: Risque Op\xE9rationnel & Lutte Anti-Blanchiment">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Volume horaire (heures) *</mat-label>
              <input matInput type="number" min="1" [(ngModel)]="newCourse.duree">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Objectifs p\xE9dagogiques & Public cible *</mat-label>
            <textarea matInput [(ngModel)]="newCourse.description" rows="3" placeholder="Description du programme et comp\xE9tences vis\xE9es..."></textarea>
          </mat-form-field>

          <div class="form-actions-row">
            <button class="btn-secondary" (click)="showAddCourseForm = false">Annuler</button>
            <button class="btn-primary" (click)="addCourse()" [disabled]="!newCourse.titre.trim() || !newCourse.description.trim() || saving">
              {{ saving ? 'Ajout...' : 'Ajouter au Catalogue' }}
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    }

    <!-- Liste du catalogue -->
    <div class="catalogue-grid">
      @for (course of catalogue$ | async; track course.id) {
        <mat-card class="course-card">
          <mat-card-content>
            <div class="course-card-header">
              <span class="course-duration-badge">{{ course.duree }} Heures</span>
            </div>
            <h3 class="course-title">{{ course.titre }}</h3>
            <p class="course-desc">{{ course.description }}</p>
          </mat-card-content>
        </mat-card>
      } @empty {
        <div class="empty-state w-100">
          <p>Le catalogue des formations est actuellement vide.</p>
        </div>
      }
    </div>
  }
</div>
`, styles: ["/* src/app/features/carrieres/formations/formations.component.scss */\n.section-page {\n  padding: 24px;\n  max-width: 1300px;\n  margin: 0 auto;\n}\n.sec-breadcrumb {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: #64748b;\n  margin-bottom: 20px;\n}\n.sec-breadcrumb .link {\n  cursor: pointer;\n  font-weight: 500;\n  color: #0060B3;\n}\n.sec-breadcrumb .link:hover {\n  text-decoration: underline;\n}\n.sec-breadcrumb .sep {\n  color: #cbd5e1;\n}\n.sec-breadcrumb .current {\n  color: #1e293b;\n  font-weight: 600;\n}\n.header-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.header-info h1 {\n  font-size: 20px;\n  font-weight: 700;\n  color: #003366;\n  margin: 0 0 4px;\n}\n.header-info p {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n}\n.btn-primary {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  padding: 10px 18px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-primary:hover {\n  background: #004885;\n}\n.btn-primary:disabled {\n  background: #94a3b8;\n  cursor: not-allowed;\n}\n.btn-secondary {\n  background: #f1f5f9;\n  color: #475569;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  padding: 10px 16px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-secondary:hover {\n  background: #e2e8f0;\n}\n.tabs-header {\n  display: flex;\n  gap: 8px;\n  border-bottom: 2px solid #e2e8f0;\n  margin-bottom: 24px;\n}\n.tab-btn {\n  background: transparent;\n  border: none;\n  padding: 12px 20px;\n  font-size: 14px;\n  font-weight: 600;\n  color: #64748b;\n  cursor: pointer;\n  position: relative;\n  transition: all 0.2s;\n}\n.tab-btn:hover {\n  color: #0060B3;\n}\n.tab-btn.active {\n  color: #0060B3;\n  border-bottom: 3px solid #0060B3;\n  margin-bottom: -2px;\n}\n.add-card {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;\n  background: #ffffff !important;\n  padding: 8px;\n}\n.add-card mat-card-header mat-card-title {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.form-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n  margin-top: 12px;\n}\n@media (max-width: 768px) {\n  .form-grid {\n    grid-template-columns: 1fr;\n  }\n}\n.w-100 {\n  width: 100%;\n}\n.form-actions-row {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 16px;\n}\n.table-card {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  background: #ffffff !important;\n}\n.table-card mat-card-header {\n  padding: 16px 20px;\n  border-bottom: 1px solid #f1f5f9;\n}\n.table-card mat-card-header mat-card-title {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.table-card mat-card-content {\n  padding: 0 !important;\n  overflow-x: auto;\n}\n.data-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.data-table th {\n  padding: 12px 16px;\n  font-weight: 600;\n  color: #64748b;\n  font-size: 11.5px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.data-table td {\n  padding: 12px 16px;\n  color: #1e293b;\n  border-bottom: 1px solid #f1f5f9;\n}\n.data-table tr:hover td {\n  background: #f8fafc;\n}\n.text-right {\n  text-align: right;\n}\n.sub-text {\n  font-size: 11.5px;\n  color: #64748b;\n}\n.status-pill {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 20px;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.status-pill.valide {\n  background: #dcfce7;\n  color: #15803d;\n}\n.status-pill.propose {\n  background: #fef3c7;\n  color: #d97706;\n}\n.status-pill.rejete {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.actions-group {\n  display: flex;\n  gap: 6px;\n  justify-content: flex-end;\n}\n.btn-action-small {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 6px;\n  padding: 4px 10px;\n  font-size: 11.5px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-action-small:hover {\n  background: #004885;\n}\n.btn-action-small.accent {\n  background: #16a34a;\n}\n.btn-action-small.accent:hover {\n  background: #15803d;\n}\n.btn-action-small.danger {\n  background: transparent;\n  color: #dc2626;\n  border: 1px solid #fca5a5;\n}\n.btn-action-small.danger:hover {\n  background: #fee2e2;\n}\n.catalogue-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 20px;\n}\n.course-card {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  background: #ffffff !important;\n  transition: transform 0.2s;\n}\n.course-card:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08) !important;\n}\n.course-duration-badge {\n  display: inline-block;\n  background: #eff6ff;\n  color: #0060B3;\n  padding: 3px 8px;\n  border-radius: 6px;\n  font-size: 11.5px;\n  font-weight: 700;\n  margin-bottom: 8px;\n}\n.course-title {\n  font-size: 15px;\n  font-weight: 700;\n  color: #003366;\n  margin: 0 0 6px;\n}\n.course-desc {\n  font-size: 12.5px;\n  color: #475569;\n  line-height: 1.5;\n  margin: 0;\n}\n.empty-state {\n  padding: 40px 20px;\n  text-align: center;\n  color: #64748b;\n  font-size: 14px;\n}\n/*# sourceMappingURL=formations.component.css.map */\n"] }]
  }], () => [{ type: CarrieresService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormationsComponent, { className: "FormationsComponent", filePath: "src/app/features/carrieres/formations/formations.component.ts", lineNumber: 12 });
})();

// src/app/features/carrieres/evaluations/evaluations.component.ts
var _forTrack04 = ($index, $item) => $item.id;
function EvaluationsComponent_Conditional_18_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emp_r3 = ctx.$implicit;
    \u0275\u0275property("value", emp_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate4(" ", emp_r3.matricule, " \u2014 ", emp_r3.nom, " ", emp_r3.prenom, " (", emp_r3.fonction || emp_r3.poste || "Agent", ") ");
  }
}
function EvaluationsComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 9)(1, "mat-card-header")(2, "mat-card-title");
    \u0275\u0275text(3, "Fiche de Notation Annuelle Collaborateur");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "mat-card-content")(5, "div", 11)(6, "mat-form-field", 12)(7, "mat-label");
    \u0275\u0275text(8, "Collaborateur \xE9valu\xE9 *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "mat-select", 13);
    \u0275\u0275twoWayListener("ngModelChange", function EvaluationsComponent_Conditional_18_Template_mat_select_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newNotation.employeeId, $event) || (ctx_r1.newNotation.employeeId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(10, EvaluationsComponent_Conditional_18_For_11_Template, 2, 5, "mat-option", 14, _forTrack04);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "mat-form-field", 12)(13, "mat-label");
    \u0275\u0275text(14, "Exercice d'\xE9valuation *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "input", 15);
    \u0275\u0275twoWayListener("ngModelChange", function EvaluationsComponent_Conditional_18_Template_input_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newNotation.exercice, $event) || (ctx_r1.newNotation.exercice = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "mat-form-field", 12)(17, "mat-label");
    \u0275\u0275text(18, "Date de l'\xE9valuation *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "input", 16);
    \u0275\u0275twoWayListener("ngModelChange", function EvaluationsComponent_Conditional_18_Template_input_ngModelChange_19_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newNotation.dateEvaluation, $event) || (ctx_r1.newNotation.dateEvaluation = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "mat-form-field", 12)(21, "mat-label");
    \u0275\u0275text(22, "Nom / R\xF4le de l'\xE9valuateur *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "input", 17);
    \u0275\u0275twoWayListener("ngModelChange", function EvaluationsComponent_Conditional_18_Template_input_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newNotation.evaluateur, $event) || (ctx_r1.newNotation.evaluateur = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 18)(25, "div", 19)(26, "label", 20);
    \u0275\u0275text(27, "1. Atteinte des Objectifs (Coeff 40%)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "input", 21);
    \u0275\u0275twoWayListener("ngModelChange", function EvaluationsComponent_Conditional_18_Template_input_ngModelChange_28_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newNotation.noteObjectifs, $event) || (ctx_r1.newNotation.noteObjectifs = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 22);
    \u0275\u0275text(30, "Note sur 20");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 19)(32, "label", 20);
    \u0275\u0275text(33, "2. Comp\xE9tences & Rigueur (Coeff 40%)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "input", 21);
    \u0275\u0275twoWayListener("ngModelChange", function EvaluationsComponent_Conditional_18_Template_input_ngModelChange_34_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newNotation.noteCompetences, $event) || (ctx_r1.newNotation.noteCompetences = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span", 22);
    \u0275\u0275text(36, "Note sur 20");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 19)(38, "label", 20);
    \u0275\u0275text(39, "3. Comportement & \xC9thique (Coeff 20%)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "input", 21);
    \u0275\u0275twoWayListener("ngModelChange", function EvaluationsComponent_Conditional_18_Template_input_ngModelChange_40_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newNotation.noteComportement, $event) || (ctx_r1.newNotation.noteComportement = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "span", 22);
    \u0275\u0275text(42, "Note sur 20");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "div", 23)(44, "span", 24);
    \u0275\u0275text(45, "NOTE GLOBALE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "span", 25);
    \u0275\u0275text(47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "span", 26);
    \u0275\u0275text(49);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(50, "div", 27)(51, "mat-form-field", 28)(52, "mat-label");
    \u0275\u0275text(53, "Appr\xE9ciation g\xE9n\xE9rale & Recommandations de carri\xE8re");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "textarea", 29);
    \u0275\u0275twoWayListener("ngModelChange", function EvaluationsComponent_Conditional_18_Template_textarea_ngModelChange_54_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newNotation.appreciation, $event) || (ctx_r1.newNotation.appreciation = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(55, "div", 30)(56, "button", 31);
    \u0275\u0275listener("click", function EvaluationsComponent_Conditional_18_Template_button_click_56_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showAddForm = false);
    });
    \u0275\u0275text(57, "Annuler");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "button", 32);
    \u0275\u0275listener("click", function EvaluationsComponent_Conditional_18_Template_button_click_58_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveNotation());
    });
    \u0275\u0275text(59);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newNotation.employeeId);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.employees);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newNotation.exercice);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newNotation.dateEvaluation);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newNotation.evaluateur);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newNotation.noteObjectifs);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newNotation.noteCompetences);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newNotation.noteComportement);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r1.computedNoteGlobale, " / 20");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.autoAppreciation);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newNotation.appreciation);
    \u0275\u0275property("placeholder", ctx_r1.autoAppreciation);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r1.newNotation.employeeId || ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.saving ? "Enregistrement..." : "Enregistrer & Valider la Notation", " ");
  }
}
function EvaluationsComponent_Conditional_24_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "p");
    \u0275\u0275text(2, "Aucune notation enregistr\xE9e dans la base de donn\xE9es PostgreSQL. Cliquez sur ");
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "Nouvelle \xC9valuation");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " pour ajouter la premi\xE8re note.");
    \u0275\u0275elementEnd()();
  }
}
function EvaluationsComponent_Conditional_24_Conditional_1_For_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 35);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 35);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 35);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 35)(17, "span", 37);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td")(20, "span", 38);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "td");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "td", 36)(25, "button", 39);
    \u0275\u0275listener("click", function EvaluationsComponent_Conditional_24_Conditional_1_For_25_Template_button_click_25_listener() {
      const n_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.deleteNotation(n_r5.id));
    });
    \u0275\u0275text(26, "Supprimer");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const n_r5 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(n_r5.exercice);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((n_r5.employee == null ? null : n_r5.employee.matricule) || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" \u2014 ", n_r5.employee == null ? null : n_r5.employee.nom, " ", n_r5.employee == null ? null : n_r5.employee.prenom, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((n_r5.employee == null ? null : n_r5.employee.fonction) || (n_r5.employee == null ? null : n_r5.employee.poste) || "Agent");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", n_r5.noteObjectifs, " / 20");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", n_r5.noteCompetences, " / 20");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", n_r5.noteComportement, " / 20");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("high", (n_r5.noteGlobale || 0) >= 15)("med", (n_r5.noteGlobale || 0) >= 12 && (n_r5.noteGlobale || 0) < 15)("low", (n_r5.noteGlobale || 0) < 12);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", n_r5.noteGlobale, " / 20 ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(n_r5.appreciation || "Conforme");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(n_r5.evaluateur || "DRH");
  }
}
function EvaluationsComponent_Conditional_24_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 34)(1, "thead")(2, "tr")(3, "th");
    \u0275\u0275text(4, "Exercice");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Matricule & Agent");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Fonction");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 35);
    \u0275\u0275text(10, "Objectifs (40%)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 35);
    \u0275\u0275text(12, "Comp\xE9tences (40%)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 35);
    \u0275\u0275text(14, "Comportement (20%)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 35);
    \u0275\u0275text(16, "Note Globale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Appr\xE9ciation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "\xC9valuateur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th", 36);
    \u0275\u0275text(22, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "tbody");
    \u0275\u0275repeaterCreate(24, EvaluationsComponent_Conditional_24_Conditional_1_For_25_Template, 27, 17, "tr", null, _forTrack04);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const notations_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance(24);
    \u0275\u0275repeater(notations_r6);
  }
}
function EvaluationsComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EvaluationsComponent_Conditional_24_Conditional_0_Template, 6, 0, "div", 33)(1, EvaluationsComponent_Conditional_24_Conditional_1_Template, 26, 0, "table", 34);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.length === 0 ? 0 : 1);
  }
}
var EvaluationsComponent = class _EvaluationsComponent {
  carrieresService;
  employeeService;
  router;
  notations$;
  employees = [];
  showAddForm = false;
  saving = false;
  selectedExercice = (/* @__PURE__ */ new Date()).getFullYear();
  searchQuery = "";
  newNotation = {
    employeeId: null,
    exercice: (/* @__PURE__ */ new Date()).getFullYear(),
    noteObjectifs: 15,
    noteCompetences: 15,
    noteComportement: 16,
    evaluateur: "DRH / Superviseur",
    appreciation: "",
    dateEvaluation: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  constructor(carrieresService, employeeService, router) {
    this.carrieresService = carrieresService;
    this.employeeService = employeeService;
    this.router = router;
  }
  ngOnInit() {
    this.notations$ = this.carrieresService.notations$;
    this.carrieresService.fetchNotations().subscribe();
    this.loadEmployees();
  }
  loadEmployees() {
    this.employeeService.getAll().subscribe({
      next: (list) => {
        this.employees = (list || []).filter((e) => e.statut !== "Inactif");
      },
      error: () => {
        this.employees = [];
      }
    });
  }
  get computedNoteGlobale() {
    const o = Number(this.newNotation.noteObjectifs) || 0;
    const c = Number(this.newNotation.noteCompetences) || 0;
    const b = Number(this.newNotation.noteComportement) || 0;
    const g = o * 0.4 + c * 0.4 + b * 0.2;
    return Math.round(g * 100) / 100;
  }
  get autoAppreciation() {
    const g = this.computedNoteGlobale;
    if (g >= 18)
      return "Excellent \u2014 \xC9ligible \xE0 un avancement acc\xE9l\xE9r\xE9";
    if (g >= 15)
      return "Tr\xE8s Bien \u2014 Avancement normal recommand\xE9";
    if (g >= 12)
      return "Bien \u2014 Performance satisfaisante";
    if (g >= 10)
      return "Passable \u2014 Conforme aux exigences";
    return "Insuffisant \u2014 Plan de formation et accompagnement requis";
  }
  onFilterExercice() {
    this.carrieresService.fetchNotations(this.selectedExercice).subscribe();
  }
  saveNotation() {
    if (!this.newNotation.employeeId)
      return;
    this.saving = true;
    const emp = this.employees.find((e) => String(e.id) === String(this.newNotation.employeeId));
    const payload = {
      employee: { id: Number(this.newNotation.employeeId) },
      exercice: Number(this.newNotation.exercice),
      noteObjectifs: Number(this.newNotation.noteObjectifs),
      noteCompetences: Number(this.newNotation.noteCompetences),
      noteComportement: Number(this.newNotation.noteComportement),
      noteGlobale: this.computedNoteGlobale,
      appreciation: this.newNotation.appreciation.trim() || this.autoAppreciation,
      evaluateur: this.newNotation.evaluateur.trim(),
      dateEvaluation: this.newNotation.dateEvaluation,
      statut: "VALIDE"
    };
    this.carrieresService.saveNotation(payload).subscribe({
      next: () => {
        this.saving = false;
        this.showAddForm = false;
        this.resetForm();
        this.carrieresService.fetchNotations().subscribe();
      },
      error: () => {
        this.saving = false;
      }
    });
  }
  deleteNotation(id) {
    if (!id)
      return;
    if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer cette \xE9valuation ?")) {
      this.carrieresService.deleteNotation(id).subscribe({
        next: () => {
          this.carrieresService.fetchNotations().subscribe();
        }
      });
    }
  }
  resetForm() {
    this.newNotation = {
      employeeId: null,
      exercice: (/* @__PURE__ */ new Date()).getFullYear(),
      noteObjectifs: 15,
      noteCompetences: 15,
      noteComportement: 16,
      evaluateur: "DRH / Superviseur",
      appreciation: "",
      dateEvaluation: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
  }
  goBack() {
    this.router.navigate(["/carrieres"]);
  }
  static \u0275fac = function EvaluationsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EvaluationsComponent)(\u0275\u0275directiveInject(CarrieresService), \u0275\u0275directiveInject(EmployeeService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EvaluationsComponent, selectors: [["app-evaluations"]], standalone: false, decls: 26, vars: 5, consts: [[1, "section-page"], [1, "sec-breadcrumb"], [1, "link", 3, "click"], [1, "sep"], [1, "current"], [1, "header-container"], [1, "header-info"], [1, "header-actions"], [1, "btn-primary", 3, "click"], [1, "add-card", "animate-fade-in", "mb-4"], [1, "table-card"], [1, "form-grid"], ["appearance", "outline"], [3, "ngModelChange", "ngModel"], [3, "value"], ["matInput", "", "type", "number", 3, "ngModelChange", "ngModel"], ["matInput", "", "type", "date", 3, "ngModelChange", "ngModel"], ["matInput", "", "placeholder", "Ex: Directeur des Op\xE9rations / N+1", 3, "ngModelChange", "ngModel"], [1, "scores-box"], [1, "score-input-col"], [1, "score-label"], ["type", "number", "min", "0", "max", "20", "step", "0.5", 1, "custom-num-input", 3, "ngModelChange", "ngModel"], [1, "sub-note"], [1, "score-summary-col"], [1, "summary-title"], [1, "summary-val"], [1, "summary-apprec"], [1, "full-width", "mt-3"], ["appearance", "outline", 1, "w-100"], ["matInput", "", "rows", "3", 3, "ngModelChange", "ngModel", "placeholder"], [1, "form-actions-row"], [1, "btn-secondary", 3, "click"], [1, "btn-primary", 3, "click", "disabled"], [1, "empty-state"], [1, "data-table"], [1, "text-center"], [1, "text-right"], [1, "badge-grade"], [1, "appreciation-text"], [1, "btn-delete", 3, "click"]], template: function EvaluationsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "span", 2);
      \u0275\u0275listener("click", function EvaluationsComponent_Template_span_click_2_listener() {
        return ctx.goBack();
      });
      \u0275\u0275text(3, "Carri\xE8res & Comp\xE9tences");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "span", 3);
      \u0275\u0275text(5, "\u203A");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span", 4);
      \u0275\u0275text(7, "Notations & \xC9valuations de Performance");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "div")(11, "h1");
      \u0275\u0275text(12, "Notations Annuelles de Performance");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p");
      \u0275\u0275text(14, "Bilan annuel chiffr\xE9 des collaborateurs de la Banque Postale selon les 3 axes r\xE9glementaires (/20).");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(15, "div", 7)(16, "button", 8);
      \u0275\u0275listener("click", function EvaluationsComponent_Template_button_click_16_listener() {
        return ctx.showAddForm = !ctx.showAddForm;
      });
      \u0275\u0275text(17);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(18, EvaluationsComponent_Conditional_18_Template, 60, 13, "mat-card", 9);
      \u0275\u0275elementStart(19, "mat-card", 10)(20, "mat-card-header")(21, "mat-card-title");
      \u0275\u0275text(22, "Historique des Notations de Performance");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "mat-card-content");
      \u0275\u0275conditionalCreate(24, EvaluationsComponent_Conditional_24_Template, 2, 1);
      \u0275\u0275pipe(25, "async");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_2_0;
      \u0275\u0275advance(17);
      \u0275\u0275textInterpolate1(" ", ctx.showAddForm ? "Fermer le formulaire" : "Nouvelle \xC9valuation", " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showAddForm ? 18 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275conditional((tmp_2_0 = \u0275\u0275pipeBind1(25, 3, ctx.notations$)) ? 24 : -1, tmp_2_0);
    }
  }, dependencies: [DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatFormField, MatLabel, MatInput, MatSelect, MatOption, AsyncPipe], styles: ["\n\n.section-page[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1300px;\n  margin: 0 auto;\n}\n.sec-breadcrumb[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: #64748b;\n  margin-bottom: 20px;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%] {\n  cursor: pointer;\n  font-weight: 500;\n  color: #0060B3;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .sep[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .current[_ngcontent-%COMP%] {\n  color: #1e293b;\n  font-weight: 600;\n}\n.header-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.header-info[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 700;\n  color: #003366;\n  margin: 0 0 4px;\n}\n.header-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  padding: 10px 18px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-primary[_ngcontent-%COMP%]:hover {\n  background: #004885;\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  background: #94a3b8;\n  cursor: not-allowed;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background: #f1f5f9;\n  color: #475569;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  padding: 10px 16px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background: #e2e8f0;\n}\n.btn-delete[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #ef4444;\n  border: 1px solid #fca5a5;\n  border-radius: 6px;\n  padding: 4px 10px;\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-delete[_ngcontent-%COMP%]:hover {\n  background: #fee2e2;\n}\n.add-card[_ngcontent-%COMP%] {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;\n  background: #ffffff !important;\n  padding: 8px;\n}\n.add-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 2fr 1fr 1fr 2fr;\n  gap: 16px;\n  margin-top: 12px;\n}\n@media (max-width: 900px) {\n  .form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.scores-box[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr) 1.5fr;\n  gap: 16px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 16px;\n  margin-top: 16px;\n}\n@media (max-width: 900px) {\n  .scores-box[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.score-input-col[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.score-input-col[_ngcontent-%COMP%]   .score-label[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  color: #334155;\n}\n.score-input-col[_ngcontent-%COMP%]   .custom-num-input[_ngcontent-%COMP%] {\n  height: 38px;\n  padding: 6px 12px;\n  border-radius: 6px;\n  border: 1px solid #cbd5e1;\n  font-size: 16px;\n  font-weight: 700;\n  color: #003366;\n  background: #ffffff;\n}\n.score-input-col[_ngcontent-%COMP%]   .custom-num-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #0060B3;\n}\n.score-input-col[_ngcontent-%COMP%]   .sub-note[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #94a3b8;\n}\n.score-summary-col[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  background: #ffffff;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.score-summary-col[_ngcontent-%COMP%]   .summary-title[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 700;\n  color: #64748b;\n  letter-spacing: 0.5px;\n}\n.score-summary-col[_ngcontent-%COMP%]   .summary-val[_ngcontent-%COMP%] {\n  font-size: 22px;\n  font-weight: 800;\n  color: #0060B3;\n}\n.score-summary-col[_ngcontent-%COMP%]   .summary-apprec[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  font-weight: 600;\n  color: #16a34a;\n  margin-top: 2px;\n}\n.w-100[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.form-actions-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 16px;\n}\n.table-card[_ngcontent-%COMP%] {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  background: #ffffff !important;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%] {\n  padding: 16px 20px;\n  border-bottom: 1px solid #f1f5f9;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  padding: 0 !important;\n  overflow-x: auto;\n}\n.data-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  font-weight: 600;\n  color: #64748b;\n  font-size: 11.5px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.data-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  color: #1e293b;\n  border-bottom: 1px solid #f1f5f9;\n}\n.data-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] {\n  background: #f8fafc;\n}\n.text-center[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.badge-grade[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 3px 8px;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: 700;\n}\n.badge-grade.high[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.badge-grade.med[_ngcontent-%COMP%] {\n  background: #e0f2fe;\n  color: #0369a1;\n}\n.badge-grade.low[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.appreciation-text[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #475569;\n  font-style: italic;\n}\n.empty-state[_ngcontent-%COMP%] {\n  padding: 40px 20px;\n  text-align: center;\n  color: #64748b;\n  font-size: 14px;\n}\n/*# sourceMappingURL=evaluations.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EvaluationsComponent, [{
    type: Component,
    args: [{ selector: "app-evaluations", standalone: false, template: `<div class="section-page">
  <div class="sec-breadcrumb">
    <span class="link" (click)="goBack()">Carri\xE8res & Comp\xE9tences</span>
    <span class="sep">\u203A</span>
    <span class="current">Notations & \xC9valuations de Performance</span>
  </div>

  <div class="header-container">
    <div class="header-info">
      <div>
        <h1>Notations Annuelles de Performance</h1>
        <p>Bilan annuel chiffr\xE9 des collaborateurs de la Banque Postale selon les 3 axes r\xE9glementaires (/20).</p>
      </div>
    </div>
    
    <div class="header-actions">
      <button class="btn-primary" (click)="showAddForm = !showAddForm">
        {{ showAddForm ? 'Fermer le formulaire' : 'Nouvelle \xC9valuation' }}
      </button>
    </div>
  </div>

  <!-- Formulaire de Notation Annuelle -->
  @if (showAddForm) {
    <mat-card class="add-card animate-fade-in mb-4">
      <mat-card-header>
        <mat-card-title>Fiche de Notation Annuelle Collaborateur</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Collaborateur \xE9valu\xE9 *</mat-label>
            <mat-select [(ngModel)]="newNotation.employeeId">
              @for (emp of employees; track emp.id) {
                <mat-option [value]="emp.id">
                  {{ emp.matricule }} \u2014 {{ emp.nom }} {{ emp.prenom }} ({{ emp.fonction || emp.poste || 'Agent' }})
                </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Exercice d'\xE9valuation *</mat-label>
            <input matInput type="number" [(ngModel)]="newNotation.exercice">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date de l'\xE9valuation *</mat-label>
            <input matInput type="date" [(ngModel)]="newNotation.dateEvaluation">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Nom / R\xF4le de l'\xE9valuateur *</mat-label>
            <input matInput [(ngModel)]="newNotation.evaluateur" placeholder="Ex: Directeur des Op\xE9rations / N+1">
          </mat-form-field>
        </div>

        <div class="scores-box">
          <div class="score-input-col">
            <label class="score-label">1. Atteinte des Objectifs (Coeff 40%)</label>
            <input type="number" min="0" max="20" step="0.5" [(ngModel)]="newNotation.noteObjectifs" class="custom-num-input">
            <span class="sub-note">Note sur 20</span>
          </div>

          <div class="score-input-col">
            <label class="score-label">2. Comp\xE9tences & Rigueur (Coeff 40%)</label>
            <input type="number" min="0" max="20" step="0.5" [(ngModel)]="newNotation.noteCompetences" class="custom-num-input">
            <span class="sub-note">Note sur 20</span>
          </div>

          <div class="score-input-col">
            <label class="score-label">3. Comportement & \xC9thique (Coeff 20%)</label>
            <input type="number" min="0" max="20" step="0.5" [(ngModel)]="newNotation.noteComportement" class="custom-num-input">
            <span class="sub-note">Note sur 20</span>
          </div>

          <div class="score-summary-col">
            <span class="summary-title">NOTE GLOBALE</span>
            <span class="summary-val">{{ computedNoteGlobale }} / 20</span>
            <span class="summary-apprec">{{ autoAppreciation }}</span>
          </div>
        </div>

        <div class="full-width mt-3">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Appr\xE9ciation g\xE9n\xE9rale & Recommandations de carri\xE8re</mat-label>
            <textarea matInput [(ngModel)]="newNotation.appreciation" rows="3" [placeholder]="autoAppreciation"></textarea>
          </mat-form-field>
        </div>

        <div class="form-actions-row">
          <button class="btn-secondary" (click)="showAddForm = false">Annuler</button>
          <button class="btn-primary" (click)="saveNotation()" [disabled]="!newNotation.employeeId || saving">
            {{ saving ? 'Enregistrement...' : 'Enregistrer & Valider la Notation' }}
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  }

  <!-- Tableau Historique des Notations -->
  <mat-card class="table-card">
    <mat-card-header>
      <mat-card-title>Historique des Notations de Performance</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      @if (notations$ | async; as notations) {
        @if (notations.length === 0) {
          <div class="empty-state">
            <p>Aucune notation enregistr\xE9e dans la base de donn\xE9es PostgreSQL. Cliquez sur <strong>Nouvelle \xC9valuation</strong> pour ajouter la premi\xE8re note.</p>
          </div>
        } @else {
          <table class="data-table">
            <thead>
              <tr>
                <th>Exercice</th>
                <th>Matricule & Agent</th>
                <th>Fonction</th>
                <th class="text-center">Objectifs (40%)</th>
                <th class="text-center">Comp\xE9tences (40%)</th>
                <th class="text-center">Comportement (20%)</th>
                <th class="text-center">Note Globale</th>
                <th>Appr\xE9ciation</th>
                <th>\xC9valuateur</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (n of notations; track n.id) {
                <tr>
                  <td><strong>{{ n.exercice }}</strong></td>
                  <td>
                    <strong>{{ n.employee?.matricule || '\u2014' }}</strong> \u2014 {{ n.employee?.nom }} {{ n.employee?.prenom }}
                  </td>
                  <td>{{ n.employee?.fonction || n.employee?.poste || 'Agent' }}</td>
                  <td class="text-center">{{ n.noteObjectifs }} / 20</td>
                  <td class="text-center">{{ n.noteCompetences }} / 20</td>
                  <td class="text-center">{{ n.noteComportement }} / 20</td>
                  <td class="text-center">
                    <span class="badge-grade" [class.high]="(n.noteGlobale || 0) >= 15" [class.med]="(n.noteGlobale || 0) >= 12 && (n.noteGlobale || 0) < 15" [class.low]="(n.noteGlobale || 0) < 12">
                      {{ n.noteGlobale }} / 20
                    </span>
                  </td>
                  <td>
                    <span class="appreciation-text">{{ n.appreciation || 'Conforme' }}</span>
                  </td>
                  <td>{{ n.evaluateur || 'DRH' }}</td>
                  <td class="text-right">
                    <button class="btn-delete" (click)="deleteNotation(n.id)">Supprimer</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      }
    </mat-card-content>
  </mat-card>
</div>
`, styles: ["/* src/app/features/carrieres/evaluations/evaluations.component.scss */\n.section-page {\n  padding: 24px;\n  max-width: 1300px;\n  margin: 0 auto;\n}\n.sec-breadcrumb {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: #64748b;\n  margin-bottom: 20px;\n}\n.sec-breadcrumb .link {\n  cursor: pointer;\n  font-weight: 500;\n  color: #0060B3;\n}\n.sec-breadcrumb .link:hover {\n  text-decoration: underline;\n}\n.sec-breadcrumb .sep {\n  color: #cbd5e1;\n}\n.sec-breadcrumb .current {\n  color: #1e293b;\n  font-weight: 600;\n}\n.header-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.header-info h1 {\n  font-size: 20px;\n  font-weight: 700;\n  color: #003366;\n  margin: 0 0 4px;\n}\n.header-info p {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n}\n.btn-primary {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  padding: 10px 18px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-primary:hover {\n  background: #004885;\n}\n.btn-primary:disabled {\n  background: #94a3b8;\n  cursor: not-allowed;\n}\n.btn-secondary {\n  background: #f1f5f9;\n  color: #475569;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  padding: 10px 16px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-secondary:hover {\n  background: #e2e8f0;\n}\n.btn-delete {\n  background: transparent;\n  color: #ef4444;\n  border: 1px solid #fca5a5;\n  border-radius: 6px;\n  padding: 4px 10px;\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-delete:hover {\n  background: #fee2e2;\n}\n.add-card {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;\n  background: #ffffff !important;\n  padding: 8px;\n}\n.add-card mat-card-header mat-card-title {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.form-grid {\n  display: grid;\n  grid-template-columns: 2fr 1fr 1fr 2fr;\n  gap: 16px;\n  margin-top: 12px;\n}\n@media (max-width: 900px) {\n  .form-grid {\n    grid-template-columns: 1fr;\n  }\n}\n.scores-box {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr) 1.5fr;\n  gap: 16px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 16px;\n  margin-top: 16px;\n}\n@media (max-width: 900px) {\n  .scores-box {\n    grid-template-columns: 1fr;\n  }\n}\n.score-input-col {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.score-input-col .score-label {\n  font-size: 12px;\n  font-weight: 600;\n  color: #334155;\n}\n.score-input-col .custom-num-input {\n  height: 38px;\n  padding: 6px 12px;\n  border-radius: 6px;\n  border: 1px solid #cbd5e1;\n  font-size: 16px;\n  font-weight: 700;\n  color: #003366;\n  background: #ffffff;\n}\n.score-input-col .custom-num-input:focus {\n  outline: none;\n  border-color: #0060B3;\n}\n.score-input-col .sub-note {\n  font-size: 11px;\n  color: #94a3b8;\n}\n.score-summary-col {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  background: #ffffff;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.score-summary-col .summary-title {\n  font-size: 11px;\n  font-weight: 700;\n  color: #64748b;\n  letter-spacing: 0.5px;\n}\n.score-summary-col .summary-val {\n  font-size: 22px;\n  font-weight: 800;\n  color: #0060B3;\n}\n.score-summary-col .summary-apprec {\n  font-size: 11.5px;\n  font-weight: 600;\n  color: #16a34a;\n  margin-top: 2px;\n}\n.w-100 {\n  width: 100%;\n}\n.form-actions-row {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 16px;\n}\n.table-card {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  background: #ffffff !important;\n}\n.table-card mat-card-header {\n  padding: 16px 20px;\n  border-bottom: 1px solid #f1f5f9;\n}\n.table-card mat-card-header mat-card-title {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.table-card mat-card-content {\n  padding: 0 !important;\n  overflow-x: auto;\n}\n.data-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.data-table th {\n  padding: 12px 16px;\n  font-weight: 600;\n  color: #64748b;\n  font-size: 11.5px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.data-table td {\n  padding: 12px 16px;\n  color: #1e293b;\n  border-bottom: 1px solid #f1f5f9;\n}\n.data-table tr:hover td {\n  background: #f8fafc;\n}\n.text-center {\n  text-align: center;\n}\n.text-right {\n  text-align: right;\n}\n.badge-grade {\n  display: inline-block;\n  padding: 3px 8px;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: 700;\n}\n.badge-grade.high {\n  background: #dcfce7;\n  color: #15803d;\n}\n.badge-grade.med {\n  background: #e0f2fe;\n  color: #0369a1;\n}\n.badge-grade.low {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.appreciation-text {\n  font-size: 12px;\n  color: #475569;\n  font-style: italic;\n}\n.empty-state {\n  padding: 40px 20px;\n  text-align: center;\n  color: #64748b;\n  font-size: 14px;\n}\n/*# sourceMappingURL=evaluations.component.css.map */\n"] }]
  }], () => [{ type: CarrieresService }, { type: EmployeeService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EvaluationsComponent, { className: "EvaluationsComponent", filePath: "src/app/features/carrieres/evaluations/evaluations.component.ts", lineNumber: 14 });
})();

// src/app/features/carrieres/mobilite/mobilite.component.ts
var _forTrack05 = ($index, $item) => $item.id;
function MobiliteComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.messageFeedback, " ");
  }
}
function MobiliteComponent_Conditional_79_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "p");
    \u0275\u0275text(2, "Aucune proposition d'avancement trouv\xE9e. Cliquez sur ");
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "G\xE9n\xE9rer les Propositions d'Avancement");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " pour analyser les agents \xE9ligibles.");
    \u0275\u0275elementEnd()();
  }
}
function MobiliteComponent_Conditional_80_For_23_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 41)(1, "button", 44);
    \u0275\u0275listener("click", function MobiliteComponent_Conditional_80_For_23_Conditional_27_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r2);
      const a_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.validerAvancement(a_r3.id));
    });
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 45);
    \u0275\u0275listener("click", function MobiliteComponent_Conditional_80_For_23_Conditional_27_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r2);
      const a_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.rejeterAvancement(a_r3.id));
    });
    \u0275\u0275text(4, " Rejeter ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const a_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.processingId === a_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.processingId === a_r3.id ? "Validation..." : "Valider", " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.processingId === a_r3.id);
  }
}
function MobiliteComponent_Conditional_80_For_23_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 42);
    \u0275\u0275text(1, "Appliqu\xE9 en Paie");
    \u0275\u0275elementEnd();
  }
}
function MobiliteComponent_Conditional_80_For_23_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 43);
    \u0275\u0275text(1, "Ajourn\xE9");
    \u0275\u0275elementEnd();
  }
}
function MobiliteComponent_Conditional_80_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "br");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 34)(9, "span", 36);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 34)(12, "span", 37);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td", 35);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 38);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 39);
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "td")(24, "span", 40);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "td", 34);
    \u0275\u0275conditionalCreate(27, MobiliteComponent_Conditional_80_For_23_Conditional_27_Template, 5, 3, "div", 41)(28, MobiliteComponent_Conditional_80_For_23_Conditional_28_Template, 2, 0, "span", 42)(29, MobiliteComponent_Conditional_80_For_23_Conditional_29_Template, 2, 0, "span", 43);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const a_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((a_r3.employee == null ? null : a_r3.employee.matricule) || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", a_r3.employee == null ? null : a_r3.employee.nom, " ", a_r3.employee == null ? null : a_r3.employee.prenom, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((a_r3.employee == null ? null : a_r3.employee.fonction) || (a_r3.employee == null ? null : a_r3.employee.poste) || "Agent Bancaire");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((a_r3.echelonActuel == null ? null : a_r3.echelonActuel.libelle) || "E01");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((a_r3.echelonPropose == null ? null : a_r3.echelonPropose.libelle) || "E02");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(16, 17, a_r3.salaireBaseActuel, "1.0-0"), " F");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(19, 20, a_r3.salaireBasePropose, "1.0-0"), " F");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("+", \u0275\u0275pipeBind2(22, 23, a_r3.ecartSalaire, "1.0-0"), " F");
    \u0275\u0275advance(3);
    \u0275\u0275classProp("valide", a_r3.statut === "VALIDE")("propose", a_r3.statut === "PROPOSE")("rejete", a_r3.statut === "REJETE");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", a_r3.statut, " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(a_r3.statut === "PROPOSE" ? 27 : a_r3.statut === "VALIDE" ? 28 : 29);
  }
}
function MobiliteComponent_Conditional_80_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 33)(1, "thead")(2, "tr")(3, "th");
    \u0275\u0275text(4, "Agent & Matricule");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Fonction");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 34);
    \u0275\u0275text(8, "\xC9chelon Actuel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 34);
    \u0275\u0275text(10, "\xC9chelon Propos\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 35);
    \u0275\u0275text(12, "Salaire Base Actuel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 35);
    \u0275\u0275text(14, "Nouveau Salaire");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 35);
    \u0275\u0275text(16, "Diff\xE9rence Mensuelle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Statut");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 34);
    \u0275\u0275text(20, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "tbody");
    \u0275\u0275repeaterCreate(22, MobiliteComponent_Conditional_80_For_23_Template, 30, 26, "tr", null, _forTrack05);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(22);
    \u0275\u0275repeater(ctx_r0.filteredAvancements);
  }
}
var MobiliteComponent = class _MobiliteComponent {
  carrieresService;
  router;
  avancements$;
  allAvancements = [];
  filteredAvancements = [];
  selectedExercice = (/* @__PURE__ */ new Date()).getFullYear();
  searchQuery = "";
  statutFilter = "";
  generating = false;
  processingId = null;
  messageFeedback = "";
  constructor(carrieresService, router) {
    this.carrieresService = carrieresService;
    this.router = router;
  }
  ngOnInit() {
    this.avancements$ = this.carrieresService.avancements$;
    this.loadAvancements();
  }
  loadAvancements() {
    this.carrieresService.fetchAvancements(this.selectedExercice).subscribe({
      next: (list) => {
        this.allAvancements = list || [];
        this.applyFilter();
      },
      error: () => {
        this.allAvancements = [];
        this.filteredAvancements = [];
      }
    });
  }
  genererPropositions() {
    this.generating = true;
    this.messageFeedback = "";
    this.carrieresService.genererAvancements(this.selectedExercice).subscribe({
      next: (list) => {
        this.generating = false;
        this.allAvancements = list || [];
        this.applyFilter();
        this.messageFeedback = `Propositions d'avancement pour l'exercice ${this.selectedExercice} g\xE9n\xE9r\xE9es avec succ\xE8s (${this.allAvancements.length} agents).`;
      },
      error: (err) => {
        this.generating = false;
        this.messageFeedback = "Erreur lors de la g\xE9n\xE9ration des propositions.";
      }
    });
  }
  validerAvancement(id) {
    if (!id)
      return;
    this.processingId = id;
    this.carrieresService.validerAvancement(id, "Commission de Carri\xE8re BPBF").subscribe({
      next: () => {
        this.processingId = null;
        this.loadAvancements();
        this.messageFeedback = "Avancement valid\xE9 avec succ\xE8s ! L'\xE9chelon et le salaire de base de l'agent ont \xE9t\xE9 mis \xE0 jour dans PostgreSQL.";
      },
      error: () => {
        this.processingId = null;
        this.messageFeedback = "Erreur lors de la validation de l'avancement.";
      }
    });
  }
  rejeterAvancement(id) {
    if (!id)
      return;
    const motif = prompt("Veuillez pr\xE9ciser le motif de rejet / ajournement :", "Avis d\xE9favorable de la commission");
    if (!motif)
      return;
    this.processingId = id;
    this.carrieresService.rejeterAvancement(id, motif).subscribe({
      next: () => {
        this.processingId = null;
        this.loadAvancements();
      },
      error: () => {
        this.processingId = null;
      }
    });
  }
  applyFilter() {
    const q = (this.searchQuery || "").trim().toLowerCase();
    this.filteredAvancements = this.allAvancements.filter((a) => {
      const matricule = (a.employee?.matricule || "").toLowerCase();
      const nom = (a.employee?.nom || "").toLowerCase();
      const prenom = (a.employee?.prenom || "").toLowerCase();
      const matchText = !q || matricule.includes(q) || nom.includes(q) || prenom.includes(q);
      const matchStatut = !this.statutFilter || a.statut === this.statutFilter;
      return matchText && matchStatut;
    });
  }
  get totalImpactMasseSalariale() {
    return this.allAvancements.filter((a) => a.statut === "VALIDE" || a.statut === "PROPOSE").reduce((sum, a) => sum + (a.ecartSalaire || 0), 0);
  }
  get countProposes() {
    return this.allAvancements.filter((a) => a.statut === "PROPOSE").length;
  }
  get countValides() {
    return this.allAvancements.filter((a) => a.statut === "VALIDE").length;
  }
  goBack() {
    this.router.navigate(["/carrieres"]);
  }
  static \u0275fac = function MobiliteComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MobiliteComponent)(\u0275\u0275directiveInject(CarrieresService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MobiliteComponent, selectors: [["app-mobilite"]], standalone: false, decls: 81, vars: 15, consts: [[1, "section-page"], [1, "sec-breadcrumb"], [1, "link", 3, "click"], [1, "sep"], [1, "current"], [1, "header-container"], [1, "header-info"], [1, "header-actions"], [1, "btn-primary", 3, "click", "disabled"], [1, "alert-info"], [1, "kpi-grid"], [1, "kpi-card"], [1, "kpi-info"], [1, "kpi-value"], [1, "kpi-label"], [1, "kpi-sub"], [1, "kpi-card", "highlight"], [1, "kpi-value", "text-primary"], [1, "kpi-card", "success"], [1, "kpi-value", "text-success"], [1, "kpi-value", "text-accent"], [1, "filters-row"], [1, "filter-item"], ["type", "number", 1, "input-ctrl", "w-120", 3, "ngModelChange", "change", "ngModel"], [1, "filter-item", "flex-1"], ["type", "text", "placeholder", "Matricule, nom, pr\xE9nom...", 1, "input-ctrl", "w-100", 3, "ngModelChange", "input", "ngModel"], [1, "input-ctrl", 3, "ngModelChange", "change", "ngModel"], ["value", ""], ["value", "PROPOSE"], ["value", "VALIDE"], ["value", "REJETE"], [1, "table-card"], [1, "empty-state"], [1, "data-table"], [1, "text-center"], [1, "text-right"], [1, "badge-neutral"], [1, "badge-proposed"], [1, "text-right", "font-bold"], [1, "text-right", "text-success", "font-bold"], [1, "status-pill"], [1, "actions-group"], [1, "text-muted-check"], [1, "text-muted-reject"], [1, "btn-validate", 3, "click", "disabled"], [1, "btn-reject", 3, "click", "disabled"]], template: function MobiliteComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "span", 2);
      \u0275\u0275listener("click", function MobiliteComponent_Template_span_click_2_listener() {
        return ctx.goBack();
      });
      \u0275\u0275text(3, "Carri\xE8res & Comp\xE9tences");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "span", 3);
      \u0275\u0275text(5, "\u203A");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span", 4);
      \u0275\u0275text(7, "Avancements d'\xC9chelon");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "div")(11, "h1");
      \u0275\u0275text(12, "Avancements d'\xC9chelon \u2014 Convention Bancaire (E01 \xE0 E15)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p");
      \u0275\u0275text(14, "G\xE9n\xE9ration automatique des propositions d'avancement par anciennet\xE9 d'\xE9chelon (2 ans) et mise \xE0 jour directe des salaires de base dans PostgreSQL.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(15, "div", 7)(16, "button", 8);
      \u0275\u0275listener("click", function MobiliteComponent_Template_button_click_16_listener() {
        return ctx.genererPropositions();
      });
      \u0275\u0275text(17);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(18, MobiliteComponent_Conditional_18_Template, 2, 1, "div", 9);
      \u0275\u0275elementStart(19, "div", 10)(20, "div", 11)(21, "div", 12)(22, "span", 13);
      \u0275\u0275text(23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "span", 14);
      \u0275\u0275text(25, "Total Agents \xC9ligibles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "span", 15);
      \u0275\u0275text(27);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(28, "div", 16)(29, "div", 12)(30, "span", 17);
      \u0275\u0275text(31);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "span", 14);
      \u0275\u0275text(33, "Propositions en Attente");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "span", 15);
      \u0275\u0275text(35, "\xC0 valider par la commission");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(36, "div", 18)(37, "div", 12)(38, "span", 19);
      \u0275\u0275text(39);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "span", 14);
      \u0275\u0275text(41, "Avancements Valid\xE9s");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "span", 15);
      \u0275\u0275text(43, "Effectifs en paie");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(44, "div", 11)(45, "div", 12)(46, "span", 20);
      \u0275\u0275text(47);
      \u0275\u0275pipe(48, "number");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "span", 14);
      \u0275\u0275text(50, "Impact Masse Salariale");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "span", 15);
      \u0275\u0275text(52, "Accroissement mensuel brut");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(53, "div", 21)(54, "div", 22)(55, "label");
      \u0275\u0275text(56, "Exercice :");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "input", 23);
      \u0275\u0275twoWayListener("ngModelChange", function MobiliteComponent_Template_input_ngModelChange_57_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.selectedExercice, $event) || (ctx.selectedExercice = $event);
        return $event;
      });
      \u0275\u0275listener("change", function MobiliteComponent_Template_input_change_57_listener() {
        return ctx.loadAvancements();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(58, "div", 24)(59, "label");
      \u0275\u0275text(60, "Rechercher un agent :");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "input", 25);
      \u0275\u0275twoWayListener("ngModelChange", function MobiliteComponent_Template_input_ngModelChange_61_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return $event;
      });
      \u0275\u0275listener("input", function MobiliteComponent_Template_input_input_61_listener() {
        return ctx.applyFilter();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(62, "div", 22)(63, "label");
      \u0275\u0275text(64, "Statut :");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(65, "select", 26);
      \u0275\u0275twoWayListener("ngModelChange", function MobiliteComponent_Template_select_ngModelChange_65_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.statutFilter, $event) || (ctx.statutFilter = $event);
        return $event;
      });
      \u0275\u0275listener("change", function MobiliteComponent_Template_select_change_65_listener() {
        return ctx.applyFilter();
      });
      \u0275\u0275elementStart(66, "option", 27);
      \u0275\u0275text(67, "Tous les statuts");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "option", 28);
      \u0275\u0275text(69, "En attente (PROPOS\xC9)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "option", 29);
      \u0275\u0275text(71, "Valid\xE9");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(72, "option", 30);
      \u0275\u0275text(73, "Rejet\xE9");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(74, "mat-card", 31)(75, "mat-card-header")(76, "mat-card-title");
      \u0275\u0275text(77, "Tableau Comparatif des Avancements d'\xC9chelon");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(78, "mat-card-content");
      \u0275\u0275conditionalCreate(79, MobiliteComponent_Conditional_79_Template, 6, 0, "div", 32)(80, MobiliteComponent_Conditional_80_Template, 24, 0, "table", 33);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(16);
      \u0275\u0275property("disabled", ctx.generating);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.generating ? "G\xE9n\xE9ration en cours..." : "G\xE9n\xE9rer les Propositions d'Avancement", " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.messageFeedback ? 18 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.allAvancements.length);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1("Exercice ", ctx.selectedExercice);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.countProposes);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.countValides);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate1("+", \u0275\u0275pipeBind2(48, 12, ctx.totalImpactMasseSalariale, "1.0-0"), " F");
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.selectedExercice);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.statutFilter);
      \u0275\u0275advance(14);
      \u0275\u0275conditional(ctx.filteredAvancements.length === 0 ? 79 : 80);
    }
  }, dependencies: [NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, MatCard, MatCardContent, MatCardHeader, MatCardTitle, DecimalPipe], styles: ["\n\n.section-page[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1300px;\n  margin: 0 auto;\n}\n.sec-breadcrumb[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: #64748b;\n  margin-bottom: 20px;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%] {\n  cursor: pointer;\n  font-weight: 500;\n  color: #0060B3;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .sep[_ngcontent-%COMP%] {\n  color: #cbd5e1;\n}\n.sec-breadcrumb[_ngcontent-%COMP%]   .current[_ngcontent-%COMP%] {\n  color: #1e293b;\n  font-weight: 600;\n}\n.header-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.header-info[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 700;\n  color: #003366;\n  margin: 0 0 4px;\n}\n.header-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  padding: 10px 18px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-primary[_ngcontent-%COMP%]:hover {\n  background: #004885;\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  background: #94a3b8;\n  cursor: not-allowed;\n}\n.alert-info[_ngcontent-%COMP%] {\n  background: #eff6ff;\n  border: 1px solid #bfdbfe;\n  color: #1e40af;\n  padding: 12px 16px;\n  border-radius: 8px;\n  font-size: 13px;\n  font-weight: 500;\n  margin-bottom: 20px;\n}\n.kpi-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 16px;\n  margin-bottom: 24px;\n}\n@media (max-width: 900px) {\n  .kpi-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 600px) {\n  .kpi-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.kpi-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  padding: 18px 20px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.kpi-card.highlight[_ngcontent-%COMP%] {\n  border-left: 4px solid #0060B3;\n}\n.kpi-card.success[_ngcontent-%COMP%] {\n  border-left: 4px solid #16a34a;\n}\n.kpi-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.kpi-value[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 800;\n  color: #1e293b;\n}\n.kpi-value.text-primary[_ngcontent-%COMP%] {\n  color: #0060B3;\n}\n.kpi-value.text-success[_ngcontent-%COMP%] {\n  color: #16a34a;\n}\n.kpi-value.text-accent[_ngcontent-%COMP%] {\n  color: #0284c7;\n}\n.kpi-label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  color: #475569;\n}\n.kpi-sub[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #94a3b8;\n}\n.filters-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  background: #ffffff;\n  padding: 14px 20px;\n  border-radius: 10px;\n  border: 1px solid #e2e8f0;\n  margin-bottom: 24px;\n  flex-wrap: wrap;\n}\n.filters-row[_ngcontent-%COMP%]   .filter-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.filters-row[_ngcontent-%COMP%]   .filter-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  font-weight: 600;\n  color: #475569;\n  white-space: nowrap;\n}\n.filters-row[_ngcontent-%COMP%]   .flex-1[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.filters-row[_ngcontent-%COMP%]   .w-120[_ngcontent-%COMP%] {\n  width: 120px;\n}\n.filters-row[_ngcontent-%COMP%]   .w-100[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.filters-row[_ngcontent-%COMP%]   .input-ctrl[_ngcontent-%COMP%] {\n  height: 38px;\n  padding: 6px 12px;\n  border-radius: 6px;\n  border: 1px solid #cbd5e1;\n  font-size: 13px;\n  color: #1e293b;\n  background: #ffffff;\n}\n.filters-row[_ngcontent-%COMP%]   .input-ctrl[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #0060B3;\n}\n.table-card[_ngcontent-%COMP%] {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  background: #ffffff !important;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%] {\n  padding: 16px 20px;\n  border-bottom: 1px solid #f1f5f9;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.table-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  padding: 0 !important;\n  overflow-x: auto;\n}\n.data-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  font-weight: 600;\n  color: #64748b;\n  font-size: 11.5px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.data-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  color: #1e293b;\n  border-bottom: 1px solid #f1f5f9;\n}\n.data-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] {\n  background: #f8fafc;\n}\n.text-center[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.font-bold[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.text-success[_ngcontent-%COMP%] {\n  color: #16a34a;\n}\n.badge-neutral[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 3px 8px;\n  background: #f1f5f9;\n  color: #475569;\n  font-weight: 700;\n  border-radius: 6px;\n  font-size: 12px;\n}\n.badge-proposed[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 3px 8px;\n  background: #e0f2fe;\n  color: #0284c7;\n  font-weight: 700;\n  border-radius: 6px;\n  font-size: 12px;\n}\n.status-pill[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 20px;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.status-pill.propose[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #d97706;\n}\n.status-pill.valide[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.status-pill.rejete[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.actions-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  justify-content: center;\n}\n.btn-validate[_ngcontent-%COMP%] {\n  background: #16a34a;\n  color: #ffffff;\n  border: none;\n  border-radius: 6px;\n  padding: 6px 12px;\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-validate[_ngcontent-%COMP%]:hover {\n  background: #15803d;\n}\n.btn-validate[_ngcontent-%COMP%]:disabled {\n  background: #86efac;\n  cursor: not-allowed;\n}\n.btn-reject[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #dc2626;\n  border: 1px solid #fca5a5;\n  border-radius: 6px;\n  padding: 5px 10px;\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-reject[_ngcontent-%COMP%]:hover {\n  background: #fee2e2;\n}\n.text-muted-check[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #16a34a;\n  font-weight: 600;\n}\n.text-muted-reject[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #dc2626;\n  font-weight: 600;\n}\n.empty-state[_ngcontent-%COMP%] {\n  padding: 40px 20px;\n  text-align: center;\n  color: #64748b;\n  font-size: 14px;\n}\n/*# sourceMappingURL=mobilite.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MobiliteComponent, [{
    type: Component,
    args: [{ selector: "app-mobilite", standalone: false, template: `<div class="section-page">
  <div class="sec-breadcrumb">
    <span class="link" (click)="goBack()">Carri\xE8res & Comp\xE9tences</span>
    <span class="sep">\u203A</span>
    <span class="current">Avancements d'\xC9chelon</span>
  </div>

  <div class="header-container">
    <div class="header-info">
      <div>
        <h1>Avancements d'\xC9chelon \u2014 Convention Bancaire (E01 \xE0 E15)</h1>
        <p>G\xE9n\xE9ration automatique des propositions d'avancement par anciennet\xE9 d'\xE9chelon (2 ans) et mise \xE0 jour directe des salaires de base dans PostgreSQL.</p>
      </div>
    </div>
    
    <div class="header-actions">
      <button class="btn-primary" (click)="genererPropositions()" [disabled]="generating">
        {{ generating ? 'G\xE9n\xE9ration en cours...' : 'G\xE9n\xE9rer les Propositions d\\'Avancement' }}
      </button>
    </div>
  </div>

  <!-- Message de retour / notification -->
  @if (messageFeedback) {
    <div class="alert-info">
      {{ messageFeedback }}
    </div>
  }

  <!-- KPIs Avancement -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-info">
        <span class="kpi-value">{{ allAvancements.length }}</span>
        <span class="kpi-label">Total Agents \xC9ligibles</span>
        <span class="kpi-sub">Exercice {{ selectedExercice }}</span>
      </div>
    </div>

    <div class="kpi-card highlight">
      <div class="kpi-info">
        <span class="kpi-value text-primary">{{ countProposes }}</span>
        <span class="kpi-label">Propositions en Attente</span>
        <span class="kpi-sub">\xC0 valider par la commission</span>
      </div>
    </div>

    <div class="kpi-card success">
      <div class="kpi-info">
        <span class="kpi-value text-success">{{ countValides }}</span>
        <span class="kpi-label">Avancements Valid\xE9s</span>
        <span class="kpi-sub">Effectifs en paie</span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-info">
        <span class="kpi-value text-accent">+{{ totalImpactMasseSalariale | number:'1.0-0' }} F</span>
        <span class="kpi-label">Impact Masse Salariale</span>
        <span class="kpi-sub">Accroissement mensuel brut</span>
      </div>
    </div>
  </div>

  <!-- Barre de Filtres -->
  <div class="filters-row">
    <div class="filter-item">
      <label>Exercice :</label>
      <input type="number" [(ngModel)]="selectedExercice" (change)="loadAvancements()" class="input-ctrl w-120">
    </div>

    <div class="filter-item flex-1">
      <label>Rechercher un agent :</label>
      <input type="text" [(ngModel)]="searchQuery" (input)="applyFilter()" placeholder="Matricule, nom, pr\xE9nom..." class="input-ctrl w-100">
    </div>

    <div class="filter-item">
      <label>Statut :</label>
      <select [(ngModel)]="statutFilter" (change)="applyFilter()" class="input-ctrl">
        <option value="">Tous les statuts</option>
        <option value="PROPOSE">En attente (PROPOS\xC9)</option>
        <option value="VALIDE">Valid\xE9</option>
        <option value="REJETE">Rejet\xE9</option>
      </select>
    </div>
  </div>

  <!-- Tableau Comparatif des Avancements -->
  <mat-card class="table-card">
    <mat-card-header>
      <mat-card-title>Tableau Comparatif des Avancements d'\xC9chelon</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      @if (filteredAvancements.length === 0) {
        <div class="empty-state">
          <p>Aucune proposition d'avancement trouv\xE9e. Cliquez sur <strong>G\xE9n\xE9rer les Propositions d'Avancement</strong> pour analyser les agents \xE9ligibles.</p>
        </div>
      } @else {
        <table class="data-table">
          <thead>
            <tr>
              <th>Agent & Matricule</th>
              <th>Fonction</th>
              <th class="text-center">\xC9chelon Actuel</th>
              <th class="text-center">\xC9chelon Propos\xE9</th>
              <th class="text-right">Salaire Base Actuel</th>
              <th class="text-right">Nouveau Salaire</th>
              <th class="text-right">Diff\xE9rence Mensuelle</th>
              <th>Statut</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (a of filteredAvancements; track a.id) {
              <tr>
                <td>
                  <strong>{{ a.employee?.matricule || '\u2014' }}</strong><br>
                  {{ a.employee?.nom }} {{ a.employee?.prenom }}
                </td>
                <td>{{ a.employee?.fonction || a.employee?.poste || 'Agent Bancaire' }}</td>
                <td class="text-center">
                  <span class="badge-neutral">{{ a.echelonActuel?.libelle || 'E01' }}</span>
                </td>
                <td class="text-center">
                  <span class="badge-proposed">{{ a.echelonPropose?.libelle || 'E02' }}</span>
                </td>
                <td class="text-right">{{ a.salaireBaseActuel | number:'1.0-0' }} F</td>
                <td class="text-right font-bold">{{ a.salaireBasePropose | number:'1.0-0' }} F</td>
                <td class="text-right text-success font-bold">+{{ a.ecartSalaire | number:'1.0-0' }} F</td>
                <td>
                  <span class="status-pill" [class.valide]="a.statut === 'VALIDE'" [class.propose]="a.statut === 'PROPOSE'" [class.rejete]="a.statut === 'REJETE'">
                    {{ a.statut }}
                  </span>
                </td>
                <td class="text-center">
                  @if (a.statut === 'PROPOSE') {
                    <div class="actions-group">
                      <button class="btn-validate" (click)="validerAvancement(a.id)" [disabled]="processingId === a.id">
                        {{ processingId === a.id ? 'Validation...' : 'Valider' }}
                      </button>
                      <button class="btn-reject" (click)="rejeterAvancement(a.id)" [disabled]="processingId === a.id">
                        Rejeter
                      </button>
                    </div>
                  } @else if (a.statut === 'VALIDE') {
                    <span class="text-muted-check">Appliqu\xE9 en Paie</span>
                  } @else {
                    <span class="text-muted-reject">Ajourn\xE9</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </mat-card-content>
  </mat-card>
</div>
`, styles: ["/* src/app/features/carrieres/mobilite/mobilite.component.scss */\n.section-page {\n  padding: 24px;\n  max-width: 1300px;\n  margin: 0 auto;\n}\n.sec-breadcrumb {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: #64748b;\n  margin-bottom: 20px;\n}\n.sec-breadcrumb .link {\n  cursor: pointer;\n  font-weight: 500;\n  color: #0060B3;\n}\n.sec-breadcrumb .link:hover {\n  text-decoration: underline;\n}\n.sec-breadcrumb .sep {\n  color: #cbd5e1;\n}\n.sec-breadcrumb .current {\n  color: #1e293b;\n  font-weight: 600;\n}\n.header-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.header-info h1 {\n  font-size: 20px;\n  font-weight: 700;\n  color: #003366;\n  margin: 0 0 4px;\n}\n.header-info p {\n  font-size: 13px;\n  color: #64748b;\n  margin: 0;\n}\n.btn-primary {\n  background: #0060B3;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  padding: 10px 18px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.btn-primary:hover {\n  background: #004885;\n}\n.btn-primary:disabled {\n  background: #94a3b8;\n  cursor: not-allowed;\n}\n.alert-info {\n  background: #eff6ff;\n  border: 1px solid #bfdbfe;\n  color: #1e40af;\n  padding: 12px 16px;\n  border-radius: 8px;\n  font-size: 13px;\n  font-weight: 500;\n  margin-bottom: 20px;\n}\n.kpi-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 16px;\n  margin-bottom: 24px;\n}\n@media (max-width: 900px) {\n  .kpi-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 600px) {\n  .kpi-grid {\n    grid-template-columns: 1fr;\n  }\n}\n.kpi-card {\n  border-radius: 12px;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  padding: 18px 20px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.kpi-card.highlight {\n  border-left: 4px solid #0060B3;\n}\n.kpi-card.success {\n  border-left: 4px solid #16a34a;\n}\n.kpi-info {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.kpi-value {\n  font-size: 24px;\n  font-weight: 800;\n  color: #1e293b;\n}\n.kpi-value.text-primary {\n  color: #0060B3;\n}\n.kpi-value.text-success {\n  color: #16a34a;\n}\n.kpi-value.text-accent {\n  color: #0284c7;\n}\n.kpi-label {\n  font-size: 13px;\n  font-weight: 600;\n  color: #475569;\n}\n.kpi-sub {\n  font-size: 11px;\n  color: #94a3b8;\n}\n.filters-row {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  background: #ffffff;\n  padding: 14px 20px;\n  border-radius: 10px;\n  border: 1px solid #e2e8f0;\n  margin-bottom: 24px;\n  flex-wrap: wrap;\n}\n.filters-row .filter-item {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.filters-row .filter-item label {\n  font-size: 12.5px;\n  font-weight: 600;\n  color: #475569;\n  white-space: nowrap;\n}\n.filters-row .flex-1 {\n  flex: 1;\n}\n.filters-row .w-120 {\n  width: 120px;\n}\n.filters-row .w-100 {\n  width: 100%;\n}\n.filters-row .input-ctrl {\n  height: 38px;\n  padding: 6px 12px;\n  border-radius: 6px;\n  border: 1px solid #cbd5e1;\n  font-size: 13px;\n  color: #1e293b;\n  background: #ffffff;\n}\n.filters-row .input-ctrl:focus {\n  outline: none;\n  border-color: #0060B3;\n}\n.table-card {\n  border-radius: 12px !important;\n  border: 1px solid #e2e8f0 !important;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;\n  background: #ffffff !important;\n}\n.table-card mat-card-header {\n  padding: 16px 20px;\n  border-bottom: 1px solid #f1f5f9;\n}\n.table-card mat-card-header mat-card-title {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #003366 !important;\n}\n.table-card mat-card-content {\n  padding: 0 !important;\n  overflow-x: auto;\n}\n.data-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.data-table th {\n  padding: 12px 16px;\n  font-weight: 600;\n  color: #64748b;\n  font-size: 11.5px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  background: #f8fafc;\n  border-bottom: 1px solid #e2e8f0;\n}\n.data-table td {\n  padding: 12px 16px;\n  color: #1e293b;\n  border-bottom: 1px solid #f1f5f9;\n}\n.data-table tr:hover td {\n  background: #f8fafc;\n}\n.text-center {\n  text-align: center;\n}\n.text-right {\n  text-align: right;\n}\n.font-bold {\n  font-weight: 700;\n}\n.text-success {\n  color: #16a34a;\n}\n.badge-neutral {\n  display: inline-block;\n  padding: 3px 8px;\n  background: #f1f5f9;\n  color: #475569;\n  font-weight: 700;\n  border-radius: 6px;\n  font-size: 12px;\n}\n.badge-proposed {\n  display: inline-block;\n  padding: 3px 8px;\n  background: #e0f2fe;\n  color: #0284c7;\n  font-weight: 700;\n  border-radius: 6px;\n  font-size: 12px;\n}\n.status-pill {\n  display: inline-block;\n  padding: 4px 10px;\n  border-radius: 20px;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.status-pill.propose {\n  background: #fef3c7;\n  color: #d97706;\n}\n.status-pill.valide {\n  background: #dcfce7;\n  color: #15803d;\n}\n.status-pill.rejete {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.actions-group {\n  display: flex;\n  gap: 6px;\n  justify-content: center;\n}\n.btn-validate {\n  background: #16a34a;\n  color: #ffffff;\n  border: none;\n  border-radius: 6px;\n  padding: 6px 12px;\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-validate:hover {\n  background: #15803d;\n}\n.btn-validate:disabled {\n  background: #86efac;\n  cursor: not-allowed;\n}\n.btn-reject {\n  background: transparent;\n  color: #dc2626;\n  border: 1px solid #fca5a5;\n  border-radius: 6px;\n  padding: 5px 10px;\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.btn-reject:hover {\n  background: #fee2e2;\n}\n.text-muted-check {\n  font-size: 12px;\n  color: #16a34a;\n  font-weight: 600;\n}\n.text-muted-reject {\n  font-size: 12px;\n  color: #dc2626;\n  font-weight: 600;\n}\n.empty-state {\n  padding: 40px 20px;\n  text-align: center;\n  color: #64748b;\n  font-size: 14px;\n}\n/*# sourceMappingURL=mobilite.component.css.map */\n"] }]
  }], () => [{ type: CarrieresService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MobiliteComponent, { className: "MobiliteComponent", filePath: "src/app/features/carrieres/mobilite/mobilite.component.ts", lineNumber: 12 });
})();

// src/app/features/carrieres/carrieres-routing.module.ts
var routes = [
  { path: "", component: CarrieresOverviewComponent },
  { path: "competences", component: CompetencesComponent },
  { path: "competences/referentiel", component: CompetencesComponent },
  { path: "competences/evaluation", component: CompetencesComponent },
  { path: "formations", component: FormationsComponent },
  { path: "formations/plan", component: FormationsComponent },
  { path: "formations/catalogue", component: FormationsComponent },
  { path: "formations/suivi", component: FormationsComponent },
  { path: "evaluations", component: EvaluationsComponent },
  { path: "evaluations/entretiens", component: EvaluationsComponent },
  { path: "evaluations/objectifs", component: EvaluationsComponent },
  { path: "mobilite", component: MobiliteComponent },
  { path: "**", redirectTo: "" }
];
var CarrieresRoutingModule = class _CarrieresRoutingModule {
  static \u0275fac = function CarrieresRoutingModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CarrieresRoutingModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _CarrieresRoutingModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarrieresRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    }]
  }], null, null);
})();

// src/app/features/carrieres/carrieres.module.ts
var CarrieresModule = class _CarrieresModule {
  static \u0275fac = function CarrieresModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CarrieresModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _CarrieresModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CarrieresRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarrieresModule, [{
    type: NgModule,
    args: [{
      declarations: [
        CarrieresOverviewComponent,
        CompetencesComponent,
        FormationsComponent,
        EvaluationsComponent,
        MobiliteComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CarrieresRoutingModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule
      ]
    }]
  }], null, null);
})();
export {
  CarrieresModule
};
//# sourceMappingURL=chunk-K5UDLUWZ.js.map
