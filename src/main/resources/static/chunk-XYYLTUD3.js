import {
  MatCheckboxModule
} from "./chunk-CKOOLDOC.js";
import {
  AuthService
} from "./chunk-ONRSPQJH.js";
import {
  MatProgressSpinnerModule
} from "./chunk-6MCDZOYW.js";
import {
  MatFormFieldModule,
  MatInputModule
} from "./chunk-ERAYOYWZ.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-FA5ALSQZ.js";
import {
  MatCardModule
} from "./chunk-FKBUH6YP.js";
import "./chunk-IY67KAVO.js";
import {
  MatButtonModule,
  MatIcon,
  MatIconModule
} from "./chunk-HVOECBWJ.js";
import {
  CommonModule,
  Component,
  NgModule,
  Router,
  RouterModule,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-YWFD3R2X.js";

// src/app/features/auth/login/login.component.ts
function LoginComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
function LoginComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18)(1, "mat-icon");
    \u0275\u0275text(2, "sync");
    \u0275\u0275elementEnd()();
  }
}
function LoginComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "lock");
    \u0275\u0275elementEnd();
  }
}
var LoginComponent = class _LoginComponent {
  fb;
  authService;
  router;
  loginForm;
  loading = false;
  hidePassword = true;
  error = "";
  features = [
    { icon: "people", title: "Gestion des collaborateurs", desc: "Fiches employ\xE9s, contrats, organigramme" },
    { icon: "payments", title: "Paie automatis\xE9e", desc: "Bulletins, d\xE9clarations DSN, URSSAF" },
    { icon: "trending_up", title: "Carri\xE8res & Comp\xE9tences", desc: "Formations, \xE9valuations, mobilit\xE9" },
    { icon: "storage", title: "Donn\xE9es centralis\xE9es", desc: "Structure, param\xE8tres, calendriers" }
  ];
  constructor(fb, authService, router) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.loginForm = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", Validators.required]
    });
  }
  onSubmit() {
    if (this.loginForm.invalid)
      return;
    this.loading = true;
    this.error = "";
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;
        if (this.authService.isAgentRole(user.role)) {
          this.router.navigate(["/mon-espace"]);
        } else {
          this.router.navigate(["/dashboard"]);
        }
      },
      error: () => {
        this.loading = false;
        this.error = "Email ou mot de passe incorrect.";
      }
    });
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], standalone: false, decls: 32, vars: 7, consts: [[1, "login-wrapper"], [1, "bg-orb", "orb-1"], [1, "bg-orb", "orb-2"], [1, "bg-orb", "orb-3"], [1, "login-card"], [1, "login-logo-container"], ["src", "bpbf-login-logo.png", "alt", "Banque Postale du Burkina Faso", 1, "login-brand-logo"], [1, "card-header"], [1, "login-form", 3, "ngSubmit", "formGroup"], [1, "field-group"], [1, "field-label"], [1, "input-wrapper"], ["type", "email", "formControlName", "email", "placeholder", "ex: marie.dupont@sirh.bf", "autocomplete", "username", 1, "field-input"], [1, "input-wrapper", "pw-wrapper"], ["formControlName", "password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", "autocomplete", "current-password", 1, "field-input", 3, "type"], ["type", "button", 1, "pw-toggle", 3, "click"], [1, "error-msg"], ["type", "submit", 1, "submit-btn", 3, "disabled"], [1, "spin-icon"], [1, "card-footer"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275elementStart(4, "div", 4)(5, "div", 5);
      \u0275\u0275element(6, "img", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 7)(8, "h1");
      \u0275\u0275text(9, "Connexion");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "form", 8);
      \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_10_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(11, "div", 9)(12, "label", 10);
      \u0275\u0275text(13, "Matricule / Identifiant");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 11);
      \u0275\u0275element(15, "input", 12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 9)(17, "label", 10);
      \u0275\u0275text(18, "Mot de passe");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 13);
      \u0275\u0275element(20, "input", 14);
      \u0275\u0275elementStart(21, "button", 15);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_21_listener() {
        return ctx.hidePassword = !ctx.hidePassword;
      });
      \u0275\u0275elementStart(22, "mat-icon");
      \u0275\u0275text(23);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(24, LoginComponent_Conditional_24_Template, 5, 1, "div", 16);
      \u0275\u0275elementStart(25, "button", 17);
      \u0275\u0275conditionalCreate(26, LoginComponent_Conditional_26_Template, 3, 0, "span", 18)(27, LoginComponent_Conditional_27_Template, 2, 0, "mat-icon");
      \u0275\u0275elementStart(28, "span");
      \u0275\u0275text(29, "S'authentifier");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(30, "p", 19);
      \u0275\u0275text(31, "Acc\xE8s r\xE9serv\xE9 aux utilisateurs autoris\xE9s ");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275property("formGroup", ctx.loginForm);
      \u0275\u0275advance(10);
      \u0275\u0275property("type", ctx.hidePassword ? "password" : "text");
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-label", ctx.hidePassword ? "Afficher" : "Masquer");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.hidePassword ? "visibility_off" : "visibility");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error ? 24 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.loading || ctx.loginForm.invalid);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading ? 26 : 27);
    }
  }, dependencies: [\u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, MatIcon], styles: ["\n\n.login-wrapper[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 45, 100, 0.72) 0%,\n      rgba(10, 25, 47, 0.85) 100%),\n    url(/bpbf-building.png) center/cover no-repeat fixed;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 24px;\n  position: relative;\n  overflow: hidden;\n}\n.bg-orb[_ngcontent-%COMP%] {\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n}\n.orb-1[_ngcontent-%COMP%] {\n  width: 600px;\n  height: 600px;\n  top: -200px;\n  left: -200px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(2, 132, 199, 0.25) 0%,\n      transparent 70%);\n}\n.orb-2[_ngcontent-%COMP%] {\n  width: 500px;\n  height: 500px;\n  bottom: -180px;\n  right: -150px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(234, 179, 8, 0.15) 0%,\n      transparent 70%);\n}\n.orb-3[_ngcontent-%COMP%] {\n  width: 300px;\n  height: 300px;\n  top: 40%;\n  left: 60%;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 255, 255, 0.08) 0%,\n      transparent 70%);\n}\n.login-card[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  background: rgba(255, 255, 255, 0.95);\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.8);\n  border-radius: 20px;\n  padding: 40px 40px 32px;\n  width: 100%;\n  max-width: 420px;\n  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.login-logo-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 20px;\n}\n.login-brand-logo[_ngcontent-%COMP%] {\n  height: 65px;\n  width: auto;\n  max-width: 220px;\n  object-fit: contain;\n  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.06));\n  transition: transform 0.3s ease;\n}\n.login-brand-logo[_ngcontent-%COMP%]:hover {\n  transform: scale(1.03);\n}\n.card-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 28px;\n}\n.card-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 800;\n  color: #004080;\n  margin: 0 0 6px;\n  letter-spacing: -0.3px;\n}\n.card-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #7a8699;\n  margin: 0;\n  line-height: 1.5;\n}\n.login-form[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.field-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.field-label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  color: #3a4660;\n}\n.input-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n}\n.field-input[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 44px;\n  border: 1.5px solid #d1d9e6;\n  border-radius: 10px;\n  padding: 0 14px;\n  font-size: 14px;\n  color: #004080;\n  background: #f8fafc;\n  outline: none;\n  transition:\n    border-color 0.2s,\n    box-shadow 0.2s,\n    background 0.2s;\n  box-sizing: border-box;\n  font-family: inherit;\n}\n.field-input[_ngcontent-%COMP%]::placeholder {\n  color: #b0bac8;\n}\n.field-input[_ngcontent-%COMP%]:focus {\n  border-color: #004080;\n  background: #ffffff;\n  box-shadow: 0 0 0 3px rgba(22, 48, 89, 0.1);\n}\n.pw-wrapper[_ngcontent-%COMP%]   .field-input[_ngcontent-%COMP%] {\n  padding-right: 44px;\n}\n.pw-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 4px;\n  color: #7a8699;\n  display: flex;\n  align-items: center;\n}\n.pw-toggle[_ngcontent-%COMP%]:hover {\n  color: #004080;\n}\n.pw-toggle[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.error-msg[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: #fff0f0;\n  border: 1px solid #ffcdd2;\n  border-radius: 8px;\n  padding: 10px 12px;\n  color: #c62828;\n  font-size: 13px;\n}\n.error-msg[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  flex-shrink: 0;\n}\n.submit-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  width: 100%;\n  height: 46px;\n  background: #004080;\n  color: #ffffff;\n  border: none;\n  border-radius: 10px;\n  font-size: 14px;\n  font-weight: 700;\n  cursor: pointer;\n  transition:\n    background 0.2s,\n    transform 0.1s,\n    box-shadow 0.2s;\n  font-family: inherit;\n  margin-top: 4px;\n  box-shadow: 0 4px 14px rgba(22, 48, 89, 0.35);\n}\n.submit-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.submit-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #1B3A6B;\n  box-shadow: 0 6px 18px rgba(22, 48, 89, 0.45);\n  transform: translateY(-1px);\n}\n.submit-btn[_ngcontent-%COMP%]:active:not(:disabled) {\n  transform: translateY(0);\n}\n.submit-btn[_ngcontent-%COMP%]:disabled {\n  background: #9baabd;\n  cursor: not-allowed;\n  box-shadow: none;\n}\n.spin-icon[_ngcontent-%COMP%] {\n  display: flex;\n}\n.spin-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.card-footer[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  font-size: 11px;\n  color: #b0bac8;\n  text-align: center;\n}\n@media (max-width: 480px) {\n  .login-card[_ngcontent-%COMP%] {\n    padding: 28px 24px 24px;\n  }\n  .card-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 18px;\n  }\n}\n/*# sourceMappingURL=login.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "app-login", standalone: false, template: `<div class="login-wrapper">\r
\r
  <!-- Cercles d\xE9coratifs en arri\xE8re-plan -->\r
  <div class="bg-orb orb-1"></div>\r
  <div class="bg-orb orb-2"></div>\r
  <div class="bg-orb orb-3"></div>\r
\r
  <div class="login-card">\r
\r
    <!-- Logo BPBF -->\r
    <div class="login-logo-container">\r
      <img src="bpbf-login-logo.png" alt="Banque Postale du Burkina Faso" class="login-brand-logo">\r
    </div>\r
\r
    <!-- Titre -->\r
    <div class="card-header">\r
      <h1>Connexion</h1>\r
    </div>\r
\r
    <!-- Formulaire -->\r
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">\r
\r
      <div class="field-group">\r
        <label class="field-label">Matricule / Identifiant</label>\r
        <div class="input-wrapper">\r
          <input class="field-input"\r
                 type="email"\r
                 formControlName="email"\r
                 placeholder="ex: marie.dupont@sirh.bf"\r
                 autocomplete="username">\r
        </div>\r
      </div>\r
\r
      <div class="field-group">\r
        <label class="field-label">Mot de passe</label>\r
        <div class="input-wrapper pw-wrapper">\r
          <input class="field-input"\r
                 [type]="hidePassword ? 'password' : 'text'"\r
                 formControlName="password"\r
                 placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"\r
                 autocomplete="current-password">\r
          <button type="button" class="pw-toggle" (click)="hidePassword = !hidePassword"\r
                  [attr.aria-label]="hidePassword ? 'Afficher' : 'Masquer'">\r
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>\r
          </button>\r
        </div>\r
      </div>\r
\r
      @if (error) {\r
        <div class="error-msg">\r
          <mat-icon>error_outline</mat-icon>\r
          <span>{{ error }}</span>\r
        </div>\r
      }\r
\r
      <button type="submit" class="submit-btn" [disabled]="loading || loginForm.invalid">\r
        @if (loading) {\r
          <span class="spin-icon"><mat-icon>sync</mat-icon></span>\r
        } @else {\r
          <mat-icon>lock</mat-icon>\r
        }\r
        <span>S'authentifier</span>\r
      </button>\r
\r
    </form>\r
\r
    <p class="card-footer">Acc\xE8s r\xE9serv\xE9 aux utilisateurs autoris\xE9s </p>\r
\r
  </div>\r
\r
</div>\r
`, styles: ["/* src/app/features/auth/login/login.component.scss */\n.login-wrapper {\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 45, 100, 0.72) 0%,\n      rgba(10, 25, 47, 0.85) 100%),\n    url(/bpbf-building.png) center/cover no-repeat fixed;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 24px;\n  position: relative;\n  overflow: hidden;\n}\n.bg-orb {\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n}\n.orb-1 {\n  width: 600px;\n  height: 600px;\n  top: -200px;\n  left: -200px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(2, 132, 199, 0.25) 0%,\n      transparent 70%);\n}\n.orb-2 {\n  width: 500px;\n  height: 500px;\n  bottom: -180px;\n  right: -150px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(234, 179, 8, 0.15) 0%,\n      transparent 70%);\n}\n.orb-3 {\n  width: 300px;\n  height: 300px;\n  top: 40%;\n  left: 60%;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 255, 255, 0.08) 0%,\n      transparent 70%);\n}\n.login-card {\n  position: relative;\n  z-index: 1;\n  background: rgba(255, 255, 255, 0.95);\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.8);\n  border-radius: 20px;\n  padding: 40px 40px 32px;\n  width: 100%;\n  max-width: 420px;\n  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.login-logo-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 20px;\n}\n.login-brand-logo {\n  height: 65px;\n  width: auto;\n  max-width: 220px;\n  object-fit: contain;\n  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.06));\n  transition: transform 0.3s ease;\n}\n.login-brand-logo:hover {\n  transform: scale(1.03);\n}\n.card-header {\n  text-align: center;\n  margin-bottom: 28px;\n}\n.card-header h1 {\n  font-size: 20px;\n  font-weight: 800;\n  color: #004080;\n  margin: 0 0 6px;\n  letter-spacing: -0.3px;\n}\n.card-header p {\n  font-size: 12px;\n  color: #7a8699;\n  margin: 0;\n  line-height: 1.5;\n}\n.login-form {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.field-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.field-label {\n  font-size: 13px;\n  font-weight: 600;\n  color: #3a4660;\n}\n.input-wrapper {\n  position: relative;\n}\n.field-input {\n  width: 100%;\n  height: 44px;\n  border: 1.5px solid #d1d9e6;\n  border-radius: 10px;\n  padding: 0 14px;\n  font-size: 14px;\n  color: #004080;\n  background: #f8fafc;\n  outline: none;\n  transition:\n    border-color 0.2s,\n    box-shadow 0.2s,\n    background 0.2s;\n  box-sizing: border-box;\n  font-family: inherit;\n}\n.field-input::placeholder {\n  color: #b0bac8;\n}\n.field-input:focus {\n  border-color: #004080;\n  background: #ffffff;\n  box-shadow: 0 0 0 3px rgba(22, 48, 89, 0.1);\n}\n.pw-wrapper .field-input {\n  padding-right: 44px;\n}\n.pw-toggle {\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 4px;\n  color: #7a8699;\n  display: flex;\n  align-items: center;\n}\n.pw-toggle:hover {\n  color: #004080;\n}\n.pw-toggle mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.error-msg {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: #fff0f0;\n  border: 1px solid #ffcdd2;\n  border-radius: 8px;\n  padding: 10px 12px;\n  color: #c62828;\n  font-size: 13px;\n}\n.error-msg mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  flex-shrink: 0;\n}\n.submit-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  width: 100%;\n  height: 46px;\n  background: #004080;\n  color: #ffffff;\n  border: none;\n  border-radius: 10px;\n  font-size: 14px;\n  font-weight: 700;\n  cursor: pointer;\n  transition:\n    background 0.2s,\n    transform 0.1s,\n    box-shadow 0.2s;\n  font-family: inherit;\n  margin-top: 4px;\n  box-shadow: 0 4px 14px rgba(22, 48, 89, 0.35);\n}\n.submit-btn mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.submit-btn:hover:not(:disabled) {\n  background: #1B3A6B;\n  box-shadow: 0 6px 18px rgba(22, 48, 89, 0.45);\n  transform: translateY(-1px);\n}\n.submit-btn:active:not(:disabled) {\n  transform: translateY(0);\n}\n.submit-btn:disabled {\n  background: #9baabd;\n  cursor: not-allowed;\n  box-shadow: none;\n}\n.spin-icon {\n  display: flex;\n}\n.spin-icon mat-icon {\n  animation: spin 1s linear infinite;\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.card-footer {\n  margin-top: 20px;\n  font-size: 11px;\n  color: #b0bac8;\n  text-align: center;\n}\n@media (max-width: 480px) {\n  .login-card {\n    padding: 28px 24px 24px;\n  }\n  .card-header h1 {\n    font-size: 18px;\n  }\n}\n/*# sourceMappingURL=login.component.css.map */\n"] }]
  }], () => [{ type: FormBuilder }, { type: AuthService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/features/auth/login/login.component.ts", lineNumber: 12 });
})();

// src/app/features/auth/auth-routing.module.ts
var routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent }
];
var AuthRoutingModule = class _AuthRoutingModule {
  static \u0275fac = function AuthRoutingModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthRoutingModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AuthRoutingModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    }]
  }], null, null);
})();

// src/app/features/auth/auth.module.ts
var AuthModule = class _AuthModule {
  static \u0275fac = function AuthModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AuthModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthModule, [{
    type: NgModule,
    args: [{
      declarations: [LoginComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule
      ]
    }]
  }], null, null);
})();
export {
  AuthModule
};
//# sourceMappingURL=chunk-XYYLTUD3.js.map
