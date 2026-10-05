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

// src/app/core/services/dashboard-stats.service.ts
var DashboardStatsService = class _DashboardStatsService {
  http;
  baseUrl = `${environment.apiUrl}/stats`;
  constructor(http) {
    this.http = http;
  }
  getGrhStats() {
    return this.http.get(`${this.baseUrl}/grh`);
  }
  getDonneesBaseStats() {
    return this.http.get(`${this.baseUrl}/donnees-base`);
  }
  getProfilsStats() {
    return this.http.get(`${this.baseUrl}/profils`);
  }
  getPaieStats() {
    return this.http.get(`${this.baseUrl}/paie`);
  }
  getGlobalStats() {
    return this.http.get(`${this.baseUrl}/global`);
  }
  static \u0275fac = function DashboardStatsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardStatsService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DashboardStatsService, factory: _DashboardStatsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardStatsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  DashboardStatsService
};
//# sourceMappingURL=chunk-KAOKD54J.js.map
