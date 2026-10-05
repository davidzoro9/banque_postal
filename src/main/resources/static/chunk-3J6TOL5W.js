import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
  MatPaginator,
  MatPaginatorModule,
  MatSort,
  MatSortHeader,
  MatSortModule
} from "./chunk-3VRLFWFA.js";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
  MatTableModule
} from "./chunk-5RLSCRL2.js";
import {
  DashboardStatsService
} from "./chunk-KAOKD54J.js";
import {
  DbRefService,
  EmployeeService
} from "./chunk-FKQXGGLV.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-4WFLA3F7.js";
import {
  MatSelect,
  MatSelectModule
} from "./chunk-YW2FT4B4.js";
import "./chunk-GVHJNHWR.js";
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatHint,
  MatInput,
  MatInputModule,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-ERAYOYWZ.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NumberValueAccessor,
  ReactiveFormsModule,
  Validators
} from "./chunk-FA5ALSQZ.js";
import {
  APP_MODULES,
  ModuleNavService
} from "./chunk-RXXLECU7.js";
import "./chunk-X5O3HNQ4.js";
import {
  MatCard,
  MatCardActions,
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
  MatIcon,
  MatIconButton,
  MatIconModule,
  MatRipple,
  MatRippleModule
} from "./chunk-HVOECBWJ.js";
import {
  ActivatedRoute,
  CommonModule,
  Component,
  DecimalPipe,
  NgModule,
  Router,
  RouterModule,
  ViewChild,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinterpolate,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-YWFD3R2X.js";

// src/app/features/donnees-base/db-overview/db-overview.component.ts
var _forTrack0 = ($index, $item) => $item.title;
function DbOverviewComponent_For_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 16);
    \u0275\u0275listener("click", function DbOverviewComponent_For_56_Template_mat_card_click_0_listener() {
      const s_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.navigateTo(s_r2.route));
    });
    \u0275\u0275elementStart(1, "mat-card-header")(2, "div", 17)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "mat-card-title");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 18);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "mat-card-content")(10, "p");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "mat-card-actions", 19)(13, "button", 20);
    \u0275\u0275text(14, " Acc\xE9der \xE0 la gestion ");
    \u0275\u0275elementStart(15, "mat-icon");
    \u0275\u0275text(16, "arrow_forward");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const s_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background", s_r2.color);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r2.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r2.badge);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r2.description);
  }
}
var DbOverviewComponent = class _DbOverviewComponent {
  router;
  statsService;
  stats = null;
  isLoading = true;
  hasError = false;
  sections = [
    {
      title: "Structure Organisationnelle",
      badge: "Emplois, Fonctions...",
      icon: "business",
      color: "#0288d1",
      description: "Gestion des emplois, nominations, directions, d\xE9partements, services, agences et types de contrat.",
      route: "/donnees-base/admin/emploi"
    },
    {
      title: "Grille Salariale Conventionnelle",
      badge: "Cat\xE9gories & \xC9chelons",
      icon: "table_chart",
      color: "#f57c00",
      description: "D\xE9finition des cat\xE9gories professionnelles, groupes conventionnels et grilles de salaire de base brut.",
      route: "/donnees-base/admin/grille-salariale"
    },
    {
      title: "Grille Indemnitaire",
      badge: "Types & R\xE8gles",
      icon: "paid",
      color: "#2e7d32",
      description: "Configuration des types d'indemnit\xE9s, primes de fonction et r\xE8gles d'attribution par poste.",
      route: "/donnees-base/admin/param-indemnite"
    },
    {
      title: "Param\xE9trage des \xC2ges de Retraite",
      badge: "Retraite & \xC2ges l\xE9gaux",
      icon: "event_repeat",
      color: "#00897b",
      description: "Configuration des \xE2ges l\xE9gaux de d\xE9part \xE0 la retraite (Non-cadres 60 ans, Cadres 65 ans).",
      route: "/donnees-base/admin/param-retraite"
    }
  ];
  constructor(router, statsService) {
    this.router = router;
    this.statsService = statsService;
  }
  ngOnInit() {
    this.loadStats();
  }
  loadStats() {
    this.isLoading = true;
    this.hasError = false;
    this.statsService.getDonneesBaseStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.isLoading = false;
        if (res.emploisCount !== void 0) {
          this.sections[0].badge = `${res.emploisCount} emplois g\xE9r\xE9s`;
        }
        if (res.grillesCount !== void 0) {
          this.sections[1].badge = `${res.grillesCount} \xE9chelons & grilles`;
        }
        if (res.indemnitesCount !== void 0) {
          this.sections[2].badge = `${res.indemnitesCount} types configur\xE9s`;
        }
      },
      error: (err) => {
        console.error("Erreur chargement statistiques Param\xE8tres G\xE9n\xE9raux:", err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
  navigateTo(route) {
    this.router.navigate([route]);
  }
  static \u0275fac = function DbOverviewComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DbOverviewComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(DashboardStatsService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DbOverviewComponent, selectors: [["app-db-overview"]], standalone: false, decls: 57, vars: 4, consts: [[1, "profils-overview-page"], [1, "header-banner"], [1, "header-content"], [1, "header-icon"], [1, "stats-grid"], [1, "stat-card"], [1, "stat-icon", 2, "background", "#e3f2fd", "color", "#0288d1"], [1, "stat-info"], [1, "stat-value"], [1, "stat-label"], [1, "stat-icon", 2, "background", "#e8f5e9", "color", "#2e7d32"], [1, "stat-icon", 2, "background", "#fff3e0", "color", "#f57c00"], [1, "stat-icon", 2, "background", "#f3e5f5", "color", "#7b1fa2"], [1, "section-title"], [1, "sections-grid"], ["matRipple", "", 1, "section-card"], ["matRipple", "", 1, "section-card", 3, "click"], [1, "card-header-icon"], [1, "badge-chip"], ["align", "end"], ["mat-button", "", "color", "primary"]], template: function DbOverviewComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "mat-icon");
      \u0275\u0275text(5, "storage");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div")(7, "h1");
      \u0275\u0275text(8, "Param\xE8tres G\xE9n\xE9raux & R\xE9f\xE9rentiels");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p");
      \u0275\u0275text(10, "Param\xE9trage centralis\xE9 de la structure organisationnelle, grille salariale conventionnelle et r\xE9f\xE9rentiels du syst\xE8me SIRH.");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(11, "div", 4)(12, "mat-card", 5)(13, "mat-card-content")(14, "div", 6)(15, "mat-icon");
      \u0275\u0275text(16, "work");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 7)(18, "span", 8);
      \u0275\u0275text(19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "span", 9);
      \u0275\u0275text(21, "Postes & Emplois");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(22, "mat-card", 5)(23, "mat-card-content")(24, "div", 10)(25, "mat-icon");
      \u0275\u0275text(26, "domain");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "div", 7)(28, "span", 8);
      \u0275\u0275text(29);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "span", 9);
      \u0275\u0275text(31, "Directions & Depts");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(32, "mat-card", 5)(33, "mat-card-content")(34, "div", 11)(35, "mat-icon");
      \u0275\u0275text(36, "table_chart");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(37, "div", 7)(38, "span", 8);
      \u0275\u0275text(39);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "span", 9);
      \u0275\u0275text(41, "Grilles & \xC9chelons");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(42, "mat-card", 5)(43, "mat-card-content")(44, "div", 12)(45, "mat-icon");
      \u0275\u0275text(46, "paid");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(47, "div", 7)(48, "span", 8);
      \u0275\u0275text(49);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "span", 9);
      \u0275\u0275text(51, "Indemnit\xE9s & Types");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(52, "h2", 13);
      \u0275\u0275text(53, "Espaces de Param\xE9trage des Donn\xE9es de Base");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "div", 14);
      \u0275\u0275repeaterCreate(55, DbOverviewComponent_For_56_Template, 17, 6, "mat-card", 15, _forTrack0);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(19);
      \u0275\u0275textInterpolate(ctx.isLoading ? "..." : (ctx.stats == null ? null : ctx.stats.emploisCount) ?? 0);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.isLoading ? "..." : (ctx.stats == null ? null : ctx.stats.directionsEtDeptsCount) ?? 0);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.isLoading ? "..." : (ctx.stats == null ? null : ctx.stats.grillesCount) ?? 0);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.isLoading ? "..." : (ctx.stats == null ? null : ctx.stats.indemnitesCount) ?? 0);
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.sections);
    }
  }, dependencies: [MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle, MatIcon, MatButton, MatRipple], styles: ["\n\n.profils-overview-page[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 24px 28px;\n  color: var(--on-surface);\n  margin-bottom: 24px;\n  box-shadow: var(--shadow-card);\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .header-icon[_ngcontent-%COMP%] {\n  background: rgba(0, 96, 179, 0.12);\n  color: #0060B3;\n  padding: 14px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .header-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 36px;\n  width: 36px;\n  height: 36px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0 0 6px 0;\n  font-size: 24px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--on-surface-3);\n  font-size: 14px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n  margin-bottom: 32px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border-radius: 12px;\n  border: 1px solid var(--border);\n  box-shadow: var(--shadow-card);\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 20px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 26px;\n  width: 26px;\n  height: 26px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  font-size: 22px;\n  font-weight: 800;\n  color: var(--on-surface);\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--on-surface-3);\n  font-weight: 500;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 700;\n  color: var(--on-surface);\n  margin: 0 0 16px 0;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border-radius: 12px;\n  border: 1px solid var(--border);\n  box-shadow: var(--shadow-card);\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);\n  border-color: #cbd5e1;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 20px 20px 10px 20px;\n  position: relative;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   .card-header-icon[_ngcontent-%COMP%] {\n  width: 42px;\n  height: 42px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   .card-header-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 22px;\n  width: 22px;\n  height: 22px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--on-surface);\n  margin: 0;\n  flex: 1;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   .badge-chip[_ngcontent-%COMP%] {\n  background: var(--surface-variant);\n  color: var(--on-surface-2);\n  font-size: 12px;\n  font-weight: 600;\n  padding: 4px 10px;\n  border-radius: 20px;\n  white-space: nowrap;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  padding: 0 20px 10px 20px !important;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--on-surface-3);\n  font-size: 13.5px;\n  line-height: 1.5;\n  margin: 0;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%] {\n  padding: 10px 20px 16px 20px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 13px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  margin-left: 4px;\n  transition: transform 0.2s ease;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover   mat-icon[_ngcontent-%COMP%] {\n  transform: translateX(4px);\n}\n@media (max-width: 768px) {\n  .profils-overview-page[_ngcontent-%COMP%] {\n    padding: 12px;\n  }\n  .profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n  .profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 12px;\n  }\n  .profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=db-overview.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DbOverviewComponent, [{
    type: Component,
    args: [{ selector: "app-db-overview", standalone: false, template: `<div class="profils-overview-page">\r
  <!-- En-t\xEAte -->\r
  <div class="header-banner">\r
    <div class="header-content">\r
      <div class="header-icon">\r
        <mat-icon>storage</mat-icon>\r
      </div>\r
      <div>\r
        <h1>Param\xE8tres G\xE9n\xE9raux & R\xE9f\xE9rentiels</h1>\r
        <p>Param\xE9trage centralis\xE9 de la structure organisationnelle, grille salariale conventionnelle et r\xE9f\xE9rentiels du syst\xE8me SIRH.</p>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Statistiques rapides -->\r
  <div class="stats-grid">\r
    <mat-card class="stat-card">\r
      <mat-card-content>\r
        <div class="stat-icon" style="background: #e3f2fd; color: #0288d1;">\r
          <mat-icon>work</mat-icon>\r
        </div>\r
        <div class="stat-info">\r
          <span class="stat-value">{{ isLoading ? '...' : (stats?.emploisCount ?? 0) }}</span>\r
          <span class="stat-label">Postes & Emplois</span>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
\r
    <mat-card class="stat-card">\r
      <mat-card-content>\r
        <div class="stat-icon" style="background: #e8f5e9; color: #2e7d32;">\r
          <mat-icon>domain</mat-icon>\r
        </div>\r
        <div class="stat-info">\r
          <span class="stat-value">{{ isLoading ? '...' : (stats?.directionsEtDeptsCount ?? 0) }}</span>\r
          <span class="stat-label">Directions & Depts</span>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
\r
    <mat-card class="stat-card">\r
      <mat-card-content>\r
        <div class="stat-icon" style="background: #fff3e0; color: #f57c00;">\r
          <mat-icon>table_chart</mat-icon>\r
        </div>\r
        <div class="stat-info">\r
          <span class="stat-value">{{ isLoading ? '...' : (stats?.grillesCount ?? 0) }}</span>\r
          <span class="stat-label">Grilles & \xC9chelons</span>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
\r
    <mat-card class="stat-card">\r
      <mat-card-content>\r
        <div class="stat-icon" style="background: #f3e5f5; color: #7b1fa2;">\r
          <mat-icon>paid</mat-icon>\r
        </div>\r
        <div class="stat-info">\r
          <span class="stat-value">{{ isLoading ? '...' : (stats?.indemnitesCount ?? 0) }}</span>\r
          <span class="stat-label">Indemnit\xE9s & Types</span>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
  </div>\r
\r
  <!-- Sections principales -->\r
  <h2 class="section-title">Espaces de Param\xE9trage des Donn\xE9es de Base</h2>\r
  <div class="sections-grid">\r
    @for (s of sections; track s.title) {\r
      <mat-card class="section-card" (click)="navigateTo(s.route)" matRipple>\r
        <mat-card-header>\r
          <div class="card-header-icon" [style.background]="s.color">\r
            <mat-icon>{{ s.icon }}</mat-icon>\r
          </div>\r
          <mat-card-title>{{ s.title }}</mat-card-title>\r
          <span class="badge-chip">{{ s.badge }}</span>\r
        </mat-card-header>\r
        <mat-card-content>\r
          <p>{{ s.description }}</p>\r
        </mat-card-content>\r
        <mat-card-actions align="end">\r
          <button mat-button color="primary">\r
            Acc\xE9der \xE0 la gestion <mat-icon>arrow_forward</mat-icon>\r
          </button>\r
        </mat-card-actions>\r
      </mat-card>\r
    }\r
  </div>\r
</div>\r
`, styles: ["/* src/app/features/donnees-base/db-overview/db-overview.component.scss */\n.profils-overview-page {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.profils-overview-page .header-banner {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 24px 28px;\n  color: var(--on-surface);\n  margin-bottom: 24px;\n  box-shadow: var(--shadow-card);\n}\n.profils-overview-page .header-banner .header-content {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n}\n.profils-overview-page .header-banner .header-content .header-icon {\n  background: rgba(0, 96, 179, 0.12);\n  color: #0060B3;\n  padding: 14px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n}\n.profils-overview-page .header-banner .header-content .header-icon mat-icon {\n  font-size: 36px;\n  width: 36px;\n  height: 36px;\n}\n.profils-overview-page .header-banner .header-content h1 {\n  margin: 0 0 6px 0;\n  font-size: 24px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.profils-overview-page .header-banner .header-content p {\n  margin: 0;\n  color: var(--on-surface-3);\n  font-size: 14px;\n}\n.profils-overview-page .stats-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n  margin-bottom: 32px;\n}\n.profils-overview-page .stats-grid .stat-card {\n  background: var(--surface);\n  border-radius: 12px;\n  border: 1px solid var(--border);\n  box-shadow: var(--shadow-card);\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 20px;\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content .stat-icon {\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content .stat-icon mat-icon {\n  font-size: 26px;\n  width: 26px;\n  height: 26px;\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content .stat-info {\n  display: flex;\n  flex-direction: column;\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content .stat-info .stat-value {\n  font-size: 22px;\n  font-weight: 800;\n  color: var(--on-surface);\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content .stat-info .stat-label {\n  font-size: 13px;\n  color: var(--on-surface-3);\n  font-weight: 500;\n}\n.profils-overview-page .section-title {\n  font-size: 18px;\n  font-weight: 700;\n  color: var(--on-surface);\n  margin: 0 0 16px 0;\n}\n.profils-overview-page .sections-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}\n.profils-overview-page .sections-grid .section-card {\n  background: var(--surface);\n  border-radius: 12px;\n  border: 1px solid var(--border);\n  box-shadow: var(--shadow-card);\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.profils-overview-page .sections-grid .section-card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);\n  border-color: #cbd5e1;\n}\n.profils-overview-page .sections-grid .section-card mat-card-header {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 20px 20px 10px 20px;\n  position: relative;\n}\n.profils-overview-page .sections-grid .section-card mat-card-header .card-header-icon {\n  width: 42px;\n  height: 42px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n}\n.profils-overview-page .sections-grid .section-card mat-card-header .card-header-icon mat-icon {\n  font-size: 22px;\n  width: 22px;\n  height: 22px;\n}\n.profils-overview-page .sections-grid .section-card mat-card-header mat-card-title {\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--on-surface);\n  margin: 0;\n  flex: 1;\n}\n.profils-overview-page .sections-grid .section-card mat-card-header .badge-chip {\n  background: var(--surface-variant);\n  color: var(--on-surface-2);\n  font-size: 12px;\n  font-weight: 600;\n  padding: 4px 10px;\n  border-radius: 20px;\n  white-space: nowrap;\n}\n.profils-overview-page .sections-grid .section-card mat-card-content {\n  padding: 0 20px 10px 20px !important;\n}\n.profils-overview-page .sections-grid .section-card mat-card-content p {\n  color: var(--on-surface-3);\n  font-size: 13.5px;\n  line-height: 1.5;\n  margin: 0;\n}\n.profils-overview-page .sections-grid .section-card mat-card-actions {\n  padding: 10px 20px 16px 20px;\n}\n.profils-overview-page .sections-grid .section-card mat-card-actions button {\n  font-weight: 600;\n  font-size: 13px;\n}\n.profils-overview-page .sections-grid .section-card mat-card-actions button mat-icon {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  margin-left: 4px;\n  transition: transform 0.2s ease;\n}\n.profils-overview-page .sections-grid .section-card mat-card-actions button:hover mat-icon {\n  transform: translateX(4px);\n}\n@media (max-width: 768px) {\n  .profils-overview-page {\n    padding: 12px;\n  }\n  .profils-overview-page .header-banner {\n    padding: 16px;\n  }\n  .profils-overview-page .header-banner .header-content {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 12px;\n  }\n  .profils-overview-page .sections-grid {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=db-overview.component.css.map */\n"] }]
  }], () => [{ type: Router }, { type: DashboardStatsService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DbOverviewComponent, { className: "DbOverviewComponent", filePath: "src/app/features/donnees-base/db-overview/db-overview.component.ts", lineNumber: 12 });
})();

