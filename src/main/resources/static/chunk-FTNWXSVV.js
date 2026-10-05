import {
  fr_default
} from "./chunk-HCBFNYDI.js";
import {
  ModuleNavService
} from "./chunk-RXXLECU7.js";
import "./chunk-X5O3HNQ4.js";
import {
  MatCard,
  MatCardContent,
  MatCardModule
} from "./chunk-FKBUH6YP.js";
import "./chunk-IY67KAVO.js";
import "./chunk-DODELRSD.js";
import {
  MatButtonModule,
  MatIcon,
  MatIconModule,
  MatRipple,
  MatRippleModule
} from "./chunk-HVOECBWJ.js";
import {
  CommonModule,
  Component,
  DatePipe,
  LOCALE_ID,
  NgModule,
  Router,
  RouterModule,
  registerLocaleData,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-YWFD3R2X.js";

// src/app/features/dashboard/dashboard.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function DashboardComponent_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-card", 3);
    \u0275\u0275listener("click", function DashboardComponent_For_3_Template_mat_card_click_0_listener() {
      const mod_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openModule(mod_r2));
    });
    \u0275\u0275elementStart(1, "mat-card-content")(2, "div", 4)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 5)(6, "h3");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "mat-icon", 6);
    \u0275\u0275text(11, "arrow_forward");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const mod_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background", "linear-gradient(135deg, " + mod_r2.gradientFrom + ", " + mod_r2.gradientTo + ")");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mod_r2.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(mod_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mod_r2.description);
  }
}
var DashboardComponent = class _DashboardComponent {
  moduleNav;
  router;
  constructor(moduleNav, router) {
    this.moduleNav = moduleNav;
    this.router = router;
  }
  openModule(mod) {
    this.moduleNav.selectModule(mod);
    this.router.navigate([mod.route]);
  }
  static \u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardComponent)(\u0275\u0275directiveInject(ModuleNavService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], standalone: false, decls: 4, vars: 0, consts: [[1, "dashboard"], [1, "modules-grid"], ["matRipple", "", 1, "module-card"], ["matRipple", "", 1, "module-card", 3, "click"], [1, "module-icon"], [1, "module-info"], [1, "arrow"]], template: function DashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275repeaterCreate(2, DashboardComponent_For_3_Template, 12, 5, "mat-card", 2, _forTrack0);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.moduleNav.modules);
    }
  }, dependencies: [MatCard, MatCardContent, MatIcon, MatRipple], styles: ["\n\n.dashboard[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: calc(100vh - 116px);\n}\n.modules-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 20px;\n  width: 100%;\n  max-width: 760px;\n}\n@media (max-width: 600px) {\n  .modules-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.module-card[_ngcontent-%COMP%] {\n  border-radius: 18px !important;\n  border: 1px solid var(--border) !important;\n  background: var(--surface) !important;\n  box-shadow: var(--shadow-card) !important;\n  cursor: pointer;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.module-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;\n  border-color: transparent !important;\n}\n.module-card[_ngcontent-%COMP%]:hover   .arrow[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: translateX(4px);\n}\n.module-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 18px;\n  padding: 24px !important;\n}\n.module-icon[_ngcontent-%COMP%] {\n  width: 60px;\n  height: 60px;\n  border-radius: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.module-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 30px;\n  width: 30px;\n  height: 30px;\n  color: #fff;\n}\n.module-info[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.module-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 15px;\n  font-weight: 700;\n  color: var(--on-surface);\n  margin: 0 0 4px;\n}\n.module-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--on-surface-3);\n  margin: 0;\n  line-height: 1.4;\n}\n.arrow[_ngcontent-%COMP%] {\n  color: var(--on-surface-3);\n  opacity: 0;\n  transition: opacity 0.2s, transform 0.2s;\n}\n/*# sourceMappingURL=dashboard.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardComponent, [{
    type: Component,
    args: [{ selector: "app-dashboard", standalone: false, template: `<div class="dashboard">\r
  <div class="modules-grid">\r
    @for (mod of moduleNav.modules; track mod.id) {\r
      <mat-card class="module-card" (click)="openModule(mod)" matRipple>\r
        <mat-card-content>\r
          <div class="module-icon"\r
               [style.background]="'linear-gradient(135deg, ' + mod.gradientFrom + ', ' + mod.gradientTo + ')'">\r
            <mat-icon>{{ mod.icon }}</mat-icon>\r
          </div>\r
          <div class="module-info">\r
            <h3>{{ mod.name }}</h3>\r
            <p>{{ mod.description }}</p>\r
          </div>\r
          <mat-icon class="arrow">arrow_forward</mat-icon>\r
        </mat-card-content>\r
      </mat-card>\r
    }\r
  </div>\r
</div>\r
`, styles: ["/* src/app/features/dashboard/dashboard.component.scss */\n.dashboard {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: calc(100vh - 116px);\n}\n.modules-grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 20px;\n  width: 100%;\n  max-width: 760px;\n}\n@media (max-width: 600px) {\n  .modules-grid {\n    grid-template-columns: 1fr;\n  }\n}\n.module-card {\n  border-radius: 18px !important;\n  border: 1px solid var(--border) !important;\n  background: var(--surface) !important;\n  box-shadow: var(--shadow-card) !important;\n  cursor: pointer;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.module-card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;\n  border-color: transparent !important;\n}\n.module-card:hover .arrow {\n  opacity: 1;\n  transform: translateX(4px);\n}\n.module-card mat-card-content {\n  display: flex;\n  align-items: center;\n  gap: 18px;\n  padding: 24px !important;\n}\n.module-icon {\n  width: 60px;\n  height: 60px;\n  border-radius: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.module-icon mat-icon {\n  font-size: 30px;\n  width: 30px;\n  height: 30px;\n  color: #fff;\n}\n.module-info {\n  flex: 1;\n  min-width: 0;\n}\n.module-info h3 {\n  font-size: 15px;\n  font-weight: 700;\n  color: var(--on-surface);\n  margin: 0 0 4px;\n}\n.module-info p {\n  font-size: 12px;\n  color: var(--on-surface-3);\n  margin: 0;\n  line-height: 1.4;\n}\n.arrow {\n  color: var(--on-surface-3);\n  opacity: 0;\n  transition: opacity 0.2s, transform 0.2s;\n}\n/*# sourceMappingURL=dashboard.component.css.map */\n"] }]
  }], () => [{ type: ModuleNavService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/features/dashboard/dashboard.component.ts", lineNumber: 12 });
})();

// src/app/features/dashboard/dashboard-routing.module.ts
var routes = [
  { path: "", component: DashboardComponent }
];
var DashboardRoutingModule = class _DashboardRoutingModule {
  static \u0275fac = function DashboardRoutingModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardRoutingModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _DashboardRoutingModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    }]
  }], null, null);
})();

// src/app/features/dashboard/dashboard.module.ts
registerLocaleData(fr_default);
var DashboardModule = class _DashboardModule {
  static \u0275fac = function DashboardModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _DashboardModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: "fr" }
  ], imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardModule, [{
    type: NgModule,
    args: [{
      declarations: [DashboardComponent],
      imports: [
        CommonModule,
        RouterModule,
        DashboardRoutingModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule
      ],
      providers: [
        DatePipe,
        { provide: LOCALE_ID, useValue: "fr" }
      ]
    }]
  }], null, null);
})();
export {
  DashboardModule
};
//# sourceMappingURL=chunk-FTNWXSVV.js.map
