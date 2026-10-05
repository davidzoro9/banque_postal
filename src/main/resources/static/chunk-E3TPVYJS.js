import {
  CommonModule,
  Component,
  Router,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵtext
} from "./chunk-YWFD3R2X.js";

// src/app/features/maintenance/maintenance.component.ts
var MaintenanceComponent = class _MaintenanceComponent {
  router;
  countdown = 30;
  intervalId;
  constructor(router) {
    this.router = router;
  }
  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.countdown = 30;
        this.checkStatus();
      }
    }, 1e3);
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  checkStatus() {
    window.location.href = "/dashboard";
  }
  static \u0275fac = function MaintenanceComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MaintenanceComponent)(\u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MaintenanceComponent, selectors: [["app-maintenance"]], decls: 115, vars: 0, consts: [[1, "maintenance-wrapper"], [1, "top-bar"], [1, "top-bar-links"], [1, "sep"], [1, "top-bar-location"], ["href", "https://teliainfo.com", "target", "_blank", "rel", "noopener noreferrer", 1, "top-bar-link", 2, "color", "#ffc000", "text-decoration", "none", "font-weight", "600", "margin-right", "8px"], [1, "flag"], [1, "header-logo-bar"], [1, "logo-container"], ["src", "bpbf-logo.png", "alt", "Logo BPBF", 1, "bpbf-logo"], [1, "logo-tagline"], [1, "bank-title"], [1, "bank-sub"], [1, "header-badge"], [1, "pulse-dot"], [1, "hero-section"], [1, "hero-container"], [1, "hero-media"], [1, "hero-avatar-wrapper"], ["src", "bpbf-maintenance-agent.jpg", "alt", "Support TELIA INFORMATIQUE", 1, "hero-avatar"], [1, "hero-badge-tag"], [1, "hero-content"], [1, "hero-arrow"], [1, "hero-title"], [1, "hero-subtitle"], [1, "hero-status-pill"], [1, "dot"], [1, "cards-section"], [1, "cards-grid", 2, "grid-template-columns", "repeat(auto-fit, minmax(350px, 1fr))"], [1, "info-card"], [1, "card-top"], [1, "card-title"], [1, "card-text"], [1, "card-action"], [1, "card-badge"], ["href", "tel:+22625377335", 1, "contact-link", 2, "color", "#003366", "font-weight", "700", "text-decoration", "none"], ["href", "mailto:contact@teliainfo.com", 1, "contact-link", 2, "color", "#003366", "font-weight", "700", "text-decoration", "none"], ["href", "https://teliainfo.com", "target", "_blank", "rel", "noopener noreferrer", 1, "contact-link", 2, "color", "#003366", "font-weight", "700", "text-decoration", "none"], ["href", "mailto:contact@teliainfo.com", 1, "btn-action", "btn-outline"], [1, "footer-brand"]], template: function MaintenanceComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "span");
      \u0275\u0275text(4, "Banque Postale du Burkina Faso");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(5, "span", 3);
      \u0275\u0275text(6, "\u2022");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(7, "span");
      \u0275\u0275text(8, "Direction du Capital Humain (DCH)");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(9, "span", 3);
      \u0275\u0275text(10, "\u2022");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(11, "span");
      \u0275\u0275text(12, "Partenaire IT : ");
      \u0275\u0275domElementStart(13, "strong");
      \u0275\u0275text(14, "TELIA INFORMATIQUE");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(15, "div", 4)(16, "a", 5);
      \u0275\u0275text(17, " \u{1F310} Visiter teliainfo.com \u2197 ");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(18, "span", 3);
      \u0275\u0275text(19, "|");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(20, "span", 6);
      \u0275\u0275text(21, "\u{1F1E7}\u{1F1EB}");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(22, "span");
      \u0275\u0275text(23, "Ouagadougou, Burkina Faso");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(24, "header", 7)(25, "div", 8);
      \u0275\u0275domElement(26, "img", 9);
      \u0275\u0275domElementStart(27, "div", 10)(28, "span", 11);
      \u0275\u0275text(29, "BANQUE POSTALE DU BURKINA FASO");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(30, "span", 12);
      \u0275\u0275text(31, "Pour chacun et pour tous \u2022 Syst\xE8me d'Information des Ressources Humaines");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(32, "div", 13);
      \u0275\u0275domElement(33, "div", 14);
      \u0275\u0275domElementStart(34, "span");
      \u0275\u0275text(35, "Intervention technique programm\xE9e");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(36, "section", 15)(37, "div", 16)(38, "div", 17)(39, "div", 18);
      \u0275\u0275domElement(40, "img", 19);
      \u0275\u0275domElementStart(41, "div", 20)(42, "span");
      \u0275\u0275text(43, "\u2699\uFE0F");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(44, "span");
      \u0275\u0275text(45, "TELIA INFORMATIQUE \u2022 IT");
      \u0275\u0275domElementEnd()()()();
      \u0275\u0275domElementStart(46, "div", 21)(47, "div", 22);
      \u0275\u0275text(48, "\u25BC");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(49, "h1", 23);
      \u0275\u0275text(50, " PLATEFORME SIRH ");
      \u0275\u0275domElement(51, "br");
      \u0275\u0275domElementStart(52, "span");
      \u0275\u0275text(53, "EN MAINTENANCE");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(54, "p", 24);
      \u0275\u0275text(55, " Nous effectuons actuellement une intervention d'optimisation technique et de mise \xE0 niveau de votre Syst\xE8me d'Information des Ressources Humaines. L'acc\xE8s aux modules sera r\xE9tabli dans les plus brefs d\xE9lais. ");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(56, "div", 25)(57, "span");
      \u0275\u0275text(58, "\u{1F512} ");
      \u0275\u0275domElementStart(59, "strong");
      \u0275\u0275text(60, "Statut :");
      \u0275\u0275domElementEnd();
      \u0275\u0275text(61, " Maintenance active en cours");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(62, "span", 26);
      \u0275\u0275text(63, "\u2022");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(64, "span");
      \u0275\u0275text(65, "\u{1F6E1}\uFE0F Donn\xE9es prot\xE9g\xE9es et sauvegard\xE9es");
      \u0275\u0275domElementEnd()()()()();
      \u0275\u0275domElementStart(66, "section", 27)(67, "div", 28)(68, "div", 29)(69, "div", 30)(70, "h2", 31);
      \u0275\u0275text(71, "VOTRE PLATEFORME SIRH SE MET \xC0 JOUR !");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(72, "p", 32);
      \u0275\u0275text(73, " L'\xE9quipe IT ");
      \u0275\u0275domElementStart(74, "strong");
      \u0275\u0275text(75, "TELIA INFORMATIQUE");
      \u0275\u0275domElementEnd();
      \u0275\u0275text(76, " proc\xE8de \xE0 la mise \xE0 jour des modules Carri\xE8res, Paie et Gestion Administrative afin d'am\xE9liorer la rapidit\xE9 des calculs et la s\xE9curit\xE9 de vos donn\xE9es. ");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(77, "div", 33)(78, "span", 34);
      \u0275\u0275text(79, "\u2699\uFE0F Intervention planifi\xE9e de routine");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(80, "div", 29)(81, "div", 30)(82, "h2", 31);
      \u0275\u0275text(83, "SUPPORT TECHNIQUE TELIA INFORMATIQUE");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(84, "p", 32);
      \u0275\u0275text(85, " Pour toute assistance ou question relative \xE0 la plateforme durant l'intervention :");
      \u0275\u0275domElement(86, "br")(87, "br");
      \u0275\u0275text(88, " \u{1F4DE} ");
      \u0275\u0275domElementStart(89, "strong");
      \u0275\u0275text(90, "T\xE9l :");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(91, "a", 35);
      \u0275\u0275text(92, "+ (226) 25-37-73-35");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElement(93, "br");
      \u0275\u0275text(94, " \u2709\uFE0F ");
      \u0275\u0275domElementStart(95, "strong");
      \u0275\u0275text(96, "Email :");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(97, "a", 36);
      \u0275\u0275text(98, "contact@teliainfo.com");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElement(99, "br");
      \u0275\u0275text(100, " \u{1F310} ");
      \u0275\u0275domElementStart(101, "strong");
      \u0275\u0275text(102, "Site Web :");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(103, "a", 37);
      \u0275\u0275text(104, "www.teliainfo.com");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(105, "div", 33)(106, "a", 38);
      \u0275\u0275text(107, "Contacter le support TELIA INFORMATIQUE");
      \u0275\u0275domElementEnd()()()()();
      \u0275\u0275domElementStart(108, "footer")(109, "p", 39);
      \u0275\u0275text(110, "BANQUE POSTALE DU BURKINA FASO (BPBF)");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(111, "p");
      \u0275\u0275text(112, "Syst\xE8me d'Information des Ressources Humaines (SIRH)");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(113, "p");
      \u0275\u0275text(114, "\xA9 2026 BPBF \u2022 Maintenance et Infog\xE9rance assur\xE9es par TELIA INFORMATIQUE");
      \u0275\u0275domElementEnd()()();
    }
  }, dependencies: [CommonModule], styles: ['\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100vw;\n  min-height: 100vh;\n  margin: 0;\n  padding: 0;\n}\n.maintenance-wrapper[_ngcontent-%COMP%] {\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial,\n    sans-serif;\n  background-color: #f8fafc;\n  color: #1e293b;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n}\n.top-bar[_ngcontent-%COMP%] {\n  background-color: #0b1f3a;\n  color: #94a3b8;\n  font-size: 12px;\n  padding: 8px 32px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n}\n.top-bar[_ngcontent-%COMP%]   .top-bar-links[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #cbd5e1;\n}\n.top-bar[_ngcontent-%COMP%]   .top-bar-links[_ngcontent-%COMP%]   .sep[_ngcontent-%COMP%] {\n  opacity: 0.4;\n}\n.top-bar[_ngcontent-%COMP%]   .top-bar-location[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #f8fafc;\n  font-weight: 500;\n}\n.header-logo-bar[_ngcontent-%COMP%] {\n  background: #ffffff;\n  padding: 16px 32px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border-bottom: 2px solid #e2e8f0;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);\n}\n.header-logo-bar[_ngcontent-%COMP%]   .logo-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.header-logo-bar[_ngcontent-%COMP%]   .logo-container[_ngcontent-%COMP%]   .bpbf-logo[_ngcontent-%COMP%] {\n  height: 48px;\n  width: auto;\n  object-fit: contain;\n}\n.header-logo-bar[_ngcontent-%COMP%]   .logo-container[_ngcontent-%COMP%]   .logo-tagline[_ngcontent-%COMP%] {\n  border-left: 2px solid #cbd5e1;\n  padding-left: 16px;\n  display: flex;\n  flex-direction: column;\n}\n.header-logo-bar[_ngcontent-%COMP%]   .logo-container[_ngcontent-%COMP%]   .logo-tagline[_ngcontent-%COMP%]   .bank-title[_ngcontent-%COMP%] {\n  font-size: 15px;\n  font-weight: 800;\n  color: #003366;\n  letter-spacing: 0.5px;\n}\n.header-logo-bar[_ngcontent-%COMP%]   .logo-container[_ngcontent-%COMP%]   .logo-tagline[_ngcontent-%COMP%]   .bank-sub[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: #64748b;\n  font-style: italic;\n}\n.header-logo-bar[_ngcontent-%COMP%]   .header-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  background: #fef3c7;\n  color: #92400e;\n  padding: 6px 14px;\n  border-radius: 9999px;\n  font-size: 12px;\n  font-weight: 600;\n  border: 1px solid #fde68a;\n}\n.header-logo-bar[_ngcontent-%COMP%]   .header-badge[_ngcontent-%COMP%]   .pulse-dot[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  background: #d97706;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_pulse 1.6s infinite;\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n  50% {\n    transform: scale(1.4);\n    opacity: 0.5;\n  }\n}\n.hero-section[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #07192f 0%,\n      #003366 55%,\n      #0c2b4d 100%);\n  color: #ffffff;\n  padding: 48px 32px 56px;\n  position: relative;\n  overflow: hidden;\n}\n.hero-section[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: -50px;\n  right: -50px;\n  width: 400px;\n  height: 400px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 192, 0, 0.12) 0%,\n      transparent 70%);\n  border-radius: 50%;\n  pointer-events: none;\n}\n.hero-section[_ngcontent-%COMP%]   .hero-container[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n  display: flex;\n  align-items: center;\n  gap: 56px;\n}\n.hero-section[_ngcontent-%COMP%]   .hero-media[_ngcontent-%COMP%] {\n  flex: 0 0 340px;\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.hero-section[_ngcontent-%COMP%]   .hero-media[_ngcontent-%COMP%]   .hero-avatar-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  width: 320px;\n  height: 320px;\n  border-radius: 50%;\n  padding: 8px;\n  background:\n    linear-gradient(\n      135deg,\n      #ffc000 0%,\n      rgba(255, 255, 255, 0.4) 50%,\n      #003366 100%);\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);\n}\n.hero-section[_ngcontent-%COMP%]   .hero-media[_ngcontent-%COMP%]   .hero-avatar-wrapper[_ngcontent-%COMP%]   .hero-avatar[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  object-fit: cover;\n  object-position: top center;\n  background: #1e3a5f;\n  display: block;\n}\n.hero-section[_ngcontent-%COMP%]   .hero-media[_ngcontent-%COMP%]   .hero-avatar-wrapper[_ngcontent-%COMP%]   .hero-badge-tag[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 8px;\n  right: 18px;\n  background: #003366;\n  border: 2px solid #ffc000;\n  color: #ffffff;\n  padding: 6px 14px;\n  border-radius: 20px;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.5px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.hero-section[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.hero-section[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .hero-arrow[_ngcontent-%COMP%] {\n  color: #ffc000;\n  font-size: 26px;\n  line-height: 1;\n  margin-bottom: 12px;\n  display: inline-block;\n  animation: _ngcontent-%COMP%_bounce 2s infinite;\n}\n.hero-section[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .hero-title[_ngcontent-%COMP%] {\n  font-size: 42px;\n  font-weight: 900;\n  letter-spacing: 1.5px;\n  text-transform: uppercase;\n  line-height: 1.15;\n  margin-bottom: 16px;\n  color: #ffffff;\n  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);\n}\n.hero-section[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .hero-title[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #ffc000;\n}\n.hero-section[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .hero-subtitle[_ngcontent-%COMP%] {\n  font-size: 18px;\n  line-height: 1.6;\n  color: #e2e8f0;\n  margin-bottom: 24px;\n  max-width: 650px;\n}\n.hero-section[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .hero-status-pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  background: rgba(255, 255, 255, 0.1);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n  padding: 10px 18px;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  font-size: 13px;\n  color: #f1f5f9;\n}\n.hero-section[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .hero-status-pill[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #ffc000;\n}\n.hero-section[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .hero-status-pill[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  opacity: 0.5;\n}\n@keyframes _ngcontent-%COMP%_bounce {\n  0%, 20%, 50%, 80%, 100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-8px);\n  }\n  60% {\n    transform: translateY(-4px);\n  }\n}\n.cards-section[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: -24px auto 48px;\n  padding: 0 32px;\n  width: 100%;\n  position: relative;\n  z-index: 10;\n}\n.cards-section[_ngcontent-%COMP%]   .cards-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 24px;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 16px;\n  padding: 28px;\n  box-shadow: 0 8px 24px rgba(0, 51, 102, 0.08);\n  border: 1px solid #e2e8f0;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 14px 30px rgba(0, 51, 102, 0.12);\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .card-top[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .card-title[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 800;\n  color: #003366;\n  text-transform: uppercase;\n  line-height: 1.35;\n  margin-bottom: 12px;\n  letter-spacing: 0.3px;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .card-text[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  line-height: 1.6;\n  color: #475569;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .card-text[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #0f172a;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .card-text[_ngcontent-%COMP%]   .contact-link[_ngcontent-%COMP%] {\n  color: #003366;\n  font-weight: 600;\n  text-decoration: none;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .card-text[_ngcontent-%COMP%]   .contact-link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .card-badge[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #64748b;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .refresh-countdown[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  font-size: 12px;\n  color: #64748b;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .refresh-countdown[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #003366;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .card-action[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .btn-action[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  background: #003366;\n  color: #ffffff;\n  font-weight: 600;\n  font-size: 13px;\n  padding: 10px 20px;\n  border-radius: 8px;\n  border: 1px solid #003366;\n  cursor: pointer;\n  text-decoration: none;\n  transition: all 0.2s;\n  width: 100%;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .btn-action[_ngcontent-%COMP%]:hover {\n  background: #ffc000;\n  color: #003366;\n  border-color: #ffc000;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .btn-action.btn-outline[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #003366;\n  border: 1.5px solid #003366;\n}\n.cards-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .btn-action.btn-outline[_ngcontent-%COMP%]:hover {\n  background: #003366;\n  color: #ffffff;\n}\nfooter[_ngcontent-%COMP%] {\n  margin-top: auto;\n  background: #0b1f3a;\n  color: #94a3b8;\n  text-align: center;\n  padding: 24px 32px;\n  font-size: 12px;\n  border-top: 1px solid rgba(255, 255, 255, 0.08);\n}\nfooter[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 4px 0;\n}\nfooter[_ngcontent-%COMP%]   .footer-brand[_ngcontent-%COMP%] {\n  color: #ffffff;\n  font-weight: 600;\n}\n@media (max-width: 992px) {\n  .hero-section[_ngcontent-%COMP%]   .hero-container[_ngcontent-%COMP%] {\n    flex-direction: column;\n    text-align: center;\n    gap: 32px;\n  }\n  .hero-section[_ngcontent-%COMP%]   .hero-media[_ngcontent-%COMP%] {\n    flex: 0 0 auto;\n  }\n  .hero-section[_ngcontent-%COMP%]   .hero-media[_ngcontent-%COMP%]   .hero-avatar-wrapper[_ngcontent-%COMP%] {\n    width: 240px;\n    height: 240px;\n  }\n  .hero-section[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .hero-subtitle[_ngcontent-%COMP%] {\n    margin: 0 auto 24px;\n  }\n  .cards-section[_ngcontent-%COMP%] {\n    margin-top: 24px;\n  }\n  .cards-section[_ngcontent-%COMP%]   .cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n@media (max-width: 600px) {\n  .top-bar[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 6px;\n    text-align: center;\n  }\n  .header-logo-bar[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 12px;\n    text-align: center;\n  }\n  .header-logo-bar[_ngcontent-%COMP%]   .logo-container[_ngcontent-%COMP%]   .logo-tagline[_ngcontent-%COMP%] {\n    border-left: none;\n    padding-left: 0;\n  }\n  .hero-section[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .hero-title[_ngcontent-%COMP%] {\n    font-size: 28px;\n  }\n  .hero-section[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .hero-subtitle[_ngcontent-%COMP%] {\n    font-size: 15px;\n  }\n}\n/*# sourceMappingURL=maintenance.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MaintenanceComponent, [{
    type: Component,
    args: [{ selector: "app-maintenance", standalone: true, imports: [CommonModule], template: `<div class="maintenance-wrapper">
  <!-- BARRE SUPERIEURE OFFICIELLE -->
  <div class="top-bar">
    <div class="top-bar-links">
      <span>Banque Postale du Burkina Faso</span>
      <span class="sep">\u2022</span>
      <span>Direction du Capital Humain (DCH)</span>
      <span class="sep">\u2022</span>
      <span>Partenaire IT : <strong>TELIA INFORMATIQUE</strong></span>
    </div>
    <div class="top-bar-location">
      <a href="https://teliainfo.com" target="_blank" rel="noopener noreferrer" class="top-bar-link" style="color: #ffc000; text-decoration: none; font-weight: 600; margin-right: 8px;">
        \u{1F310} Visiter teliainfo.com \u2197
      </a>
      <span class="sep">|</span>
      <span class="flag">\u{1F1E7}\u{1F1EB}</span>
      <span>Ouagadougou, Burkina Faso</span>
    </div>
  </div>

  <!-- BARRE LOGO -->
  <header class="header-logo-bar">
    <div class="logo-container">
      <img src="bpbf-logo.png" alt="Logo BPBF" class="bpbf-logo" />
      <div class="logo-tagline">
        <span class="bank-title">BANQUE POSTALE DU BURKINA FASO</span>
        <span class="bank-sub">Pour chacun et pour tous \u2022 Syst\xE8me d'Information des Ressources Humaines</span>
      </div>
    </div>
    <div class="header-badge">
      <div class="pulse-dot"></div>
      <span>Intervention technique programm\xE9e</span>
    </div>
  </header>

  <!-- HERO SECTION PRINCIPALE (STYLE VISTA BANK) -->
  <section class="hero-section">
    <div class="hero-container">
      <!-- PORTRAIT PROFESSIONNEL -->
      <div class="hero-media">
        <div class="hero-avatar-wrapper">
          <img src="bpbf-maintenance-agent.jpg" alt="Support TELIA INFORMATIQUE" class="hero-avatar" />
          <div class="hero-badge-tag">
            <span>\u2699\uFE0F</span>
            <span>TELIA INFORMATIQUE \u2022 IT</span>
          </div>
        </div>
      </div>

      <!-- TEXTE PRINCIPAL -->
      <div class="hero-content">
        <div class="hero-arrow">\u25BC</div>
        <h1 class="hero-title">
          PLATEFORME SIRH <br />
          <span>EN MAINTENANCE</span>
        </h1>
        <p class="hero-subtitle">
          Nous effectuons actuellement une intervention d'optimisation technique et de mise \xE0 niveau de votre Syst\xE8me d'Information des Ressources Humaines. L'acc\xE8s aux modules sera r\xE9tabli dans les plus brefs d\xE9lais.
        </p>
        <div class="hero-status-pill">
          <span>\u{1F512} <strong>Statut :</strong> Maintenance active en cours</span>
          <span class="dot">\u2022</span>
          <span>\u{1F6E1}\uFE0F Donn\xE9es prot\xE9g\xE9es et sauvegard\xE9es</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 2 CARTES D'INFORMATION (STYLE VISTA BANK) -->
  <section class="cards-section">
    <div class="cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));">
      <!-- CARTE 1 : EXPLICATION (TELIA INFORMATIQUE) -->
      <div class="info-card">
        <div class="card-top">
          <h2 class="card-title">VOTRE PLATEFORME SIRH SE MET \xC0 JOUR !</h2>
          <p class="card-text">
            L'\xE9quipe IT <strong>TELIA INFORMATIQUE</strong> proc\xE8de \xE0 la mise \xE0 jour des modules Carri\xE8res, Paie et Gestion Administrative afin d'am\xE9liorer la rapidit\xE9 des calculs et la s\xE9curit\xE9 de vos donn\xE9es.
          </p>
        </div>
        <div class="card-action">
          <span class="card-badge">\u2699\uFE0F Intervention planifi\xE9e de routine</span>
        </div>
      </div>

      <!-- CARTE 2 : CONTACT & ASSISTANCE TELIA INFORMATIQUE -->
      <div class="info-card">
        <div class="card-top">
          <h2 class="card-title">SUPPORT TECHNIQUE TELIA INFORMATIQUE</h2>
          <p class="card-text">
            Pour toute assistance ou question relative \xE0 la plateforme durant l'intervention :<br /><br />
            \u{1F4DE} <strong>T\xE9l :</strong> <a href="tel:+22625377335" class="contact-link" style="color: #003366; font-weight: 700; text-decoration: none;">+ (226) 25-37-73-35</a><br />
            \u2709\uFE0F <strong>Email :</strong> <a href="mailto:contact@teliainfo.com" class="contact-link" style="color: #003366; font-weight: 700; text-decoration: none;">contact@teliainfo.com</a><br />
            \u{1F310} <strong>Site Web :</strong> <a href="https://teliainfo.com" target="_blank" rel="noopener noreferrer" class="contact-link" style="color: #003366; font-weight: 700; text-decoration: none;">www.teliainfo.com</a>
          </p>
        </div>
        <div class="card-action">
          <a href="mailto:contact@teliainfo.com" class="btn-action btn-outline">Contacter le support TELIA INFORMATIQUE</a>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <p class="footer-brand">BANQUE POSTALE DU BURKINA FASO (BPBF)</p>
    <p>Syst\xE8me d'Information des Ressources Humaines (SIRH)</p>
    <p>\xA9 2026 BPBF \u2022 Maintenance et Infog\xE9rance assur\xE9es par TELIA INFORMATIQUE</p>
  </footer>
</div>
`, styles: ['/* src/app/features/maintenance/maintenance.component.scss */\n:host {\n  display: block;\n  width: 100vw;\n  min-height: 100vh;\n  margin: 0;\n  padding: 0;\n}\n.maintenance-wrapper {\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial,\n    sans-serif;\n  background-color: #f8fafc;\n  color: #1e293b;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n}\n.top-bar {\n  background-color: #0b1f3a;\n  color: #94a3b8;\n  font-size: 12px;\n  padding: 8px 32px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n}\n.top-bar .top-bar-links {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #cbd5e1;\n}\n.top-bar .top-bar-links .sep {\n  opacity: 0.4;\n}\n.top-bar .top-bar-location {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #f8fafc;\n  font-weight: 500;\n}\n.header-logo-bar {\n  background: #ffffff;\n  padding: 16px 32px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border-bottom: 2px solid #e2e8f0;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);\n}\n.header-logo-bar .logo-container {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.header-logo-bar .logo-container .bpbf-logo {\n  height: 48px;\n  width: auto;\n  object-fit: contain;\n}\n.header-logo-bar .logo-container .logo-tagline {\n  border-left: 2px solid #cbd5e1;\n  padding-left: 16px;\n  display: flex;\n  flex-direction: column;\n}\n.header-logo-bar .logo-container .logo-tagline .bank-title {\n  font-size: 15px;\n  font-weight: 800;\n  color: #003366;\n  letter-spacing: 0.5px;\n}\n.header-logo-bar .logo-container .logo-tagline .bank-sub {\n  font-size: 11px;\n  color: #64748b;\n  font-style: italic;\n}\n.header-logo-bar .header-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  background: #fef3c7;\n  color: #92400e;\n  padding: 6px 14px;\n  border-radius: 9999px;\n  font-size: 12px;\n  font-weight: 600;\n  border: 1px solid #fde68a;\n}\n.header-logo-bar .header-badge .pulse-dot {\n  width: 8px;\n  height: 8px;\n  background: #d97706;\n  border-radius: 50%;\n  animation: pulse 1.6s infinite;\n}\n@keyframes pulse {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n  50% {\n    transform: scale(1.4);\n    opacity: 0.5;\n  }\n}\n.hero-section {\n  background:\n    linear-gradient(\n      135deg,\n      #07192f 0%,\n      #003366 55%,\n      #0c2b4d 100%);\n  color: #ffffff;\n  padding: 48px 32px 56px;\n  position: relative;\n  overflow: hidden;\n}\n.hero-section::before {\n  content: "";\n  position: absolute;\n  top: -50px;\n  right: -50px;\n  width: 400px;\n  height: 400px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 192, 0, 0.12) 0%,\n      transparent 70%);\n  border-radius: 50%;\n  pointer-events: none;\n}\n.hero-section .hero-container {\n  max-width: 1200px;\n  margin: 0 auto;\n  display: flex;\n  align-items: center;\n  gap: 56px;\n}\n.hero-section .hero-media {\n  flex: 0 0 340px;\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.hero-section .hero-media .hero-avatar-wrapper {\n  position: relative;\n  width: 320px;\n  height: 320px;\n  border-radius: 50%;\n  padding: 8px;\n  background:\n    linear-gradient(\n      135deg,\n      #ffc000 0%,\n      rgba(255, 255, 255, 0.4) 50%,\n      #003366 100%);\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);\n}\n.hero-section .hero-media .hero-avatar-wrapper .hero-avatar {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  object-fit: cover;\n  object-position: top center;\n  background: #1e3a5f;\n  display: block;\n}\n.hero-section .hero-media .hero-avatar-wrapper .hero-badge-tag {\n  position: absolute;\n  bottom: 8px;\n  right: 18px;\n  background: #003366;\n  border: 2px solid #ffc000;\n  color: #ffffff;\n  padding: 6px 14px;\n  border-radius: 20px;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.5px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.hero-section .hero-content {\n  flex: 1;\n}\n.hero-section .hero-content .hero-arrow {\n  color: #ffc000;\n  font-size: 26px;\n  line-height: 1;\n  margin-bottom: 12px;\n  display: inline-block;\n  animation: bounce 2s infinite;\n}\n.hero-section .hero-content .hero-title {\n  font-size: 42px;\n  font-weight: 900;\n  letter-spacing: 1.5px;\n  text-transform: uppercase;\n  line-height: 1.15;\n  margin-bottom: 16px;\n  color: #ffffff;\n  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);\n}\n.hero-section .hero-content .hero-title span {\n  color: #ffc000;\n}\n.hero-section .hero-content .hero-subtitle {\n  font-size: 18px;\n  line-height: 1.6;\n  color: #e2e8f0;\n  margin-bottom: 24px;\n  max-width: 650px;\n}\n.hero-section .hero-content .hero-status-pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  background: rgba(255, 255, 255, 0.1);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n  padding: 10px 18px;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  font-size: 13px;\n  color: #f1f5f9;\n}\n.hero-section .hero-content .hero-status-pill strong {\n  color: #ffc000;\n}\n.hero-section .hero-content .hero-status-pill .dot {\n  opacity: 0.5;\n}\n@keyframes bounce {\n  0%, 20%, 50%, 80%, 100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-8px);\n  }\n  60% {\n    transform: translateY(-4px);\n  }\n}\n.cards-section {\n  max-width: 1200px;\n  margin: -24px auto 48px;\n  padding: 0 32px;\n  width: 100%;\n  position: relative;\n  z-index: 10;\n}\n.cards-section .cards-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 24px;\n}\n.cards-section .info-card {\n  background: #ffffff;\n  border-radius: 16px;\n  padding: 28px;\n  box-shadow: 0 8px 24px rgba(0, 51, 102, 0.08);\n  border: 1px solid #e2e8f0;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.cards-section .info-card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 14px 30px rgba(0, 51, 102, 0.12);\n}\n.cards-section .info-card .card-top {\n  margin-bottom: 20px;\n}\n.cards-section .info-card .card-title {\n  font-size: 16px;\n  font-weight: 800;\n  color: #003366;\n  text-transform: uppercase;\n  line-height: 1.35;\n  margin-bottom: 12px;\n  letter-spacing: 0.3px;\n}\n.cards-section .info-card .card-text {\n  font-size: 13.5px;\n  line-height: 1.6;\n  color: #475569;\n}\n.cards-section .info-card .card-text strong {\n  color: #0f172a;\n}\n.cards-section .info-card .card-text .contact-link {\n  color: #003366;\n  font-weight: 600;\n  text-decoration: none;\n}\n.cards-section .info-card .card-text .contact-link:hover {\n  text-decoration: underline;\n}\n.cards-section .info-card .card-badge {\n  font-size: 12px;\n  color: #64748b;\n}\n.cards-section .info-card .refresh-countdown {\n  margin-top: 14px;\n  font-size: 12px;\n  color: #64748b;\n}\n.cards-section .info-card .refresh-countdown strong {\n  color: #003366;\n}\n.cards-section .info-card .card-action {\n  margin-top: 16px;\n}\n.cards-section .info-card .btn-action {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  background: #003366;\n  color: #ffffff;\n  font-weight: 600;\n  font-size: 13px;\n  padding: 10px 20px;\n  border-radius: 8px;\n  border: 1px solid #003366;\n  cursor: pointer;\n  text-decoration: none;\n  transition: all 0.2s;\n  width: 100%;\n}\n.cards-section .info-card .btn-action:hover {\n  background: #ffc000;\n  color: #003366;\n  border-color: #ffc000;\n}\n.cards-section .info-card .btn-action.btn-outline {\n  background: transparent;\n  color: #003366;\n  border: 1.5px solid #003366;\n}\n.cards-section .info-card .btn-action.btn-outline:hover {\n  background: #003366;\n  color: #ffffff;\n}\nfooter {\n  margin-top: auto;\n  background: #0b1f3a;\n  color: #94a3b8;\n  text-align: center;\n  padding: 24px 32px;\n  font-size: 12px;\n  border-top: 1px solid rgba(255, 255, 255, 0.08);\n}\nfooter p {\n  margin: 4px 0;\n}\nfooter .footer-brand {\n  color: #ffffff;\n  font-weight: 600;\n}\n@media (max-width: 992px) {\n  .hero-section .hero-container {\n    flex-direction: column;\n    text-align: center;\n    gap: 32px;\n  }\n  .hero-section .hero-media {\n    flex: 0 0 auto;\n  }\n  .hero-section .hero-media .hero-avatar-wrapper {\n    width: 240px;\n    height: 240px;\n  }\n  .hero-section .hero-content .hero-subtitle {\n    margin: 0 auto 24px;\n  }\n  .cards-section {\n    margin-top: 24px;\n  }\n  .cards-section .cards-grid {\n    grid-template-columns: 1fr;\n  }\n}\n@media (max-width: 600px) {\n  .top-bar {\n    flex-direction: column;\n    gap: 6px;\n    text-align: center;\n  }\n  .header-logo-bar {\n    flex-direction: column;\n    gap: 12px;\n    text-align: center;\n  }\n  .header-logo-bar .logo-container .logo-tagline {\n    border-left: none;\n    padding-left: 0;\n  }\n  .hero-section .hero-content .hero-title {\n    font-size: 28px;\n  }\n  .hero-section .hero-content .hero-subtitle {\n    font-size: 15px;\n  }\n}\n/*# sourceMappingURL=maintenance.component.css.map */\n'] }]
  }], () => [{ type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MaintenanceComponent, { className: "MaintenanceComponent", filePath: "src/app/features/maintenance/maintenance.component.ts", lineNumber: 12 });
})();
export {
  MaintenanceComponent
};
//# sourceMappingURL=chunk-E3TPVYJS.js.map
