import {
  UtilisateurService
} from "./chunk-V7BVR6FD.js";
import {
  MatTableModule
} from "./chunk-5RLSCRL2.js";
import {
  MatCheckbox,
  MatCheckboxModule
} from "./chunk-CKOOLDOC.js";
import {
  AuthService
} from "./chunk-ONRSPQJH.js";
import {
  DashboardStatsService
} from "./chunk-KAOKD54J.js";
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
  MatPrefix,
  MatSuffix
} from "./chunk-ERAYOYWZ.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  ReactiveFormsModule,
  environment
} from "./chunk-FA5ALSQZ.js";
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
  CommonModule,
  Component,
  HttpClient,
  Injectable,
  NgModule,
  Router,
  RouterModule,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
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
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-YWFD3R2X.js";

// src/app/features/profils/profils-overview/profils-overview.component.ts
var _forTrack0 = ($index, $item) => $item.title;
function ProfilsOverviewComponent_For_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 16);
    \u0275\u0275listener("click", function ProfilsOverviewComponent_For_56_Template_mat_card_click_0_listener() {
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
var ProfilsOverviewComponent = class _ProfilsOverviewComponent {
  router;
  statsService;
  stats = null;
  isLoading = true;
  hasError = false;
  sections = [
    {
      title: "Profils & R\xF4les",
      icon: "badge",
      color: "#0060B3",
      route: "/profils/roles",
      description: "D\xE9finition et param\xE9trage des profils utilisateurs (ADMIN, DRH, Gestionnaire Paie, Validateur, Consultant).",
      badge: "Profils configur\xE9s"
    },
    {
      title: "Matrice des Habilitations",
      icon: "rule",
      color: "#0060B3",
      route: "/profils/habilitations",
      description: "Gestion fine des acc\xE8s aux menus et des actions autoris\xE9es (Consulter, Cr\xE9er, Modifier, Supprimer, Valider Paie, Cl\xF4turer).",
      badge: "Droits g\xE9r\xE9s"
    },
    {
      title: "Gestion des Utilisateurs",
      icon: "manage_accounts",
      color: "#0060B3",
      route: "/profils/utilisateurs",
      description: "Cr\xE9ation des comptes utilisateurs, r\xE9initialisation de mot de passe, affectation des r\xF4les et contr\xF4le des statuts.",
      badge: "Comptes actifs"
    },
    {
      title: "Manuel d'Utilisation & Guides",
      icon: "auto_stories",
      color: "#0060B3",
      route: "/profils/manuel",
      description: "Documentation compl\xE8te, guides pas \xE0 pas par module, diagrammes de proc\xE9dures et fiches t\xE9l\xE9chargeables.",
      badge: "Guides complets"
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
    this.statsService.getProfilsStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.isLoading = false;
        this.sections[0].badge = `${res.rolesCount} profils configur\xE9s`;
        this.sections[1].badge = `${res.permissionsCount} droits g\xE9r\xE9s`;
        this.sections[2].badge = `${res.activeUsers} comptes actifs`;
        this.sections[3].badge = `${res.manualsCount} guides complets`;
      },
      error: (err) => {
        console.error("Erreur chargement statistiques Profils:", err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
  navigateTo(route) {
    this.router.navigate([route]);
  }
  static \u0275fac = function ProfilsOverviewComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfilsOverviewComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(DashboardStatsService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfilsOverviewComponent, selectors: [["app-profils-overview"]], standalone: false, decls: 57, vars: 4, consts: [[1, "profils-overview-page"], [1, "header-banner"], [1, "header-content"], [1, "header-icon"], [1, "stats-grid"], [1, "stat-card"], [1, "stat-icon", 2, "background", "#e3f2fd", "color", "#0288d1"], [1, "stat-info"], [1, "stat-value"], [1, "stat-label"], [1, "stat-icon", 2, "background", "#e8f5e9", "color", "#2e7d32"], [1, "stat-icon", 2, "background", "#fff3e0", "color", "#f57c00"], [1, "stat-icon", 2, "background", "#f3e5f5", "color", "#7b1fa2"], [1, "section-title"], [1, "sections-grid"], ["matRipple", "", 1, "section-card"], ["matRipple", "", 1, "section-card", 3, "click"], [1, "card-header-icon"], [1, "badge-chip"], ["align", "end"], ["mat-button", "", "color", "primary"]], template: function ProfilsOverviewComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "mat-icon");
      \u0275\u0275text(5, "admin_panel_settings");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div")(7, "h1");
      \u0275\u0275text(8, "Gestion des Profils, Habilitations & Documentation");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p");
      \u0275\u0275text(10, "Administration centralis\xE9e des acc\xE8s, r\xF4les utilisateurs, matrice des permissions et manuel d'utilisation de l'application SIRH.");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(11, "div", 4)(12, "mat-card", 5)(13, "mat-card-content")(14, "div", 6)(15, "mat-icon");
      \u0275\u0275text(16, "badge");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 7)(18, "span", 8);
      \u0275\u0275text(19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "span", 9);
      \u0275\u0275text(21, "Profils & R\xF4les");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(22, "mat-card", 5)(23, "mat-card-content")(24, "div", 10)(25, "mat-icon");
      \u0275\u0275text(26, "people");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "div", 7)(28, "span", 8);
      \u0275\u0275text(29);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "span", 9);
      \u0275\u0275text(31, "Utilisateurs Actifs");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(32, "mat-card", 5)(33, "mat-card-content")(34, "div", 11)(35, "mat-icon");
      \u0275\u0275text(36, "rule");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(37, "div", 7)(38, "span", 8);
      \u0275\u0275text(39);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "span", 9);
      \u0275\u0275text(41, "Droits d'Actions G\xE9r\xE9s");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(42, "mat-card", 5)(43, "mat-card-content")(44, "div", 12)(45, "mat-icon");
      \u0275\u0275text(46, "menu_book");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(47, "div", 7)(48, "span", 8);
      \u0275\u0275text(49);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "span", 9);
      \u0275\u0275text(51, "Guides & Manuel");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(52, "h2", 13);
      \u0275\u0275text(53, "Espaces d'Administration");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "div", 14);
      \u0275\u0275repeaterCreate(55, ProfilsOverviewComponent_For_56_Template, 17, 6, "mat-card", 15, _forTrack0);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(19);
      \u0275\u0275textInterpolate(ctx.isLoading ? "..." : (ctx.stats == null ? null : ctx.stats.rolesCount) ?? 0);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.isLoading ? "..." : ((ctx.stats == null ? null : ctx.stats.activeUsers) ?? 0) + " / " + ((ctx.stats == null ? null : ctx.stats.usersCount) ?? 0));
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.isLoading ? "..." : (ctx.stats == null ? null : ctx.stats.permissionsCount) ?? 0);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.isLoading ? "..." : (ctx.stats == null ? null : ctx.stats.manualsCount) ?? 0);
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.sections);
    }
  }, dependencies: [MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle, MatIcon, MatButton, MatRipple], styles: ["\n\n.profils-overview-page[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 24px 28px;\n  color: var(--on-surface);\n  margin-bottom: 24px;\n  box-shadow: var(--shadow-card);\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .header-icon[_ngcontent-%COMP%] {\n  background: rgba(0, 96, 179, 0.12);\n  color: #0060B3;\n  padding: 14px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .header-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 36px;\n  width: 36px;\n  height: 36px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0 0 6px 0;\n  font-size: 24px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--on-surface-3);\n  font-size: 14px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n  margin-bottom: 32px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border-radius: 12px;\n  border: 1px solid var(--border);\n  box-shadow: var(--shadow-card);\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 20px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 26px;\n  width: 26px;\n  height: 26px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  font-size: 22px;\n  font-weight: 800;\n  color: var(--on-surface);\n}\n.profils-overview-page[_ngcontent-%COMP%]   .stats-grid[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--on-surface-3);\n  font-weight: 500;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 700;\n  color: var(--on-surface);\n  margin: 0 0 16px 0;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border-radius: 12px;\n  border: 1px solid var(--border);\n  box-shadow: var(--shadow-card);\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);\n  border-color: #cbd5e1;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 20px 20px 10px 20px;\n  position: relative;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   .card-header-icon[_ngcontent-%COMP%] {\n  width: 42px;\n  height: 42px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   .card-header-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 22px;\n  width: 22px;\n  height: 22px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--on-surface);\n  margin: 0;\n  flex: 1;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-header[_ngcontent-%COMP%]   .badge-chip[_ngcontent-%COMP%] {\n  background: var(--surface-variant);\n  color: var(--on-surface-2);\n  font-size: 12px;\n  font-weight: 600;\n  padding: 4px 10px;\n  border-radius: 20px;\n  white-space: nowrap;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  padding: 0 20px 10px 20px !important;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--on-surface-3);\n  font-size: 13.5px;\n  line-height: 1.5;\n  margin: 0;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%] {\n  padding: 10px 20px 16px 20px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 13px;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  margin-left: 4px;\n  transition: transform 0.2s ease;\n}\n.profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%]   .section-card[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover   mat-icon[_ngcontent-%COMP%] {\n  transform: translateX(4px);\n}\n@media (max-width: 768px) {\n  .profils-overview-page[_ngcontent-%COMP%] {\n    padding: 12px;\n  }\n  .profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n  .profils-overview-page[_ngcontent-%COMP%]   .header-banner[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 12px;\n  }\n  .profils-overview-page[_ngcontent-%COMP%]   .sections-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=profils-overview.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfilsOverviewComponent, [{
    type: Component,
    args: [{ selector: "app-profils-overview", standalone: false, template: `<div class="profils-overview-page">\r
  <!-- En-t\xEAte -->\r
  <div class="header-banner">\r
    <div class="header-content">\r
      <div class="header-icon">\r
        <mat-icon>admin_panel_settings</mat-icon>\r
      </div>\r
      <div>\r
        <h1>Gestion des Profils, Habilitations & Documentation</h1>\r
        <p>Administration centralis\xE9e des acc\xE8s, r\xF4les utilisateurs, matrice des permissions et manuel d'utilisation de l'application SIRH.</p>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Statistiques rapides -->\r
  <div class="stats-grid">\r
    <mat-card class="stat-card">\r
      <mat-card-content>\r
        <div class="stat-icon" style="background: #e3f2fd; color: #0288d1;">\r
          <mat-icon>badge</mat-icon>\r
        </div>\r
        <div class="stat-info">\r
          <span class="stat-value">{{ isLoading ? '...' : (stats?.rolesCount ?? 0) }}</span>\r
          <span class="stat-label">Profils & R\xF4les</span>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
\r
    <mat-card class="stat-card">\r
      <mat-card-content>\r
        <div class="stat-icon" style="background: #e8f5e9; color: #2e7d32;">\r
          <mat-icon>people</mat-icon>\r
        </div>\r
        <div class="stat-info">\r
          <span class="stat-value">{{ isLoading ? '...' : ((stats?.activeUsers ?? 0) + ' / ' + (stats?.usersCount ?? 0)) }}</span>\r
          <span class="stat-label">Utilisateurs Actifs</span>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
\r
    <mat-card class="stat-card">\r
      <mat-card-content>\r
        <div class="stat-icon" style="background: #fff3e0; color: #f57c00;">\r
          <mat-icon>rule</mat-icon>\r
        </div>\r
        <div class="stat-info">\r
          <span class="stat-value">{{ isLoading ? '...' : (stats?.permissionsCount ?? 0) }}</span>\r
          <span class="stat-label">Droits d'Actions G\xE9r\xE9s</span>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
\r
    <mat-card class="stat-card">\r
      <mat-card-content>\r
        <div class="stat-icon" style="background: #f3e5f5; color: #7b1fa2;">\r
          <mat-icon>menu_book</mat-icon>\r
        </div>\r
        <div class="stat-info">\r
          <span class="stat-value">{{ isLoading ? '...' : (stats?.manualsCount ?? 0) }}</span>\r
          <span class="stat-label">Guides & Manuel</span>\r
        </div>\r
      </mat-card-content>\r
    </mat-card>\r
  </div>\r
\r
  <!-- Sections principales -->\r
  <h2 class="section-title">Espaces d'Administration</h2>\r
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
`, styles: ["/* src/app/features/profils/profils-overview/profils-overview.component.scss */\n.profils-overview-page {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.profils-overview-page .header-banner {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 24px 28px;\n  color: var(--on-surface);\n  margin-bottom: 24px;\n  box-shadow: var(--shadow-card);\n}\n.profils-overview-page .header-banner .header-content {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n}\n.profils-overview-page .header-banner .header-content .header-icon {\n  background: rgba(0, 96, 179, 0.12);\n  color: #0060B3;\n  padding: 14px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n}\n.profils-overview-page .header-banner .header-content .header-icon mat-icon {\n  font-size: 36px;\n  width: 36px;\n  height: 36px;\n}\n.profils-overview-page .header-banner .header-content h1 {\n  margin: 0 0 6px 0;\n  font-size: 24px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.profils-overview-page .header-banner .header-content p {\n  margin: 0;\n  color: var(--on-surface-3);\n  font-size: 14px;\n}\n.profils-overview-page .stats-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n  margin-bottom: 32px;\n}\n.profils-overview-page .stats-grid .stat-card {\n  background: var(--surface);\n  border-radius: 12px;\n  border: 1px solid var(--border);\n  box-shadow: var(--shadow-card);\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 20px;\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content .stat-icon {\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content .stat-icon mat-icon {\n  font-size: 26px;\n  width: 26px;\n  height: 26px;\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content .stat-info {\n  display: flex;\n  flex-direction: column;\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content .stat-info .stat-value {\n  font-size: 22px;\n  font-weight: 800;\n  color: var(--on-surface);\n}\n.profils-overview-page .stats-grid .stat-card mat-card-content .stat-info .stat-label {\n  font-size: 13px;\n  color: var(--on-surface-3);\n  font-weight: 500;\n}\n.profils-overview-page .section-title {\n  font-size: 18px;\n  font-weight: 700;\n  color: var(--on-surface);\n  margin: 0 0 16px 0;\n}\n.profils-overview-page .sections-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}\n.profils-overview-page .sections-grid .section-card {\n  background: var(--surface);\n  border-radius: 12px;\n  border: 1px solid var(--border);\n  box-shadow: var(--shadow-card);\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.profils-overview-page .sections-grid .section-card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);\n  border-color: #cbd5e1;\n}\n.profils-overview-page .sections-grid .section-card mat-card-header {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 20px 20px 10px 20px;\n  position: relative;\n}\n.profils-overview-page .sections-grid .section-card mat-card-header .card-header-icon {\n  width: 42px;\n  height: 42px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n}\n.profils-overview-page .sections-grid .section-card mat-card-header .card-header-icon mat-icon {\n  font-size: 22px;\n  width: 22px;\n  height: 22px;\n}\n.profils-overview-page .sections-grid .section-card mat-card-header mat-card-title {\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--on-surface);\n  margin: 0;\n  flex: 1;\n}\n.profils-overview-page .sections-grid .section-card mat-card-header .badge-chip {\n  background: var(--surface-variant);\n  color: var(--on-surface-2);\n  font-size: 12px;\n  font-weight: 600;\n  padding: 4px 10px;\n  border-radius: 20px;\n  white-space: nowrap;\n}\n.profils-overview-page .sections-grid .section-card mat-card-content {\n  padding: 0 20px 10px 20px !important;\n}\n.profils-overview-page .sections-grid .section-card mat-card-content p {\n  color: var(--on-surface-3);\n  font-size: 13.5px;\n  line-height: 1.5;\n  margin: 0;\n}\n.profils-overview-page .sections-grid .section-card mat-card-actions {\n  padding: 10px 20px 16px 20px;\n}\n.profils-overview-page .sections-grid .section-card mat-card-actions button {\n  font-weight: 600;\n  font-size: 13px;\n}\n.profils-overview-page .sections-grid .section-card mat-card-actions button mat-icon {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  margin-left: 4px;\n  transition: transform 0.2s ease;\n}\n.profils-overview-page .sections-grid .section-card mat-card-actions button:hover mat-icon {\n  transform: translateX(4px);\n}\n@media (max-width: 768px) {\n  .profils-overview-page {\n    padding: 12px;\n  }\n  .profils-overview-page .header-banner {\n    padding: 16px;\n  }\n  .profils-overview-page .header-banner .header-content {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 12px;\n  }\n  .profils-overview-page .sections-grid {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=profils-overview.component.css.map */\n"] }]
  }], () => [{ type: Router }, { type: DashboardStatsService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfilsOverviewComponent, { className: "ProfilsOverviewComponent", filePath: "src/app/features/profils/profils-overview/profils-overview.component.ts", lineNumber: 12 });
})();