// src/app/features/donnees-base/db-ref-list/db-ref-list.component.ts
var _c0 = ["dialogTpl"];
var _c1 = () => [25, 50, 100, 250];
var _c2 = () => [];
var _forTrack02 = ($index, $item) => $item.code || $item.libelle;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.id || $item.code;
function DbRefListComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "button", 44);
    \u0275\u0275listener("click", function DbRefListComponent_Conditional_15_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.setIndemniteTab("ORDINAIRE"));
    });
    \u0275\u0275elementStart(2, "div", 45)(3, "mat-icon");
    \u0275\u0275text(4, "groups");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 46)(6, "div", 47)(7, "span", 48);
    \u0275\u0275text(8, "1. Grille Statutaire");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 49);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "span", 50);
    \u0275\u0275text(12, "Logement, Transport, Suj\xE9tion (selon Groupe & Cat\xE9gorie)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "button", 44);
    \u0275\u0275listener("click", function DbRefListComponent_Conditional_15_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.setIndemniteTab("NOMINATION"));
    });
    \u0275\u0275elementStart(14, "div", 51)(15, "mat-icon");
    \u0275\u0275text(16, "workspace_premium");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 46)(18, "div", 47)(19, "span", 48);
    \u0275\u0275text(20, "2. Indemnit\xE9s de Nomination");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 49);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "span", 50);
    \u0275\u0275text(24, "Directeur, Responsable, Chef de Service, Chef d'Agence");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "button", 44);
    \u0275\u0275listener("click", function DbRefListComponent_Conditional_15_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.setIndemniteTab("SPECIFIQUE"));
    });
    \u0275\u0275elementStart(26, "div", 52)(27, "mat-icon");
    \u0275\u0275text(28, "point_of_sale");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 46)(30, "div", 47)(31, "span", 48);
    \u0275\u0275text(32, "3. Primes Sp\xE9cifiques");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 49);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "span", 50);
    \u0275\u0275text(36, "Caisse, Cash Point, Astreinte (Chauffeur, Assistante...)");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r2.indemniteTab === "ORDINAIRE");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r2.countIndemniteByTab("ORDINAIRE"));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("active", ctx_r2.indemniteTab === "NOMINATION");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r2.countIndemniteByTab("NOMINATION"));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("active", ctx_r2.indemniteTab === "SPECIFIQUE");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r2.countIndemniteByTab("SPECIFIQUE"));
  }
}
function DbRefListComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 53);
    \u0275\u0275listener("click", function DbRefListComponent_Conditional_24_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.searchQuery = "";
      return \u0275\u0275resetView(ctx_r2.applyFilter());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd()();
  }
}
function DbRefListComponent_th_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Code");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 56);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.type === "categorie" ? ctx_r2.getCatCodeDisplay(row_r5.code) : ctx_r2.type === "echelon" ? ctx_r2.getEchelonCodeDisplay(row_r5.code) : row_r5.code, " ");
  }
}
function DbRefListComponent_th_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Libell\xE9");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r6.libelle);
  }
}
function DbRefListComponent_th_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Rattachement");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_37_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 58)(1, "mat-icon", 60);
    \u0275\u0275text(2, "domain");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r7 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Dir: ", ctx_r2.getParentServiceInfo(row_r7).label);
  }
}
function DbRefListComponent_td_37_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 59)(1, "mat-icon", 61);
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Non rattach\xE9 ");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_37_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, DbRefListComponent_td_37_Conditional_1_Conditional_0_Template, 5, 1, "span", 58)(1, DbRefListComponent_td_37_Conditional_1_Conditional_1_Template, 4, 0, "span", 59);
  }
  if (rf & 2) {
    const row_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.getParentServiceInfo(row_r7).type === "DIRECTION" ? 0 : 1);
  }
}
function DbRefListComponent_td_37_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 57)(1, "mat-icon", 60);
    \u0275\u0275text(2, "account_tree");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r7 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Rattach\xE9e \xE0: ", ctx_r2.getParentDirectionInfo(row_r7).label);
  }
}
function DbRefListComponent_td_37_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 62)(1, "mat-icon", 60);
    \u0275\u0275text(2, "account_tree");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r7 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("D\xE9p: ", ctx_r2.getParentDirectionInfo(row_r7).label);
  }
}
function DbRefListComponent_td_37_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 58)(1, "mat-icon", 60);
    \u0275\u0275text(2, "store");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r7 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Agence: ", ctx_r2.getParentDirectionInfo(row_r7).label);
  }
}
function DbRefListComponent_td_37_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 63)(1, "mat-icon", 61);
    \u0275\u0275text(2, "corporate_fare");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " DG (Sommet) ");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_37_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, DbRefListComponent_td_37_Conditional_2_Conditional_0_Template, 5, 1, "span", 57)(1, DbRefListComponent_td_37_Conditional_2_Conditional_1_Template, 5, 1, "span", 62)(2, DbRefListComponent_td_37_Conditional_2_Conditional_2_Template, 5, 1, "span", 58)(3, DbRefListComponent_td_37_Conditional_2_Conditional_3_Template, 4, 0, "span", 63);
  }
  if (rf & 2) {
    const row_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.getParentDirectionInfo(row_r7).type === "PARENT_DIR" ? 0 : ctx_r2.getParentDirectionInfo(row_r7).type === "DEPARTEMENT" ? 1 : ctx_r2.getParentDirectionInfo(row_r7).type === "AGENCE" ? 2 : 3);
  }
}
function DbRefListComponent_td_37_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 57)(1, "mat-icon", 60);
    \u0275\u0275text(2, "domain");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.getParentDepartmentInfo(row_r7).label);
  }
}
function DbRefListComponent_td_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55);
    \u0275\u0275conditionalCreate(1, DbRefListComponent_td_37_Conditional_1_Template, 2, 1)(2, DbRefListComponent_td_37_Conditional_2_Template, 4, 1)(3, DbRefListComponent_td_37_Conditional_3_Template, 5, 1, "span", 57);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.type === "service" ? 1 : ctx_r2.type === "direction" ? 2 : ctx_r2.type === "departement" ? 3 : -1);
  }
}
function DbRefListComponent_th_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Type de retenue");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 64);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r8 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r8.typeRetenue || row_r8.typeIndemnite || "Part Agent", " ");
  }
}
function DbRefListComponent_th_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "R\xE9gime");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r9 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r9.regimeSecuriteSocialCode || row_r9.regimeSecuriteSocialLibelle || "Tous les r\xE9gimes", " ");
  }
}
function DbRefListComponent_th_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Base de calcul");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r10 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r10.baseCalcul === "SALAIRE_BASE" ? "Salaire de base" : row_r10.baseCalcul === "SALAIRE_BASE_SUR_SALAIRE" ? "Salaire de base + Sur-salaire" : row_r10.baseCalcul === "BASE_IMPOSABLE" ? "Base imposable" : "R\xE9mun\xE9ration brute", " ");
  }
}
function DbRefListComponent_th_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.indemniteTab === "SPECIFIQUE" ? "Type de Prime" : "Type d'indemnit\xE9", " ");
  }
}
function DbRefListComponent_td_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r11 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r11.typeIndemnite || row_r11.libelle);
  }
}
function DbRefListComponent_th_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Fonction de Nomination");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 65);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r12 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r12.fonctionLibelle || row_r12.fonction || "-");
  }
}
function DbRefListComponent_th_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Emploi / Poste Sp\xE9cifique");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 65);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r13 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r13.emploiLibelle || row_r13.emploi || "-");
  }
}
function DbRefListComponent_th_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Groupe");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 66);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r14 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.getGradeName(row_r14));
  }
}
function DbRefListComponent_th_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Grade");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 67);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r15 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.getGradeConcat(row_r15), " ");
  }
}
function DbRefListComponent_th_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Cat\xE9gorie / Classe");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_64_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r16 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.getCatCodeDisplay(cat_r16), " ");
  }
}
function DbRefListComponent_td_64_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68);
    \u0275\u0275repeaterCreate(1, DbRefListComponent_td_64_Conditional_1_For_2_Template, 2, 1, "span", 70, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r17 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(row_r17.categories);
  }
}
function DbRefListComponent_td_64_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong", 69);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r17 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.getCatCodeDisplay(row_r17.categorie || row_r17.code));
  }
}
function DbRefListComponent_td_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55);
    \u0275\u0275conditionalCreate(1, DbRefListComponent_td_64_Conditional_1_Template, 3, 0, "div", 68)(2, DbRefListComponent_td_64_Conditional_2_Template, 2, 1, "strong", 69);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r17 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(row_r17.categories && row_r17.categories.length > 0 ? 1 : 2);
  }
}
function DbRefListComponent_th_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 71);
    \u0275\u0275text(1, "Cat\xE9gories rattach\xE9es");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_67_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r18 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.getCatCodeDisplay(cat_r18), " ");
  }
}
function DbRefListComponent_td_67_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 72);
    \u0275\u0275text(1, "Toutes ou ind\xE9finies");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "div", 68);
    \u0275\u0275repeaterCreate(2, DbRefListComponent_td_67_For_3_Template, 2, 1, "span", 70, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(4, DbRefListComponent_td_67_Conditional_4_Template, 2, 0, "span", 72);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r19 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275repeater(row_r19.categories || \u0275\u0275pureFunction0(1, _c2));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!row_r19.categories || row_r19.categories.length === 0 ? 4 : -1);
  }
}
function DbRefListComponent_th_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "\xC9chelon");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 73);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r20 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.getEchelonCodeDisplay(row_r20.echellon), " ");
  }
}
function DbRefListComponent_th_72_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Salaire de Base");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 74);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r21 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatMontant(row_r21.montant ?? 0), " ");
  }
}
function DbRefListComponent_th_75_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.type === "param-prise-en-charge" ? "Valeur / Limite" : ctx_r2.type === "type-retenue-emploi" ? "Taux / Pourcentage (%)" : ctx_r2.type === "param-retraite" ? "\xC2ge de retraite (Ans)" : "Taux / Montant");
  }
}
function DbRefListComponent_td_76_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 76);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r22 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r22.code === "PEC-CONJOINT" ? row_r22.taux === 1 ? "1 charge (+1)" : "D\xE9sactiv\xE9 (0)" : row_r22.code === "PEC-MAX-CHRG" ? row_r22.taux + " charges max" : row_r22.taux + " ans max", " ");
  }
}
function DbRefListComponent_td_76_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const row_r22 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", row_r22.taux && row_r22.taux > 0 ? row_r22.taux + " %" : (row_r22.description == null ? null : row_r22.description.includes("Bar\xE8me")) ? "Bar\xE8me Progressif" : (row_r22.description == null ? null : row_r22.description.includes("Variable")) ? "Montant Variable" : "Mensualit\xE9 Fixe", " ");
  }
}
function DbRefListComponent_td_76_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const row_r22 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", row_r22.taux || 60, " ans ");
  }
}
function DbRefListComponent_td_76_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const row_r22 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatMontant(row_r22.taux ?? row_r22.montant ?? 0), " ");
  }
}
function DbRefListComponent_td_76_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 75);
    \u0275\u0275conditionalCreate(2, DbRefListComponent_td_76_Conditional_2_Template, 2, 1, "span", 76)(3, DbRefListComponent_td_76_Conditional_3_Template, 1, 1)(4, DbRefListComponent_td_76_Conditional_4_Template, 1, 1)(5, DbRefListComponent_td_76_Conditional_5_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.type === "param-prise-en-charge" ? 2 : ctx_r2.type === "type-retenue-emploi" ? 3 : ctx_r2.type === "param-retraite" ? 4 : 5);
  }
}
function DbRefListComponent_th_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Taux Exon\xE9r\xE9 (%)");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_79_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 77);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r23 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r23.tauxExoneration ?? 0, " % ");
  }
}
function DbRefListComponent_th_81_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Plafond Exon\xE9r\xE9");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 78);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r24 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r24.plafondExoneration && row_r24.plafondExoneration > 0 ? \u0275\u0275pipeBind2(3, 1, row_r24.plafondExoneration, "1.0-0") : "Sans plafond", " ");
  }
}
function DbRefListComponent_th_84_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Taux d'abattement IUTS (%)");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_85_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 79);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r25 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r25.tauxAbattement ?? 20, " % ");
  }
}
function DbRefListComponent_th_87_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Type");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_88_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 80)(2, "mat-icon", 61);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r26 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", row_r26.typeNomination === "NOMMEE" ? "#fff3e0" : "#e8f5e9")("color", row_r26.typeNomination === "NOMMEE" ? "#e65100" : "#2e7d32");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r26.typeNomination === "NOMMEE" ? "workspace_premium" : "person");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r26.typeNomination === "NOMMEE" ? "Nomm\xE9e" : "Pas nomm\xE9e", " ");
  }
}
function DbRefListComponent_th_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 54);
    \u0275\u0275text(1, "Statut");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_td_91_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 55)(1, "span", 81)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r27 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classProp("actif", row_r27.actif)("inactif", !row_r27.actif);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r27.actif ? "check_circle" : "cancel");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r27.actif ? "Actif" : "Inactif", " ");
  }
}
function DbRefListComponent_th_93_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "th", 71);
  }
}
function DbRefListComponent_td_94_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 55)(1, "button", 82);
    \u0275\u0275listener("click", function DbRefListComponent_td_94_Template_button_click_1_listener($event) {
      const row_r29 = \u0275\u0275restoreView(_r28).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r2.openEditDialog(row_r29));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 83);
    \u0275\u0275listener("click", function DbRefListComponent_td_94_Template_button_click_4_listener($event) {
      const row_r29 = \u0275\u0275restoreView(_r28).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggleStatus(row_r29, $event));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 84);
    \u0275\u0275listener("click", function DbRefListComponent_td_94_Template_button_click_7_listener($event) {
      const row_r29 = \u0275\u0275restoreView(_r28).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.deleteItem(row_r29, $event));
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const row_r29 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275property("matTooltip", \u0275\u0275interpolate(row_r29.actif ? "D\xE9sactiver" : "Activer"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r29.actif ? "toggle_on" : "toggle_off");
  }
}
function DbRefListComponent_tr_95_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 85);
  }
}
function DbRefListComponent_tr_96_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 86);
    \u0275\u0275listener("click", function DbRefListComponent_tr_96_Template_tr_click_0_listener() {
      const row_r31 = \u0275\u0275restoreView(_r30).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openEditDialog(row_r31));
    });
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_tr_97_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 87)(1, "td", 88)(2, "mat-icon");
    \u0275\u0275text(3, "search_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Aucun enregistrement trouv\xE9");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r2.displayedColumns.length);
  }
}
function DbRefListComponent_ng_template_99_Conditional_3_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r34 = ctx.$implicit;
    \u0275\u0275property("value", g_r34.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", g_r34.libelle, " \u2014 ", g_r34.description);
  }
}
function DbRefListComponent_ng_template_99_Conditional_3_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r35 = ctx.$implicit;
    \u0275\u0275property("value", cat_r35.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", cat_r35.libelle || cat_r35.code, " ");
  }
}
function DbRefListComponent_ng_template_99_Conditional_3_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ech_r36 = ctx.$implicit;
    \u0275\u0275property("value", ech_r36.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ech_r36.libelle || ech_r36.code, " ");
  }
}
function DbRefListComponent_ng_template_99_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 95)(1, "mat-label");
    \u0275\u0275text(2, "Groupe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-select", 96);
    \u0275\u0275repeaterCreate(4, DbRefListComponent_ng_template_99_Conditional_3_For_5_Template, 2, 3, "mat-option", 97, _forTrack02);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "mat-form-field", 95)(7, "mat-label");
    \u0275\u0275text(8, "Cat\xE9gorie / Classe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "mat-select", 98);
    \u0275\u0275listener("selectionChange", function DbRefListComponent_ng_template_99_Conditional_3_Template_mat_select_selectionChange_9_listener($event) {
      \u0275\u0275restoreView(_r33);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.formGroup.patchValue({ code: $event.value }));
    });
    \u0275\u0275repeaterCreate(10, DbRefListComponent_ng_template_99_Conditional_3_For_11_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "mat-form-field", 95)(13, "mat-label");
    \u0275\u0275text(14, "\xC9chelon");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "mat-select", 99);
    \u0275\u0275repeaterCreate(16, DbRefListComponent_ng_template_99_Conditional_3_For_17_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "mat-form-field", 95)(19, "mat-label");
    \u0275\u0275text(20, "Salaire de base");
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "input", 100);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.grades);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r2.categories);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r2.echelons);
  }
}
function DbRefListComponent_ng_template_99_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le libell\xE9 est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_4_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tr_r37 = ctx.$implicit;
    \u0275\u0275property("value", tr_r37.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tr_r37.libelle || tr_r37.code);
  }
}
function DbRefListComponent_ng_template_99_Conditional_4_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const regime_r38 = ctx.$implicit;
    \u0275\u0275property("value", regime_r38.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", regime_r38.code, " \u2014 ", regime_r38.libelle);
  }
}
function DbRefListComponent_ng_template_99_Conditional_4_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "La base de calcul est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 101)(1, "mat-label");
    \u0275\u0275text(2, "Libell\xE9 de la retenue");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 102);
    \u0275\u0275conditionalCreate(4, DbRefListComponent_ng_template_99_Conditional_4_Conditional_4_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "mat-form-field", 95)(6, "mat-label");
    \u0275\u0275text(7, "Type de retenue");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "mat-select", 103);
    \u0275\u0275repeaterCreate(9, DbRefListComponent_ng_template_99_Conditional_4_For_10_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "mat-form-field", 95)(12, "mat-label");
    \u0275\u0275text(13, "Pourcentage / Taux");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "input", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "mat-form-field", 95)(16, "mat-label");
    \u0275\u0275text(17, "R\xE9gime de s\xE9curit\xE9 sociale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "mat-select", 105)(19, "mat-option", 97);
    \u0275\u0275text(20, "Tous les r\xE9gimes / Non applicable");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(21, DbRefListComponent_ng_template_99_Conditional_4_For_22_Template, 2, 3, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "mat-form-field", 95)(24, "mat-label");
    \u0275\u0275text(25, "Base de calcul");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "mat-select", 106)(27, "mat-option", 107);
    \u0275\u0275text(28, "Salaire de base");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "mat-option", 108);
    \u0275\u0275text(30, "Salaire de base + Sur-salaire");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "mat-option", 109);
    \u0275\u0275text(32, "R\xE9mun\xE9ration brute");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "mat-option", 110);
    \u0275\u0275text(34, "Base imposable");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(35, DbRefListComponent_ng_template_99_Conditional_4_Conditional_35_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_7_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r2.formGroup.get("libelle")) == null ? null : tmp_3_0.hasError("required")) ? 4 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.typesRetenueList);
    \u0275\u0275advance(10);
    \u0275\u0275property("value", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.regimesSecuriteSocialList);
    \u0275\u0275advance(14);
    \u0275\u0275conditional(((tmp_7_0 = ctx_r2.formGroup.get("baseCalcul")) == null ? null : tmp_7_0.hasError("required")) ? 35 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r40 = ctx.$implicit;
    \u0275\u0275property("value", t_r40.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r40.libelle || t_r40.code);
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le type d'indemnit\xE9 est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_29_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r42 = ctx.$implicit;
    \u0275\u0275property("value", g_r42.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(g_r42.libelle || g_r42.code);
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_29_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le groupe est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_29_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r43 = ctx.$implicit;
    \u0275\u0275property("value", c_r43.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r43.libelle || c_r43.code);
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_29_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "La cat\xE9gorie est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 116)(1, "mat-form-field", 95)(2, "mat-label");
    \u0275\u0275text(3, "Groupe *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-select", 118);
    \u0275\u0275listener("selectionChange", function DbRefListComponent_ng_template_99_Conditional_5_Conditional_29_Template_mat_select_selectionChange_4_listener() {
      \u0275\u0275restoreView(_r41);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onIndemniteGradeChange());
    });
    \u0275\u0275repeaterCreate(5, DbRefListComponent_ng_template_99_Conditional_5_Conditional_29_For_6_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, DbRefListComponent_ng_template_99_Conditional_5_Conditional_29_Conditional_7_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "mat-form-field", 95)(9, "mat-label");
    \u0275\u0275text(10, "Cat\xE9gorie / Classe *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "mat-select", 119);
    \u0275\u0275repeaterCreate(12, DbRefListComponent_ng_template_99_Conditional_5_Conditional_29_For_13_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(14, DbRefListComponent_ng_template_99_Conditional_5_Conditional_29_Conditional_14_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_7_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.grades);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.formGroup.get("gradeId")) == null ? null : tmp_5_0.hasError("required")) ? 7 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.availableIndemniteCategories);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_7_0 = ctx_r2.formGroup.get("categorieId")) == null ? null : tmp_7_0.hasError("required")) ? 14 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_30_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r44 = ctx.$implicit;
    \u0275\u0275property("value", f_r44.id || f_r44.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r44.libelle || f_r44.name || f_r44.code);
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_30_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "La fonction de nomination est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 95)(1, "mat-label");
    \u0275\u0275text(2, "Fonction de Nomination (Direction/Service/Agence) *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-select", 120);
    \u0275\u0275repeaterCreate(4, DbRefListComponent_ng_template_99_Conditional_5_Conditional_30_For_5_Template, 2, 2, "mat-option", 97, _forTrack2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, DbRefListComponent_ng_template_99_Conditional_5_Conditional_30_Conditional_6_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.fonctionsNomination);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.formGroup.get("fonctionId")) == null ? null : tmp_5_0.hasError("required")) ? 6 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_31_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emp_r45 = ctx.$implicit;
    \u0275\u0275property("value", emp_r45.id || emp_r45.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(emp_r45.libelle || emp_r45.name || emp_r45.code);
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_31_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "L'emploi sp\xE9cifique est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 95)(1, "mat-label");
    \u0275\u0275text(2, "Emploi / Poste Sp\xE9cifique (Guichetier / Caissier, Comptable...) *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-select", 121);
    \u0275\u0275repeaterCreate(4, DbRefListComponent_ng_template_99_Conditional_5_Conditional_31_For_5_Template, 2, 2, "mat-option", 97, _forTrack2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, DbRefListComponent_ng_template_99_Conditional_5_Conditional_31_Conditional_6_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.emplois);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.formGroup.get("emploiId")) == null ? null : tmp_5_0.hasError("required")) ? 6 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le montant est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 111)(1, "div", 112);
    \u0275\u0275listener("click", function DbRefListComponent_ng_template_99_Conditional_5_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onRegleTypeChange("ORDINAIRE"));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 113);
    \u0275\u0275text(5, "1. Statutaire");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 114);
    \u0275\u0275text(7, "Groupe & Cat\xE9gorie");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 112);
    \u0275\u0275listener("click", function DbRefListComponent_ng_template_99_Conditional_5_Template_div_click_8_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onRegleTypeChange("NOMINATION"));
    });
    \u0275\u0275elementStart(9, "mat-icon");
    \u0275\u0275text(10, "workspace_premium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 113);
    \u0275\u0275text(12, "2. Nomination");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 114);
    \u0275\u0275text(14, "Fonction Manag\xE9riale");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 112);
    \u0275\u0275listener("click", function DbRefListComponent_ng_template_99_Conditional_5_Template_div_click_15_listener() {
      \u0275\u0275restoreView(_r39);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onRegleTypeChange("SPECIFIQUE"));
    });
    \u0275\u0275elementStart(16, "mat-icon");
    \u0275\u0275text(17, "point_of_sale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 113);
    \u0275\u0275text(19, "3. Sp\xE9cifique");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 114);
    \u0275\u0275text(21, "Poste Sp\xE9cifique");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "mat-form-field", 101)(23, "mat-label");
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "mat-select", 115);
    \u0275\u0275repeaterCreate(26, DbRefListComponent_ng_template_99_Conditional_5_For_27_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(28, DbRefListComponent_ng_template_99_Conditional_5_Conditional_28_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(29, DbRefListComponent_ng_template_99_Conditional_5_Conditional_29_Template, 15, 2, "div", 116);
    \u0275\u0275conditionalCreate(30, DbRefListComponent_ng_template_99_Conditional_5_Conditional_30_Template, 7, 1, "mat-form-field", 95);
    \u0275\u0275conditionalCreate(31, DbRefListComponent_ng_template_99_Conditional_5_Conditional_31_Template, 7, 1, "mat-form-field", 95);
    \u0275\u0275elementStart(32, "mat-form-field", 95)(33, "mat-label");
    \u0275\u0275text(34, "Montant (FCFA) *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(35, "input", 117);
    \u0275\u0275conditionalCreate(36, DbRefListComponent_ng_template_99_Conditional_5_Conditional_36_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_8_0;
    let tmp_12_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r2.regleType === "ORDINAIRE");
    \u0275\u0275advance(7);
    \u0275\u0275classProp("active", ctx_r2.regleType === "NOMINATION");
    \u0275\u0275advance(7);
    \u0275\u0275classProp("active", ctx_r2.regleType === "SPECIFIQUE");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r2.regleType === "SPECIFIQUE" ? "Type de prime / indemnit\xE9 *" : "Type d'indemnit\xE9 *");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.typesIndemnite);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_8_0 = ctx_r2.formGroup.get("typeIndemniteId")) == null ? null : tmp_8_0.hasError("required")) ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.regleType === "ORDINAIRE" ? 29 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.regleType === "NOMINATION" ? 30 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.regleType === "SPECIFIQUE" ? 31 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_12_0 = ctx_r2.formGroup.get("taux")) == null ? null : tmp_12_0.hasError("required")) ? 36 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_6_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le code est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_6_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le code ne doit pas d\xE9passer 25 caract\xE8res");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 101)(1, "mat-label");
    \u0275\u0275text(2, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 123);
    \u0275\u0275conditionalCreate(4, DbRefListComponent_ng_template_99_Conditional_6_Conditional_0_Conditional_4_Template, 2, 0, "mat-error");
    \u0275\u0275conditionalCreate(5, DbRefListComponent_ng_template_99_Conditional_6_Conditional_0_Conditional_5_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r2.formGroup.get("code")) == null ? null : tmp_4_0.hasError("required")) ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.formGroup.get("code")) == null ? null : tmp_5_0.hasError("maxlength")) ? 5 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_6_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le libell\xE9 ne doit pas d\xE9passer 150 caract\xE8res");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, DbRefListComponent_ng_template_99_Conditional_6_Conditional_0_Template, 6, 2, "mat-form-field", 101);
    \u0275\u0275elementStart(1, "mat-form-field", 95)(2, "mat-label");
    \u0275\u0275text(3, "Libell\xE9 / D\xE9signation");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 122);
    \u0275\u0275conditionalCreate(5, DbRefListComponent_ng_template_99_Conditional_6_Conditional_5_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r2.shouldHideCode ? 0 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r2.formGroup.get("libelle")) == null ? null : tmp_4_0.hasError("maxlength")) ? 5 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_7_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le code est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_7_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le code ne doit pas d\xE9passer 25 caract\xE8res");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 101)(1, "mat-label");
    \u0275\u0275text(2, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 123);
    \u0275\u0275conditionalCreate(4, DbRefListComponent_ng_template_99_Conditional_7_Conditional_4_Template, 2, 0, "mat-error");
    \u0275\u0275conditionalCreate(5, DbRefListComponent_ng_template_99_Conditional_7_Conditional_5_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "mat-form-field", 95)(7, "mat-label");
    \u0275\u0275text(8, "Libelle du Groupe");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 124);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r2.formGroup.get("code")) == null ? null : tmp_3_0.hasError("required")) ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r2.formGroup.get("code")) == null ? null : tmp_4_0.hasError("maxlength")) ? 5 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_8_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le code est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_8_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le code ne doit pas d\xE9passer 25 caract\xE8res");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_8_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 101)(1, "mat-label");
    \u0275\u0275text(2, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 123);
    \u0275\u0275conditionalCreate(4, DbRefListComponent_ng_template_99_Conditional_8_Conditional_0_Conditional_4_Template, 2, 0, "mat-error");
    \u0275\u0275conditionalCreate(5, DbRefListComponent_ng_template_99_Conditional_8_Conditional_0_Conditional_5_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r2.formGroup.get("code")) == null ? null : tmp_4_0.hasError("required")) ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.formGroup.get("code")) == null ? null : tmp_5_0.hasError("maxlength")) ? 5 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_8_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r46 = ctx.$implicit;
    \u0275\u0275property("value", g_r46.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", g_r46.libelle, " \u2014 ", g_r46.description);
  }
}
function DbRefListComponent_ng_template_99_Conditional_8_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r47 = ctx.$implicit;
    \u0275\u0275property("value", cat_r47.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(cat_r47.libelle || cat_r47.code);
  }
}
function DbRefListComponent_ng_template_99_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, DbRefListComponent_ng_template_99_Conditional_8_Conditional_0_Template, 6, 2, "mat-form-field", 101);
    \u0275\u0275elementStart(1, "mat-form-field", 95)(2, "mat-label");
    \u0275\u0275text(3, "Groupe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-select", 125);
    \u0275\u0275repeaterCreate(5, DbRefListComponent_ng_template_99_Conditional_8_For_6_Template, 2, 3, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "mat-form-field", 95)(8, "mat-label");
    \u0275\u0275text(9, "Cat\xE9gorie / Classe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "mat-select", 119);
    \u0275\u0275repeaterCreate(11, DbRefListComponent_ng_template_99_Conditional_8_For_12_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r2.shouldHideCode ? 0 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.grades);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r2.categories);
  }
}
function DbRefListComponent_ng_template_99_Conditional_9_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le code est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_9_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le code ne doit pas d\xE9passer 25 caract\xE8res");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 101)(1, "mat-label");
    \u0275\u0275text(2, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 123);
    \u0275\u0275conditionalCreate(4, DbRefListComponent_ng_template_99_Conditional_9_Conditional_0_Conditional_4_Template, 2, 0, "mat-error");
    \u0275\u0275conditionalCreate(5, DbRefListComponent_ng_template_99_Conditional_9_Conditional_0_Conditional_5_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r2.formGroup.get("code")) == null ? null : tmp_4_0.hasError("required")) ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.formGroup.get("code")) == null ? null : tmp_5_0.hasError("maxlength")) ? 5 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_9_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r48 = ctx.$implicit;
    \u0275\u0275property("value", g_r48.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", g_r48.libelle, " \u2014 ", g_r48.description);
  }
}
function DbRefListComponent_ng_template_99_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, DbRefListComponent_ng_template_99_Conditional_9_Conditional_0_Template, 6, 2, "mat-form-field", 101);
    \u0275\u0275elementStart(1, "mat-form-field", 95)(2, "mat-label");
    \u0275\u0275text(3, "Groupe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-select", 96);
    \u0275\u0275repeaterCreate(5, DbRefListComponent_ng_template_99_Conditional_9_For_6_Template, 2, 3, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "mat-form-field", 95)(8, "mat-label");
    \u0275\u0275text(9, "\xC2ge de retraite (ans)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "input", 126);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r2.shouldHideCode ? 0 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.grades);
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le code est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le code ne doit pas d\xE9passer 25 caract\xE8res");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 101)(1, "mat-label");
    \u0275\u0275text(2, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 128);
    \u0275\u0275conditionalCreate(4, DbRefListComponent_ng_template_99_Conditional_10_Conditional_0_Conditional_4_Template, 2, 0, "mat-error");
    \u0275\u0275conditionalCreate(5, DbRefListComponent_ng_template_99_Conditional_10_Conditional_0_Conditional_5_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r2.formGroup.get("code")) == null ? null : tmp_4_0.hasError("required")) ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.formGroup.get("code")) == null ? null : tmp_5_0.hasError("maxlength")) ? 5 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le libell\xE9 est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Le libell\xE9 ne doit pas d\xE9passer 150 caract\xE8res");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 95)(1, "mat-label");
    \u0275\u0275text(2, "Taux Exon\xE9r\xE9 (%)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 129);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-form-field", 95)(5, "mat-label");
    \u0275\u0275text(6, "Plafond Exon\xE9r\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "input", 130);
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 95)(1, "mat-label");
    \u0275\u0275text(2, "Taux d'abattement IUTS");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 131);
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_9_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r49 = ctx.$implicit;
    \u0275\u0275property("value", d_r49.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", d_r49.libelle, " (", d_r49.description, ")");
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_9_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const dir_r50 = ctx.$implicit;
    \u0275\u0275property("value", dir_r50.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(dir_r50.libelle);
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 95)(1, "mat-label");
    \u0275\u0275text(2, "Directeur / Responsable du d\xE9partement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-select", 132)(4, "mat-option", 97);
    \u0275\u0275text(5, "-- Aucun directeur d\xE9sign\xE9 --");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, DbRefListComponent_ng_template_99_Conditional_10_Conditional_9_For_7_Template, 2, 3, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "mat-form-field", 95)(9, "mat-label");
    \u0275\u0275text(10, "Direction de rattachement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "mat-select", 133)(12, "mat-option", 97);
    \u0275\u0275text(13, "Direction G\xE9n\xE9rale Adjointe (DGA) [Par d\xE9faut]");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(14, DbRefListComponent_ng_template_99_Conditional_10_Conditional_9_For_15_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "mat-hint");
    \u0275\u0275text(17, "Ex: Rattach\xE9 \xE0 la Direction G\xE9n\xE9rale Adjointe (DGA)");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.directeursList);
    \u0275\u0275advance(6);
    \u0275\u0275property("value", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.directions);
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_10_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r51 = ctx.$implicit;
    \u0275\u0275property("value", d_r51.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", d_r51.libelle, " (", d_r51.description, ")");
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_10_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pDir_r52 = ctx.$implicit;
    \u0275\u0275property("value", pDir_r52.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(pDir_r52.libelle);
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_10_For_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const agence_r53 = ctx.$implicit;
    \u0275\u0275property("value", agence_r53.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(agence_r53.libelle);
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 95)(1, "mat-label");
    \u0275\u0275text(2, "Directeur / Responsable de la direction");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-select", 132)(4, "mat-option", 97);
    \u0275\u0275text(5, "-- Aucun directeur d\xE9sign\xE9 --");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, DbRefListComponent_ng_template_99_Conditional_10_Conditional_10_For_7_Template, 2, 3, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "mat-form-field", 95)(9, "mat-label");
    \u0275\u0275text(10, "Direction parente / Rattachement hi\xE9rarchique");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "mat-select", 134)(12, "mat-option", 97);
    \u0275\u0275text(13, "Aucune (Rattach\xE9e directement au DG)");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(14, DbRefListComponent_ng_template_99_Conditional_10_Conditional_10_For_15_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "mat-hint");
    \u0275\u0275text(17, "Ex: Directions op\xE9rationnelles \u2192 DGA ; Audit/Risques \u2192 aucune (DG direct)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "mat-form-field", 135)(19, "mat-label");
    \u0275\u0275text(20, "Agence associ\xE9e (Optionnel)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "mat-select", 136)(22, "mat-option", 97);
    \u0275\u0275text(23, "Aucune agence (Si\xE8ge / Direction centrale)");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(24, DbRefListComponent_ng_template_99_Conditional_10_Conditional_10_For_25_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.directeursList);
    \u0275\u0275advance(6);
    \u0275\u0275property("value", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.availableParentDirections);
    \u0275\u0275advance(8);
    \u0275\u0275property("value", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.agences);
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 95)(1, "mat-label");
    \u0275\u0275text(2, "Valeur / Limite");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 137);
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, DbRefListComponent_ng_template_99_Conditional_10_Conditional_0_Template, 6, 2, "mat-form-field", 101);
    \u0275\u0275elementStart(1, "mat-form-field", 95)(2, "mat-label");
    \u0275\u0275text(3, "Libell\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 127);
    \u0275\u0275conditionalCreate(5, DbRefListComponent_ng_template_99_Conditional_10_Conditional_5_Template, 2, 0, "mat-error");
    \u0275\u0275conditionalCreate(6, DbRefListComponent_ng_template_99_Conditional_10_Conditional_6_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, DbRefListComponent_ng_template_99_Conditional_10_Conditional_7_Template, 8, 0);
    \u0275\u0275conditionalCreate(8, DbRefListComponent_ng_template_99_Conditional_10_Conditional_8_Template, 4, 0, "mat-form-field", 95);
    \u0275\u0275conditionalCreate(9, DbRefListComponent_ng_template_99_Conditional_10_Conditional_9_Template, 18, 2);
    \u0275\u0275conditionalCreate(10, DbRefListComponent_ng_template_99_Conditional_10_Conditional_10_Template, 26, 3);
    \u0275\u0275conditionalCreate(11, DbRefListComponent_ng_template_99_Conditional_10_Conditional_11_Template, 4, 0, "mat-form-field", 95);
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r2.shouldHideCode ? 0 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r2.formGroup.get("libelle")) == null ? null : tmp_4_0.hasError("required")) ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.formGroup.get("libelle")) == null ? null : tmp_5_0.hasError("maxlength")) ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.type === "type-indemnite" ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.type === "categorie" ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.type === "departement" ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.type === "direction" ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.type === "param-prise-en-charge" ? 11 : -1);
  }
}
function DbRefListComponent_ng_template_99_Conditional_11_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r54 = ctx.$implicit;
    \u0275\u0275property("value", cat_r54.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(cat_r54.code);
  }
}
function DbRefListComponent_ng_template_99_Conditional_11_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ech_r55 = ctx.$implicit;
    \u0275\u0275property("value", ech_r55.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ech_r55.code);
  }
}
function DbRefListComponent_ng_template_99_Conditional_11_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r56 = ctx.$implicit;
    \u0275\u0275property("value", g_r56.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(g_r56.code);
  }
}
function DbRefListComponent_ng_template_99_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 138)(1, "mat-form-field", 95)(2, "mat-label");
    \u0275\u0275text(3, "Cat\xE9gorie / Classe *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-select", 119);
    \u0275\u0275repeaterCreate(5, DbRefListComponent_ng_template_99_Conditional_11_For_6_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "mat-form-field", 95)(8, "mat-label");
    \u0275\u0275text(9, "\xC9chelon *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "mat-select", 139);
    \u0275\u0275repeaterCreate(11, DbRefListComponent_ng_template_99_Conditional_11_For_12_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 138)(14, "mat-form-field", 95)(15, "mat-label");
    \u0275\u0275text(16, "Groupe d'emploi (Grade)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "mat-select", 96);
    \u0275\u0275repeaterCreate(18, DbRefListComponent_ng_template_99_Conditional_11_For_19_Template, 2, 2, "mat-option", 97, _forTrack2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "mat-form-field", 95)(21, "mat-label");
    \u0275\u0275text(22, "Salaire de base *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(23, "input", 100);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.categories);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r2.echelons);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r2.grades);
  }
}
function DbRefListComponent_ng_template_99_Conditional_12_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const dir_r57 = ctx.$implicit;
    \u0275\u0275property("value", dir_r57.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(dir_r57.libelle);
  }
}
function DbRefListComponent_ng_template_99_Conditional_12_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "La Direction de rattachement est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_12_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-hint", 144);
    \u0275\u0275text(1, "\u2713 Rattach\xE9 \xE0 la direction s\xE9lectionn\xE9e");
    \u0275\u0275elementEnd();
  }
}
function DbRefListComponent_ng_template_99_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 91)(1, "div", 140)(2, "mat-icon", 141);
    \u0275\u0275text(3, "domain");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Direction de Tutelle *");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "p", 142);
    \u0275\u0275text(7, " Conform\xE9ment \xE0 l'organigramme de la BPBF, chaque service est obligatoirement et exclusivement rattach\xE9 \xE0 sa Direction de tutelle. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "mat-form-field", 95)(9, "mat-label");
    \u0275\u0275text(10, "Direction de rattachement *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "mat-select", 143);
    \u0275\u0275repeaterCreate(12, DbRefListComponent_ng_template_99_Conditional_12_For_13_Template, 2, 2, "mat-option", 97, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(14, DbRefListComponent_ng_template_99_Conditional_12_Conditional_14_Template, 2, 0, "mat-error");
    \u0275\u0275conditionalCreate(15, DbRefListComponent_ng_template_99_Conditional_12_Conditional_15_Template, 2, 0, "mat-hint", 144);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r2.directions);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_4_0 = ctx_r2.formGroup.get("directionId")) == null ? null : tmp_4_0.hasError("required")) ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r2.formGroup.get("directionId")) == null ? null : tmp_5_0.value) ? 15 : -1);
  }
}
function DbRefListComponent_ng_template_99_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h2", 89);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "mat-dialog-content", 90);
    \u0275\u0275conditionalCreate(3, DbRefListComponent_ng_template_99_Conditional_3_Template, 22, 0)(4, DbRefListComponent_ng_template_99_Conditional_4_Template, 36, 3)(5, DbRefListComponent_ng_template_99_Conditional_5_Template, 37, 12)(6, DbRefListComponent_ng_template_99_Conditional_6_Template, 6, 2)(7, DbRefListComponent_ng_template_99_Conditional_7_Template, 10, 2)(8, DbRefListComponent_ng_template_99_Conditional_8_Template, 13, 1)(9, DbRefListComponent_ng_template_99_Conditional_9_Template, 11, 1)(10, DbRefListComponent_ng_template_99_Conditional_10_Template, 12, 8)(11, DbRefListComponent_ng_template_99_Conditional_11_Template, 24, 0);
    \u0275\u0275conditionalCreate(12, DbRefListComponent_ng_template_99_Conditional_12_Template, 16, 2, "div", 91);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "mat-dialog-actions", 92)(14, "button", 93);
    \u0275\u0275text(15, "Annuler");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 94);
    \u0275\u0275listener("click", function DbRefListComponent_ng_template_99_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r32);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onSubmit());
    });
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.isEditing ? "Modifier " + ctx_r2.title : "Ajouter " + ctx_r2.title, " ");
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r2.formGroup);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.type === "grille-salariale" ? 3 : ctx_r2.type === "type-retenue-emploi" ? 4 : ctx_r2.type === "param-indemnite" ? 5 : ctx_r2.type === "fonction" ? 6 : ctx_r2.type === "grade" ? 7 : ctx_r2.type === "param-groupe" ? 8 : ctx_r2.type === "param-retraite" ? 9 : ctx_r2.type !== "grille-salariale" && ctx_r2.type !== "param-retraite" && ctx_r2.type !== "param-groupe" && ctx_r2.type !== "grade" ? 10 : 11);
    \u0275\u0275advance(9);
    \u0275\u0275conditional(ctx_r2.type === "service" ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.saving);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.saving);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.saving ? "Enregistrement..." : "Enregistrer", " ");
  }
}
var DbRefListComponent = class _DbRefListComponent {
  route;
  moduleNav;
  dbRefService;
  employeeService;
  dialog;
  fb;
  paginator;
  sort;
  dialogTpl;
  module = APP_MODULES.find((m) => m.id === "donnees-base");
  title = "";
  icon = "list";
  type = "";
  displayedColumns = ["code", "libelle", "actif", "actions"];
  dataSource = new MatTableDataSource([]);
  searchQuery = "";
  formGroup;
  dialogRef;
  saving = false;
  isEditing = false;
  editingItem = null;
  // Listes pour les selects hiérarchiques
  departements = [];
  // pour Direction et Service
  directions = [];
  // pour Service uniquement
  grades = [];
  // pour Grille salariale et Paramétrage indemnité
  typesIndemnite = [];
  // pour Paramétrage indemnité
  fonctions = [];
  // pour Paramétrage indemnité
  emplois = [];
  // pour Paramétrage indemnité (Primes Spécifiques)
  agences = [];
  // pour Direction et Département
  directeursList = [];
  // pour Directeur de Département
  categoriesList = [];
  typesIndemniteList = [];
  typesRetenueList = [];
  regimesSecuriteSocialList = [];
  fonctionIndemnitesList = [];
  addFonctionIndemniteRow() {
    const defaultType = this.typesIndemniteList.length > 0 ? this.typesIndemniteList[0] : "";
    this.fonctionIndemnitesList.push({ typeIndemnite: defaultType, montant: 0 });
  }
  removeFonctionIndemniteRow(index) {
    if (index >= 0 && index < this.fonctionIndemnitesList.length) {
      this.fonctionIndemnitesList.splice(index, 1);
    }
  }
  setFonctionType(type) {
    this.formGroup.patchValue({ typeNomination: type });
    if (type === "NOMMEE" && this.fonctionIndemnitesList.length === 0) {
      const fctName = this.formGroup.get("libelle")?.value || this.editingItem?.libelle || "";
      this.fonctionIndemnitesList = this.getDefaultIndemnitesForFonction(fctName);
    } else if (type === "NON_NOMMEE") {
      this.fonctionIndemnitesList = [];
    }
  }
  getTotalFonctionIndemnites() {
    return (this.fonctionIndemnitesList || []).reduce((sum, i) => sum + (Number(i.montant) || 0), 0);
  }
  getDefaultIndemnitesForFonction(libelle) {
    return [];
  }
  categories = [];
  echelons = [];
  // Grille salariale - listes par groupe (utilisant les codes officiels C1..C7, CL1..CL8)
  groupe1Classifications = [];
  groupe2Classifications = [];
  groupe3Classifications = [];
  echelonsList = [];
  get allClassifications() {
    return [];
  }
  paramGroupesList = [];
  availableCategoriesForSelectedGroup = [];
  getGroupKey(str) {
    if (!str)
      return "";
    const s = str.trim().toUpperCase();
    if (/\bGROUPE\s+IV\b|\bGRP-4\b/i.test(s))
      return "GRP-4";
    if (/\bGROUPE\s+III\b|\bGRP-3\b/i.test(s))
      return "GRP-3";
    if (/\bGROUPE\s+II\b|\bGRP-2\b/i.test(s))
      return "GRP-2";
    if (/\bGROUPE\s+I\b|\bGRP-1\b/i.test(s))
      return "GRP-1";
    return "";
  }
  getCategoriesForGroupe(groupeName) {
    if (!groupeName)
      return this.categoriesList;
    const targetKey = this.getGroupKey(groupeName);
    const found = this.paramGroupesList.filter((p) => {
      const pKey = this.getGroupKey(p.grade || p.libelle || p.code || "");
      return pKey === targetKey;
    });
    if (found.length > 0) {
      return found.map((item) => item.categorie || item.categorieLibelle || "").filter(Boolean);
    }
    return this.categoriesList;
  }
  onGrilleGroupeChange(groupeName) {
    this.availableCategoriesForSelectedGroup = this.getCategoriesForGroupe(groupeName);
    const defaultCat = this.availableCategoriesForSelectedGroup.length > 0 ? this.availableCategoriesForSelectedGroup[0] : "C1";
    this.formGroup.patchValue({
      grade: groupeName,
      libelle: groupeName,
      categorie: defaultCat,
      code: defaultCat
    });
  }
  regleType = "ORDINAIRE";
  indemniteTab = "ORDINAIRE";
  rawIndemniteItems = [];
  fonctionsNominationBPBF = [
    "DIRECTEUR DE D\xC9PARTEMENT",
    "RESPONSABLE DE D\xC9PARTEMENT",
    "CHEF DE SERVICE",
    "CHEF D'AGENCE"
  ];
  fonctionsSpecifiquesBPBF = [
    "CAISSIER PRINCIPAL",
    "GESTIONNAIRE CASH POINT",
    "CAISSIER AUXILIAIRE",
    "CHAUFFEUR",
    "ASSISTANTE DE DIRECTION",
    "AGENT DE LIAISON"
  ];
  getItemRegleType(item) {
    if (item.emploiId || item.emploi || item.emploiLibelle)
      return "SPECIFIQUE";
    if (item.regleType === "SPECIFIQUE")
      return "SPECIFIQUE";
    if (item.regleType === "NOMINATION")
      return "NOMINATION";
    if (item.regleType === "ORDINAIRE")
      return "ORDINAIRE";
    if (item.fonctionId || item.fonction || item.fonctionLibelle) {
      const f = (item.fonction || item.fonctionLibelle || "").toUpperCase();
      if (this.fonctionsSpecifiquesBPBF.some((fs) => f.includes(fs)))
        return "SPECIFIQUE";
      return "NOMINATION";
    }
    if (item.gradeId || item.grade || item.categorieId || item.categorie)
      return "ORDINAIRE";
    return "ORDINAIRE";
  }
  countIndemniteByTab(tab) {
    return this.rawIndemniteItems.filter((item) => this.getItemRegleType(item) === tab).length;
  }
  setIndemniteTab(tab) {
    this.indemniteTab = tab;
    this.regleType = tab;
    this.updateIndemniteDataSource();
  }
  updateIndemniteDataSource() {
    if (this.type !== "param-indemnite") {
      this.dataSource.data = this.rawIndemniteItems;
      return;
    }
    const filtered = this.rawIndemniteItems.filter((item) => this.getItemRegleType(item) === this.indemniteTab);
    this.dataSource.data = filtered;
    if (this.indemniteTab === "ORDINAIRE") {
      this.displayedColumns = ["code", "typeIndemnite", "grade", "categorie", "taux", "actif", "actions"];
    } else if (this.indemniteTab === "NOMINATION") {
      this.displayedColumns = ["code", "fonction", "typeIndemnite", "taux", "actif", "actions"];
    } else if (this.indemniteTab === "SPECIFIQUE") {
      this.displayedColumns = ["code", "emploi", "typeIndemnite", "taux", "actif", "actions"];
    }
    if (this.paginator)
      this.dataSource.paginator = this.paginator;
    if (this.sort)
      this.dataSource.sort = this.sort;
  }
  get fonctionsNomination() {
    return this.fonctions;
  }
  onRegleTypeChange(type) {
    this.regleType = type;
    this.formGroup.patchValue({
      typeNomination: type === "ORDINAIRE" ? "NON_NOMMEE" : "NOMMEE",
      fonctionId: null,
      emploiId: null,
      gradeId: null,
      categorieId: null
    });
    this.setupValidators();
  }
  onIndemniteGroupeChange(groupeName) {
    if (!groupeName) {
      this.availableCategoriesForSelectedGroup = [];
      this.formGroup.patchValue({ categories: [], categorie: "" });
      return;
    }
    this.availableCategoriesForSelectedGroup = this.getCategoriesForGroupe(groupeName);
    const autoChecked = [...this.availableCategoriesForSelectedGroup];
    this.formGroup.patchValue({
      categories: autoChecked,
      categorie: autoChecked.join(", ")
    });
  }
  onGrilleCatChange(cat) {
    let groupe = "GROUPE I";
    if (this.groupe3Classifications.includes(cat) || cat.startsWith("CL5") || cat.startsWith("CL6") || cat.startsWith("CL7") || cat.startsWith("CL8")) {
      groupe = "GROUPE III";
    } else if (this.groupe2Classifications.includes(cat) || cat.startsWith("CL1") || cat.startsWith("CL2") || cat.startsWith("CL3") || cat.startsWith("CL4")) {
      groupe = "GROUPE II";
    } else {
      groupe = "GROUPE I";
    }
    this.formGroup.patchValue({
      grade: groupe,
      libelle: groupe,
      code: cat,
      categorie: cat
    });
  }
  get availableIndemniteCategories() {
    const gradeId = this.formGroup.get("gradeId")?.value;
    if (!gradeId)
      return this.categories;
    const allowedIds = new Set(this.paramGroupesList.filter((item) => String(item.gradeId) === String(gradeId)).map((item) => String(item.categorieId || "")).filter(Boolean));
    return allowedIds.size > 0 ? this.categories.filter((item) => allowedIds.has(String(item.id))) : this.categories;
  }
  onIndemniteGradeChange() {
    const selectedCategoryId = this.formGroup.get("categorieId")?.value;
    if (selectedCategoryId && !this.availableIndemniteCategories.some((item) => String(item.id) === String(selectedCategoryId))) {
      this.formGroup.patchValue({ categorieId: null });
    }
  }
  onServiceDirectionChange(directionId) {
    if (directionId)
      this.formGroup.patchValue({ departementId: null });
  }
  onServiceDepartmentChange(departementId) {
    if (departementId)
      this.formGroup.patchValue({ directionId: null });
  }
  get availableParentDirections() {
    if (!this.editingItem || !this.editingItem.id) {
      return this.directions;
    }
    const currentId = String(this.editingItem.id);
    return this.directions.filter((d) => String(d.id) !== currentId);
  }
  getParentServiceInfo(row) {
    if (!row)
      return { type: "NONE", label: "Non rattach\xE9" };
    if (row.directionId || row.directionLibelle) {
      const dir = this.directions.find((d) => String(d.id) === String(row.directionId));
      const name = dir?.libelle || dir?.name || row.directionLibelle || `Direction #${row.directionId}`;
      return { type: "DIRECTION", label: name };
    }
    return { type: "NONE", label: "Non rattach\xE9" };
  }
  getParentDepartmentInfo(row) {
    if (!row)
      return { type: "NONE", label: "Direction G\xE9n\xE9rale Adjointe (DGA)" };
    if (row.directionId || row.directionLibelle) {
      const dir = this.directions.find((d) => String(d.id) === String(row.directionId));
      const name = dir?.libelle || dir?.name || row.directionLibelle || `Direction #${row.directionId}`;
      return { type: "DIRECTION", label: name };
    }
    return { type: "NONE", label: "Direction G\xE9n\xE9rale Adjointe (DGA)" };
  }
  getParentDirectionInfo(row) {
    if (!row)
      return { type: "CENTRAL", label: "Sommet (DG)" };
    if (row.parentDirectionId || row.parentDirectionLibelle) {
      const pDir = this.directions.find((d) => String(d.id) === String(row.parentDirectionId));
      const name = pDir?.libelle || pDir?.name || row.parentDirectionLibelle || `Direction #${row.parentDirectionId}`;
      return { type: "PARENT_DIR", label: name };
    }
    if (row.departementId || row.departementLibelle || row.departmentLibelle) {
      const dep = this.departements.find((d) => String(d.id) === String(row.departementId));
      const name = dep?.libelle || dep?.name || row.departementLibelle || row.departmentLibelle || `D\xE9partement #${row.departementId}`;
      return { type: "DEPARTEMENT", label: name };
    }
    if (row.agenceId || row.agenceLibelle) {
      const ag = this.agences.find((a) => String(a.id) === String(row.agenceId));
      const name = ag?.libelle || ag?.name || row.agenceLibelle || `Agence #${row.agenceId}`;
      return { type: "AGENCE", label: name };
    }
    return { type: "CENTRAL", label: "Sommet (DG)" };
  }
  getSalaryItem(classification, echelon) {
    const classUpper = (classification || "").trim().toUpperCase();
    const echCode = `E${echelon}`;
    return this.dataSource.data.find((item) => {
      const itemCat = (item.categorie || item.code || "").trim().toUpperCase();
      const itemEch = String(item.echellon || "").trim().toUpperCase();
      const matchCat = itemCat === classUpper || classUpper === "C1" && (itemCat === "1" || itemCat === "1\xC8RE CATEGORIE" || itemCat === "1ERE CATEGORIE") || classUpper === "C2" && (itemCat === "2" || itemCat === "2\xC8ME CATEGORIE" || itemCat === "2EME CATEGORIE") || classUpper === "C3" && (itemCat === "3" || itemCat === "3\xC8ME CATEGORIE" || itemCat === "3EME CATEGORIE") || classUpper === "C4" && (itemCat === "4" || itemCat === "4\xC8ME CATEGORIE" || itemCat === "4EME CATEGORIE") || classUpper === "C5" && (itemCat === "5" || itemCat === "5\xC8ME CATEGORIE" || itemCat === "5EME CATEGORIE") || classUpper === "C6" && (itemCat === "6" || itemCat === "6\xC8ME CATEGORIE" || itemCat === "6EME CATEGORIE") || classUpper === "C7" && (itemCat === "7" || itemCat === "7\xC8ME CATEGORIE" || itemCat === "7EME CATEGORIE") || classUpper === "CL1" && (itemCat === "I" || itemCat === "CLASSE I") || classUpper === "CL2" && (itemCat === "II" || itemCat === "CLASSE II") || classUpper === "CL3" && (itemCat === "III" || itemCat === "CLASSE III") || classUpper === "CL4" && (itemCat === "IV" || itemCat === "CLASSE IV") || classUpper === "CL5" && (itemCat === "V" || itemCat === "CLASSE V") || classUpper === "CL6" && (itemCat === "VI" || itemCat === "CLASSE VI") || classUpper === "CL7" && (itemCat === "VII" || itemCat === "CLASSE VII") || classUpper === "CL8" && (itemCat === "VIII" || itemCat === "CLASSE VIII");
      const matchEch = itemEch === echCode || itemEch === String(echelon) || itemEch === `\xC9CHELON ${echelon}` || itemEch === `ECHELON ${echelon}`;
      return matchCat && matchEch;
    });
  }
  getSalary(classification, echelon) {
    const item = this.getSalaryItem(classification, echelon);
    return item ? item.montant ?? null : null;
  }
  getSalaryFormatted(classification, echelon) {
    const val = this.getSalary(classification, echelon);
    return val !== null ? this.formatMontant(val) : "-";
  }
  getCatCodeDisplay(raw) {
    if (!raw)
      return "-";
    const s = raw.trim().toUpperCase();
    if (s.startsWith("C") || s.startsWith("CL"))
      return s;
    if (s === "1" || s.includes("1\xC8RE") || s.includes("1ERE"))
      return "C1";
    if (s === "2" || s.includes("2\xC8ME") || s.includes("2EME"))
      return "C2";
    if (s === "3" || s.includes("3\xC8ME") || s.includes("3EME"))
      return "C3";
    if (s === "4" || s.includes("4\xC8ME") || s.includes("4EME"))
      return "C4";
    if (s === "5" || s.includes("5\xC8ME") || s.includes("5EME"))
      return "C5";
    if (s === "6" || s.includes("6\xC8ME") || s.includes("6EME"))
      return "C6";
    if (s === "7" || s.includes("7\xC8ME") || s.includes("7EME"))
      return "C7";
    if (s === "I" || s === "CLASSE I")
      return "CL1";
    if (s === "II" || s === "CLASSE II")
      return "CL2";
    if (s === "III" || s === "CLASSE III")
      return "CL3";
    if (s === "IV" || s === "CLASSE IV")
      return "CL4";
    if (s === "V" || s === "CLASSE V")
      return "CL5";
    if (s === "VI" || s === "CLASSE VI")
      return "CL6";
    if (s === "VII" || s === "CLASSE VII")
      return "CL7";
    if (s === "VIII" || s === "CLASSE VIII")
      return "CL8";
    return s;
  }
  getEchelonCodeDisplay(raw) {
    if (!raw)
      return "E01";
    const str = String(raw).trim().toUpperCase();
    if (str.startsWith("E") && !str.startsWith("ECH")) {
      const num = parseInt(str.substring(1), 10);
      if (!isNaN(num)) {
        return num < 10 ? `E0${num}` : `E${num}`;
      }
      return str;
    }
    const numStr = str.replace(/[^0-9]/g, "");
    if (numStr) {
      const num = parseInt(numStr, 10);
      return num < 10 ? `E0${num}` : `E${num}`;
    }
    return str;
  }
  getGradeConcat(row) {
    if (!row)
      return "-";
    const cat = this.getCatCodeDisplay(row.categorie || row.code);
    const ech = this.getEchelonCodeDisplay(row.echellon || row.code);
    return `${cat}${ech}`;
  }
  formatMontant(value) {
    if (!value && value !== 0)
      return "-";
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value).replace(/\s/g, "\xA0");
  }
  deleteCellEntry(classification, echelon) {
    const item = this.getSalaryItem(classification, echelon);
    if (!item)
      return;
    const msg = `Supprimer le salaire de ${classification} - \xC9chelon ${echelon} ?

Cette action est irr\xE9versible.`;
    if (confirm(msg)) {
      this.dbRefService.deleteItem(this.type, item).subscribe({
        next: (items) => {
          this.dataSource.data = items;
        },
        error: (err) => {
          alert(err.message || "Erreur lors de la suppression.");
        }
      });
    }
  }
  openCellEdit(classification, echelon) {
    let item = this.getSalaryItem(classification, echelon);
    const groupe = this.groupe1Classifications.includes(classification) ? "GROUPE I" : this.groupe2Classifications.includes(classification) ? "GROUPE II" : "GROUPE III";
    if (!item) {
      item = {
        code: classification,
        libelle: groupe,
        grade: groupe,
        categorie: classification,
        echelle: groupe,
        echellon: String(echelon),
        description: `${groupe} (${classification}) - \xC9chelon ${echelon}`,
        montant: 0,
        actif: true
      };
    } else {
      item = __spreadProps(__spreadValues({}, item), {
        code: classification,
        categorie: classification,
        grade: item.grade || item.libelle || groupe,
        echellon: String(echelon)
      });
    }
    this.openEditDialog(item);
  }
  viewMode = "list";
  constructor(route, moduleNav, dbRefService, employeeService, dialog, fb) {
    this.route = route;
    this.moduleNav = moduleNav;
    this.dbRefService = dbRefService;
    this.employeeService = employeeService;
    this.dialog = dialog;
    this.fb = fb;
    this.formGroup = this.fb.group({
      code: ["", [Validators.maxLength(25)]],
      libelle: ["", [Validators.maxLength(150)]],
      description: [""],
      actif: [true],
      montant: [0, [Validators.min(0)]],
      agenceId: [null],
      departementId: [null],
      directionId: [null],
      parentDirectionId: [null],
      directeurId: [null],
      echelle: [""],
      echellon: [""],
      typeIndemnite: [""],
      typeIndemniteId: [null],
      typeRetenue: ["Part Agent"],
      typeRetenueId: [null],
      regimeSecuriteSocialId: [null],
      baseCalcul: ["REMUNERATION_BRUTE"],
      fonction: [""],
      fonctionId: [null],
      emploi: [""],
      emploiId: [null],
      grade: [""],
      categorie: [""],
      gradeId: [null],
      categorieId: [null],
      echelonId: [null],
      categories: [[]],
      taux: [0, [Validators.min(0)]],
      tauxExoneration: [0, [Validators.min(0), Validators.max(100)]],
      plafondExoneration: [0, [Validators.min(0)]],
      tauxAbattement: [25, [Validators.min(0), Validators.max(100)]],
      typeNomination: ["NON_NOMMEE"]
    });
  }
  ngOnInit() {
    this.moduleNav.selectModule(this.module);
    this.route.data.subscribe((data) => {
      this.title = data["title"] ?? "";
      this.icon = data["icon"] ?? "list";
      this.type = data["type"] ?? "";
      if (this.type === "grille-salariale") {
        this.displayedColumns = ["gradeConcat", "categorie", "echellon", "montant", "actif", "actions"];
      } else if (this.type === "param-indemnite") {
        this.indemniteTab = "ORDINAIRE";
        this.regleType = "ORDINAIRE";
        this.displayedColumns = ["code", "typeIndemnite", "grade", "categorie", "taux", "actif", "actions"];
      } else if (this.type === "param-retraite") {
        this.displayedColumns = ["grade", "taux", "actif", "actions"];
      } else if (this.type === "param-prise-en-charge") {
        this.displayedColumns = ["code", "libelle", "taux", "actif", "actions"];
      } else if (this.type === "type-indemnite") {
        this.displayedColumns = ["libelle", "tauxExoneration", "plafondExoneration", "actif", "actions"];
      } else if (this.type === "type-retenue-emploi") {
        this.displayedColumns = ["libelle", "typeRetenue", "regimeSecuriteSocial", "baseCalcul", "taux", "actif", "actions"];
      } else if (this.type === "grade") {
        this.displayedColumns = ["code", "libelle", "actif", "actions"];
      } else if (this.type === "param-groupe") {
        this.displayedColumns = ["grade", "categorie", "actif", "actions"];
      } else if (this.type === "categorie") {
        this.displayedColumns = ["code", "libelle", "tauxAbattement", "actif", "actions"];
      } else if (this.type === "fonction" || this.type?.includes("fonction")) {
        this.displayedColumns = ["libelle", "actif", "actions"];
      } else if (this.type === "service") {
        this.displayedColumns = ["code", "libelle", "parentRattachement", "actif", "actions"];
      } else if (this.type === "direction") {
        this.displayedColumns = ["code", "libelle", "parentRattachement", "actif", "actions"];
      } else if (this.type === "departement") {
        this.displayedColumns = ["code", "libelle", "parentRattachement", "actif", "actions"];
      } else {
        this.displayedColumns = this.shouldHideCode ? ["libelle", "actif", "actions"] : ["code", "libelle", "actif", "actions"];
      }
      this.searchQuery = "";
      this.loadHierarchyData();
      this.loadData();
    });
  }
  get shouldHideCode() {
    const hiddenTypes = [
      "emploi",
      "fonction",
      "type-indemnite",
      "type-retenue-employe",
      "type-retenue-emploi",
      "type-contrat",
      "type-conge",
      "param-groupe",
      "retenue",
      "param-retraite"
    ];
    return hiddenTypes.includes(this.type) || (this.type ? this.type.includes("fonction") : false);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === "gradeConcat")
        return this.getGradeConcat(item);
      if (property === "categorie")
        return this.getCatCodeDisplay(item.categorie || item.code);
      if (property === "echellon")
        return this.getEchelonCodeDisplay(item.echellon);
      if (property === "parentRattachement") {
        if (this.type === "service")
          return this.getParentServiceInfo(item).label;
        if (this.type === "direction")
          return this.getParentDirectionInfo(item).label;
        if (this.type === "departement")
          return this.getParentDepartmentInfo(item).label;
      }
      return item[property];
    };
    this.dataSource.filterPredicate = (data, filter) => {
      let extra = "";
      if (this.type === "service")
        extra = " " + this.getParentServiceInfo(data).label;
      if (this.type === "direction")
        extra = " " + this.getParentDirectionInfo(data).label;
      if (this.type === "departement")
        extra = " " + this.getParentDepartmentInfo(data).label;
      const searchStr = (Object.values(data).join(" ") + " " + this.getGradeConcat(data) + extra).toLowerCase();
      return searchStr.includes(filter);
    };
  }
  getGradeName(row) {
    const cat = row.categorie || row.code || "";
    if (this.groupe1Classifications.includes(cat))
      return "GROUPE I";
    if (this.groupe2Classifications.includes(cat))
      return "GROUPE II";
    if (this.groupe3Classifications.includes(cat))
      return "GROUPE III";
    return row.grade || row.libelle || row.echelle || "GROUPE I";
  }
  loadData() {
    this.dbRefService.getItems$(this.type).subscribe((items) => {
      this.onItemsLoaded(items);
    });
  }
  onItemsLoaded(items) {
    this.rawIndemniteItems = items || [];
    if (this.type === "param-indemnite") {
      this.updateIndemniteDataSource();
    } else {
      this.dataSource.data = this.rawIndemniteItems;
    }
    if (this.paginator)
      this.dataSource.paginator = this.paginator;
    if (this.sort)
      this.dataSource.sort = this.sort;
  }
  loadHierarchyData() {
    this.dbRefService.getItems("grade").subscribe((items) => this.grades = items);
    if (this.type === "direction" || this.type === "departement") {
      this.dbRefService.getItems("agence").subscribe((items) => this.agences = items);
      this.employeeService.getAll().subscribe((emps) => {
        const list = [];
        const set = /* @__PURE__ */ new Set();
        (emps || []).forEach((emp) => {
          const id = emp.id != null ? String(emp.id) : "";
          const name = emp.prenom && emp.nom ? `${emp.prenom} ${emp.nom}`.trim() : emp.name || emp.matricule || "";
          if (id && name && !set.has(id)) {
            set.add(id);
            list.push({ id, libelle: name, description: emp.poste || emp.matricule });
          }
        });
        this.directeursList = list;
      });
    } else {
      this.agences = [];
      this.directeursList = [];
    }
    if (this.type === "direction" || this.type === "service") {
      this.dbRefService.getItems("departement").subscribe((items) => this.departements = items);
    } else {
      this.departements = [];
    }
    if (this.type === "service" || this.type === "direction" || this.type === "departement") {
      this.dbRefService.getItems("direction").subscribe((items) => this.directions = items);
    } else {
      this.directions = [];
    }
    if (this.type === "grille-salariale" || this.type === "param-indemnite" || this.type === "param-groupe") {
      this.dbRefService.getItems("grade").subscribe((items) => this.grades = items);
      this.dbRefService.getItems("param-groupe").subscribe((items) => this.paramGroupesList = items);
      this.dbRefService.getItems("categorie").subscribe((items) => {
        this.categories = items || [];
        if (items && items.length > 0) {
          this.categoriesList = items.map((c) => c.code || c.libelle).filter((n) => !!n);
        } else {
          this.categoriesList = [];
        }
      });
      this.dbRefService.getItems("echelon").subscribe((items) => {
        this.echelons = items || [];
        if (items && items.length > 0) {
          this.echelonsList = items.map((e) => e.code || e.libelle).filter((n) => !!n);
        } else {
          this.echelonsList = [];
        }
      });
    } else {
      this.grades = [];
      this.paramGroupesList = [];
    }
    if (this.type === "param-indemnite" || this.type === "fonction") {
      this.dbRefService.getItems("type-indemnite").subscribe((items) => {
        this.typesIndemnite = items;
        if (items && items.length > 0) {
          const names = items.map((i) => i.name || i.libelle || i.code).filter((n) => !!n);
          this.typesIndemniteList = Array.from(new Set(names));
        } else {
          this.typesIndemniteList = [];
        }
      });
      this.dbRefService.getItems("fonction").subscribe((items) => this.fonctions = items);
      this.dbRefService.getItems("emploi").subscribe((items) => this.emplois = items);
    } else {
      this.typesIndemnite = [];
      this.fonctions = [];
      this.emplois = [];
    }
    if (this.type === "type-retenue-emploi") {
      this.dbRefService.getItems("type-retenue-employe").subscribe((items) => {
        if (items && items.length > 0) {
          this.typesRetenueList = items;
        } else {
          this.typesRetenueList = [];
        }
      });
      this.dbRefService.getItems("regime-securite-social").subscribe((items) => {
        this.regimesSecuriteSocialList = (items || []).filter((item) => item.actif !== false);
      });
    } else {
      this.typesRetenueList = [];
      this.regimesSecuriteSocialList = [];
    }
  }
  applyFilter() {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }
  setupValidators() {
    this.formGroup.get("code")?.clearValidators();
    if (this.type === "regime-securite-social") {
      this.formGroup.get("code")?.setValidators([
        Validators.required,
        Validators.maxLength(25)
      ]);
    } else {
      this.formGroup.get("code")?.setValidators([
        Validators.maxLength(25)
      ]);
    }
    this.formGroup.get("code")?.updateValueAndValidity();
    this.formGroup.get("libelle")?.clearValidators();
    this.formGroup.get("typeIndemnite")?.clearValidators();
    this.formGroup.get("typeIndemniteId")?.clearValidators();
    this.formGroup.get("typeRetenue")?.clearValidators();
    this.formGroup.get("typeRetenueId")?.clearValidators();
    this.formGroup.get("baseCalcul")?.clearValidators();
    this.formGroup.get("fonctionId")?.clearValidators();
    this.formGroup.get("emploiId")?.clearValidators();
    this.formGroup.get("directeurId")?.clearValidators();
    this.formGroup.get("agenceId")?.clearValidators();
    this.formGroup.get("departementId")?.clearValidators();
    this.formGroup.get("directionId")?.clearValidators();
    this.formGroup.get("parentDirectionId")?.clearValidators();
    this.formGroup.get("gradeId")?.clearValidators();
    this.formGroup.get("categorieId")?.clearValidators();
    this.formGroup.get("echelonId")?.clearValidators();
    if (this.type === "param-indemnite") {
      this.formGroup.get("typeIndemniteId")?.setValidators([Validators.required]);
      this.formGroup.get("taux")?.setValidators([Validators.required, Validators.min(0)]);
      if (this.regleType === "ORDINAIRE") {
        this.formGroup.get("gradeId")?.setValidators([Validators.required]);
        this.formGroup.get("categorieId")?.setValidators([Validators.required]);
        this.formGroup.get("fonctionId")?.clearValidators();
        this.formGroup.get("emploiId")?.clearValidators();
      } else if (this.regleType === "NOMINATION") {
        this.formGroup.get("gradeId")?.clearValidators();
        this.formGroup.get("categorieId")?.clearValidators();
        this.formGroup.get("fonctionId")?.setValidators([Validators.required]);
        this.formGroup.get("emploiId")?.clearValidators();
      } else if (this.regleType === "SPECIFIQUE") {
        this.formGroup.get("gradeId")?.clearValidators();
        this.formGroup.get("categorieId")?.clearValidators();
        this.formGroup.get("fonctionId")?.clearValidators();
        this.formGroup.get("emploiId")?.setValidators([Validators.required]);
      }
    } else if (this.type === "type-retenue-emploi") {
      this.formGroup.get("typeRetenueId")?.setValidators([Validators.required]);
      this.formGroup.get("baseCalcul")?.setValidators([Validators.required]);
    } else if (this.type === "grille-salariale") {
      this.formGroup.get("gradeId")?.setValidators([Validators.required]);
      this.formGroup.get("categorieId")?.setValidators([Validators.required]);
      this.formGroup.get("echelonId")?.setValidators([Validators.required]);
    } else if (this.type === "param-groupe") {
      this.formGroup.get("gradeId")?.setValidators([Validators.required]);
      this.formGroup.get("categorieId")?.setValidators([Validators.required]);
    } else if (this.type === "param-retraite") {
      this.formGroup.get("gradeId")?.setValidators([Validators.required]);
    } else if (this.type === "service") {
      this.formGroup.get("directionId")?.setValidators([Validators.required]);
    } else {
      this.formGroup.get("libelle")?.setValidators([
        ...this.type === "regime-securite-social" ? [Validators.required] : [],
        Validators.maxLength(150)
      ]);
    }
    this.formGroup.get("libelle")?.updateValueAndValidity();
    this.formGroup.get("typeIndemnite")?.updateValueAndValidity();
    this.formGroup.get("typeIndemniteId")?.updateValueAndValidity();
    this.formGroup.get("typeRetenue")?.updateValueAndValidity();
    this.formGroup.get("typeRetenueId")?.updateValueAndValidity();
    this.formGroup.get("baseCalcul")?.updateValueAndValidity();
    this.formGroup.get("fonctionId")?.updateValueAndValidity();
    this.formGroup.get("emploiId")?.updateValueAndValidity();
    this.formGroup.get("directeurId")?.updateValueAndValidity();
    this.formGroup.get("departementId")?.updateValueAndValidity();
    this.formGroup.get("agenceId")?.updateValueAndValidity();
    this.formGroup.get("directionId")?.updateValueAndValidity();
    this.formGroup.get("parentDirectionId")?.updateValueAndValidity();
    this.formGroup.get("gradeId")?.updateValueAndValidity();
    this.formGroup.get("categorieId")?.updateValueAndValidity();
    this.formGroup.get("echelonId")?.updateValueAndValidity();
  }
  openAddDialog() {
    if (this.dialogRef)
      return;
    this.isEditing = false;
    this.editingItem = null;
    this.fonctionIndemnitesList = [];
    this.formGroup.reset({
      code: "",
      libelle: "",
      description: "",
      actif: true,
      montant: 0,
      agenceId: null,
      departementId: null,
      directionId: null,
      parentDirectionId: null,
      directeurId: null,
      categorieId: null,
      echelonId: null,
      gradeId: null,
      echelle: "",
      echellon: "",
      typeIndemnite: "",
      typeIndemniteId: null,
      typeRetenue: "",
      typeRetenueId: null,
      regimeSecuriteSocialId: null,
      baseCalcul: "REMUNERATION_BRUTE",
      fonction: "",
      fonctionId: null,
      emploi: "",
      emploiId: null,
      grade: "",
      categorie: "",
      categories: [],
      taux: 0,
      tauxExoneration: 0,
      plafondExoneration: 0,
      tauxAbattement: 25,
      typeNomination: "NON_NOMMEE"
    });
    if (this.type === "grille-salariale") {
      this.formGroup.patchValue({
        categorieId: null,
        echelonId: null,
        gradeId: null,
        montant: 0
      });
    } else if (this.type === "param-indemnite") {
      this.regleType = this.indemniteTab;
      this.availableCategoriesForSelectedGroup = [];
      this.formGroup.patchValue({
        typeNomination: this.indemniteTab === "ORDINAIRE" ? "NON_NOMMEE" : "NOMMEE",
        fonctionId: null,
        emploiId: null,
        gradeId: null,
        categorieId: null
      });
    }
    this.setupValidators();
    this.formGroup.get("code")?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: "560px" });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
      this.saving = false;
    });
  }
  openEditDialog(item) {
    if (this.dialogRef)
      return;
    this.isEditing = true;
    this.editingItem = item;
    const defaultAbattement = item.tauxAbattement ?? (["V", "VI", "VII", "VIII"].includes(item.code) ? 20 : 25);
    if (this.type === "grille-salariale") {
      this.formGroup.reset({
        code: item.code || "",
        libelle: item.libelle || "",
        description: item.description || "",
        actif: item.actif ?? true,
        montant: item.montant ?? 0,
        departementId: item.departementId ?? null,
        directionId: item.directionId ?? null,
        categorieId: item.categorieId ? String(item.categorieId) : null,
        echelonId: item.echelonId ? String(item.echelonId) : null,
        gradeId: item.gradeId ? String(item.gradeId) : null,
        echelle: "",
        echellon: String(item.echellon || ""),
        typeIndemnite: "",
        typeRetenue: "",
        fonction: "",
        grade: item.grade || "",
        categorie: item.categorie || "",
        taux: 0
      });
    } else if (this.type === "param-indemnite") {
      this.regleType = this.getItemRegleType(item);
      const nomType = item.typeNomination || (this.regleType === "ORDINAIRE" ? "NON_NOMMEE" : "NOMMEE");
      this.formGroup.reset({
        code: item.code || "",
        libelle: item.typeIndemnite || item.libelle || "",
        description: item.description || "",
        actif: item.actif ?? true,
        montant: item.montant ?? 0,
        departementId: null,
        directionId: null,
        echelle: "",
        echellon: "",
        typeIndemnite: item.typeIndemniteLibelle || item.typeIndemnite || item.libelle || "",
        typeIndemniteId: item.typeIndemniteId ? String(item.typeIndemniteId) : null,
        typeRetenue: "Part Agent",
        fonction: item.fonctionLibelle || item.fonction || "",
        fonctionId: item.fonctionId ? String(item.fonctionId) : null,
        emploi: item.emploiLibelle || item.emploi || "",
        emploiId: item.emploiId ? String(item.emploiId) : null,
        grade: item.gradeLibelle || item.grade || "",
        gradeId: item.gradeId ? String(item.gradeId) : null,
        categorie: item.categorieLibelle || item.categorie || "",
        categorieId: item.categorieId ? String(item.categorieId) : null,
        taux: item.taux ?? item.montant ?? 0,
        tauxExoneration: item.tauxExoneration ?? 0,
        plafondExoneration: item.plafondExoneration ?? 0,
        tauxAbattement: defaultAbattement,
        typeNomination: nomType
      });
      this.setupValidators();
    } else if (this.type === "type-retenue-emploi") {
      this.formGroup.reset({
        code: item.code || "",
        libelle: item.libelle || "",
        description: item.description || "",
        actif: item.actif ?? true,
        montant: item.montant ?? 0,
        departementId: null,
        directionId: null,
        echelle: "",
        echellon: "",
        typeIndemnite: "",
        typeRetenue: item.typeRetenueLibelle || item.typeRetenue || "",
        typeRetenueId: item.typeRetenueId ? String(item.typeRetenueId) : null,
        regimeSecuriteSocialId: item.regimeSecuriteSocialId ? String(item.regimeSecuriteSocialId) : null,
        baseCalcul: item.baseCalcul || "REMUNERATION_BRUTE",
        fonction: item.fonction || "",
        grade: item.grade || "",
        categorie: item.categorie || "",
        taux: item.taux ?? 0,
        tauxExoneration: 0,
        plafondExoneration: 0
      });
    } else if (this.type === "grade") {
      this.formGroup.reset({
        code: item.code || item.libelle || "",
        libelle: item.libelle || item.code || "",
        description: item.description || "",
        actif: item.actif ?? true,
        montant: 0,
        departementId: null,
        directionId: null,
        echelle: "",
        echellon: "",
        typeIndemnite: "",
        typeRetenue: "Part Agent",
        fonction: "",
        grade: item.libelle || "",
        categorie: "",
        categories: [],
        taux: 0,
        tauxExoneration: 0,
        plafondExoneration: 0,
        tauxAbattement: defaultAbattement
      });
    } else if (this.type === "param-groupe") {
      this.formGroup.reset({
        code: item.code || "",
        libelle: item.gradeLibelle || item.grade || item.libelle || "",
        description: item.description || "",
        actif: item.actif ?? true,
        montant: 0,
        departementId: null,
        directionId: null,
        echelle: "",
        echellon: "",
        typeIndemnite: "",
        typeRetenue: "Part Agent",
        fonction: "",
        grade: item.gradeLibelle || item.grade || item.libelle || "",
        gradeId: item.gradeId ? String(item.gradeId) : null,
        categorie: item.categorieLibelle || item.categorie || "",
        categorieId: item.categorieId ? String(item.categorieId) : null,
        categories: [],
        taux: 0,
        tauxExoneration: 0,
        plafondExoneration: 0,
        tauxAbattement: defaultAbattement
      });
    } else if (this.type === "param-retraite") {
      this.formGroup.reset({
        code: item.code || "",
        libelle: item.gradeLibelle || item.libelle || item.grade || "",
        description: item.description || "",
        actif: item.actif ?? true,
        montant: item.taux ?? item.montant ?? 60,
        departementId: null,
        directionId: null,
        echelle: "",
        echellon: "",
        typeIndemnite: "",
        typeRetenue: "Part Agent",
        fonction: "",
        grade: item.gradeLibelle || item.libelle || item.grade || "",
        gradeId: item.gradeId ? String(item.gradeId) : null,
        categorie: "",
        taux: item.taux ?? item.montant ?? 60,
        tauxExoneration: 0,
        plafondExoneration: 0,
        tauxAbattement: 25
      });
    } else {
      this.formGroup.reset({
        code: item.code || "",
        libelle: item.libelle || "",
        description: item.description || "",
        actif: item.actif ?? true,
        montant: item.montant ?? 0,
        agenceId: item.agenceId ? String(item.agenceId) : null,
        departementId: item.departementId ? String(item.departementId) : null,
        directionId: item.directionId ? String(item.directionId) : null,
        parentDirectionId: item.parentDirectionId ? String(item.parentDirectionId) : null,
        directeurId: item.directeurId ? String(item.directeurId) : null,
        echelle: item.echelle || "",
        echellon: item.echellon || "",
        typeIndemnite: "",
        typeRetenue: item.typeRetenue || "Part Agent",
        fonction: "",
        grade: "",
        categorie: "",
        taux: 0,
        tauxExoneration: item.tauxExoneration ?? 0,
        plafondExoneration: item.plafondExoneration ?? 0,
        tauxAbattement: defaultAbattement,
        typeNomination: item.typeNomination || "NON_NOMMEE"
      });
    }
    if (this.type === "fonction") {
      const nomType = item.typeNomination || "NON_NOMMEE";
      const itemInds = item.indemnites;
      if (Array.isArray(itemInds) && itemInds.length > 0) {
        this.fonctionIndemnitesList = itemInds.map((i) => ({ typeIndemnite: i.typeIndemnite, montant: i.montant }));
      } else if (nomType === "NOMMEE") {
        this.fonctionIndemnitesList = this.getDefaultIndemnitesForFonction(item.libelle || item.code || "");
      } else {
        this.fonctionIndemnitesList = [];
      }
    } else {
      this.fonctionIndemnitesList = [];
    }
    this.setupValidators();
    this.formGroup.get("code")?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: "560px" });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
      this.saving = false;
    });
  }
  generateCode(type, libelle) {
    const pfxMap = {
      "emploi": "EMP",
      "fonction": "FCT",
      "departement": "DEP",
      "direction": "DIR",
      "service": "SRV",
      "categorie": "CAT",
      "grade": "GRP",
      "param-groupe": "PG",
      "echelon": "ECH",
      "type-indemnite": "IND",
      "param-indemnite": "PAR",
      "type-retenue-emploi": "RET",
      "type-retenue-employe": "TRE",
      "param-retraite": "RET",
      "param-prise-en-charge": "PEC",
      "type-conge": "TAC"
    };
    const prefix = pfxMap[type] || "REF";
    const currentList = type === "param-indemnite" && this.rawIndemniteItems && this.rawIndemniteItems.length > 0 ? this.rawIndemniteItems : this.dataSource.data || [];
    let maxNum = 0;
    currentList.forEach((item) => {
      if (item.code && item.code.includes("-")) {
        const parts = item.code.split("-");
        const lastPart = parts[parts.length - 1];
        const num = parseInt(lastPart, 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });
    const nextId = maxNum > 0 ? maxNum + 1 : currentList.length + 1;
    const seqStr = String(nextId).padStart(3, "0");
    return `${prefix}-${seqStr}`;
  }
  onSubmit() {
    if (this.saving)
      return;
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.saving = true;
    const v = this.formGroup.getRawValue();
    const selectedGrade = this.grades.find((grade) => String(grade.id) === String(v.gradeId));
    const selectedCategorie = this.categories.find((categorie) => String(categorie.id) === String(v.categorieId));
    const selectedEchelon = this.echelons.find((echelon) => String(echelon.id) === String(v.echelonId));
    const selectedAgence = this.agences.find((agence) => String(agence.id) === String(v.agenceId));
    const selectedTypeIndemnite = this.typesIndemnite.find((type) => String(type.id) === String(v.typeIndemniteId));
    const selectedFonction = this.fonctions.find((fonction) => String(fonction.id) === String(v.fonctionId));
    const selectedTypeRetenue = this.typesRetenueList.find((type) => String(type.id) === String(v.typeRetenueId));
    const selectedRegimeSecuriteSocial = this.regimesSecuriteSocialList.find((regime) => String(regime.id) === String(v.regimeSecuriteSocialId));
    const selectedDepartement = this.departements.find((departement) => String(departement.id) === String(v.departementId));
    const selectedDirection = this.directions.find((direction) => String(direction.id) === String(v.directionId));
    const selectedParentDirection = this.directions.find((direction) => String(direction.id) === String(v.parentDirectionId));
    const selectedDirecteur = this.directeursList.find((directeur) => directeur.id === String(v.directeurId));
    let item;
    if (this.type === "grille-salariale") {
      const gradeCode = selectedGrade?.code || selectedGrade?.libelle || "";
      const categorieCode = selectedCategorie?.code || selectedCategorie?.libelle || "";
      const echelonCode = selectedEchelon?.code || selectedEchelon?.libelle || "";
      const gradeLabel = selectedGrade?.libelle || selectedGrade?.code || "";
      const categorieLabel = selectedCategorie?.libelle || selectedCategorie?.code || "";
      const echelonLabel = selectedEchelon?.libelle || selectedEchelon?.code || "";
      item = {
        id: this.editingItem?.id,
        code: `${categorieCode}${echelonCode}`,
        libelle: gradeLabel,
        description: `${gradeLabel} (${categorieCode}) - \xC9chelon ${echelonCode}`,
        actif: v.actif ?? true,
        montant: Number(v.montant ?? v.taux ?? 0),
        gradeId: String(v.gradeId),
        categorieId: String(v.categorieId),
        echelonId: String(v.echelonId),
        echelle: gradeLabel,
        echellon: echelonCode,
        grade: gradeCode,
        categorie: categorieCode
      };
    } else if (this.type === "param-indemnite") {
      const typeIndemniteLabel = selectedTypeIndemnite?.libelle || selectedTypeIndemnite?.code || "";
      const fonctionLabel = selectedFonction?.libelle || selectedFonction?.name || selectedFonction?.code || "";
      const gradeLabel = selectedGrade?.libelle || selectedGrade?.code || "";
      const categorieLabel = selectedCategorie?.libelle || selectedCategorie?.code || "";
      const libVal = typeIndemniteLabel || "Indemnit\xE9";
      let finalCode = this.editingItem?.code || (v.code && v.code.trim() ? v.code.trim() : this.generateCode(this.type, libVal));
      if (!this.editingItem && this.rawIndemniteItems && this.rawIndemniteItems.some((it) => it.code === finalCode)) {
        finalCode = this.generateCode(this.type, libVal);
      }
      const isOrdinaire = this.regleType === "ORDINAIRE";
      const isNomination = this.regleType === "NOMINATION";
      const isSpecifique = this.regleType === "SPECIFIQUE";
      const selectedEmploi = this.emplois.find((e) => String(e.id) === String(v.emploiId) || e.code === v.emploiId);
      const emploiLabel = selectedEmploi?.libelle || selectedEmploi?.name || selectedEmploi?.code || "";
      item = {
        id: this.editingItem?.id,
        code: finalCode,
        libelle: libVal,
        description: isOrdinaire ? `Groupe: ${gradeLabel || "-"}, Cat: ${categorieLabel || "-"}` : isSpecifique ? `Emploi: ${emploiLabel || "-"}` : `Fonction: ${fonctionLabel || "-"}`,
        actif: v.actif ?? true,
        montant: Number(v.taux ?? v.montant ?? 0),
        typeIndemnite: libVal,
        typeIndemniteId: String(v.typeIndemniteId),
        typeIndemniteLibelle: libVal,
        fonctionId: isNomination && v.fonctionId ? String(v.fonctionId) : void 0,
        fonction: isNomination ? fonctionLabel || v.fonction || "" : "",
        fonctionLibelle: isNomination ? fonctionLabel || v.fonction || "" : "",
        emploiId: isSpecifique && v.emploiId ? String(v.emploiId) : void 0,
        emploi: isSpecifique ? emploiLabel || v.emploi || "" : "",
        emploiLibelle: isSpecifique ? emploiLabel || v.emploi || "" : "",
        gradeId: isOrdinaire && v.gradeId ? String(v.gradeId) : void 0,
        grade: isOrdinaire ? gradeLabel || v.grade || "" : "",
        gradeLibelle: isOrdinaire ? gradeLabel || v.grade || "" : "",
        categorieId: isOrdinaire && v.categorieId ? String(v.categorieId) : void 0,
        categorie: isOrdinaire ? categorieLabel || v.categorie || "" : "",
        categorieLibelle: isOrdinaire ? categorieLabel || v.categorie || "" : "",
        taux: Number(v.taux ?? v.montant ?? 0),
        tauxExoneration: Number(v.tauxExoneration ?? 0),
        plafondExoneration: Number(v.plafondExoneration ?? 0),
        regleType: this.regleType,
        typeNomination: isOrdinaire ? "NON_NOMMEE" : "NOMMEE"
      };
    } else if (this.type === "grade") {
      const gName = v.libelle || v.grade || "GROUPE I";
      const finalCode = this.editingItem?.code || (v.code && v.code.trim() ? v.code.trim() : this.generateCode(this.type, gName));
      item = {
        id: this.editingItem?.id,
        code: finalCode,
        libelle: gName,
        description: v.description || "",
        actif: v.actif ?? true
      };
    } else if (this.type === "param-groupe") {
      const grp = selectedGrade?.libelle || selectedGrade?.code || "";
      const categorie = selectedCategorie?.libelle || selectedCategorie?.code || "";
      const finalCode = this.editingItem?.code || (v.code && v.code.trim() ? v.code.trim() : this.generateCode(this.type, grp));
      item = {
        id: this.editingItem?.id,
        code: finalCode,
        grade: grp,
        gradeId: String(v.gradeId),
        gradeLibelle: grp,
        libelle: grp,
        categorieId: String(v.categorieId),
        categorie,
        categorieLibelle: categorie,
        description: v.description || "",
        actif: v.actif ?? true
      };
    } else if (this.type === "param-retraite") {
      const grp = selectedGrade?.libelle || selectedGrade?.code || "";
      const ageVal = Number(v.taux ?? v.montant ?? 60);
      const codeVal = this.editingItem?.code || (v.code && v.code.trim() ? v.code.trim() : this.generateCode(this.type, grp));
      item = {
        id: this.editingItem?.id,
        code: codeVal,
        libelle: grp,
        description: v.description || `${grp} : ${ageVal} ans`,
        actif: v.actif ?? true,
        taux: ageVal,
        montant: ageVal,
        grade: grp,
        gradeId: String(v.gradeId),
        gradeLibelle: grp
      };
    } else if (this.type === "type-retenue-emploi") {
      const libVal = v.libelle || "Retenue";
      const finalCode = this.editingItem?.code || (v.code && v.code.trim() ? v.code.trim() : this.generateCode(this.type, libVal));
      item = {
        id: this.editingItem?.id,
        code: finalCode,
        libelle: libVal,
        description: v.description || "",
        actif: v.actif ?? true,
        typeRetenueId: String(v.typeRetenueId),
        typeRetenue: selectedTypeRetenue?.libelle || selectedTypeRetenue?.code || "",
        typeRetenueLibelle: selectedTypeRetenue?.libelle || selectedTypeRetenue?.code || "",
        regimeSecuriteSocialId: v.regimeSecuriteSocialId ? String(v.regimeSecuriteSocialId) : void 0,
        regimeSecuriteSocialCode: selectedRegimeSecuriteSocial?.code || "",
        regimeSecuriteSocialLibelle: selectedRegimeSecuriteSocial?.libelle || "",
        taux: Number(v.taux ?? 0),
        baseCalcul: v.baseCalcul
      };
    } else {
      const libelleVal = v.libelle && v.libelle.trim() ? v.libelle.trim() : this.editingItem?.libelle || "Nouvel \xC9l\xE9ment";
      const generatedCode = this.editingItem?.code || (v.code && v.code.trim() ? v.code.trim() : this.generateCode(this.type, libelleVal));
      item = {
        id: this.editingItem?.id,
        code: generatedCode,
        libelle: libelleVal,
        description: v.description || "",
        actif: v.actif ?? true,
        montant: v.montant ? Number(v.montant) : void 0,
        agenceId: v.agenceId ? String(v.agenceId) : void 0,
        agenceLibelle: selectedAgence?.libelle,
        departementId: v.departementId ? String(v.departementId) : void 0,
        departementLibelle: selectedDepartement?.libelle,
        directionId: v.directionId ? String(v.directionId) : void 0,
        directionLibelle: selectedDirection?.libelle,
        parentDirectionId: v.parentDirectionId ? String(v.parentDirectionId) : void 0,
        parentDirectionLibelle: selectedParentDirection?.libelle,
        directeurId: v.directeurId ? String(v.directeurId) : void 0,
        directeurLibelle: selectedDirecteur?.libelle,
        tauxAbattement: v.tauxAbattement !== void 0 && v.tauxAbattement !== null ? Number(v.tauxAbattement) : void 0,
        tauxExoneration: v.tauxExoneration !== void 0 && v.tauxExoneration !== null ? Number(v.tauxExoneration) : void 0,
        plafondExoneration: v.plafondExoneration !== void 0 && v.plafondExoneration !== null ? Number(v.plafondExoneration) : void 0,
        typeNomination: this.type === "fonction" ? v.typeNomination || this.formGroup.get("typeNomination")?.value || "NON_NOMMEE" : void 0,
        indemnites: this.type === "fonction" && (v.typeNomination || this.formGroup.get("typeNomination")?.value) === "NOMMEE" ? this.fonctionIndemnitesList : []
      };
    }
    const targetCode = this.editingItem?.code || item.code;
    if (this.isEditing && this.editingItem) {
      this.dbRefService.updateItem(this.type, targetCode, item).subscribe({
        next: (items) => {
          this.onItemsLoaded(items);
          if (this.type === "grille-salariale" && this.paginator) {
            this.paginator.pageSize = 250;
          }
          this.dialogRef.close();
        },
        error: (err) => {
          this.saving = false;
          alert(err.message || "Erreur lors de la modification.");
        }
      });
    } else {
      this.dbRefService.addItem(this.type, item).subscribe({
        next: (items) => {
          this.onItemsLoaded(items);
          if (this.type === "grille-salariale" && this.paginator) {
            this.paginator.pageSize = 250;
          }
          this.dialogRef.close();
        },
        error: (err) => {
          this.saving = false;
          alert(err.message || "Erreur lors de la cr\xE9ation.");
        }
      });
    }
  }
  deleteItem(item, event) {
    event.stopPropagation();
    const msg = `Attention - Conflit potentiel :

L'\xE9l\xE9ment "${item.libelle}" (${item.code}) risque d'\xEAtre d\xE9j\xE0 utilis\xE9 dans l'application.

Il est vivement recommand\xE9 de le D\xC9SACTIVER plut\xF4t que de le supprimer pour \xE9viter toute rupture de donn\xE9es.

Voulez-vous quand m\xEAme supprimer cet \xE9l\xE9ment ?`;
    if (confirm(msg)) {
      this.dbRefService.deleteItem(this.type, item).subscribe({
        next: (items) => {
          this.onItemsLoaded(items);
        },
        error: (err) => {
          alert(err.message || "Erreur lors de la suppression.");
        }
      });
    }
  }
  toggleStatus(item, event) {
    event.stopPropagation();
    if (item.actif) {
      const msg = `Attention - Conflit d'utilisation :

L'\xE9l\xE9ment "${item.libelle}" (${item.code}) va \xEAtre d\xE9sactiv\xE9.

Une fois d\xE9sactiv\xE9, il n'appara\xEEtra plus dans les s\xE9lecteurs pour les nouvelles cr\xE9ations. Les enregistrements existants conserveront cette donn\xE9e.

Confirmez-vous la d\xE9sactivation ?`;
      if (!confirm(msg))
        return;
    }
    this.dbRefService.toggleItemStatus(this.type, item.code).subscribe({
      next: (items) => {
        this.onItemsLoaded(items);
      },
      error: (err) => {
        alert(err.message || "Erreur lors du changement de statut.");
      }
    });
  }
  get totalActifs() {
    return this.dataSource.data.filter((r) => r.actif).length;
  }
  get totalInactifs() {
    return this.dataSource.data.filter((r) => !r.actif).length;
  }
  static \u0275fac = function DbRefListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DbRefListComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(ModuleNavService), \u0275\u0275directiveInject(DbRefService), \u0275\u0275directiveInject(EmployeeService), \u0275\u0275directiveInject(MatDialog), \u0275\u0275directiveInject(FormBuilder));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DbRefListComponent, selectors: [["app-db-ref-list"]], viewQuery: function DbRefListComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(MatPaginator, 5);
      \u0275\u0275viewQuery(MatSort, 5);
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.paginator = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.sort = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.dialogTpl = _t.first);
    }
  }, standalone: false, decls: 101, vars: 12, consts: [["dialogTpl", ""], [1, "ref-page"], [1, "page-header"], [1, "ph-content"], [1, "ph-icon"], ["mat-raised-button", "", 1, "btn-new", 3, "click"], [1, "indemnite-tabs-wrapper"], [1, "filter-card"], ["appearance", "outline", 1, "search-field"], ["matPrefix", ""], ["matInput", "", "placeholder", "Code, libell\xE9, description, montant\u2026", 3, "ngModelChange", "ngModel"], ["matSuffix", "", "mat-icon-button", ""], [1, "table-card"], [1, "table-wrapper"], ["mat-table", "", "matSort", "", 3, "dataSource"], ["matColumnDef", "code"], ["mat-header-cell", "", "mat-sort-header", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "libelle"], ["matColumnDef", "parentRattachement"], ["matColumnDef", "typeRetenue"], ["matColumnDef", "regimeSecuriteSocial"], ["matColumnDef", "baseCalcul"], ["matColumnDef", "typeIndemnite"], ["matColumnDef", "fonction"], ["matColumnDef", "emploi"], ["matColumnDef", "grade"], ["matColumnDef", "gradeConcat"], ["matColumnDef", "categorie"], ["matColumnDef", "categories"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["matColumnDef", "echellon"], ["matColumnDef", "montant"], ["matColumnDef", "taux"], ["matColumnDef", "tauxExoneration"], ["matColumnDef", "plafondExoneration"], ["matColumnDef", "tauxAbattement"], ["matColumnDef", "typeNomination"], ["matColumnDef", "actif"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "table-row", 3, "click", 4, "matRowDef", "matRowDefColumns"], ["class", "mat-row", 4, "matNoDataRow"], ["showFirstLastButtons", "", 3, "pageSizeOptions", "pageSize"], ["type", "button", 1, "indemnite-tab-card", 3, "click"], [1, "itc-icon", "ordinaire"], [1, "itc-content"], [1, "itc-header"], [1, "itc-title"], [1, "itc-badge"], [1, "itc-sub"], [1, "itc-icon", "nomination"], [1, "itc-icon", "specifique"], ["matSuffix", "", "mat-icon-button", "", 3, "click"], ["mat-header-cell", "", "mat-sort-header", ""], ["mat-cell", ""], [1, "code-chip"], [2, "display", "inline-flex", "align-items", "center", "gap", "5px", "background", "#eff6ff", "color", "#1d4ed8", "padding", "4px 10px", "border-radius", "12px", "font-weight", "600", "font-size", "12px", "border", "1px solid #bfdbfe"], [2, "display", "inline-flex", "align-items", "center", "gap", "5px", "background", "#e0f2fe", "color", "#0369a1", "padding", "4px 10px", "border-radius", "12px", "font-weight", "600", "font-size", "12px", "border", "1px solid #bae6fd"], [2, "display", "inline-flex", "align-items", "center", "gap", "4px", "background", "#fef2f2", "color", "#b91c1c", "padding", "3px 8px", "border-radius", "10px", "font-size", "11px", "font-weight", "600", "border", "1px solid #fecaca"], [2, "font-size", "15px", "width", "15px", "height", "15px"], [2, "font-size", "14px", "width", "14px", "height", "14px"], [2, "display", "inline-flex", "align-items", "center", "gap", "5px", "background", "#f3e8ff", "color", "#6b21a8", "padding", "4px 10px", "border-radius", "12px", "font-weight", "600", "font-size", "12px", "border", "1px solid #e9d5ff"], [2, "display", "inline-flex", "align-items", "center", "gap", "4px", "background", "#f0fdf4", "color", "#166534", "padding", "3px 8px", "border-radius", "10px", "font-size", "11px", "font-weight", "600", "border", "1px solid #bbf7d0"], [1, "code-chip", 2, "background", "#eff6ff", "color", "#1d4ed8", "font-weight", "700"], [2, "font-weight", "600", "color", "#1e293b"], [1, "code-chip", 2, "background", "#e8f5e9", "color", "#2e7d32", "font-weight", "700"], [2, "font-weight", "700", "color", "#0060B3", "background", "#e0f2fe", "padding", "4px 10px", "border-radius", "6px", "font-size", "13px", "letter-spacing", "0.5px", "border", "1px solid #bae6fd"], [2, "display", "flex", "flex-wrap", "wrap", "gap", "4px"], [2, "color", "#0f172a"], [2, "background", "#e0f2fe", "color", "#0369a1", "font-weight", "700", "padding", "2px 8px", "border-radius", "4px", "font-size", "11px"], ["mat-header-cell", ""], [2, "color", "#94a3b8", "font-style", "italic", "font-size", "12px"], [2, "font-weight", "600", "color", "#0060B3", "background", "#e0f2fe", "padding", "3px 10px", "border-radius", "6px", "font-size", "13px"], [2, "font-weight", "700", "color", "#0060B3", "font-size", "14px"], [2, "font-weight", "700", "color", "#0060b3", "font-size", "13px"], [2, "background", "#e0f2fe", "color", "#0369a1", "padding", "4px 10px", "border-radius", "12px"], [2, "font-weight", "700", "color", "#2e7d32", "background", "#e8f5e9", "padding", "4px 10px", "border-radius", "12px"], [2, "font-weight", "600", "color", "#333", "background", "#f5f5f5", "padding", "4px 10px", "border-radius", "12px"], [2, "font-weight", "700", "color", "#0060B3", "background", "#e3f2fd", "padding", "4px 10px", "border-radius", "12px"], [2, "font-weight", "700", "padding", "4px 12px", "border-radius", "12px", "font-size", "12px", "display", "inline-flex", "align-items", "center", "gap", "4px"], [1, "statut-badge"], ["type", "button", "mat-icon-button", "", "color", "primary", "matTooltip", "Modifier", 3, "click"], ["mat-icon-button", "", 3, "click", "matTooltip"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Supprimer", 3, "click"], ["mat-header-row", ""], ["mat-row", "", 1, "table-row", 3, "click"], [1, "mat-row"], [1, "no-data"], ["mat-dialog-title", "", 2, "margin", "0", "padding-bottom", "12px", "font-weight", "600", "color", "#0060B3"], [1, "dialog-content", 2, "display", "flex", "flex-direction", "column", "gap", "16px", "padding-top", "8px", "min-width", "420px", 3, "formGroup"], [1, "service-rattachement-block", 2, "background", "#f8fafc", "border", "1px solid #cbd5e1", "border-radius", "8px", "padding", "14px", "margin-top", "8px", "margin-bottom", "14px"], ["align", "end", 2, "padding-top", "12px", "margin-bottom", "0"], ["type", "button", "mat-button", "", "mat-dialog-close", "", 3, "disabled"], ["type", "button", "mat-raised-button", "", "color", "primary", 3, "click", "disabled"], ["appearance", "outline", 2, "width", "100%"], ["formControlName", "gradeId", "placeholder", "S\xE9lectionner un groupe"], [3, "value"], ["formControlName", "categorieId", "placeholder", "S\xE9lectionner la cat\xE9gorie/classe", 3, "selectionChange"], ["formControlName", "echelonId", "placeholder", "S\xE9lectionner l'\xE9chelon"], ["matInput", "", "type", "number", "formControlName", "montant", "placeholder", "Ex: 250000", "min", "0"], ["appearance", "outline", 2, "width", "100%", "margin-top", "5px"], ["matInput", "", "formControlName", "libelle", "placeholder", "Ex: Cotisation Sociale CNSS (Caisse Nationale)"], ["formControlName", "typeRetenueId", "placeholder", "S\xE9lectionner le type"], ["matInput", "", "type", "number", "formControlName", "taux", "placeholder", "Ex: 5.5", "min", "0", "max", "100", "step", "0.1"], ["formControlName", "regimeSecuriteSocialId"], ["formControlName", "baseCalcul"], ["value", "SALAIRE_BASE"], ["value", "SALAIRE_BASE_SUR_SALAIRE"], ["value", "REMUNERATION_BRUTE"], ["value", "BASE_IMPOSABLE"], [1, "regle-type-selector"], [1, "regle-card", 3, "click"], [1, "regle-title"], [1, "regle-desc"], ["formControlName", "typeIndemniteId", "placeholder", "S\xE9lectionner le type d'indemnit\xE9"], [1, "form-row-2"], ["matInput", "", "type", "number", "formControlName", "taux", "placeholder", "0", "min", "0"], ["formControlName", "gradeId", "placeholder", "S\xE9lectionner un groupe", 3, "selectionChange"], ["formControlName", "categorieId", "placeholder", "S\xE9lectionner une cat\xE9gorie"], ["formControlName", "fonctionId", "placeholder", "S\xE9lectionner la fonction de nomination"], ["formControlName", "emploiId", "placeholder", "S\xE9lectionner l'emploi sp\xE9cifique"], ["matInput", "", "formControlName", "libelle", "placeholder", "Ex: Chef d'Agence, Directeur de D\xE9partement..."], ["matInput", "", "formControlName", "code"], ["matInput", "", "formControlName", "libelle"], ["formControlName", "gradeId", "placeholder", "S\xE9lectionner le groupe"], ["matInput", "", "type", "number", "formControlName", "taux", "placeholder", "Ex: 58, 60 ou 63", "min", "45", "max", "75"], ["matInput", "", "formControlName", "libelle", "placeholder", "Ex: D\xE9signation / Intitul\xE9 de l'\xE9l\xE9ment"], ["matInput", "", "formControlName", "code", "placeholder", "Ex : Libell\xE9 court"], ["matInput", "", "type", "number", "formControlName", "tauxExoneration", "placeholder", "Ex: 20", "min", "0", "max", "100"], ["matInput", "", "type", "number", "formControlName", "plafondExoneration", "placeholder", "Ex: 70000", "min", "0"], ["matInput", "", "type", "number", "formControlName", "tauxAbattement", "placeholder", "Ex: 20", "min", "0", "max", "100"], ["formControlName", "directeurId", "placeholder", "S\xE9lectionner le directeur"], ["formControlName", "directionId", "placeholder", "S\xE9lectionner la direction de rattachement"], ["formControlName", "parentDirectionId", "placeholder", "S\xE9lectionner la direction parente"], ["appearance", "outline", 2, "width", "100%", "margin-top", "10px"], ["formControlName", "agenceId", "placeholder", "S\xE9lectionner une agence (optionnel)"], ["matInput", "", "type", "number", "formControlName", "taux", "placeholder", "Ex: 18, 20 ou 4", "min", "0", "max", "100"], [2, "display", "grid", "grid-template-columns", "1fr 1fr", "gap", "12px"], ["formControlName", "echelonId", "placeholder", "S\xE9lectionner un \xE9chelon"], [2, "display", "flex", "align-items", "center", "gap", "8px", "margin-bottom", "8px", "color", "#0f172a", "font-weight", "600", "font-size", "13px"], [2, "color", "#0060B3", "font-size", "18px", "width", "18px", "height", "18px"], [2, "font-size", "12px", "color", "#64748b", "margin-top", "0", "margin-bottom", "12px", "line-height", "1.4"], ["formControlName", "directionId", "placeholder", "S\xE9lectionner la Direction"], [2, "color", "#0060B3", "font-weight", "500"]], template: function DbRefListComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "div", 4)(4, "mat-icon");
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div")(7, "h1");
      \u0275\u0275text(8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p");
      \u0275\u0275text(10);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "button", 5);
      \u0275\u0275listener("click", function DbRefListComponent_Template_button_click_11_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.openAddDialog());
      });
      \u0275\u0275elementStart(12, "mat-icon");
      \u0275\u0275text(13, "add");
      \u0275\u0275elementEnd();
      \u0275\u0275text(14, " Ajouter ");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(15, DbRefListComponent_Conditional_15_Template, 37, 9, "div", 6);
      \u0275\u0275elementStart(16, "mat-card", 7)(17, "mat-card-content")(18, "mat-form-field", 8)(19, "mat-label");
      \u0275\u0275text(20, "Rechercher\u2026");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "mat-icon", 9);
      \u0275\u0275text(22, "search");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "input", 10);
      \u0275\u0275twoWayListener("ngModelChange", function DbRefListComponent_Template_input_ngModelChange_23_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("ngModelChange", function DbRefListComponent_Template_input_ngModelChange_23_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.applyFilter());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(24, DbRefListComponent_Conditional_24_Template, 3, 0, "button", 11);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(25, "mat-card", 12)(26, "mat-card-content")(27, "div", 13)(28, "table", 14);
      \u0275\u0275elementContainerStart(29, 15);
      \u0275\u0275template(30, DbRefListComponent_th_30_Template, 2, 0, "th", 16)(31, DbRefListComponent_td_31_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(32, 18);
      \u0275\u0275template(33, DbRefListComponent_th_33_Template, 2, 0, "th", 16)(34, DbRefListComponent_td_34_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(35, 19);
      \u0275\u0275template(36, DbRefListComponent_th_36_Template, 2, 0, "th", 16)(37, DbRefListComponent_td_37_Template, 4, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(38, 20);
      \u0275\u0275template(39, DbRefListComponent_th_39_Template, 2, 0, "th", 16)(40, DbRefListComponent_td_40_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(41, 21);
      \u0275\u0275template(42, DbRefListComponent_th_42_Template, 2, 0, "th", 16)(43, DbRefListComponent_td_43_Template, 2, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(44, 22);
      \u0275\u0275template(45, DbRefListComponent_th_45_Template, 2, 0, "th", 16)(46, DbRefListComponent_td_46_Template, 2, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(47, 23);
      \u0275\u0275template(48, DbRefListComponent_th_48_Template, 2, 1, "th", 16)(49, DbRefListComponent_td_49_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(50, 24);
      \u0275\u0275template(51, DbRefListComponent_th_51_Template, 2, 0, "th", 16)(52, DbRefListComponent_td_52_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(53, 25);
      \u0275\u0275template(54, DbRefListComponent_th_54_Template, 2, 0, "th", 16)(55, DbRefListComponent_td_55_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(56, 26);
      \u0275\u0275template(57, DbRefListComponent_th_57_Template, 2, 0, "th", 16)(58, DbRefListComponent_td_58_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(59, 27);
      \u0275\u0275template(60, DbRefListComponent_th_60_Template, 2, 0, "th", 16)(61, DbRefListComponent_td_61_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(62, 28);
      \u0275\u0275template(63, DbRefListComponent_th_63_Template, 2, 0, "th", 16)(64, DbRefListComponent_td_64_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(65, 29);
      \u0275\u0275template(66, DbRefListComponent_th_66_Template, 2, 0, "th", 30)(67, DbRefListComponent_td_67_Template, 5, 2, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(68, 31);
      \u0275\u0275template(69, DbRefListComponent_th_69_Template, 2, 0, "th", 16)(70, DbRefListComponent_td_70_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(71, 32);
      \u0275\u0275template(72, DbRefListComponent_th_72_Template, 2, 0, "th", 16)(73, DbRefListComponent_td_73_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(74, 33);
      \u0275\u0275template(75, DbRefListComponent_th_75_Template, 2, 1, "th", 16)(76, DbRefListComponent_td_76_Template, 6, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(77, 34);
      \u0275\u0275template(78, DbRefListComponent_th_78_Template, 2, 0, "th", 16)(79, DbRefListComponent_td_79_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(80, 35);
      \u0275\u0275template(81, DbRefListComponent_th_81_Template, 2, 0, "th", 16)(82, DbRefListComponent_td_82_Template, 4, 4, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(83, 36);
      \u0275\u0275template(84, DbRefListComponent_th_84_Template, 2, 0, "th", 16)(85, DbRefListComponent_td_85_Template, 3, 1, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(86, 37);
      \u0275\u0275template(87, DbRefListComponent_th_87_Template, 2, 0, "th", 16)(88, DbRefListComponent_td_88_Template, 5, 6, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(89, 38);
      \u0275\u0275template(90, DbRefListComponent_th_90_Template, 2, 0, "th", 16)(91, DbRefListComponent_td_91_Template, 5, 6, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementContainerStart(92, 39);
      \u0275\u0275template(93, DbRefListComponent_th_93_Template, 1, 0, "th", 30)(94, DbRefListComponent_td_94_Template, 10, 3, "td", 17);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275template(95, DbRefListComponent_tr_95_Template, 1, 0, "tr", 40)(96, DbRefListComponent_tr_96_Template, 1, 0, "tr", 41)(97, DbRefListComponent_tr_97_Template, 6, 1, "tr", 42);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(98, "mat-paginator", 43);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(99, DbRefListComponent_ng_template_99_Template, 18, 7, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.icon);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.title);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.dataSource.data.length, " entr\xE9e(s) enregistr\xE9e(s)");
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.type === "param-indemnite" ? 15 : -1);
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.searchQuery ? 24 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("dataSource", ctx.dataSource);
      \u0275\u0275advance(67);
      \u0275\u0275property("matHeaderRowDef", ctx.displayedColumns);
      \u0275\u0275advance();
      \u0275\u0275property("matRowDefColumns", ctx.displayedColumns);
      \u0275\u0275advance(2);
      \u0275\u0275property("pageSizeOptions", \u0275\u0275pureFunction0(11, _c1))("pageSize", ctx.type === "grille-salariale" ? 250 : 25);
    }
  }, dependencies: [DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, MaxValidator, NgModel, FormGroupDirective, FormControlName, MatCard, MatCardContent, MatIcon, MatButton, MatIconButton, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatNoDataRow, MatSort, MatSortHeader, MatPaginator, MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, MatInput, MatTooltip, MatDialogClose, MatDialogTitle, MatDialogActions, MatDialogContent, MatSelect, MatOption, DecimalPipe], styles: ['@charset "UTF-8";\n\n\n\n.ref-page[_ngcontent-%COMP%] {\n  padding: 0;\n}\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 18px 24px;\n  color: var(--on-surface);\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  margin: 16px 24px;\n  box-shadow: var(--shadow-card);\n  flex-wrap: wrap;\n  gap: 14px;\n}\n.page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n}\n.page-header[_ngcontent-%COMP%]   .ph-icon[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  background: rgba(2, 132, 199, 0.12);\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(2, 132, 199, 0.25);\n}\n.page-header[_ngcontent-%COMP%]   .ph-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 24px;\n  width: 24px;\n  height: 24px;\n  color: #0284c7;\n}\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 19px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 2px 0 0;\n  font-size: 12px;\n  color: var(--on-surface-3);\n}\n.page-header[_ngcontent-%COMP%]   .btn-new[_ngcontent-%COMP%] {\n  background: #0284c7 !important;\n  color: #ffffff !important;\n  border: none;\n  font-weight: 700;\n  box-shadow: 0 2px 6px rgba(2, 132, 199, 0.3);\n}\n.kpi-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  padding: 16px 24px;\n}\n.kpi-row[_ngcontent-%COMP%]   .kpi-chip[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: var(--surface);\n  border-radius: 10px;\n  padding: 10px 18px;\n  border: 1px solid var(--border);\n  box-shadow: var(--shadow-card);\n  flex: 1;\n}\n.kpi-row[_ngcontent-%COMP%]   .kpi-val[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.kpi-row[_ngcontent-%COMP%]   .kpi-lbl[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--on-surface-3);\n}\n.filter-card[_ngcontent-%COMP%] {\n  margin: 0 24px 16px;\n  border: 1px solid var(--border) !important;\n}\n.search-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 440px;\n}\n.table-card[_ngcontent-%COMP%] {\n  margin: 0 24px 24px;\n  border: 1px solid var(--border) !important;\n}\n.table-wrapper[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  border-radius: 8px;\n  border: 1px solid var(--border);\n}\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n}\n.code-chip[_ngcontent-%COMP%] {\n  background: var(--surface-variant);\n  color: var(--on-surface-2);\n  border: 1px solid var(--border);\n  padding: 2px 8px;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: 600;\n  font-family: monospace;\n}\n.desc-cell[_ngcontent-%COMP%] {\n  color: var(--on-surface-3);\n  font-size: 13px;\n}\n.statut-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 3px 10px;\n  border-radius: 12px;\n  font-size: 12px;\n  font-weight: 500;\n}\n.statut-badge[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n}\n.statut-badge.actif[_ngcontent-%COMP%] {\n  background: rgba(34, 197, 94, 0.1);\n  color: #16a34a;\n  border: 1px solid rgba(34, 197, 94, 0.2);\n}\n.statut-badge.inactif[_ngcontent-%COMP%] {\n  background: var(--surface-variant);\n  color: var(--on-surface-3);\n  border: 1px solid var(--border);\n}\n.table-row[_ngcontent-%COMP%]:hover {\n  background: var(--surface-hover);\n  cursor: pointer;\n}\n.no-data[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n  color: #9e9e9e;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.font-bold[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.text-grey[_ngcontent-%COMP%] {\n  color: #757575;\n}\n.text-small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.matrix-card[_ngcontent-%COMP%] {\n  margin: 0 24px 24px;\n  border-radius: 8px;\n  box-shadow: var(--shadow-card);\n  border: 1px solid var(--border) !important;\n}\n.matrix-wrapper[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  max-width: 100%;\n  border: 1px solid var(--border);\n  border-radius: 6px;\n}\n.bpbf-matrix-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-family: "Inter", sans-serif;\n  font-size: 11px;\n  background-color: var(--surface);\n  color: var(--on-surface);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.bpbf-matrix-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  border: 1px solid var(--border);\n  padding: 6px 8px;\n  text-align: center;\n  white-space: nowrap;\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr.header-main-title[_ngcontent-%COMP%] {\n  background-color: var(--surface-variant);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr.header-main-title[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 12px;\n  color: var(--on-surface);\n  text-transform: uppercase;\n  border-bottom: 2px solid var(--border);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr.header-main-title[_ngcontent-%COMP%]   .main-title[_ngcontent-%COMP%] {\n  text-align: left;\n  padding-left: 12px;\n  background-color: var(--surface-variant);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr.header-main-title[_ngcontent-%COMP%]   .base-col-header[_ngcontent-%COMP%] {\n  background-color: var(--surface-variant) !important;\n  color: var(--on-surface);\n  font-weight: 700;\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr.header-sub-title[_ngcontent-%COMP%] {\n  background-color: var(--surface-variant);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr.header-sub-title[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 11px;\n  text-transform: uppercase;\n  color: var(--on-surface-2);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr.header-sub-title[_ngcontent-%COMP%]   .classification-hdr[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr.header-sub-title[_ngcontent-%COMP%]   .echelons-hdr[_ngcontent-%COMP%] {\n  text-align: center;\n  font-weight: 700;\n  letter-spacing: 1px;\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  background-color: var(--surface);\n  color: var(--on-surface);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background-color: var(--surface-hover);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  position: relative;\n  font-size: 11px;\n  color: var(--on-surface-2);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td.cat-label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  text-align: left;\n  padding-left: 10px;\n  background-color: var(--surface-variant);\n  color: var(--on-surface);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   .cell-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  position: relative;\n  min-height: 20px;\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   .cell-actions[_ngcontent-%COMP%] {\n  display: none;\n  position: absolute;\n  top: 1px;\n  right: 2px;\n  gap: 0;\n  align-items: center;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 6px;\n  box-shadow: var(--shadow-card);\n  z-index: 10;\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   .cell-actions[_ngcontent-%COMP%]   .cell-btn[_ngcontent-%COMP%] {\n  width: 24px !important;\n  height: 24px !important;\n  line-height: 24px !important;\n  padding: 0 !important;\n  min-width: 24px !important;\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   .cell-actions[_ngcontent-%COMP%]   .edit-btn[_ngcontent-%COMP%] {\n  color: var(--on-surface);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   .cell-actions[_ngcontent-%COMP%]   .del-btn[_ngcontent-%COMP%] {\n  color: var(--on-surface-3);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:hover {\n  background-color: var(--surface-hover) !important;\n  color: var(--on-surface);\n  outline: 1px solid var(--border);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:hover   .cell-actions[_ngcontent-%COMP%] {\n  display: flex;\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td.base-cell[_ngcontent-%COMP%] {\n  background-color: var(--surface-variant);\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td.has-value[_ngcontent-%COMP%]   .cell-amount[_ngcontent-%COMP%] {\n  color: var(--on-surface);\n  font-weight: 600;\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   .section-divider[_ngcontent-%COMP%] {\n  background-color: var(--surface-variant);\n}\n.bpbf-matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   .section-divider[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 11px;\n  text-transform: uppercase;\n  letter-spacing: 1.5px;\n  padding: 6px;\n  text-align: center;\n  background-color: var(--surface-variant);\n  color: var(--on-surface);\n}\n.indemnite-tabs-wrapper[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 14px;\n  margin: 0 24px 18px;\n}\n@media (max-width: 900px) {\n  .indemnite-tabs-wrapper[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.indemnite-tab-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 14px 16px;\n  background: var(--surface);\n  border: 1.5px solid var(--border);\n  border-radius: 12px;\n  box-shadow: var(--shadow-card);\n  cursor: pointer;\n  text-align: left;\n  transition: all 0.2s ease-in-out;\n  position: relative;\n  outline: none;\n}\n.indemnite-tab-card[_ngcontent-%COMP%]:hover {\n  border-color: #0284c7;\n  background: var(--surface-hover);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.12);\n}\n.indemnite-tab-card.active[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border-color: #0284c7;\n  box-shadow: 0 4px 16px rgba(2, 132, 199, 0.18);\n}\n.indemnite-tab-card.active[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: -1.5px;\n  left: 20px;\n  right: 20px;\n  height: 3px;\n  background: #0284c7;\n  border-radius: 3px 3px 0 0;\n}\n.indemnite-tab-card.active[_ngcontent-%COMP%]   .itc-title[_ngcontent-%COMP%] {\n  color: #0284c7;\n  font-weight: 700;\n}\n.indemnite-tab-card.active[_ngcontent-%COMP%]   .itc-badge[_ngcontent-%COMP%] {\n  background: #0284c7;\n  color: #ffffff;\n}\n.indemnite-tab-card[_ngcontent-%COMP%]   .itc-icon[_ngcontent-%COMP%] {\n  width: 42px;\n  height: 42px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.indemnite-tab-card[_ngcontent-%COMP%]   .itc-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 24px;\n  width: 24px;\n  height: 24px;\n}\n.indemnite-tab-card[_ngcontent-%COMP%]   .itc-icon.ordinaire[_ngcontent-%COMP%] {\n  background: rgba(37, 99, 235, 0.1);\n  color: #2563eb;\n  border: 1px solid rgba(37, 99, 235, 0.2);\n}\n.indemnite-tab-card[_ngcontent-%COMP%]   .itc-icon.nomination[_ngcontent-%COMP%] {\n  background: rgba(124, 58, 237, 0.1);\n  color: #7c3aed;\n  border: 1px solid rgba(124, 58, 237, 0.2);\n}\n.indemnite-tab-card[_ngcontent-%COMP%]   .itc-icon.specifique[_ngcontent-%COMP%] {\n  background: rgba(13, 148, 136, 0.1);\n  color: #0d9488;\n  border: 1px solid rgba(13, 148, 136, 0.2);\n}\n.indemnite-tab-card[_ngcontent-%COMP%]   .itc-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  overflow: hidden;\n  flex: 1;\n}\n.indemnite-tab-card[_ngcontent-%COMP%]   .itc-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.indemnite-tab-card[_ngcontent-%COMP%]   .itc-title[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  font-weight: 600;\n  color: var(--on-surface);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  transition: color 0.15s ease;\n}\n.indemnite-tab-card[_ngcontent-%COMP%]   .itc-badge[_ngcontent-%COMP%] {\n  background: var(--surface-variant);\n  color: var(--on-surface-2);\n  border: 1px solid var(--border);\n  padding: 2px 8px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 700;\n  transition: all 0.15s ease;\n}\n.indemnite-tab-card[_ngcontent-%COMP%]   .itc-sub[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--on-surface-3);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 1.3;\n}\n.regle-type-selector[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.regle-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  padding: 12px 8px;\n  border-radius: 10px;\n  border: 1.5px solid var(--border);\n  background: var(--surface);\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.regle-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 24px;\n  width: 24px;\n  height: 24px;\n  color: var(--on-surface-3);\n  margin-bottom: 4px;\n  transition: color 0.15s ease;\n}\n.regle-card[_ngcontent-%COMP%]   .regle-title[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.regle-card[_ngcontent-%COMP%]   .regle-desc[_ngcontent-%COMP%] {\n  font-size: 10px;\n  color: var(--on-surface-3);\n  margin-top: 2px;\n}\n.regle-card[_ngcontent-%COMP%]:hover {\n  border-color: #0284c7;\n  background: var(--surface-hover);\n}\n.regle-card.active[_ngcontent-%COMP%] {\n  border-color: #0284c7;\n  background: rgba(2, 132, 199, 0.08);\n}\n.regle-card.active[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #0284c7;\n}\n.regle-card.active[_ngcontent-%COMP%]   .regle-title[_ngcontent-%COMP%] {\n  color: #0284c7;\n}\n.form-row-2[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}\n@media (max-width: 600px) {\n  .form-row-2[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=db-ref-list.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DbRefListComponent, [{
    type: Component,
    args: [{ selector: "app-db-ref-list", standalone: false, template: `<div class="ref-page">\r
\r
  <!-- En-t\xEAte -->\r
  <div class="page-header">\r
    <div class="ph-content">\r
      <div class="ph-icon"><mat-icon>{{ icon }}</mat-icon></div>\r
      <div>\r
        <h1>{{ title }}</h1>\r
        <p>{{ dataSource.data.length }} entr\xE9e(s) enregistr\xE9e(s)</p>\r
      </div>\r
    </div>\r
    <button mat-raised-button class="btn-new" (click)="openAddDialog()">\r
      <mat-icon>add</mat-icon> Ajouter\r
    </button>\r
  </div>\r
\r
  <!-- \u2500\u2500 SOUS-ONGLETS OFFICIELS BPBF (Grille Indemnitaire - Annexe III) \u2500\u2500 -->\r
  @if (type === 'param-indemnite') {\r
    <div class="indemnite-tabs-wrapper">\r
      <button type="button" class="indemnite-tab-card"\r
              [class.active]="indemniteTab === 'ORDINAIRE'"\r
              (click)="setIndemniteTab('ORDINAIRE')">\r
        <div class="itc-icon ordinaire">\r
          <mat-icon>groups</mat-icon>\r
        </div>\r
        <div class="itc-content">\r
          <div class="itc-header">\r
            <span class="itc-title">1. Grille Statutaire</span>\r
            <span class="itc-badge">{{ countIndemniteByTab('ORDINAIRE') }}</span>\r
          </div>\r
          <span class="itc-sub">Logement, Transport, Suj\xE9tion (selon Groupe & Cat\xE9gorie)</span>\r
        </div>\r
      </button>\r
\r
      <button type="button" class="indemnite-tab-card"\r
              [class.active]="indemniteTab === 'NOMINATION'"\r
              (click)="setIndemniteTab('NOMINATION')">\r
        <div class="itc-icon nomination">\r
          <mat-icon>workspace_premium</mat-icon>\r
        </div>\r
        <div class="itc-content">\r
          <div class="itc-header">\r
            <span class="itc-title">2. Indemnit\xE9s de Nomination</span>\r
            <span class="itc-badge">{{ countIndemniteByTab('NOMINATION') }}</span>\r
          </div>\r
          <span class="itc-sub">Directeur, Responsable, Chef de Service, Chef d'Agence</span>\r
        </div>\r
      </button>\r
\r
      <button type="button" class="indemnite-tab-card"\r
              [class.active]="indemniteTab === 'SPECIFIQUE'"\r
              (click)="setIndemniteTab('SPECIFIQUE')">\r
        <div class="itc-icon specifique">\r
          <mat-icon>point_of_sale</mat-icon>\r
        </div>\r
        <div class="itc-content">\r
          <div class="itc-header">\r
            <span class="itc-title">3. Primes Sp\xE9cifiques</span>\r
            <span class="itc-badge">{{ countIndemniteByTab('SPECIFIQUE') }}</span>\r
          </div>\r
          <span class="itc-sub">Caisse, Cash Point, Astreinte (Chauffeur, Assistante...)</span>\r
        </div>\r
      </button>\r
    </div>\r
  }\r
\r
  <!-- Filtre / Recherche -->\r
  <mat-card class="filter-card">\r
    <mat-card-content>\r
      <mat-form-field appearance="outline" class="search-field">\r
        <mat-label>Rechercher\u2026</mat-label>\r
        <mat-icon matPrefix>search</mat-icon>\r
        <input matInput [(ngModel)]="searchQuery" (ngModelChange)="applyFilter()"\r
               placeholder="Code, libell\xE9, description, montant\u2026">\r
        @if (searchQuery) {\r
          <button matSuffix mat-icon-button (click)="searchQuery=''; applyFilter()">\r
            <mat-icon>close</mat-icon>\r
          </button>\r
        }\r
      </mat-form-field>\r
    </mat-card-content>\r
  </mat-card>\r
\r
  <!-- Tableau standard pour les autres r\xE9f\xE9rentiels -->\r
  <mat-card class="table-card">\r
    <mat-card-content>\r
      <div class="table-wrapper">\r
        <table mat-table [dataSource]="dataSource" matSort>\r
\r
          <ng-container matColumnDef="code">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Code</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span class="code-chip">\r
                {{ type === 'categorie' ? getCatCodeDisplay(row.code) : (type === 'echelon' ? getEchelonCodeDisplay(row.code) : row.code) }}\r
              </span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="libelle">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Libell\xE9</th>\r
            <td mat-cell *matCellDef="let row"><strong>{{ row.libelle }}</strong></td>\r
          </ng-container>\r
\r
          <!-- Colonne Rattachement Parent (pour Service, Direction et D\xE9partement) -->\r
          <ng-container matColumnDef="parentRattachement">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Rattachement</th>\r
            <td mat-cell *matCellDef="let row">\r
              @if (type === 'service') {\r
                @if (getParentServiceInfo(row).type === 'DIRECTION') {\r
                  <span style="display: inline-flex; align-items: center; gap: 5px; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 12px; font-weight: 600; font-size: 12px; border: 1px solid #bae6fd;">\r
                    <mat-icon style="font-size: 15px; width: 15px; height: 15px;">domain</mat-icon>\r
                    <span>Dir: {{ getParentServiceInfo(row).label }}</span>\r
                  </span>\r
                } @else {\r
                  <span style="display: inline-flex; align-items: center; gap: 4px; background: #fef2f2; color: #b91c1c; padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; border: 1px solid #fecaca;">\r
                    <mat-icon style="font-size: 14px; width: 14px; height: 14px;">warning</mat-icon>\r
                    Non rattach\xE9\r
                  </span>\r
                }\r
              } @else if (type === 'direction') {\r
                @if (getParentDirectionInfo(row).type === 'PARENT_DIR') {\r
                  <span style="display: inline-flex; align-items: center; gap: 5px; background: #eff6ff; color: #1d4ed8; padding: 4px 10px; border-radius: 12px; font-weight: 600; font-size: 12px; border: 1px solid #bfdbfe;">\r
                    <mat-icon style="font-size: 15px; width: 15px; height: 15px;">account_tree</mat-icon>\r
                    <span>Rattach\xE9e \xE0: {{ getParentDirectionInfo(row).label }}</span>\r
                  </span>\r
                } @else if (getParentDirectionInfo(row).type === 'DEPARTEMENT') {\r
                  <span style="display: inline-flex; align-items: center; gap: 5px; background: #f3e8ff; color: #6b21a8; padding: 4px 10px; border-radius: 12px; font-weight: 600; font-size: 12px; border: 1px solid #e9d5ff;">\r
                    <mat-icon style="font-size: 15px; width: 15px; height: 15px;">account_tree</mat-icon>\r
                    <span>D\xE9p: {{ getParentDirectionInfo(row).label }}</span>\r
                  </span>\r
                } @else if (getParentDirectionInfo(row).type === 'AGENCE') {\r
                  <span style="display: inline-flex; align-items: center; gap: 5px; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 12px; font-weight: 600; font-size: 12px; border: 1px solid #bae6fd;">\r
                    <mat-icon style="font-size: 15px; width: 15px; height: 15px;">store</mat-icon>\r
                    <span>Agence: {{ getParentDirectionInfo(row).label }}</span>\r
                  </span>\r
                } @else {\r
                  <span style="display: inline-flex; align-items: center; gap: 4px; background: #f0fdf4; color: #166534; padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; border: 1px solid #bbf7d0;">\r
                    <mat-icon style="font-size: 14px; width: 14px; height: 14px;">corporate_fare</mat-icon>\r
                    DG (Sommet)\r
                  </span>\r
                }\r
              } @else if (type === 'departement') {\r
                <span style="display: inline-flex; align-items: center; gap: 5px; background: #eff6ff; color: #1d4ed8; padding: 4px 10px; border-radius: 12px; font-weight: 600; font-size: 12px; border: 1px solid #bfdbfe;">\r
                  <mat-icon style="font-size: 15px; width: 15px; height: 15px;">domain</mat-icon>\r
                  <span>{{ getParentDepartmentInfo(row).label }}</span>\r
                </span>\r
              }\r
            </td>\r
          </ng-container>\r
\r
          <!-- Colonne sp\xE9cifique \xE0 Param\xE9trage Retenue -->\r
          <ng-container matColumnDef="typeRetenue">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Type de retenue</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span class="code-chip" style="background: #eff6ff; color: #1d4ed8; font-weight: 700;">\r
                {{ row.typeRetenue || row.typeIndemnite || 'Part Agent' }}\r
              </span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="regimeSecuriteSocial">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>R\xE9gime</th>\r
            <td mat-cell *matCellDef="let row">\r
              {{ row.regimeSecuriteSocialCode || row.regimeSecuriteSocialLibelle || 'Tous les r\xE9gimes' }}\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="baseCalcul">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Base de calcul</th>\r
            <td mat-cell *matCellDef="let row">\r
              {{ row.baseCalcul === 'SALAIRE_BASE' ? 'Salaire de base' : (row.baseCalcul === 'SALAIRE_BASE_SUR_SALAIRE' ? 'Salaire de base + Sur-salaire' : (row.baseCalcul === 'BASE_IMPOSABLE' ? 'Base imposable' : 'R\xE9mun\xE9ration brute')) }}\r
            </td>\r
          </ng-container>\r
\r
          <!-- Colonnes sp\xE9cifiques \xE0 Param\xE9trage Indemnit\xE9 -->\r
          <ng-container matColumnDef="typeIndemnite">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>\r
              {{ indemniteTab === 'SPECIFIQUE' ? 'Type de Prime' : 'Type d\\'indemnit\xE9' }}\r
            </th>\r
            <td mat-cell *matCellDef="let row"><strong>{{ row.typeIndemnite || row.libelle }}</strong></td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="fonction">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Fonction de Nomination</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span style="font-weight: 600; color: #1e293b;">{{ row.fonctionLibelle || row.fonction || '-' }}</span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="emploi">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Emploi / Poste Sp\xE9cifique</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span style="font-weight: 600; color: #1e293b;">{{ row.emploiLibelle || row.emploi || '-' }}</span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="grade">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Groupe</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span class="code-chip" style="background: #e8f5e9; color: #2e7d32; font-weight: 700;">{{ getGradeName(row) }}</span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="gradeConcat">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Grade</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span style="font-weight: 700; color: #0060B3; background: #e0f2fe; padding: 4px 10px; border-radius: 6px; font-size: 13px; letter-spacing: 0.5px; border: 1px solid #bae6fd;">\r
                {{ getGradeConcat(row) }}\r
              </span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="categorie">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Cat\xE9gorie / Classe</th>\r
            <td mat-cell *matCellDef="let row">\r
              @if (row.categories && row.categories.length > 0) {\r
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">\r
                  @for (cat of row.categories; track cat) {\r
                    <span style="background: #e0f2fe; color: #0369a1; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 11px;">\r
                      {{ getCatCodeDisplay(cat) }}\r
                    </span>\r
                  }\r
                </div>\r
              } @else {\r
                <strong style="color: #0f172a;">{{ getCatCodeDisplay(row.categorie || row.code) }}</strong>\r
              }\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="categories">\r
            <th mat-header-cell *matHeaderCellDef>Cat\xE9gories rattach\xE9es</th>\r
            <td mat-cell *matCellDef="let row">\r
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">\r
                @for (cat of (row.categories || []); track cat) {\r
                  <span style="background: #e0f2fe; color: #0369a1; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 11px;">\r
                    {{ getCatCodeDisplay(cat) }}\r
                  </span>\r
                }\r
                @if (!row.categories || row.categories.length === 0) {\r
                  <span style="color: #94a3b8; font-style: italic; font-size: 12px;">Toutes ou ind\xE9finies</span>\r
                }\r
              </div>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="echellon">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>\xC9chelon</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span style="font-weight: 600; color: #0060B3; background: #e0f2fe; padding: 3px 10px; border-radius: 6px; font-size: 13px;">\r
                {{ getEchelonCodeDisplay(row.echellon) }}\r
              </span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="montant">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Salaire de Base</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span style="font-weight: 700; color: #0060B3; font-size: 14px;">\r
                {{ formatMontant(row.montant ?? 0) }}\r
              </span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="taux">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ type === 'param-prise-en-charge' ? 'Valeur / Limite' : (type === 'type-retenue-emploi' ? 'Taux / Pourcentage (%)' : (type === 'param-retraite' ? '\xC2ge de retraite (Ans)' : 'Taux / Montant')) }}</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span style="font-weight: 700; color: #0060b3; font-size: 13px;">\r
                @if (type === 'param-prise-en-charge') {\r
                  <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 12px;">\r
                    {{ row.code === 'PEC-CONJOINT' ? (row.taux === 1 ? '1 charge (+1)' : 'D\xE9sactiv\xE9 (0)') : (row.code === 'PEC-MAX-CHRG' ? row.taux + ' charges max' : row.taux + ' ans max') }}\r
                  </span>\r
                } @else if (type === 'type-retenue-emploi') {\r
                  {{ row.taux && row.taux > 0 ? row.taux + ' %' : (row.description?.includes('Bar\xE8me') ? 'Bar\xE8me Progressif' : (row.description?.includes('Variable') ? 'Montant Variable' : 'Mensualit\xE9 Fixe')) }}\r
                } @else if (type === 'param-retraite') {\r
                  {{ row.taux || 60 }} ans\r
                } @else {\r
                  {{ formatMontant(row.taux ?? row.montant ?? 0) }}\r
                }\r
              </span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="tauxExoneration">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Taux Exon\xE9r\xE9 (%)</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span style="font-weight: 700; color: #2e7d32; background: #e8f5e9; padding: 4px 10px; border-radius: 12px;">\r
                {{ row.tauxExoneration ?? 0 }} %\r
              </span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="plafondExoneration">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Plafond Exon\xE9r\xE9</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span style="font-weight: 600; color: #333; background: #f5f5f5; padding: 4px 10px; border-radius: 12px;">\r
                {{ row.plafondExoneration && row.plafondExoneration > 0 ? (row.plafondExoneration | number:'1.0-0') : 'Sans plafond' }}\r
              </span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="tauxAbattement">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Taux d'abattement IUTS (%)</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span style="font-weight: 700; color: #0060B3; background: #e3f2fd; padding: 4px 10px; border-radius: 12px;">\r
                {{ row.tauxAbattement ?? 20 }} %\r
              </span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="typeNomination">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span [style.background]="row.typeNomination === 'NOMMEE' ? '#fff3e0' : '#e8f5e9'"\r
                    [style.color]="row.typeNomination === 'NOMMEE' ? '#e65100' : '#2e7d32'"\r
                    style="font-weight: 700; padding: 4px 12px; border-radius: 12px; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">\r
                <mat-icon style="font-size:14px;width:14px;height:14px;">{{ row.typeNomination === 'NOMMEE' ? 'workspace_premium' : 'person' }}</mat-icon>\r
                {{ row.typeNomination === 'NOMMEE' ? 'Nomm\xE9e' : 'Pas nomm\xE9e' }}\r
              </span>\r
            </td>\r
          </ng-container>\r
\r
\r
\r
          <ng-container matColumnDef="actif">\r
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>\r
            <td mat-cell *matCellDef="let row">\r
              <span class="statut-badge" [class.actif]="row.actif" [class.inactif]="!row.actif">\r
                <mat-icon>{{ row.actif ? 'check_circle' : 'cancel' }}</mat-icon>\r
                {{ row.actif ? 'Actif' : 'Inactif' }}\r
              </span>\r
            </td>\r
          </ng-container>\r
\r
          <ng-container matColumnDef="actions">\r
            <th mat-header-cell *matHeaderCellDef></th>\r
            <td mat-cell *matCellDef="let row">\r
              <button type="button" mat-icon-button color="primary" matTooltip="Modifier"\r
                      (click)="$event.stopPropagation(); openEditDialog(row)">\r
                <mat-icon>edit</mat-icon>\r
              </button>\r
              <button mat-icon-button matTooltip="{{ row.actif ? 'D\xE9sactiver' : 'Activer' }}" (click)="toggleStatus(row, $event)">\r
                <mat-icon>{{ row.actif ? 'toggle_on' : 'toggle_off' }}</mat-icon>\r
              </button>\r
              <button mat-icon-button color="warn" matTooltip="Supprimer" (click)="deleteItem(row, $event)">\r
                <mat-icon>delete</mat-icon>\r
              </button>\r
            </td>\r
          </ng-container>\r
\r
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>\r
          <tr mat-row *matRowDef="let row; columns: displayedColumns" class="table-row" (click)="openEditDialog(row)"></tr>\r
\r
          <tr class="mat-row" *matNoDataRow>\r
            <td [attr.colspan]="displayedColumns.length" class="no-data">\r
              <mat-icon>search_off</mat-icon>\r
              <span>Aucun enregistrement trouv\xE9</span>\r
            </td>\r
          </tr>\r
        </table>\r
      </div>\r
      <mat-paginator [pageSizeOptions]="[25, 50, 100, 250]" [pageSize]="type === 'grille-salariale' ? 250 : 25" showFirstLastButtons></mat-paginator>\r
    </mat-card-content>\r
  </mat-card>\r
</div>\r
\r
<!-- Template de la bo\xEEte de dialogue d'ajout/modification -->\r
<ng-template #dialogTpl>\r
  <h2 mat-dialog-title style="margin: 0; padding-bottom: 12px; font-weight: 600; color: #0060B3;">\r
    {{ isEditing ? 'Modifier ' + title : 'Ajouter ' + title }}\r
  </h2>\r
  \r
  <mat-dialog-content [formGroup]="formGroup" class="dialog-content" style="display: flex; flex-direction: column; gap: 16px; padding-top: 8px; min-width: 420px;">\r
    \r
    <!-- CHAMPS D\xC9DI\xC9S POUR LA GRILLE SALARIALE -->\r
    @if (type === 'grille-salariale') {\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Groupe</mat-label>\r
        <!-- <mat-icon matPrefix style="color: #0060B3; margin-right: 4px;">military_tech</mat-icon> -->\r
        <mat-select formControlName="gradeId" placeholder="S\xE9lectionner un groupe">\r
          @for (g of grades; track g.code || g.libelle) {\r
            <mat-option [value]="g.id">{{ g.libelle }} \u2014 {{ g.description }}</mat-option>\r
          }\r
        </mat-select>\r
      </mat-form-field>\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Cat\xE9gorie / Classe</mat-label>\r
        <mat-select formControlName="categorieId" (selectionChange)="formGroup.patchValue({ code: $event.value })" placeholder="S\xE9lectionner la cat\xE9gorie/classe">\r
          @for (cat of categories; track cat.id) {\r
            <mat-option [value]="cat.id">\r
              {{ cat.libelle || cat.code }}\r
            </mat-option>\r
          }\r
        </mat-select>\r
      </mat-form-field>\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>\xC9chelon</mat-label>\r
        <mat-select formControlName="echelonId" placeholder="S\xE9lectionner l'\xE9chelon">\r
          @for (ech of echelons; track ech.id) {\r
            <mat-option [value]="ech.id">\r
              {{ ech.libelle || ech.code }}\r
            </mat-option>\r
          }\r
        </mat-select>\r
      </mat-form-field>\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Salaire de base</mat-label>\r
        <!-- <mat-icon matPrefix style="color: #2e7d32; margin-right: 4px;">payments</mat-icon> -->\r
        <input matInput type="number" formControlName="montant" placeholder="Ex: 250000" min="0">\r
      </mat-form-field>\r
    } @else if (type === 'type-retenue-emploi') {\r
      <mat-form-field appearance="outline" style="width: 100%; margin-top: 5px;">\r
        <mat-label>Libell\xE9 de la retenue</mat-label>\r
        <input matInput formControlName="libelle" placeholder="Ex: Cotisation Sociale CNSS (Caisse Nationale)">\r
        @if (formGroup.get('libelle')?.hasError('required')) {\r
          <mat-error>Le libell\xE9 est obligatoire</mat-error>\r
        }\r
      </mat-form-field>\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Type de retenue</mat-label>\r
        <mat-select formControlName="typeRetenueId" placeholder="S\xE9lectionner le type">\r
          @for (tr of typesRetenueList; track tr.id) {\r
            <mat-option [value]="tr.id">{{ tr.libelle || tr.code }}</mat-option>\r
          }\r
        </mat-select>\r
      </mat-form-field>\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Pourcentage / Taux</mat-label>\r
        <!-- <mat-icon matPrefix style="color: #2e7d32; margin-right: 4px;">percent</mat-icon> -->\r
        <input matInput type="number" formControlName="taux" placeholder="Ex: 5.5" min="0" max="100" step="0.1">\r
      </mat-form-field>\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>R\xE9gime de s\xE9curit\xE9 sociale</mat-label>\r
        <mat-select formControlName="regimeSecuriteSocialId">\r
          <mat-option [value]="null">Tous les r\xE9gimes / Non applicable</mat-option>\r
          @for (regime of regimesSecuriteSocialList; track regime.id) {\r
            <mat-option [value]="regime.id">{{ regime.code }} \u2014 {{ regime.libelle }}</mat-option>\r
          }\r
        </mat-select>\r
      </mat-form-field>\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Base de calcul</mat-label>\r
        <mat-select formControlName="baseCalcul">\r
          <mat-option value="SALAIRE_BASE">Salaire de base</mat-option>\r
          <mat-option value="SALAIRE_BASE_SUR_SALAIRE">Salaire de base + Sur-salaire</mat-option>\r
          <mat-option value="REMUNERATION_BRUTE">R\xE9mun\xE9ration brute</mat-option>\r
          <mat-option value="BASE_IMPOSABLE">Base imposable</mat-option>\r
        </mat-select>\r
        @if (formGroup.get('baseCalcul')?.hasError('required')) {\r
          <mat-error>La base de calcul est obligatoire</mat-error>\r
        }\r
      </mat-form-field>\r
    } @else if (type === 'param-indemnite') {\r
      <!-- \u2500\u2500\u2500 CONFIGURATION INDEMNITE (BAR\xC8ME OFFICIEL BPBF) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\r
      \r
      <!-- 1. S\xE9lecteur de Cat\xE9gorie / R\xE8gle -->\r
      <div class="regle-type-selector">\r
        <div class="regle-card" [class.active]="regleType === 'ORDINAIRE'" (click)="onRegleTypeChange('ORDINAIRE')">\r
          <mat-icon>groups</mat-icon>\r
          <span class="regle-title">1. Statutaire</span>\r
          <span class="regle-desc">Groupe & Cat\xE9gorie</span>\r
        </div>\r
        <div class="regle-card" [class.active]="regleType === 'NOMINATION'" (click)="onRegleTypeChange('NOMINATION')">\r
          <mat-icon>workspace_premium</mat-icon>\r
          <span class="regle-title">2. Nomination</span>\r
          <span class="regle-desc">Fonction Manag\xE9riale</span>\r
        </div>\r
        <div class="regle-card" [class.active]="regleType === 'SPECIFIQUE'" (click)="onRegleTypeChange('SPECIFIQUE')">\r
          <mat-icon>point_of_sale</mat-icon>\r
          <span class="regle-title">3. Sp\xE9cifique</span>\r
          <span class="regle-desc">Poste Sp\xE9cifique</span>\r
        </div>\r
      </div>\r
\r
      <!-- 2. Type d'Indemnit\xE9 ou Prime -->\r
      <mat-form-field appearance="outline" style="width: 100%; margin-top: 5px;">\r
        <mat-label>{{ regleType === 'SPECIFIQUE' ? 'Type de prime / indemnit\xE9 *' : 'Type d\\'indemnit\xE9 *' }}</mat-label>\r
        <mat-select formControlName="typeIndemniteId" placeholder="S\xE9lectionner le type d'indemnit\xE9">\r
          @for (t of typesIndemnite; track t.id) {\r
            <mat-option [value]="t.id">{{ t.libelle || t.code }}</mat-option>\r
          }\r
        </mat-select>\r
        @if (formGroup.get('typeIndemniteId')?.hasError('required')) {\r
          <mat-error>Le type d'indemnit\xE9 est obligatoire</mat-error>\r
        }\r
      </mat-form-field>\r
\r
      <!-- 3. CAS ORDINAIRE / STATUTAIRE : Groupe et Cat\xE9gorie -->\r
      @if (regleType === 'ORDINAIRE') {\r
        <div class="form-row-2">\r
          <mat-form-field appearance="outline" style="width: 100%;">\r
            <mat-label>Groupe *</mat-label>\r
            <mat-select formControlName="gradeId" (selectionChange)="onIndemniteGradeChange()" placeholder="S\xE9lectionner un groupe">\r
              @for (g of grades; track g.id) {\r
                <mat-option [value]="g.id">{{ g.libelle || g.code }}</mat-option>\r
              }\r
            </mat-select>\r
            @if (formGroup.get('gradeId')?.hasError('required')) {\r
              <mat-error>Le groupe est obligatoire</mat-error>\r
            }\r
          </mat-form-field>\r
\r
          <mat-form-field appearance="outline" style="width: 100%;">\r
            <mat-label>Cat\xE9gorie / Classe *</mat-label>\r
            <mat-select formControlName="categorieId" placeholder="S\xE9lectionner une cat\xE9gorie">\r
              @for (c of availableIndemniteCategories; track c.id) {\r
                <mat-option [value]="c.id">{{ c.libelle || c.code }}</mat-option>\r
              }\r
            </mat-select>\r
            @if (formGroup.get('categorieId')?.hasError('required')) {\r
              <mat-error>La cat\xE9gorie est obligatoire</mat-error>\r
            }\r
          </mat-form-field>\r
        </div>\r
      }\r
\r
      <!-- 4. CAS NOMINATION : Fonction Manag\xE9riale -->\r
      @if (regleType === 'NOMINATION') {\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Fonction de Nomination (Direction/Service/Agence) *</mat-label>\r
          <mat-select formControlName="fonctionId" placeholder="S\xE9lectionner la fonction de nomination">\r
            @for (f of fonctionsNomination; track f.id || f.code) {\r
              <mat-option [value]="f.id || f.code">{{ f.libelle || f.name || f.code }}</mat-option>\r
            }\r
          </mat-select>\r
          @if (formGroup.get('fonctionId')?.hasError('required')) {\r
            <mat-error>La fonction de nomination est obligatoire</mat-error>\r
          }\r
        </mat-form-field>\r
      }\r
\r
      <!-- 5. CAS SP\xC9CIFIQUE : Emploi / Poste Sp\xE9cifique -->\r
      @if (regleType === 'SPECIFIQUE') {\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Emploi / Poste Sp\xE9cifique (Guichetier / Caissier, Comptable...) *</mat-label>\r
          <mat-select formControlName="emploiId" placeholder="S\xE9lectionner l'emploi sp\xE9cifique">\r
            @for (emp of emplois; track emp.id || emp.code) {\r
              <mat-option [value]="emp.id || emp.code">{{ emp.libelle || emp.name || emp.code }}</mat-option>\r
            }\r
          </mat-select>\r
          @if (formGroup.get('emploiId')?.hasError('required')) {\r
            <mat-error>L'emploi sp\xE9cifique est obligatoire</mat-error>\r
          }\r
        </mat-form-field>\r
      }\r
\r
      <!-- 6. Montant (FCFA) -->\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Montant (FCFA) *</mat-label>\r
        <input matInput type="number" formControlName="taux" placeholder="0" min="0">\r
        @if (formGroup.get('taux')?.hasError('required')) {\r
          <mat-error>Le montant est obligatoire</mat-error>\r
        }\r
      </mat-form-field>\r
\r
    } @else if (type === 'fonction') {\r
      <!-- \u2500\u2500\u2500 FORMULAIRE SP\xC9CIFIQUE POUR LES FONCTIONS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\r
      <!-- S\xE9lecteur du Type de Nomination -->\r
      <!-- <div style="margin-bottom: 4px;">\r
        <label style="font-size: 13px; font-weight: 600; color: var(--on-surface); display: block; margin-bottom: 10px;">\r
          <mat-icon style="vertical-align: middle; font-size: 16px; color: var(--on-surface-2); margin-right: 4px;">badge</mat-icon>\r
          Type de fonction\r
        </label>\r
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">\r
\r
          <label [class.selected-type]="formGroup.get('typeNomination')?.value === 'NON_NOMMEE'"\r
                 (click)="setFonctionType('NON_NOMMEE')"\r
                 style="display: flex; align-items: center; gap: 10px; border: 1.5px solid; border-radius: 10px; padding: 14px; cursor: pointer; transition: all 0.2s;"\r
                 [style.borderColor]="formGroup.get('typeNomination')?.value === 'NON_NOMMEE' ? '#475569' : 'var(--border)'"\r
                 [style.background]="formGroup.get('typeNomination')?.value === 'NON_NOMMEE' ? 'var(--surface-variant)' : 'var(--surface)'">\r
            <mat-icon [style.color]="formGroup.get('typeNomination')?.value === 'NON_NOMMEE' ? 'var(--on-surface)' : 'var(--on-surface-3)'"\r
                      style="font-size: 28px; width: 28px; height: 28px;">person</mat-icon>\r
            <div>\r
              <div style="font-weight: 700; font-size: 13px;" [style.color]="formGroup.get('typeNomination')?.value === 'NON_NOMMEE' ? 'var(--on-surface)' : 'var(--on-surface-2)'">Pas Nomm\xE9e</div>\r
              <div style="font-size: 11px; color: var(--on-surface-3);">Agent, Employ\xE9, Technicien, Cadre...</div>\r
            </div>\r
          </label>\r
\r
          <label [class.selected-type]="formGroup.get('typeNomination')?.value === 'NOMMEE'"\r
                 (click)="setFonctionType('NOMMEE')"\r
                 style="display: flex; align-items: center; gap: 10px; border: 1.5px solid; border-radius: 10px; padding: 14px; cursor: pointer; transition: all 0.2s;"\r
                 [style.borderColor]="formGroup.get('typeNomination')?.value === 'NOMMEE' ? '#475569' : 'var(--border)'"\r
                 [style.background]="formGroup.get('typeNomination')?.value === 'NOMMEE' ? 'var(--surface-variant)' : 'var(--surface)'">\r
            <mat-icon [style.color]="formGroup.get('typeNomination')?.value === 'NOMMEE' ? 'var(--on-surface)' : 'var(--on-surface-3)'"\r
                      style="font-size: 28px; width: 28px; height: 28px;">workspace_premium</mat-icon>\r
            <div>\r
              <div style="font-weight: 700; font-size: 13px;" [style.color]="formGroup.get('typeNomination')?.value === 'NOMMEE' ? 'var(--on-surface)' : 'var(--on-surface-2)'">Nomm\xE9e</div>\r
              <div style="font-size: 11px; color: var(--on-surface-3);">Chef, Directeur, Responsable...</div>\r
            </div>\r
          </label>\r
        </div>\r
      </div> -->\r
\r
      @if (!shouldHideCode) {\r
        <mat-form-field appearance="outline" style="width: 100%; margin-top: 5px;">\r
          <mat-label>Code</mat-label>\r
          <input\r
            matInput\r
            formControlName="code"\r
          >\r
\r
          @if (formGroup.get('code')?.hasError('required')) {\r
            <mat-error>Le code est obligatoire</mat-error>\r
          }\r
\r
          @if (formGroup.get('code')?.hasError('maxlength')) {\r
            <mat-error>Le code ne doit pas d\xE9passer 25 caract\xE8res</mat-error>\r
          }\r
        </mat-form-field>\r
      }\r
\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Libell\xE9 / D\xE9signation</mat-label>\r
        <!-- <mat-icon matPrefix style="color: var(--on-surface-2); margin-right: 4px;">work</mat-icon> -->\r
        <input matInput formControlName="libelle" placeholder="Ex: Chef d'Agence, Directeur de D\xE9partement...">\r
        @if (formGroup.get('libelle')?.hasError('maxlength')) {\r
          <mat-error>Le libell\xE9 ne doit pas d\xE9passer 150 caract\xE8res</mat-error>\r
        }\r
      </mat-form-field>\r
\r
      <!-- @if (formGroup.get('typeNomination')?.value === 'NOMMEE') {\r
        <div style="margin-top: 10px; background: var(--surface-variant); border: 1px solid var(--border); border-radius: 10px; padding: 14px;">\r
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">\r
            <label style="font-weight: 700; font-size: 13px; color: var(--on-surface); display: flex; align-items: center; gap: 6px;">\r
              <mat-icon style="color: var(--on-surface-2); font-size: 20px; width: 20px; height: 20px;">payments</mat-icon>\r
              Indemnit\xE9s de Nomination Rattach\xE9es\r
            </label>\r
            <button type="button" mat-stroked-button (click)="addFonctionIndemniteRow()"\r
                    style="font-size: 12px; height: 32px; border-color: var(--border); color: var(--on-surface); font-weight: 600;">\r
              <mat-icon style="font-size: 16px; width: 16px; height: 16px; margin-right: 4px;">add</mat-icon>\r
              Ajouter une indemnit\xE9\r
            </button>\r
          </div>\r
\r
          @if (fonctionIndemnitesList.length === 0) {\r
            <div style="background: var(--surface); border: 1px dashed var(--border); border-radius: 8px; padding: 12px; text-align: center; color: var(--on-surface-3); font-size: 12px;">\r
              Aucune indemnit\xE9 rattach\xE9e pour le moment.<br>\r
              Cliquez sur <strong>"+ Ajouter une indemnit\xE9"</strong> ci-dessus pour ajouter des montants (ex: Logement, Transport, Fonction...).\r
            </div>\r
          } @else {\r
            <div style="display: flex; flex-direction: column; gap: 10px;">\r
              @for (ind of fonctionIndemnitesList; track $index) {\r
                <div style="display: grid; grid-template-columns: 2fr 1.5fr 40px; gap: 8px; align-items: center; background: var(--surface); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">\r
                  <mat-form-field appearance="outline" style="width: 100%; margin-bottom: -1.25em;">\r
                    <mat-label>Type d'indemnit\xE9</mat-label>\r
                    <mat-select [(ngModel)]="ind.typeIndemnite" [ngModelOptions]="{standalone: true}" placeholder="S\xE9lectionner l'indemnit\xE9">\r
                      @for (t of typesIndemniteList; track t) {\r
                        <mat-option [value]="t">{{ t }}</mat-option>\r
                      }\r
                    </mat-select>\r
                  </mat-form-field>\r
\r
                  <mat-form-field appearance="outline" style="width: 100%; margin-bottom: -1.25em;">\r
                    <mat-label>Montant</mat-label>\r
                    <input matInput type="number" [(ngModel)]="ind.montant" [ngModelOptions]="{standalone: true}" placeholder="0" min="0">\r
                  </mat-form-field>\r
\r
                  <button type="button" mat-icon-button color="warn" (click)="removeFonctionIndemniteRow($index)" title="Supprimer cette indemnit\xE9">\r
                    <mat-icon style="font-size: 20px; width: 20px; height: 20px;">delete</mat-icon>\r
                  </button>\r
                </div>\r
              }\r
            </div>\r
\r
            <div style="margin-top: 12px; padding: 10px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">\r
              <span style="font-weight: 600; font-size: 13px; color: var(--on-surface-2); display: flex; align-items: center; gap: 6px;">\r
                <mat-icon style="font-size: 18px; width: 18px; height: 18px; color: var(--on-surface-2);">calculate</mat-icon>\r
                Total des indemnit\xE9s rattach\xE9es :\r
              </span>\r
              <span style="font-weight: 800; font-size: 15px; color: var(--on-surface);">{{ getTotalFonctionIndemnites() | number:'1.0-0' }}</span>\r
            </div>\r
          }\r
        </div>\r
      } -->\r
\r
      <!-- Bandeau d'information -->\r
      <!-- <div style="background: var(--surface-variant); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; display: flex; align-items: flex-start; gap: 10px; font-size: 12px; color: var(--on-surface-2);">\r
        <mat-icon style="font-size: 18px; width: 18px; height: 18px; margin-top: 2px; color: var(--on-surface-3);">info</mat-icon>\r
        <div>\r
          @if (formGroup.get('typeNomination')?.value === 'NOMMEE') {\r
            <strong>Fonction Nomm\xE9e :</strong> Renseignez ci-dessus les indemnit\xE9s et primes rattach\xE9es \xE0 cette nomination (Logement, Transport, Fonction, Caisse, Astreinte...).\r
          } @else {\r
            <strong>Fonction Pas Nomm\xE9e :</strong> Poste standard sans acte de nomination formel. Les indemnit\xE9s sont calcul\xE9es sur la base de la cat\xE9gorie professionnelle.\r
          }\r
        </div>\r
      </div -->\r
    } @else if (type === 'grade') {\r
\r
      <mat-form-field appearance="outline" style="width: 100%; margin-top: 5px;">\r
        <mat-label>Code</mat-label>\r
        <input\r
          matInput\r
          formControlName="code"\r
        >\r
\r
        @if (formGroup.get('code')?.hasError('required')) {\r
          <mat-error>Le code est obligatoire</mat-error>\r
        }\r
\r
        @if (formGroup.get('code')?.hasError('maxlength')) {\r
          <mat-error>Le code ne doit pas d\xE9passer 25 caract\xE8res</mat-error>\r
        }\r
      </mat-form-field>\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Libelle du Groupe</mat-label>\r
        <!-- <mat-icon matPrefix style="color: #0060B3; margin-right: 4px;">military_tech</mat-icon> -->\r
        <input matInput formControlName="libelle">\r
      </mat-form-field>\r
\r
    } @else if (type === 'param-groupe') {\r
\r
      @if (!shouldHideCode) {\r
        <mat-form-field appearance="outline" style="width: 100%; margin-top: 5px;">\r
          <mat-label>Code</mat-label>\r
          <input\r
            matInput\r
            formControlName="code"\r
          >\r
\r
          @if (formGroup.get('code')?.hasError('required')) {\r
            <mat-error>Le code est obligatoire</mat-error>\r
          }\r
\r
          @if (formGroup.get('code')?.hasError('maxlength')) {\r
            <mat-error>Le code ne doit pas d\xE9passer 25 caract\xE8res</mat-error>\r
          }\r
        </mat-form-field>\r
      }\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Groupe</mat-label>\r
        <mat-select formControlName="gradeId" placeholder="S\xE9lectionner le groupe">\r
          @for (g of grades; track g.id) {\r
            <mat-option [value]="g.id">{{ g.libelle }} \u2014 {{ g.description }}</mat-option>\r
          }\r
        </mat-select>\r
      </mat-form-field>\r
\r
\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Cat\xE9gorie / Classe</mat-label>\r
        <mat-select formControlName="categorieId" placeholder="S\xE9lectionner une cat\xE9gorie">\r
          @for (cat of categories; track cat.id) {\r
            <mat-option [value]="cat.id">{{ cat.libelle || cat.code }}</mat-option>\r
          }\r
        </mat-select>\r
      </mat-form-field>\r
\r
    } @else if (type === 'param-retraite') {\r
\r
      @if (!shouldHideCode) {\r
        <mat-form-field appearance="outline" style="width: 100%; margin-top: 5px;">\r
          <mat-label>Code</mat-label>\r
          <input\r
            matInput\r
            formControlName="code"\r
          >\r
\r
          @if (formGroup.get('code')?.hasError('required')) {\r
            <mat-error>Le code est obligatoire</mat-error>\r
          }\r
\r
          @if (formGroup.get('code')?.hasError('maxlength')) {\r
            <mat-error>Le code ne doit pas d\xE9passer 25 caract\xE8res</mat-error>\r
          }\r
        </mat-form-field>\r
      }\r
\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Groupe</mat-label>\r
          <mat-select formControlName="gradeId" placeholder="S\xE9lectionner un groupe">\r
            @for (g of grades; track g.id) {\r
              <mat-option [value]="g.id">{{ g.libelle }} \u2014 {{ g.description }}</mat-option>\r
            }\r
          </mat-select>\r
        </mat-form-field>\r
\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>\xC2ge de retraite (ans)</mat-label>\r
          <!-- <mat-icon matPrefix style="color: #0060B3; margin-right: 4px;">event</mat-icon> -->\r
          <input matInput type="number" formControlName="taux" placeholder="Ex: 58, 60 ou 63" min="45" max="75">\r
        </mat-form-field>\r
\r
    } @else if (type !== 'grille-salariale' && type !== 'param-retraite' && type !== 'param-groupe' && type !== 'grade') {\r
      \r
       <!-- @if (type === 'regime-securite-social') {\r
          <mat-form-field appearance="outline" style="width: 100%;">\r
            <mat-label>Code</mat-label>\r
            <input\r
              matInput\r
              formControlName="code"\r
              placeholder="Ex : CNSS"\r
            >\r
\r
            @if (formGroup.get('code')?.hasError('required')) {\r
              <mat-error>Le code est obligatoire</mat-error>\r
            }\r
\r
            @if (formGroup.get('code')?.hasError('maxlength')) {\r
              <mat-error>Le code ne doit pas d\xE9passer 25 caract\xE8res</mat-error>\r
            }\r
          </mat-form-field>\r
        } -->\r
\r
      @if (!shouldHideCode) {\r
        <mat-form-field appearance="outline" style="width: 100%; margin-top: 5px;">\r
          <mat-label>Code</mat-label>\r
          <input\r
            matInput\r
            formControlName="code"\r
            placeholder="Ex : Libell\xE9 court"\r
          >\r
\r
          @if (formGroup.get('code')?.hasError('required')) {\r
            <mat-error>Le code est obligatoire</mat-error>\r
          }\r
\r
          @if (formGroup.get('code')?.hasError('maxlength')) {\r
            <mat-error>Le code ne doit pas d\xE9passer 25 caract\xE8res</mat-error>\r
          }\r
        </mat-form-field>\r
      }\r
\r
\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Libell\xE9</mat-label>\r
        <input matInput formControlName="libelle" placeholder="Ex: D\xE9signation / Intitul\xE9 de l'\xE9l\xE9ment">\r
        @if (formGroup.get('libelle')?.hasError('required')) {\r
          <mat-error>Le libell\xE9 est obligatoire</mat-error>\r
        }\r
        @if (formGroup.get('libelle')?.hasError('maxlength')) {\r
          <mat-error>Le libell\xE9 ne doit pas d\xE9passer 150 caract\xE8res</mat-error>\r
        }\r
      </mat-form-field>\r
\r
      <!-- Indication de Rattachement pour Direction et D\xE9partement -->\r
      <!-- @if (type === 'direction' || type === 'departement') {\r
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">\r
          <mat-icon style="color: #0060B3;">domain</mat-icon>\r
          <span style="font-size: 13px; color: #0369a1; font-weight: 600;">\r
            Rattachement direct : Direction G\xE9n\xE9rale (Si\xE8ge G\xE9n\xE9ral)\r
          </span>\r
        </div>\r
      } -->\r
\r
      @if (type === 'type-indemnite') {\r
\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Taux Exon\xE9r\xE9 (%)</mat-label>\r
          <!-- <mat-icon matPrefix style="color: #2e7d32; margin-right: 4px;">percent</mat-icon> -->\r
          <input matInput type="number" formControlName="tauxExoneration" placeholder="Ex: 20" min="0" max="100">\r
        </mat-form-field>\r
\r
\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Plafond Exon\xE9r\xE9</mat-label>\r
          <!-- <mat-icon matPrefix style="color: #0060B3; margin-right: 4px;">shield</mat-icon> -->\r
          <input matInput type="number" formControlName="plafondExoneration" placeholder="Ex: 70000" min="0">\r
        </mat-form-field>\r
      }\r
\r
      @if (type === 'categorie') {\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Taux d'abattement IUTS</mat-label>\r
          <input matInput type="number" formControlName="tauxAbattement" placeholder="Ex: 20" min="0" max="100">\r
        </mat-form-field>\r
      }\r
\r
      @if (type === 'departement') {\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Directeur / Responsable du d\xE9partement</mat-label>\r
          <mat-select formControlName="directeurId" placeholder="S\xE9lectionner le directeur">\r
            <mat-option [value]="null">-- Aucun directeur d\xE9sign\xE9 --</mat-option>\r
            @for (d of directeursList; track d.id) {\r
              <mat-option [value]="d.id">{{ d.libelle }} ({{ d.description }})</mat-option>\r
            }\r
          </mat-select>\r
        </mat-form-field>\r
\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Direction de rattachement</mat-label>\r
          <mat-select formControlName="directionId" placeholder="S\xE9lectionner la direction de rattachement">\r
            <mat-option [value]="null">Direction G\xE9n\xE9rale Adjointe (DGA) [Par d\xE9faut]</mat-option>\r
            @for (dir of directions; track dir.id) {\r
              <mat-option [value]="dir.id">{{ dir.libelle }}</mat-option>\r
            }\r
          </mat-select>\r
          <mat-hint>Ex: Rattach\xE9 \xE0 la Direction G\xE9n\xE9rale Adjointe (DGA)</mat-hint>\r
        </mat-form-field>\r
      }\r
\r
      @if (type === 'direction') {\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Directeur / Responsable de la direction</mat-label>\r
          <mat-select formControlName="directeurId" placeholder="S\xE9lectionner le directeur">\r
            <mat-option [value]="null">-- Aucun directeur d\xE9sign\xE9 --</mat-option>\r
            @for (d of directeursList; track d.id) {\r
              <mat-option [value]="d.id">{{ d.libelle }} ({{ d.description }})</mat-option>\r
            }\r
          </mat-select>\r
        </mat-form-field>\r
\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Direction parente / Rattachement hi\xE9rarchique</mat-label>\r
          <mat-select formControlName="parentDirectionId" placeholder="S\xE9lectionner la direction parente">\r
            <mat-option [value]="null">Aucune (Rattach\xE9e directement au DG)</mat-option>\r
            @for (pDir of availableParentDirections; track pDir.id) {\r
              <mat-option [value]="pDir.id">{{ pDir.libelle }}</mat-option>\r
            }\r
          </mat-select>\r
          <mat-hint>Ex: Directions op\xE9rationnelles \u2192 DGA ; Audit/Risques \u2192 aucune (DG direct)</mat-hint>\r
        </mat-form-field>\r
\r
        <mat-form-field appearance="outline" style="width: 100%; margin-top: 10px;">\r
          <mat-label>Agence associ\xE9e (Optionnel)</mat-label>\r
          <mat-select formControlName="agenceId" placeholder="S\xE9lectionner une agence (optionnel)">\r
            <mat-option [value]="null">Aucune agence (Si\xE8ge / Direction centrale)</mat-option>\r
            @for (agence of agences; track agence.id) {\r
              <mat-option [value]="agence.id">{{ agence.libelle }}</mat-option>\r
            }\r
          </mat-select>\r
        </mat-form-field>\r
      }\r
\r
      @if (type === 'param-prise-en-charge') {\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Valeur / Limite</mat-label>\r
          <!-- <mat-icon matPrefix style="color: #0060B3; margin-right: 4px;">tune</mat-icon> -->\r
          <input matInput type="number" formControlName="taux" placeholder="Ex: 18, 20 ou 4" min="0" max="100">\r
        </mat-form-field>\r
      }\r
    } @else {\r
      <!-- CHAMPS D\xC9DI\xC9S POUR LA GRILLE SALARIALE (ALIGN\xC9S SUR L'ENTIT\xC9 BACKEND) -->\r
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Cat\xE9gorie / Classe *</mat-label>\r
          <mat-select formControlName="categorieId" placeholder="S\xE9lectionner une cat\xE9gorie">\r
            @for (cat of categories; track cat.id ) {\r
              <mat-option [value]="cat.id">{{ cat.code }}</mat-option>\r
            }\r
          </mat-select>\r
        </mat-form-field>\r
\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>\xC9chelon *</mat-label>\r
          <mat-select formControlName="echelonId" placeholder="S\xE9lectionner un \xE9chelon">\r
            @for (ech of echelons; track ech.id ) {\r
              <mat-option [value]="ech.id">{{ ech.code }}</mat-option>\r
            }\r
          </mat-select>\r
        </mat-form-field>\r
      </div>\r
\r
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Groupe d'emploi (Grade)</mat-label>\r
          <mat-select formControlName="gradeId" placeholder="S\xE9lectionner un groupe">\r
            @for (g of grades; track g.id || g.code) {\r
              <mat-option [value]="g.id">{{ g.code }}</mat-option>\r
            }\r
          </mat-select>\r
        </mat-form-field>\r
\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Salaire de base *</mat-label>\r
          <!-- <mat-icon matPrefix style="color: #2e7d32; margin-right: 4px;">payments</mat-icon> -->\r
          <input matInput type="number" formControlName="montant" placeholder="Ex: 250000" min="0">\r
        </mat-form-field>\r
      </div>\r
    }\r
\r
    <!-- Rattachement hi\xE9rarchique du Service : Direction exclusivement -->\r
    @if (type === 'service') {\r
      <div class="service-rattachement-block" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-top: 8px; margin-bottom: 14px;">\r
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #0f172a; font-weight: 600; font-size: 13px;">\r
          <mat-icon style="color: #0060B3; font-size: 18px; width: 18px; height: 18px;">domain</mat-icon>\r
          <span>Direction de Tutelle *</span>\r
        </div>\r
        <p style="font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 12px; line-height: 1.4;">\r
          Conform\xE9ment \xE0 l'organigramme de la BPBF, chaque service est obligatoirement et exclusivement rattach\xE9 \xE0 sa Direction de tutelle.\r
        </p>\r
\r
        <mat-form-field appearance="outline" style="width: 100%;">\r
          <mat-label>Direction de rattachement *</mat-label>\r
          <mat-select formControlName="directionId" placeholder="S\xE9lectionner la Direction">\r
            @for (dir of directions; track dir.id) {\r
              <mat-option [value]="dir.id">{{ dir.libelle }}</mat-option>\r
            }\r
          </mat-select>\r
          @if (formGroup.get('directionId')?.hasError('required')) {\r
            <mat-error>La Direction de rattachement est obligatoire</mat-error>\r
          }\r
          @if (formGroup.get('directionId')?.value) {\r
            <mat-hint style="color: #0060B3; font-weight: 500;">\u2713 Rattach\xE9 \xE0 la direction s\xE9lectionn\xE9e</mat-hint>\r
          }\r
        </mat-form-field>\r
      </div>\r
    }\r
\r
    <!-- Champ Montant \u2014 visible pour la grille salariale -->\r
    <!-- @if (type === 'grille-salariale') {\r
      <mat-form-field appearance="outline" style="width: 100%;">\r
        <mat-label>Salaire de base</mat-label>\r
        <mat-icon matPrefix style="color: #0060B3; margin-right: 4px;">payments</mat-icon>\r
        <input matInput type="number" formControlName="montant"\r
               placeholder="ex. 406395" min="0">\r
        @if (formGroup.get('montant')?.hasError('min')) {\r
          <mat-error>Le montant doit \xEAtre sup\xE9rieur ou \xE9gal \xE0 0</mat-error>\r
        }\r
      </mat-form-field>\r
    } -->\r
  </mat-dialog-content>\r
\r
  <mat-dialog-actions align="end" style="padding-top: 12px; margin-bottom: 0;">\r
    <button type="button" mat-button mat-dialog-close [disabled]="saving">Annuler</button>\r
    <button type="button" mat-raised-button color="primary" (click)="onSubmit()" [disabled]="saving">\r
      {{ saving ? 'Enregistrement...' : 'Enregistrer' }}\r
    </button>\r
  </mat-dialog-actions>\r
</ng-template>\r
`, styles: ['@charset "UTF-8";\n\n/* src/app/features/donnees-base/db-ref-list/db-ref-list.component.scss */\n.ref-page {\n  padding: 0;\n}\n.page-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 18px 24px;\n  color: var(--on-surface);\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  margin: 16px 24px;\n  box-shadow: var(--shadow-card);\n  flex-wrap: wrap;\n  gap: 14px;\n}\n.page-header .ph-content {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n}\n.page-header .ph-icon {\n  width: 44px;\n  height: 44px;\n  background: rgba(2, 132, 199, 0.12);\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(2, 132, 199, 0.25);\n}\n.page-header .ph-icon mat-icon {\n  font-size: 24px;\n  width: 24px;\n  height: 24px;\n  color: #0284c7;\n}\n.page-header h1 {\n  margin: 0;\n  font-size: 19px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.page-header p {\n  margin: 2px 0 0;\n  font-size: 12px;\n  color: var(--on-surface-3);\n}\n.page-header .btn-new {\n  background: #0284c7 !important;\n  color: #ffffff !important;\n  border: none;\n  font-weight: 700;\n  box-shadow: 0 2px 6px rgba(2, 132, 199, 0.3);\n}\n.kpi-row {\n  display: flex;\n  gap: 12px;\n  padding: 16px 24px;\n}\n.kpi-row .kpi-chip {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: var(--surface);\n  border-radius: 10px;\n  padding: 10px 18px;\n  border: 1px solid var(--border);\n  box-shadow: var(--shadow-card);\n  flex: 1;\n}\n.kpi-row .kpi-val {\n  font-size: 18px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.kpi-row .kpi-lbl {\n  font-size: 12px;\n  color: var(--on-surface-3);\n}\n.filter-card {\n  margin: 0 24px 16px;\n  border: 1px solid var(--border) !important;\n}\n.search-field {\n  width: 100%;\n  max-width: 440px;\n}\n.table-card {\n  margin: 0 24px 24px;\n  border: 1px solid var(--border) !important;\n}\n.table-wrapper {\n  overflow-x: auto;\n  border-radius: 8px;\n  border: 1px solid var(--border);\n}\ntable {\n  width: 100%;\n  border-collapse: collapse;\n}\n.code-chip {\n  background: var(--surface-variant);\n  color: var(--on-surface-2);\n  border: 1px solid var(--border);\n  padding: 2px 8px;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: 600;\n  font-family: monospace;\n}\n.desc-cell {\n  color: var(--on-surface-3);\n  font-size: 13px;\n}\n.statut-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 3px 10px;\n  border-radius: 12px;\n  font-size: 12px;\n  font-weight: 500;\n}\n.statut-badge mat-icon {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n}\n.statut-badge.actif {\n  background: rgba(34, 197, 94, 0.1);\n  color: #16a34a;\n  border: 1px solid rgba(34, 197, 94, 0.2);\n}\n.statut-badge.inactif {\n  background: var(--surface-variant);\n  color: var(--on-surface-3);\n  border: 1px solid var(--border);\n}\n.table-row:hover {\n  background: var(--surface-hover);\n  cursor: pointer;\n}\n.no-data {\n  text-align: center;\n  padding: 40px;\n  color: #9e9e9e;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.font-bold {\n  font-weight: 700;\n}\n.text-grey {\n  color: #757575;\n}\n.text-small {\n  font-size: 11px;\n}\n.matrix-card {\n  margin: 0 24px 24px;\n  border-radius: 8px;\n  box-shadow: var(--shadow-card);\n  border: 1px solid var(--border) !important;\n}\n.matrix-wrapper {\n  overflow-x: auto;\n  max-width: 100%;\n  border: 1px solid var(--border);\n  border-radius: 6px;\n}\n.bpbf-matrix-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-family: "Inter", sans-serif;\n  font-size: 11px;\n  background-color: var(--surface);\n  color: var(--on-surface);\n}\n.bpbf-matrix-table th,\n.bpbf-matrix-table td {\n  border: 1px solid var(--border);\n  padding: 6px 8px;\n  text-align: center;\n  white-space: nowrap;\n}\n.bpbf-matrix-table thead tr.header-main-title {\n  background-color: var(--surface-variant);\n}\n.bpbf-matrix-table thead tr.header-main-title th {\n  font-weight: 700;\n  font-size: 12px;\n  color: var(--on-surface);\n  text-transform: uppercase;\n  border-bottom: 2px solid var(--border);\n}\n.bpbf-matrix-table thead tr.header-main-title .main-title {\n  text-align: left;\n  padding-left: 12px;\n  background-color: var(--surface-variant);\n}\n.bpbf-matrix-table thead tr.header-main-title .base-col-header {\n  background-color: var(--surface-variant) !important;\n  color: var(--on-surface);\n  font-weight: 700;\n}\n.bpbf-matrix-table thead tr.header-sub-title {\n  background-color: var(--surface-variant);\n}\n.bpbf-matrix-table thead tr.header-sub-title th {\n  font-weight: 700;\n  font-size: 11px;\n  text-transform: uppercase;\n  color: var(--on-surface-2);\n}\n.bpbf-matrix-table thead tr.header-sub-title .classification-hdr {\n  text-align: center;\n}\n.bpbf-matrix-table thead tr.header-sub-title .echelons-hdr {\n  text-align: center;\n  font-weight: 700;\n  letter-spacing: 1px;\n}\n.bpbf-matrix-table tbody tr {\n  background-color: var(--surface);\n  color: var(--on-surface);\n}\n.bpbf-matrix-table tbody tr:hover {\n  background-color: var(--surface-hover);\n}\n.bpbf-matrix-table tbody td {\n  position: relative;\n  font-size: 11px;\n  color: var(--on-surface-2);\n}\n.bpbf-matrix-table tbody td.cat-label {\n  font-weight: 600;\n  text-align: left;\n  padding-left: 10px;\n  background-color: var(--surface-variant);\n  color: var(--on-surface);\n}\n.bpbf-matrix-table tbody td .cell-content {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  position: relative;\n  min-height: 20px;\n}\n.bpbf-matrix-table tbody td .cell-actions {\n  display: none;\n  position: absolute;\n  top: 1px;\n  right: 2px;\n  gap: 0;\n  align-items: center;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 6px;\n  box-shadow: var(--shadow-card);\n  z-index: 10;\n}\n.bpbf-matrix-table tbody td .cell-actions .cell-btn {\n  width: 24px !important;\n  height: 24px !important;\n  line-height: 24px !important;\n  padding: 0 !important;\n  min-width: 24px !important;\n}\n.bpbf-matrix-table tbody td .cell-actions .edit-btn {\n  color: var(--on-surface);\n}\n.bpbf-matrix-table tbody td .cell-actions .del-btn {\n  color: var(--on-surface-3);\n}\n.bpbf-matrix-table tbody td:hover {\n  background-color: var(--surface-hover) !important;\n  color: var(--on-surface);\n  outline: 1px solid var(--border);\n}\n.bpbf-matrix-table tbody td:hover .cell-actions {\n  display: flex;\n}\n.bpbf-matrix-table tbody td.base-cell {\n  background-color: var(--surface-variant);\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.bpbf-matrix-table tbody td.has-value .cell-amount {\n  color: var(--on-surface);\n  font-weight: 600;\n}\n.bpbf-matrix-table tbody .section-divider {\n  background-color: var(--surface-variant);\n}\n.bpbf-matrix-table tbody .section-divider td {\n  font-weight: 700;\n  font-size: 11px;\n  text-transform: uppercase;\n  letter-spacing: 1.5px;\n  padding: 6px;\n  text-align: center;\n  background-color: var(--surface-variant);\n  color: var(--on-surface);\n}\n.indemnite-tabs-wrapper {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 14px;\n  margin: 0 24px 18px;\n}\n@media (max-width: 900px) {\n  .indemnite-tabs-wrapper {\n    grid-template-columns: 1fr;\n  }\n}\n.indemnite-tab-card {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 14px 16px;\n  background: var(--surface);\n  border: 1.5px solid var(--border);\n  border-radius: 12px;\n  box-shadow: var(--shadow-card);\n  cursor: pointer;\n  text-align: left;\n  transition: all 0.2s ease-in-out;\n  position: relative;\n  outline: none;\n}\n.indemnite-tab-card:hover {\n  border-color: #0284c7;\n  background: var(--surface-hover);\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.12);\n}\n.indemnite-tab-card.active {\n  background: var(--surface);\n  border-color: #0284c7;\n  box-shadow: 0 4px 16px rgba(2, 132, 199, 0.18);\n}\n.indemnite-tab-card.active::after {\n  content: "";\n  position: absolute;\n  bottom: -1.5px;\n  left: 20px;\n  right: 20px;\n  height: 3px;\n  background: #0284c7;\n  border-radius: 3px 3px 0 0;\n}\n.indemnite-tab-card.active .itc-title {\n  color: #0284c7;\n  font-weight: 700;\n}\n.indemnite-tab-card.active .itc-badge {\n  background: #0284c7;\n  color: #ffffff;\n}\n.indemnite-tab-card .itc-icon {\n  width: 42px;\n  height: 42px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.indemnite-tab-card .itc-icon mat-icon {\n  font-size: 24px;\n  width: 24px;\n  height: 24px;\n}\n.indemnite-tab-card .itc-icon.ordinaire {\n  background: rgba(37, 99, 235, 0.1);\n  color: #2563eb;\n  border: 1px solid rgba(37, 99, 235, 0.2);\n}\n.indemnite-tab-card .itc-icon.nomination {\n  background: rgba(124, 58, 237, 0.1);\n  color: #7c3aed;\n  border: 1px solid rgba(124, 58, 237, 0.2);\n}\n.indemnite-tab-card .itc-icon.specifique {\n  background: rgba(13, 148, 136, 0.1);\n  color: #0d9488;\n  border: 1px solid rgba(13, 148, 136, 0.2);\n}\n.indemnite-tab-card .itc-content {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  overflow: hidden;\n  flex: 1;\n}\n.indemnite-tab-card .itc-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.indemnite-tab-card .itc-title {\n  font-size: 13.5px;\n  font-weight: 600;\n  color: var(--on-surface);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  transition: color 0.15s ease;\n}\n.indemnite-tab-card .itc-badge {\n  background: var(--surface-variant);\n  color: var(--on-surface-2);\n  border: 1px solid var(--border);\n  padding: 2px 8px;\n  border-radius: 12px;\n  font-size: 11px;\n  font-weight: 700;\n  transition: all 0.15s ease;\n}\n.indemnite-tab-card .itc-sub {\n  font-size: 11px;\n  color: var(--on-surface-3);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 1.3;\n}\n.regle-type-selector {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.regle-card {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  padding: 12px 8px;\n  border-radius: 10px;\n  border: 1.5px solid var(--border);\n  background: var(--surface);\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.regle-card mat-icon {\n  font-size: 24px;\n  width: 24px;\n  height: 24px;\n  color: var(--on-surface-3);\n  margin-bottom: 4px;\n  transition: color 0.15s ease;\n}\n.regle-card .regle-title {\n  font-size: 12px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.regle-card .regle-desc {\n  font-size: 10px;\n  color: var(--on-surface-3);\n  margin-top: 2px;\n}\n.regle-card:hover {\n  border-color: #0284c7;\n  background: var(--surface-hover);\n}\n.regle-card.active {\n  border-color: #0284c7;\n  background: rgba(2, 132, 199, 0.08);\n}\n.regle-card.active mat-icon {\n  color: #0284c7;\n}\n.regle-card.active .regle-title {\n  color: #0284c7;\n}\n.form-row-2 {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}\n@media (max-width: 600px) {\n  .form-row-2 {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=db-ref-list.component.css.map */\n'] }]
  }], () => [{ type: ActivatedRoute }, { type: ModuleNavService }, { type: DbRefService }, { type: EmployeeService }, { type: MatDialog }, { type: FormBuilder }], { paginator: [{
    type: ViewChild,
    args: [MatPaginator]
  }], sort: [{
    type: ViewChild,
    args: [MatSort]
  }], dialogTpl: [{
    type: ViewChild,
    args: ["dialogTpl"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DbRefListComponent, { className: "DbRefListComponent", filePath: "src/app/features/donnees-base/db-ref-list/db-ref-list.component.ts", lineNumber: 20 });
})();

// src/app/features/donnees-base/donnees-base-routing.module.ts
var routes = [
  { path: "", component: DbOverviewComponent },
  // ─── Gestion administrative ───────────────────────────────────────────────
  { path: "admin/emploi", component: DbRefListComponent, data: { title: "Emploi", icon: "work", type: "emploi" } },
  { path: "admin/fonction", component: DbRefListComponent, data: { title: "Fonction", icon: "badge", type: "fonction" } },
  { path: "admin/departement", component: DbRefListComponent, data: { title: "D\xE9partement", icon: "domain", type: "departement" } },
  { path: "admin/direction", component: DbRefListComponent, data: { title: "Direction", icon: "business", type: "direction" } },
  { path: "admin/service", component: DbRefListComponent, data: { title: "Service", icon: "group_work", type: "service" } },
  { path: "admin/grille-salariale", component: DbRefListComponent, data: { title: "Grille salariale", icon: "table_chart", type: "grille-salariale" } },
  { path: "admin/agence", component: DbRefListComponent, data: { title: "Agence", icon: "store", type: "agence" } },
  { path: "admin/banque", component: DbRefListComponent, data: { title: "Banque", icon: "money_on", type: "banque" } },
  { path: "admin/type-indemnite", component: DbRefListComponent, data: { title: "Liste des indemnit\xE9s", icon: "paid", type: "type-indemnite" } },
  { path: "admin/param-indemnite", component: DbRefListComponent, data: { title: "Grille indemnitaire", icon: "settings_suggest", type: "param-indemnite" } },
  { path: "admin/type-contrat", component: DbRefListComponent, data: { title: "Type contrat", icon: "article", type: "type-contrat" } },
  { path: "admin/type-conge", component: DbRefListComponent, data: { title: "Type cong\xE9 / absence", icon: "beach_access", type: "type-conge" } },
  { path: "admin/type-retenue-employe", component: DbRefListComponent, data: { title: "Types de retenues", icon: "money_off", type: "type-retenue-employe" } },
  { path: "admin/type-retenue-emploi", component: DbRefListComponent, data: { title: "Retenues", icon: "tune", type: "type-retenue-emploi" } },
  { path: "admin/profil", component: DbRefListComponent, data: { title: "Profil de poste / R\xF4le", icon: "admin_panel_settings", type: "profil" } },
  { path: "admin/ville", component: DbRefListComponent, data: { title: "Villes (Burkina Faso)", icon: "location_city", type: "ville" } },
  { path: "admin/param-retraite", component: DbRefListComponent, data: { title: "Param\xE9trage retraite", icon: "event_repeat", type: "param-retraite" } },
  { path: "admin/param-prise-en-charge", component: DbRefListComponent, data: { title: "Prise en charge famille", icon: "family_restroom", type: "param-prise-en-charge" } },
  { path: "admin/regimes-securite-sociale", component: DbRefListComponent, data: { title: "R\xE9gimes de s\xE9curit\xE9 sociale", icon: "health_and_safety", type: "regime-securite-social" } },
  // ─── Gestion de carrière et compétence ────────────────────────────────────
  { path: "carriere/categorie", component: DbRefListComponent, data: { title: "Cat\xE9gorie professionnelle", icon: "category", type: "categorie" } },
  { path: "carriere/grade", component: DbRefListComponent, data: { title: "Groupe", icon: "military_tech", type: "grade" } },
  { path: "carriere/param-groupe", component: DbRefListComponent, data: { title: "Param\xE9trage Groupe", icon: "tune", type: "param-groupe" } },
  { path: "carriere/echelon", component: DbRefListComponent, data: { title: "\xC9chelon / Niveau", icon: "signal_cellular_alt", type: "echelon" } },
  { path: "carriere/competences", component: DbRefListComponent, data: { title: "R\xE9f\xE9rentiel comp\xE9tences", icon: "psychology", type: "competences" } },
  { path: "carriere/type-formation", component: DbRefListComponent, data: { title: "Type de formation", icon: "school", type: "type-formation" } },
  { path: "carriere/type-evaluation", component: DbRefListComponent, data: { title: "Type d'\xE9valuation", icon: "star_rate", type: "type-evaluation" } },
  // ─── Gestion paie ─────────────────────────────────────────────────────────
  { path: "paie/rubrique", component: DbRefListComponent, data: { title: "Rubrique de paie", icon: "receipt_long", type: "rubrique" } },
  { path: "paie/bareme", component: DbRefListComponent, data: { title: "Bar\xE8me fiscal", icon: "calculate", type: "bareme" } },
  { path: "paie/mode-paiement", component: DbRefListComponent, data: { title: "Mode de paiement", icon: "payments", type: "mode-paiement" } },
  // ─── Alias direct (sans préfixe) ────────────────────────────────────
  { path: "grille-salariale", redirectTo: "admin/grille-salariale", pathMatch: "full" },
  { path: "type-indemnite", redirectTo: "admin/type-indemnite", pathMatch: "full" },
  { path: "param-indemnite", redirectTo: "admin/param-indemnite", pathMatch: "full" },
  { path: "emploi", redirectTo: "admin/emploi", pathMatch: "full" },
  { path: "fonction", redirectTo: "admin/fonction", pathMatch: "full" },
  { path: "agence", redirectTo: "admin/agence", pathMatch: "full" },
  { path: "banque", redirectTo: "admin/banque", pathMatch: "full" },
  { path: "departement", redirectTo: "admin/departement", pathMatch: "full" },
  { path: "direction", redirectTo: "admin/direction", pathMatch: "full" },
  { path: "service", redirectTo: "admin/service", pathMatch: "full" },
  { path: "**", redirectTo: "" }
];
var DonneesBaseRoutingModule = class _DonneesBaseRoutingModule {
  static \u0275fac = function DonneesBaseRoutingModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DonneesBaseRoutingModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _DonneesBaseRoutingModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DonneesBaseRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    }]
  }], null, null);
})();

// src/app/features/donnees-base/donnees-base.module.ts
var DonneesBaseModule = class _DonneesBaseModule {
  static \u0275fac = function DonneesBaseModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DonneesBaseModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _DonneesBaseModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DonneesBaseRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DonneesBaseModule, [{
    type: NgModule,
    args: [{
      declarations: [
        DbOverviewComponent,
        DbRefListComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DonneesBaseRoutingModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatDialogModule,
        MatSelectModule
      ]
    }]
  }], null, null);
})();
export {
  DonneesBaseModule
};
//# sourceMappingURL=chunk-3J6TOL5W.js.map
