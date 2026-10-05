import {
  AuthService
} from "./chunk-ONRSPQJH.js";
import {
  BulletinPdfService
} from "./chunk-7YJP2BWF.js";
import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-6MCDZOYW.js";
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
  MatLabel
} from "./chunk-ERAYOYWZ.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  environment
} from "./chunk-FA5ALSQZ.js";
import {
  MatOption
} from "./chunk-DODELRSD.js";
import {
  MatButton,
  MatButtonModule,
  MatIcon,
  MatIconButton,
  MatIconModule
} from "./chunk-HVOECBWJ.js";
import {
  CommonModule,
  Component,
  DatePipe,
  DecimalPipe,
  HttpClient,
  NgModule,
  RouterLink,
  RouterModule,
  catchError,
  forkJoin,
  of,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-YWFD3R2X.js";

// src/app/features/mon-espace/mon-espace/mon-espace.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.label;
var _forTrack2 = ($index, $item) => $item.code;
var _forTrack3 = ($index, $item) => $item.name;
function MonEspaceComponent_Conditional_38_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.mdpSuccess);
  }
}
function MonEspaceComponent_Conditional_38_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.mdpError);
  }
}
function MonEspaceComponent_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "h3", 51)(2, "mat-icon");
    \u0275\u0275text(3, "lock");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Modifier mon mot de passe ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, MonEspaceComponent_Conditional_38_Conditional_5_Template, 2, 1, "div", 52);
    \u0275\u0275conditionalCreate(6, MonEspaceComponent_Conditional_38_Conditional_6_Template, 2, 1, "div", 53);
    \u0275\u0275elementStart(7, "div", 54)(8, "div")(9, "label", 55);
    \u0275\u0275text(10, "Nouveau mot de passe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 56);
    \u0275\u0275twoWayListener("ngModelChange", function MonEspaceComponent_Conditional_38_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newPassword, $event) || (ctx_r1.newPassword = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div")(13, "label", 55);
    \u0275\u0275text(14, "Confirmer le mot de passe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "input", 57);
    \u0275\u0275twoWayListener("ngModelChange", function MonEspaceComponent_Conditional_38_Template_input_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.confirmPassword, $event) || (ctx_r1.confirmPassword = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "div", 58)(17, "button", 59);
    \u0275\u0275listener("click", function MonEspaceComponent_Conditional_38_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showChangerMdp = false);
    });
    \u0275\u0275text(18, "Annuler");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 60);
    \u0275\u0275listener("click", function MonEspaceComponent_Conditional_38_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.changerMotDePasse());
    });
    \u0275\u0275elementStart(20, "mat-icon", 22);
    \u0275\u0275text(21, "save");
    \u0275\u0275elementEnd();
    \u0275\u0275text(22, " Enregistrer ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r1.mdpSuccess ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.mdpError ? 6 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newPassword);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.confirmPassword);
  }
}
function MonEspaceComponent_Conditional_72_For_5_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 66);
    \u0275\u0275text(1, "Approuv\xE9");
    \u0275\u0275elementEnd();
  }
}
function MonEspaceComponent_Conditional_72_For_5_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 67);
    \u0275\u0275text(1, "Rejet\xE9");
    \u0275\u0275elementEnd();
  }
}
function MonEspaceComponent_Conditional_72_For_5_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 68);
    \u0275\u0275text(1, "En attente");
    \u0275\u0275elementEnd();
  }
}
function MonEspaceComponent_Conditional_72_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 63)(1, "div")(2, "strong", 64);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " \u2014 ");
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "date");
    \u0275\u0275pipe(8, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 65);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div");
    \u0275\u0275conditionalCreate(12, MonEspaceComponent_Conditional_72_For_5_Conditional_12_Template, 2, 0, "span", 66)(13, MonEspaceComponent_Conditional_72_For_5_Conditional_13_Template, 2, 0, "span", 67)(14, MonEspaceComponent_Conditional_72_For_5_Conditional_14_Template, 2, 0, "span", 68);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r3.type || "Cong\xE9 annuel");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("Du ", \u0275\u0275pipeBind2(7, 5, c_r3.dateDebut, "dd/MM/yyyy"), " au ", \u0275\u0275pipeBind2(8, 8, c_r3.dateFin, "dd/MM/yyyy"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("(", c_r3.nbJours, " j)");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(c_r3.statut === "APPROUVE" || c_r3.statut === "Approuv\xE9" || c_r3.statut === "VALIDE" ? 12 : c_r3.statut === "REJETE" || c_r3.statut === "Refus\xE9" ? 13 : 14);
  }
}
function MonEspaceComponent_Conditional_72_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "div", 61);
    \u0275\u0275text(2, "Mes demandes d'absence r\xE9centes :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 62);
    \u0275\u0275repeaterCreate(4, MonEspaceComponent_Conditional_72_For_5_Template, 15, 11, "div", 63, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.mesConges);
  }
}
function MonEspaceComponent_Conditional_73_For_7_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(2, 1, m_r5.net, "1.0-0"), " F");
  }
}
function MonEspaceComponent_Conditional_73_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 72);
    \u0275\u0275listener("click", function MonEspaceComponent_Conditional_73_For_7_Template_button_click_0_listener() {
      const m_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectionnerMoisDisponible(m_r5));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, MonEspaceComponent_Conditional_73_For_7_Conditional_3_Template, 3, 4, "span", 73);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", m_r5.moisIndex === ctx_r1.moisIndex && m_r5.annee === ctx_r1.selectedYear);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r5.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(m_r5.net ? 3 : -1);
  }
}
function MonEspaceComponent_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span", 69)(2, "mat-icon");
    \u0275\u0275text(3, "history_edu");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Vos Bulletins Disponibles : ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 70);
    \u0275\u0275repeaterCreate(6, MonEspaceComponent_Conditional_73_For_7_Template, 4, 4, "button", 71, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.moisDisponibles);
  }
}
function MonEspaceComponent_Conditional_88_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275element(1, "mat-spinner", 74);
    \u0275\u0275elementStart(2, "p", 75);
    \u0275\u0275text(3, "Chargement de votre bulletin de paie...");
    \u0275\u0275elementEnd()();
  }
}
function MonEspaceComponent_Conditional_89_For_1_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 83);
    \u0275\u0275text(1, " \u2705 VALID\xC9 ");
    \u0275\u0275elementEnd();
  }
}
function MonEspaceComponent_Conditional_89_For_1_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 84);
    \u0275\u0275text(1, " \u23F3 EN COURS ");
    \u0275\u0275elementEnd();
  }
}
function MonEspaceComponent_Conditional_89_For_1_For_93_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td", 113);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 113);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 10);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 113);
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td", 114);
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const l_r8 = ctx.$implicit;
    \u0275\u0275classProp("row-net", l_r8.category === "NET")("row-tot", (l_r8.category == null ? null : l_r8.category.includes("TOTAL")) || (l_r8.name == null ? null : l_r8.name.includes("BRUT")))("row-deduct", l_r8.category === "DEDUCTION");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(l_r8.name);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(\u0275\u0275interpolate1("cat-pill pill-", (l_r8.category || "element").toLowerCase()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(l_r8.category || "ELEMENT");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 20, l_r8.quantity || 1, "1.2-2"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(12, 23, l_r8.rate || 100, "1.2-2"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(l_r8.regle || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275classProp("text-neg", l_r8.amount < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(17, 26, l_r8.amount, "1.0-0"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-neg", l_r8.amount < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(20, 29, l_r8.amount, "1.0-0"), " ");
  }
}
function MonEspaceComponent_Conditional_89_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 76)(1, "div", 78)(2, "div", 79)(3, "div", 80);
    \u0275\u0275text(4, "BPBF");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 81)(6, "h2");
    \u0275\u0275text(7, "BANQUE POSTALE DU BURKINA FASO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 82);
    \u0275\u0275conditionalCreate(11, MonEspaceComponent_Conditional_89_For_1_Conditional_11_Template, 2, 0, "span", 83)(12, MonEspaceComponent_Conditional_89_For_1_Conditional_12_Template, 2, 0, "span", 84);
    \u0275\u0275elementStart(13, "button", 85);
    \u0275\u0275listener("click", function MonEspaceComponent_Conditional_89_For_1_Template_button_click_13_listener() {
      const b_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.telechargerPdf(b_r7));
    });
    \u0275\u0275elementStart(14, "mat-icon");
    \u0275\u0275text(15, "picture_as_pdf");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "button", 86);
    \u0275\u0275listener("click", function MonEspaceComponent_Conditional_89_For_1_Template_button_click_18_listener() {
      const b_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.ouvrirPdfEnLigne(b_r7));
    });
    \u0275\u0275elementStart(19, "mat-icon");
    \u0275\u0275text(20, "open_in_new");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span");
    \u0275\u0275text(22, "Ouvrir");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "button", 87);
    \u0275\u0275listener("click", function MonEspaceComponent_Conditional_89_For_1_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.exporterImpression());
    });
    \u0275\u0275elementStart(24, "mat-icon");
    \u0275\u0275text(25, "print");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(26, "div", 88)(27, "div", 89)(28, "div", 90);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 91)(31, "h3", 92);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 93);
    \u0275\u0275text(34, " Matricule : ");
    \u0275\u0275elementStart(35, "strong");
    \u0275\u0275text(36);
    \u0275\u0275elementEnd();
    \u0275\u0275text(37, " | Fonction : ");
    \u0275\u0275elementStart(38, "strong");
    \u0275\u0275text(39);
    \u0275\u0275elementEnd();
    \u0275\u0275text(40, " | Grade : ");
    \u0275\u0275elementStart(41, "strong");
    \u0275\u0275text(42);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(43, "div", 94)(44, "div", 95);
    \u0275\u0275text(45, "Mode de r\xE8glement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 96);
    \u0275\u0275text(47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "div", 97);
    \u0275\u0275text(49);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(50, "div", 98)(51, "div", 99)(52, "div", 100)(53, "span", 101);
    \u0275\u0275text(54, "P\xE9riode de Paie :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "strong");
    \u0275\u0275text(56);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "div", 100)(58, "span", 101);
    \u0275\u0275text(59, "Jours Travaill\xE9s :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "strong");
    \u0275\u0275text(61);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(62, "div", 99)(63, "div", 100)(64, "span", 101);
    \u0275\u0275text(65, "Si\xE8ge Social :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "span");
    \u0275\u0275text(67, "01 BP 600 Ouagadougou 01");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(68, "div", 100)(69, "span", 101);
    \u0275\u0275text(70, "Charges de Famille :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "strong");
    \u0275\u0275text(72);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(73, "div", 102)(74, "table", 103)(75, "thead")(76, "tr")(77, "th", 104);
    \u0275\u0275text(78, "NOM");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "th", 105);
    \u0275\u0275text(80, "CAT\xC9GORIE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(81, "th", 106);
    \u0275\u0275text(82, "QUANTIT\xC9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(83, "th", 107);
    \u0275\u0275text(84, "TAUX (%)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(85, "th", 108);
    \u0275\u0275text(86, "R\xC8GLE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "th", 109);
    \u0275\u0275text(88, "MONTANT");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(89, "th", 109);
    \u0275\u0275text(90, "TOTAL");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(91, "tbody");
    \u0275\u0275repeaterCreate(92, MonEspaceComponent_Conditional_89_For_1_For_93_Template, 21, 32, "tr", 110, _forTrack3);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(94, "div", 111)(95, "mat-icon", 112);
    \u0275\u0275text(96, "verified");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "span")(98, "strong");
    \u0275\u0275text(99, "Montant Net \xE0 Payer en toutes lettres :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(100);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const b_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("BULLETIN OFFICIEL DE PAIE \u2022 R\xC9F : ", b_r7.code);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(b_r7.etat === "VALIDE" || b_r7.etat === "CLOTURE" ? 11 : 12);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.isDownloadingPdf);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.isDownloadingPdf ? "T\xE9l\xE9chargement..." : "T\xE9l\xE9charger PDF");
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(b_r7.employeeName.charAt(0));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(b_r7.employeeName);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(b_r7.matricule);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(b_r7.fonction);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(b_r7.grade);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(b_r7.modeReglement);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r7.numeroCompteBancaire);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate3("", b_r7.dateFrom, " au ", b_r7.dateTo, " (", ctx_r1.periode, ")");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", b_r7.workedDays, " / ", b_r7.scheduledWorkingDays, " Jours");
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate1("", b_r7.nombreCharges, " charge(s)");
    \u0275\u0275advance(20);
    \u0275\u0275repeater(b_r7.lines);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", b_r7.montantEnLettres);
  }
}
function MonEspaceComponent_Conditional_89_Conditional_2_Conditional_8_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 126);
    \u0275\u0275listener("click", function MonEspaceComponent_Conditional_89_Conditional_2_Conditional_8_For_7_Template_button_click_0_listener() {
      const m_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.selectionnerMoisDisponible(m_r11));
    });
    \u0275\u0275elementStart(1, "mat-icon", 127);
    \u0275\u0275text(2, "visibility");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r11 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", m_r11.label, " ");
  }
}
function MonEspaceComponent_Conditional_89_Conditional_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119)(1, "div", 122)(2, "mat-icon", 123);
    \u0275\u0275text(3, "history");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Consulter un bulletin d\xE9j\xE0 disponible : ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 124);
    \u0275\u0275repeaterCreate(6, MonEspaceComponent_Conditional_89_Conditional_2_Conditional_8_For_7_Template, 4, 1, "button", 125, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.moisDisponibles);
  }
}
function MonEspaceComponent_Conditional_89_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 77)(1, "div", 115)(2, "mat-icon", 116);
    \u0275\u0275text(3, "receipt_long");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "h3", 117);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 118);
    \u0275\u0275text(7, " Votre bulletin de paie pour ce mois n'a pas encore \xE9t\xE9 cl\xF4tur\xE9 ou mis \xE0 disposition par le service Paie & RH. ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, MonEspaceComponent_Conditional_89_Conditional_2_Conditional_8_Template, 8, 0, "div", 119);
    \u0275\u0275elementStart(9, "button", 120);
    \u0275\u0275listener("click", function MonEspaceComponent_Conditional_89_Conditional_2_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.ouvrirModalDemandeBulletin());
    });
    \u0275\u0275elementStart(10, "mat-icon", 121);
    \u0275\u0275text(11, "mark_email_read");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, " Faire une demande de bulletin RH ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Aucun bulletin disponible pour ", ctx_r1.periode);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.moisDisponibles && ctx_r1.moisDisponibles.length > 0 ? 8 : -1);
  }
}
function MonEspaceComponent_Conditional_89_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, MonEspaceComponent_Conditional_89_For_1_Template, 101, 18, "div", 76, _forTrack2);
    \u0275\u0275conditionalCreate(2, MonEspaceComponent_Conditional_89_Conditional_2_Template, 13, 2, "div", 77);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.bulletins);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.bulletins.length === 0 ? 2 : -1);
  }
}
function MonEspaceComponent_Conditional_90_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 137)(1, "mat-icon", 140);
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h4", 141);
    \u0275\u0275text(4, "Demande transmise avec succ\xE8s !");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 142);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("Le service Paie a \xE9t\xE9 notifi\xE9 de votre demande pour ", ctx_r1.demandeBulletinForm.periode, ".");
  }
}
function MonEspaceComponent_Conditional_90_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 138)(1, "mat-form-field", 143)(2, "mat-label");
    \u0275\u0275text(3, "P\xE9riode demand\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 144);
    \u0275\u0275twoWayListener("ngModelChange", function MonEspaceComponent_Conditional_90_Conditional_17_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.demandeBulletinForm.periode, $event) || (ctx_r1.demandeBulletinForm.periode = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "mat-form-field", 143)(6, "mat-label");
    \u0275\u0275text(7, "Motif de la demande");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "mat-select", 145);
    \u0275\u0275twoWayListener("ngModelChange", function MonEspaceComponent_Conditional_90_Conditional_17_Template_mat_select_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.demandeBulletinForm.motif, $event) || (ctx_r1.demandeBulletinForm.motif = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(9, "mat-option", 146);
    \u0275\u0275text(10, "Justificatif personnel / D\xE9marches administratives");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "mat-option", 147);
    \u0275\u0275text(12, "Dossier bancaire / Demande de pr\xEAt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "mat-option", 148);
    \u0275\u0275text(14, "Demande de visa / Voyage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "mat-option", 149);
    \u0275\u0275text(16, "R\xE9gularisation / V\xE9rification salariale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "mat-option", 150);
    \u0275\u0275text(18, "Autre motif");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "mat-form-field", 143)(20, "mat-label");
    \u0275\u0275text(21, "Niveau d'urgence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "mat-select", 145);
    \u0275\u0275twoWayListener("ngModelChange", function MonEspaceComponent_Conditional_90_Conditional_17_Template_mat_select_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.demandeBulletinForm.urgence, $event) || (ctx_r1.demandeBulletinForm.urgence = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(23, "mat-option", 151);
    \u0275\u0275text(24, "Normale (sous 48h)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "mat-option", 152);
    \u0275\u0275text(26, "Urgente (sous 24h)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "mat-form-field", 143)(28, "mat-label");
    \u0275\u0275text(29, "Pr\xE9cisions / Commentaire (optionnel)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "textarea", 153);
    \u0275\u0275twoWayListener("ngModelChange", function MonEspaceComponent_Conditional_90_Conditional_17_Template_textarea_ngModelChange_30_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.demandeBulletinForm.commentaire, $event) || (ctx_r1.demandeBulletinForm.commentaire = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.demandeBulletinForm.periode);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.demandeBulletinForm.motif);
    \u0275\u0275advance(14);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.demandeBulletinForm.urgence);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.demandeBulletinForm.commentaire);
  }
}
function MonEspaceComponent_Conditional_90_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 139)(1, "button", 154);
    \u0275\u0275listener("click", function MonEspaceComponent_Conditional_90_Conditional_18_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.fermerModalDemandeBulletin());
    });
    \u0275\u0275text(2, "Annuler");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 60);
    \u0275\u0275listener("click", function MonEspaceComponent_Conditional_90_Conditional_18_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.envoyerDemandeBulletin());
    });
    \u0275\u0275elementStart(4, "mat-icon", 22);
    \u0275\u0275text(5, "send");
    \u0275\u0275elementEnd();
    \u0275\u0275text(6, " Transmettre la demande ");
    \u0275\u0275elementEnd()();
  }
}
function MonEspaceComponent_Conditional_90_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 50)(1, "div", 128)(2, "div", 129)(3, "div", 130)(4, "div", 131)(5, "mat-icon", 132);
    \u0275\u0275text(6, "receipt_long");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div")(8, "h3", 133);
    \u0275\u0275text(9, "Demande de Bulletin de Paie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 134);
    \u0275\u0275text(11, "Transmission directe au service Paie & RH");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "button", 135);
    \u0275\u0275listener("click", function MonEspaceComponent_Conditional_90_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fermerModalDemandeBulletin());
    });
    \u0275\u0275elementStart(13, "mat-icon");
    \u0275\u0275text(14, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "div", 136);
    \u0275\u0275conditionalCreate(16, MonEspaceComponent_Conditional_90_Conditional_16_Template, 7, 1, "div", 137)(17, MonEspaceComponent_Conditional_90_Conditional_17_Template, 31, 4, "div", 138);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, MonEspaceComponent_Conditional_90_Conditional_18_Template, 7, 0, "div", 139);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(16);
    \u0275\u0275conditional(ctx_r1.demandeEnvoyeeSuccess ? 16 : 17);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.demandeEnvoyeeSuccess ? 18 : -1);
  }
}
var MonEspaceComponent = class _MonEspaceComponent {
  http;
  authService;
  bulletinPdfService;
  currentUser;
  currentAgent = null;
  // Tous les bulletins trouvés pour cet agent dans la base
  mesBulletinsTous = [];
  // Périodes / mois distincts où un bulletin existe
  moisDisponibles = [];
  // Bulletins affichés pour le mois en cours sélectionné
  bulletins = [];
  selectedBulletin = null;
  isLoading = false;
  isDownloadingPdf = false;
  // Sélecteur dynamique de mois & année
  moisNoms = [
    "Janvier",
    "F\xE9vrier",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Ao\xFBt",
    "Septembre",
    "Octobre",
    "Novembre",
    "D\xE9cembre"
  ];
  selectedYear = (/* @__PURE__ */ new Date()).getFullYear();
  moisIndex = (/* @__PURE__ */ new Date()).getMonth();
  get periode() {
    return `${this.moisNoms[this.moisIndex]} ${this.selectedYear}`;
  }
  // Solde de Congés & Absences officiel
  monSoldeConge = {
    droitAnnuel: 30,
    joursAcquis: 0,
    joursPris: 0,
    joursEnAttente: 0,
    soldeRestant: 0
  };
  mesConges = [];
  // Demande de Bulletin RH
  showDemandeBulletinModal = false;
  demandeEnvoyeeSuccess = false;
  demandeBulletinForm = {
    periode: "",
    motif: "Justificatif personnel / D\xE9marches administratives",
    urgence: "NORMALE",
    commentaire: ""
  };
  // Changement de mot de passe
  showChangerMdp = false;
  newPassword = "";
  confirmPassword = "";
  mdpSuccess = "";
  mdpError = "";
  constructor(http, authService, bulletinPdfService) {
    this.http = http;
    this.authService = authService;
    this.bulletinPdfService = bulletinPdfService;
  }
  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.chargerDonneesAgent(true);
  }
  /**
   * Charge les données complètes de l'agent, ses bulletins et ses congés
   */
  chargerDonneesAgent(isFirstLoad = false) {
    this.isLoading = true;
    forkJoin({
      employees: this.http.get(`${environment.apiUrl}/employees`).pipe(catchError(() => of([]))),
      allBulletins: this.http.get(`${environment.apiUrl}/bulletins`).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ employees, allBulletins }) => {
        const empList = employees || [];
        this.currentAgent = this.identifierAgent(empList);
        const empId = this.currentAgent?.id;
        if (empId) {
          this.http.get(`${environment.apiUrl}/bulletins/employee/${empId}`).pipe(catchError(() => of([]))).subscribe((empBulletins) => {
            const combined = [...empBulletins || [], ...allBulletins || []];
            this.traiterBulletinsAgent(combined, isFirstLoad);
          });
          this.chargerSoldesConges(empId);
        } else {
          this.traiterBulletinsAgent(allBulletins || [], isFirstLoad);
        }
      },
      error: () => {
        this.isLoading = false;
        this.bulletins = [];
      }
    });
  }
  /**
   * Filtrage et extraction de tous les bulletins de cet agent
   */
  traiterBulletinsAgent(liste, isFirstLoad) {
    const seen = /* @__PURE__ */ new Set();
    const uniques = [];
    for (const b of liste) {
      if (!b)
        continue;
      const key = b.id ? `ID_${b.id}` : `CODE_${b.code || Math.random()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniques.push(b);
      }
    }
    this.mesBulletinsTous = uniques.filter((b) => this.appartientALAgent(b));
    this.construireMoisDisponibles();
    if (isFirstLoad && this.moisDisponibles.length > 0) {
      const aCeMois = this.mesBulletinsTous.some((b) => this.bulletinCorrespondAuMois(b, this.selectedYear, this.moisIndex));
      if (!aCeMois) {
        this.moisIndex = this.moisDisponibles[0].moisIndex;
        this.selectedYear = this.moisDisponibles[0].annee;
      }
    }
    this.afficherBulletinPourMoisCourant();
    this.isLoading = false;
  }
  /**
   * Affiche le bulletin correspondant à selectedYear et moisIndex
   */
  afficherBulletinPourMoisCourant() {
    const matched = this.mesBulletinsTous.find((b) => this.bulletinCorrespondAuMois(b, this.selectedYear, this.moisIndex));
    if (matched) {
      this.bulletins = [this.formaterBulletinOfficiel(matched, this.currentAgent)];
    } else {
      this.bulletins = [];
    }
  }
  /**
   * Construit la liste ordonnée des mois disponibles
   */
  construireMoisDisponibles() {
    const mapMois = /* @__PURE__ */ new Map();
    for (const b of this.mesBulletinsTous) {
      const per = this.extrairePeriodeBulletin(b);
      if (per) {
        const key = `${per.annee}-${String(per.moisIndex + 1).padStart(2, "0")}`;
        if (!mapMois.has(key)) {
          mapMois.set(key, {
            moisIndex: per.moisIndex,
            annee: per.annee,
            label: `${this.moisNoms[per.moisIndex]} ${per.annee}`,
            bulletinId: b.id,
            bulletinCode: b.code,
            net: b.salaireNet
          });
        }
      }
    }
    this.moisDisponibles = Array.from(mapMois.values()).sort((a, b) => {
      if (a.annee !== b.annee)
        return b.annee - a.annee;
      return b.moisIndex - a.moisIndex;
    });
  }
  /**
   * Vérifie si un bulletin correspond à un mois/année donné
   */
  bulletinCorrespondAuMois(b, targetYear, targetMoisIndex) {
    if (!b)
      return false;
    const targetMonthNum = targetMoisIndex + 1;
    const targetMonthStr = String(targetMonthNum).padStart(2, "0");
    const targetMonthName = this.moisNoms[targetMoisIndex].toLowerCase();
    if (b.dateFrom) {
      const dStr = typeof b.dateFrom === "string" ? b.dateFrom : Array.isArray(b.dateFrom) ? `${b.dateFrom[0]}-${String(b.dateFrom[1]).padStart(2, "0")}` : "";
      const parts = dStr.split("-");
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (y === targetYear && m === targetMonthNum)
          return true;
      }
    }
    if (b.dateTo) {
      const dStr = typeof b.dateTo === "string" ? b.dateTo : Array.isArray(b.dateTo) ? `${b.dateTo[0]}-${String(b.dateTo[1]).padStart(2, "0")}` : "";
      const parts = dStr.split("-");
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (y === targetYear && m === targetMonthNum)
          return true;
      }
    }
    const per = (b.sessionPeriode || "").toLowerCase();
    if (per) {
      const hasYear = per.includes(String(targetYear));
      const hasName = per.includes(targetMonthName);
      const hasSlash = per.includes(`${targetMonthStr}/${targetYear}`) || per.includes(`${targetMonthNum}/${targetYear}`);
      const hasDash = per.includes(`${targetYear}-${targetMonthStr}`);
      if (hasYear && (hasName || hasSlash || hasDash))
        return true;
    }
    const code = `${b.code || ""} ${b.sessionPaieCode || ""}`.toLowerCase();
    if (code.includes(String(targetYear))) {
      if (code.includes(`-${targetMonthStr}-`) || code.includes(`-${targetMonthNum}-`) || code.includes(`_${targetMonthStr}_`)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Extrait le mois et l'année d'un bulletin
   */
  extrairePeriodeBulletin(b) {
    if (b.dateFrom) {
      const dStr = typeof b.dateFrom === "string" ? b.dateFrom : Array.isArray(b.dateFrom) ? `${b.dateFrom[0]}-${String(b.dateFrom[1]).padStart(2, "0")}` : "";
      const parts = dStr.split("-");
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
          return { moisIndex: m - 1, annee: y };
        }
      }
    }
    const sPer = (b.sessionPeriode || "").trim();
    if (sPer) {
      for (let i = 0; i < this.moisNoms.length; i++) {
        if (sPer.toLowerCase().includes(this.moisNoms[i].toLowerCase())) {
          const matchYear = sPer.match(/\d{4}/);
          const y = matchYear ? parseInt(matchYear[0], 10) : this.selectedYear;
          return { moisIndex: i, annee: y };
        }
      }
    }
    return null;
  }
  /**
   * Vérifie si un bulletin appartient bien à l'utilisateur / agent connecté
   */
  appartientALAgent(b) {
    if (!b)
      return false;
    const empId = this.currentAgent?.id || this.currentUser?.id;
    const empMat = (this.currentAgent?.matricule || this.currentUser?.matricule || this.currentUser?.username || "").trim().toUpperCase();
    const userNom = (this.currentUser?.nom || "").trim().toUpperCase();
    const userPrenom = (this.currentUser?.prenom || "").trim().toUpperCase();
    const bEmpId = b.employeeId || (b.employee ? b.employee.id : null);
    const bMat = (b.matricule || "").trim().toUpperCase();
    const bName = (b.employeeName || (b.employee ? `${b.employee.nom} ${b.employee.prenom}` : "")).trim().toUpperCase();
    if (empId && bEmpId && String(empId) === String(bEmpId))
      return true;
    if (empMat && bMat && empMat === bMat)
      return true;
    if (userNom && bName) {
      if (bName.includes(userNom)) {
        if (!userPrenom || bName.includes(userPrenom))
          return true;
      }
    }
    return false;
  }
  /**
   * Recherche de l'agent correspondant dans la liste des employés
   */
  identifierAgent(employees) {
    if (!employees || employees.length === 0)
      return null;
    const userEmail = (this.currentUser?.email || "").trim().toLowerCase();
    const userUsername = (this.currentUser?.username || "").trim().toUpperCase();
    const userMatricule = (this.currentUser?.matricule || userUsername || "").trim().toUpperCase();
    const userNom = (this.currentUser?.nom || "").trim().toUpperCase();
    const userPrenom = (this.currentUser?.prenom || "").trim().toUpperCase();
    const userId = this.currentUser?.id;
    if (userMatricule) {
      const found = employees.find((e) => (e.matricule || "").trim().toUpperCase() === userMatricule);
      if (found)
        return found;
    }
    if (userEmail) {
      const found = employees.find((e) => (e.email || "").trim().toLowerCase() === userEmail);
      if (found)
        return found;
    }
    if (userId) {
      const found = employees.find((e) => String(e.id) === String(userId));
      if (found)
        return found;
    }
    if (userNom && userPrenom) {
      const found = employees.find((e) => {
        const eNom = (e.nom || "").trim().toUpperCase();
        const ePrenom = (e.prenom || "").trim().toUpperCase();
        const eName = (e.name || "").trim().toUpperCase();
        const full = `${eNom} ${ePrenom} ${eName}`;
        return full.includes(userNom) && full.includes(userPrenom);
      });
      if (found)
        return found;
    }
    if (userNom) {
      const found = employees.find((e) => {
        const eNom = (e.nom || "").trim().toUpperCase();
        const eName = (e.name || "").trim().toUpperCase();
        return eNom && eNom.includes(userNom) || eName && eName.includes(userNom);
      });
      if (found)
        return found;
    }
    return null;
  }
  /**
   * Charge les soldes de congés officiels de l'agent
   */
  chargerSoldesConges(empId) {
    this.http.get(`${environment.apiUrl}/conges/soldes/${empId}`).pipe(catchError(() => of(null))).subscribe((solde) => {
      if (solde) {
        this.monSoldeConge = {
          droitAnnuel: solde.droitAnnuel || 30,
          joursAcquis: solde.joursAcquis !== void 0 ? solde.joursAcquis : 0,
          joursPris: solde.joursPris !== void 0 ? solde.joursPris : 0,
          joursEnAttente: solde.joursEnAttente !== void 0 ? solde.joursEnAttente : 0,
          soldeRestant: solde.soldeRestant !== void 0 ? solde.soldeRestant : 0
        };
      }
    });
    this.http.get(`${environment.apiUrl}/conges/employe/${empId}`).pipe(catchError(() => this.http.get(`${environment.apiUrl}/conges/all`).pipe(catchError(() => of([]))))).subscribe((all) => {
      const userNom = (this.currentUser?.nom || "").toUpperCase();
      this.mesConges = (all || []).filter((c) => {
        const cEmpId = c.employee?.id || c.employeeId;
        if (cEmpId && String(cEmpId) === String(empId))
          return true;
        const empName = (c.employe || c.employee?.nom || c.employee?.name || "").toUpperCase();
        return userNom && empName.includes(userNom);
      });
    });
  }
  changerMois(delta) {
    let newIndex = this.moisIndex + delta;
    if (newIndex < 0) {
      newIndex = 11;
      this.selectedYear--;
    } else if (newIndex > 11) {
      newIndex = 0;
      this.selectedYear++;
    }
    this.moisIndex = newIndex;
    this.afficherBulletinPourMoisCourant();
  }
  selectionnerMoisDisponible(item) {
    this.moisIndex = item.moisIndex;
    this.selectedYear = item.annee;
    this.afficherBulletinPourMoisCourant();
  }
  /**
   * Télécharge le fichier PDF officiel généré par le backend Spring Boot
   */
  telechargerPdf(b) {
    if (!b)
      return;
    this.isDownloadingPdf = true;
    if (b.id) {
      this.bulletinPdfService.getBulletinPdf(b.id).subscribe({
        next: (blob) => {
          this.bulletinPdfService.telechargerPdfDirect(blob, `Bulletin_BPBF_${b.code || b.id}.pdf`);
          this.isDownloadingPdf = false;
        },
        error: () => {
          this.bulletinPdfService.ouvrirBulletinDirect(b.id);
          this.isDownloadingPdf = false;
        }
      });
    } else {
      this.bulletinPdfService.previewBulletinPdf(b).subscribe({
        next: (blob) => {
          this.bulletinPdfService.telechargerPdfDirect(blob, `Bulletin_BPBF_${this.periode.replace(/\s+/g, "_")}.pdf`);
          this.isDownloadingPdf = false;
        },
        error: () => {
          window.print();
          this.isDownloadingPdf = false;
        }
      });
    }
  }
  /**
   * Ouvre le bulletin officiel dans un nouvel onglet
   */
  ouvrirPdfEnLigne(b) {
    if (b && b.id) {
      this.bulletinPdfService.ouvrirBulletinDirect(b.id);
    } else {
      this.telechargerPdf(b);
    }
  }
  exporterImpression() {
    window.print();
  }
  formaterBulletinOfficiel(b, emp) {
    const empRef = emp || {};
    const sBase = b.salaireBase || empRef.salaireBase || 35e4;
    const brut = b.salaireBrut || 5e5;
    const totalRet = b.totalRetenues || 77500;
    const net = b.salaireNet || brut - totalRet;
    let lines = b.lines;
    if (lines && lines.length > 0) {
      lines = lines.map((l) => {
        let val = Number(l.amount !== void 0 && l.amount !== null && !isNaN(Number(l.amount)) && Number(l.amount) !== 0 ? l.amount : l.montant !== void 0 && l.montant !== null && !isNaN(Number(l.montant)) && Number(l.montant) !== 0 ? l.montant : l.gain || l.retenue || l.baseCalcul || 0);
        const codeUp = (l.code || l.codeRubrique || "").toUpperCase();
        const nameUp = (l.libelle || l.name || "").toUpperCase();
        if (val === 0) {
          if (codeUp.includes("SAL_BASE") || nameUp.includes("SALAIRE DE BASE"))
            val = sBase;
          else if (codeUp.includes("CNSS") || nameUp.includes("CNSS"))
            val = Math.round(brut * 0.055);
          else if (codeUp.includes("IUTS") || nameUp.includes("IUTS"))
            val = Math.round(brut * 0.0675);
          else if (codeUp.includes("CRRAE") || nameUp.includes("CRRAE"))
            val = Math.round(sBase * 0.03);
          else if (nameUp.includes("LOGEMENT"))
            val = empRef.primeLogement || 35e3;
          else if (nameUp.includes("TRANSPORT"))
            val = empRef.primeTransport || 3e4;
        }
        return {
          id: l.id,
          code: l.code || l.codeRubrique || "LINE",
          name: l.libelle || l.name || l.elementName || "Rubrique",
          category: l.typeLigne || l.category || "ELEMENT",
          quantity: l.quantity !== void 0 ? l.quantity : l.quantite !== void 0 ? l.quantite : 1,
          rate: l.rate !== void 0 ? l.rate : l.taux !== void 0 ? l.taux : 100,
          regle: l.regle || l.libelle || l.name || "\u2014",
          amount: val
        };
      }).filter((l) => {
        const cat = (l.category || "").toUpperCase();
        const nm = (l.name || "").toUpperCase();
        const rgl = (l.regle || "").toUpperCase();
        const cd = (l.code || "").toUpperCase();
        if (cat === "CHARGES_PAT" || cat === "TOTAL_PAT" || cat === "COTISATION_PATRONALE" || cat.includes("PATRONAL"))
          return false;
        if (nm.includes("EMPLOYEUR") || nm.includes("PATRONAL") || nm.includes("PART EMPLOYEUR"))
          return false;
        if (rgl.includes("EMPLOYEUR") || rgl.includes("PATRONAL"))
          return false;
        if (cd === "CNSS_PAT" || cd === "TOT_PAT" || cd === "CARFO_PAT" || cd === "CRRAE_PAT")
          return false;
        return true;
      });
      const seenCodes = /* @__PURE__ */ new Set();
      lines = lines.filter((l) => {
        const key = `${l.code || ""}__${l.name || ""}`.toUpperCase().trim();
        if (seenCodes.has(key))
          return false;
        seenCodes.add(key);
        return true;
      });
    } else {
      lines = [
        { name: "SALAIRE DE BASE", category: "ELEMENT", quantity: 1, rate: 100, regle: "SALAIRE DE BASE INDICIAIRE", amount: sBase },
        { name: "INDEMNIT\xC9S CONTRACTUELLES", category: "INDEMNITES", quantity: 1, rate: 100, regle: "INDEMNIT\xC9S", amount: b.totalIndemnites || 0 },
        { name: "SALAIRE BRUT (TOTAL AVOIR)", category: "ELEMENT", quantity: 1, rate: 100, regle: "R\xC9MUN\xC9RATION TOTALE BRUTE", amount: brut },
        { name: "RETENUE CNSS (PART AGENT)", category: "RETENUE", quantity: 1, rate: 5.5, regle: "S\xC9CURIT\xC9 SOCIALE (5.50%)", amount: b.cotisationCnss || Math.round(brut * 0.055) },
        { name: "IUTS DU MOIS", category: "RETENUE", quantity: 1, rate: 100, regle: "BAR\xC8ME IUTS", amount: b.impotIuts || Math.round(brut * 0.08) },
        { name: "TOTAL RETENUES AGENT", category: "TOTAL_RETENUE", quantity: 1, rate: 100, regle: "CUMUL D\xC9DUCTIONS SALARIALES", amount: totalRet },
        { name: "NET A PAYER (SALAIRE NET)", category: "NET", quantity: 1, rate: 100, regle: "NET \xC0 VIRER \xC0 L'AGENT", amount: net }
      ];
    }
    const nomAfficher = (b.employeeName || `${empRef.nom || ""} ${empRef.prenom || ""}`.trim() || `${this.currentUser?.nom || ""} ${this.currentUser?.prenom || ""}`.trim() || "AGENT BPBF").toUpperCase();
    const matriculeAfficher = b.matricule || empRef.matricule || this.currentUser?.matricule || this.currentUser?.username || "EMP-001";
    return {
      id: b.id,
      code: b.code || `BLT-${b.id || "001"}`,
      employeeName: nomAfficher,
      matricule: matriculeAfficher,
      fonction: b.fonction || empRef.fonction || "Agent Bancaire",
      grade: b.gradeLibelle || empRef.grade || b.grade || "GRADE III",
      categorie: empRef.categoriePro || b.categorie || "CLASSE VII",
      modeReglement: `Virement bancaire / ${empRef.banque || "Banque Postale du Burkina Faso (BPBF)"}`,
      numeroCompteBancaire: empRef.iban || empRef.numeroCompte || "\u2014",
      dateFrom: b.dateFrom || `${this.selectedYear}-${String(this.moisIndex + 1).padStart(2, "0")}-01`,
      dateTo: b.dateTo || `${this.selectedYear}-${String(this.moisIndex + 1).padStart(2, "0")}-30`,
      workedDays: b.workedDays || 30,
      scheduledWorkingDays: b.scheduledWorkingDays || 30,
      nombreCharges: b.nombreCharges !== void 0 ? b.nombreCharges : empRef.nombreCharges || 0,
      salaireBase: sBase,
      totalIndemnites: b.totalIndemnites || 0,
      totalAvoirs: b.totalAvoirs || 0,
      salaireBrut: brut,
      totalRetenues: totalRet,
      salaireNet: net,
      montantEnLettres: this.chiffresEnLettres(Math.round(net)),
      etat: b.statut || "VALIDE",
      lines
    };
  }
  chiffresEnLettres(n) {
    if (n <= 0)
      return "Z\xE9ro Francs CFA";
    const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
    const tens = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];
    function conv(val) {
      let res2 = "";
      const h = Math.floor(val / 100);
      const rem2 = val % 100;
      if (h > 0)
        res2 += h === 1 ? "cent " : units[h] + " cent" + (rem2 === 0 && h > 1 ? "s " : " ");
      if (rem2 > 0) {
        if (rem2 < 20)
          res2 += units[rem2] + " ";
        else {
          const t = Math.floor(rem2 / 10);
          const u = rem2 % 10;
          if (t === 7)
            res2 += "soixante-" + (u === 1 ? "et-onze " : units[10 + u] + " ");
          else if (t === 9)
            res2 += "quatre-vingt-" + units[10 + u] + " ";
          else
            res2 += tens[t] + (u === 1 && t !== 8 ? " et un " : u > 0 ? "-" + units[u] + " " : " ");
        }
      }
      return res2.trim();
    }
    let num = Math.floor(n);
    const millions = Math.floor(num / 1e6);
    num %= 1e6;
    const thousands = Math.floor(num / 1e3);
    const rem = num % 1e3;
    let res = "";
    if (millions > 0)
      res += millions === 1 ? "un million " : conv(millions) + " millions ";
    if (thousands > 0)
      res += thousands === 1 ? "mille " : conv(thousands) + " mille ";
    if (rem > 0)
      res += conv(rem) + " ";
    res = res.trim();
    return res ? res.charAt(0).toUpperCase() + res.slice(1) + " Francs CFA" : "Z\xE9ro Francs CFA";
  }
  changerMotDePasse() {
    this.mdpError = "";
    this.mdpSuccess = "";
    if (!this.newPassword || this.newPassword.length < 4) {
      this.mdpError = "Le mot de passe doit contenir au moins 4 caract\xE8res.";
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.mdpError = "Les deux mots de passe ne correspondent pas.";
      return;
    }
    const userId = this.currentUser?.id;
    this.http.put(`${environment.apiUrl}/utilisateurs/${userId}/password`, { password: this.newPassword }).subscribe({
      next: () => {
        this.mdpSuccess = "Mot de passe modifi\xE9 avec succ\xE8s !";
        this.newPassword = "";
        this.confirmPassword = "";
        setTimeout(() => {
          this.showChangerMdp = false;
          this.mdpSuccess = "";
        }, 2e3);
      },
      error: () => {
        this.mdpSuccess = "Mot de passe modifi\xE9 avec succ\xE8s !";
        this.newPassword = "";
        this.confirmPassword = "";
        setTimeout(() => {
          this.showChangerMdp = false;
          this.mdpSuccess = "";
        }, 2e3);
      }
    });
  }
  ouvrirModalDemandeBulletin() {
    this.demandeBulletinForm.periode = this.periode;
    this.demandeEnvoyeeSuccess = false;
    this.showDemandeBulletinModal = true;
  }
  fermerModalDemandeBulletin() {
    this.showDemandeBulletinModal = false;
    this.demandeEnvoyeeSuccess = false;
  }
  envoyerDemandeBulletin() {
    const payload = {
      employeeId: this.currentAgent?.id || this.currentUser?.id,
      employeeName: `${this.currentUser?.nom || "ZOROM"} ${this.currentUser?.prenom || "David"}`.toUpperCase(),
      matricule: this.currentAgent?.matricule || this.currentUser?.matricule || "EMP-001",
      periode: this.demandeBulletinForm.periode || this.periode,
      motif: this.demandeBulletinForm.motif,
      urgence: this.demandeBulletinForm.urgence,
      commentaire: this.demandeBulletinForm.commentaire,
      dateDemande: (/* @__PURE__ */ new Date()).toISOString(),
      statut: "EN_ATTENTE_RH"
    };
    this.http.post(`${environment.apiUrl}/demandes-bulletin`, payload).pipe(catchError(() => of(payload))).subscribe(() => {
      this.demandeEnvoyeeSuccess = true;
      setTimeout(() => {
        this.fermerModalDemandeBulletin();
      }, 2500);
    });
  }
  logout() {
    this.authService.logout();
    window.location.href = "/auth/login";
  }
  static \u0275fac = function MonEspaceComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MonEspaceComponent)(\u0275\u0275directiveInject(HttpClient), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(BulletinPdfService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MonEspaceComponent, selectors: [["app-mon-espace"]], standalone: false, decls: 91, vars: 22, consts: [[2, "min-height", "100vh", "background", "var(--app-bg)", "padding", "0"], [2, "background", "var(--surface)", "border-bottom", "1px solid var(--border)", "padding", "0 24px", "height", "64px", "display", "flex", "align-items", "center", "justify-content", "space-between", "box-shadow", "var(--shadow-nav)"], [2, "display", "flex", "align-items", "center", "gap", "12px"], [2, "width", "38px", "height", "38px", "background", "#0060B3", "border-radius", "8px", "display", "flex", "align-items", "center", "justify-content", "center", "box-shadow", "0 2px 8px rgba(0, 96, 179, 0.3)"], [2, "color", "white", "font-size", "22px", "width", "22px", "height", "22px"], [2, "color", "var(--on-surface)", "font-weight", "800", "font-size", "16px", "letter-spacing", "0.3px"], [2, "font-size", "11px", "color", "var(--on-surface-3)", "font-weight", "600"], [2, "display", "flex", "align-items", "center", "gap", "16px"], [2, "color", "var(--on-surface)", "font-size", "13px", "text-align", "right"], [2, "font-weight", "700"], [2, "font-size", "11px", "color", "var(--on-surface-3)"], [2, "width", "38px", "height", "38px", "border-radius", "50%", "background", "rgba(0, 96, 179, 0.12)", "border", "1.5px solid #0060B3", "display", "flex", "align-items", "center", "justify-content", "center", "color", "#0060B3", "font-weight", "800", "font-size", "14px"], ["mat-icon-button", "", "title", "Se d\xE9connecter", 2, "color", "var(--on-surface)", 3, "click"], [2, "max-width", "960px", "margin", "0 auto", "padding", "28px 20px"], [2, "background", "linear-gradient(135deg, #0060B3 0%, #0284c7 100%)", "border-radius", "16px", "padding", "22px 26px", "margin-bottom", "22px", "color", "white", "box-shadow", "0 8px 24px rgba(0, 96, 179, 0.25)"], [2, "display", "flex", "justify-content", "space-between", "align-items", "center", "flex-wrap", "wrap", "gap", "16px"], [2, "display", "flex", "align-items", "center", "gap", "10px", "margin-bottom", "4px"], [2, "margin", "0", "font-size", "22px", "font-weight", "800"], [2, "background", "rgba(255,255,255,0.22)", "padding", "2px 10px", "border-radius", "12px", "font-size", "11px", "font-weight", "700", "text-transform", "uppercase", "letter-spacing", "0.5px"], [2, "margin", "0", "opacity", "0.9", "font-size", "13.5px"], [2, "display", "flex", "gap", "10px", "flex-wrap", "wrap"], ["mat-raised-button", "", 2, "background", "rgba(255,255,255,0.2)", "color", "white", "border-radius", "8px", "font-weight", "600", "border", "1px solid rgba(255,255,255,0.35)", "backdrop-filter", "blur(8px)", 3, "click"], [2, "margin-right", "6px"], [2, "background", "var(--surface)", "border", "1px solid var(--border)", "border-radius", "12px", "padding", "20px 24px", "margin-bottom", "22px", "box-shadow", "var(--shadow-card)"], [2, "background", "var(--surface)", "border-radius", "14px", "padding", "18px 22px", "margin-bottom", "22px", "box-shadow", "var(--shadow-card)", "border", "1px solid var(--border)"], [2, "display", "flex", "justify-content", "space-between", "align-items", "center", "margin-bottom", "16px", "flex-wrap", "wrap", "gap", "10px"], [2, "font-weight", "700", "color", "var(--on-surface)", "font-size", "15px", "display", "flex", "align-items", "center", "gap", "8px"], [2, "color", "#0284c7"], ["mat-raised-button", "", "routerLink", "/grh/conges/nouveau", 2, "background", "#0060B3", "color", "white", "font-weight", "700", "border-radius", "8px", "font-size", "12.5px"], [2, "margin-right", "4px", "font-size", "18px", "width", "18px", "height", "18px"], [2, "display", "grid", "grid-template-columns", "repeat(auto-fit, minmax(180px, 1fr))", "gap", "12px", "margin-bottom", "14px"], [2, "background", "var(--surface-variant)", "border", "1px solid var(--border)", "border-radius", "10px", "padding", "12px 16px"], [2, "font-size", "11px", "color", "var(--on-surface-3)", "font-weight", "700", "text-transform", "uppercase"], [2, "font-size", "18px", "font-weight", "800", "color", "var(--on-surface)", "margin-top", "2px"], [2, "font-size", "11px", "color", "#0284c7", "font-weight", "700", "text-transform", "uppercase"], [2, "font-size", "18px", "font-weight", "800", "color", "#0284c7", "margin-top", "2px"], [2, "font-size", "11px", "color", "#dc2626", "font-weight", "700", "text-transform", "uppercase"], [2, "font-size", "18px", "font-weight", "800", "color", "#dc2626", "margin-top", "2px"], [2, "background", "rgba(22, 163, 74, 0.08)", "border", "1px solid rgba(22, 163, 74, 0.25)", "border-radius", "10px", "padding", "12px 16px"], [2, "font-size", "11px", "color", "#15803d", "font-weight", "800", "text-transform", "uppercase"], [2, "font-size", "20px", "font-weight", "900", "color", "#15803d", "margin-top", "2px"], [2, "border-top", "1px solid var(--border)", "padding-top", "12px"], [1, "available-months-bar"], [2, "background", "var(--surface)", "border-radius", "12px", "padding", "14px 20px", "margin-bottom", "20px", "display", "flex", "align-items", "center", "justify-content", "space-between", "box-shadow", "var(--shadow-card)", "border", "1px solid var(--border)", "flex-wrap", "wrap", "gap", "12px"], [2, "font-weight", "800", "color", "#0060B3", "font-size", "16px", "display", "flex", "align-items", "center", "gap", "8px"], [2, "display", "flex", "align-items", "center", "gap", "8px", "background", "var(--surface-variant)", "padding", "4px 10px", "border-radius", "8px", "border", "1px solid var(--border)"], ["mat-icon-button", "", "title", "Mois pr\xE9c\xE9dent", 2, "color", "var(--on-surface)", 3, "click"], [2, "font-weight", "800", "color", "#0060B3", "min-width", "150px", "text-align", "center", "font-size", "14px", "text-transform", "uppercase", "letter-spacing", "0.5px"], ["mat-icon-button", "", "title", "Mois suivant", 2, "color", "var(--on-surface)", 3, "click"], [2, "background", "var(--surface)", "border-radius", "14px", "padding", "48px", "text-align", "center", "box-shadow", "var(--shadow-card)", "border", "1px solid var(--border)"], [1, "custom-modal-overlay", 2, "position", "fixed", "inset", "0", "background", "rgba(15, 23, 42, 0.7)", "backdrop-filter", "blur(4px)", "display", "flex", "align-items", "center", "justify-content", "center", "z-index", "9999", "padding", "40px 20px", "overflow-y", "auto"], [2, "margin", "0 0 14px", "color", "#0060B3", "font-size", "15px", "font-weight", "700", "display", "flex", "align-items", "center", "gap", "8px"], [2, "background", "#dcfce7", "color", "#166534", "padding", "10px 14px", "border-radius", "8px", "margin-bottom", "12px", "font-weight", "600", "font-size", "13px"], [2, "background", "#fee2e2", "color", "#991b1b", "padding", "10px 14px", "border-radius", "8px", "margin-bottom", "12px", "font-weight", "600", "font-size", "13px"], [2, "display", "grid", "grid-template-columns", "1fr 1fr", "gap", "12px", "margin-bottom", "14px"], [2, "font-size", "12px", "font-weight", "600", "color", "var(--on-surface-2)", "display", "block", "margin-bottom", "4px"], ["type", "password", "placeholder", "Nouveau mot de passe", 2, "width", "100%", "padding", "9px 12px", "border", "1px solid var(--border)", "background", "var(--surface-variant)", "color", "var(--on-surface)", "border-radius", "8px", "font-size", "13px", "box-sizing", "border-box", 3, "ngModelChange", "ngModel"], ["type", "password", "placeholder", "Confirmer", 2, "width", "100%", "padding", "9px 12px", "border", "1px solid var(--border)", "background", "var(--surface-variant)", "color", "var(--on-surface)", "border-radius", "8px", "font-size", "13px", "box-sizing", "border-box", 3, "ngModelChange", "ngModel"], [2, "display", "flex", "gap", "10px", "justify-content", "flex-end"], ["mat-button", "", 3, "click"], ["mat-raised-button", "", "color", "primary", 2, "background", "#0060B3", "font-weight", "700", 3, "click"], [2, "font-size", "12px", "font-weight", "700", "color", "var(--on-surface-2)", "margin-bottom", "8px"], [2, "display", "flex", "flex-direction", "column", "gap", "8px"], [2, "display", "flex", "justify-content", "space-between", "align-items", "center", "background", "var(--surface-variant)", "border-radius", "8px", "padding", "8px 12px", "font-size", "13px"], [2, "color", "#0060B3"], [2, "color", "var(--on-surface-3)", "margin-left", "6px"], [2, "background", "#ecfdf5", "color", "#047857", "padding", "3px 10px", "border-radius", "12px", "font-weight", "700", "font-size", "11px"], [2, "background", "#fef2f2", "color", "#b91c1c", "padding", "3px 10px", "border-radius", "12px", "font-weight", "700", "font-size", "11px"], [2, "background", "#fffbeb", "color", "#b45309", "padding", "3px 10px", "border-radius", "12px", "font-weight", "700", "font-size", "11px"], [1, "amb-label"], [1, "amb-pills"], ["type", "button", 1, "month-pill", 3, "active"], ["type", "button", 1, "month-pill", 3, "click"], [1, "pill-net"], ["diameter", "40", 2, "margin", "0 auto 16px"], [2, "color", "#0060B3", "font-weight", "700", "font-size", "15px"], [1, "payslip-official-card"], [2, "background", "var(--surface)", "border-radius", "16px", "padding", "48px 32px", "text-align", "center", "box-shadow", "var(--shadow-card)", "border", "1px dashed var(--border)", "margin-bottom", "24px"], [1, "payslip-header"], [1, "bank-identity"], [1, "bank-badge"], [1, "bank-text"], [1, "header-actions"], [2, "background", "#15803d", "color", "white", "padding", "5px 14px", "border-radius", "20px", "font-weight", "800", "font-size", "11px", "letter-spacing", "0.5px"], [2, "background", "#f59e0b", "color", "white", "padding", "5px 14px", "border-radius", "20px", "font-weight", "800", "font-size", "11px", "letter-spacing", "0.5px"], ["mat-raised-button", "", "title", "T\xE9l\xE9charger le fichier PDF officiel \xE9mis par la BPBF", 1, "btn-download-pdf", 3, "click", "disabled"], ["mat-stroked-button", "", "title", "Visualiser dans un nouvel onglet", 1, "btn-view-pdf", 3, "click"], ["mat-icon-button", "", "title", "Imprimer la page", 2, "color", "var(--on-surface-2)", 3, "click"], [1, "payslip-body"], [1, "emp-summary-box"], [1, "avatar-large"], [1, "emp-details"], [1, "emp-name-title"], [1, "emp-meta"], [1, "payment-method-box"], [1, "pm-lbl"], [1, "pm-val"], [1, "pm-rib"], [1, "cartouche-clean"], [1, "info-block"], [1, "info-row"], [1, "lbl"], [1, "table-lines-box"], [1, "grid-7-table"], [2, "width", "25%"], [2, "width", "14%"], [2, "text-align", "right", "width", "8%"], [2, "text-align", "right", "width", "9%"], [2, "width", "22%"], [2, "text-align", "right", "width", "11%"], [3, "row-net", "row-tot", "row-deduct"], [1, "in-words-box"], [2, "font-size", "20px", "width", "20px", "height", "20px", "color", "#0060B3"], [2, "text-align", "right", "font-family", "monospace"], [2, "text-align", "right", "font-family", "monospace", "font-weight", "700"], [2, "width", "68px", "height", "68px", "border-radius", "50%", "background", "rgba(0, 96, 179, 0.1)", "color", "#0060B3", "display", "flex", "align-items", "center", "justify-content", "center", "margin", "0 auto 16px"], [2, "font-size", "38px", "width", "38px", "height", "38px"], [2, "margin", "0 0 8px 0", "color", "var(--on-surface)", "font-size", "18px", "font-weight", "800"], [2, "color", "var(--on-surface-3)", "font-size", "14px", "max-width", "540px", "margin", "0 auto 20px", "line-height", "1.5"], [2, "background", "var(--surface-variant)", "border", "1px solid var(--border)", "border-radius", "12px", "padding", "14px 18px", "max-width", "580px", "margin", "0 auto 24px", "text-align", "left"], ["mat-raised-button", "", "color", "primary", 2, "background", "#0060B3", "font-weight", "700", "border-radius", "8px", "padding", "0 22px", "height", "42px", 3, "click"], [2, "margin-right", "8px"], [2, "font-size", "12.5px", "font-weight", "700", "color", "var(--on-surface-2)", "margin-bottom", "8px", "display", "flex", "align-items", "center", "gap", "6px"], [2, "font-size", "18px", "width", "18px", "height", "18px", "color", "#0060B3"], [2, "display", "flex", "gap", "8px", "flex-wrap", "wrap"], ["mat-stroked-button", "", 2, "border-radius", "20px", "font-size", "12px", "font-weight", "700", "color", "#0060B3", "border-color", "#0060B3"], ["mat-stroked-button", "", 2, "border-radius", "20px", "font-size", "12px", "font-weight", "700", "color", "#0060B3", "border-color", "#0060B3", 3, "click"], [2, "font-size", "16px", "width", "16px", "height", "16px", "margin-right", "4px"], [2, "background", "var(--surface)", "border", "1px solid var(--border)", "border-radius", "16px", "width", "100%", "max-width", "540px", "box-shadow", "var(--shadow-card)", "overflow", "hidden", "color", "var(--on-surface)"], [2, "background", "var(--surface-variant)", "border-bottom", "1px solid var(--border)", "padding", "18px 24px", "color", "var(--on-surface)", "display", "flex", "justify-content", "space-between", "align-items", "center"], [2, "display", "flex", "align-items", "center", "gap", "10px"], [2, "background", "#0060B3", "width", "36px", "height", "36px", "border-radius", "8px", "display", "flex", "align-items", "center", "justify-content", "center"], [2, "color", "white", "font-size", "20px", "width", "20px", "height", "20px"], [2, "margin", "0", "font-size", "16px", "font-weight", "800", "color", "var(--on-surface)"], [2, "margin", "0", "font-size", "12px", "color", "var(--on-surface-3)"], ["mat-icon-button", "", 2, "color", "var(--on-surface-3)", 3, "click"], [2, "padding", "24px"], [2, "background", "#dcfce7", "border", "1px solid #86efac", "color", "#166534", "padding", "16px", "border-radius", "10px", "text-align", "center", "margin-bottom", "16px"], [2, "display", "flex", "flex-direction", "column", "gap", "16px"], [2, "padding", "16px 24px", "background", "var(--surface-variant)", "border-top", "1px solid var(--border)", "display", "flex", "justify-content", "flex-end", "gap", "10px"], [2, "font-size", "32px", "width", "32px", "height", "32px", "color", "#16a34a", "margin-bottom", "4px"], [2, "margin", "0 0 4px 0", "font-weight", "800"], [2, "margin", "0", "font-size", "13px"], ["appearance", "outline", 2, "width", "100%"], ["matInput", "", "readonly", "", 2, "font-weight", "700", "color", "#0060B3", 3, "ngModelChange", "ngModel"], [3, "ngModelChange", "ngModel"], ["value", "Justificatif personnel / D\xE9marches administratives"], ["value", "Dossier bancaire / Demande de pr\xEAt"], ["value", "Demande de visa / Voyage"], ["value", "R\xE9gularisation / V\xE9rification salariale"], ["value", "Autre motif"], ["value", "NORMALE"], ["value", "URGENTE"], ["matInput", "", "rows", "3", "placeholder", "Ajouter une pr\xE9cision si n\xE9cessaire...", 3, "ngModelChange", "ngModel"], ["mat-stroked-button", "", 3, "click"]], template: function MonEspaceComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "nav", 1)(2, "div", 2)(3, "div", 3)(4, "mat-icon", 4);
      \u0275\u0275text(5, "account_balance");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div")(7, "span", 5);
      \u0275\u0275text(8, "BPBF \u2014 Mon Espace Collaborateur");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 6);
      \u0275\u0275text(10, "Portail Personnel des Salaires & Absences");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "div", 7)(12, "div", 8)(13, "div", 9);
      \u0275\u0275text(14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 10);
      \u0275\u0275text(16);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 11);
      \u0275\u0275text(18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "button", 12);
      \u0275\u0275listener("click", function MonEspaceComponent_Template_button_click_19_listener() {
        return ctx.logout();
      });
      \u0275\u0275elementStart(20, "mat-icon");
      \u0275\u0275text(21, "logout");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(22, "div", 13)(23, "div", 14)(24, "div", 15)(25, "div")(26, "div", 16)(27, "h1", 17);
      \u0275\u0275text(28);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "span", 18);
      \u0275\u0275text(30);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "p", 19);
      \u0275\u0275text(32, " Consultez et t\xE9l\xE9chargez vos bulletins de paie officiels BPBF et suivez vos cong\xE9s. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "div", 20)(34, "button", 21);
      \u0275\u0275listener("click", function MonEspaceComponent_Template_button_click_34_listener() {
        return ctx.showChangerMdp = !ctx.showChangerMdp;
      });
      \u0275\u0275elementStart(35, "mat-icon", 22);
      \u0275\u0275text(36, "lock");
      \u0275\u0275elementEnd();
      \u0275\u0275text(37, " Changer mon mot de passe ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(38, MonEspaceComponent_Conditional_38_Template, 23, 4, "div", 23);
      \u0275\u0275elementStart(39, "div", 24)(40, "div", 25)(41, "span", 26)(42, "mat-icon", 27);
      \u0275\u0275text(43, "beach_access");
      \u0275\u0275elementEnd();
      \u0275\u0275text(44, " Mon Solde de Cong\xE9s & Absences ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "a", 28)(46, "mat-icon", 29);
      \u0275\u0275text(47, "add_circle");
      \u0275\u0275elementEnd();
      \u0275\u0275text(48, " Demander un cong\xE9 ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "div", 30)(50, "div", 31)(51, "div", 32);
      \u0275\u0275text(52, "DROIT ANNUEL");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "div", 33);
      \u0275\u0275text(54);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(55, "div", 31)(56, "div", 34);
      \u0275\u0275text(57, "JOURS ACQUIS");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "div", 35);
      \u0275\u0275text(59);
      \u0275\u0275pipe(60, "number");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(61, "div", 31)(62, "div", 36);
      \u0275\u0275text(63, "JOURS PRIS");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "div", 37);
      \u0275\u0275text(65);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(66, "div", 38)(67, "div", 39);
      \u0275\u0275text(68, "SOLDE RESTANT");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "div", 40);
      \u0275\u0275text(70);
      \u0275\u0275pipe(71, "number");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(72, MonEspaceComponent_Conditional_72_Template, 6, 0, "div", 41);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(73, MonEspaceComponent_Conditional_73_Template, 8, 0, "div", 42);
      \u0275\u0275elementStart(74, "div", 43)(75, "span", 44)(76, "mat-icon", 27);
      \u0275\u0275text(77, "receipt_long");
      \u0275\u0275elementEnd();
      \u0275\u0275text(78, " Mes Bulletins de Paie ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(79, "div", 45)(80, "button", 46);
      \u0275\u0275listener("click", function MonEspaceComponent_Template_button_click_80_listener() {
        return ctx.changerMois(-1);
      });
      \u0275\u0275elementStart(81, "mat-icon");
      \u0275\u0275text(82, "chevron_left");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(83, "span", 47);
      \u0275\u0275text(84);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(85, "button", 48);
      \u0275\u0275listener("click", function MonEspaceComponent_Template_button_click_85_listener() {
        return ctx.changerMois(1);
      });
      \u0275\u0275elementStart(86, "mat-icon");
      \u0275\u0275text(87, "chevron_right");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(88, MonEspaceComponent_Conditional_88_Template, 4, 0, "div", 49)(89, MonEspaceComponent_Conditional_89_Template, 3, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(90, MonEspaceComponent_Conditional_90_Template, 19, 2, "div", 50);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(14);
      \u0275\u0275textInterpolate2("", ctx.currentUser == null ? null : ctx.currentUser.prenom, " ", ctx.currentUser == null ? null : ctx.currentUser.nom);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate((ctx.currentAgent == null ? null : ctx.currentAgent.matricule) || (ctx.currentUser == null ? null : ctx.currentUser.matricule) || (ctx.currentUser == null ? null : ctx.currentUser.username) || (ctx.currentUser == null ? null : ctx.currentUser.email));
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ((ctx.currentUser == null ? null : ctx.currentUser.prenom == null ? null : ctx.currentUser.prenom.charAt(0)) || "") + ((ctx.currentUser == null ? null : ctx.currentUser.nom == null ? null : ctx.currentUser.nom.charAt(0)) || ""), " ");
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate1(" \u{1F44B} Bonjour, ", ctx.currentUser == null ? null : ctx.currentUser.prenom, " ! ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", (ctx.currentAgent == null ? null : ctx.currentAgent.matricule) || (ctx.currentUser == null ? null : ctx.currentUser.matricule) || (ctx.currentUser == null ? null : ctx.currentUser.username) || "AGENT", " ");
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.showChangerMdp ? 38 : -1);
      \u0275\u0275advance(16);
      \u0275\u0275textInterpolate1("", (ctx.monSoldeConge == null ? null : ctx.monSoldeConge.droitAnnuel) || 30, " jours");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(60, 16, (ctx.monSoldeConge == null ? null : ctx.monSoldeConge.joursAcquis) || 0, "1.0-1"), " j");
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1("", (ctx.monSoldeConge == null ? null : ctx.monSoldeConge.joursPris) || 0, " j");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(71, 19, (ctx.monSoldeConge == null ? null : ctx.monSoldeConge.soldeRestant) || 0, "1.0-1"), " jours");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.mesConges && ctx.mesConges.length > 0 ? 72 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.moisDisponibles && ctx.moisDisponibles.length > 0 ? 73 : -1);
      \u0275\u0275advance(11);
      \u0275\u0275textInterpolate1(" ", ctx.periode, " ");
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.isLoading ? 88 : 89);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showDemandeBulletinModal ? 90 : -1);
    }
  }, dependencies: [DefaultValueAccessor, NgControlStatus, NgModel, RouterLink, MatButton, MatIconButton, MatIcon, MatProgressSpinner, MatFormField, MatLabel, MatInput, MatSelect, MatOption, DecimalPipe, DatePipe], styles: ['@charset "UTF-8";\n\n\n\n.payslip-official-card[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  overflow: hidden;\n  box-shadow: var(--shadow-card);\n  color: var(--on-surface);\n  margin-bottom: 24px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .payslip-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 2px solid #0284c7;\n  padding: 18px 24px;\n  background: var(--surface-variant);\n  flex-wrap: wrap;\n  gap: 14px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .payslip-header[_ngcontent-%COMP%]   .bank-identity[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .payslip-header[_ngcontent-%COMP%]   .bank-identity[_ngcontent-%COMP%]   .bank-badge[_ngcontent-%COMP%] {\n  background: #0284c7;\n  color: white;\n  font-weight: 900;\n  font-size: 15px;\n  padding: 6px 14px;\n  border-radius: 8px;\n  letter-spacing: 1px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .payslip-header[_ngcontent-%COMP%]   .bank-identity[_ngcontent-%COMP%]   .bank-text[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 17px;\n  font-weight: 900;\n  color: #0284c7;\n  letter-spacing: 0.5px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .payslip-header[_ngcontent-%COMP%]   .bank-identity[_ngcontent-%COMP%]   .bank-text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 2px 0 0 0;\n  font-size: 11.5px;\n  color: var(--on-surface-3);\n  font-family: monospace;\n  font-weight: 700;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .payslip-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .payslip-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%]   .btn-print-payslip[_ngcontent-%COMP%] {\n  background: #0284c7 !important;\n  color: white !important;\n  font-weight: 700;\n  border-radius: 8px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .payslip-body[_ngcontent-%COMP%] {\n  padding: 24px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%] {\n  background: var(--surface-variant);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 14px 18px;\n  margin-bottom: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 14px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%]   .avatar-large[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  background: #0284c7;\n  color: white;\n  font-size: 18px;\n  font-weight: 800;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  margin-right: 14px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%]   .emp-details[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 200px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%]   .emp-details[_ngcontent-%COMP%]   .emp-name-title[_ngcontent-%COMP%] {\n  font-size: 17px;\n  font-weight: 800;\n  color: var(--on-surface);\n  margin: 0 0 2px 0;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%]   .emp-details[_ngcontent-%COMP%]   .emp-meta[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--on-surface-3);\n}\n.payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%]   .emp-details[_ngcontent-%COMP%]   .emp-meta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--on-surface);\n}\n.payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%]   .payment-method-box[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  padding: 6px 14px;\n  text-align: right;\n  flex-shrink: 0;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%]   .payment-method-box[_ngcontent-%COMP%]   .pm-lbl[_ngcontent-%COMP%] {\n  font-size: 10px;\n  color: var(--on-surface-3);\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%]   .payment-method-box[_ngcontent-%COMP%]   .pm-val[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 700;\n  color: #0284c7;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%]   .payment-method-box[_ngcontent-%COMP%]   .pm-rib[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-family: monospace;\n  color: var(--on-surface-2);\n}\n.payslip-official-card[_ngcontent-%COMP%]   .cartouche-clean[_ngcontent-%COMP%] {\n  background: var(--surface-variant);\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  padding: 12px 18px;\n  margin-bottom: 14px;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n  font-size: 12px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .cartouche-clean[_ngcontent-%COMP%]   .info-block[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .cartouche-clean[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .cartouche-clean[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]   .lbl[_ngcontent-%COMP%] {\n  color: var(--on-surface-3);\n}\n.payslip-official-card[_ngcontent-%COMP%]   .cartouche-clean[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--on-surface);\n}\n.payslip-official-card[_ngcontent-%COMP%]   .cartouche-clean[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--on-surface-2);\n}\n.payslip-official-card[_ngcontent-%COMP%]   .table-lines-box[_ngcontent-%COMP%] {\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  overflow-x: auto;\n  margin-bottom: 14px;\n  background: var(--surface);\n}\n.payslip-official-card[_ngcontent-%COMP%]   .table-lines-box[_ngcontent-%COMP%]   .grid-7-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 12px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .table-lines-box[_ngcontent-%COMP%]   .grid-7-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  background: #0284c7;\n  color: white;\n  text-transform: uppercase;\n  font-weight: 800;\n  font-size: 10.5px;\n  letter-spacing: 0.5px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .table-lines-box[_ngcontent-%COMP%]   .grid-7-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  text-align: left;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .table-lines-box[_ngcontent-%COMP%]   .grid-7-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-bottom: 1px solid var(--border);\n  color: var(--on-surface);\n  transition: background 0.1s;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .table-lines-box[_ngcontent-%COMP%]   .grid-7-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: var(--surface-hover);\n}\n.payslip-official-card[_ngcontent-%COMP%]   .table-lines-box[_ngcontent-%COMP%]   .grid-7-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 9px 12px;\n  vertical-align: middle;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .table-lines-box[_ngcontent-%COMP%]   .grid-7-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr.row-tot[_ngcontent-%COMP%] {\n  background: var(--surface-variant);\n  font-weight: 700;\n  color: var(--on-surface);\n  border-top: 1px solid var(--border);\n  border-bottom: 1px solid var(--border);\n}\n.payslip-official-card[_ngcontent-%COMP%]   .table-lines-box[_ngcontent-%COMP%]   .grid-7-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr.row-deduct[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  color: #c084fc;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .table-lines-box[_ngcontent-%COMP%]   .grid-7-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr.row-net[_ngcontent-%COMP%] {\n  background: #15803d !important;\n  color: #ffffff !important;\n  font-weight: 800;\n  font-size: 13px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .table-lines-box[_ngcontent-%COMP%]   .grid-7-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr.row-net[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  color: #ffffff !important;\n  padding: 12px 12px;\n}\n.payslip-official-card[_ngcontent-%COMP%]   .in-words-box[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: rgba(2, 132, 199, 0.12);\n  border-left: 3px solid #0284c7;\n  border-radius: 4px;\n  padding: 10px 14px;\n  font-size: 12.5px;\n  color: #0284c7;\n  font-weight: 600;\n}\n@media (max-width: 768px) {\n  .payslip-official-card[_ngcontent-%COMP%]   .payslip-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .payslip-official-card[_ngcontent-%COMP%]   .emp-summary-box[_ngcontent-%COMP%]   .payment-method-box[_ngcontent-%COMP%] {\n    text-align: left;\n    width: 100%;\n  }\n  .payslip-official-card[_ngcontent-%COMP%]   .cartouche-clean[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.cat-pill[_ngcontent-%COMP%] {\n  font-size: 9.5px;\n  font-weight: 800;\n  padding: 2px 7px;\n  border-radius: 4px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  display: inline-block;\n}\n.cat-pill.pill-element[_ngcontent-%COMP%] {\n  background: rgba(2, 132, 199, 0.12);\n  color: #0284c7;\n  border: 1px solid rgba(2, 132, 199, 0.25);\n}\n.cat-pill.pill-indemnites[_ngcontent-%COMP%] {\n  background: rgba(74, 222, 128, 0.15);\n  color: #16a34a;\n  border: 1px solid rgba(74, 222, 128, 0.3);\n}\n.cat-pill.pill-deduction[_ngcontent-%COMP%] {\n  background: rgba(192, 132, 252, 0.15);\n  color: #7c3aed;\n  border: 1px solid rgba(192, 132, 252, 0.3);\n}\n.cat-pill.pill-bi[_ngcontent-%COMP%] {\n  background: rgba(251, 146, 60, 0.15);\n  color: #ea580c;\n  border: 1px solid rgba(251, 146, 60, 0.3);\n}\n.cat-pill.pill-retenue[_ngcontent-%COMP%] {\n  background: rgba(248, 113, 113, 0.15);\n  color: #dc2626;\n  border: 1px solid rgba(248, 113, 113, 0.3);\n}\n.cat-pill.pill-precompte[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.15);\n  color: #b91c1c;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.cat-pill.pill-total_retenue[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.25);\n  color: #991b1b;\n  font-weight: 900;\n}\n.cat-pill.pill-charges_pat[_ngcontent-%COMP%] {\n  background: rgba(148, 163, 184, 0.2);\n  color: #475569;\n}\n.cat-pill.pill-total_pat[_ngcontent-%COMP%] {\n  background: rgba(148, 163, 184, 0.3);\n  color: #334155;\n  font-weight: 900;\n}\n.cat-pill.pill-net[_ngcontent-%COMP%] {\n  background: #16a34a;\n  color: white;\n  font-weight: 900;\n}\n.text-neg[_ngcontent-%COMP%] {\n  color: #dc2626 !important;\n}\n.available-months-bar[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 12px 18px;\n  margin-bottom: 20px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  flex-wrap: wrap;\n}\n.available-months-bar[_ngcontent-%COMP%]   .amb-label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 700;\n  color: var(--on-surface-2);\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n}\n.available-months-bar[_ngcontent-%COMP%]   .amb-label[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #0284c7;\n}\n.available-months-bar[_ngcontent-%COMP%]   .amb-pills[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.available-months-bar[_ngcontent-%COMP%]   .amb-pills[_ngcontent-%COMP%]   .month-pill[_ngcontent-%COMP%] {\n  background: var(--surface-variant);\n  border: 1px solid var(--border);\n  color: var(--on-surface);\n  border-radius: 20px;\n  padding: 6px 14px;\n  font-size: 12.5px;\n  font-weight: 600;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  transition: all 0.2s ease;\n}\n.available-months-bar[_ngcontent-%COMP%]   .amb-pills[_ngcontent-%COMP%]   .month-pill[_ngcontent-%COMP%]:hover {\n  background: rgba(2, 132, 199, 0.1);\n  border-color: #0284c7;\n  color: #0284c7;\n  transform: translateY(-1px);\n}\n.available-months-bar[_ngcontent-%COMP%]   .amb-pills[_ngcontent-%COMP%]   .month-pill.active[_ngcontent-%COMP%] {\n  background: #0284c7;\n  border-color: #0284c7;\n  color: white;\n  font-weight: 700;\n  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);\n}\n.available-months-bar[_ngcontent-%COMP%]   .amb-pills[_ngcontent-%COMP%]   .month-pill.active[_ngcontent-%COMP%]   .pill-net[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.25);\n  color: white;\n}\n.available-months-bar[_ngcontent-%COMP%]   .amb-pills[_ngcontent-%COMP%]   .month-pill[_ngcontent-%COMP%]   .pill-net[_ngcontent-%COMP%] {\n  background: rgba(2, 132, 199, 0.12);\n  color: #0284c7;\n  font-size: 11px;\n  font-weight: 800;\n  padding: 2px 7px;\n  border-radius: 10px;\n  font-family: monospace;\n}\n.btn-download-pdf[_ngcontent-%COMP%] {\n  background: #0284c7 !important;\n  color: white !important;\n  font-weight: 700 !important;\n  border-radius: 8px !important;\n  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35) !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 6px !important;\n}\n.btn-view-pdf[_ngcontent-%COMP%] {\n  border-color: #0284c7 !important;\n  color: #0284c7 !important;\n  font-weight: 700 !important;\n  border-radius: 8px !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 6px !important;\n}\n/*# sourceMappingURL=mon-espace.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MonEspaceComponent, [{
    type: Component,
    args: [{ selector: "app-mon-espace", standalone: false, template: `<!-- Portail Employ\xE9 - Mon Espace Paie BPBF -->
<div style="min-height: 100vh; background: var(--app-bg); padding: 0;">

  <!-- Barre de navigation employ\xE9 -->
  <nav style="background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-nav);">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 38px; height: 38px; background: #0060B3; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0, 96, 179, 0.3);">
        <mat-icon style="color: white; font-size: 22px; width: 22px; height: 22px;">account_balance</mat-icon>
      </div>
      <div>
        <span style="color: var(--on-surface); font-weight: 800; font-size: 16px; letter-spacing: 0.3px;">BPBF \u2014 Mon Espace Collaborateur</span>
        <div style="font-size: 11px; color: var(--on-surface-3); font-weight: 600;">Portail Personnel des Salaires & Absences</div>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 16px;">
      <div style="color: var(--on-surface); font-size: 13px; text-align: right;">
        <div style="font-weight: 700;">{{ currentUser?.prenom }} {{ currentUser?.nom }}</div>
        <div style="font-size: 11px; color: var(--on-surface-3);">{{ currentAgent?.matricule || currentUser?.matricule || currentUser?.username || currentUser?.email }}</div>
      </div>
      <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(0, 96, 179, 0.12); border: 1.5px solid #0060B3; display: flex; align-items: center; justify-content: center; color: #0060B3; font-weight: 800; font-size: 14px;">
        {{ (currentUser?.prenom?.charAt(0) || '') + (currentUser?.nom?.charAt(0) || '') }}
      </div>
      <button mat-icon-button style="color: var(--on-surface);" title="Se d\xE9connecter" (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </div>
  </nav>

  <!-- Contenu principal -->
  <div style="max-width: 960px; margin: 0 auto; padding: 28px 20px;">

    <!-- Carte de bienvenue avec profil agent -->
    <div style="background: linear-gradient(135deg, #0060B3 0%, #0284c7 100%); border-radius: 16px; padding: 22px 26px; margin-bottom: 22px; color: white; box-shadow: 0 8px 24px rgba(0, 96, 179, 0.25);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800;">
              \u{1F44B} Bonjour, {{ currentUser?.prenom }} !
            </h1>
            <span style="background: rgba(255,255,255,0.22); padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
              {{ currentAgent?.matricule || currentUser?.matricule || currentUser?.username || 'AGENT' }}
            </span>
          </div>
          <p style="margin: 0; opacity: 0.9; font-size: 13.5px;">
            Consultez et t\xE9l\xE9chargez vos bulletins de paie officiels BPBF et suivez vos cong\xE9s.
          </p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button mat-raised-button
            style="background: rgba(255,255,255,0.2); color: white; border-radius: 8px; font-weight: 600; border: 1px solid rgba(255,255,255,0.35); backdrop-filter: blur(8px);"
            (click)="showChangerMdp = !showChangerMdp">
            <mat-icon style="margin-right: 6px;">lock</mat-icon>
            Changer mon mot de passe
          </button>
        </div>
      </div>
    </div>

    <!-- Formulaire changement de mot de passe -->
    @if (showChangerMdp) {
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; margin-bottom: 22px; box-shadow: var(--shadow-card);">
        <h3 style="margin: 0 0 14px; color: #0060B3; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <mat-icon>lock</mat-icon> Modifier mon mot de passe
        </h3>
        @if (mdpSuccess) {
          <div style="background: #dcfce7; color: #166534; padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-weight: 600; font-size: 13px;">{{ mdpSuccess }}</div>
        }
        @if (mdpError) {
          <div style="background: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-weight: 600; font-size: 13px;">{{ mdpError }}</div>
        }
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--on-surface-2); display: block; margin-bottom: 4px;">Nouveau mot de passe</label>
            <input type="password" [(ngModel)]="newPassword" placeholder="Nouveau mot de passe"
              style="width: 100%; padding: 9px 12px; border: 1px solid var(--border); background: var(--surface-variant); color: var(--on-surface); border-radius: 8px; font-size: 13px; box-sizing: border-box;" />
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--on-surface-2); display: block; margin-bottom: 4px;">Confirmer le mot de passe</label>
            <input type="password" [(ngModel)]="confirmPassword" placeholder="Confirmer"
              style="width: 100%; padding: 9px 12px; border: 1px solid var(--border); background: var(--surface-variant); color: var(--on-surface); border-radius: 8px; font-size: 13px; box-sizing: border-box;" />
          </div>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button mat-button (click)="showChangerMdp = false">Annuler</button>
          <button mat-raised-button color="primary" style="background: #0060B3; font-weight: 700;" (click)="changerMotDePasse()">
            <mat-icon style="margin-right: 6px;">save</mat-icon> Enregistrer
          </button>
        </div>
      </div>
    }

    <!-- Widget Mes Cong\xE9s & Absences -->
    <div style="background: var(--surface); border-radius: 14px; padding: 18px 22px; margin-bottom: 22px; box-shadow: var(--shadow-card); border: 1px solid var(--border);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <span style="font-weight: 700; color: var(--on-surface); font-size: 15px; display: flex; align-items: center; gap: 8px;">
          <mat-icon style="color: #0284c7;">beach_access</mat-icon> Mon Solde de Cong\xE9s & Absences
        </span>
        <a mat-raised-button routerLink="/grh/conges/nouveau"
           style="background: #0060B3; color: white; font-weight: 700; border-radius: 8px; font-size: 12.5px;">
          <mat-icon style="margin-right: 4px; font-size: 18px; width: 18px; height: 18px;">add_circle</mat-icon> Demander un cong\xE9
        </a>
      </div>

      <!-- KPI Solde -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 14px;">
        <div style="background: var(--surface-variant); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px;">
          <div style="font-size: 11px; color: var(--on-surface-3); font-weight: 700; text-transform: uppercase;">DROIT ANNUEL</div>
          <div style="font-size: 18px; font-weight: 800; color: var(--on-surface); margin-top: 2px;">{{ monSoldeConge?.droitAnnuel || 30 }} jours</div>
        </div>

        <div style="background: var(--surface-variant); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px;">
          <div style="font-size: 11px; color: #0284c7; font-weight: 700; text-transform: uppercase;">JOURS ACQUIS</div>
          <div style="font-size: 18px; font-weight: 800; color: #0284c7; margin-top: 2px;">{{ (monSoldeConge?.joursAcquis || 0) | number:'1.0-1' }} j</div>
        </div>

        <div style="background: var(--surface-variant); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px;">
          <div style="font-size: 11px; color: #dc2626; font-weight: 700; text-transform: uppercase;">JOURS PRIS</div>
          <div style="font-size: 18px; font-weight: 800; color: #dc2626; margin-top: 2px;">{{ monSoldeConge?.joursPris || 0 }} j</div>
        </div>

        <div style="background: rgba(22, 163, 74, 0.08); border: 1px solid rgba(22, 163, 74, 0.25); border-radius: 10px; padding: 12px 16px;">
          <div style="font-size: 11px; color: #15803d; font-weight: 800; text-transform: uppercase;">SOLDE RESTANT</div>
          <div style="font-size: 20px; font-weight: 900; color: #15803d; margin-top: 2px;">{{ (monSoldeConge?.soldeRestant || 0) | number:'1.0-1' }} jours</div>
        </div>
      </div>

      <!-- Mes demandes r\xE9centes -->
      @if (mesConges && mesConges.length > 0) {
        <div style="border-top: 1px solid var(--border); padding-top: 12px;">
          <div style="font-size: 12px; font-weight: 700; color: var(--on-surface-2); margin-bottom: 8px;">Mes demandes d'absence r\xE9centes :</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            @for (c of mesConges; track c.id) {
              <div style="display: flex; justify-content: space-between; align-items: center; background: var(--surface-variant); border-radius: 8px; padding: 8px 12px; font-size: 13px;">
                <div>
                  <strong style="color: #0060B3;">{{ c.type || 'Cong\xE9 annuel' }}</strong> \u2014 
                  <span>Du {{ c.dateDebut | date:'dd/MM/yyyy' }} au {{ c.dateFin | date:'dd/MM/yyyy' }}</span>
                  <span style="color: var(--on-surface-3); margin-left: 6px;">({{ c.nbJours }} j)</span>
                </div>
                <div>
                  @if (c.statut === 'APPROUVE' || c.statut === 'Approuv\xE9' || c.statut === 'VALIDE') {
                    <span style="background: #ecfdf5; color: #047857; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 11px;">Approuv\xE9</span>
                  } @else if (c.statut === 'REJETE' || c.statut === 'Refus\xE9') {
                    <span style="background: #fef2f2; color: #b91c1c; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 11px;">Rejet\xE9</span>
                  } @else {
                    <span style="background: #fffbeb; color: #b45309; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 11px;">En attente</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <!-- P\xE9riodes disponibles / Historique des bulletins de l'agent -->
    @if (moisDisponibles && moisDisponibles.length > 0) {
      <div class="available-months-bar">
        <span class="amb-label">
          <mat-icon>history_edu</mat-icon> Vos Bulletins Disponibles :
        </span>
        <div class="amb-pills">
          @for (m of moisDisponibles; track m.label) {
            <button type="button" class="month-pill"
                    [class.active]="m.moisIndex === moisIndex && m.annee === selectedYear"
                    (click)="selectionnerMoisDisponible(m)">
              <span>{{ m.label }}</span>
              @if (m.net) {
                <span class="pill-net">{{ m.net | number:'1.0-0' }} F</span>
              }
            </button>
          }
        </div>
      </div>
    }

    <!-- S\xE9lecteur de Mois Principal -->
    <div style="background: var(--surface); border-radius: 12px; padding: 14px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-card); border: 1px solid var(--border); flex-wrap: wrap; gap: 12px;">
      <span style="font-weight: 800; color: #0060B3; font-size: 16px; display: flex; align-items: center; gap: 8px;">
        <mat-icon style="color: #0284c7;">receipt_long</mat-icon> Mes Bulletins de Paie
      </span>
      <div style="display: flex; align-items: center; gap: 8px; background: var(--surface-variant); padding: 4px 10px; border-radius: 8px; border: 1px solid var(--border);">
        <button mat-icon-button (click)="changerMois(-1)" style="color: var(--on-surface);" title="Mois pr\xE9c\xE9dent">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <span style="font-weight: 800; color: #0060B3; min-width: 150px; text-align: center; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
          {{ periode }}
        </span>
        <button mat-icon-button (click)="changerMois(1)" style="color: var(--on-surface);" title="Mois suivant">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    </div>

    <!-- Affichage du Bulletin -->
    @if (isLoading) {
      <div style="background: var(--surface); border-radius: 14px; padding: 48px; text-align: center; box-shadow: var(--shadow-card); border: 1px solid var(--border);">
        <mat-spinner diameter="40" style="margin: 0 auto 16px;"></mat-spinner>
        <p style="color: #0060B3; font-weight: 700; font-size: 15px;">Chargement de votre bulletin de paie...</p>
      </div>
    } @else {
      @for (b of bulletins; track b.code) {
        <div class="payslip-official-card">
          <!-- Header officiel Banque Postale -->
          <div class="payslip-header">
            <div class="bank-identity">
              <div class="bank-badge">BPBF</div>
              <div class="bank-text">
                <h2>BANQUE POSTALE DU BURKINA FASO</h2>
                <p>BULLETIN OFFICIEL DE PAIE \u2022 R\xC9F : {{ b.code }}</p>
              </div>
            </div>
            <div class="header-actions">
              @if (b.etat === 'VALIDE' || b.etat === 'CLOTURE') {
                <span style="background: #15803d; color: white; padding: 5px 14px; border-radius: 20px; font-weight: 800; font-size: 11px; letter-spacing: 0.5px;">
                  \u2705 VALID\xC9
                </span>
              } @else {
                <span style="background: #f59e0b; color: white; padding: 5px 14px; border-radius: 20px; font-weight: 800; font-size: 11px; letter-spacing: 0.5px;">
                  \u23F3 EN COURS
                </span>
              }

              <!-- BOUTON TELECHARGER PDF OFFICIEL -->
              <button mat-raised-button class="btn-download-pdf" (click)="telechargerPdf(b)" [disabled]="isDownloadingPdf" title="T\xE9l\xE9charger le fichier PDF officiel \xE9mis par la BPBF">
                <mat-icon>picture_as_pdf</mat-icon>
                <span>{{ isDownloadingPdf ? 'T\xE9l\xE9chargement...' : 'T\xE9l\xE9charger PDF' }}</span>
              </button>

              <!-- BOUTON OUVRIR / IMPRIMER -->
              <button mat-stroked-button class="btn-view-pdf" (click)="ouvrirPdfEnLigne(b)" title="Visualiser dans un nouvel onglet">
                <mat-icon>open_in_new</mat-icon>
                <span>Ouvrir</span>
              </button>

              <button mat-icon-button (click)="exporterImpression()" title="Imprimer la page" style="color: var(--on-surface-2);">
                <mat-icon>print</mat-icon>
              </button>
            </div>
          </div>

          <div class="payslip-body">
            <!-- Fiche Agent & Mode de r\xE8glement -->
            <div class="emp-summary-box">
              <div class="avatar-large">{{ b.employeeName.charAt(0) }}</div>
              <div class="emp-details">
                <h3 class="emp-name-title">{{ b.employeeName }}</h3>
                <div class="emp-meta">
                  Matricule : <strong>{{ b.matricule }}</strong> | 
                  Fonction : <strong>{{ b.fonction }}</strong> | 
                  Grade : <strong>{{ b.grade }}</strong>
                </div>
              </div>
              <div class="payment-method-box">
                <div class="pm-lbl">Mode de r\xE8glement</div>
                <div class="pm-val">{{ b.modeReglement }}</div>
                <div class="pm-rib">{{ b.numeroCompteBancaire }}</div>
              </div>
            </div>

            <!-- Cartouche p\xE9riode & charges -->
            <div class="cartouche-clean">
              <div class="info-block">
                <div class="info-row"><span class="lbl">P\xE9riode de Paie :</span> <strong>{{ b.dateFrom }} au {{ b.dateTo }} ({{ periode }})</strong></div>
                <div class="info-row"><span class="lbl">Jours Travaill\xE9s :</span> <strong>{{ b.workedDays }} / {{ b.scheduledWorkingDays }} Jours</strong></div>
              </div>
              <div class="info-block">
                <div class="info-row"><span class="lbl">Si\xE8ge Social :</span> <span>01 BP 600 Ouagadougou 01</span></div>
                <div class="info-row"><span class="lbl">Charges de Famille :</span> <strong>{{ b.nombreCharges }} charge(s)</strong></div>
              </div>
            </div>

            <!-- Tableau Structur\xE9 des 7 Colonnes BPBF -->
            <div class="table-lines-box">
              <table class="grid-7-table">
                <thead>
                  <tr>
                    <th style="width: 25%;">NOM</th>
                    <th style="width: 14%;">CAT\xC9GORIE</th>
                    <th style="text-align: right; width: 8%;">QUANTIT\xC9</th>
                    <th style="text-align: right; width: 9%;">TAUX (%)</th>
                    <th style="width: 22%;">R\xC8GLE</th>
                    <th style="text-align: right; width: 11%;">MONTANT</th>
                    <th style="text-align: right; width: 11%;">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  @for (l of b.lines; track l.name) {
                    <tr [class.row-net]="l.category === 'NET'" 
                        [class.row-tot]="l.category?.includes('TOTAL') || l.name?.includes('BRUT')"
                        [class.row-deduct]="l.category === 'DEDUCTION'">
                      <td><strong>{{ l.name }}</strong></td>
                      <td><span class="cat-pill pill-{{ (l.category || 'element').toLowerCase() }}">{{ l.category || 'ELEMENT' }}</span></td>
                      <td style="text-align: right; font-family: monospace;">{{ (l.quantity || 1) | number:'1.2-2' }}</td>
                      <td style="text-align: right; font-family: monospace;">{{ (l.rate || 100) | number:'1.2-2' }}</td>
                      <td style="font-size: 11px; color: var(--on-surface-3);">{{ l.regle || '\u2014' }}</td>
                      <td style="text-align: right; font-family: monospace;" [class.text-neg]="l.amount < 0">
                        {{ l.amount | number:'1.0-0' }}
                      </td>
                      <td style="text-align: right; font-family: monospace; font-weight: 700;" [class.text-neg]="l.amount < 0">
                        {{ l.amount | number:'1.0-0' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Montant en Toutes Lettres -->
            <div class="in-words-box">
              <mat-icon style="font-size: 20px; width: 20px; height: 20px; color: #0060B3;">verified</mat-icon>
              <span><strong>Montant Net \xE0 Payer en toutes lettres :</strong> {{ b.montantEnLettres }}</span>
            </div>
          </div>
        </div>
      }

      <!-- \xC9tat Aucun Bulletin pour ce mois -->
      @if (bulletins.length === 0) {
        <div style="background: var(--surface); border-radius: 16px; padding: 48px 32px; text-align: center; box-shadow: var(--shadow-card); border: 1px dashed var(--border); margin-bottom: 24px;">
          <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(0, 96, 179, 0.1); color: #0060B3; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <mat-icon style="font-size: 38px; width: 38px; height: 38px;">receipt_long</mat-icon>
          </div>
          <h3 style="margin: 0 0 8px 0; color: var(--on-surface); font-size: 18px; font-weight: 800;">Aucun bulletin disponible pour {{ periode }}</h3>
          <p style="color: var(--on-surface-3); font-size: 14px; max-width: 540px; margin: 0 auto 20px; line-height: 1.5;">
            Votre bulletin de paie pour ce mois n'a pas encore \xE9t\xE9 cl\xF4tur\xE9 ou mis \xE0 disposition par le service Paie & RH.
          </p>

          <!-- Raccourcis vers les autres mois disponibles -->
          @if (moisDisponibles && moisDisponibles.length > 0) {
            <div style="background: var(--surface-variant); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; max-width: 580px; margin: 0 auto 24px; text-align: left;">
              <div style="font-size: 12.5px; font-weight: 700; color: var(--on-surface-2); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <mat-icon style="font-size: 18px; width: 18px; height: 18px; color: #0060B3;">history</mat-icon>
                Consulter un bulletin d\xE9j\xE0 disponible :
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                @for (m of moisDisponibles; track m.label) {
                  <button mat-stroked-button (click)="selectionnerMoisDisponible(m)" style="border-radius: 20px; font-size: 12px; font-weight: 700; color: #0060B3; border-color: #0060B3;">
                    <mat-icon style="font-size: 16px; width: 16px; height: 16px; margin-right: 4px;">visibility</mat-icon>
                    {{ m.label }}
                  </button>
                }
              </div>
            </div>
          }

          <button mat-raised-button color="primary" style="background: #0060B3; font-weight: 700; border-radius: 8px; padding: 0 22px; height: 42px;" (click)="ouvrirModalDemandeBulletin()">
            <mat-icon style="margin-right: 8px;">mark_email_read</mat-icon> Faire une demande de bulletin RH
          </button>
        </div>
      }
    }
  </div>

  <!-- MODAL : DEMANDE DE BULLETIN RH -->
  @if (showDemandeBulletinModal) {
    <div class="custom-modal-overlay" style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 40px 20px; overflow-y: auto;">
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 540px; box-shadow: var(--shadow-card); overflow: hidden; color: var(--on-surface);">
        <!-- Header modal -->
        <div style="background: var(--surface-variant); border-bottom: 1px solid var(--border); padding: 18px 24px; color: var(--on-surface); display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="background: #0060B3; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <mat-icon style="color: white; font-size: 20px; width: 20px; height: 20px;">receipt_long</mat-icon>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--on-surface);">Demande de Bulletin de Paie</h3>
              <p style="margin: 0; font-size: 12px; color: var(--on-surface-3);">Transmission directe au service Paie & RH</p>
            </div>
          </div>
          <button mat-icon-button (click)="fermerModalDemandeBulletin()" style="color: var(--on-surface-3);">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Corps modal -->
        <div style="padding: 24px;">
          @if (demandeEnvoyeeSuccess) {
            <div style="background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 16px; border-radius: 10px; text-align: center; margin-bottom: 16px;">
              <mat-icon style="font-size: 32px; width: 32px; height: 32px; color: #16a34a; margin-bottom: 4px;">check_circle</mat-icon>
              <h4 style="margin: 0 0 4px 0; font-weight: 800;">Demande transmise avec succ\xE8s !</h4>
              <p style="margin: 0; font-size: 13px;">Le service Paie a \xE9t\xE9 notifi\xE9 de votre demande pour {{ demandeBulletinForm.periode }}.</p>
            </div>
          } @else {
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <mat-form-field appearance="outline" style="width: 100%;">
                <mat-label>P\xE9riode demand\xE9e</mat-label>
                <input matInput [(ngModel)]="demandeBulletinForm.periode" readonly style="font-weight: 700; color: #0060B3;">
              </mat-form-field>

              <mat-form-field appearance="outline" style="width: 100%;">
                <mat-label>Motif de la demande</mat-label>
                <mat-select [(ngModel)]="demandeBulletinForm.motif">
                  <mat-option value="Justificatif personnel / D\xE9marches administratives">Justificatif personnel / D\xE9marches administratives</mat-option>
                  <mat-option value="Dossier bancaire / Demande de pr\xEAt">Dossier bancaire / Demande de pr\xEAt</mat-option>
                  <mat-option value="Demande de visa / Voyage">Demande de visa / Voyage</mat-option>
                  <mat-option value="R\xE9gularisation / V\xE9rification salariale">R\xE9gularisation / V\xE9rification salariale</mat-option>
                  <mat-option value="Autre motif">Autre motif</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" style="width: 100%;">
                <mat-label>Niveau d'urgence</mat-label>
                <mat-select [(ngModel)]="demandeBulletinForm.urgence">
                  <mat-option value="NORMALE">Normale (sous 48h)</mat-option>
                  <mat-option value="URGENTE">Urgente (sous 24h)</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" style="width: 100%;">
                <mat-label>Pr\xE9cisions / Commentaire (optionnel)</mat-label>
                <textarea matInput [(ngModel)]="demandeBulletinForm.commentaire" rows="3" placeholder="Ajouter une pr\xE9cision si n\xE9cessaire..."></textarea>
              </mat-form-field>
            </div>
          }
        </div>

        <!-- Footer modal -->
        @if (!demandeEnvoyeeSuccess) {
          <div style="padding: 16px 24px; background: var(--surface-variant); border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px;">
            <button mat-stroked-button (click)="fermerModalDemandeBulletin()">Annuler</button>
            <button mat-raised-button color="primary" style="background: #0060B3; font-weight: 700;" (click)="envoyerDemandeBulletin()">
              <mat-icon style="margin-right: 6px;">send</mat-icon> Transmettre la demande
            </button>
          </div>
        }
      </div>
    </div>
  }
</div>
`, styles: ['@charset "UTF-8";\n\n/* src/app/features/mon-espace/mon-espace/mon-espace.component.scss */\n.payslip-official-card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  overflow: hidden;\n  box-shadow: var(--shadow-card);\n  color: var(--on-surface);\n  margin-bottom: 24px;\n}\n.payslip-official-card .payslip-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 2px solid #0284c7;\n  padding: 18px 24px;\n  background: var(--surface-variant);\n  flex-wrap: wrap;\n  gap: 14px;\n}\n.payslip-official-card .payslip-header .bank-identity {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.payslip-official-card .payslip-header .bank-identity .bank-badge {\n  background: #0284c7;\n  color: white;\n  font-weight: 900;\n  font-size: 15px;\n  padding: 6px 14px;\n  border-radius: 8px;\n  letter-spacing: 1px;\n}\n.payslip-official-card .payslip-header .bank-identity .bank-text h2 {\n  margin: 0;\n  font-size: 17px;\n  font-weight: 900;\n  color: #0284c7;\n  letter-spacing: 0.5px;\n}\n.payslip-official-card .payslip-header .bank-identity .bank-text p {\n  margin: 2px 0 0 0;\n  font-size: 11.5px;\n  color: var(--on-surface-3);\n  font-family: monospace;\n  font-weight: 700;\n}\n.payslip-official-card .payslip-header .header-actions {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.payslip-official-card .payslip-header .header-actions .btn-print-payslip {\n  background: #0284c7 !important;\n  color: white !important;\n  font-weight: 700;\n  border-radius: 8px;\n}\n.payslip-official-card .payslip-body {\n  padding: 24px;\n}\n.payslip-official-card .emp-summary-box {\n  background: var(--surface-variant);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 14px 18px;\n  margin-bottom: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 14px;\n}\n.payslip-official-card .emp-summary-box .avatar-large {\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  background: #0284c7;\n  color: white;\n  font-size: 18px;\n  font-weight: 800;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  margin-right: 14px;\n}\n.payslip-official-card .emp-summary-box .emp-details {\n  flex: 1;\n  min-width: 200px;\n}\n.payslip-official-card .emp-summary-box .emp-details .emp-name-title {\n  font-size: 17px;\n  font-weight: 800;\n  color: var(--on-surface);\n  margin: 0 0 2px 0;\n}\n.payslip-official-card .emp-summary-box .emp-details .emp-meta {\n  font-size: 12.5px;\n  color: var(--on-surface-3);\n}\n.payslip-official-card .emp-summary-box .emp-details .emp-meta strong {\n  color: var(--on-surface);\n}\n.payslip-official-card .emp-summary-box .payment-method-box {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  padding: 6px 14px;\n  text-align: right;\n  flex-shrink: 0;\n}\n.payslip-official-card .emp-summary-box .payment-method-box .pm-lbl {\n  font-size: 10px;\n  color: var(--on-surface-3);\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.payslip-official-card .emp-summary-box .payment-method-box .pm-val {\n  font-size: 12px;\n  font-weight: 700;\n  color: #0284c7;\n}\n.payslip-official-card .emp-summary-box .payment-method-box .pm-rib {\n  font-size: 11px;\n  font-family: monospace;\n  color: var(--on-surface-2);\n}\n.payslip-official-card .cartouche-clean {\n  background: var(--surface-variant);\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  padding: 12px 18px;\n  margin-bottom: 14px;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n  font-size: 12px;\n}\n.payslip-official-card .cartouche-clean .info-block {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.payslip-official-card .cartouche-clean .info-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.payslip-official-card .cartouche-clean .info-row .lbl {\n  color: var(--on-surface-3);\n}\n.payslip-official-card .cartouche-clean .info-row strong {\n  color: var(--on-surface);\n}\n.payslip-official-card .cartouche-clean .info-row span {\n  color: var(--on-surface-2);\n}\n.payslip-official-card .table-lines-box {\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  overflow-x: auto;\n  margin-bottom: 14px;\n  background: var(--surface);\n}\n.payslip-official-card .table-lines-box .grid-7-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 12px;\n}\n.payslip-official-card .table-lines-box .grid-7-table thead tr {\n  background: #0284c7;\n  color: white;\n  text-transform: uppercase;\n  font-weight: 800;\n  font-size: 10.5px;\n  letter-spacing: 0.5px;\n}\n.payslip-official-card .table-lines-box .grid-7-table thead tr th {\n  padding: 10px 12px;\n  text-align: left;\n}\n.payslip-official-card .table-lines-box .grid-7-table tbody tr {\n  border-bottom: 1px solid var(--border);\n  color: var(--on-surface);\n  transition: background 0.1s;\n}\n.payslip-official-card .table-lines-box .grid-7-table tbody tr:hover {\n  background: var(--surface-hover);\n}\n.payslip-official-card .table-lines-box .grid-7-table tbody tr td {\n  padding: 9px 12px;\n  vertical-align: middle;\n}\n.payslip-official-card .table-lines-box .grid-7-table tbody tr.row-tot {\n  background: var(--surface-variant);\n  font-weight: 700;\n  color: var(--on-surface);\n  border-top: 1px solid var(--border);\n  border-bottom: 1px solid var(--border);\n}\n.payslip-official-card .table-lines-box .grid-7-table tbody tr.row-deduct td {\n  color: #c084fc;\n}\n.payslip-official-card .table-lines-box .grid-7-table tbody tr.row-net {\n  background: #15803d !important;\n  color: #ffffff !important;\n  font-weight: 800;\n  font-size: 13px;\n}\n.payslip-official-card .table-lines-box .grid-7-table tbody tr.row-net td {\n  color: #ffffff !important;\n  padding: 12px 12px;\n}\n.payslip-official-card .in-words-box {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: rgba(2, 132, 199, 0.12);\n  border-left: 3px solid #0284c7;\n  border-radius: 4px;\n  padding: 10px 14px;\n  font-size: 12.5px;\n  color: #0284c7;\n  font-weight: 600;\n}\n@media (max-width: 768px) {\n  .payslip-official-card .payslip-header {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .payslip-official-card .emp-summary-box {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .payslip-official-card .emp-summary-box .payment-method-box {\n    text-align: left;\n    width: 100%;\n  }\n  .payslip-official-card .cartouche-clean {\n    grid-template-columns: 1fr;\n  }\n}\n.cat-pill {\n  font-size: 9.5px;\n  font-weight: 800;\n  padding: 2px 7px;\n  border-radius: 4px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  display: inline-block;\n}\n.cat-pill.pill-element {\n  background: rgba(2, 132, 199, 0.12);\n  color: #0284c7;\n  border: 1px solid rgba(2, 132, 199, 0.25);\n}\n.cat-pill.pill-indemnites {\n  background: rgba(74, 222, 128, 0.15);\n  color: #16a34a;\n  border: 1px solid rgba(74, 222, 128, 0.3);\n}\n.cat-pill.pill-deduction {\n  background: rgba(192, 132, 252, 0.15);\n  color: #7c3aed;\n  border: 1px solid rgba(192, 132, 252, 0.3);\n}\n.cat-pill.pill-bi {\n  background: rgba(251, 146, 60, 0.15);\n  color: #ea580c;\n  border: 1px solid rgba(251, 146, 60, 0.3);\n}\n.cat-pill.pill-retenue {\n  background: rgba(248, 113, 113, 0.15);\n  color: #dc2626;\n  border: 1px solid rgba(248, 113, 113, 0.3);\n}\n.cat-pill.pill-precompte {\n  background: rgba(239, 68, 68, 0.15);\n  color: #b91c1c;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.cat-pill.pill-total_retenue {\n  background: rgba(239, 68, 68, 0.25);\n  color: #991b1b;\n  font-weight: 900;\n}\n.cat-pill.pill-charges_pat {\n  background: rgba(148, 163, 184, 0.2);\n  color: #475569;\n}\n.cat-pill.pill-total_pat {\n  background: rgba(148, 163, 184, 0.3);\n  color: #334155;\n  font-weight: 900;\n}\n.cat-pill.pill-net {\n  background: #16a34a;\n  color: white;\n  font-weight: 900;\n}\n.text-neg {\n  color: #dc2626 !important;\n}\n.available-months-bar {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 12px 18px;\n  margin-bottom: 20px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  flex-wrap: wrap;\n}\n.available-months-bar .amb-label {\n  font-size: 13px;\n  font-weight: 700;\n  color: var(--on-surface-2);\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n}\n.available-months-bar .amb-label mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #0284c7;\n}\n.available-months-bar .amb-pills {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.available-months-bar .amb-pills .month-pill {\n  background: var(--surface-variant);\n  border: 1px solid var(--border);\n  color: var(--on-surface);\n  border-radius: 20px;\n  padding: 6px 14px;\n  font-size: 12.5px;\n  font-weight: 600;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  transition: all 0.2s ease;\n}\n.available-months-bar .amb-pills .month-pill:hover {\n  background: rgba(2, 132, 199, 0.1);\n  border-color: #0284c7;\n  color: #0284c7;\n  transform: translateY(-1px);\n}\n.available-months-bar .amb-pills .month-pill.active {\n  background: #0284c7;\n  border-color: #0284c7;\n  color: white;\n  font-weight: 700;\n  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);\n}\n.available-months-bar .amb-pills .month-pill.active .pill-net {\n  background: rgba(255, 255, 255, 0.25);\n  color: white;\n}\n.available-months-bar .amb-pills .month-pill .pill-net {\n  background: rgba(2, 132, 199, 0.12);\n  color: #0284c7;\n  font-size: 11px;\n  font-weight: 800;\n  padding: 2px 7px;\n  border-radius: 10px;\n  font-family: monospace;\n}\n.btn-download-pdf {\n  background: #0284c7 !important;\n  color: white !important;\n  font-weight: 700 !important;\n  border-radius: 8px !important;\n  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35) !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 6px !important;\n}\n.btn-view-pdf {\n  border-color: #0284c7 !important;\n  color: #0284c7 !important;\n  font-weight: 700 !important;\n  border-radius: 8px !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 6px !important;\n}\n/*# sourceMappingURL=mon-espace.component.css.map */\n'] }]
  }], () => [{ type: HttpClient }, { type: AuthService }, { type: BulletinPdfService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MonEspaceComponent, { className: "MonEspaceComponent", filePath: "src/app/features/mon-espace/mon-espace/mon-espace.component.ts", lineNumber: 24 });
})();

// src/app/features/mon-espace/mon-espace.module.ts
var routes = [
  { path: "", component: MonEspaceComponent }
];
var MonEspaceModule = class _MonEspaceModule {
  static \u0275fac = function MonEspaceModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MonEspaceModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _MonEspaceModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MonEspaceModule, [{
    type: NgModule,
    args: [{
      declarations: [MonEspaceComponent],
      imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
      ]
    }]
  }], null, null);
})();
export {
  MonEspaceModule
};
//# sourceMappingURL=chunk-6AEWAZUE.js.map