// src/app/features/profils/services/role.service.ts
var RoleService = class _RoleService {
  http;
  apiUrl = `${environment.apiUrl}/roles`;
  constructor(http) {
    this.http = http;
  }
  getAll() {
    return this.http.get(this.apiUrl);
  }
  getById(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  create(role) {
    return this.http.post(this.apiUrl, role);
  }
  update(id, role) {
    return this.http.put(`${this.apiUrl}/${id}`, role);
  }
  delete(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  static \u0275fac = function RoleService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RoleService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RoleService, factory: _RoleService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RoleService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/profils/roles-list/roles-list.component.ts
var _forTrack02 = ($index, $item) => $item.id;
function RolesListComponent_For_34_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r2);
  }
}
function RolesListComponent_For_34_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275text(1, "Actif");
    \u0275\u0275elementEnd();
  }
}
function RolesListComponent_For_34_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 19);
    \u0275\u0275text(1, "Inactif");
    \u0275\u0275elementEnd();
  }
}
function RolesListComponent_For_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 11);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "strong", 12);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td", 13);
    \u0275\u0275text(8);
    \u0275\u0275elementStart(9, "div", 14);
    \u0275\u0275repeaterCreate(10, RolesListComponent_For_34_For_11_Template, 2, 1, "span", 15, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td", 8)(13, "span", 16)(14, "mat-icon", 17);
    \u0275\u0275text(15, "person");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td", 8);
    \u0275\u0275conditionalCreate(18, RolesListComponent_For_34_Conditional_18_Template, 2, 0, "span", 18)(19, RolesListComponent_For_34_Conditional_19_Template, 2, 0, "span", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 8)(21, "div", 20)(22, "button", 21);
    \u0275\u0275listener("click", function RolesListComponent_For_34_Template_button_click_22_listener() {
      const r_r3 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.openEditModal(r_r3));
    });
    \u0275\u0275elementStart(23, "mat-icon");
    \u0275\u0275text(24, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "button", 22);
    \u0275\u0275listener("click", function RolesListComponent_For_34_Template_button_click_25_listener() {
      const r_r3 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleStatus(r_r3));
    });
    \u0275\u0275elementStart(26, "mat-icon");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "button", 23);
    \u0275\u0275listener("click", function RolesListComponent_For_34_Template_button_click_28_listener() {
      const r_r3 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.deleteRole(r_r3));
    });
    \u0275\u0275elementStart(29, "mat-icon");
    \u0275\u0275text(30, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const r_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background", r_r3.badgeColor + "18")("color", r_r3.badgeColor)("border-color", r_r3.badgeColor + "40");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", r_r3.code, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r3.libelle);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", r_r3.description, " ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(r_r3.permissions);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", r_r3.nbUsers, " utilisateur(s) ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r3.actif ? 18 : 19);
    \u0275\u0275advance(7);
    \u0275\u0275property("title", r_r3.actif ? "D\xE9sactiver" : "Activer");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r3.actif ? "toggle_on" : "toggle_off");
  }
}
function RolesListComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 24)(2, "div", 25)(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 26);
    \u0275\u0275listener("click", function RolesListComponent_Conditional_35_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closeModal());
    });
    \u0275\u0275elementStart(6, "mat-icon");
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 27)(9, "mat-form-field", 28)(10, "mat-label");
    \u0275\u0275text(11, "Code du Profil (ex: DRH, GESTIONNAIRE)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 29);
    \u0275\u0275twoWayListener("ngModelChange", function RolesListComponent_Conditional_35_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.formModel.code, $event) || (ctx_r3.formModel.code = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "mat-form-field", 28)(14, "mat-label");
    \u0275\u0275text(15, "Libell\xE9 Intitul\xE9 du R\xF4le");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 30);
    \u0275\u0275twoWayListener("ngModelChange", function RolesListComponent_Conditional_35_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.formModel.libelle, $event) || (ctx_r3.formModel.libelle = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "mat-form-field", 28)(18, "mat-label");
    \u0275\u0275text(19, "Description d\xE9taill\xE9e des responsabilit\xE9s");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "textarea", 31);
    \u0275\u0275twoWayListener("ngModelChange", function RolesListComponent_Conditional_35_Template_textarea_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.formModel.description, $event) || (ctx_r3.formModel.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 32)(22, "button", 33);
    \u0275\u0275listener("click", function RolesListComponent_Conditional_35_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closeModal());
    });
    \u0275\u0275text(23, "Annuler");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "button", 34);
    \u0275\u0275listener("click", function RolesListComponent_Conditional_35_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.saveRole());
    });
    \u0275\u0275elementStart(25, "mat-icon");
    \u0275\u0275text(26, "save");
    \u0275\u0275elementEnd();
    \u0275\u0275text(27, " Enregistrer ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r3.editingRole ? "Modifier le Profil" : "Cr\xE9er un Nouveau Profil");
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.formModel.code);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.formModel.libelle);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.formModel.description);
  }
}
var RolesListComponent = class _RolesListComponent {
  roleService;
  rolesList = [];
  loading = false;
  errorMsg = "";
  showDialog = false;
  editingRole = null;
  formModel = {
    code: "",
    libelle: "",
    description: "",
    badgeColor: "#0060B3",
    actif: true
  };
  constructor(roleService) {
    this.roleService = roleService;
  }
  ngOnInit() {
    this.chargerRoles();
  }
  chargerRoles() {
    this.loading = true;
    this.errorMsg = "";
    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.rolesList = roles || [];
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur chargement r\xF4les API:", err);
        this.errorMsg = "Impossible de charger les r\xF4les depuis PostgreSQL.";
        this.loading = false;
      }
    });
  }
  openAddModal() {
    this.editingRole = null;
    this.formModel = {
      code: "",
      libelle: "",
      description: "",
      badgeColor: "#0060B3",
      actif: true
    };
    this.showDialog = true;
  }
  openEditModal(role) {
    this.editingRole = role;
    this.formModel = __spreadValues({}, role);
    this.showDialog = true;
  }
  closeModal() {
    this.showDialog = false;
  }
  saveRole() {
    if (!this.formModel.code || !this.formModel.libelle)
      return;
    if (this.editingRole && this.editingRole.id) {
      this.roleService.update(this.editingRole.id, this.formModel).subscribe({
        next: () => {
          this.closeModal();
          this.chargerRoles();
        },
        error: (err) => {
          console.error("Erreur update r\xF4le:", err);
          alert("Erreur lors de la mise \xE0 jour du r\xF4le.");
        }
      });
    } else {
      const payload = {
        code: (this.formModel.code || "").toUpperCase().trim(),
        libelle: this.formModel.libelle || "",
        description: this.formModel.description || "",
        badgeColor: this.formModel.badgeColor || "#0060B3",
        actif: this.formModel.actif ?? true,
        permissions: ["LECTURE_SEULE"]
      };
      this.roleService.create(payload).subscribe({
        next: () => {
          this.closeModal();
          this.chargerRoles();
        },
        error: (err) => {
          console.error("Erreur cr\xE9ation r\xF4le:", err);
          alert("Erreur lors de la cr\xE9ation du r\xF4le.");
        }
      });
    }
  }
  toggleStatus(role) {
    if (!role.id)
      return;
    const updated = __spreadProps(__spreadValues({}, role), { actif: !role.actif });
    this.roleService.update(role.id, updated).subscribe({
      next: () => this.chargerRoles(),
      error: (err) => console.error("Erreur toggle statut r\xF4le:", err)
    });
  }
  deleteRole(role) {
    if (!role.id)
      return;
    if (confirm(`Voulez-vous vraiment supprimer le profil ${role.libelle} ?`)) {
      this.roleService.delete(role.id).subscribe({
        next: () => this.chargerRoles(),
        error: (err) => {
          console.error("Erreur delete r\xF4le:", err);
          alert("Erreur lors de la suppression du r\xF4le.");
        }
      });
    }
  }
  static \u0275fac = function RolesListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RolesListComponent)(\u0275\u0275directiveInject(RoleService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RolesListComponent, selectors: [["app-roles-list"]], standalone: false, decls: 36, vars: 2, consts: [[1, "roles-page"], [1, "page-header"], [1, "ph-content"], [1, "ph-icon"], ["mat-raised-button", "", 1, "btn-new", 3, "click"], [1, "table-card"], [1, "table-wrapper"], [1, "custom-table"], [2, "text-align", "center"], [2, "text-align", "center", "min-width", "120px"], [1, "modal-backdrop"], [1, "role-chip"], [2, "color", "#1e293b", "font-size", "14px"], [2, "color", "#475569", "max-width", "380px"], [1, "perm-tags"], [1, "tag"], [1, "users-count-chip"], [2, "font-size", "14px", "width", "14px", "height", "14px"], [1, "status-chip", "active"], [1, "status-chip", "inactive"], [1, "action-btns"], ["mat-icon-button", "", "color", "primary", "title", "Modifier le profil", 3, "click"], ["mat-icon-button", "", 3, "click", "title"], ["mat-icon-button", "", "color", "warn", "title", "Supprimer", 3, "click"], [1, "modal-container"], [1, "modal-header"], ["mat-icon-button", "", 3, "click"], [1, "modal-body"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "placeholder", "CODE_PROFIL", 3, "ngModelChange", "ngModel"], ["matInput", "", "placeholder", "Nom du r\xF4le", 3, "ngModelChange", "ngModel"], ["matInput", "", "rows", "3", "placeholder", "\xC9tendue des droits et responsabilit\xE9s...", 3, "ngModelChange", "ngModel"], [1, "modal-footer"], ["mat-button", "", 3, "click"], ["mat-raised-button", "", "color", "primary", 3, "click"]], template: function RolesListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "mat-icon");
      \u0275\u0275text(5, "badge");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div")(7, "h1");
      \u0275\u0275text(8, "Profils & R\xF4les Applicatifs");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p");
      \u0275\u0275text(10);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "button", 4);
      \u0275\u0275listener("click", function RolesListComponent_Template_button_click_11_listener() {
        return ctx.openAddModal();
      });
      \u0275\u0275elementStart(12, "mat-icon");
      \u0275\u0275text(13, "add");
      \u0275\u0275elementEnd();
      \u0275\u0275text(14, " Nouveau Profil ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "mat-card", 5)(16, "div", 6)(17, "table", 7)(18, "thead")(19, "tr")(20, "th");
      \u0275\u0275text(21, "Code Profil");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "th");
      \u0275\u0275text(23, "Libell\xE9 du R\xF4le");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "th");
      \u0275\u0275text(25, "Description & \xC9tendue");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "th", 8);
      \u0275\u0275text(27, "Utilisateurs");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "th", 8);
      \u0275\u0275text(29, "Statut");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "th", 9);
      \u0275\u0275text(31, "Actions");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(32, "tbody");
      \u0275\u0275repeaterCreate(33, RolesListComponent_For_34_Template, 31, 13, "tr", null, _forTrack02);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(35, RolesListComponent_Conditional_35_Template, 28, 4, "div", 10);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate1("", ctx.rolesList.length, " profils et r\xF4les configur\xE9s dans le syst\xE8me");
      \u0275\u0275advance(23);
      \u0275\u0275repeater(ctx.rolesList);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showDialog ? 35 : -1);
    }
  }, dependencies: [DefaultValueAccessor, NgControlStatus, NgModel, MatCard, MatIcon, MatButton, MatIconButton, MatFormField, MatLabel, MatInput], styles: ["\n\n.roles-page[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.roles-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 18px 24px;\n  color: var(--on-surface);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 24px;\n  box-shadow: var(--shadow-card);\n}\n.roles-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.roles-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   .ph-icon[_ngcontent-%COMP%] {\n  background: rgba(2, 132, 199, 0.12);\n  color: #0284c7;\n  padding: 10px;\n  border-radius: 10px;\n  display: flex;\n}\n.roles-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   .ph-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 28px;\n  width: 28px;\n  height: 28px;\n}\n.roles-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.roles-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 2px 0 0 0;\n  font-size: 13px;\n  color: var(--on-surface-3);\n}\n.roles-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .btn-new[_ngcontent-%COMP%] {\n  background: #0284c7 !important;\n  color: #ffffff !important;\n  font-weight: 700;\n  border-radius: 8px;\n}\n.roles-page[_ngcontent-%COMP%]   .table-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.roles-page[_ngcontent-%COMP%]   .table-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.roles-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 800px;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.roles-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border-bottom: 2px solid #cbd5e1;\n  color: #334155;\n  font-size: 11px;\n  text-transform: uppercase;\n}\n.roles-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 12px 14px;\n  text-align: left;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.roles-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #f1f5f9;\n  transition: background 0.15s;\n}\n.roles-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #f8fafc;\n}\n.roles-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 10px 14px;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n.roles-page[_ngcontent-%COMP%]   .role-chip[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 11px;\n  padding: 4px 10px;\n  border-radius: 6px;\n  border: 1px solid transparent;\n}\n.roles-page[_ngcontent-%COMP%]   .perm-tags[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px;\n  margin-top: 6px;\n}\n.roles-page[_ngcontent-%COMP%]   .perm-tags[_ngcontent-%COMP%]   .tag[_ngcontent-%COMP%] {\n  font-size: 10px;\n  background: #f1f5f9;\n  color: #475569;\n  padding: 1px 6px;\n  border-radius: 4px;\n  font-family: monospace;\n}\n.roles-page[_ngcontent-%COMP%]   .users-count-chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  padding: 3px 8px;\n  border-radius: 12px;\n  font-size: 11px;\n  color: #475569;\n  font-weight: 600;\n}\n.roles-page[_ngcontent-%COMP%]   .status-chip[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 700;\n  padding: 3px 10px;\n  border-radius: 12px;\n}\n.roles-page[_ngcontent-%COMP%]   .status-chip.active[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.roles-page[_ngcontent-%COMP%]   .status-chip.inactive[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.roles-page[_ngcontent-%COMP%]   .action-btns[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  white-space: nowrap;\n}\n.roles-page[_ngcontent-%COMP%]   .action-btns[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 32px !important;\n  height: 32px !important;\n  line-height: 32px !important;\n  padding: 0 !important;\n}\n.roles-page[_ngcontent-%COMP%]   .action-btns[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n}\n.roles-page[_ngcontent-%COMP%]   .modal-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n  padding: 20px;\n}\n.roles-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 12px;\n  max-width: 550px;\n  width: 100%;\n  padding: 24px;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.roles-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 2px solid #0060B3;\n  padding-bottom: 12px;\n  margin-bottom: 20px;\n}\n.roles-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #0060B3;\n  font-size: 18px;\n  font-weight: 700;\n}\n.roles-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.roles-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.roles-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%]   .modal-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 20px;\n  padding-top: 16px;\n  border-top: 1px solid #e2e8f0;\n}\n/*# sourceMappingURL=roles-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RolesListComponent, [{
    type: Component,
    args: [{ selector: "app-roles-list", standalone: false, template: `<div class="roles-page">\r
  <!-- En-t\xEAte -->\r
  <div class="page-header">\r
    <div class="ph-content">\r
      <div class="ph-icon"><mat-icon>badge</mat-icon></div>\r
      <div>\r
        <h1>Profils & R\xF4les Applicatifs</h1>\r
        <p>{{ rolesList.length }} profils et r\xF4les configur\xE9s dans le syst\xE8me</p>\r
      </div>\r
    </div>\r
    <button mat-raised-button class="btn-new" (click)="openAddModal()">\r
      <mat-icon>add</mat-icon> Nouveau Profil\r
    </button>\r
  </div>\r
\r
  <!-- Table des r\xF4les -->\r
  <mat-card class="table-card">\r
    <div class="table-wrapper">\r
      <table class="custom-table">\r
        <thead>\r
          <tr>\r
            <th>Code Profil</th>\r
            <th>Libell\xE9 du R\xF4le</th>\r
            <th>Description & \xC9tendue</th>\r
            <th style="text-align: center;">Utilisateurs</th>\r
            <th style="text-align: center;">Statut</th>\r
            <th style="text-align: center; min-width: 120px;">Actions</th>\r
          </tr>\r
        </thead>\r
        <tbody>\r
          @for (r of rolesList; track r.id) {\r
            <tr>\r
              <td>\r
                <span class="role-chip" [style.background]="r.badgeColor + '18'" [style.color]="r.badgeColor" [style.border-color]="r.badgeColor + '40'">\r
                  {{ r.code }}\r
                </span>\r
              </td>\r
              <td>\r
                <strong style="color: #1e293b; font-size: 14px;">{{ r.libelle }}</strong>\r
              </td>\r
              <td style="color: #475569; max-width: 380px;">\r
                {{ r.description }}\r
                <div class="perm-tags">\r
                  @for (p of r.permissions; track p) {\r
                    <span class="tag">{{ p }}</span>\r
                  }\r
                </div>\r
              </td>\r
              <td style="text-align: center;">\r
                <span class="users-count-chip">\r
                  <mat-icon style="font-size: 14px; width: 14px; height: 14px;">person</mat-icon>\r
                  {{ r.nbUsers }} utilisateur(s)\r
                </span>\r
              </td>\r
              <td style="text-align: center;">\r
                @if (r.actif) {\r
                  <span class="status-chip active">Actif</span>\r
                } @else {\r
                  <span class="status-chip inactive">Inactif</span>\r
                }\r
              </td>\r
              <td style="text-align: center;">\r
                <div class="action-btns">\r
                  <button mat-icon-button color="primary" title="Modifier le profil" (click)="openEditModal(r)">\r
                    <mat-icon>edit</mat-icon>\r
                  </button>\r
                  <button mat-icon-button [title]="r.actif ? 'D\xE9sactiver' : 'Activer'" (click)="toggleStatus(r)">\r
                    <mat-icon>{{ r.actif ? 'toggle_on' : 'toggle_off' }}</mat-icon>\r
                  </button>\r
                  <button mat-icon-button color="warn" title="Supprimer" (click)="deleteRole(r)">\r
                    <mat-icon>delete</mat-icon>\r
                  </button>\r
                </div>\r
              </td>\r
            </tr>\r
          }\r
        </tbody>\r
      </table>\r
    </div>\r
  </mat-card>\r
\r
  <!-- Modal \xC9dition / Ajout -->\r
  @if (showDialog) {\r
    <div class="modal-backdrop">\r
      <div class="modal-container">\r
        <div class="modal-header">\r
          <h2>{{ editingRole ? 'Modifier le Profil' : 'Cr\xE9er un Nouveau Profil' }}</h2>\r
          <button mat-icon-button (click)="closeModal()"><mat-icon>close</mat-icon></button>\r
        </div>\r
        <div class="modal-body">\r
          <mat-form-field appearance="outline" class="full-width">\r
            <mat-label>Code du Profil (ex: DRH, GESTIONNAIRE)</mat-label>\r
            <input matInput [(ngModel)]="formModel.code" placeholder="CODE_PROFIL">\r
          </mat-form-field>\r
\r
          <mat-form-field appearance="outline" class="full-width">\r
            <mat-label>Libell\xE9 Intitul\xE9 du R\xF4le</mat-label>\r
            <input matInput [(ngModel)]="formModel.libelle" placeholder="Nom du r\xF4le">\r
          </mat-form-field>\r
\r
          <mat-form-field appearance="outline" class="full-width">\r
            <mat-label>Description d\xE9taill\xE9e des responsabilit\xE9s</mat-label>\r
            <textarea matInput [(ngModel)]="formModel.description" rows="3" placeholder="\xC9tendue des droits et responsabilit\xE9s..."></textarea>\r
          </mat-form-field>\r
        </div>\r
        <div class="modal-footer">\r
          <button mat-button (click)="closeModal()">Annuler</button>\r
          <button mat-raised-button color="primary" (click)="saveRole()">\r
            <mat-icon>save</mat-icon> Enregistrer\r
          </button>\r
        </div>\r
      </div>\r
    </div>\r
  }\r
</div>\r
`, styles: ["/* src/app/features/profils/roles-list/roles-list.component.scss */\n.roles-page {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.roles-page .page-header {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 18px 24px;\n  color: var(--on-surface);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 24px;\n  box-shadow: var(--shadow-card);\n}\n.roles-page .page-header .ph-content {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.roles-page .page-header .ph-content .ph-icon {\n  background: rgba(2, 132, 199, 0.12);\n  color: #0284c7;\n  padding: 10px;\n  border-radius: 10px;\n  display: flex;\n}\n.roles-page .page-header .ph-content .ph-icon mat-icon {\n  font-size: 28px;\n  width: 28px;\n  height: 28px;\n}\n.roles-page .page-header .ph-content h1 {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.roles-page .page-header .ph-content p {\n  margin: 2px 0 0 0;\n  font-size: 13px;\n  color: var(--on-surface-3);\n}\n.roles-page .page-header .btn-new {\n  background: #0284c7 !important;\n  color: #ffffff !important;\n  font-weight: 700;\n  border-radius: 8px;\n}\n.roles-page .table-card {\n  border-radius: 12px;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.roles-page .table-wrapper {\n  width: 100%;\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.roles-page .custom-table {\n  width: 100%;\n  min-width: 800px;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.roles-page .custom-table thead tr {\n  background: #f8fafc;\n  border-bottom: 2px solid #cbd5e1;\n  color: #334155;\n  font-size: 11px;\n  text-transform: uppercase;\n}\n.roles-page .custom-table thead tr th {\n  padding: 12px 14px;\n  text-align: left;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.roles-page .custom-table tbody tr {\n  border-bottom: 1px solid #f1f5f9;\n  transition: background 0.15s;\n}\n.roles-page .custom-table tbody tr:hover {\n  background: #f8fafc;\n}\n.roles-page .custom-table tbody tr td {\n  padding: 10px 14px;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n.roles-page .role-chip {\n  font-weight: 700;\n  font-size: 11px;\n  padding: 4px 10px;\n  border-radius: 6px;\n  border: 1px solid transparent;\n}\n.roles-page .perm-tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px;\n  margin-top: 6px;\n}\n.roles-page .perm-tags .tag {\n  font-size: 10px;\n  background: #f1f5f9;\n  color: #475569;\n  padding: 1px 6px;\n  border-radius: 4px;\n  font-family: monospace;\n}\n.roles-page .users-count-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  padding: 3px 8px;\n  border-radius: 12px;\n  font-size: 11px;\n  color: #475569;\n  font-weight: 600;\n}\n.roles-page .status-chip {\n  font-size: 11px;\n  font-weight: 700;\n  padding: 3px 10px;\n  border-radius: 12px;\n}\n.roles-page .status-chip.active {\n  background: #dcfce7;\n  color: #15803d;\n}\n.roles-page .status-chip.inactive {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.roles-page .action-btns {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  white-space: nowrap;\n}\n.roles-page .action-btns button {\n  width: 32px !important;\n  height: 32px !important;\n  line-height: 32px !important;\n  padding: 0 !important;\n}\n.roles-page .action-btns button mat-icon {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n}\n.roles-page .modal-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n  padding: 20px;\n}\n.roles-page .modal-container {\n  background: white;\n  border-radius: 12px;\n  max-width: 550px;\n  width: 100%;\n  padding: 24px;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.roles-page .modal-container .modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 2px solid #0060B3;\n  padding-bottom: 12px;\n  margin-bottom: 20px;\n}\n.roles-page .modal-container .modal-header h2 {\n  margin: 0;\n  color: #0060B3;\n  font-size: 18px;\n  font-weight: 700;\n}\n.roles-page .modal-container .modal-body {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.roles-page .modal-container .modal-body .full-width {\n  width: 100%;\n}\n.roles-page .modal-container .modal-footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 20px;\n  padding-top: 16px;\n  border-top: 1px solid #e2e8f0;\n}\n/*# sourceMappingURL=roles-list.component.css.map */\n"] }]
  }], () => [{ type: RoleService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RolesListComponent, { className: "RolesListComponent", filePath: "src/app/features/profils/roles-list/roles-list.component.ts", lineNumber: 10 });
})();

// src/app/features/profils/services/habilitation.service.ts
var HabilitationService = class _HabilitationService {
  http;
  apiUrl = `${environment.apiUrl}/habilitations`;
  constructor(http) {
    this.http = http;
  }
  getAll() {
    return this.http.get(this.apiUrl);
  }
  saveMatrix(matrix) {
    return this.http.post(`${this.apiUrl}/save-matrix`, matrix);
  }
  create(item) {
    return this.http.post(`${this.apiUrl}/create`, item);
  }
  update(id, item) {
    return this.http.put(`${this.apiUrl}/${id}`, item);
  }
  delete(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  static \u0275fac = function HabilitationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HabilitationService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HabilitationService, factory: _HabilitationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HabilitationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/features/profils/habilitations-matrix/habilitations-matrix.component.ts
var _forTrack03 = ($index, $item) => $item.code;
var _forTrack1 = ($index, $item) => $item.id;
function HabilitationsMatrixComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Matrice des habilitations et droits d'acc\xE8s enregistr\xE9e avec succ\xE8s ! ");
    \u0275\u0275elementEnd();
  }
}
function HabilitationsMatrixComponent_For_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 9)(1, "span", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", r_r1.color + "15")("color", r_r1.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", r_r1.label, " ");
  }
}
function HabilitationsMatrixComponent_For_28_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 14)(1, "mat-checkbox", 15);
    \u0275\u0275listener("change", function HabilitationsMatrixComponent_For_28_For_12_Template_mat_checkbox_change_1_listener() {
      const r_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const m_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.toggleAccess(m_r4, r_r3.code));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r3 = ctx.$implicit;
    const m_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("checked", m_r4.rolesAccess[r_r3.code]);
  }
}
function HabilitationsMatrixComponent_For_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 11);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "strong", 12);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 13);
    \u0275\u0275text(8, "Code: ");
    \u0275\u0275elementStart(9, "code");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(11, HabilitationsMatrixComponent_For_28_For_12_Template, 2, 1, "td", 14, _forTrack03);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r4 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r4.moduleName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r4.actionName);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(m_r4.actionCode);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r4.roles);
  }
}
var HabilitationsMatrixComponent = class _HabilitationsMatrixComponent {
  authService;
  habilitationService;
  roleService;
  roles = [
    { code: "ADMIN", label: "Administrateur", color: "#c62828" },
    { code: "DRH", label: "Directeur RH", color: "#1565c0" },
    { code: "GESTIONNAIRE_PAIE", label: "Gestionnaire Paie", color: "#2e7d32" },
    { code: "VALIDATEUR", label: "Validateur", color: "#ef6c00" },
    { code: "CONSULTANT", label: "Consultant", color: "#6a1b9a" },
    { code: "EMPLOYE", label: "Collaborateur", color: "#0d9488" }
  ];
  matrix = [];
  loading = false;
  savedNotification = false;
  errorMessage = "";
  constructor(authService, habilitationService, roleService) {
    this.authService = authService;
    this.habilitationService = habilitationService;
    this.roleService = roleService;
  }
  ngOnInit() {
    this.chargerDonnees();
  }
  chargerDonnees() {
    this.loading = true;
    this.errorMessage = "";
    this.roleService.getAll().subscribe({
      next: (roleList) => {
        if (roleList && roleList.length > 0) {
          this.roles = roleList.map((r) => ({
            code: r.code,
            label: r.libelle,
            color: r.badgeColor || "#0060B3"
          }));
        }
      },
      error: (err) => console.error("Erreur chargement r\xF4les:", err)
    });
    this.habilitationService.getAll().subscribe({
      next: (data) => {
        this.matrix = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur chargement habilitations:", err);
        this.errorMessage = "Impossible de charger la matrice des habilitations depuis PostgreSQL.";
        this.loading = false;
      }
    });
  }
  toggleAccess(item, roleCode) {
    if (!item.rolesAccess) {
      item.rolesAccess = {};
    }
    item.rolesAccess[roleCode] = !item.rolesAccess[roleCode];
  }
  savePermissions() {
    this.habilitationService.saveMatrix(this.matrix).subscribe({
      next: (updatedMatrix) => {
        this.matrix = updatedMatrix;
        this.authService.refreshUserPermissions();
        this.savedNotification = true;
        setTimeout(() => {
          this.savedNotification = false;
        }, 3500);
      },
      error: (err) => {
        console.error("Erreur sauvegarde habilitations:", err);
        alert("Erreur lors de l'enregistrement des habilitations dans PostgreSQL.");
      }
    });
  }
  static \u0275fac = function HabilitationsMatrixComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HabilitationsMatrixComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(HabilitationService), \u0275\u0275directiveInject(RoleService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HabilitationsMatrixComponent, selectors: [["app-habilitations-matrix"]], standalone: false, decls: 29, vars: 1, consts: [[1, "matrix-page"], [1, "page-header"], [1, "ph-content"], [1, "ph-icon"], ["mat-raised-button", "", 1, "btn-save", 3, "click"], [1, "alert-success"], [1, "matrix-card"], [1, "matrix-table"], [2, "width", "180px"], [2, "text-align", "center", "width", "140px"], [1, "role-badge"], [1, "module-chip"], [2, "color", "#1e293b", "font-size", "13px"], [2, "font-size", "11px", "color", "#64748b"], [2, "text-align", "center"], ["color", "primary", 3, "change", "checked"]], template: function HabilitationsMatrixComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "mat-icon");
      \u0275\u0275text(5, "rule");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div")(7, "h1");
      \u0275\u0275text(8, "Matrice des Habilitations & Droits d'Acc\xE8s");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p");
      \u0275\u0275text(10, "Configuration fine des permissions d'acc\xE8s aux modules et des droits d'action par profil utilisateur");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "button", 4);
      \u0275\u0275listener("click", function HabilitationsMatrixComponent_Template_button_click_11_listener() {
        return ctx.savePermissions();
      });
      \u0275\u0275elementStart(12, "mat-icon");
      \u0275\u0275text(13, "save");
      \u0275\u0275elementEnd();
      \u0275\u0275text(14, " Enregistrer la Matrice ");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(15, HabilitationsMatrixComponent_Conditional_15_Template, 4, 0, "div", 5);
      \u0275\u0275elementStart(16, "mat-card", 6)(17, "table", 7)(18, "thead")(19, "tr")(20, "th", 8);
      \u0275\u0275text(21, "Module Applicatif");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "th");
      \u0275\u0275text(23, "Action & Permission");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(24, HabilitationsMatrixComponent_For_25_Template, 3, 5, "th", 9, _forTrack03);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "tbody");
      \u0275\u0275repeaterCreate(27, HabilitationsMatrixComponent_For_28_Template, 13, 3, "tr", null, _forTrack1);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(15);
      \u0275\u0275conditional(ctx.savedNotification ? 15 : -1);
      \u0275\u0275advance(9);
      \u0275\u0275repeater(ctx.roles);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.matrix);
    }
  }, dependencies: [MatCard, MatIcon, MatButton, MatCheckbox], styles: ["\n\n.matrix-page[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.matrix-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 18px 24px;\n  color: var(--on-surface);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n  box-shadow: var(--shadow-card);\n}\n.matrix-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.matrix-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   .ph-icon[_ngcontent-%COMP%] {\n  background: rgba(2, 132, 199, 0.12);\n  color: #0284c7;\n  padding: 10px;\n  border-radius: 10px;\n  display: flex;\n}\n.matrix-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   .ph-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 28px;\n  width: 28px;\n  height: 28px;\n}\n.matrix-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.matrix-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 2px 0 0 0;\n  font-size: 13px;\n  color: var(--on-surface-3);\n}\n.matrix-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .btn-save[_ngcontent-%COMP%] {\n  background: #0284c7 !important;\n  color: #ffffff !important;\n  font-weight: 700;\n  border-radius: 8px;\n}\n.matrix-page[_ngcontent-%COMP%]   .alert-success[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n  border: 1px solid #bbf7d0;\n  padding: 12px 18px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-weight: 600;\n  font-size: 14px;\n}\n.matrix-page[_ngcontent-%COMP%]   .matrix-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.matrix-page[_ngcontent-%COMP%]   .matrix-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.matrix-page[_ngcontent-%COMP%]   .matrix-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border-bottom: 2px solid #cbd5e1;\n  color: #334155;\n}\n.matrix-page[_ngcontent-%COMP%]   .matrix-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 14px 16px;\n  text-align: left;\n  font-weight: 700;\n  font-size: 12px;\n}\n.matrix-page[_ngcontent-%COMP%]   .matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #f1f5f9;\n  transition: background 0.15s;\n}\n.matrix-page[_ngcontent-%COMP%]   .matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #f8fafc;\n}\n.matrix-page[_ngcontent-%COMP%]   .matrix-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  vertical-align: middle;\n}\n.matrix-page[_ngcontent-%COMP%]   .module-chip[_ngcontent-%COMP%] {\n  background: #eff6ff;\n  color: #1d4ed8;\n  font-weight: 700;\n  font-size: 11px;\n  padding: 4px 8px;\n  border-radius: 6px;\n  display: inline-block;\n}\n.matrix-page[_ngcontent-%COMP%]   .role-badge[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 11px;\n  padding: 4px 8px;\n  border-radius: 8px;\n  display: inline-block;\n}\n/*# sourceMappingURL=habilitations-matrix.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HabilitationsMatrixComponent, [{
    type: Component,
    args: [{ selector: "app-habilitations-matrix", standalone: false, template: `<div class="matrix-page">\r
  <!-- En-t\xEAte -->\r
  <div class="page-header">\r
    <div class="ph-content">\r
      <div class="ph-icon"><mat-icon>rule</mat-icon></div>\r
      <div>\r
        <h1>Matrice des Habilitations & Droits d'Acc\xE8s</h1>\r
        <p>Configuration fine des permissions d'acc\xE8s aux modules et des droits d'action par profil utilisateur</p>\r
      </div>\r
    </div>\r
    <button mat-raised-button class="btn-save" (click)="savePermissions()">\r
      <mat-icon>save</mat-icon> Enregistrer la Matrice\r
    </button>\r
  </div>\r
\r
  @if (savedNotification) {\r
    <div class="alert-success">\r
      <mat-icon>check_circle</mat-icon>\r
      Matrice des habilitations et droits d'acc\xE8s enregistr\xE9e avec succ\xE8s !\r
    </div>\r
  }\r
\r
  <!-- Table de la Matrice -->\r
  <mat-card class="matrix-card">\r
    <table class="matrix-table">\r
      <thead>\r
        <tr>\r
          <th style="width: 180px;">Module Applicatif</th>\r
          <th>Action & Permission</th>\r
          @for (r of roles; track r.code) {\r
            <th style="text-align: center; width: 140px;">\r
              <span class="role-badge" [style.background]="r.color + '15'" [style.color]="r.color">\r
                {{ r.label }}\r
              </span>\r
            </th>\r
          }\r
        </tr>\r
      </thead>\r
      <tbody>\r
        @for (m of matrix; track m.id) {\r
          <tr>\r
            <td>\r
              <span class="module-chip">{{ m.moduleName }}</span>\r
            </td>\r
            <td>\r
              <strong style="color: #1e293b; font-size: 13px;">{{ m.actionName }}</strong>\r
              <div style="font-size: 11px; color: #64748b;">Code: <code>{{ m.actionCode }}</code></div>\r
            </td>\r
            @for (r of roles; track r.code) {\r
              <td style="text-align: center;">\r
                <mat-checkbox [checked]="m.rolesAccess[r.code]" (change)="toggleAccess(m, r.code)" color="primary"></mat-checkbox>\r
              </td>\r
            }\r
          </tr>\r
        }\r
      </tbody>\r
    </table>\r
  </mat-card>\r
</div>\r
`, styles: ["/* src/app/features/profils/habilitations-matrix/habilitations-matrix.component.scss */\n.matrix-page {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.matrix-page .page-header {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 18px 24px;\n  color: var(--on-surface);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n  box-shadow: var(--shadow-card);\n}\n.matrix-page .page-header .ph-content {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.matrix-page .page-header .ph-content .ph-icon {\n  background: rgba(2, 132, 199, 0.12);\n  color: #0284c7;\n  padding: 10px;\n  border-radius: 10px;\n  display: flex;\n}\n.matrix-page .page-header .ph-content .ph-icon mat-icon {\n  font-size: 28px;\n  width: 28px;\n  height: 28px;\n}\n.matrix-page .page-header .ph-content h1 {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.matrix-page .page-header .ph-content p {\n  margin: 2px 0 0 0;\n  font-size: 13px;\n  color: var(--on-surface-3);\n}\n.matrix-page .page-header .btn-save {\n  background: #0284c7 !important;\n  color: #ffffff !important;\n  font-weight: 700;\n  border-radius: 8px;\n}\n.matrix-page .alert-success {\n  background: #dcfce7;\n  color: #15803d;\n  border: 1px solid #bbf7d0;\n  padding: 12px 18px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-weight: 600;\n  font-size: 14px;\n}\n.matrix-page .matrix-card {\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.matrix-page .matrix-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.matrix-page .matrix-table thead tr {\n  background: #f8fafc;\n  border-bottom: 2px solid #cbd5e1;\n  color: #334155;\n}\n.matrix-page .matrix-table thead tr th {\n  padding: 14px 16px;\n  text-align: left;\n  font-weight: 700;\n  font-size: 12px;\n}\n.matrix-page .matrix-table tbody tr {\n  border-bottom: 1px solid #f1f5f9;\n  transition: background 0.15s;\n}\n.matrix-page .matrix-table tbody tr:hover {\n  background: #f8fafc;\n}\n.matrix-page .matrix-table tbody tr td {\n  padding: 12px 16px;\n  vertical-align: middle;\n}\n.matrix-page .module-chip {\n  background: #eff6ff;\n  color: #1d4ed8;\n  font-weight: 700;\n  font-size: 11px;\n  padding: 4px 8px;\n  border-radius: 6px;\n  display: inline-block;\n}\n.matrix-page .role-badge {\n  font-weight: 700;\n  font-size: 11px;\n  padding: 4px 8px;\n  border-radius: 8px;\n  display: inline-block;\n}\n/*# sourceMappingURL=habilitations-matrix.component.css.map */\n"] }]
  }], () => [{ type: AuthService }, { type: HabilitationService }, { type: RoleService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HabilitationsMatrixComponent, { className: "HabilitationsMatrixComponent", filePath: "src/app/features/profils/habilitations-matrix/habilitations-matrix.component.ts", lineNumber: 12 });
})();

// src/app/features/profils/users-list/users-list.component.ts
var _forTrack04 = ($index, $item) => $item.code;
var _forTrack12 = ($index, $item) => $item.id;
function UsersListComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function UsersListComponent_Conditional_24_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.searchQuery = "";
      return \u0275\u0275resetView(ctx_r1.applyFilter());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd()();
  }
}
function UsersListComponent_For_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r3 = ctx.$implicit;
    \u0275\u0275property("value", r_r3.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r3.libelle);
  }
}
function UsersListComponent_For_64_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1, "Actif");
    \u0275\u0275elementEnd();
  }
}
function UsersListComponent_For_64_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1, "Suspendu");
    \u0275\u0275elementEnd();
  }
}
function UsersListComponent_For_64_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 24)(3, "div", 25);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "strong", 26);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 27);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "td")(11, "code");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td")(14, "a", 28);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td")(17, "span", 29);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td", 30);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 20);
    \u0275\u0275conditionalCreate(22, UsersListComponent_For_64_Conditional_22_Template, 2, 0, "span", 31)(23, UsersListComponent_For_64_Conditional_23_Template, 2, 0, "span", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "td", 20)(25, "div", 33)(26, "button", 34);
    \u0275\u0275listener("click", function UsersListComponent_For_64_Template_button_click_26_listener() {
      const u_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openEditModal(u_r5));
    });
    \u0275\u0275elementStart(27, "mat-icon");
    \u0275\u0275text(28, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "button", 35);
    \u0275\u0275listener("click", function UsersListComponent_For_64_Template_button_click_29_listener() {
      const u_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.resetPassword(u_r5));
    });
    \u0275\u0275elementStart(30, "mat-icon");
    \u0275\u0275text(31, "key");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "button", 36);
    \u0275\u0275listener("click", function UsersListComponent_For_64_Template_button_click_32_listener() {
      const u_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleStatus(u_r5));
    });
    \u0275\u0275elementStart(33, "mat-icon");
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "button", 37);
    \u0275\u0275listener("click", function UsersListComponent_For_64_Template_button_click_35_listener() {
      const u_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deleteUser(u_r5));
    });
    \u0275\u0275elementStart(36, "mat-icon");
    \u0275\u0275text(37, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const u_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("background", u_r5.avatarColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", u_r5.prenom[0], "", u_r5.nom[0], " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", u_r5.prenom, " ", u_r5.nom);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Cr\xE9\xE9 le ", u_r5.dateCreation);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(u_r5.username);
    \u0275\u0275advance(2);
    \u0275\u0275property("href", "mailto:" + u_r5.email, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(u_r5.email);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("admin", u_r5.role === "ADMIN")("drh", u_r5.role === "DRH")("rh", u_r5.role === "RESPONSABLE_RH")("paie", u_r5.role === "GESTIONNAIRE_PAIE")("compta", u_r5.role === "COMPTABLE_PAIE")("validateur", u_r5.role === "VALIDATEUR")("employe", u_r5.role === "EMPLOYE");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getRoleLabel(u_r5.role), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r5.dernierAcces || "-");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(u_r5.actif ? 22 : 23);
    \u0275\u0275advance(10);
    \u0275\u0275property("title", u_r5.actif ? "D\xE9sactiver" : "Activer");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r5.actif ? "toggle_on" : "toggle_off");
  }
}
function UsersListComponent_Conditional_65_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r7 = ctx.$implicit;
    \u0275\u0275property("value", r_r7.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r7.libelle);
  }
}
function UsersListComponent_Conditional_65_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 44)(1, "mat-label");
    \u0275\u0275text(2, "Mot de passe initial");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 51);
    \u0275\u0275twoWayListener("ngModelChange", function UsersListComponent_Conditional_65_Conditional_32_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.formModel.password, $event) || (ctx_r1.formModel.password = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formModel.password);
  }
}
function UsersListComponent_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 38)(2, "div", 39)(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 40);
    \u0275\u0275listener("click", function UsersListComponent_Conditional_65_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeModal());
    });
    \u0275\u0275elementStart(6, "mat-icon");
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 41)(9, "div", 42)(10, "mat-form-field", 11)(11, "mat-label");
    \u0275\u0275text(12, "Nom");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function UsersListComponent_Conditional_65_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.formModel.nom, $event) || (ctx_r1.formModel.nom = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "mat-form-field", 11)(15, "mat-label");
    \u0275\u0275text(16, "Pr\xE9nom");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function UsersListComponent_Conditional_65_Template_input_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.formModel.prenom, $event) || (ctx_r1.formModel.prenom = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "mat-form-field", 44)(19, "mat-label");
    \u0275\u0275text(20, "Identifiant de connexion (Username)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 45);
    \u0275\u0275twoWayListener("ngModelChange", function UsersListComponent_Conditional_65_Template_input_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.formModel.username, $event) || (ctx_r1.formModel.username = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "mat-form-field", 44)(23, "mat-label");
    \u0275\u0275text(24, "Adresse Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "input", 46);
    \u0275\u0275twoWayListener("ngModelChange", function UsersListComponent_Conditional_65_Template_input_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.formModel.email, $event) || (ctx_r1.formModel.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "mat-form-field", 44)(27, "mat-label");
    \u0275\u0275text(28, "R\xF4le / Profil d'acc\xE8s");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "mat-select", 47);
    \u0275\u0275twoWayListener("ngModelChange", function UsersListComponent_Conditional_65_Template_mat_select_ngModelChange_29_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.formModel.role, $event) || (ctx_r1.formModel.role = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(30, UsersListComponent_Conditional_65_For_31_Template, 2, 2, "mat-option", 14, _forTrack04);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(32, UsersListComponent_Conditional_65_Conditional_32_Template, 4, 1, "mat-form-field", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 48)(34, "button", 49);
    \u0275\u0275listener("click", function UsersListComponent_Conditional_65_Template_button_click_34_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeModal());
    });
    \u0275\u0275text(35, "Annuler");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "button", 50);
    \u0275\u0275listener("click", function UsersListComponent_Conditional_65_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveUser());
    });
    \u0275\u0275elementStart(37, "mat-icon");
    \u0275\u0275text(38, "save");
    \u0275\u0275elementEnd();
    \u0275\u0275text(39, " Enregistrer le compte ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.editingUser ? "Modifier l'Utilisateur" : "Cr\xE9er un Compte Utilisateur");
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formModel.nom);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formModel.prenom);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formModel.username);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formModel.email);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formModel.role);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.availableRoles);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.editingUser ? 32 : -1);
  }
}
var UsersListComponent = class _UsersListComponent {
  utilisateurService;
  roleService;
  usersList = [];
  filteredUsers = [];
  availableRoles = [];
  searchQuery = "";
  roleFilter = "";
  statusFilter = "";
  showDialog = false;
  editingUser = null;
  formModel = {
    username: "",
    nom: "",
    prenom: "",
    email: "",
    role: "GESTIONNAIRE_PAIE",
    password: "",
    actif: true
  };
  constructor(utilisateurService, roleService) {
    this.utilisateurService = utilisateurService;
    this.roleService = roleService;
  }
  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }
  loadRoles() {
    this.roleService.getAll().subscribe({
      next: (roles) => {
        if (roles && roles.length > 0) {
          this.availableRoles = roles;
        } else {
          this.availableRoles = this.getDefaultRoles();
        }
      },
      error: () => {
        this.availableRoles = this.getDefaultRoles();
      }
    });
  }
  getDefaultRoles() {
    return [
      { code: "ADMIN", libelle: "Administrateur Syst\xE8me" },
      { code: "DRH", libelle: "Directeur des Ressources Humaines" },
      { code: "RESPONSABLE_RH", libelle: "Responsable Administration RH" },
      { code: "GESTIONNAIRE_PAIE", libelle: "Gestionnaire de Paie" },
      { code: "COMPTABLE_PAIE", libelle: "Comptable Paie & Tr\xE9sorerie" },
      { code: "VALIDATEUR", libelle: "Validateur Hi\xE9rarchique" },
      { code: "CONSULTANT", libelle: "Consultant / Auditeur" },
      { code: "EMPLOYE", libelle: "Collaborateur Salari\xE9" },
      { code: "AGENT", libelle: "Agent Salari\xE9" }
    ];
  }
  getRoleLabel(code) {
    if (!code)
      return "-";
    const found = this.availableRoles.find((r) => r.code === code);
    if (found)
      return found.libelle;
    const def = this.getDefaultRoles().find((r) => r.code === code);
    return def ? def.libelle : code;
  }
  loadUsers() {
    this.utilisateurService.getAll().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const colors = ["#0060B3", "#1565c0", "#2e7d32", "#ef6c00", "#6a1b9a", "#0284c7", "#0d9488"];
          this.usersList = data.map((u, idx) => ({
            id: String(u.id || idx + 1),
            idNum: u.id,
            username: u.username || u.email || "user",
            nom: u.nom || "",
            prenom: u.prenom || "",
            email: u.email || "",
            role: u.role || "EMPLOYE",
            actif: u.actif !== false,
            dateCreation: "Enregistr\xE9 en Base",
            dernierAcces: "Actif",
            avatarColor: colors[idx % colors.length]
          }));
        } else {
          this.usersList = [];
        }
        this.applyFilter();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des utilisateurs depuis PostgreSQL/Spring Boot:", err);
        this.usersList = [];
        this.applyFilter();
      }
    });
  }
  applyFilter() {
    let list = [...this.usersList];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter((u) => (u.nom || "").toLowerCase().includes(q) || (u.prenom || "").toLowerCase().includes(q) || (u.username || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q));
    }
    if (this.roleFilter) {
      list = list.filter((u) => u.role === this.roleFilter);
    }
    if (this.statusFilter === "active") {
      list = list.filter((u) => u.actif);
    } else if (this.statusFilter === "inactive") {
      list = list.filter((u) => !u.actif);
    }
    this.filteredUsers = list;
  }
  openAddModal() {
    this.editingUser = null;
    this.formModel = {
      username: "",
      nom: "",
      prenom: "",
      email: "",
      role: "GESTIONNAIRE_PAIE",
      password: "",
      actif: true
    };
    this.showDialog = true;
  }
  openEditModal(user) {
    this.editingUser = user;
    this.formModel = __spreadProps(__spreadValues({}, user), { password: "" });
    this.showDialog = true;
  }
  closeModal() {
    this.showDialog = false;
  }
  saveUser() {
    if (!this.formModel.username || !this.formModel.email || !this.formModel.nom)
      return;
    if (this.editingUser && this.editingUser.idNum) {
      const payload = {
        username: this.formModel.username,
        nom: this.formModel.nom,
        prenom: this.formModel.prenom,
        email: this.formModel.email,
        role: this.formModel.role,
        actif: this.formModel.actif ?? true
      };
      if (this.formModel.password) {
        payload.password = this.formModel.password;
      }
      this.utilisateurService.update(this.editingUser.idNum, payload).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => {
          console.error("Erreur lors de la modification de l utilisateur:", err);
          alert("Erreur lors de l'enregistrement de l'utilisateur sur le serveur.");
        }
      });
    } else {
      const newUser = {
        username: this.formModel.username,
        nom: this.formModel.nom,
        prenom: this.formModel.prenom,
        email: this.formModel.email,
        role: this.formModel.role,
        password: this.formModel.password || "1234",
        actif: this.formModel.actif ?? true
      };
      this.utilisateurService.create(newUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => {
          console.error("Erreur lors de la cr\xE9ation de l utilisateur:", err);
          alert("Erreur lors de la cr\xE9ation de l'utilisateur sur le serveur.");
        }
      });
    }
  }
  toggleStatus(user) {
    const newStatus = !user.actif;
    if (user.idNum) {
      this.utilisateurService.update(user.idNum, { actif: newStatus }).subscribe({
        next: () => this.loadUsers(),
        error: (err) => {
          console.error("Erreur lors de la modification du statut utilisateur:", err);
          alert("Impossible de modifier le statut sur le serveur.");
        }
      });
    }
  }
  resetPassword(user) {
    const newPwd = prompt(`Nouveau mot de passe pour ${user.prenom} ${user.nom} :`, "1234");
    if (newPwd && user.idNum) {
      this.utilisateurService.updatePassword(user.idNum, newPwd).subscribe({
        next: () => alert(`Le mot de passe de ${user.prenom} ${user.nom} a \xE9t\xE9 mis \xE0 jour avec succ\xE8s.`),
        error: (err) => {
          console.error("Erreur mise \xE0 jour mot de passe:", err);
          alert(`Erreur lors de la mise \xE0 jour du mot de passe sur le serveur.`);
        }
      });
    }
  }
  deleteUser(user) {
    if (confirm(`Voulez-vous supprimer le compte utilisateur ${user.username} ?`)) {
      if (user.idNum) {
        this.utilisateurService.delete(user.idNum).subscribe({
          next: () => this.loadUsers(),
          error: (err) => {
            console.error("Erreur lors de la suppression de l utilisateur:", err);
            alert("Erreur lors de la suppression de l'utilisateur sur le serveur.");
          }
        });
      }
    }
  }
  static \u0275fac = function UsersListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UsersListComponent)(\u0275\u0275directiveInject(UtilisateurService), \u0275\u0275directiveInject(RoleService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UsersListComponent, selectors: [["app-users-list"]], standalone: false, decls: 66, vars: 6, consts: [[1, "users-page"], [1, "page-header"], [1, "ph-content"], [1, "ph-icon"], ["mat-raised-button", "", 1, "btn-new", 3, "click"], [1, "filter-card"], [1, "filter-row"], ["appearance", "outline", 1, "search-field"], ["matPrefix", ""], ["matInput", "", "placeholder", "Nom, email, identifiant...", 3, "ngModelChange", "ngModel"], ["matSuffix", "", "mat-icon-button", ""], ["appearance", "outline"], [3, "ngModelChange", "selectionChange", "ngModel"], ["value", ""], [3, "value"], ["value", "active"], ["value", "inactive"], [1, "table-card"], [1, "table-wrapper"], [1, "custom-table"], [2, "text-align", "center"], [2, "text-align", "center", "min-width", "140px"], [1, "modal-backdrop"], ["matSuffix", "", "mat-icon-button", "", 3, "click"], [1, "user-cell"], [1, "avatar"], [2, "color", "#1e293b", "font-size", "14px"], [2, "font-size", "11px", "color", "#64748b"], [2, "color", "#0060B3", "text-decoration", "none", 3, "href"], [1, "role-chip"], [2, "text-align", "center", "color", "#475569", "font-size", "12px"], [1, "status-chip", "active"], [1, "status-chip", "inactive"], [1, "action-btns"], ["mat-icon-button", "", "color", "primary", "title", "Modifier l'utilisateur", 3, "click"], ["mat-icon-button", "", "title", "R\xE9initialiser le mot de passe", 2, "color", "#eab308", 3, "click"], ["mat-icon-button", "", 3, "click", "title"], ["mat-icon-button", "", "color", "warn", "title", "Supprimer", 3, "click"], [1, "modal-container"], [1, "modal-header"], ["mat-icon-button", "", 3, "click"], [1, "modal-body"], [1, "form-row"], ["matInput", "", 3, "ngModelChange", "ngModel"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "placeholder", "prenom.nom", 3, "ngModelChange", "ngModel"], ["matInput", "", "type", "email", "placeholder", "utilisateur@entreprise.com", 3, "ngModelChange", "ngModel"], [3, "ngModelChange", "ngModel"], [1, "modal-footer"], ["mat-button", "", 3, "click"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["matInput", "", "type", "password", 3, "ngModelChange", "ngModel"]], template: function UsersListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "mat-icon");
      \u0275\u0275text(5, "manage_accounts");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div")(7, "h1");
      \u0275\u0275text(8, "Gestion des Comptes Utilisateurs");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p");
      \u0275\u0275text(10);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "button", 4);
      \u0275\u0275listener("click", function UsersListComponent_Template_button_click_11_listener() {
        return ctx.openAddModal();
      });
      \u0275\u0275elementStart(12, "mat-icon");
      \u0275\u0275text(13, "person_add");
      \u0275\u0275elementEnd();
      \u0275\u0275text(14, " Nouvel Utilisateur ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "mat-card", 5)(16, "mat-card-content")(17, "div", 6)(18, "mat-form-field", 7)(19, "mat-label");
      \u0275\u0275text(20, "Rechercher un utilisateur...");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "mat-icon", 8);
      \u0275\u0275text(22, "search");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "input", 9);
      \u0275\u0275twoWayListener("ngModelChange", function UsersListComponent_Template_input_ngModelChange_23_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return $event;
      });
      \u0275\u0275listener("ngModelChange", function UsersListComponent_Template_input_ngModelChange_23_listener() {
        return ctx.applyFilter();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(24, UsersListComponent_Conditional_24_Template, 3, 0, "button", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "mat-form-field", 11)(26, "mat-label");
      \u0275\u0275text(27, "Filtrer par R\xF4le");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "mat-select", 12);
      \u0275\u0275twoWayListener("ngModelChange", function UsersListComponent_Template_mat_select_ngModelChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.roleFilter, $event) || (ctx.roleFilter = $event);
        return $event;
      });
      \u0275\u0275listener("selectionChange", function UsersListComponent_Template_mat_select_selectionChange_28_listener() {
        return ctx.applyFilter();
      });
      \u0275\u0275elementStart(29, "mat-option", 13);
      \u0275\u0275text(30, "\u2014 Tous les r\xF4les \u2014");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(31, UsersListComponent_For_32_Template, 2, 2, "mat-option", 14, _forTrack04);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "mat-form-field", 11)(34, "mat-label");
      \u0275\u0275text(35, "Statut");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "mat-select", 12);
      \u0275\u0275twoWayListener("ngModelChange", function UsersListComponent_Template_mat_select_ngModelChange_36_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.statusFilter, $event) || (ctx.statusFilter = $event);
        return $event;
      });
      \u0275\u0275listener("selectionChange", function UsersListComponent_Template_mat_select_selectionChange_36_listener() {
        return ctx.applyFilter();
      });
      \u0275\u0275elementStart(37, "mat-option", 13);
      \u0275\u0275text(38, "\u2014 Tous \u2014");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "mat-option", 15);
      \u0275\u0275text(40, "Actif");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "mat-option", 16);
      \u0275\u0275text(42, "Inactif");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(43, "mat-card", 17)(44, "div", 18)(45, "table", 19)(46, "thead")(47, "tr")(48, "th");
      \u0275\u0275text(49, "Utilisateur");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "th");
      \u0275\u0275text(51, "Identifiant");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "th");
      \u0275\u0275text(53, "Adresse Email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "th");
      \u0275\u0275text(55, "R\xF4le / Profil");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "th", 20);
      \u0275\u0275text(57, "Dernier Acc\xE8s");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "th", 20);
      \u0275\u0275text(59, "Statut");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "th", 21);
      \u0275\u0275text(61, "Actions");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(62, "tbody");
      \u0275\u0275repeaterCreate(63, UsersListComponent_For_64_Template, 38, 29, "tr", null, _forTrack12);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(65, UsersListComponent_Conditional_65_Template, 40, 7, "div", 22);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate1("", ctx.usersList.length, " compte(s) utilisateur(s) enregistr\xE9s dans le syst\xE8me");
      \u0275\u0275advance(13);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.searchQuery ? 24 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.roleFilter);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.availableRoles);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.statusFilter);
      \u0275\u0275advance(27);
      \u0275\u0275repeater(ctx.filteredUsers);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showDialog ? 65 : -1);
    }
  }, dependencies: [DefaultValueAccessor, NgControlStatus, NgModel, MatCard, MatCardContent, MatIcon, MatButton, MatIconButton, MatFormField, MatLabel, MatPrefix, MatSuffix, MatInput, MatSelect, MatOption], styles: ["\n\n.users-page[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.users-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 18px 24px;\n  color: var(--on-surface);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n  box-shadow: var(--shadow-card);\n}\n.users-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.users-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   .ph-icon[_ngcontent-%COMP%] {\n  background: rgba(2, 132, 199, 0.12);\n  color: #0284c7;\n  padding: 10px;\n  border-radius: 10px;\n  display: flex;\n}\n.users-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   .ph-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 28px;\n  width: 28px;\n  height: 28px;\n}\n.users-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.users-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 2px 0 0 0;\n  font-size: 13px;\n  color: var(--on-surface-3);\n}\n.users-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .btn-new[_ngcontent-%COMP%] {\n  background: #0284c7 !important;\n  color: #ffffff !important;\n  font-weight: 700;\n  border-radius: 8px;\n}\n.users-page[_ngcontent-%COMP%]   .filter-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  border: 1px solid #e2e8f0;\n  margin-bottom: 20px;\n}\n.users-page[_ngcontent-%COMP%]   .filter-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  padding: 16px !important;\n}\n.users-page[_ngcontent-%COMP%]   .filter-card[_ngcontent-%COMP%]   .filter-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.users-page[_ngcontent-%COMP%]   .filter-card[_ngcontent-%COMP%]   .filter-row[_ngcontent-%COMP%]   .search-field[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 260px;\n}\n.users-page[_ngcontent-%COMP%]   .table-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.users-page[_ngcontent-%COMP%]   .table-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.users-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 850px;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.users-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border-bottom: 2px solid #cbd5e1;\n  color: #334155;\n  font-size: 11px;\n  text-transform: uppercase;\n}\n.users-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 12px 14px;\n  text-align: left;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.users-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #f1f5f9;\n  transition: background 0.15s;\n}\n.users-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #f8fafc;\n}\n.users-page[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 10px 14px;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n.users-page[_ngcontent-%COMP%]   .user-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.users-page[_ngcontent-%COMP%]   .user-cell[_ngcontent-%COMP%]   .avatar[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  color: white;\n  font-weight: 800;\n  font-size: 13px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);\n}\n.users-page[_ngcontent-%COMP%]   .role-chip[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 11px;\n  padding: 3px 8px;\n  border-radius: 6px;\n  background: #f1f5f9;\n  color: #475569;\n}\n.users-page[_ngcontent-%COMP%]   .role-chip.admin[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #991b1b;\n}\n.users-page[_ngcontent-%COMP%]   .role-chip.drh[_ngcontent-%COMP%] {\n  background: #dbeafe;\n  color: #1e40af;\n}\n.users-page[_ngcontent-%COMP%]   .role-chip.rh[_ngcontent-%COMP%] {\n  background: #e0f2fe;\n  color: #0369a1;\n}\n.users-page[_ngcontent-%COMP%]   .role-chip.paie[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #166534;\n}\n.users-page[_ngcontent-%COMP%]   .role-chip.compta[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #92400e;\n}\n.users-page[_ngcontent-%COMP%]   .role-chip.validateur[_ngcontent-%COMP%] {\n  background: #f3e8ff;\n  color: #6b21a8;\n}\n.users-page[_ngcontent-%COMP%]   .role-chip.employe[_ngcontent-%COMP%] {\n  background: #f1f5f9;\n  color: #334155;\n}\n.users-page[_ngcontent-%COMP%]   .status-chip[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 700;\n  padding: 3px 10px;\n  border-radius: 12px;\n}\n.users-page[_ngcontent-%COMP%]   .status-chip.active[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.users-page[_ngcontent-%COMP%]   .status-chip.inactive[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.users-page[_ngcontent-%COMP%]   .action-btns[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  white-space: nowrap;\n}\n.users-page[_ngcontent-%COMP%]   .action-btns[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 32px !important;\n  height: 32px !important;\n  line-height: 32px !important;\n  padding: 0 !important;\n}\n.users-page[_ngcontent-%COMP%]   .action-btns[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n}\n.users-page[_ngcontent-%COMP%]   .modal-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n  padding: 20px;\n}\n.users-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 12px;\n  max-width: 580px;\n  width: 100%;\n  padding: 24px;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.users-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 2px solid #0060B3;\n  padding-bottom: 12px;\n  margin-bottom: 20px;\n}\n.users-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #0060B3;\n  font-size: 18px;\n  font-weight: 700;\n}\n.users-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.users-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .form-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}\n.users-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.users-page[_ngcontent-%COMP%]   .modal-container[_ngcontent-%COMP%]   .modal-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 20px;\n  padding-top: 16px;\n  border-top: 1px solid #e2e8f0;\n}\n/*# sourceMappingURL=users-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UsersListComponent, [{
    type: Component,
    args: [{ selector: "app-users-list", standalone: false, template: `<div class="users-page">\r
  <!-- En-t\xEAte -->\r
  <div class="page-header">\r
    <div class="ph-content">\r
      <div class="ph-icon"><mat-icon>manage_accounts</mat-icon></div>\r
      <div>\r
        <h1>Gestion des Comptes Utilisateurs</h1>\r
        <p>{{ usersList.length }} compte(s) utilisateur(s) enregistr\xE9s dans le syst\xE8me</p>\r
      </div>\r
    </div>\r
    <button mat-raised-button class="btn-new" (click)="openAddModal()">\r
      <mat-icon>person_add</mat-icon> Nouvel Utilisateur\r
    </button>\r
  </div>\r
\r
  <!-- Barre de Recherche et Filtres -->\r
  <mat-card class="filter-card">\r
    <mat-card-content>\r
      <div class="filter-row">\r
        <mat-form-field appearance="outline" class="search-field">\r
          <mat-label>Rechercher un utilisateur...</mat-label>\r
          <mat-icon matPrefix>search</mat-icon>\r
          <input matInput [(ngModel)]="searchQuery" (ngModelChange)="applyFilter()" placeholder="Nom, email, identifiant...">\r
          @if (searchQuery) {\r
            <button matSuffix mat-icon-button (click)="searchQuery=''; applyFilter()"><mat-icon>close</mat-icon></button>\r
          }\r
        </mat-form-field>\r
\r
        <mat-form-field appearance="outline">\r
          <mat-label>Filtrer par R\xF4le</mat-label>\r
          <mat-select [(ngModel)]="roleFilter" (selectionChange)="applyFilter()">\r
            <mat-option value="">\u2014 Tous les r\xF4les \u2014</mat-option>\r
            @for (r of availableRoles; track r.code) {\r
              <mat-option [value]="r.code">{{ r.libelle }}</mat-option>\r
            }\r
          </mat-select>\r
        </mat-form-field>\r
\r
        <mat-form-field appearance="outline">\r
          <mat-label>Statut</mat-label>\r
          <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilter()">\r
            <mat-option value="">\u2014 Tous \u2014</mat-option>\r
            <mat-option value="active">Actif</mat-option>\r
            <mat-option value="inactive">Inactif</mat-option>\r
          </mat-select>\r
        </mat-form-field>\r
      </div>\r
    </mat-card-content>\r
  </mat-card>\r
\r
  <!-- Tableau des Utilisateurs -->\r
  <mat-card class="table-card">\r
    <div class="table-wrapper">\r
      <table class="custom-table">\r
        <thead>\r
          <tr>\r
            <th>Utilisateur</th>\r
            <th>Identifiant</th>\r
            <th>Adresse Email</th>\r
            <th>R\xF4le / Profil</th>\r
            <th style="text-align: center;">Dernier Acc\xE8s</th>\r
            <th style="text-align: center;">Statut</th>\r
            <th style="text-align: center; min-width: 140px;">Actions</th>\r
          </tr>\r
        </thead>\r
      <tbody>\r
        @for (u of filteredUsers; track u.id) {\r
          <tr>\r
            <td>\r
              <div class="user-cell">\r
                <div class="avatar" [style.background]="u.avatarColor">\r
                  {{ u.prenom[0] }}{{ u.nom[0] }}\r
                </div>\r
                <div>\r
                  <strong style="color: #1e293b; font-size: 14px;">{{ u.prenom }} {{ u.nom }}</strong>\r
                  <div style="font-size: 11px; color: #64748b;">Cr\xE9\xE9 le {{ u.dateCreation }}</div>\r
                </div>\r
              </div>\r
            </td>\r
            <td><code>{{ u.username }}</code></td>\r
            <td><a [href]="'mailto:' + u.email" style="color: #0060B3; text-decoration: none;">{{ u.email }}</a></td>\r
            <td>\r
              <span class="role-chip" \r
                    [class.admin]="u.role === 'ADMIN'" \r
                    [class.drh]="u.role === 'DRH'" \r
                    [class.rh]="u.role === 'RESPONSABLE_RH'"\r
                    [class.paie]="u.role === 'GESTIONNAIRE_PAIE'"\r
                    [class.compta]="u.role === 'COMPTABLE_PAIE'"\r
                    [class.validateur]="u.role === 'VALIDATEUR'"\r
                    [class.employe]="u.role === 'EMPLOYE'">\r
                {{ getRoleLabel(u.role) }}\r
              </span>\r
            </td>\r
            <td style="text-align: center; color: #475569; font-size: 12px;">{{ u.dernierAcces || '-' }}</td>\r
            <td style="text-align: center;">\r
              @if (u.actif) {\r
                <span class="status-chip active">Actif</span>\r
              } @else {\r
                <span class="status-chip inactive">Suspendu</span>\r
              }\r
            </td>\r
            <td style="text-align: center;">\r
              <div class="action-btns">\r
                <button mat-icon-button color="primary" title="Modifier l'utilisateur" (click)="openEditModal(u)">\r
                  <mat-icon>edit</mat-icon>\r
                </button>\r
                <button mat-icon-button style="color: #eab308;" title="R\xE9initialiser le mot de passe" (click)="resetPassword(u)">\r
                  <mat-icon>key</mat-icon>\r
                </button>\r
                <button mat-icon-button [title]="u.actif ? 'D\xE9sactiver' : 'Activer'" (click)="toggleStatus(u)">\r
                  <mat-icon>{{ u.actif ? 'toggle_on' : 'toggle_off' }}</mat-icon>\r
                </button>\r
                <button mat-icon-button color="warn" title="Supprimer" (click)="deleteUser(u)">\r
                  <mat-icon>delete</mat-icon>\r
                </button>\r
              </div>\r
            </td>\r
          </tr>\r
        }\r
      </tbody>\r
    </table>\r
    </div>\r
  </mat-card>\r
\r
  <!-- Modal Formulaire Utilisateur -->\r
  @if (showDialog) {\r
    <div class="modal-backdrop">\r
      <div class="modal-container">\r
        <div class="modal-header">\r
          <h2>{{ editingUser ? 'Modifier l\\'Utilisateur' : 'Cr\xE9er un Compte Utilisateur' }}</h2>\r
          <button mat-icon-button (click)="closeModal()"><mat-icon>close</mat-icon></button>\r
        </div>\r
        <div class="modal-body">\r
          <div class="form-row">\r
            <mat-form-field appearance="outline">\r
              <mat-label>Nom</mat-label>\r
              <input matInput [(ngModel)]="formModel.nom">\r
            </mat-form-field>\r
            <mat-form-field appearance="outline">\r
              <mat-label>Pr\xE9nom</mat-label>\r
              <input matInput [(ngModel)]="formModel.prenom">\r
            </mat-form-field>\r
          </div>\r
\r
          <mat-form-field appearance="outline" class="full-width">\r
            <mat-label>Identifiant de connexion (Username)</mat-label>\r
            <input matInput [(ngModel)]="formModel.username" placeholder="prenom.nom">\r
          </mat-form-field>\r
\r
          <mat-form-field appearance="outline" class="full-width">\r
            <mat-label>Adresse Email</mat-label>\r
            <input matInput type="email" [(ngModel)]="formModel.email" placeholder="utilisateur@entreprise.com">\r
          </mat-form-field>\r
\r
          <mat-form-field appearance="outline" class="full-width">\r
            <mat-label>R\xF4le / Profil d'acc\xE8s</mat-label>\r
            <mat-select [(ngModel)]="formModel.role">\r
              @for (r of availableRoles; track r.code) {\r
                <mat-option [value]="r.code">{{ r.libelle }}</mat-option>\r
              }\r
            </mat-select>\r
          </mat-form-field>\r
\r
          @if (!editingUser) {\r
            <mat-form-field appearance="outline" class="full-width">\r
              <mat-label>Mot de passe initial</mat-label>\r
              <input matInput type="password" [(ngModel)]="formModel.password">\r
            </mat-form-field>\r
          }\r
        </div>\r
        <div class="modal-footer">\r
          <button mat-button (click)="closeModal()">Annuler</button>\r
          <button mat-raised-button color="primary" (click)="saveUser()">\r
            <mat-icon>save</mat-icon> Enregistrer le compte\r
          </button>\r
        </div>\r
      </div>\r
    </div>\r
  }\r
</div>\r
`, styles: ["/* src/app/features/profils/users-list/users-list.component.scss */\n.users-page {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.users-page .page-header {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 18px 24px;\n  color: var(--on-surface);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n  box-shadow: var(--shadow-card);\n}\n.users-page .page-header .ph-content {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.users-page .page-header .ph-content .ph-icon {\n  background: rgba(2, 132, 199, 0.12);\n  color: #0284c7;\n  padding: 10px;\n  border-radius: 10px;\n  display: flex;\n}\n.users-page .page-header .ph-content .ph-icon mat-icon {\n  font-size: 28px;\n  width: 28px;\n  height: 28px;\n}\n.users-page .page-header .ph-content h1 {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.users-page .page-header .ph-content p {\n  margin: 2px 0 0 0;\n  font-size: 13px;\n  color: var(--on-surface-3);\n}\n.users-page .page-header .btn-new {\n  background: #0284c7 !important;\n  color: #ffffff !important;\n  font-weight: 700;\n  border-radius: 8px;\n}\n.users-page .filter-card {\n  border-radius: 12px;\n  border: 1px solid #e2e8f0;\n  margin-bottom: 20px;\n}\n.users-page .filter-card mat-card-content {\n  padding: 16px !important;\n}\n.users-page .filter-card .filter-row {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.users-page .filter-card .filter-row .search-field {\n  flex: 1;\n  min-width: 260px;\n}\n.users-page .table-card {\n  border-radius: 12px;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.users-page .table-wrapper {\n  width: 100%;\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.users-page .custom-table {\n  width: 100%;\n  min-width: 850px;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n.users-page .custom-table thead tr {\n  background: #f8fafc;\n  border-bottom: 2px solid #cbd5e1;\n  color: #334155;\n  font-size: 11px;\n  text-transform: uppercase;\n}\n.users-page .custom-table thead tr th {\n  padding: 12px 14px;\n  text-align: left;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.users-page .custom-table tbody tr {\n  border-bottom: 1px solid #f1f5f9;\n  transition: background 0.15s;\n}\n.users-page .custom-table tbody tr:hover {\n  background: #f8fafc;\n}\n.users-page .custom-table tbody tr td {\n  padding: 10px 14px;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n.users-page .user-cell {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.users-page .user-cell .avatar {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  color: white;\n  font-weight: 800;\n  font-size: 13px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);\n}\n.users-page .role-chip {\n  font-weight: 700;\n  font-size: 11px;\n  padding: 3px 8px;\n  border-radius: 6px;\n  background: #f1f5f9;\n  color: #475569;\n}\n.users-page .role-chip.admin {\n  background: #fee2e2;\n  color: #991b1b;\n}\n.users-page .role-chip.drh {\n  background: #dbeafe;\n  color: #1e40af;\n}\n.users-page .role-chip.rh {\n  background: #e0f2fe;\n  color: #0369a1;\n}\n.users-page .role-chip.paie {\n  background: #dcfce7;\n  color: #166534;\n}\n.users-page .role-chip.compta {\n  background: #fef3c7;\n  color: #92400e;\n}\n.users-page .role-chip.validateur {\n  background: #f3e8ff;\n  color: #6b21a8;\n}\n.users-page .role-chip.employe {\n  background: #f1f5f9;\n  color: #334155;\n}\n.users-page .status-chip {\n  font-size: 11px;\n  font-weight: 700;\n  padding: 3px 10px;\n  border-radius: 12px;\n}\n.users-page .status-chip.active {\n  background: #dcfce7;\n  color: #15803d;\n}\n.users-page .status-chip.inactive {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.users-page .action-btns {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  white-space: nowrap;\n}\n.users-page .action-btns button {\n  width: 32px !important;\n  height: 32px !important;\n  line-height: 32px !important;\n  padding: 0 !important;\n}\n.users-page .action-btns button mat-icon {\n  font-size: 18px !important;\n  width: 18px !important;\n  height: 18px !important;\n}\n.users-page .modal-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n  padding: 20px;\n}\n.users-page .modal-container {\n  background: white;\n  border-radius: 12px;\n  max-width: 580px;\n  width: 100%;\n  padding: 24px;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n.users-page .modal-container .modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 2px solid #0060B3;\n  padding-bottom: 12px;\n  margin-bottom: 20px;\n}\n.users-page .modal-container .modal-header h2 {\n  margin: 0;\n  color: #0060B3;\n  font-size: 18px;\n  font-weight: 700;\n}\n.users-page .modal-container .modal-body {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.users-page .modal-container .modal-body .form-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}\n.users-page .modal-container .modal-body .full-width {\n  width: 100%;\n}\n.users-page .modal-container .modal-footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  margin-top: 20px;\n  padding-top: 16px;\n  border-top: 1px solid #e2e8f0;\n}\n/*# sourceMappingURL=users-list.component.css.map */\n"] }]
  }], () => [{ type: UtilisateurService }, { type: RoleService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UsersListComponent, { className: "UsersListComponent", filePath: "src/app/features/profils/users-list/users-list.component.ts", lineNumber: 25 });
})();

// src/app/features/profils/manuel-utilisateur/guide-data.ts
var GUIDE_CHAPTERS = [
  // =========================================================================
  // CHAPITRE 1 : INTRODUCTION & PRÉSENTATION DU SYSTÈME SIRH
  // =========================================================================
  {
    id: "ch1-introduction",
    number: "01",
    title: "Chapitre 1 : Introduction & Pr\xE9sentation G\xE9n\xE9rale du SIRH",
    category: "Vue d'ensemble",
    summary: "Pr\xE9sentation de la solution int\xE9gr\xE9e de gestion des ressources humaines et de la paie de la Banque Postale du Burkina Faso (BPBF).",
    accessPath: "Accueil G\xE9n\xE9ral > Tableau de Bord Principal",
    subsections: [
      {
        title: "1.1 Contexte, Objectifs & Architecture",
        accessPath: "Barre de navigation principale",
        description: "Le SIRH BPBF est une plateforme Full-Web hautement s\xE9curis\xE9e qui unifie l'ensemble des processus RH et paie.",
        points: [
          "Solution Full-Web moderne accessible via intranet bancaire s\xE9curis\xE9 sur tout navigateur moderne sans installation locale.",
          "Architecture en 3 tiers \xE9tanche : Frontend Angular 17+ r\xE9actif, API REST Spring Boot 3.2 avec contr\xF4les stricts de s\xE9curit\xE9, et Base de donn\xE9es relationnelle PostgreSQL 15.",
          "Conformit\xE9 r\xE9glementaire totale : Int\xE8gre le Code du Travail burkinab\xE8, la Convention Collective des Banques et \xC9tablissements Financiers, et les nouvelles directives fiscales (bar\xE8me progressif IUTS 2024, cotisations CNSS 5.5% et 16%, FSP 1%)."
        ]
      },
      {
        title: "1.2 Principes directeurs d'utilisation",
        points: [
          "Gestion ax\xE9e sur les Fiches de Poste : Chaque employ\xE9 est rattach\xE9 \xE0 un emploi-rep\xE8re et \xE0 un poste budg\xE9t\xE9 dans l'organigramme.",
          "Tra\xE7abilit\xE9 et Audit Int\xE9gral : Toute modification de salaire, cr\xE9ation d'employ\xE9, validation de cong\xE9 ou cl\xF4ture de paie est trac\xE9e avec horodatage et identifiant de l'auteur.",
          "Interdiction absolue des donn\xE9es hardcod\xE9es : Toutes les donn\xE9es de paie, classifications et r\xE9f\xE9rentiels proviennent directement et exclusivement de PostgreSQL via Spring Boot."
        ]
      }
    ],
    workflow: [
      "1. Authentification s\xE9curis\xE9e par identifiant et mot de passe chiffr\xE9",
      "2. Contr\xF4le automatique du profil et chargement des habilitations autoris\xE9es",
      "3. Acc\xE8s au tableau de bord centralis\xE9 et s\xE9lection du module de travail",
      "4. Ex\xE9cution des op\xE9rations avec validation m\xE9tier c\xF4t\xE9 serveur",
      "5. D\xE9connexion explicite ou verrouillage automatique apr\xE8s inactivit\xE9"
    ],
    tips: "Le guide utilisateur constitue le document de r\xE9f\xE9rence officiel. Il est structur\xE9 \xE0 l'image exacte de l'application pour une prise en main imm\xE9diate par tous les agents."
  },
  // =========================================================================
  // CHAPITRE 2 : NOUVEAUTÉS & ARCHITECTURE MODULAIRE
  // =========================================================================
  {
    id: "ch2-nouveautes",
    number: "02",
    title: "Chapitre 2 : Nouveaut\xE9s & Architecture Modulaire",
    category: "Architecture",
    summary: "\xC9volutions majeures apport\xE9es \xE0 la plateforme SIRH, conteneurisation applicative et nouveaux modules.",
    accessPath: "Syst\xE8me & Plateforme",
    subsections: [
      {
        title: "2.1 Plateforme Applicative & S\xE9curit\xE9",
        points: [
          "Authentification centralis\xE9e avec jetons JWT (JSON Web Tokens) hautement s\xE9curis\xE9s et gestion de session active.",
          "Contr\xF4le d'acc\xE8s bas\xE9 sur les r\xF4les (RBAC) avec matrice d'habilitations granulaire par \xE9cran et par action (Lecture, Cr\xE9ation, Modification, Suppression, Validation, Cl\xF4ture).",
          "Journalisation continue des op\xE9rations sensibles c\xF4t\xE9 serveur (audit trail pour les modifications salariales et cl\xF4tures de paie)."
        ]
      },
      {
        title: "2.2 Nouveaux Modules & Fonctionnalit\xE9s Cl\xE9s",
        points: [
          "Gestion des Carri\xE8res & \xC9valuations : Saisie num\xE9rique des notes de performance, calcul automatis\xE9 des propositions d'avancement d'\xE9chelon (1 \xE0 15).",
          "Gestion Sociale & Prises en Charge M\xE9dicales : \xC9mission des bons de soins, facturation des prestataires m\xE9dicaux et quote-part mutuelle.",
          "Suivi dynamique des Cong\xE9s : Le cong\xE9 est d\xE9sormais constat\xE9 au fur et \xE0 mesure \xE0 chaque paie ordinaire (2.5 jours ouvrables par mois), avec gestion transparente du reliquat multi-exercices.",
          "Base m\xE9dia num\xE9rique : Num\xE9risation et rattachement direct des pi\xE8ces d'identit\xE9, contrats sign\xE9s et dipl\xF4mes certifi\xE9s \xE0 la fiche collaborateur."
        ]
      }
    ],
    workflow: [
      "Connexion -> Contr\xF4le des droits d'acc\xE8s -> Attribution des r\xF4les -> Audit des actions"
    ],
    tips: "Toutes les donn\xE9es m\xE9tier proviennent directement de PostgreSQL. Aucune information sensible n'est stock\xE9e en dur sur le poste client."
  },
  // =========================================================================
  // CHAPITRE 3 : NOTIONS DE BASE & ERGONOMIE DE NAVIGATION
  // =========================================================================
  {
    id: "ch3-notions-base",
    number: "03",
    title: "Chapitre 3 : Notions de Base & Ergonomie de Navigation",
    category: "Interface & Prise en main",
    summary: "Ma\xEEtrise compl\xE8te des composants de l'interface utilisateur : barres d'outils, menus, listes dynamiques, filtres et modales.",
    accessPath: "Tous les \xE9crans de l'application",
    subsections: [
      {
        title: "3.1 Connexion au Logiciel & Gestion de Session",
        accessPath: "\xC9cran de Connexion (/login)",
        description: "Proc\xE9dure d'authentification initiale et s\xE9curisation du poste de travail.",
        points: [
          "L'acc\xE8s s'effectue via un navigateur web moderne \xE0 l'adresse intranet officielle : http://45.14.194.123:8090 (ou nom de domaine interne de la banque).",
          "Saisissez votre identifiant unique (ex: matricule ou login DSI) et votre mot de passe.",
          "Apr\xE8s 3 tentatives infructueuses, le compte est temporairement bloqu\xE9 pendant 15 minutes pour pr\xE9venir les attaques par force brute.",
          "D\xE9connexion : Toujours cliquer sur le bouton de d\xE9connexion dans le coin sup\xE9rieur droit avant de quitter votre poste."
        ],
        steps: [
          "1. Ouvrir le navigateur et entrer l'URL du SIRH",
          "2. Renseigner l'identifiant dans le champ \xAB Identifiant / Matricule \xBB",
          "3. Saisir le mot de passe dans le champ s\xE9curis\xE9",
          "4. Cliquer sur le bouton \xAB Se Connecter \xBB",
          "5. Le syst\xE8me charge votre profil et vous redirige vers votre tableau de bord selon vos habilitations"
        ]
      },
      {
        title: "3.2 Syst\xE8me de Navigation Modulaire",
        points: [
          "Barre sup\xE9rieure des Modules : Permet de basculer instantan\xE9ment entre Gest Admin, PAIE, CONG\xC9S, Param\xE8tres g\xE9n\xE9raux et PROFIL.",
          "Barre de titre & Espace utilisateur : Affiche le nom de l'utilisateur connect\xE9, son r\xF4le actif, les alertes et le bouton de profil.",
          "Tiroir lat\xE9ral de navigation : Pr\xE9sente l'arborescence d\xE9taill\xE9e des sous-menus du module s\xE9lectionn\xE9 (ex : pour la Paie : Bulletins, \xC9l\xE9ments de salaire, D\xE9clarations, \xC9tats de synth\xE8se).",
          "Espace de travail principal : Zone centrale d\xE9di\xE9e \xE0 l'affichage des tableaux de donn\xE9es, formulaires et indicateurs graphiques."
        ]
      },
      {
        title: "3.3 Utilisation des Tableaux de Donn\xE9es, Recherche & Filtres",
        points: [
          "Recherche instantan\xE9e : Saisissez un mot-cl\xE9 (nom, matricule, libell\xE9) dans le champ de recherche pour filtrer le tableau en temps r\xE9el sans rechargement de page.",
          "Filtres d\xE9roulants : Utilisez les listes de filtre (Direction, P\xE9riode de paie, Banque, Statut) pour isoler les enregistrements cibl\xE9s.",
          "Tri des colonnes : Cliquez sur l'en-t\xEAte de n'importe quelle colonne pour trier par ordre alphab\xE9tique croissant ou d\xE9croissant.",
          "Pagination : Choisissez le nombre de lignes par page (10, 25, 50, 100) et utilisez les fl\xE8ches de navigation pour parcourir les r\xE9sultats."
        ],
        steps: [
          "1. Cliquer dans la bo\xEEte \xAB Recherche rapide \xBB et taper au moins 2 lettres",
          "2. S\xE9lectionner une Direction ou une Session dans les listes d\xE9roulantes de filtre",
          "3. Cliquer sur l'en-t\xEAte de colonne \xAB Matricule \xBB ou \xAB Nom \xBB pour ordonner la liste",
          "4. Naviguer entre les pages via les boutons Pr\xE9c\xE9dent / Suivant en bas de tableau"
        ]
      }
    ],
    workflow: [
      "1. S\xE9lectionner le module dans la barre sup\xE9rieure",
      "2. Cliquer sur le sous-menu d\xE9sir\xE9 dans le panneau lat\xE9ral gauche",
      "3. Appliquer les filtres pour affiner l'affichage",
      "4. Effectuer les op\xE9rations de consultation, cr\xE9ation, modification ou export"
    ],
    tips: "Le design de l'application a \xE9t\xE9 \xE9pur\xE9 pour supprimer les ic\xF4nes superflues \xE0 l'int\xE9rieur des pages, garantissant une lisibilit\xE9 maximale des donn\xE9es financi\xE8res et administratives."
  },
  // =========================================================================
  // CHAPITRE 4 : MODULE ACCUEIL & ESPACE COLLABORATEUR (« MON ESPACE »)
  // =========================================================================
  {
    id: "ch4-accueil-espace",
    number: "04",
    title: "Chapitre 4 : Module Accueil & Espace Collaborateur (\xAB Mon Espace \xBB)",
    category: "Portail Employ\xE9",
    summary: "Proc\xE9dures d\xE9taill\xE9es pour les demandes self-service : cong\xE9s, autorisations d'absence, ordres de mission, avances et pr\xEAts, prises en charge de sant\xE9.",
    accessPath: "Barre Sup\xE9rieure > Mon Espace (ou Module CONG\xC9S)",
    subsections: [
      {
        title: "4.1 Gestion des Demandes de Cong\xE9 & Absences",
        accessPath: "Mon Espace > Mes Cong\xE9s & Absences > Bouton \xAB Nouvelle Demande \xBB",
        description: "Proc\xE9dure de soumission d'une demande de cong\xE9 annuel, cong\xE9 de maternit\xE9 ou permission exceptionnelle.",
        fields: [
          { name: "Type de cong\xE9", type: "S\xE9lection", required: true, description: "Cong\xE9 annuel, Permission exceptionnelle, Maternit\xE9/Paternit\xE9, Maladie" },
          { name: "Date de d\xE9but", type: "Date", required: true, description: "Premier jour ch\xF4m\xE9 de l'absence" },
          { name: "Date de reprise", type: "Date", required: true, description: "Jour effectif du retour au poste de travail" },
          { name: "Motif / Justificatif", type: "Texte / Fichier PDF", required: false, description: "Motif et t\xE9l\xE9versement du justificatif en cas de permission l\xE9gale" }
        ],
        steps: [
          "1. Se connecter \xE0 son compte employ\xE9 et cliquer sur \xAB Mon Espace \xBB dans la barre sup\xE9rieure",
          "2. Acc\xE9der \xE0 l'onglet \xAB Cong\xE9s & Absences \xBB et v\xE9rifier son solde de cong\xE9s acquis affich\xE9 en haut de page",
          "3. Cliquer sur le bouton \xAB Nouvelle Demande \xBB",
          "4. Choisir la nature du cong\xE9 dans le menu d\xE9roulant",
          "5. S\xE9lectionner la date de d\xE9but et la date de reprise dans le calendrier interactif. Le syst\xE8me calcule automatiquement le nombre de jours ouvrables d\xE9compt\xE9s",
          "6. Joindre un document justificatif si n\xE9cessaire (ex : certificat m\xE9dical ou acte d'\xE9tat civil)",
          "7. Cliquer sur \xAB Soumettre pour validation \xBB"
        ],
        systemBehavior: "Le syst\xE8me bloque la soumission si le nombre de jours demand\xE9s exc\xE8de le solde disponible. Une notification automatique est envoy\xE9e au sup\xE9rieur hi\xE9rarchique direct (N+1) pour avis.",
        controls: [
          "V\xE9rifier que le solde de cong\xE9s acquis est sup\xE9rieur ou \xE9gal au nombre de jours sollicit\xE9s.",
          "Respecter le d\xE9lai de pr\xE9venance l\xE9gal d'au moins 15 jours avant la date de d\xE9part souhait\xE9e."
        ]
      },
      {
        title: "4.2 Gestion des Ordres de Mission & D\xE9placements",
        accessPath: "Mon Espace > Mes Missions > Bouton \xAB Cr\xE9er une Mission \xBB",
        description: "\xC9mission d'une demande d'ordre de mission avec calcul des frais de d\xE9placement.",
        fields: [
          { name: "Objet de la mission", type: "Texte", required: true, description: "Motif pr\xE9cis du d\xE9placement professionnel" },
          { name: "Destination / Zone", type: "S\xE9lection", required: true, description: "Zone A (National), Zone B (Sous-r\xE9gion UEMOA), Zone C (International)" },
          { name: "Date de d\xE9part & retour", type: "Date", required: true, description: "P\xE9riode exacte de la mission" },
          { name: "Moyen de transport", type: "S\xE9lection", required: true, description: "V\xE9hicule de pool BPBF, V\xE9hicule personnel, Avion, Transport en commun" }
        ],
        steps: [
          "1. Ouvrir le formulaire de mission en cliquant sur \xAB Cr\xE9er une Mission \xBB",
          "2. Renseigner l'objet pr\xE9cis (ex : \xAB Audit trimestriel Agence Bobo-Dioulasso \xBB)",
          "3. S\xE9lectionner la zone g\xE9ographique de destination",
          "4. Renseigner les dates de d\xE9but et de fin. Le syst\xE8me calcule le nombre de nuit\xE9es et de perdiems applicables",
          "5. Cliquer sur \xAB Enregistrer et Transmettre pour Approbation \xBB",
          "6. D\xE8s signature \xE9lectronique par la Direction G\xE9n\xE9rale, cliquer sur \xAB T\xE9l\xE9charger l'Ordre de Mission (PDF) \xBB"
        ],
        systemBehavior: "Le syst\xE8me applique automatiquement le bar\xE8me d'indemnit\xE9s journali\xE8res (perdiems) selon le Groupe salarial (Groupe I, II, III) et la zone."
      },
      {
        title: "4.3 Demandes d'Avances & Pr\xEAts au Personnel",
        accessPath: "Mon Espace > Avances & Pr\xEAts > Bouton \xAB Simuler un Pr\xEAt \xBB",
        description: "Demande d'avance de quinzaine ou de pr\xEAt avec v\xE9rification de la quotit\xE9 cessible.",
        fields: [
          { name: "Type d'aide", type: "S\xE9lection", required: true, description: "Avance sur salaire (1 mois), Pr\xEAt \xE9quipement (12-24 mois), Pr\xEAt scolaire" },
          { name: "Montant demand\xE9", type: "Num\xE9rique (FCFA)", required: true, description: "Montant total souhait\xE9" },
          { name: "Dur\xE9e de remboursement", type: "Entier (Mois)", required: true, description: "Nombre d'\xE9ch\xE9ances mensuelles" }
        ],
        steps: [
          "1. Cliquer sur \xAB Simuler un Pr\xEAt \xBB",
          "2. S\xE9lectionner le type de financement et entrer le montant souhait\xE9",
          "3. Choisir le nombre d'\xE9ch\xE9ances de remboursement",
          "4. Consulter la simulation : le syst\xE8me calcule le montant de la mensualit\xE9 et le taux d'endettement",
          "5. V\xE9rifier que la mensualit\xE9 ne d\xE9passe pas 33% du salaire net moyen",
          "6. Cliquer sur \xAB Soumettre la Demande \xBB"
        ],
        systemBehavior: "Si la mensualit\xE9 d\xE9passe la quotit\xE9 cessible l\xE9gale de 33%, le syst\xE8me affiche une alerte rouge bloquante. D\xE8s approbation DRH/DG, le calendrier d'\xE9ch\xE9ances est inject\xE9 dans les pr\xE9comptes de la paie mensuelle."
      },
      {
        title: "4.4 Prises en Charge M\xE9dicales & Mutuelle de Sant\xE9",
        accessPath: "Mon Espace > Prises en Charge > Bouton \xAB Nouveau Bon de Soins \xBB",
        description: "D\xE9livrance d'un bon de prise en charge aupr\xE8s du r\xE9seau m\xE9dical conventionn\xE9.",
        fields: [
          { name: "B\xE9n\xE9ficiaire", type: "S\xE9lection", required: true, description: "Agent, Conjoint d\xE9clar\xE9, Enfant \xE0 charge" },
          { name: "Prestataire conventionn\xE9", type: "S\xE9lection", required: true, description: "Clinique, H\xF4pital, Pharmacie, Laboratoire agr\xE9\xE9" },
          { name: "Nature des soins", type: "S\xE9lection", required: true, description: "Consultation, Analyses m\xE9dicales, Pharmacie, Hospitalisation" }
        ],
        steps: [
          "1. Cliquer sur \xAB Nouveau Bon de Soins \xBB",
          "2. S\xE9lectionner le b\xE9n\xE9ficiaire (collaborateur ou ayant droit)",
          "3. Choisir l'\xE9tablissement de sant\xE9 conventionn\xE9 dans la liste d\xE9roulante",
          "4. Indiquer la nature de l'acte m\xE9dical",
          "5. Valider et t\xE9l\xE9charger le bon de prise en charge au format PDF pour le pr\xE9senter au centre de soins"
        ]
      }
    ],
    workflow: [
      "D\xE9p\xF4t de la demande en ligne -> Notification au responsable hi\xE9rarchique -> Approbation N+1 -> Validation DRH -> Int\xE9gration automatique en paie / comptabilit\xE9"
    ],
    tips: "Chaque collaborateur peut suivre en temps r\xE9el le statut d'avancement de ses demandes (En attente, Approuv\xE9, Rejet\xE9) depuis son tableau de bord personnel."
  },
  // =========================================================================
  // CHAPITRE 5 : MODULE ADMINISTRATION & GESTION ADMINISTRATIVE DU PERSONNEL
  // =========================================================================
  {
    id: "ch5-administration",
    number: "05",
    title: "Chapitre 5 : Module Administration & Gestion Administrative du Personnel",
    category: "Ressources Humaines",
    summary: "Proc\xE9dures compl\xE8tes pour la cr\xE9ation et mise \xE0 jour des fiches collaborateurs 360\xB0, affectations, mutations, gestion des contrats et d\xE9parts.",
    accessPath: "Barre Sup\xE9rieure > Gest Admin > Sous-menu Employ\xE9s",
    subsections: [
      {
        title: "5.1 Cr\xE9ation d'une Nouvelle Fiche Collaborateur (\xC9tape par \xC9tape)",
        accessPath: "Gest Admin > Employ\xE9s > Bouton \xAB Nouvel Employ\xE9 \xBB",
        description: "Enregistrement complet d'un nouvel agent dans la base de donn\xE9es PostgreSQL.",
        fields: [
          { name: "Matricule", type: "Texte unique (ex: BP0042)", required: true, description: "Identifiant bancaire unique et immuable" },
          { name: "Nom & Pr\xE9nom", type: "Texte", required: true, description: "Identit\xE9 officielle conforme \xE0 la CNIB" },
          { name: "Date & Lieu de naissance", type: "Date & Texte", required: true, description: "\xC9tat civil complet" },
          { name: "N\xB0 CNSS", type: "Texte", required: true, description: "Num\xE9ro d'affiliation \xE0 la Caisse Nationale de S\xE9curit\xE9 Sociale" },
          { name: "NIP / CNIB", type: "Texte", required: true, description: "Num\xE9ro de la carte nationale d'identit\xE9 ou passeport" },
          { name: "Situation matrimoniale", type: "S\xE9lection", required: true, description: "C\xE9libataire, Mari\xE9(e), Divorc\xE9(e), Veuf(ve)" },
          { name: "Nombre d'enfants \xE0 charge", type: "Entier (0 \xE0 10)", required: true, description: "Nombre d'enfants d\xE9clar\xE9s pour d\xE9ductions fiscales IUTS" },
          { name: "Direction & Service", type: "S\xE9lection", required: true, description: "Rattachement organisationnel dans l'organigramme" },
          { name: "Poste / Emploi", type: "S\xE9lection", required: true, description: "Intitul\xE9 du poste occup\xE9" },
          { name: "Groupe Salarial", type: "S\xE9lection", required: true, description: "Groupe I (Ex\xE9cution), Groupe II (Ma\xEEtrise), Groupe III (Cadres)" },
          { name: "Cat\xE9gorie Professionnelle", type: "S\xE9lection", required: true, description: "1 \xE0 7 (Groupe I) ou I \xE0 VIII (Groupes II et III)" },
          { name: "\xC9chelon", type: "S\xE9lection (1 \xE0 15)", required: true, description: "Niveau d'avancement indiciaire" },
          { name: "Banque & Compte RIB", type: "Texte / S\xE9lecteur", required: true, description: "Code Banque, Code Guichet, N\xB0 Compte, Cl\xE9 RIB" }
        ],
        steps: [
          "1. Ouvrir le menu \xAB Gest Admin \xBB puis cliquer sur le sous-menu \xAB Employ\xE9s \xBB",
          "2. Cliquer sur le bouton \xAB Nouvel Employ\xE9 \xBB pour ouvrir la fen\xEAtre de saisie",
          "3. Onglet 1 - \xC9tat Civil : Renseigner le matricule, nom, pr\xE9nom, sexe, date de naissance, NIP et num\xE9ro CNSS",
          "4. Onglet 2 - Situation Familiale : S\xE9lectionner le statut matrimonial et saisir le nombre d'enfants \xE0 charge",
          "5. Onglet 3 - Affectation : S\xE9lectionner la Direction, le D\xE9partement, le Service ou l'Agence bancaire d'affectation",
          "6. Onglet 4 - Classification Salariale : Choisir le Groupe (I, II ou III), la Cat\xE9gorie et l'\xC9chelon (1 \xE0 15). Le salaire de base indiciaire est automatiquement affich\xE9",
          "7. Onglet 5 - Domiciliation Bancaire : S\xE9lectionner la banque de virement et renseigner le RIB complet",
          "8. Onglet 6 - GED & Pi\xE8ces jointes : T\xE9l\xE9verser la copie de la CNIB, le contrat de travail sign\xE9 et le CV",
          "9. Cliquer sur \xAB Enregistrer l'Employ\xE9 \xBB. Le syst\xE8me persiste les donn\xE9es dans PostgreSQL et g\xE9n\xE8re la fiche individuelle"
        ],
        systemBehavior: "Le syst\xE8me contr\xF4le l'unicit\xE9 du matricule et du num\xE9ro CNSS. Tout doublon entra\xEEne un rejet imm\xE9diat avec message d'erreur explicite.",
        controls: [
          "V\xE9rifier que le format du RIB bancaire comporte l'ensemble des chiffres r\xE9glementaires.",
          "S'assurer que les enfants d\xE9clar\xE9s sont \xE2g\xE9s de moins de 21 ans (ou justifient d'un certificat de scolarit\xE9 valide)."
        ]
      },
      {
        title: "5.2 Gestion des Mouvements : Affectation, Mutation & Promotion",
        accessPath: "Gest Admin > Mouvements du Personnel > Bouton \xAB Nouveau Mouvement \xBB",
        description: "Enregistrement d'un changement de service, de poste ou d'agence bancaire.",
        steps: [
          "1. S\xE9lectionner l'employ\xE9 concern\xE9 dans le tableau de recherche",
          "2. Cliquer sur le bouton \xAB Enregistrer un Mouvement \xBB",
          "3. Choisir la nature du mouvement : Mutation g\xE9ographique, Nomination \xE0 un poste de responsabilit\xE9, ou Int\xE9rim",
          "4. S\xE9lectionner la nouvelle structure de rattachement et la nouvelle fonction",
          "5. Indiquer la date de prise d'effet officielle et joindre la d\xE9cision ou note de service de nomination",
          "6. Valider l'op\xE9ration : la fiche employ\xE9 est mise \xE0 jour avec conservation de l'historique chronologique complet"
        ]
      },
      {
        title: "5.3 Cessation de Service, D\xE9parts & Solde de Tout Compte",
        accessPath: "Gest Admin > D\xE9parts & Radiations > Bouton \xAB Cl\xF4turer Dossier \xBB",
        description: "Gestion administrative d'une fin de contrat, d\xE9mission, retraite ou licenciement.",
        steps: [
          "1. Rechercher l'employ\xE9 concern\xE9 dans la liste active",
          "2. Cliquer sur \xAB D\xE9clarer un D\xE9part \xBB",
          "3. Choisir le motif : D\xE9mission, Fin de CDD, Retraite, Licenciement, D\xE9c\xE8s",
          "4. Saisir la date de fin effective de contrat et la date de remise du mat\xE9riel bancaire",
          "5. Le syst\xE8me calcule automatiquement l'indemnit\xE9 de d\xE9part, le prorata du 13\xE8me mois et l'indemnit\xE9 compensatrice de cong\xE9s pay\xE9s non consomm\xE9s",
          "6. Valider le d\xE9part : l'employ\xE9 passe au statut \xAB Inactif \xBB et ne sera plus int\xE9gr\xE9 dans les sessions de paie ult\xE9rieures"
        ]
      }
    ],
    workflow: [
      "1. Ouvrir le menu \xAB Gestion Administrative \xBB -> \xAB Employ\xE9s \xBB",
      "2. Cliquer sur \xAB Nouvel Employ\xE9 \xBB et renseigner l'\xE9tat civil et le matricule",
      "3. Assigner l'affectation organisationnelle (Direction, Service, Poste)",
      "4. S\xE9lectionner la Classification (Groupe, Cat\xE9gorie, \xC9chelon) -> Contr\xF4ler le salaire de base",
      "5. Renseigner les charges de famille et le compte bancaire RIB",
      "6. Enregistrer dans PostgreSQL"
    ],
    tips: "Le matricule employ\xE9 est unique et immuable. Il garantit la tra\xE7abilit\xE9 compl\xE8te de l'historique de paie et de carri\xE8re."
  },
  // =========================================================================
  // CHAPITRE 6 : MODULE CARRIÈRES, ÉVALUATIONS & PROMOTIONS
  // =========================================================================
  {
    id: "ch6-carrieres",
    number: "06",
    title: "Chapitre 6 : Module Carri\xE8res, \xC9valuations & Promotions",
    category: "Gestion des Talents",
    summary: "Proc\xE9dures de saisie des \xE9valuations annuelles, calcul automatique des propositions d'avancement d'\xE9chelon et validation des reclassements.",
    accessPath: "Barre Sup\xE9rieure > CARRI\xC8RES > Sous-menu Gestion des Carri\xE8res",
    subsections: [
      {
        title: "6.1 Saisie des Notations & Campagne d'\xC9valuation Annuelle",
        accessPath: "Carri\xE8res > Notations & \xC9valuations > Bouton \xAB Nouvelle \xC9valuation \xBB",
        description: "Enregistrement des notations annuelles chiffr\xE9es selon les 3 axes r\xE9glementaires de la Banque Postale (/20).",
        fields: [
          { name: "Collaborateur", type: "S\xE9lection", required: true, description: "Agent \xE9valu\xE9" },
          { name: "Exercice d'\xE9valuation", type: "Nombre", required: true, description: "Ann\xE9e de notation (ex: 2026)" },
          { name: "Atteinte des Objectifs (40%)", type: "Note / 20", required: true, description: "Performance op\xE9rationnelle et r\xE9sultats mesurables" },
          { name: "Comp\xE9tences & Rigueur (40%)", type: "Note / 20", required: true, description: "Expertise technique bancaire, conformit\xE9 et respect des proc\xE9dures" },
          { name: "Comportement & \xC9thique (20%)", type: "Note / 20", required: true, description: "Ponctualit\xE9, relation client et esprit d'\xE9quipe" },
          { name: "Note Globale", type: "Calcul\xE9e", required: false, description: "Moyenne pond\xE9r\xE9e automatique sur 20" },
          { name: "Appr\xE9ciation g\xE9n\xE9rale", type: "Texte", required: false, description: "Mention automatique (Excellent, Tr\xE8s Bien, Bien, Passable, Insuffisant) et recommandations" }
        ],
        steps: [
          "1. Ouvrir le module \xAB CARRI\xC8RES \xBB et cliquer sur le sous-menu \xAB Notations & \xC9valuations \xBB",
          "2. Cliquer sur le bouton \xAB Nouvelle \xC9valuation \xBB",
          "3. S\xE9lectionner le collaborateur \xE0 \xE9valuer parmi les agents de la banque",
          "4. Renseigner l'exercice (ex: 2026) et les 3 notes (/20)",
          "5. Constater le calcul en temps r\xE9el de la Note Globale et de l'Appr\xE9ciation sugg\xE9r\xE9e",
          "6. Ajuster les observations manag\xE9riales puis cliquer sur \xAB Enregistrer & Valider la Notation \xBB",
          "7. La note est sauvegard\xE9e dans PostgreSQL et historis\xE9e dans le tableau des performances"
        ]
      },
      {
        title: "6.2 Moteur d'Avancements d'\xC9chelon Automatique (E01 \xE0 E15)",
        accessPath: "Carri\xE8res > Avancements d'\xC9chelon > Bouton \xAB G\xE9n\xE9rer les Propositions d'Avancement \xBB",
        description: "Moteur de promotion automatique identifiant les agents ayant 2 ans d'anciennet\xE9 dans leur \xE9chelon et calculant le passage \xE0 l'\xE9chelon n+1.",
        steps: [
          "1. Acc\xE9der au sous-menu \xAB Avancements d'\xC9chelon \xBB",
          "2. Cliquer sur le bouton \xAB G\xE9n\xE9rer les Propositions d'Avancement \xBB",
          "3. Le syst\xE8me analyse les agents actifs dans PostgreSQL, extrait leur \xE9chelon actuel (E01 \xE0 E14) et calcule l'\xE9chelon sup\xE9rieur (n+1)",
          "4. Le comparatif affiche : Matricule, Nom, Fonction, \xC9chelon Actuel vs Propos\xE9, Salaire de Base Actuel, Nouveau Salaire de Base et Gain Mensuel Brut (+ FCFA)",
          "5. Cliquer sur le bouton \xAB Valider \xBB en regard de chaque agent propos\xE9",
          "6. Le syst\xE8me met \xE0 jour instantan\xE9ment dans PostgreSQL le profil de l'employ\xE9, son \xE9chelon, sa grille indiciaire et sa fiche salariale",
          "7. Les prochains bulletins de paie calcul\xE9s int\xE8grent imm\xE9diatement le nouveau salaire de base sans ressaisie"
        ],
        systemBehavior: "Mise \xE0 jour transactionnelle directe dans PostgreSQL : Employee.echelonObj, SituationSalariale et recalcul imm\xE9diat du salaire net via InformationSalarialeCalculService."
      },
      {
        title: "6.3 Reclassements Professionnels & Changement de Cat\xE9gorie",
        accessPath: "Carri\xE8res > Reclassements & Qualifications > Bouton \xAB Nouveau Reclassement \xBB",
        description: "Changement de classe, cat\xE9gorie et grade suite \xE0 obtention de dipl\xF4me homologu\xE9 (ITB/Master) ou concours interne.",
        steps: [
          "1. Acc\xE9der au sous-menu \xAB Reclassements & Qualifications \xBB",
          "2. Cliquer sur \xAB Nouveau Reclassement \xBB",
          "3. S\xE9lectionner le collaborateur : sa situation actuelle (cat\xE9gorie, grade, \xE9chelon, salaire base) s'affiche automatiquement",
          "4. Renseigner la R\xE9f\xE9rence de l'Acte D\xE9cisionnel (ex: D\xE9cision N\xB0 2026/012/DG/DRH) et le motif",
          "5. Choisir la nouvelle cat\xE9gorie, le nouveau grade et le nouvel \xE9chelon",
          "6. Cliquer sur \xAB Valider & Appliquer le Reclassement \xBB : les donn\xE9es sont act\xE9es et appliqu\xE9es en base"
        ]
      },
      {
        title: "6.4 Plan & Catalogue de Formations Continues",
        accessPath: "Carri\xE8res > Plan de Formation > Bouton \xAB Planifier une Session \xBB",
        description: "Gestion du catalogue des modules d'apprentissage bancaire et suivi des sessions pr\xE9sentielles / e-learning.",
        steps: [
          "1. Consulter les modules dans l'onglet \xAB Catalogue des Modules \xBB ou en cr\xE9er de nouveaux",
          "2. Dans l'onglet \xAB Sessions Planifi\xE9es \xBB, cliquer sur \xAB Planifier une Session \xBB",
          "3. Choisir le th\xE8me, la date de session et le nombre de participants pr\xE9vus",
          "4. Confirmer, cl\xF4turer ou annuler les sessions selon leur d\xE9roulement"
        ]
      }
    ],
    workflow: [
      "Campagne annuelle d'\xE9valuation (/20) -> G\xE9n\xE9ration automatique des propositions d'\xE9chelons (E01-E15) -> Validation DRH/DG -> Prise en compte instantan\xE9e en paie sans ressaisie -> Suivi des reclassements et formations"
    ],
    tips: "Le module est 100% interconnect\xE9 avec PostgreSQL : valider un avancement met automatiquement \xE0 jour la paie et les cotisations CNSS/IUTS."
  },
  // =========================================================================
  // CHAPITRE 7 : MODULE FORMATION & DÉVELOPPEMENT DES COMPÉTENCES
  // =========================================================================
  {
    id: "ch7-formation",
    number: "07",
    title: "Chapitre 7 : Module Formation & D\xE9veloppement des Comp\xE9tences",
    category: "D\xE9veloppement RH",
    summary: "Plan de formation pluriannuel, gestion des sessions, suivi des prestataires et engagements budg\xE9taires.",
    accessPath: "Barre Sup\xE9rieure > Gest Admin > Sous-menu Formation",
    subsections: [
      {
        title: "7.1 Param\xE9trage des Th\xE8mes & Organismes de Formation",
        accessPath: "Formation > Param\xE8tres > Th\xE8mes & Prestataires",
        description: "Gestion du catalogue des th\xE8mes de formation et des prestataires agr\xE9\xE9s.",
        steps: [
          "1. Cliquer sur \xAB Th\xE8mes de Formation \xBB puis sur \xAB Nouveau Th\xE8me \xBB",
          "2. Renseigner le domaine de comp\xE9tence (Conformit\xE9 bancaire, Risque de cr\xE9dit, Audit, Informatique, Accueil client)",
          "3. Indiquer les pr\xE9requis et objectifs p\xE9dagogiques vis\xE9s",
          "4. Enregistrer dans la base de donn\xE9es",
          "5. D\xE9clarer les cabinets et organismes formateurs agr\xE9\xE9s dans le sous-menu \xAB Prestataires de Formation \xBB"
        ]
      },
      {
        title: "7.2 Organisation d'une Session de Formation & Inscription des Participants",
        accessPath: "Formation > Sessions > Bouton \xAB Nouvelle Session \xBB",
        description: "Planification d'une session de formation collective ou individuelle.",
        steps: [
          "1. Cliquer sur \xAB Nouvelle Session de Formation \xBB",
          "2. S\xE9lectionner le th\xE8me et l'organisme formateur",
          "3. Renseigner les dates de d\xE9but, de fin, le lieu et le co\xFBt total hors taxes",
          "4. Ajouter les agents participants depuis la liste des employ\xE9s actifs",
          "5. V\xE9rifier la disponibilit\xE9 des agents sur la p\xE9riode (contr\xF4le des cong\xE9s pos\xE9s)",
          "6. Valider l'inscription et g\xE9n\xE9rer les convocations individuelles de stage",
          "7. \xC0 l'issue de la formation, enregistrer la cl\xF4ture de la session et t\xE9l\xE9verser les attestations d\xE9livr\xE9es"
        ]
      }
    ],
    workflow: [
      "Recensement des besoins -> \xC9laboration du plan annuel de formation -> Approbation budg\xE9taire -> D\xE9roulement des sessions -> \xC9valuation et cl\xF4ture"
    ],
    tips: "Le suivi rigoureux du budget de formation permet de maximiser le retour sur investissement des comp\xE9tences cl\xE9s de la Banque."
  },
  // =========================================================================
  // CHAPITRE 8 : MODULE SOCIAL, SANTÉ & ŒUVRES SOCIALES
  // =========================================================================
  {
    id: "ch8-social",
    number: "08",
    title: "Chapitre 8 : Module Social, Sant\xE9 & \u0152uvres Sociales",
    category: "Protection Sociale",
    summary: "Gestion des prestations sociales, des conventions m\xE9dicales, de la mutuelle du personnel et des secours.",
    accessPath: "Barre Sup\xE9rieure > Gest Admin > Sous-menu Social",
    subsections: [
      {
        title: "8.1 R\xE9seau de Soins Conventionn\xE9 & Bar\xE8mes de Prise en Charge",
        points: [
          "Enregistrement des cliniques, h\xF4pitaux, centres d'imagerie m\xE9dicale, laboratoires et officines pharmaceutiques partenaires de la BPBF.",
          "Plafonds de prise en charge : D\xE9finition des taux de couverture (ex : 80% pris en charge par l'assurance/mutuelle BPBF, 20% ticket mod\xE9rateur employ\xE9)."
        ]
      },
      {
        title: "8.2 Traitement des Factures M\xE9dicales & Retenues en Paie",
        accessPath: "Social > Traitements Mensuels Factures",
        description: "Rapprochement des factures envoy\xE9es par les cliniques et pharmacies partenaires.",
        steps: [
          "1. Ouvrir l'\xE9cran \xAB Factures M\xE9dicales \xBB et cliquer sur \xAB Nouveau Bordereau Prestataire \xBB",
          "2. S\xE9lectionner le prestataire de sant\xE9 et saisir le num\xE9ro de facture ainsi que la p\xE9riode",
          "3. Renseigner les montants totaux factur\xE9s",
          "4. Associer chaque ligne de facture au bon de prise en charge \xE9mis initialement dans l'application",
          "5. Le syst\xE8me calcule la part revenant \xE0 la Banque et la quote-part restant \xE0 la charge de l'employ\xE9",
          "6. Valider l'ordonnancement : la part employ\xE9 est automatiquement inject\xE9e dans les pr\xE9comptes de la paie du mois sous la rubrique \xAB OD Frais M\xE9dicaux \xBB"
        ]
      }
    ],
    workflow: [
      "\xC9mission du bon de prise en charge -> Prestation m\xE9dicale -> Facturation prestataire -> Rapprochement & Ordonnancement comptable"
    ],
    tips: "Le module social prot\xE8ge les collaborateurs et leurs familles tout en assurant une ma\xEEtrise stricte des co\xFBts de sant\xE9 pour la Banque."
  },
  // =========================================================================
  // CHAPITRE 9 : MODULE MOTIVATION, CLASSIFICATIONS & GRILLES SALARIALES
  // =========================================================================
  {
    id: "ch9-motivation",
    number: "09",
    title: "Chapitre 9 : Module Motivation, Classifications & Grilles Salariales",
    category: "Politique R\xE9mun\xE9ration",
    summary: "Structure de la classification BPBF, grille des salaires indiciaires (15 \xE9chelons), primes et indemnit\xE9s obligatoires.",
    accessPath: "Barre Sup\xE9rieure > Param\xE8tres g\xE9n\xE9raux (ou PAIE > Grille Salariale)",
    subsections: [
      {
        title: "9.1 Classification Conventionnelle BPBF",
        points: [
          "Groupes Salariaux : La structure salariale est organis\xE9e en trois grands groupes : Groupe I (Personnel d'ex\xE9cution), Groupe II (Personnel de ma\xEEtrise) et Groupe III (Cadres et Cadres de Direction).",
          "Cat\xE9gories Professionnelles : Les cat\xE9gories du Groupe I sont not\xE9es en chiffres arabes (Cat\xE9gories 1 \xE0 7). Les cat\xE9gories des Groupes II et III sont not\xE9es en chiffres romains (Cat\xE9gories I \xE0 VIII).",
          "\xC9chelons de Progression : Chaque cat\xE9gorie comporte 15 \xE9chelons successifs (\xC9chelon 1 \xE0 15), traduisant l'anciennet\xE9 et l'exp\xE9rience acquise."
        ]
      },
      {
        title: "9.2 Configuration de la Grille des Salaires de Base Indiciaires",
        accessPath: "Param\xE8tres g\xE9n\xE9raux > Grilles Salariales > Bouton \xAB Modifier la Grille \xBB",
        description: "Mise \xE0 jour des valeurs officielles des salaires de base indiciaires.",
        fields: [
          { name: "Groupe", type: "S\xE9lection", required: true, description: "Groupe I, Groupe II ou Groupe III" },
          { name: "Cat\xE9gorie", type: "S\xE9lection", required: true, description: "1 \xE0 7 ou I \xE0 VIII" },
          { name: "\xC9chelon", type: "Entier (1 \xE0 15)", required: true, description: "Niveau indiciaire" },
          { name: "Salaire de Base", type: "Num\xE9rique (FCFA)", required: true, description: "Montant mensuel garanti" }
        ],
        steps: [
          "1. Ouvrir le tableau de la Grille Salariale",
          "2. Filtrer par Groupe et Cat\xE9gorie pour afficher les 15 \xE9chelons correspondants",
          "3. Pour ajuster un montant, cliquer sur la ligne ou sur le bouton \xAB Modifier \xBB",
          "4. Renseigner la nouvelle valeur en FCFA du salaire de base",
          "5. Cliquer sur \xAB Enregistrer dans PostgreSQL \xBB",
          "6. Le nouveau montant s'appliquera automatiquement \xE0 tous les collaborateurs rattach\xE9s \xE0 cette classification lors du prochain calcul de paie"
        ]
      },
      {
        title: "9.3 Grilles Indemnitaires & Primes R\xE9glementaires",
        accessPath: "PAIE > \xC9l\xE9ments de Salaire > Rubriques Indemnitaires",
        description: "Param\xE9trage des primes cat\xE9gorielles obligatoires.",
        points: [
          "Indemnit\xE9 de Logement : Taux en pourcentage du salaire de base ou montant forfaitaire selon le Groupe salarial.",
          "Indemnit\xE9 de Transport : Montant mensuel allou\xE9 pour couvrir les trajets domicile-lieu de travail.",
          "Prime de Suj\xE9tion / Responsabilit\xE9 : Attribu\xE9e aux chefs d'agence, chefs de d\xE9partement et directeurs.",
          "Prime de Caisse : Allou\xE9e aux caissiers et gestionnaires de coffre pour couvrir le risque financier de manipulation d'esp\xE8ces."
        ]
      }
    ],
    workflow: [
      "1. V\xE9rifier la classification conventionnelle (Groupes I, II, III et Cat\xE9gories)",
      "2. Param\xE9trer la Grille Salariale indiciaire (15 \xE9chelons par cat\xE9gorie)",
      "3. Configurer les bar\xE8mes d'indemnit\xE9s (Logement, Transport, Suj\xE9tion)",
      "4. Affecter la classification \xE0 la fiche de chaque collaborateur"
    ],
    tips: "La conformit\xE9 stricte de la grille salariale avec les accords d'entreprise garantit l'\xE9quit\xE9 interne et la paix sociale au sein de l'institution."
  },
  // =========================================================================
  // CHAPITRE 10 : MODULE PAIE & TRAITEMENTS MENSUELS (CYCLE INTÉGRAL DE A À Z)
  // =========================================================================
  {
    id: "ch10-paie",
    number: "10",
    title: "Chapitre 10 : Module Paie & Traitements Mensuels (Cycle Int\xE9gral de A \xE0 Z)",
    category: "Moteur de Paie",
    summary: "Guide op\xE9rationnel complet du cycle de paie mensuel : ouverture, variables, calcul automatique, contr\xF4les M-1 vs M, validation, 12 \xE9tats officiels, export comptable et cl\xF4ture.",
    accessPath: "Barre Sup\xE9rieure > Module PAIE",
    subsections: [
      {
        title: "10.1 \xC9tape 1 : Ouverture de la Session de Paie Mensuelle",
        accessPath: "PAIE > Sessions de Paie > Bouton \xAB Nouvelle Session \xBB",
        description: "Cr\xE9ation de la session comptable du mois en cours.",
        fields: [
          { name: "Mois & Ann\xE9e", type: "S\xE9lection", required: true, description: "P\xE9riode de paie (ex: 09/2026)" },
          { name: "Type de session", type: "S\xE9lection", required: true, description: "Ordinaire (mensuelle normale), Extraordinaire (gratification, 13\xE8me mois)" },
          { name: "Date de d\xE9but & fin", type: "Date", required: true, description: "P\xE9riode calendaire de d\xE9compte" },
          { name: "Date de paiement pr\xE9vue", type: "Date", required: true, description: "Date de valeur du virement bancaire" }
        ],
        steps: [
          "1. Cliquer sur le module \xAB PAIE \xBB dans la barre sup\xE9rieure",
          "2. Acc\xE9der \xE0 \xAB Sessions de Paie \xBB et cliquer sur \xAB Nouvelle Session \xBB",
          "3. S\xE9lectionner le mois et l'ann\xE9e comptable",
          "4. Choisir \xAB Session Ordinaire \xBB pour la paie mensuelle standard",
          "5. Confirmer les dates de d\xE9but, fin et date d'exigibilit\xE9",
          "6. Cliquer sur \xAB Ouvrir la Session \xBB. La session appara\xEEt \xE0 l'\xE9tat \xAB Ouverte / En Cours \xBB"
        ]
      },
      {
        title: "10.2 \xC9tape 2 : Activation des Employ\xE9s & Saisie des Variables",
        accessPath: "PAIE > Variables de Paie (Avoirs & Pr\xE9comptes)",
        description: "V\xE9rification de la liste des agents \xE9ligibles et saisie des \xE9l\xE9ments variables du mois.",
        fields: [
          { name: "Heures suppl\xE9mentaires", type: "Num\xE9rique (Heures)", required: false, description: "Heures major\xE9es \xE0 15%, 50% ou 100%" },
          { name: "Primes exceptionnelles", type: "Num\xE9rique (FCFA)", required: false, description: "Prime de rendement, prime de bilan" },
          { name: "Absences d\xE9ductibles", type: "Nombre de jours", required: false, description: "Absences injustifi\xE9es entra\xEEnant une retenue sur salaire" },
          { name: "Acomptes sur salaire", type: "Num\xE9rique (FCFA)", required: false, description: "Avances accord\xE9es au cours du mois \xE0 d\xE9duire du net" }
        ],
        steps: [
          "1. Cliquer sur \xAB Variables de Paie \xBB",
          "2. S\xE9lectionner la session active en cours",
          "3. Pour saisir une prime ou rappel : cliquer sur \xAB Ajouter un Avoir \xBB, s\xE9lectionner le collaborateur, le code de prime et le montant",
          "4. Pour saisir une retenue ou acompte : cliquer sur \xAB Ajouter un Pr\xE9compte \xBB et renseigner le montant \xE0 pr\xE9lever",
          "5. Les mensualit\xE9s de pr\xEAts en cours sont automatiquement import\xE9es par le syst\xE8me sans ressaisie manuelle"
        ]
      },
      {
        title: "10.3 \xC9tape 3 : Lancement du Calcul Automatique de la Paie",
        accessPath: "PAIE > Bulletins > Bouton \xAB G\xE9n\xE9rer la Paie du Mois \xBB",
        description: "Ex\xE9cution du moteur de paie Spring Boot en temps r\xE9el pour l'ensemble des agents.",
        steps: [
          "1. Acc\xE9der au menu \xAB Bulletins \xBB",
          "2. Cliquer sur le bouton principal \xAB G\xE9n\xE9rer la Paie du Mois \xBB",
          "3. Le syst\xE8me ex\xE9cute en arri\xE8re-plan la cha\xEEne de traitement :",
          "   a. D\xE9termination du Salaire de Base indiciaire selon le Groupe, la Cat\xE9gorie et l'\xC9chelon",
          "   b. Calcul des indemnit\xE9s fixes (Logement, Transport, Suj\xE9tion, Repr\xE9sentation)",
          "   c. Int\xE9gration des \xE9l\xE9ments variables (primes, heures sup, rappels)",
          "   d. D\xE9termination du Salaire Brut Global",
          "   e. Calcul des cotisations sociales CNSS : part ouvri\xE8re 5.5% (plafonn\xE9e \xE0 600 000 FCFA)",
          "   f. D\xE9termination de la base imposable fiscale nette apr\xE8s abattement professionnel",
          "   g. Calcul de l'IUTS selon le bar\xE8me progressif par tranches 2024 avec r\xE9duction pour charges de famille",
          "   h. Retenue l\xE9gale FSP (Fonds de Soutien Patriotique 1%) et cotisation Mutuelle",
          "   i. D\xE9duction des pr\xE9comptes de pr\xEAt et acomptes",
          "   j. D\xE9termination du Salaire Net \xE0 Payer",
          "   k. Calcul des charges patronales (CNSS 16%, Taxe Patronale d'Apprentissage TPA)",
          "4. Une bo\xEEte de dialogue confirme le succ\xE8s du calcul et affiche le nombre de bulletins g\xE9n\xE9r\xE9s avec la masse salariale globale"
        ],
        systemBehavior: "Si un collaborateur actif n'a pas de RIB bancaire renseign\xE9, le syst\xE8me g\xE9n\xE8re un avertissement de contr\xF4le sans bloquer les autres agents."
      },
      {
        title: "10.4 \xC9tape 4 : Contr\xF4le de Paie, Mode Comparatif (M-1 vs M) & Audit",
        accessPath: "PAIE > Bulletins > Commutateur \xAB Mode Comparatif \xBB",
        description: "Analyse comparative des \xE9carts de r\xE9mun\xE9ration entre le mois pr\xE9c\xE9dent et le mois actuel.",
        steps: [
          "1. Sur l'\xE9cran des bulletins, activer le commutateur \xAB Mode Comparatif (M-1 vs M) \xBB",
          "2. Le tableau affiche pour chaque agent : Salaire Brut M-1, Salaire Brut M, \xC9cart Brut, Net M-1, Net M, \xC9cart Net",
          "3. Identifier imm\xE9diatement les \xE9carts significatifs (mis en \xE9vidence par des indicateurs visuels)",
          "4. Cliquer sur un agent pour afficher le d\xE9tail de son bulletin individuel et v\xE9rifier les rubriques modifi\xE9es",
          "5. Si une correction est requise : ajuster la variable erron\xE9e et recliquer sur \xAB Recalculer le Bulletin \xBB pour cet employ\xE9"
        ]
      },
      {
        title: "10.5 \xC9tape 5 : Validation Hi\xE9rarchique de la Paie",
        accessPath: "PAIE > Sessions de Paie > Bouton \xAB Valider la Paie \xBB",
        description: "Validation formelle par le Responsable Paie puis par le Directeur des Ressources Humaines.",
        steps: [
          "1. Apr\xE8s v\xE9rification compl\xE8te des totaux de paie et du mode comparatif, cliquer sur \xAB Valider la Paie \xBB",
          "2. Renseigner son mot de passe de confirmation pour signature \xE9lectronique",
          "3. La session passe \xE0 l'\xE9tat \xAB Valid\xE9e DRH \xBB",
          "4. D\xE8s validation, les bulletins individuels deviennent consultables par les employ\xE9s sur leur espace personnel"
        ]
      },
      {
        title: "10.6 \xC9tape 6 : \xC9dition & T\xE9l\xE9chargement des 12 \xC9tats de Synth\xE8se Officiels",
        accessPath: "PAIE > \xC9tats de Synth\xE8se (Sous-menu d\xE9di\xE9)",
        description: "G\xE9n\xE9ration instantan\xE9e des bordereaux officiels au format Excel ou PDF sign\xE9.",
        points: [
          "1. Livre de Paie Global : Synth\xE8se compl\xE8te de toutes les rubriques de gain et retenues pour chaque employ\xE9.",
          "2. \xC9tat Nominatif des Salaires : Liste officielle des salaires nets pour archivage administratif.",
          "3. \xC9tat des Salaires par Direction : R\xE9partition analytique de la masse salariale par direction et d\xE9partement.",
          "4. Bordereau de Virement Bancaire : Fichier consolid\xE9 par banque avec codes RIB pour \xE9mission des virements interbancaires.",
          "5. D\xE9claration CNSS : Bordereau nominatif officiel des cotisations salariales (5.5%) et patronales (16%).",
          "6. D\xE9claration Fiscale IUTS : \xC9tat des retenues \xE0 la source \xE0 transmettre \xE0 la Direction G\xE9n\xE9rale des Imp\xF4ts (DGI).",
          "7. \xC9tat des Pr\xE9comptes & Retenues : R\xE9capitulatif des retenues sur pr\xEAts bancaires et dettes diverses.",
          "8. \xC9tat FSP : Bordereau de versement de la contribution patriotique de 1%.",
          "9. \xC9tat de la Mutuelle Sant\xE9 : R\xE9capitulatif des cotisations d'assurance maladie.",
          "10. \xC9tat des \xC9l\xE9ments de Salaire : R\xE9partition montant par montant de chaque prime ou indemnit\xE9.",
          "11. \xC9tat par Type d'Employ\xE9 : Analyse comparative Cadres, Ma\xEEtrise, Ex\xE9cution.",
          "12. \xC9tat de Contr\xF4le des Bulletins : Fiche d'audit exhaustif des anomalies et totaux de contr\xF4le."
        ],
        steps: [
          "1. Ouvrir le sous-menu de l'\xE9tat souhait\xE9 dans le tiroir de gauche",
          "2. S\xE9lectionner la session de paie dans le filtre de p\xE9riode",
          "3. Cliquer sur \xAB Exporter Excel \xBB pour obtenir la version tableur avec BOM UTF-8",
          "4. Cliquer sur \xAB T\xE9l\xE9charger PDF \xBB pour obtenir le bordereau officiel pr\xEAt pour visa et signature"
        ]
      },
      {
        title: "10.7 \xC9tape 7 : Export Comptable & Cl\xF4ture D\xE9finitive de la Session",
        accessPath: "PAIE > Sessions de Paie > Bouton \xAB Cl\xF4turer D\xE9finitivement \xBB",
        description: "G\xE9n\xE9ration du fichier d'\xE9critures comptables et verrouillage irr\xE9versible de la session.",
        steps: [
          "1. Cliquer sur le bouton \xAB Export Comptable \xBB",
          "2. S\xE9lectionner le format d'export (Grand Livre / \xC9critures de paie OD)",
          "3. T\xE9l\xE9charger le fichier texte ou CSV compatible avec le progiciel comptable bancaire",
          "4. V\xE9rifier que toutes les impressions et virements ont \xE9t\xE9 ex\xE9cut\xE9s",
          "5. Cliquer sur le bouton \xAB Cl\xF4turer D\xE9finitivement la Session \xBB",
          "6. Confirmer le message d'avertissement : la session passe \xE0 l'\xE9tat \xAB Cl\xF4tur\xE9e \xBB et est verrouill\xE9e de mani\xE8re irr\xE9versible dans PostgreSQL pour interdire toute modification ult\xE9rieure"
        ],
        systemBehavior: "La cl\xF4ture de la paie archive les bulletins de mani\xE8re immuable, met \xE0 jour les compteurs cumul\xE9s annuels et ouvre la possibilit\xE9 de cr\xE9er la session du mois suivant."
      }
    ],
    workflow: [
      "Ouverture session -> Activation des agents -> Saisie variables -> Moteur de calcul -> Contr\xF4le M-1 vs M -> Validation DRH -> Bulletins -> 12 \xC9tats de synth\xE8se -> Export comptable -> Cl\xF4ture d\xE9finitive"
    ],
    tips: "La cl\xF4ture de la paie est une op\xE9ration irr\xE9versible qui garantit l'int\xE9grit\xE9 l\xE9gale et comptable des exercices financiers."
  },
  // =========================================================================
  // CHAPITRE 11 : MODULE PROFILS, SÉCURITÉ, OPTIONS SYSTÈME & SAUVEGARDES
  // =========================================================================
  {
    id: "ch11-options-securite",
    number: "11",
    title: "Chapitre 11 : Module Profils, S\xE9curit\xE9, Options Syst\xE8me & Sauvegardes",
    category: "Administration Syst\xE8me",
    summary: "Administration des comptes utilisateurs, matrice des habilitations par module, cl\xF4ture annuelle et sauvegardes de donn\xE9es PostgreSQL.",
    accessPath: "Barre Sup\xE9rieure > PROFIL (ou Param\xE8tres G\xE9n\xE9raux)",
    subsections: [
      {
        title: "11.1 Gestion des Profils de S\xE9curit\xE9 & Matrice des Habilitations",
        accessPath: "PROFIL > S\xE9curit\xE9 & Droits > Matrice des Habilitations",
        description: "Attribution granulaire des privil\xE8ges d'acc\xE8s par \xE9cran et par type d'action.",
        fields: [
          { name: "R\xF4le Applicatif", type: "S\xE9lection", required: true, description: "ADMIN, DRH, GESTIONNAIRE_PAIE, GESTIONNAIRE_GRH, VALIDATEUR, CONSULTANT" },
          { name: "Permissions \xC9cran", type: "Cases \xE0 cocher", required: true, description: "Lecture (Afficher), Cr\xE9ation (Nouveau), Modification (\xC9diter), Suppression, Validation, Cl\xF4ture" }
        ],
        steps: [
          "1. Ouvrir le menu \xAB PROFIL \xBB puis cliquer sur \xAB Matrice des Habilitations \xBB",
          "2. S\xE9lectionner le r\xF4le utilisateur \xE0 configurer dans la liste d\xE9roulante",
          "3. Dans la matrice, cocher ou d\xE9cocher les autorisations pour chaque module (ex : interdire la modification de la grille salariale aux gestionnaires de paie)",
          "4. Cliquer sur \xAB Enregistrer les Droits \xBB",
          "5. Les nouvelles permissions prennent effet imm\xE9diatement pour toutes les sessions ouvertes"
        ]
      },
      {
        title: "11.2 Gestion des Comptes Utilisateurs & R\xE9initialisation",
        accessPath: "PROFIL > Utilisateurs > Bouton \xAB Nouvel Utilisateur \xBB",
        description: "Cr\xE9ation d'un compte applicatif et assignation de profil.",
        steps: [
          "1. Cliquer sur \xAB Nouvel Utilisateur \xBB",
          "2. Saisir le nom, l'adresse e-mail professionnelle BPBF et le matricule",
          "3. Assigner le profil de s\xE9curit\xE9 requis",
          "4. D\xE9finir un mot de passe temporaire \xE0 changer obligatoirement \xE0 la premi\xE8re connexion",
          "5. Pour d\xE9bloquer un compte ou r\xE9initialiser un mot de passe oubli\xE9 : rechercher l'utilisateur et cliquer sur \xAB R\xE9initialiser le mot de passe \xBB"
        ]
      },
      {
        title: "11.3 Gestion de l'Exercice & Cl\xF4ture Annuelle",
        accessPath: "Param\xE8tres g\xE9n\xE9raux > Exercices > Bouton \xAB Bascule Annuelle \xBB",
        description: "Op\xE9rations de fin d'ann\xE9e financi\xE8re et ouverture du nouvel exercice budg\xE9taire.",
        steps: [
          "1. V\xE9rifier que les 12 sessions mensuelles de l'ann\xE9e \xE9coul\xE9e sont toutes \xE0 l'\xE9tat \xAB Cl\xF4tur\xE9e \xBB",
          "2. Cliquer sur \xAB Ouvrir le Nouvel Exercice (N+1) \xBB",
          "3. Le syst\xE8me proc\xE8de au report automatique des soldes de cong\xE9s acquis non consomm\xE9s selon les r\xE8gles conventionnelles",
          "4. R\xE9initialisation des compteurs p\xE9riodiques tout en conservant l'historique int\xE9gral",
          "5. D\xE9claration de l'exercice N+1 comme exercice actif de travail"
        ]
      },
      {
        title: "11.4 Sauvegardes & Restauration de la Base de Donn\xE9es PostgreSQL",
        accessPath: "Param\xE8tres g\xE9n\xE9raux > Sauvegardes > Bouton \xAB Sauvegarder Maintenant \xBB",
        description: "Sauvegarde physique et logique des donn\xE9es pour pr\xE9venir tout sinistre.",
        steps: [
          "1. Acc\xE9der \xE0 l'\xE9cran \xAB Sauvegardes de la Base de Donn\xE9es \xBB",
          "2. Cliquer sur \xAB D\xE9clencher une Sauvegarde Compl\xE8te (Dump SQL) \xBB",
          "3. Le syst\xE8me ex\xE9cute la commande pg_dump en arri\xE8re-plan avec compression gzip",
          "4. T\xE9l\xE9charger le fichier d'archive de sauvegarde g\xE9n\xE9r\xE9 pour stockage sur le serveur de secours ou NAS externe s\xE9curis\xE9",
          "5. En cas de sinistre : la proc\xE9dure de restauration s'ex\xE9cute via la commande pg_restore fournie dans la documentation technique"
        ]
      }
    ],
    workflow: [
      "Cr\xE9ation profil -> Matrice des droits -> Attribution utilisateur -> Surveillance des logs -> Sauvegarde quotidienne"
    ],
    tips: "Toujours effectuer un export de sauvegarde complet avant le lancement des op\xE9rations de cl\xF4ture annuelle ou de modification globale de la grille salariale."
  }
];

// src/app/features/profils/manuel-utilisateur/manuel-utilisateur.component.ts
var _forTrack05 = ($index, $item) => $item.id;
var _forTrack13 = ($index, $item) => $item.title;
var _forTrack2 = ($index, $item) => $item.name;
function ManuelUtilisateurComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function ManuelUtilisateurComponent_Conditional_43_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.resetSearch());
    });
    \u0275\u0275text(1, "Effacer");
    \u0275\u0275elementEnd();
  }
}
function ManuelUtilisateurComponent_For_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function ManuelUtilisateurComponent_For_49_Template_button_click_0_listener() {
      const cat_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setCategory(cat_r4));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("active", ctx_r1.selectedCategory === cat_r4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", cat_r4, " ");
  }
}
function ManuelUtilisateurComponent_For_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function ManuelUtilisateurComponent_For_56_Template_button_click_0_listener() {
      const c_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.scrollToChapter(c_r6.id));
    });
    \u0275\u0275elementStart(1, "span", 31);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 32);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r6.number);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r6.title.split(":")[1] || c_r6.title);
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55)(1, "span", 62);
    \u0275\u0275text(2, "Chemin :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", sub_r8.accessPath, " ");
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(sub_r8.description);
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pt_r9 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(pt_r9);
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 57);
    \u0275\u0275repeaterCreate(1, ManuelUtilisateurComponent_For_59_For_23_Conditional_6_For_2_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(sub_r8.points);
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Conditional_7_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 66);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 67);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 68)(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 69);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const field_r10 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r10.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r10.type);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("req-yes", field_r10.required)("req-no", !field_r10.required);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", field_r10.required ? "Obligatoire" : "Optionnel", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r10.description);
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "h4", 63);
    \u0275\u0275text(2, "Champs du formulaire & R\xE8gles de saisie :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 64)(4, "table", 65)(5, "thead")(6, "tr")(7, "th");
    \u0275\u0275text(8, "Nom du Champ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Type de Donn\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Obligation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Description & R\xE8gle de Gestion");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "tbody");
    \u0275\u0275repeaterCreate(16, ManuelUtilisateurComponent_For_59_For_23_Conditional_7_For_17_Template, 10, 8, "tr", null, _forTrack2);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const sub_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(16);
    \u0275\u0275repeater(sub_r8.fields);
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Conditional_8_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 71)(1, "span", 72);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 73);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const st_r11 = ctx.$implicit;
    const \u0275$index_227_r12 = ctx.$index;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_227_r12 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(st_r11);
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 59)(1, "h4", 63);
    \u0275\u0275text(2, "Manipulations & Clics \xE9tape par \xE9tape :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 70);
    \u0275\u0275repeaterCreate(4, ManuelUtilisateurComponent_For_59_For_23_Conditional_8_For_5_Template, 5, 2, "div", 71, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const sub_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275repeater(sub_r8.steps);
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60)(1, "span", 74);
    \u0275\u0275text(2, "Comportement & Contr\xF4les automatiques du syst\xE8me :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 75);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const sub_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(sub_r8.systemBehavior);
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Conditional_10_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctrl_r13 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctrl_r13);
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 61)(1, "span", 76);
    \u0275\u0275text(2, "V\xE9rifications obligatoires :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul", 77);
    \u0275\u0275repeaterCreate(4, ManuelUtilisateurComponent_For_59_For_23_Conditional_10_For_5_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const sub_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275repeater(sub_r8.controls);
  }
}
function ManuelUtilisateurComponent_For_59_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "div", 53)(2, "h3", 54);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ManuelUtilisateurComponent_For_59_For_23_Conditional_4_Template, 4, 1, "div", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, ManuelUtilisateurComponent_For_59_For_23_Conditional_5_Template, 2, 1, "p", 56);
    \u0275\u0275conditionalCreate(6, ManuelUtilisateurComponent_For_59_For_23_Conditional_6_Template, 3, 0, "ul", 57);
    \u0275\u0275conditionalCreate(7, ManuelUtilisateurComponent_For_59_For_23_Conditional_7_Template, 18, 0, "div", 58);
    \u0275\u0275conditionalCreate(8, ManuelUtilisateurComponent_For_59_For_23_Conditional_8_Template, 6, 0, "div", 59);
    \u0275\u0275conditionalCreate(9, ManuelUtilisateurComponent_For_59_For_23_Conditional_9_Template, 5, 1, "div", 60);
    \u0275\u0275conditionalCreate(10, ManuelUtilisateurComponent_For_59_For_23_Conditional_10_Template, 6, 0, "div", 61);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r8 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(sub_r8.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(sub_r8.accessPath ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(sub_r8.description ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(sub_r8.points && sub_r8.points.length > 0 ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(sub_r8.fields && sub_r8.fields.length > 0 ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(sub_r8.steps && sub_r8.steps.length > 0 ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(sub_r8.systemBehavior ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(sub_r8.controls && sub_r8.controls.length > 0 ? 10 : -1);
  }
}
function ManuelUtilisateurComponent_For_59_Conditional_24_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 80)(1, "span", 81);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const step_r14 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(step_r14);
  }
}
function ManuelUtilisateurComponent_For_59_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48)(1, "span", 78);
    \u0275\u0275text(2, "Cycle Global Op\xE9rationnel Recommand\xE9 :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 79);
    \u0275\u0275repeaterCreate(4, ManuelUtilisateurComponent_For_59_Conditional_24_For_5_Template, 3, 1, "div", 80, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const chapter_r15 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275repeater(chapter_r15.workflow);
  }
}
function ManuelUtilisateurComponent_For_59_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49)(1, "span", 82);
    \u0275\u0275text(2, "R\xE8gle M\xE9tier & Conformit\xE9 Bancaire BPBF :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 83);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const chapter_r15 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(chapter_r15.tips);
  }
}
function ManuelUtilisateurComponent_For_59_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 33)(2, "div", 34)(3, "span", 35);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 36)(6, "div", 37)(7, "span", 38);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 39);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "h2", 40);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p", 41);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 42)(16, "span", 43);
    \u0275\u0275text(17, "Acc\xE8s dans l'application :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 44);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(20, "div", 45)(21, "div", 46);
    \u0275\u0275repeaterCreate(22, ManuelUtilisateurComponent_For_59_For_23_Template, 11, 8, "div", 47, _forTrack13);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(24, ManuelUtilisateurComponent_For_59_Conditional_24_Template, 6, 0, "div", 48);
    \u0275\u0275conditionalCreate(25, ManuelUtilisateurComponent_For_59_Conditional_25_Template, 5, 1, "div", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 50)(27, "button", 51);
    \u0275\u0275listener("click", function ManuelUtilisateurComponent_For_59_Template_button_click_27_listener() {
      const chapter_r15 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.printChapter(chapter_r15));
    });
    \u0275\u0275elementStart(28, "span");
    \u0275\u0275text(29, "Imprimer la Fiche Manipulations");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "button", 52);
    \u0275\u0275listener("click", function ManuelUtilisateurComponent_For_59_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.downloadManual("Guide_Utilisateur_SIRH_BPBF.pdf"));
    });
    \u0275\u0275elementStart(31, "span");
    \u0275\u0275text(32, "T\xE9l\xE9charger le Guide PDF Complet");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const chapter_r15 = ctx.$implicit;
    \u0275\u0275property("id", chapter_r15.id);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(chapter_r15.number);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(chapter_r15.category);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("SIRH-BPBF-DOC-", chapter_r15.number);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(chapter_r15.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(chapter_r15.summary);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(chapter_r15.accessPath);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(chapter_r15.subsections);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(chapter_r15.workflow && chapter_r15.workflow.length > 0 ? 24 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(chapter_r15.tips ? 25 : -1);
  }
}
function ManuelUtilisateurComponent_Conditional_60_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27)(1, "h3");
    \u0275\u0275text(2, "Aucun chapitre ne correspond \xE0 votre recherche");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Aucun r\xE9sultat pour le mot-cl\xE9 \xAB ");
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " \xBB dans la cat\xE9gorie s\xE9lectionn\xE9e.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 84);
    \u0275\u0275listener("click", function ManuelUtilisateurComponent_Conditional_60_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.resetSearch());
    });
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10, "R\xE9initialiser la recherche");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.searchQuery);
  }
}
var ManuelUtilisateurComponent = class _ManuelUtilisateurComponent {
  searchQuery = "";
  selectedCategory = "TOUS";
  categories = [
    "TOUS",
    "Vue d'ensemble",
    "Architecture",
    "Interface & Prise en main",
    "Portail Employ\xE9",
    "Ressources Humaines",
    "Gestion des Talents",
    "D\xE9veloppement RH",
    "Protection Sociale",
    "Politique R\xE9mun\xE9ration",
    "Moteur de Paie",
    "Administration Syst\xE8me"
  ];
  chapters = GUIDE_CHAPTERS;
  filteredChapters = [];
  ngOnInit() {
    this.filteredChapters = [...this.chapters];
  }
  setCategory(category) {
    this.selectedCategory = category;
    this.applyFilter();
  }
  applyFilter() {
    let result = [...this.chapters];
    if (this.selectedCategory && this.selectedCategory !== "TOUS") {
      result = result.filter((c) => c.category === this.selectedCategory);
    }
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter((c) => c.number.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.accessPath && c.accessPath.toLowerCase().includes(q) || c.tips && c.tips.toLowerCase().includes(q) || c.workflow.some((w) => w.toLowerCase().includes(q)) || c.subsections.some((sub) => sub.title.toLowerCase().includes(q) || sub.accessPath && sub.accessPath.toLowerCase().includes(q) || sub.description && sub.description.toLowerCase().includes(q) || sub.systemBehavior && sub.systemBehavior.toLowerCase().includes(q) || sub.points && sub.points.some((p) => p.toLowerCase().includes(q)) || sub.steps && sub.steps.some((s) => s.toLowerCase().includes(q)) || sub.fields && sub.fields.some((f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) || sub.controls && sub.controls.some((ctrl) => ctrl.toLowerCase().includes(q))));
    }
    this.filteredChapters = result;
  }
  resetSearch() {
    this.searchQuery = "";
    this.selectedCategory = "TOUS";
    this.filteredChapters = [...this.chapters];
  }
  scrollToChapter(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  downloadManual(fileName = "Guide_Utilisateur_SIRH_BPBF.pdf") {
    const link = document.createElement("a");
    link.href = "docs/Guide_Utilisateur_SIRH_BPBF.pdf";
    link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  printChapter(chapter) {
    const printWindow = window.open("", "_blank", "width=950,height=750");
    if (!printWindow) {
      alert("Veuillez autoriser les fen\xEAtres pop-up pour imprimer cette fiche.");
      return;
    }
    let subHtml = "";
    chapter.subsections.forEach((sub) => {
      let fieldsHtml = "";
      if (sub.fields && sub.fields.length > 0) {
        fieldsHtml = `
          <div style="margin: 12px 0;">
            <strong style="font-size: 13px; color: #004d80;">Champs du formulaire :</strong>
            <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12.5px;">
              <thead>
                <tr style="background: #f1f5f9; text-align: left;">
                  <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Nom du champ</th>
                  <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Type</th>
                  <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Obligatoire</th>
                  <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Description</th>
                </tr>
              </thead>
              <tbody>
                ${sub.fields.map((f) => `
                  <tr>
                    <td style="padding: 5px 8px; border: 1px solid #e2e8f0; font-weight: bold;">${f.name}</td>
                    <td style="padding: 5px 8px; border: 1px solid #e2e8f0; color: #64748b;">${f.type}</td>
                    <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">${f.required ? '<span style="color: #b91c1c; font-weight: bold;">Oui</span>' : "Optionnel"}</td>
                    <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">${f.description}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `;
      }
      let stepsHtml = "";
      if (sub.steps && sub.steps.length > 0) {
        stepsHtml = `
          <div style="margin: 12px 0; background: #fafafa; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px;">
            <strong style="font-size: 13px; color: #004d80;">Manipulations pas-\xE0-pas :</strong>
            <ol style="margin: 6px 0 0 0; padding-left: 20px; line-height: 1.6; font-size: 13px;">
              ${sub.steps.map((s) => `<li style="margin-bottom: 4px;">${s}</li>`).join("")}
            </ol>
          </div>
        `;
      }
      let sysHtml = "";
      if (sub.systemBehavior) {
        sysHtml = `
          <div style="background: #eff6ff; border-left: 3px solid #0284c7; padding: 8px 12px; margin: 10px 0; font-size: 12.5px; color: #1e40af;">
            <strong>Comportement & Contr\xF4les du syst\xE8me :</strong> ${sub.systemBehavior}
          </div>
        `;
      }
      let ctrlHtml = "";
      if (sub.controls && sub.controls.length > 0) {
        ctrlHtml = `
          <div style="background: #fefce8; border: 1px solid #fef08a; padding: 8px 12px; margin: 10px 0; font-size: 12.5px; border-radius: 4px;">
            <strong style="color: #854d0e;">V\xE9rifications obligatoires :</strong>
            <ul style="margin: 4px 0 0 0; padding-left: 20px; color: #713f12;">
              ${sub.controls.map((c) => `<li>${c}</li>`).join("")}
            </ul>
          </div>
        `;
      }
      subHtml += `
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 15px; color: #004d80; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">${sub.title}</h3>
          ${sub.accessPath ? `<div style="font-size: 11.5px; color: #64748b; font-style: italic; margin-bottom: 8px;"><strong>Chemin :</strong> ${sub.accessPath}</div>` : ""}
          ${sub.points && sub.points.length > 0 ? `
          <ul style="line-height: 1.6; font-size: 13.5px; color: #1e293b; padding-left: 20px;">
            ${sub.points.map((p) => `<li style="margin-bottom: 4px;">${p}</li>`).join("")}
          </ul>` : ""}
          ${fieldsHtml}
          ${stepsHtml}
          ${sysHtml}
          ${ctrlHtml}
        </div>
      `;
    });
    let wfHtml = "";
    if (chapter.workflow && chapter.workflow.length > 0) {
      wfHtml = `
        <div style="background: #f1f5f9; border-left: 4px solid #004d80; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
          <strong style="color: #0f172a; font-size: 13px;">Proc\xE9dure globale recommand\xE9e :</strong>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #334155; line-height: 1.6;">${chapter.workflow.join(" &rarr; ")}</p>
        </div>
      `;
    }
    let tipsHtml = "";
    if (chapter.tips) {
      tipsHtml = `
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 10px 14px; border-radius: 6px; margin-top: 14px; font-size: 12.5px; color: #065f46;">
          <strong>Bonne pratique / R\xE8gle bancaire BPBF :</strong> ${chapter.tips}
        </div>
      `;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${chapter.title} - Guide Op\xE9rationnel SIRH BPBF</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 30px; color: #0f172a; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #004d80; padding-bottom: 15px; margin-bottom: 25px; }
          .title { font-size: 20px; font-weight: bold; color: #004d80; margin: 0; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .category { background: #004d80; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${chapter.title}</h1>
            <div class="subtitle">SIRH Banque Postale du Burkina Faso (BPBF) \u2022 ${chapter.summary}</div>
            <div style="margin-top: 6px; font-size: 12px; color: #004d80; font-weight: bold;">Acc\xE8s : ${chapter.accessPath}</div>
          </div>
          <div>
            <span class="category">${chapter.category}</span>
          </div>
        </div>
        ${subHtml}
        ${wfHtml}
        ${tipsHtml}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
  static \u0275fac = function ManuelUtilisateurComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ManuelUtilisateurComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ManuelUtilisateurComponent, selectors: [["app-manuel-utilisateur"]], standalone: false, decls: 61, vars: 3, consts: [[1, "manuel-page"], [1, "page-header"], [1, "ph-content"], [1, "ph-badge"], [1, "header-actions"], ["type", "button", 1, "btn-download-main", 3, "click"], [1, "doc-stats-banner"], [1, "stat-item"], [1, "stat-number"], [1, "stat-label"], [1, "stat-divider"], [1, "search-card"], [1, "search-box-row"], [1, "search-input-container"], ["type", "text", "placeholder", "Rechercher une manipulation, un champ, une \xE9tape (ex: matricule, virement, \xE9chelon, calcul paie, cnss, bon de soins)...", 1, "search-input-custom", 3, "ngModelChange", "ngModel"], ["type", "button", 1, "btn-clear-search"], [1, "categories-bar"], [1, "cat-label"], [1, "cat-chips"], ["type", "button", 1, "cat-chip", 3, "active"], [1, "toc-container"], [1, "toc-header"], [1, "toc-title"], [1, "toc-grid"], ["type", "button", 1, "toc-item-btn"], [1, "guides-list"], [1, "chapter-card", 3, "id"], [1, "empty-results-card"], ["type", "button", 1, "btn-clear-search", 3, "click"], ["type", "button", 1, "cat-chip", 3, "click"], ["type", "button", 1, "toc-item-btn", 3, "click"], [1, "toc-num"], [1, "toc-text"], [1, "chapter-header"], [1, "chapter-badge-wrapper"], [1, "chapter-badge"], [1, "chapter-title-wrapper"], [1, "chapter-meta"], [1, "chapter-tag"], [1, "chapter-ref"], [1, "chapter-title"], [1, "chapter-summary"], [1, "chapter-access-path"], [1, "path-label"], [1, "path-value"], [1, "chapter-body"], [1, "subsections-list"], [1, "subsection-item"], [1, "workflow-box"], [1, "tips-box"], [1, "chapter-footer"], ["type", "button", 1, "btn-print-chapter", 3, "click"], ["type", "button", 1, "btn-download-guide", 3, "click"], [1, "sub-header-block"], [1, "subsection-title"], [1, "sub-access-tag"], [1, "sub-description"], [1, "subsection-points"], [1, "fields-section"], [1, "steps-section"], [1, "system-behavior-box"], [1, "controls-checklist-box"], [1, "tag-title"], [1, "section-label"], [1, "table-responsive"], [1, "fields-table"], [1, "field-name"], [1, "field-type"], [1, "field-req"], [1, "field-desc"], [1, "steps-container"], [1, "step-card-row"], [1, "step-idx"], [1, "step-content"], [1, "sys-label"], [1, "sys-text"], [1, "ctrl-label"], [1, "ctrl-list"], [1, "wf-title"], [1, "wf-steps-list"], [1, "wf-step-card"], [1, "step-text"], [1, "tips-tag"], [1, "tips-text"], ["type", "button", 1, "btn-reset-filter", 3, "click"]], template: function ManuelUtilisateurComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275text(4, "BPBF");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div")(6, "h1");
      \u0275\u0275text(7, "Manuel d'Utilisation & Guide Op\xE9rationnel Complet");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p");
      \u0275\u0275text(9, "Documentation technique exhaustive, d\xE9marches et manipulations pas-\xE0-pas pour chaque module du SIRH");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "div", 4)(11, "button", 5);
      \u0275\u0275listener("click", function ManuelUtilisateurComponent_Template_button_click_11_listener() {
        return ctx.downloadManual("Guide_Utilisateur_SIRH_BPBF.pdf");
      });
      \u0275\u0275elementStart(12, "span");
      \u0275\u0275text(13, "T\xE9l\xE9charger le Manuel Officiel (PDF - 79 pages)");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(14, "div", 6)(15, "div", 7)(16, "span", 8);
      \u0275\u0275text(17, "11");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "span", 9);
      \u0275\u0275text(19, "Modules & Chapitres");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(20, "div", 10);
      \u0275\u0275elementStart(21, "div", 7)(22, "span", 8);
      \u0275\u0275text(23, "100%");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "span", 9);
      \u0275\u0275text(25, "Manipulations Pas-\xE0-Pas D\xE9taill\xE9es");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(26, "div", 10);
      \u0275\u0275elementStart(27, "div", 7)(28, "span", 8);
      \u0275\u0275text(29, "v12.0.7");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "span", 9);
      \u0275\u0275text(31, "R\xE9f\xE9rentiel ResHum Dz / SIRH v3");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(32, "div", 10);
      \u0275\u0275elementStart(33, "div", 7)(34, "span", 8);
      \u0275\u0275text(35, "BPBF");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "span", 9);
      \u0275\u0275text(37, "Conformit\xE9 Bancaire & Bar\xE8me IUTS 2024");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(38, "mat-card", 11)(39, "mat-card-content")(40, "div", 12)(41, "div", 13)(42, "input", 14);
      \u0275\u0275twoWayListener("ngModelChange", function ManuelUtilisateurComponent_Template_input_ngModelChange_42_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return $event;
      });
      \u0275\u0275listener("ngModelChange", function ManuelUtilisateurComponent_Template_input_ngModelChange_42_listener() {
        return ctx.applyFilter();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(43, ManuelUtilisateurComponent_Conditional_43_Template, 2, 0, "button", 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "div", 16)(45, "span", 17);
      \u0275\u0275text(46, "Domaines :");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "div", 18);
      \u0275\u0275repeaterCreate(48, ManuelUtilisateurComponent_For_49_Template, 2, 3, "button", 19, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(50, "div", 20)(51, "div", 21)(52, "span", 22);
      \u0275\u0275text(53, "Table des mati\xE8res \u2014 Acc\xE8s direct aux manipulations de chaque module :");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(54, "div", 23);
      \u0275\u0275repeaterCreate(55, ManuelUtilisateurComponent_For_56_Template, 5, 2, "button", 24, _forTrack05);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(57, "div", 25);
      \u0275\u0275repeaterCreate(58, ManuelUtilisateurComponent_For_59_Template, 33, 9, "div", 26, _forTrack05);
      \u0275\u0275conditionalCreate(60, ManuelUtilisateurComponent_Conditional_60_Template, 11, 1, "div", 27);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(42);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.searchQuery ? 43 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.categories);
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.chapters);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.filteredChapters);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.filteredChapters.length === 0 ? 60 : -1);
    }
  }, dependencies: [DefaultValueAccessor, NgControlStatus, NgModel, MatCard, MatCardContent], styles: ["\n\n.manuel-page[_ngcontent-%COMP%] {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.manuel-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 20px 24px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 20px;\n  margin-bottom: 20px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);\n}\n.manuel-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.manuel-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   .ph-badge[_ngcontent-%COMP%] {\n  background: #004d80;\n  color: #ffffff;\n  font-weight: 800;\n  font-size: 16px;\n  padding: 8px 14px;\n  border-radius: 8px;\n  letter-spacing: 1px;\n}\n.manuel-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 700;\n  color: #0f172a;\n}\n.manuel-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .ph-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 4px 0 0 0;\n  font-size: 13.5px;\n  color: #64748b;\n}\n.manuel-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .btn-download-main[_ngcontent-%COMP%] {\n  background: #004d80;\n  color: #ffffff;\n  font-weight: 700;\n  font-size: 13.5px;\n  padding: 12px 20px;\n  border-radius: 8px;\n  border: none;\n  cursor: pointer;\n  transition: background 0.2s ease, transform 0.1s ease;\n  white-space: nowrap;\n}\n.manuel-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .btn-download-main[_ngcontent-%COMP%]:hover {\n  background: #003357;\n  transform: translateY(-1px);\n}\n.manuel-page[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .btn-download-main[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n.manuel-page[_ngcontent-%COMP%]   .doc-stats-banner[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 14px 24px;\n  display: flex;\n  align-items: center;\n  justify-content: space-around;\n  margin-bottom: 20px;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.manuel-page[_ngcontent-%COMP%]   .doc-stats-banner[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n.manuel-page[_ngcontent-%COMP%]   .doc-stats-banner[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   .stat-number[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 800;\n  color: #004d80;\n}\n.manuel-page[_ngcontent-%COMP%]   .doc-stats-banner[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  color: #475569;\n  margin-top: 2px;\n}\n.manuel-page[_ngcontent-%COMP%]   .doc-stats-banner[_ngcontent-%COMP%]   .stat-divider[_ngcontent-%COMP%] {\n  width: 1px;\n  height: 28px;\n  background: #cbd5e1;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  border: 1px solid #e2e8f0;\n  margin-bottom: 20px;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  padding: 18px 20px !important;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-box-row[_ngcontent-%COMP%] {\n  margin-bottom: 14px;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-box-row[_ngcontent-%COMP%]   .search-input-container[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-box-row[_ngcontent-%COMP%]   .search-input-container[_ngcontent-%COMP%]   .search-input-custom[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px 90px 12px 16px;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  font-size: 14px;\n  color: #1e293b;\n  outline: none;\n  transition: border-color 0.2s ease, box-shadow 0.2s ease;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-box-row[_ngcontent-%COMP%]   .search-input-container[_ngcontent-%COMP%]   .search-input-custom[_ngcontent-%COMP%]:focus {\n  border-color: #004d80;\n  box-shadow: 0 0 0 3px rgba(0, 77, 128, 0.12);\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-box-row[_ngcontent-%COMP%]   .search-input-container[_ngcontent-%COMP%]   .search-input-custom[_ngcontent-%COMP%]::placeholder {\n  color: #94a3b8;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-box-row[_ngcontent-%COMP%]   .search-input-container[_ngcontent-%COMP%]   .btn-clear-search[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 12px;\n  background: #f1f5f9;\n  border: 1px solid #cbd5e1;\n  color: #475569;\n  font-size: 12px;\n  font-weight: 600;\n  padding: 4px 10px;\n  border-radius: 6px;\n  cursor: pointer;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-box-row[_ngcontent-%COMP%]   .search-input-container[_ngcontent-%COMP%]   .btn-clear-search[_ngcontent-%COMP%]:hover {\n  background: #e2e8f0;\n  color: #0f172a;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .categories-bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .categories-bar[_ngcontent-%COMP%]   .cat-label[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  font-weight: 700;\n  color: #475569;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .categories-bar[_ngcontent-%COMP%]   .cat-chips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .categories-bar[_ngcontent-%COMP%]   .cat-chips[_ngcontent-%COMP%]   .cat-chip[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  color: #475569;\n  font-size: 12px;\n  font-weight: 600;\n  padding: 5px 12px;\n  border-radius: 20px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .categories-bar[_ngcontent-%COMP%]   .cat-chips[_ngcontent-%COMP%]   .cat-chip[_ngcontent-%COMP%]:hover {\n  background: #f1f5f9;\n  border-color: #cbd5e1;\n  color: #0f172a;\n}\n.manuel-page[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .categories-bar[_ngcontent-%COMP%]   .cat-chips[_ngcontent-%COMP%]   .cat-chip.active[_ngcontent-%COMP%] {\n  background: #004d80;\n  border-color: #004d80;\n  color: #ffffff;\n  font-weight: 700;\n}\n.manuel-page[_ngcontent-%COMP%]   .toc-container[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 16px 20px;\n  margin-bottom: 24px;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);\n}\n.manuel-page[_ngcontent-%COMP%]   .toc-container[_ngcontent-%COMP%]   .toc-header[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n}\n.manuel-page[_ngcontent-%COMP%]   .toc-container[_ngcontent-%COMP%]   .toc-header[_ngcontent-%COMP%]   .toc-title[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 700;\n  color: #004d80;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.manuel-page[_ngcontent-%COMP%]   .toc-container[_ngcontent-%COMP%]   .toc-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 8px;\n}\n.manuel-page[_ngcontent-%COMP%]   .toc-container[_ngcontent-%COMP%]   .toc-grid[_ngcontent-%COMP%]   .toc-item-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 8px;\n  padding: 8px 12px;\n  text-align: left;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.manuel-page[_ngcontent-%COMP%]   .toc-container[_ngcontent-%COMP%]   .toc-grid[_ngcontent-%COMP%]   .toc-item-btn[_ngcontent-%COMP%]   .toc-num[_ngcontent-%COMP%] {\n  background: #e2e8f0;\n  color: #004d80;\n  font-weight: 800;\n  font-size: 12px;\n  padding: 2px 6px;\n  border-radius: 4px;\n  min-width: 22px;\n  text-align: center;\n}\n.manuel-page[_ngcontent-%COMP%]   .toc-container[_ngcontent-%COMP%]   .toc-grid[_ngcontent-%COMP%]   .toc-item-btn[_ngcontent-%COMP%]   .toc-text[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  font-weight: 600;\n  color: #334155;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.manuel-page[_ngcontent-%COMP%]   .toc-container[_ngcontent-%COMP%]   .toc-grid[_ngcontent-%COMP%]   .toc-item-btn[_ngcontent-%COMP%]:hover {\n  background: #eff6ff;\n  border-color: #93c5fd;\n}\n.manuel-page[_ngcontent-%COMP%]   .toc-container[_ngcontent-%COMP%]   .toc-grid[_ngcontent-%COMP%]   .toc-item-btn[_ngcontent-%COMP%]:hover   .toc-num[_ngcontent-%COMP%] {\n  background: #004d80;\n  color: #ffffff;\n}\n.manuel-page[_ngcontent-%COMP%]   .toc-container[_ngcontent-%COMP%]   .toc-grid[_ngcontent-%COMP%]   .toc-item-btn[_ngcontent-%COMP%]:hover   .toc-text[_ngcontent-%COMP%] {\n  color: #004d80;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);\n  overflow: hidden;\n  scroll-margin-top: 20px;\n  transition: border-color 0.2s ease, box-shadow 0.2s ease;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]:hover {\n  border-color: #cbd5e1;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 18px;\n  padding: 20px 24px;\n  border-bottom: 1px solid #f1f5f9;\n  background: #fafafa;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   .chapter-badge-wrapper[_ngcontent-%COMP%]   .chapter-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 48px;\n  height: 48px;\n  background: #004d80;\n  color: #ffffff;\n  font-size: 18px;\n  font-weight: 800;\n  border-radius: 10px;\n  box-shadow: 0 2px 6px rgba(0, 77, 128, 0.25);\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   .chapter-title-wrapper[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   .chapter-title-wrapper[_ngcontent-%COMP%]   .chapter-meta[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 6px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   .chapter-title-wrapper[_ngcontent-%COMP%]   .chapter-meta[_ngcontent-%COMP%]   .chapter-tag[_ngcontent-%COMP%] {\n  background: #e0f2fe;\n  color: #0369a1;\n  font-size: 11.5px;\n  font-weight: 700;\n  padding: 2px 8px;\n  border-radius: 4px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   .chapter-title-wrapper[_ngcontent-%COMP%]   .chapter-meta[_ngcontent-%COMP%]   .chapter-ref[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: #94a3b8;\n  font-family: monospace;\n  font-weight: 600;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   .chapter-title-wrapper[_ngcontent-%COMP%]   .chapter-title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 17px;\n  font-weight: 700;\n  color: #0f172a;\n  line-height: 1.3;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   .chapter-title-wrapper[_ngcontent-%COMP%]   .chapter-summary[_ngcontent-%COMP%] {\n  margin: 6px 0 0 0;\n  font-size: 13.5px;\n  color: #475569;\n  line-height: 1.5;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   .chapter-title-wrapper[_ngcontent-%COMP%]   .chapter-access-path[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  background: #f1f5f9;\n  border-radius: 6px;\n  padding: 4px 10px;\n  display: inline-flex;\n  gap: 6px;\n  font-size: 12px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   .chapter-title-wrapper[_ngcontent-%COMP%]   .chapter-access-path[_ngcontent-%COMP%]   .path-label[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #004d80;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-header[_ngcontent-%COMP%]   .chapter-title-wrapper[_ngcontent-%COMP%]   .chapter-access-path[_ngcontent-%COMP%]   .path-value[_ngcontent-%COMP%] {\n  color: #334155;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%] {\n  padding: 22px 24px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #f1f5f9;\n  padding-bottom: 20px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n  padding-bottom: 0;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .sub-header-block[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: baseline;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin-bottom: 8px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .sub-header-block[_ngcontent-%COMP%]   .subsection-title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 15px;\n  font-weight: 700;\n  color: #004d80;\n  border-left: 3px solid #004d80;\n  padding-left: 10px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .sub-header-block[_ngcontent-%COMP%]   .sub-access-tag[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: #475569;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  padding: 2px 8px;\n  border-radius: 4px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .sub-header-block[_ngcontent-%COMP%]   .sub-access-tag[_ngcontent-%COMP%]   .tag-title[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #004d80;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .sub-description[_ngcontent-%COMP%] {\n  margin: 0 0 10px 0;\n  font-size: 13.5px;\n  color: #334155;\n  line-height: 1.5;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .subsection-points[_ngcontent-%COMP%] {\n  margin: 0 0 14px 0;\n  padding-left: 20px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .subsection-points[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  color: #334155;\n  font-size: 13.5px;\n  line-height: 1.65;\n  margin-bottom: 6px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .section-label[_ngcontent-%COMP%] {\n  margin: 12px 0 8px 0;\n  font-size: 13px;\n  font-weight: 700;\n  color: #0f172a;\n  text-transform: uppercase;\n  letter-spacing: 0.4px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .fields-section[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .fields-section[_ngcontent-%COMP%]   .table-responsive[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .fields-section[_ngcontent-%COMP%]   .table-responsive[_ngcontent-%COMP%]   .fields-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 12.5px;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 6px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .fields-section[_ngcontent-%COMP%]   .table-responsive[_ngcontent-%COMP%]   .fields-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  color: #004d80;\n  font-weight: 700;\n  padding: 8px 12px;\n  border: 1px solid #cbd5e1;\n  text-align: left;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .fields-section[_ngcontent-%COMP%]   .table-responsive[_ngcontent-%COMP%]   .fields-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n  border: 1px solid #e2e8f0;\n  color: #334155;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .fields-section[_ngcontent-%COMP%]   .table-responsive[_ngcontent-%COMP%]   .fields-table[_ngcontent-%COMP%]   td.field-name[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: #0f172a;\n  white-space: nowrap;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .fields-section[_ngcontent-%COMP%]   .table-responsive[_ngcontent-%COMP%]   .fields-table[_ngcontent-%COMP%]   td.field-type[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-family: monospace;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .fields-section[_ngcontent-%COMP%]   .table-responsive[_ngcontent-%COMP%]   .fields-table[_ngcontent-%COMP%]   td.field-req[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .fields-section[_ngcontent-%COMP%]   .table-responsive[_ngcontent-%COMP%]   .fields-table[_ngcontent-%COMP%]   td.field-req[_ngcontent-%COMP%]   .req-yes[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #991b1b;\n  padding: 2px 6px;\n  border-radius: 4px;\n  font-weight: 700;\n  font-size: 11px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .fields-section[_ngcontent-%COMP%]   .table-responsive[_ngcontent-%COMP%]   .fields-table[_ngcontent-%COMP%]   td.field-req[_ngcontent-%COMP%]   .req-no[_ngcontent-%COMP%] {\n  background: #f1f5f9;\n  color: #64748b;\n  padding: 2px 6px;\n  border-radius: 4px;\n  font-size: 11px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .fields-section[_ngcontent-%COMP%]   .table-responsive[_ngcontent-%COMP%]   .fields-table[_ngcontent-%COMP%]   td.field-desc[_ngcontent-%COMP%] {\n  line-height: 1.5;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .steps-section[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .steps-section[_ngcontent-%COMP%]   .steps-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .steps-section[_ngcontent-%COMP%]   .steps-container[_ngcontent-%COMP%]   .step-card-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 6px;\n  padding: 8px 12px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .steps-section[_ngcontent-%COMP%]   .steps-container[_ngcontent-%COMP%]   .step-card-row[_ngcontent-%COMP%]   .step-idx[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  background: #004d80;\n  color: #ffffff;\n  font-size: 11px;\n  font-weight: 800;\n  border-radius: 50%;\n  flex-shrink: 0;\n  margin-top: 1px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .steps-section[_ngcontent-%COMP%]   .steps-container[_ngcontent-%COMP%]   .step-card-row[_ngcontent-%COMP%]   .step-content[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #1e293b;\n  line-height: 1.5;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .system-behavior-box[_ngcontent-%COMP%] {\n  background: #eff6ff;\n  border-left: 4px solid #0284c7;\n  border-radius: 6px;\n  padding: 10px 14px;\n  margin-top: 12px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .system-behavior-box[_ngcontent-%COMP%]   .sys-label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 12px;\n  font-weight: 700;\n  color: #0369a1;\n  margin-bottom: 4px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .system-behavior-box[_ngcontent-%COMP%]   .sys-text[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: #1e40af;\n  line-height: 1.5;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .controls-checklist-box[_ngcontent-%COMP%] {\n  background: #fefce8;\n  border: 1px solid #fef08a;\n  border-radius: 6px;\n  padding: 10px 14px;\n  margin-top: 12px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .controls-checklist-box[_ngcontent-%COMP%]   .ctrl-label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 12px;\n  font-weight: 700;\n  color: #854d0e;\n  margin-bottom: 4px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .controls-checklist-box[_ngcontent-%COMP%]   .ctrl-list[_ngcontent-%COMP%] {\n  margin: 0;\n  padding-left: 20px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .subsections-list[_ngcontent-%COMP%]   .subsection-item[_ngcontent-%COMP%]   .controls-checklist-box[_ngcontent-%COMP%]   .ctrl-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: #713f12;\n  line-height: 1.5;\n  margin-bottom: 2px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .workflow-box[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-left: 4px solid #004d80;\n  border-radius: 8px;\n  padding: 14px 18px;\n  margin-top: 24px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .workflow-box[_ngcontent-%COMP%]   .wf-title[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 12.5px;\n  font-weight: 800;\n  color: #0f172a;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  margin-bottom: 10px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .workflow-box[_ngcontent-%COMP%]   .wf-steps-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .workflow-box[_ngcontent-%COMP%]   .wf-steps-list[_ngcontent-%COMP%]   .wf-step-card[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border: 1px solid #cbd5e1;\n  border-radius: 6px;\n  padding: 8px 12px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .workflow-box[_ngcontent-%COMP%]   .wf-steps-list[_ngcontent-%COMP%]   .wf-step-card[_ngcontent-%COMP%]   .step-text[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  font-weight: 600;\n  color: #1e293b;\n  line-height: 1.5;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .tips-box[_ngcontent-%COMP%] {\n  background: #f0fdf4;\n  border: 1px solid #bbf7d0;\n  border-radius: 8px;\n  padding: 12px 16px;\n  margin-top: 14px;\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .tips-box[_ngcontent-%COMP%]   .tips-tag[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 700;\n  color: #15803d;\n  white-space: nowrap;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-body[_ngcontent-%COMP%]   .tips-box[_ngcontent-%COMP%]   .tips-text[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: #166534;\n  line-height: 1.5;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  gap: 12px;\n  padding: 14px 24px;\n  background: #f8fafc;\n  border-top: 1px solid #f1f5f9;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-footer[_ngcontent-%COMP%]   .btn-print-chapter[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border: 1px solid #cbd5e1;\n  color: #334155;\n  font-weight: 600;\n  font-size: 13px;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-footer[_ngcontent-%COMP%]   .btn-print-chapter[_ngcontent-%COMP%]:hover {\n  background: #f1f5f9;\n  border-color: #94a3b8;\n  color: #0f172a;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-footer[_ngcontent-%COMP%]   .btn-download-guide[_ngcontent-%COMP%] {\n  background: #004d80;\n  border: 1px solid #004d80;\n  color: #ffffff;\n  font-weight: 700;\n  font-size: 13px;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .chapter-card[_ngcontent-%COMP%]   .chapter-footer[_ngcontent-%COMP%]   .btn-download-guide[_ngcontent-%COMP%]:hover {\n  background: #003357;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .empty-results-card[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border: 1px dashed #cbd5e1;\n  border-radius: 12px;\n  padding: 40px;\n  text-align: center;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .empty-results-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 16px;\n  color: #1e293b;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .empty-results-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 8px 0 16px 0;\n  font-size: 14px;\n  color: #64748b;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .empty-results-card[_ngcontent-%COMP%]   .btn-reset-filter[_ngcontent-%COMP%] {\n  background: #004d80;\n  color: #ffffff;\n  border: none;\n  padding: 8px 18px;\n  border-radius: 6px;\n  font-weight: 600;\n  font-size: 13px;\n  cursor: pointer;\n}\n.manuel-page[_ngcontent-%COMP%]   .guides-list[_ngcontent-%COMP%]   .empty-results-card[_ngcontent-%COMP%]   .btn-reset-filter[_ngcontent-%COMP%]:hover {\n  background: #003357;\n}\n/*# sourceMappingURL=manuel-utilisateur.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ManuelUtilisateurComponent, [{
    type: Component,
    args: [{ selector: "app-manuel-utilisateur", standalone: false, template: `<div class="manuel-page">
  <!-- En-t\xEAte Institutionnel -->
  <div class="page-header">
    <div class="ph-content">
      <div class="ph-badge">BPBF</div>
      <div>
        <h1>Manuel d'Utilisation & Guide Op\xE9rationnel Complet</h1>
        <p>Documentation technique exhaustive, d\xE9marches et manipulations pas-\xE0-pas pour chaque module du SIRH</p>
      </div>
    </div>
    <div class="header-actions">
      <button type="button" class="btn-download-main" (click)="downloadManual('Guide_Utilisateur_SIRH_BPBF.pdf')">
        <span>T\xE9l\xE9charger le Manuel Officiel (PDF - 79 pages)</span>
      </button>
    </div>
  </div>

  <!-- Indicateurs de Couverture & Standard -->
  <div class="doc-stats-banner">
    <div class="stat-item">
      <span class="stat-number">11</span>
      <span class="stat-label">Modules & Chapitres</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <span class="stat-number">100%</span>
      <span class="stat-label">Manipulations Pas-\xE0-Pas D\xE9taill\xE9es</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <span class="stat-number">v12.0.7</span>
      <span class="stat-label">R\xE9f\xE9rentiel ResHum Dz / SIRH v3</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <span class="stat-number">BPBF</span>
      <span class="stat-label">Conformit\xE9 Bancaire & Bar\xE8me IUTS 2024</span>
    </div>
  </div>

  <!-- Barre de Recherche et Filtres -->
  <mat-card class="search-card">
    <mat-card-content>
      <div class="search-box-row">
        <div class="search-input-container">
          <input
            type="text"
            class="search-input-custom"
            [(ngModel)]="searchQuery"
            (ngModelChange)="applyFilter()"
            placeholder="Rechercher une manipulation, un champ, une \xE9tape (ex: matricule, virement, \xE9chelon, calcul paie, cnss, bon de soins)..."
          />
          @if (searchQuery) {
            <button type="button" class="btn-clear-search" (click)="resetSearch()">Effacer</button>
          }
        </div>
      </div>

      <!-- Filtres par cat\xE9gorie -->
      <div class="categories-bar">
        <span class="cat-label">Domaines :</span>
        <div class="cat-chips">
          @for (cat of categories; track cat) {
            <button
              type="button"
              class="cat-chip"
              [class.active]="selectedCategory === cat"
              (click)="setCategory(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>
      </div>
    </mat-card-content>
  </mat-card>

  <!-- Table des Mati\xE8res Express (Acc\xE8s Rapide) -->
  <div class="toc-container">
    <div class="toc-header">
      <span class="toc-title">Table des mati\xE8res \u2014 Acc\xE8s direct aux manipulations de chaque module :</span>
    </div>
    <div class="toc-grid">
      @for (c of chapters; track c.id) {
        <button type="button" class="toc-item-btn" (click)="scrollToChapter(c.id)">
          <span class="toc-num">{{ c.number }}</span>
          <span class="toc-text">{{ c.title.split(':')[1] || c.title }}</span>
        </button>
      }
    </div>
  </div>

  <!-- Liste des Chapitres avec D\xE9tails Op\xE9rationnels -->
  <div class="guides-list">
    @for (chapter of filteredChapters; track chapter.id) {
      <div class="chapter-card" [id]="chapter.id">
        <!-- En-t\xEAte de Chapitre -->
        <div class="chapter-header">
          <div class="chapter-badge-wrapper">
            <span class="chapter-badge">{{ chapter.number }}</span>
          </div>
          <div class="chapter-title-wrapper">
            <div class="chapter-meta">
              <span class="chapter-tag">{{ chapter.category }}</span>
              <span class="chapter-ref">SIRH-BPBF-DOC-{{ chapter.number }}</span>
            </div>
            <h2 class="chapter-title">{{ chapter.title }}</h2>
            <p class="chapter-summary">{{ chapter.summary }}</p>
            <div class="chapter-access-path">
              <span class="path-label">Acc\xE8s dans l'application :</span>
              <span class="path-value">{{ chapter.accessPath }}</span>
            </div>
          </div>
        </div>

        <!-- Corps du Chapitre : Sous-sections d\xE9taill\xE9es -->
        <div class="chapter-body">
          <div class="subsections-list">
            @for (sub of chapter.subsections; track sub.title) {
              <div class="subsection-item">
                <div class="sub-header-block">
                  <h3 class="subsection-title">{{ sub.title }}</h3>
                  @if (sub.accessPath) {
                    <div class="sub-access-tag">
                      <span class="tag-title">Chemin :</span> {{ sub.accessPath }}
                    </div>
                  }
                </div>

                @if (sub.description) {
                  <p class="sub-description">{{ sub.description }}</p>
                }

                <!-- Points cl\xE9s d'explication -->
                @if (sub.points && sub.points.length > 0) {
                  <ul class="subsection-points">
                    @for (pt of sub.points; track pt) {
                      <li>{{ pt }}</li>
                    }
                  </ul>
                }

                <!-- Tableau exhaustif des champs de formulaire -->
                @if (sub.fields && sub.fields.length > 0) {
                  <div class="fields-section">
                    <h4 class="section-label">Champs du formulaire & R\xE8gles de saisie :</h4>
                    <div class="table-responsive">
                      <table class="fields-table">
                        <thead>
                          <tr>
                            <th>Nom du Champ</th>
                            <th>Type de Donn\xE9e</th>
                            <th>Obligation</th>
                            <th>Description & R\xE8gle de Gestion</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (field of sub.fields; track field.name) {
                            <tr>
                              <td class="field-name">{{ field.name }}</td>
                              <td class="field-type">{{ field.type }}</td>
                              <td class="field-req">
                                <span [class.req-yes]="field.required" [class.req-no]="!field.required">
                                  {{ field.required ? 'Obligatoire' : 'Optionnel' }}
                                </span>
                              </td>
                              <td class="field-desc">{{ field.description }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                }

                <!-- Manipulations pas-\xE0-pas -->
                @if (sub.steps && sub.steps.length > 0) {
                  <div class="steps-section">
                    <h4 class="section-label">Manipulations & Clics \xE9tape par \xE9tape :</h4>
                    <div class="steps-container">
                      @for (st of sub.steps; track st; let i = $index) {
                        <div class="step-card-row">
                          <span class="step-idx">{{ i + 1 }}</span>
                          <span class="step-content">{{ st }}</span>
                        </div>
                      }
                    </div>
                  </div>
                }

                <!-- Comportement & Contr\xF4les du syst\xE8me -->
                @if (sub.systemBehavior) {
                  <div class="system-behavior-box">
                    <span class="sys-label">Comportement & Contr\xF4les automatiques du syst\xE8me :</span>
                    <span class="sys-text">{{ sub.systemBehavior }}</span>
                  </div>
                }

                <!-- V\xE9rifications pr\xE9alables & contr\xF4les qualit\xE9 -->
                @if (sub.controls && sub.controls.length > 0) {
                  <div class="controls-checklist-box">
                    <span class="ctrl-label">V\xE9rifications obligatoires :</span>
                    <ul class="ctrl-list">
                      @for (ctrl of sub.controls; track ctrl) {
                        <li>{{ ctrl }}</li>
                      }
                    </ul>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Proc\xE9dure Recommand\xE9e Pas-\xE0-Pas (Workflow G\xE9n\xE9ral) -->
          @if (chapter.workflow && chapter.workflow.length > 0) {
            <div class="workflow-box">
              <span class="wf-title">Cycle Global Op\xE9rationnel Recommand\xE9 :</span>
              <div class="wf-steps-list">
                @for (step of chapter.workflow; track step) {
                  <div class="wf-step-card">
                    <span class="step-text">{{ step }}</span>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Note / Bonne Pratique Institutionnelle BPBF -->
          @if (chapter.tips) {
            <div class="tips-box">
              <span class="tips-tag">R\xE8gle M\xE9tier & Conformit\xE9 Bancaire BPBF :</span>
              <span class="tips-text">{{ chapter.tips }}</span>
            </div>
          }
        </div>

        <!-- Actions de Chapitre -->
        <div class="chapter-footer">
          <button type="button" class="btn-print-chapter" (click)="printChapter(chapter)">
            <span>Imprimer la Fiche Manipulations</span>
          </button>
          <button type="button" class="btn-download-guide" (click)="downloadManual('Guide_Utilisateur_SIRH_BPBF.pdf')">
            <span>T\xE9l\xE9charger le Guide PDF Complet</span>
          </button>
        </div>
      </div>
    }

    <!-- \xC9tat Aucun R\xE9sultat -->
    @if (filteredChapters.length === 0) {
      <div class="empty-results-card">
        <h3>Aucun chapitre ne correspond \xE0 votre recherche</h3>
        <p>Aucun r\xE9sultat pour le mot-cl\xE9 \xAB <strong>{{ searchQuery }}</strong> \xBB dans la cat\xE9gorie s\xE9lectionn\xE9e.</p>
        <button type="button" class="btn-reset-filter" (click)="resetSearch()">
          <span>R\xE9initialiser la recherche</span>
        </button>
      </div>
    }
  </div>
</div>
`, styles: ["/* src/app/features/profils/manuel-utilisateur/manuel-utilisateur.component.scss */\n.manuel-page {\n  padding: 24px;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.manuel-page .page-header {\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 20px 24px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 20px;\n  margin-bottom: 20px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);\n}\n.manuel-page .page-header .ph-content {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.manuel-page .page-header .ph-content .ph-badge {\n  background: #004d80;\n  color: #ffffff;\n  font-weight: 800;\n  font-size: 16px;\n  padding: 8px 14px;\n  border-radius: 8px;\n  letter-spacing: 1px;\n}\n.manuel-page .page-header .ph-content h1 {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 700;\n  color: #0f172a;\n}\n.manuel-page .page-header .ph-content p {\n  margin: 4px 0 0 0;\n  font-size: 13.5px;\n  color: #64748b;\n}\n.manuel-page .page-header .btn-download-main {\n  background: #004d80;\n  color: #ffffff;\n  font-weight: 700;\n  font-size: 13.5px;\n  padding: 12px 20px;\n  border-radius: 8px;\n  border: none;\n  cursor: pointer;\n  transition: background 0.2s ease, transform 0.1s ease;\n  white-space: nowrap;\n}\n.manuel-page .page-header .btn-download-main:hover {\n  background: #003357;\n  transform: translateY(-1px);\n}\n.manuel-page .page-header .btn-download-main:active {\n  transform: translateY(0);\n}\n.manuel-page .doc-stats-banner {\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 14px 24px;\n  display: flex;\n  align-items: center;\n  justify-content: space-around;\n  margin-bottom: 20px;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.manuel-page .doc-stats-banner .stat-item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n.manuel-page .doc-stats-banner .stat-item .stat-number {\n  font-size: 18px;\n  font-weight: 800;\n  color: #004d80;\n}\n.manuel-page .doc-stats-banner .stat-item .stat-label {\n  font-size: 12px;\n  font-weight: 600;\n  color: #475569;\n  margin-top: 2px;\n}\n.manuel-page .doc-stats-banner .stat-divider {\n  width: 1px;\n  height: 28px;\n  background: #cbd5e1;\n}\n.manuel-page .search-card {\n  border-radius: 12px;\n  border: 1px solid #e2e8f0;\n  margin-bottom: 20px;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);\n}\n.manuel-page .search-card mat-card-content {\n  padding: 18px 20px !important;\n}\n.manuel-page .search-card .search-box-row {\n  margin-bottom: 14px;\n}\n.manuel-page .search-card .search-box-row .search-input-container {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.manuel-page .search-card .search-box-row .search-input-container .search-input-custom {\n  width: 100%;\n  padding: 12px 90px 12px 16px;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  font-size: 14px;\n  color: #1e293b;\n  outline: none;\n  transition: border-color 0.2s ease, box-shadow 0.2s ease;\n}\n.manuel-page .search-card .search-box-row .search-input-container .search-input-custom:focus {\n  border-color: #004d80;\n  box-shadow: 0 0 0 3px rgba(0, 77, 128, 0.12);\n}\n.manuel-page .search-card .search-box-row .search-input-container .search-input-custom::placeholder {\n  color: #94a3b8;\n}\n.manuel-page .search-card .search-box-row .search-input-container .btn-clear-search {\n  position: absolute;\n  right: 12px;\n  background: #f1f5f9;\n  border: 1px solid #cbd5e1;\n  color: #475569;\n  font-size: 12px;\n  font-weight: 600;\n  padding: 4px 10px;\n  border-radius: 6px;\n  cursor: pointer;\n}\n.manuel-page .search-card .search-box-row .search-input-container .btn-clear-search:hover {\n  background: #e2e8f0;\n  color: #0f172a;\n}\n.manuel-page .search-card .categories-bar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.manuel-page .search-card .categories-bar .cat-label {\n  font-size: 12.5px;\n  font-weight: 700;\n  color: #475569;\n}\n.manuel-page .search-card .categories-bar .cat-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.manuel-page .search-card .categories-bar .cat-chips .cat-chip {\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  color: #475569;\n  font-size: 12px;\n  font-weight: 600;\n  padding: 5px 12px;\n  border-radius: 20px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.manuel-page .search-card .categories-bar .cat-chips .cat-chip:hover {\n  background: #f1f5f9;\n  border-color: #cbd5e1;\n  color: #0f172a;\n}\n.manuel-page .search-card .categories-bar .cat-chips .cat-chip.active {\n  background: #004d80;\n  border-color: #004d80;\n  color: #ffffff;\n  font-weight: 700;\n}\n.manuel-page .toc-container {\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 16px 20px;\n  margin-bottom: 24px;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);\n}\n.manuel-page .toc-container .toc-header {\n  margin-bottom: 12px;\n}\n.manuel-page .toc-container .toc-header .toc-title {\n  font-size: 13px;\n  font-weight: 700;\n  color: #004d80;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.manuel-page .toc-container .toc-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 8px;\n}\n.manuel-page .toc-container .toc-grid .toc-item-btn {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 8px;\n  padding: 8px 12px;\n  text-align: left;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.manuel-page .toc-container .toc-grid .toc-item-btn .toc-num {\n  background: #e2e8f0;\n  color: #004d80;\n  font-weight: 800;\n  font-size: 12px;\n  padding: 2px 6px;\n  border-radius: 4px;\n  min-width: 22px;\n  text-align: center;\n}\n.manuel-page .toc-container .toc-grid .toc-item-btn .toc-text {\n  font-size: 12.5px;\n  font-weight: 600;\n  color: #334155;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.manuel-page .toc-container .toc-grid .toc-item-btn:hover {\n  background: #eff6ff;\n  border-color: #93c5fd;\n}\n.manuel-page .toc-container .toc-grid .toc-item-btn:hover .toc-num {\n  background: #004d80;\n  color: #ffffff;\n}\n.manuel-page .toc-container .toc-grid .toc-item-btn:hover .toc-text {\n  color: #004d80;\n}\n.manuel-page .guides-list {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.manuel-page .guides-list .chapter-card {\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);\n  overflow: hidden;\n  scroll-margin-top: 20px;\n  transition: border-color 0.2s ease, box-shadow 0.2s ease;\n}\n.manuel-page .guides-list .chapter-card:hover {\n  border-color: #cbd5e1;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);\n}\n.manuel-page .guides-list .chapter-card .chapter-header {\n  display: flex;\n  gap: 18px;\n  padding: 20px 24px;\n  border-bottom: 1px solid #f1f5f9;\n  background: #fafafa;\n}\n.manuel-page .guides-list .chapter-card .chapter-header .chapter-badge-wrapper .chapter-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 48px;\n  height: 48px;\n  background: #004d80;\n  color: #ffffff;\n  font-size: 18px;\n  font-weight: 800;\n  border-radius: 10px;\n  box-shadow: 0 2px 6px rgba(0, 77, 128, 0.25);\n}\n.manuel-page .guides-list .chapter-card .chapter-header .chapter-title-wrapper {\n  flex: 1;\n}\n.manuel-page .guides-list .chapter-card .chapter-header .chapter-title-wrapper .chapter-meta {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 6px;\n}\n.manuel-page .guides-list .chapter-card .chapter-header .chapter-title-wrapper .chapter-meta .chapter-tag {\n  background: #e0f2fe;\n  color: #0369a1;\n  font-size: 11.5px;\n  font-weight: 700;\n  padding: 2px 8px;\n  border-radius: 4px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.manuel-page .guides-list .chapter-card .chapter-header .chapter-title-wrapper .chapter-meta .chapter-ref {\n  font-size: 11.5px;\n  color: #94a3b8;\n  font-family: monospace;\n  font-weight: 600;\n}\n.manuel-page .guides-list .chapter-card .chapter-header .chapter-title-wrapper .chapter-title {\n  margin: 0;\n  font-size: 17px;\n  font-weight: 700;\n  color: #0f172a;\n  line-height: 1.3;\n}\n.manuel-page .guides-list .chapter-card .chapter-header .chapter-title-wrapper .chapter-summary {\n  margin: 6px 0 0 0;\n  font-size: 13.5px;\n  color: #475569;\n  line-height: 1.5;\n}\n.manuel-page .guides-list .chapter-card .chapter-header .chapter-title-wrapper .chapter-access-path {\n  margin-top: 8px;\n  background: #f1f5f9;\n  border-radius: 6px;\n  padding: 4px 10px;\n  display: inline-flex;\n  gap: 6px;\n  font-size: 12px;\n}\n.manuel-page .guides-list .chapter-card .chapter-header .chapter-title-wrapper .chapter-access-path .path-label {\n  font-weight: 700;\n  color: #004d80;\n}\n.manuel-page .guides-list .chapter-card .chapter-header .chapter-title-wrapper .chapter-access-path .path-value {\n  color: #334155;\n}\n.manuel-page .guides-list .chapter-card .chapter-body {\n  padding: 22px 24px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item {\n  border-bottom: 1px solid #f1f5f9;\n  padding-bottom: 20px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item:last-child {\n  border-bottom: none;\n  padding-bottom: 0;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .sub-header-block {\n  display: flex;\n  justify-content: space-between;\n  align-items: baseline;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin-bottom: 8px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .sub-header-block .subsection-title {\n  margin: 0;\n  font-size: 15px;\n  font-weight: 700;\n  color: #004d80;\n  border-left: 3px solid #004d80;\n  padding-left: 10px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .sub-header-block .sub-access-tag {\n  font-size: 11.5px;\n  color: #475569;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  padding: 2px 8px;\n  border-radius: 4px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .sub-header-block .sub-access-tag .tag-title {\n  font-weight: 700;\n  color: #004d80;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .sub-description {\n  margin: 0 0 10px 0;\n  font-size: 13.5px;\n  color: #334155;\n  line-height: 1.5;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .subsection-points {\n  margin: 0 0 14px 0;\n  padding-left: 20px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .subsection-points li {\n  color: #334155;\n  font-size: 13.5px;\n  line-height: 1.65;\n  margin-bottom: 6px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .section-label {\n  margin: 12px 0 8px 0;\n  font-size: 13px;\n  font-weight: 700;\n  color: #0f172a;\n  text-transform: uppercase;\n  letter-spacing: 0.4px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .fields-section {\n  margin-top: 14px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .fields-section .table-responsive {\n  overflow-x: auto;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .fields-section .table-responsive .fields-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 12.5px;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 6px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .fields-section .table-responsive .fields-table th {\n  background: #f8fafc;\n  color: #004d80;\n  font-weight: 700;\n  padding: 8px 12px;\n  border: 1px solid #cbd5e1;\n  text-align: left;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .fields-section .table-responsive .fields-table td {\n  padding: 8px 12px;\n  border: 1px solid #e2e8f0;\n  color: #334155;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .fields-section .table-responsive .fields-table td.field-name {\n  font-weight: 700;\n  color: #0f172a;\n  white-space: nowrap;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .fields-section .table-responsive .fields-table td.field-type {\n  color: #64748b;\n  font-family: monospace;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .fields-section .table-responsive .fields-table td.field-req {\n  white-space: nowrap;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .fields-section .table-responsive .fields-table td.field-req .req-yes {\n  background: #fee2e2;\n  color: #991b1b;\n  padding: 2px 6px;\n  border-radius: 4px;\n  font-weight: 700;\n  font-size: 11px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .fields-section .table-responsive .fields-table td.field-req .req-no {\n  background: #f1f5f9;\n  color: #64748b;\n  padding: 2px 6px;\n  border-radius: 4px;\n  font-size: 11px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .fields-section .table-responsive .fields-table td.field-desc {\n  line-height: 1.5;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .steps-section {\n  margin-top: 14px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .steps-section .steps-container {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .steps-section .steps-container .step-card-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 6px;\n  padding: 8px 12px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .steps-section .steps-container .step-card-row .step-idx {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  background: #004d80;\n  color: #ffffff;\n  font-size: 11px;\n  font-weight: 800;\n  border-radius: 50%;\n  flex-shrink: 0;\n  margin-top: 1px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .steps-section .steps-container .step-card-row .step-content {\n  font-size: 13px;\n  color: #1e293b;\n  line-height: 1.5;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .system-behavior-box {\n  background: #eff6ff;\n  border-left: 4px solid #0284c7;\n  border-radius: 6px;\n  padding: 10px 14px;\n  margin-top: 12px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .system-behavior-box .sys-label {\n  display: block;\n  font-size: 12px;\n  font-weight: 700;\n  color: #0369a1;\n  margin-bottom: 4px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .system-behavior-box .sys-text {\n  font-size: 12.5px;\n  color: #1e40af;\n  line-height: 1.5;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .controls-checklist-box {\n  background: #fefce8;\n  border: 1px solid #fef08a;\n  border-radius: 6px;\n  padding: 10px 14px;\n  margin-top: 12px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .controls-checklist-box .ctrl-label {\n  display: block;\n  font-size: 12px;\n  font-weight: 700;\n  color: #854d0e;\n  margin-bottom: 4px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .controls-checklist-box .ctrl-list {\n  margin: 0;\n  padding-left: 20px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .subsections-list .subsection-item .controls-checklist-box .ctrl-list li {\n  font-size: 12.5px;\n  color: #713f12;\n  line-height: 1.5;\n  margin-bottom: 2px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .workflow-box {\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-left: 4px solid #004d80;\n  border-radius: 8px;\n  padding: 14px 18px;\n  margin-top: 24px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .workflow-box .wf-title {\n  display: block;\n  font-size: 12.5px;\n  font-weight: 800;\n  color: #0f172a;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  margin-bottom: 10px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .workflow-box .wf-steps-list {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .workflow-box .wf-steps-list .wf-step-card {\n  background: #ffffff;\n  border: 1px solid #cbd5e1;\n  border-radius: 6px;\n  padding: 8px 12px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .workflow-box .wf-steps-list .wf-step-card .step-text {\n  font-size: 12.5px;\n  font-weight: 600;\n  color: #1e293b;\n  line-height: 1.5;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .tips-box {\n  background: #f0fdf4;\n  border: 1px solid #bbf7d0;\n  border-radius: 8px;\n  padding: 12px 16px;\n  margin-top: 14px;\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .tips-box .tips-tag {\n  font-size: 12px;\n  font-weight: 700;\n  color: #15803d;\n  white-space: nowrap;\n}\n.manuel-page .guides-list .chapter-card .chapter-body .tips-box .tips-text {\n  font-size: 12.5px;\n  color: #166534;\n  line-height: 1.5;\n}\n.manuel-page .guides-list .chapter-card .chapter-footer {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  gap: 12px;\n  padding: 14px 24px;\n  background: #f8fafc;\n  border-top: 1px solid #f1f5f9;\n}\n.manuel-page .guides-list .chapter-card .chapter-footer .btn-print-chapter {\n  background: #ffffff;\n  border: 1px solid #cbd5e1;\n  color: #334155;\n  font-weight: 600;\n  font-size: 13px;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.manuel-page .guides-list .chapter-card .chapter-footer .btn-print-chapter:hover {\n  background: #f1f5f9;\n  border-color: #94a3b8;\n  color: #0f172a;\n}\n.manuel-page .guides-list .chapter-card .chapter-footer .btn-download-guide {\n  background: #004d80;\n  border: 1px solid #004d80;\n  color: #ffffff;\n  font-weight: 700;\n  font-size: 13px;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.manuel-page .guides-list .chapter-card .chapter-footer .btn-download-guide:hover {\n  background: #003357;\n}\n.manuel-page .guides-list .empty-results-card {\n  background: #ffffff;\n  border: 1px dashed #cbd5e1;\n  border-radius: 12px;\n  padding: 40px;\n  text-align: center;\n}\n.manuel-page .guides-list .empty-results-card h3 {\n  margin: 0;\n  font-size: 16px;\n  color: #1e293b;\n}\n.manuel-page .guides-list .empty-results-card p {\n  margin: 8px 0 16px 0;\n  font-size: 14px;\n  color: #64748b;\n}\n.manuel-page .guides-list .empty-results-card .btn-reset-filter {\n  background: #004d80;\n  color: #ffffff;\n  border: none;\n  padding: 8px 18px;\n  border-radius: 6px;\n  font-weight: 600;\n  font-size: 13px;\n  cursor: pointer;\n}\n.manuel-page .guides-list .empty-results-card .btn-reset-filter:hover {\n  background: #003357;\n}\n/*# sourceMappingURL=manuel-utilisateur.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ManuelUtilisateurComponent, { className: "ManuelUtilisateurComponent", filePath: "src/app/features/profils/manuel-utilisateur/manuel-utilisateur.component.ts", lineNumber: 10 });
})();

// src/app/features/profils/profils-routing.module.ts
var routes = [
  { path: "", component: ProfilsOverviewComponent },
  { path: "roles", component: RolesListComponent },
  { path: "habilitations", component: HabilitationsMatrixComponent },
  { path: "utilisateurs", component: UsersListComponent },
  { path: "manuel", component: ManuelUtilisateurComponent },
  { path: "guides", component: ManuelUtilisateurComponent },
  { path: "**", redirectTo: "" }
];
var ProfilsRoutingModule = class _ProfilsRoutingModule {
  static \u0275fac = function ProfilsRoutingModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfilsRoutingModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _ProfilsRoutingModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfilsRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    }]
  }], null, null);
})();

// src/app/features/profils/profils.module.ts
var ProfilsModule = class _ProfilsModule {
  static \u0275fac = function ProfilsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfilsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _ProfilsModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProfilsRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfilsModule, [{
    type: NgModule,
    args: [{
      declarations: [
        ProfilsOverviewComponent,
        RolesListComponent,
        HabilitationsMatrixComponent,
        UsersListComponent,
        ManuelUtilisateurComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProfilsRoutingModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTooltipModule
      ]
    }]
  }], null, null);
})();
export {
  ProfilsModule
};
//# sourceMappingURL=chunk-OBBG7VD4.js.map
