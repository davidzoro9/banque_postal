import {
  fr_default
} from "./chunk-HCBFNYDI.js";
import {
  MatBadge,
  MatBadgeModule,
  MatDivider,
  MatDividerModule,
  MatListModule,
  MatMenu,
  MatMenuItem,
  MatMenuModule,
  MatMenuTrigger,
  MatSnackBar
} from "./chunk-O5X545S3.js";
import {
  AuthService
} from "./chunk-ONRSPQJH.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-4WFLA3F7.js";
import {
  CdkScrollable,
  CdkScrollableModule,
  ScrollDispatcher,
  ViewportRuler
} from "./chunk-GVHJNHWR.js";
import {
  environment
} from "./chunk-FA5ALSQZ.js";
import {
  ModuleNavService
} from "./chunk-RXXLECU7.js";
import "./chunk-X5O3HNQ4.js";
import "./chunk-IY67KAVO.js";
import "./chunk-DODELRSD.js";
import {
  Directionality,
  ESCAPE,
  FocusMonitor,
  FocusTrapFactory,
  InteractivityChecker,
  MatButton,
  MatButtonModule,
  MatCommonModule,
  MatIcon,
  MatIconButton,
  MatIconModule,
  MatRippleModule,
  Platform,
  _animationsDisabled,
  coerceBooleanProperty,
  coerceNumberProperty,
  hasModifierKey
} from "./chunk-HVOECBWJ.js";
import {
  ANIMATION_MODULE_TYPE,
  AsyncPipe,
  BehaviorSubject,
  BrowserModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  ContentChild,
  ContentChildren,
  DOCUMENT,
  Directive,
  DomRendererFactory2,
  ElementRef,
  EventEmitter,
  HttpClient,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  LOCALE_ID,
  NavigationEnd,
  NgModule,
  NgZone,
  Output,
  QueryList,
  Renderer2,
  RendererFactory2,
  Router,
  RouterModule,
  RouterOutlet,
  RuntimeError,
  Subject,
  ViewChild,
  ViewEncapsulation,
  __objRest,
  __spreadProps,
  __spreadValues,
  afterNextRender,
  debounceTime,
  filter,
  fromEvent,
  inject,
  map,
  mapTo,
  merge,
  platformBrowser,
  provideBrowserGlobalErrorListeners,
  provideHttpClient,
  registerLocaleData,
  setClassMetadata,
  signal,
  startWith,
  take,
  takeUntil,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-YWFD3R2X.js";

// node_modules/@angular/animations/fesm2022/private_export.mjs
var AnimationMetadataType;
(function(AnimationMetadataType2) {
  AnimationMetadataType2[AnimationMetadataType2["State"] = 0] = "State";
  AnimationMetadataType2[AnimationMetadataType2["Transition"] = 1] = "Transition";
  AnimationMetadataType2[AnimationMetadataType2["Sequence"] = 2] = "Sequence";
  AnimationMetadataType2[AnimationMetadataType2["Group"] = 3] = "Group";
  AnimationMetadataType2[AnimationMetadataType2["Animate"] = 4] = "Animate";
  AnimationMetadataType2[AnimationMetadataType2["Keyframes"] = 5] = "Keyframes";
  AnimationMetadataType2[AnimationMetadataType2["Style"] = 6] = "Style";
  AnimationMetadataType2[AnimationMetadataType2["Trigger"] = 7] = "Trigger";
  AnimationMetadataType2[AnimationMetadataType2["Reference"] = 8] = "Reference";
  AnimationMetadataType2[AnimationMetadataType2["AnimateChild"] = 9] = "AnimateChild";
  AnimationMetadataType2[AnimationMetadataType2["AnimateRef"] = 10] = "AnimateRef";
  AnimationMetadataType2[AnimationMetadataType2["Query"] = 11] = "Query";
  AnimationMetadataType2[AnimationMetadataType2["Stagger"] = 12] = "Stagger";
})(AnimationMetadataType || (AnimationMetadataType = {}));
var AUTO_STYLE = "*";
function sequence(steps, options = null) {
  return { type: AnimationMetadataType.Sequence, steps, options };
}
function style(tokens) {
  return { type: AnimationMetadataType.Style, styles: tokens, offset: null };
}
var NoopAnimationPlayer = class {
  _onDoneFns = [];
  _onStartFns = [];
  _onDestroyFns = [];
  _originalOnDoneFns = [];
  _originalOnStartFns = [];
  _started = false;
  _destroyed = false;
  _finished = false;
  _position = 0;
  parentPlayer = null;
  totalTime;
  constructor(duration = 0, delay = 0) {
    this.totalTime = duration + delay;
  }
  _onFinish() {
    if (!this._finished) {
      this._finished = true;
      this._onDoneFns.forEach((fn) => fn());
      this._onDoneFns = [];
    }
  }
  onStart(fn) {
    this._originalOnStartFns.push(fn);
    this._onStartFns.push(fn);
  }
  onDone(fn) {
    this._originalOnDoneFns.push(fn);
    this._onDoneFns.push(fn);
  }
  onDestroy(fn) {
    this._onDestroyFns.push(fn);
  }
  hasStarted() {
    return this._started;
  }
  init() {
  }
  play() {
    if (!this.hasStarted()) {
      this._onStart();
      this.triggerMicrotask();
    }
    this._started = true;
  }
  /** @internal */
  triggerMicrotask() {
    queueMicrotask(() => this._onFinish());
  }
  _onStart() {
    this._onStartFns.forEach((fn) => fn());
    this._onStartFns = [];
  }
  pause() {
  }
  restart() {
  }
  finish() {
    this._onFinish();
  }
  destroy() {
    if (!this._destroyed) {
      this._destroyed = true;
      if (!this.hasStarted()) {
        this._onStart();
      }
      this.finish();
      this._onDestroyFns.forEach((fn) => fn());
      this._onDestroyFns = [];
    }
  }
  reset() {
    this._started = false;
    this._finished = false;
    this._onStartFns = this._originalOnStartFns;
    this._onDoneFns = this._originalOnDoneFns;
  }
  setPosition(position) {
    this._position = this.totalTime ? position * this.totalTime : 1;
  }
  getPosition() {
    return this.totalTime ? this._position / this.totalTime : 1;
  }
  /** @internal */
  triggerCallback(phaseName) {
    const methods = phaseName == "start" ? this._onStartFns : this._onDoneFns;
    methods.forEach((fn) => fn());
    methods.length = 0;
  }
};
var AnimationGroupPlayer = class {
  _onDoneFns = [];
  _onStartFns = [];
  _finished = false;
  _started = false;
  _destroyed = false;
  _onDestroyFns = [];
  parentPlayer = null;
  totalTime = 0;
  players;
  constructor(_players) {
    this.players = _players;
    let doneCount = 0;
    let destroyCount = 0;
    let startCount = 0;
    const total = this.players.length;
    if (total == 0) {
      queueMicrotask(() => this._onFinish());
    } else {
      this.players.forEach((player) => {
        player.onDone(() => {
          if (++doneCount == total) {
            this._onFinish();
          }
        });
        player.onDestroy(() => {
          if (++destroyCount == total) {
            this._onDestroy();
          }
        });
        player.onStart(() => {
          if (++startCount == total) {
            this._onStart();
          }
        });
      });
    }
    this.totalTime = this.players.reduce((time, player) => Math.max(time, player.totalTime), 0);
  }
  _onFinish() {
    if (!this._finished) {
      this._finished = true;
      this._onDoneFns.forEach((fn) => fn());
      this._onDoneFns = [];
    }
  }
  init() {
    this.players.forEach((player) => player.init());
  }
  onStart(fn) {
    this._onStartFns.push(fn);
  }
  _onStart() {
    if (!this.hasStarted()) {
      this._started = true;
      this._onStartFns.forEach((fn) => fn());
      this._onStartFns = [];
    }
  }
  onDone(fn) {
    this._onDoneFns.push(fn);
  }
  onDestroy(fn) {
    this._onDestroyFns.push(fn);
  }
  hasStarted() {
    return this._started;
  }
  play() {
    if (!this.parentPlayer) {
      this.init();
    }
    this._onStart();
    this.players.forEach((player) => player.play());
  }
  pause() {
    this.players.forEach((player) => player.pause());
  }
  restart() {
    this.players.forEach((player) => player.restart());
  }
  finish() {
    this._onFinish();
    this.players.forEach((player) => player.finish());
  }
  destroy() {
    this._onDestroy();
  }
  _onDestroy() {
    if (!this._destroyed) {
      this._destroyed = true;
      this._onFinish();
      this.players.forEach((player) => player.destroy());
      this._onDestroyFns.forEach((fn) => fn());
      this._onDestroyFns = [];
    }
  }
  reset() {
    this.players.forEach((player) => player.reset());
    this._destroyed = false;
    this._finished = false;
    this._started = false;
  }
  setPosition(p) {
    const timeAtPosition = p * this.totalTime;
    this.players.forEach((player) => {
      const position = player.totalTime ? Math.min(1, timeAtPosition / player.totalTime) : 1;
      player.setPosition(position);
    });
  }
  getPosition() {
    const longestPlayer = this.players.reduce((longestSoFar, player) => {
      const newPlayerIsLongest = longestSoFar === null || player.totalTime > longestSoFar.totalTime;
      return newPlayerIsLongest ? player : longestSoFar;
    }, null);
    return longestPlayer != null ? longestPlayer.getPosition() : 0;
  }
  beforeDestroy() {
    this.players.forEach((player) => {
      if (player.beforeDestroy) {
        player.beforeDestroy();
      }
    });
  }
  /** @internal */
  triggerCallback(phaseName) {
    const methods = phaseName == "start" ? this._onStartFns : this._onDoneFns;
    methods.forEach((fn) => fn());
    methods.length = 0;
  }
};
var \u0275PRE_STYLE = "!";

// node_modules/@angular/animations/fesm2022/util.mjs
var LINE_START = "\n - ";
function invalidTimingValue(exp) {
  return new RuntimeError(3e3, ngDevMode && `The provided timing value "${exp}" is invalid.`);
}
function negativeStepValue() {
  return new RuntimeError(3100, ngDevMode && "Duration values below 0 are not allowed for this animation step.");
}
function negativeDelayValue() {
  return new RuntimeError(3101, ngDevMode && "Delay values below 0 are not allowed for this animation step.");
}
function invalidStyleParams(varName) {
  return new RuntimeError(3001, ngDevMode && `Unable to resolve the local animation param ${varName} in the given list of values`);
}
function invalidParamValue(varName) {
  return new RuntimeError(3003, ngDevMode && `Please provide a value for the animation param ${varName}`);
}
function invalidNodeType(nodeType) {
  return new RuntimeError(3004, ngDevMode && `Unable to resolve animation metadata node #${nodeType}`);
}
function invalidCssUnitValue(userProvidedProperty, value) {
  return new RuntimeError(3005, ngDevMode && `Please provide a CSS unit value for ${userProvidedProperty}:${value}`);
}
function invalidTrigger() {
  return new RuntimeError(3006, ngDevMode && "animation triggers cannot be prefixed with an `@` sign (e.g. trigger('@foo', [...]))");
}
function invalidDefinition() {
  return new RuntimeError(3007, ngDevMode && "only state() and transition() definitions can sit inside of a trigger()");
}
function invalidState(metadataName, missingSubs) {
  return new RuntimeError(3008, ngDevMode && `state("${metadataName}", ...) must define default values for all the following style substitutions: ${missingSubs.join(", ")}`);
}
function invalidStyleValue(value) {
  return new RuntimeError(3002, ngDevMode && `The provided style string value ${value} is not allowed.`);
}
function invalidParallelAnimation(prop, firstStart, firstEnd, secondStart, secondEnd) {
  return new RuntimeError(3010, ngDevMode && `The CSS property "${prop}" that exists between the times of "${firstStart}ms" and "${firstEnd}ms" is also being animated in a parallel animation between the times of "${secondStart}ms" and "${secondEnd}ms"`);
}
function invalidKeyframes() {
  return new RuntimeError(3011, ngDevMode && `keyframes() must be placed inside of a call to animate()`);
}
function invalidOffset() {
  return new RuntimeError(3012, ngDevMode && `Please ensure that all keyframe offsets are between 0 and 1`);
}
function keyframeOffsetsOutOfOrder() {
  return new RuntimeError(3200, ngDevMode && `Please ensure that all keyframe offsets are in order`);
}
function keyframesMissingOffsets() {
  return new RuntimeError(3202, ngDevMode && `Not all style() steps within the declared keyframes() contain offsets`);
}
function invalidStagger() {
  return new RuntimeError(3013, ngDevMode && `stagger() can only be used inside of query()`);
}
function invalidQuery(selector) {
  return new RuntimeError(3014, ngDevMode && `\`query("${selector}")\` returned zero elements. (Use \`query("${selector}", { optional: true })\` if you wish to allow this.)`);
}
function invalidExpression(expr) {
  return new RuntimeError(3015, ngDevMode && `The provided transition expression "${expr}" is not supported`);
}
function invalidTransitionAlias(alias) {
  return new RuntimeError(3016, ngDevMode && `The transition alias value "${alias}" is not supported`);
}
function triggerBuildFailed(name, errors) {
  return new RuntimeError(3404, ngDevMode && `The animation trigger "${name}" has failed to build due to the following errors:
 - ${errors.map((err) => err.message).join("\n - ")}`);
}
function animationFailed(errors) {
  return new RuntimeError(3502, ngDevMode && `Unable to animate due to the following errors:${LINE_START}${errors.map((err) => err.message).join(LINE_START)}`);
}
function registerFailed(errors) {
  return new RuntimeError(3503, ngDevMode && `Unable to build the animation due to the following errors: ${errors.map((err) => err.message).join("\n")}`);
}
function missingOrDestroyedAnimation() {
  return new RuntimeError(3300, ngDevMode && "The requested animation doesn't exist or has already been destroyed");
}
function createAnimationFailed(errors) {
  return new RuntimeError(3504, ngDevMode && `Unable to create the animation due to the following errors:${errors.map((err) => err.message).join("\n")}`);
}
function missingPlayer(id) {
  return new RuntimeError(3301, ngDevMode && `Unable to find the timeline player referenced by ${id}`);
}
function missingTrigger(phase, name) {
  return new RuntimeError(3302, ngDevMode && `Unable to listen on the animation trigger event "${phase}" because the animation trigger "${name}" doesn't exist!`);
}
function missingEvent(name) {
  return new RuntimeError(3303, ngDevMode && `Unable to listen on the animation trigger "${name}" because the provided event is undefined!`);
}
function unsupportedTriggerEvent(phase, name) {
  return new RuntimeError(3400, ngDevMode && `The provided animation trigger event "${phase}" for the animation trigger "${name}" is not supported!`);
}
function unregisteredTrigger(name) {
  return new RuntimeError(3401, ngDevMode && `The provided animation trigger "${name}" has not been registered!`);
}
function triggerTransitionsFailed(errors) {
  return new RuntimeError(3402, ngDevMode && `Unable to process animations due to the following failed trigger transitions
 ${errors.map((err) => err.message).join("\n")}`);
}
function transitionFailed(name, errors) {
  return new RuntimeError(3505, ngDevMode && `@${name} has failed due to:
 ${errors.map((err) => err.message).join("\n- ")}`);
}
var ANIMATABLE_PROP_SET = /* @__PURE__ */ new Set([
  "-moz-outline-radius",
  "-moz-outline-radius-bottomleft",
  "-moz-outline-radius-bottomright",
  "-moz-outline-radius-topleft",
  "-moz-outline-radius-topright",
  "-ms-grid-columns",
  "-ms-grid-rows",
  "-webkit-line-clamp",
  "-webkit-text-fill-color",
  "-webkit-text-stroke",
  "-webkit-text-stroke-color",
  "accent-color",
  "all",
  "backdrop-filter",
  "background",
  "background-color",
  "background-position",
  "background-size",
  "block-size",
  "border",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-width",
  "border-color",
  "border-end-end-radius",
  "border-end-start-radius",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-width",
  "border-left",
  "border-left-color",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-width",
  "border-start-end-radius",
  "border-start-start-radius",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-width",
  "border-width",
  "bottom",
  "box-shadow",
  "caret-color",
  "clip",
  "clip-path",
  "color",
  "column-count",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-width",
  "column-width",
  "columns",
  "filter",
  "flex",
  "flex-basis",
  "flex-grow",
  "flex-shrink",
  "font",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-variation-settings",
  "font-weight",
  "gap",
  "grid-column-gap",
  "grid-gap",
  "grid-row-gap",
  "grid-template-columns",
  "grid-template-rows",
  "height",
  "inline-size",
  "input-security",
  "inset",
  "inset-block",
  "inset-block-end",
  "inset-block-start",
  "inset-inline",
  "inset-inline-end",
  "inset-inline-start",
  "left",
  "letter-spacing",
  "line-clamp",
  "line-height",
  "margin",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "mask",
  "mask-border",
  "mask-position",
  "mask-size",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-lines",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "object-position",
  "offset",
  "offset-anchor",
  "offset-distance",
  "offset-path",
  "offset-position",
  "offset-rotate",
  "opacity",
  "order",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-width",
  "padding",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "perspective",
  "perspective-origin",
  "right",
  "rotate",
  "row-gap",
  "scale",
  "scroll-margin",
  "scroll-margin-block",
  "scroll-margin-block-end",
  "scroll-margin-block-start",
  "scroll-margin-bottom",
  "scroll-margin-inline",
  "scroll-margin-inline-end",
  "scroll-margin-inline-start",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-margin-top",
  "scroll-padding",
  "scroll-padding-block",
  "scroll-padding-block-end",
  "scroll-padding-block-start",
  "scroll-padding-bottom",
  "scroll-padding-inline",
  "scroll-padding-inline-end",
  "scroll-padding-inline-start",
  "scroll-padding-left",
  "scroll-padding-right",
  "scroll-padding-top",
  "scroll-snap-coordinate",
  "scroll-snap-destination",
  "scrollbar-color",
  "shape-image-threshold",
  "shape-margin",
  "shape-outside",
  "tab-size",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-thickness",
  "text-emphasis",
  "text-emphasis-color",
  "text-indent",
  "text-shadow",
  "text-underline-offset",
  "top",
  "transform",
  "transform-origin",
  "translate",
  "vertical-align",
  "visibility",
  "width",
  "word-spacing",
  "z-index",
  "zoom"
]);
function optimizeGroupPlayer(players) {
  switch (players.length) {
    case 0:
      return new NoopAnimationPlayer();
    case 1:
      return players[0];
    default:
      return new AnimationGroupPlayer(players);
  }
}
function normalizeKeyframes$1(normalizer, keyframes, preStyles = /* @__PURE__ */ new Map(), postStyles = /* @__PURE__ */ new Map()) {
  const errors = [];
  const normalizedKeyframes = [];
  let previousOffset = -1;
  let previousKeyframe = null;
  keyframes.forEach((kf) => {
    const offset = kf.get("offset");
    const isSameOffset = offset == previousOffset;
    const normalizedKeyframe = isSameOffset && previousKeyframe || /* @__PURE__ */ new Map();
    kf.forEach((val, prop) => {
      let normalizedProp = prop;
      let normalizedValue = val;
      if (prop !== "offset") {
        normalizedProp = normalizer.normalizePropertyName(normalizedProp, errors);
        switch (normalizedValue) {
          case \u0275PRE_STYLE:
            normalizedValue = preStyles.get(prop);
            break;
          case AUTO_STYLE:
            normalizedValue = postStyles.get(prop);
            break;
          default:
            normalizedValue = normalizer.normalizeStyleValue(prop, normalizedProp, normalizedValue, errors);
            break;
        }
      }
      normalizedKeyframe.set(normalizedProp, normalizedValue);
    });
    if (!isSameOffset) {
      normalizedKeyframes.push(normalizedKeyframe);
    }
    previousKeyframe = normalizedKeyframe;
    previousOffset = offset;
  });
  if (errors.length) {
    throw animationFailed(errors);
  }
  return normalizedKeyframes;
}
function listenOnPlayer(player, eventName, event, callback) {
  switch (eventName) {
    case "start":
      player.onStart(() => callback(event && copyAnimationEvent(event, "start", player)));
      break;
    case "done":
      player.onDone(() => callback(event && copyAnimationEvent(event, "done", player)));
      break;
    case "destroy":
      player.onDestroy(() => callback(event && copyAnimationEvent(event, "destroy", player)));
      break;
  }
}
function copyAnimationEvent(e, phaseName, player) {
  const totalTime = player.totalTime;
  const disabled = player.disabled ? true : false;
  const event = makeAnimationEvent(e.element, e.triggerName, e.fromState, e.toState, phaseName || e.phaseName, totalTime == void 0 ? e.totalTime : totalTime, disabled);
  const data = e["_data"];
  if (data != null) {
    event["_data"] = data;
  }
  return event;
}
function makeAnimationEvent(element, triggerName, fromState, toState, phaseName = "", totalTime = 0, disabled) {
  return { element, triggerName, fromState, toState, phaseName, totalTime, disabled: !!disabled };
}
function getOrSetDefaultValue(map2, key, defaultValue) {
  let value = map2.get(key);
  if (!value) {
    map2.set(key, value = defaultValue);
  }
  return value;
}
function parseTimelineCommand(command) {
  const separatorPos = command.indexOf(":");
  const id = command.substring(1, separatorPos);
  const action = command.slice(separatorPos + 1);
  return [id, action];
}
var documentElement = /* @__PURE__ */ (() => typeof document === "undefined" ? null : document.documentElement)();
function getParentElement(element) {
  const parent = element.parentNode || element.host || null;
  if (parent === documentElement) {
    return null;
  }
  return parent;
}
function containsVendorPrefix(prop) {
  return prop.substring(1, 6) == "ebkit";
}
var _CACHED_BODY = null;
var _IS_WEBKIT = false;
function validateStyleProperty(prop) {
  if (!_CACHED_BODY) {
    _CACHED_BODY = getBodyNode() || {};
    _IS_WEBKIT = _CACHED_BODY.style ? "WebkitAppearance" in _CACHED_BODY.style : false;
  }
  let result = true;
  if (_CACHED_BODY.style && !containsVendorPrefix(prop)) {
    result = prop in _CACHED_BODY.style;
    if (!result && _IS_WEBKIT) {
      const camelProp = "Webkit" + prop.charAt(0).toUpperCase() + prop.slice(1);
      result = camelProp in _CACHED_BODY.style;
    }
  }
  return result;
}
function validateWebAnimatableStyleProperty(prop) {
  return ANIMATABLE_PROP_SET.has(prop);
}
function getBodyNode() {
  if (typeof document != "undefined") {
    return document.body;
  }
  return null;
}
function containsElement(elm1, elm2) {
  while (elm2) {
    if (elm2 === elm1) {
      return true;
    }
    elm2 = getParentElement(elm2);
  }
  return false;
}
function invokeQuery(element, selector, multi) {
  if (multi) {
    return Array.from(element.querySelectorAll(selector));
  }
  const elem = element.querySelector(selector);
  return elem ? [elem] : [];
}
var ONE_SECOND = 1e3;
var SUBSTITUTION_EXPR_START = "{{";
var SUBSTITUTION_EXPR_END = "}}";
var ENTER_CLASSNAME = "ng-enter";
var LEAVE_CLASSNAME = "ng-leave";
var NG_TRIGGER_CLASSNAME = "ng-trigger";
var NG_TRIGGER_SELECTOR = ".ng-trigger";
var NG_ANIMATING_CLASSNAME = "ng-animating";
var NG_ANIMATING_SELECTOR = ".ng-animating";
function resolveTimingValue(value) {
  if (typeof value == "number")
    return value;
  const matches = value.match(/^(-?[\.\d]+)(m?s)/);
  if (!matches || matches.length < 2)
    return 0;
  return _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
}
function _convertTimeValueToMS(value, unit) {
  switch (unit) {
    case "s":
      return value * ONE_SECOND;
    default:
      return value;
  }
}
function resolveTiming(timings, errors, allowNegativeValues) {
  return timings.hasOwnProperty("duration") ? timings : parseTimeExpression(timings, errors, allowNegativeValues);
}
var PARSE_TIME_EXPRESSION_REGEX = /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i;
function parseTimeExpression(exp, errors, allowNegativeValues) {
  let duration;
  let delay = 0;
  let easing = "";
  if (typeof exp === "string") {
    const matches = exp.match(PARSE_TIME_EXPRESSION_REGEX);
    if (matches === null) {
      errors.push(invalidTimingValue(exp));
      return { duration: 0, delay: 0, easing: "" };
    }
    duration = _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
    const delayMatch = matches[3];
    if (delayMatch != null) {
      delay = _convertTimeValueToMS(parseFloat(delayMatch), matches[4]);
    }
    const easingVal = matches[5];
    if (easingVal) {
      easing = easingVal;
    }
  } else {
    duration = exp;
  }
  if (!allowNegativeValues) {
    let containsErrors = false;
    let startIndex = errors.length;
    if (duration < 0) {
      errors.push(negativeStepValue());
      containsErrors = true;
    }
    if (delay < 0) {
      errors.push(negativeDelayValue());
      containsErrors = true;
    }
    if (containsErrors) {
      errors.splice(startIndex, 0, invalidTimingValue(exp));
    }
  }
  return { duration, delay, easing };
}
function normalizeKeyframes(keyframes) {
  if (!keyframes.length) {
    return [];
  }
  if (keyframes[0] instanceof Map) {
    return keyframes;
  }
  return keyframes.map((kf) => new Map(Object.entries(kf)));
}
function setStyles(element, styles, formerStyles) {
  styles.forEach((val, prop) => {
    const camelProp = dashCaseToCamelCase(prop);
    if (formerStyles && !formerStyles.has(prop)) {
      formerStyles.set(prop, element.style[camelProp]);
    }
    element.style[camelProp] = val;
  });
}
function eraseStyles(element, styles) {
  styles.forEach((_, prop) => {
    const camelProp = dashCaseToCamelCase(prop);
    element.style[camelProp] = "";
  });
}
function normalizeAnimationEntry(steps) {
  if (Array.isArray(steps)) {
    if (steps.length == 1)
      return steps[0];
    return sequence(steps);
  }
  return steps;
}
function validateStyleParams(value, options, errors) {
  const params = options.params || {};
  const matches = extractStyleParams(value);
  if (matches.length) {
    matches.forEach((varName) => {
      if (!params.hasOwnProperty(varName)) {
        errors.push(invalidStyleParams(varName));
      }
    });
  }
}
var PARAM_REGEX = /* @__PURE__ */ new RegExp(`${SUBSTITUTION_EXPR_START}\\s*(.+?)\\s*${SUBSTITUTION_EXPR_END}`, "g");
function extractStyleParams(value) {
  let params = [];
  if (typeof value === "string") {
    let match;
    while (match = PARAM_REGEX.exec(value)) {
      params.push(match[1]);
    }
    PARAM_REGEX.lastIndex = 0;
  }
  return params;
}
function interpolateParams(value, params, errors) {
  const original = `${value}`;
  const str = original.replace(PARAM_REGEX, (_, varName) => {
    let localVal = params[varName];
    if (localVal == null) {
      errors.push(invalidParamValue(varName));
      localVal = "";
    }
    return localVal.toString();
  });
  return str == original ? value : str;
}
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
function dashCaseToCamelCase(input) {
  return input.replace(DASH_CASE_REGEXP, (...m) => m[1].toUpperCase());
}
function camelCaseToDashCase(input) {
  return input.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function allowPreviousPlayerStylesMerge(duration, delay) {
  return duration === 0 || delay === 0;
}
function balancePreviousStylesIntoKeyframes(element, keyframes, previousStyles) {
  if (previousStyles.size && keyframes.length) {
    let startingKeyframe = keyframes[0];
    let missingStyleProps = [];
    previousStyles.forEach((val, prop) => {
      if (!startingKeyframe.has(prop)) {
        missingStyleProps.push(prop);
      }
      startingKeyframe.set(prop, val);
    });
    if (missingStyleProps.length) {
      for (let i = 1; i < keyframes.length; i++) {
        let kf = keyframes[i];
        missingStyleProps.forEach((prop) => kf.set(prop, computeStyle(element, prop)));
      }
    }
  }
  return keyframes;
}
function visitDslNode(visitor, node, context) {
  switch (node.type) {
    case AnimationMetadataType.Trigger:
      return visitor.visitTrigger(node, context);
    case AnimationMetadataType.State:
      return visitor.visitState(node, context);
    case AnimationMetadataType.Transition:
      return visitor.visitTransition(node, context);
    case AnimationMetadataType.Sequence:
      return visitor.visitSequence(node, context);
    case AnimationMetadataType.Group:
      return visitor.visitGroup(node, context);
    case AnimationMetadataType.Animate:
      return visitor.visitAnimate(node, context);
    case AnimationMetadataType.Keyframes:
      return visitor.visitKeyframes(node, context);
    case AnimationMetadataType.Style:
      return visitor.visitStyle(node, context);
    case AnimationMetadataType.Reference:
      return visitor.visitReference(node, context);
    case AnimationMetadataType.AnimateChild:
      return visitor.visitAnimateChild(node, context);
    case AnimationMetadataType.AnimateRef:
      return visitor.visitAnimateRef(node, context);
    case AnimationMetadataType.Query:
      return visitor.visitQuery(node, context);
    case AnimationMetadataType.Stagger:
      return visitor.visitStagger(node, context);
    default:
      throw invalidNodeType(node.type);
  }
}
function computeStyle(element, prop) {
  return window.getComputedStyle(element)[prop];
}

// node_modules/@angular/animations/fesm2022/browser.mjs
var NoopAnimationDriver = class _NoopAnimationDriver {
  /**
   * @returns Whether `prop` is a valid CSS property
   */
  validateStyleProperty(prop) {
    return validateStyleProperty(prop);
  }
  /**
   *
   * @returns Whether elm1 contains elm2.
   */
  containsElement(elm1, elm2) {
    return containsElement(elm1, elm2);
  }
  /**
   * @returns Rhe parent of the given element or `null` if the element is the `document`
   */
  getParentElement(element) {
    return getParentElement(element);
  }
  /**
   * @returns The result of the query selector on the element. The array will contain up to 1 item
   *     if `multi` is  `false`.
   */
  query(element, selector, multi) {
    return invokeQuery(element, selector, multi);
  }
  /**
   * @returns The `defaultValue` or empty string
   */
  computeStyle(element, prop, defaultValue) {
    return defaultValue || "";
  }
  /**
   * @returns An `NoopAnimationPlayer`
   */
  animate(element, keyframes, duration, delay, easing, previousPlayers = [], scrubberAccessRequested) {
    return new NoopAnimationPlayer(duration, delay);
  }
  static \u0275fac = function NoopAnimationDriver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NoopAnimationDriver)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NoopAnimationDriver,
    factory: _NoopAnimationDriver.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoopAnimationDriver, [{
    type: Injectable
  }], null, null);
})();
var AnimationDriver = class {
  /**
   * @deprecated Use the NoopAnimationDriver class.
   */
  static NOOP = new NoopAnimationDriver();
};
var AnimationStyleNormalizer = class {
};
var DIMENSIONAL_PROP_SET = /* @__PURE__ */ new Set(["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight", "left", "top", "bottom", "right", "fontSize", "outlineWidth", "outlineOffset", "paddingTop", "paddingLeft", "paddingBottom", "paddingRight", "marginTop", "marginLeft", "marginBottom", "marginRight", "borderRadius", "borderWidth", "borderTopWidth", "borderLeftWidth", "borderRightWidth", "borderBottomWidth", "textIndent", "perspective"]);
var WebAnimationsStyleNormalizer = class extends AnimationStyleNormalizer {
  normalizePropertyName(propertyName, errors) {
    return dashCaseToCamelCase(propertyName);
  }
  normalizeStyleValue(userProvidedProperty, normalizedProperty, value, errors) {
    let unit = "";
    const strVal = value.toString().trim();
    if (DIMENSIONAL_PROP_SET.has(normalizedProperty) && value !== 0 && value !== "0") {
      if (typeof value === "number") {
        unit = "px";
      } else {
        const valAndSuffixMatch = value.match(/^[+-]?[\d\.]+([a-z]*)$/);
        if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
          errors.push(invalidCssUnitValue(userProvidedProperty, value));
        }
      }
    }
    return strVal + unit;
  }
};
function createListOfWarnings(warnings) {
  const LINE_START2 = "\n - ";
  return `${LINE_START2}${warnings.filter(Boolean).map((warning) => warning).join(LINE_START2)}`;
}
function warnTriggerBuild(name, warnings) {
  console.warn(`The animation trigger "${name}" has built with the following warnings:${createListOfWarnings(warnings)}`);
}
function warnRegister(warnings) {
  console.warn(`Animation built with the following warnings:${createListOfWarnings(warnings)}`);
}
function pushUnrecognizedPropertiesWarning(warnings, props) {
  if (props.length) {
    warnings.push(`The following provided properties are not recognized: ${props.join(", ")}`);
  }
}
var ANY_STATE = "*";
function parseTransitionExpr(transitionValue, errors) {
  const expressions = [];
  if (typeof transitionValue == "string") {
    transitionValue.split(/\s*,\s*/).forEach((str) => parseInnerTransitionStr(str, expressions, errors));
  } else {
    expressions.push(transitionValue);
  }
  return expressions;
}
function parseInnerTransitionStr(eventStr, expressions, errors) {
  if (eventStr[0] == ":") {
    const result = parseAnimationAlias(eventStr, errors);
    if (typeof result == "function") {
      expressions.push(result);
      return;
    }
    eventStr = result;
  }
  const match = eventStr.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (match == null || match.length < 4) {
    errors.push(invalidExpression(eventStr));
    return expressions;
  }
  const fromState = match[1];
  const separator = match[2];
  const toState = match[3];
  expressions.push(makeLambdaFromStates(fromState, toState));
  const isFullAnyStateExpr = fromState == ANY_STATE && toState == ANY_STATE;
  if (separator[0] == "<" && !isFullAnyStateExpr) {
    expressions.push(makeLambdaFromStates(toState, fromState));
  }
  return;
}
function parseAnimationAlias(alias, errors) {
  switch (alias) {
    case ":enter":
      return "void => *";
    case ":leave":
      return "* => void";
    case ":increment":
      return (fromState, toState) => parseFloat(toState) > parseFloat(fromState);
    case ":decrement":
      return (fromState, toState) => parseFloat(toState) < parseFloat(fromState);
    default:
      errors.push(invalidTransitionAlias(alias));
      return "* => *";
  }
}
var TRUE_BOOLEAN_VALUES = /* @__PURE__ */ new Set(["true", "1"]);
var FALSE_BOOLEAN_VALUES = /* @__PURE__ */ new Set(["false", "0"]);
function makeLambdaFromStates(lhs, rhs) {
  const LHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(lhs) || FALSE_BOOLEAN_VALUES.has(lhs);
  const RHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(rhs) || FALSE_BOOLEAN_VALUES.has(rhs);
  return (fromState, toState) => {
    let lhsMatch = lhs == ANY_STATE || lhs == fromState;
    let rhsMatch = rhs == ANY_STATE || rhs == toState;
    if (!lhsMatch && LHS_MATCH_BOOLEAN && typeof fromState === "boolean") {
      lhsMatch = fromState ? TRUE_BOOLEAN_VALUES.has(lhs) : FALSE_BOOLEAN_VALUES.has(lhs);
    }
    if (!rhsMatch && RHS_MATCH_BOOLEAN && typeof toState === "boolean") {
      rhsMatch = toState ? TRUE_BOOLEAN_VALUES.has(rhs) : FALSE_BOOLEAN_VALUES.has(rhs);
    }
    return lhsMatch && rhsMatch;
  };
}
var SELF_TOKEN = ":self";
var SELF_TOKEN_REGEX = /* @__PURE__ */ new RegExp(`s*${SELF_TOKEN}s*,?`, "g");
function buildAnimationAst(driver, metadata, errors, warnings) {
  return new AnimationAstBuilderVisitor(driver).build(metadata, errors, warnings);
}
var ROOT_SELECTOR = "";
var AnimationAstBuilderVisitor = class {
  _driver;
  constructor(_driver) {
    this._driver = _driver;
  }
  build(metadata, errors, warnings) {
    const context = new AnimationAstBuilderContext(errors);
    this._resetContextStyleTimingState(context);
    const ast = visitDslNode(this, normalizeAnimationEntry(metadata), context);
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (context.unsupportedCSSPropertiesFound.size) {
        pushUnrecognizedPropertiesWarning(warnings, [...context.unsupportedCSSPropertiesFound.keys()]);
      }
    }
    return ast;
  }
  _resetContextStyleTimingState(context) {
    context.currentQuerySelector = ROOT_SELECTOR;
    context.collectedStyles = /* @__PURE__ */ new Map();
    context.collectedStyles.set(ROOT_SELECTOR, /* @__PURE__ */ new Map());
    context.currentTime = 0;
  }
  visitTrigger(metadata, context) {
    let queryCount = context.queryCount = 0;
    let depCount = context.depCount = 0;
    const states = [];
    const transitions = [];
    if (metadata.name.charAt(0) == "@") {
      context.errors.push(invalidTrigger());
    }
    metadata.definitions.forEach((def) => {
      this._resetContextStyleTimingState(context);
      if (def.type == AnimationMetadataType.State) {
        const stateDef = def;
        const name = stateDef.name;
        name.toString().split(/\s*,\s*/).forEach((n) => {
          stateDef.name = n;
          states.push(this.visitState(stateDef, context));
        });
        stateDef.name = name;
      } else if (def.type == AnimationMetadataType.Transition) {
        const transition = this.visitTransition(def, context);
        queryCount += transition.queryCount;
        depCount += transition.depCount;
        transitions.push(transition);
      } else {
        context.errors.push(invalidDefinition());
      }
    });
    return {
      type: AnimationMetadataType.Trigger,
      name: metadata.name,
      states,
      transitions,
      queryCount,
      depCount,
      options: null
    };
  }
  visitState(metadata, context) {
    const styleAst = this.visitStyle(metadata.styles, context);
    const astParams = metadata.options && metadata.options.params || null;
    if (styleAst.containsDynamicStyles) {
      const missingSubs = /* @__PURE__ */ new Set();
      const params = astParams || {};
      styleAst.styles.forEach((style2) => {
        if (style2 instanceof Map) {
          style2.forEach((value) => {
            extractStyleParams(value).forEach((sub) => {
              if (!params.hasOwnProperty(sub)) {
                missingSubs.add(sub);
              }
            });
          });
        }
      });
      if (missingSubs.size) {
        context.errors.push(invalidState(metadata.name, [...missingSubs.values()]));
      }
    }
    return {
      type: AnimationMetadataType.State,
      name: metadata.name,
      style: styleAst,
      options: astParams ? {
        params: astParams
      } : null
    };
  }
  visitTransition(metadata, context) {
    context.queryCount = 0;
    context.depCount = 0;
    const animation = visitDslNode(this, normalizeAnimationEntry(metadata.animation), context);
    const matchers = parseTransitionExpr(metadata.expr, context.errors);
    return {
      type: AnimationMetadataType.Transition,
      matchers,
      animation,
      queryCount: context.queryCount,
      depCount: context.depCount,
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitSequence(metadata, context) {
    return {
      type: AnimationMetadataType.Sequence,
      steps: metadata.steps.map((s) => visitDslNode(this, s, context)),
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitGroup(metadata, context) {
    const currentTime = context.currentTime;
    let furthestTime = 0;
    const steps = metadata.steps.map((step) => {
      context.currentTime = currentTime;
      const innerAst = visitDslNode(this, step, context);
      furthestTime = Math.max(furthestTime, context.currentTime);
      return innerAst;
    });
    context.currentTime = furthestTime;
    return {
      type: AnimationMetadataType.Group,
      steps,
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitAnimate(metadata, context) {
    const timingAst = constructTimingAst(metadata.timings, context.errors);
    context.currentAnimateTimings = timingAst;
    let styleAst;
    let styleMetadata = metadata.styles ? metadata.styles : style({});
    if (styleMetadata.type == AnimationMetadataType.Keyframes) {
      styleAst = this.visitKeyframes(styleMetadata, context);
    } else {
      let styleMetadata2 = metadata.styles;
      let isEmpty = false;
      if (!styleMetadata2) {
        isEmpty = true;
        const newStyleData = {};
        if (timingAst.easing) {
          newStyleData["easing"] = timingAst.easing;
        }
        styleMetadata2 = style(newStyleData);
      }
      context.currentTime += timingAst.duration + timingAst.delay;
      const _styleAst = this.visitStyle(styleMetadata2, context);
      _styleAst.isEmptyStep = isEmpty;
      styleAst = _styleAst;
    }
    context.currentAnimateTimings = null;
    return {
      type: AnimationMetadataType.Animate,
      timings: timingAst,
      style: styleAst,
      options: null
    };
  }
  visitStyle(metadata, context) {
    const ast = this._makeStyleAst(metadata, context);
    this._validateStyleAst(ast, context);
    return ast;
  }
  _makeStyleAst(metadata, context) {
    const styles = [];
    const metadataStyles = Array.isArray(metadata.styles) ? metadata.styles : [metadata.styles];
    for (let styleTuple of metadataStyles) {
      if (typeof styleTuple === "string") {
        if (styleTuple === AUTO_STYLE) {
          styles.push(styleTuple);
        } else {
          context.errors.push(invalidStyleValue(styleTuple));
        }
      } else {
        styles.push(new Map(Object.entries(styleTuple)));
      }
    }
    let containsDynamicStyles = false;
    let collectedEasing = null;
    styles.forEach((styleData) => {
      if (styleData instanceof Map) {
        if (styleData.has("easing")) {
          collectedEasing = styleData.get("easing");
          styleData.delete("easing");
        }
        if (!containsDynamicStyles) {
          for (let value of styleData.values()) {
            if (value.toString().indexOf(SUBSTITUTION_EXPR_START) >= 0) {
              containsDynamicStyles = true;
              break;
            }
          }
        }
      }
    });
    return {
      type: AnimationMetadataType.Style,
      styles,
      easing: collectedEasing,
      offset: metadata.offset,
      containsDynamicStyles,
      options: null
    };
  }
  _validateStyleAst(ast, context) {
    const timings = context.currentAnimateTimings;
    let endTime = context.currentTime;
    let startTime = context.currentTime;
    if (timings && startTime > 0) {
      startTime -= timings.duration + timings.delay;
    }
    ast.styles.forEach((tuple) => {
      if (typeof tuple === "string") return;
      tuple.forEach((value, prop) => {
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          if (!this._driver.validateStyleProperty(prop)) {
            tuple.delete(prop);
            context.unsupportedCSSPropertiesFound.add(prop);
            return;
          }
        }
        const collectedStyles = context.collectedStyles.get(context.currentQuerySelector);
        const collectedEntry = collectedStyles.get(prop);
        let updateCollectedStyle = true;
        if (collectedEntry) {
          if (startTime != endTime && startTime >= collectedEntry.startTime && endTime <= collectedEntry.endTime) {
            context.errors.push(invalidParallelAnimation(prop, collectedEntry.startTime, collectedEntry.endTime, startTime, endTime));
            updateCollectedStyle = false;
          }
          startTime = collectedEntry.startTime;
        }
        if (updateCollectedStyle) {
          collectedStyles.set(prop, {
            startTime,
            endTime
          });
        }
        if (context.options) {
          validateStyleParams(value, context.options, context.errors);
        }
      });
    });
  }
  visitKeyframes(metadata, context) {
    const ast = {
      type: AnimationMetadataType.Keyframes,
      styles: [],
      options: null
    };
    if (!context.currentAnimateTimings) {
      context.errors.push(invalidKeyframes());
      return ast;
    }
    const MAX_KEYFRAME_OFFSET = 1;
    let totalKeyframesWithOffsets = 0;
    const offsets = [];
    let offsetsOutOfOrder = false;
    let keyframesOutOfRange = false;
    let previousOffset = 0;
    const keyframes = metadata.steps.map((styles) => {
      const style2 = this._makeStyleAst(styles, context);
      let offsetVal = style2.offset != null ? style2.offset : consumeOffset(style2.styles);
      let offset = 0;
      if (offsetVal != null) {
        totalKeyframesWithOffsets++;
        offset = style2.offset = offsetVal;
      }
      keyframesOutOfRange = keyframesOutOfRange || offset < 0 || offset > 1;
      offsetsOutOfOrder = offsetsOutOfOrder || offset < previousOffset;
      previousOffset = offset;
      offsets.push(offset);
      return style2;
    });
    if (keyframesOutOfRange) {
      context.errors.push(invalidOffset());
    }
    if (offsetsOutOfOrder) {
      context.errors.push(keyframeOffsetsOutOfOrder());
    }
    const length = metadata.steps.length;
    let generatedOffset = 0;
    if (totalKeyframesWithOffsets > 0 && totalKeyframesWithOffsets < length) {
      context.errors.push(keyframesMissingOffsets());
    } else if (totalKeyframesWithOffsets == 0) {
      generatedOffset = MAX_KEYFRAME_OFFSET / (length - 1);
    }
    const limit = length - 1;
    const currentTime = context.currentTime;
    const currentAnimateTimings = context.currentAnimateTimings;
    const animateDuration = currentAnimateTimings.duration;
    keyframes.forEach((kf, i) => {
      const offset = generatedOffset > 0 ? i == limit ? 1 : generatedOffset * i : offsets[i];
      const durationUpToThisFrame = offset * animateDuration;
      context.currentTime = currentTime + currentAnimateTimings.delay + durationUpToThisFrame;
      currentAnimateTimings.duration = durationUpToThisFrame;
      this._validateStyleAst(kf, context);
      kf.offset = offset;
      ast.styles.push(kf);
    });
    return ast;
  }
  visitReference(metadata, context) {
    return {
      type: AnimationMetadataType.Reference,
      animation: visitDslNode(this, normalizeAnimationEntry(metadata.animation), context),
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitAnimateChild(metadata, context) {
    context.depCount++;
    return {
      type: AnimationMetadataType.AnimateChild,
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitAnimateRef(metadata, context) {
    return {
      type: AnimationMetadataType.AnimateRef,
      animation: this.visitReference(metadata.animation, context),
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitQuery(metadata, context) {
    const parentSelector = context.currentQuerySelector;
    const options = metadata.options || {};
    context.queryCount++;
    context.currentQuery = metadata;
    const [selector, includeSelf] = normalizeSelector(metadata.selector);
    context.currentQuerySelector = parentSelector.length ? parentSelector + " " + selector : selector;
    getOrSetDefaultValue(context.collectedStyles, context.currentQuerySelector, /* @__PURE__ */ new Map());
    const animation = visitDslNode(this, normalizeAnimationEntry(metadata.animation), context);
    context.currentQuery = null;
    context.currentQuerySelector = parentSelector;
    return {
      type: AnimationMetadataType.Query,
      selector,
      limit: options.limit || 0,
      optional: !!options.optional,
      includeSelf,
      animation,
      originalSelector: metadata.selector,
      options: normalizeAnimationOptions(metadata.options)
    };
  }
  visitStagger(metadata, context) {
    if (!context.currentQuery) {
      context.errors.push(invalidStagger());
    }
    const timings = metadata.timings === "full" ? {
      duration: 0,
      delay: 0,
      easing: "full"
    } : resolveTiming(metadata.timings, context.errors, true);
    return {
      type: AnimationMetadataType.Stagger,
      animation: visitDslNode(this, normalizeAnimationEntry(metadata.animation), context),
      timings,
      options: null
    };
  }
};
function normalizeSelector(selector) {
  const hasAmpersand = selector.split(/\s*,\s*/).find((token) => token == SELF_TOKEN) ? true : false;
  if (hasAmpersand) {
    selector = selector.replace(SELF_TOKEN_REGEX, "");
  }
  selector = selector.replace(/@\*/g, NG_TRIGGER_SELECTOR).replace(/@\w+/g, (match) => NG_TRIGGER_SELECTOR + "-" + match.slice(1)).replace(/:animating/g, NG_ANIMATING_SELECTOR);
  return [selector, hasAmpersand];
}
function normalizeParams(obj) {
  return obj ? __spreadValues({}, obj) : null;
}
var AnimationAstBuilderContext = class {
  errors;
  queryCount = 0;
  depCount = 0;
  currentTransition = null;
  currentQuery = null;
  currentQuerySelector = null;
  currentAnimateTimings = null;
  currentTime = 0;
  collectedStyles = /* @__PURE__ */ new Map();
  options = null;
  unsupportedCSSPropertiesFound = /* @__PURE__ */ new Set();
  constructor(errors) {
    this.errors = errors;
  }
};
function consumeOffset(styles) {
  if (typeof styles == "string") return null;
  let offset = null;
  if (Array.isArray(styles)) {
    styles.forEach((styleTuple) => {
      if (styleTuple instanceof Map && styleTuple.has("offset")) {
        const obj = styleTuple;
        offset = parseFloat(obj.get("offset"));
        obj.delete("offset");
      }
    });
  } else if (styles instanceof Map && styles.has("offset")) {
    const obj = styles;
    offset = parseFloat(obj.get("offset"));
    obj.delete("offset");
  }
  return offset;
}
function constructTimingAst(value, errors) {
  if (value.hasOwnProperty("duration")) {
    return value;
  }
  if (typeof value == "number") {
    const duration = resolveTiming(value, errors).duration;
    return makeTimingAst(duration, 0, "");
  }
  const strValue = value;
  const isDynamic = strValue.split(/\s+/).some((v) => v.charAt(0) == "{" && v.charAt(1) == "{");
  if (isDynamic) {
    const ast = makeTimingAst(0, 0, "");
    ast.dynamic = true;
    ast.strValue = strValue;
    return ast;
  }
  const timings = resolveTiming(strValue, errors);
  return makeTimingAst(timings.duration, timings.delay, timings.easing);
}
function normalizeAnimationOptions(options) {
  if (options) {
    options = __spreadValues({}, options);
    if (options["params"]) {
      options["params"] = normalizeParams(options["params"]);
    }
  } else {
    options = {};
  }
  return options;
}
function makeTimingAst(duration, delay, easing) {
  return {
    duration,
    delay,
    easing
  };
}
function createTimelineInstruction(element, keyframes, preStyleProps, postStyleProps, duration, delay, easing = null, subTimeline = false) {
  return {
    type: 1,
    element,
    keyframes,
    preStyleProps,
    postStyleProps,
    duration,
    delay,
    totalTime: duration + delay,
    easing,
    subTimeline
  };
}
var ElementInstructionMap = class {
  _map = /* @__PURE__ */ new Map();
  get(element) {
    return this._map.get(element) || [];
  }
  append(element, instructions) {
    let existingInstructions = this._map.get(element);
    if (!existingInstructions) {
      this._map.set(element, existingInstructions = []);
    }
    existingInstructions.push(...instructions);
  }
  has(element) {
    return this._map.has(element);
  }
  clear() {
    this._map.clear();
  }
};
var ONE_FRAME_IN_MILLISECONDS = 1;
var ENTER_TOKEN = ":enter";
var ENTER_TOKEN_REGEX = /* @__PURE__ */ new RegExp(ENTER_TOKEN, "g");
var LEAVE_TOKEN = ":leave";
var LEAVE_TOKEN_REGEX = /* @__PURE__ */ new RegExp(LEAVE_TOKEN, "g");
function buildAnimationTimelines(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles = /* @__PURE__ */ new Map(), finalStyles = /* @__PURE__ */ new Map(), options, subInstructions, errors = []) {
  return new AnimationTimelineBuilderVisitor().buildKeyframes(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors);
}
var AnimationTimelineBuilderVisitor = class {
  buildKeyframes(driver, rootElement, ast, enterClassName, leaveClassName, startingStyles, finalStyles, options, subInstructions, errors = []) {
    subInstructions = subInstructions || new ElementInstructionMap();
    const context = new AnimationTimelineContext(driver, rootElement, subInstructions, enterClassName, leaveClassName, errors, []);
    context.options = options;
    const delay = options.delay ? resolveTimingValue(options.delay) : 0;
    context.currentTimeline.delayNextStep(delay);
    context.currentTimeline.setStyles([startingStyles], null, context.errors, options);
    visitDslNode(this, ast, context);
    const timelines = context.timelines.filter((timeline) => timeline.containsAnimation());
    if (timelines.length && finalStyles.size) {
      let lastRootTimeline;
      for (let i = timelines.length - 1; i >= 0; i--) {
        const timeline = timelines[i];
        if (timeline.element === rootElement) {
          lastRootTimeline = timeline;
          break;
        }
      }
      if (lastRootTimeline && !lastRootTimeline.allowOnlyTimelineStyles()) {
        lastRootTimeline.setStyles([finalStyles], null, context.errors, options);
      }
    }
    return timelines.length ? timelines.map((timeline) => timeline.buildKeyframes()) : [createTimelineInstruction(rootElement, [], [], [], 0, delay, "", false)];
  }
  visitTrigger(ast, context) {
  }
  visitState(ast, context) {
  }
  visitTransition(ast, context) {
  }
  visitAnimateChild(ast, context) {
    const elementInstructions = context.subInstructions.get(context.element);
    if (elementInstructions) {
      const innerContext = context.createSubContext(ast.options);
      const startTime = context.currentTimeline.currentTime;
      const endTime = this._visitSubInstructions(elementInstructions, innerContext, innerContext.options);
      if (startTime != endTime) {
        context.transformIntoNewTimeline(endTime);
      }
    }
    context.previousNode = ast;
  }
  visitAnimateRef(ast, context) {
    const innerContext = context.createSubContext(ast.options);
    innerContext.transformIntoNewTimeline();
    this._applyAnimationRefDelays([ast.options, ast.animation.options], context, innerContext);
    this.visitReference(ast.animation, innerContext);
    context.transformIntoNewTimeline(innerContext.currentTimeline.currentTime);
    context.previousNode = ast;
  }
  _applyAnimationRefDelays(animationsRefsOptions, context, innerContext) {
    for (const animationRefOptions of animationsRefsOptions) {
      const animationDelay = animationRefOptions?.delay;
      if (animationDelay) {
        const animationDelayValue = typeof animationDelay === "number" ? animationDelay : resolveTimingValue(interpolateParams(animationDelay, animationRefOptions?.params ?? {}, context.errors));
        innerContext.delayNextStep(animationDelayValue);
      }
    }
  }
  _visitSubInstructions(instructions, context, options) {
    const startTime = context.currentTimeline.currentTime;
    let furthestTime = startTime;
    const duration = options.duration != null ? resolveTimingValue(options.duration) : null;
    const delay = options.delay != null ? resolveTimingValue(options.delay) : null;
    if (duration !== 0) {
      instructions.forEach((instruction) => {
        const instructionTimings = context.appendInstructionToTimeline(instruction, duration, delay);
        furthestTime = Math.max(furthestTime, instructionTimings.duration + instructionTimings.delay);
      });
    }
    return furthestTime;
  }
  visitReference(ast, context) {
    context.updateOptions(ast.options, true);
    visitDslNode(this, ast.animation, context);
    context.previousNode = ast;
  }
  visitSequence(ast, context) {
    const subContextCount = context.subContextCount;
    let ctx = context;
    const options = ast.options;
    if (options && (options.params || options.delay)) {
      ctx = context.createSubContext(options);
      ctx.transformIntoNewTimeline();
      if (options.delay != null) {
        if (ctx.previousNode.type == AnimationMetadataType.Style) {
          ctx.currentTimeline.snapshotCurrentStyles();
          ctx.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
        }
        const delay = resolveTimingValue(options.delay);
        ctx.delayNextStep(delay);
      }
    }
    if (ast.steps.length) {
      ast.steps.forEach((s) => visitDslNode(this, s, ctx));
      ctx.currentTimeline.applyStylesToKeyframe();
      if (ctx.subContextCount > subContextCount) {
        ctx.transformIntoNewTimeline();
      }
    }
    context.previousNode = ast;
  }
  visitGroup(ast, context) {
    const innerTimelines = [];
    let furthestTime = context.currentTimeline.currentTime;
    const delay = ast.options && ast.options.delay ? resolveTimingValue(ast.options.delay) : 0;
    ast.steps.forEach((s) => {
      const innerContext = context.createSubContext(ast.options);
      if (delay) {
        innerContext.delayNextStep(delay);
      }
      visitDslNode(this, s, innerContext);
      furthestTime = Math.max(furthestTime, innerContext.currentTimeline.currentTime);
      innerTimelines.push(innerContext.currentTimeline);
    });
    innerTimelines.forEach((timeline) => context.currentTimeline.mergeTimelineCollectedStyles(timeline));
    context.transformIntoNewTimeline(furthestTime);
    context.previousNode = ast;
  }
  _visitTiming(ast, context) {
    if (ast.dynamic) {
      const strValue = ast.strValue;
      const timingValue = context.params ? interpolateParams(strValue, context.params, context.errors) : strValue;
      return resolveTiming(timingValue, context.errors);
    } else {
      return {
        duration: ast.duration,
        delay: ast.delay,
        easing: ast.easing
      };
    }
  }
  visitAnimate(ast, context) {
    const timings = context.currentAnimateTimings = this._visitTiming(ast.timings, context);
    const timeline = context.currentTimeline;
    if (timings.delay) {
      context.incrementTime(timings.delay);
      timeline.snapshotCurrentStyles();
    }
    const style2 = ast.style;
    if (style2.type == AnimationMetadataType.Keyframes) {
      this.visitKeyframes(style2, context);
    } else {
      context.incrementTime(timings.duration);
      this.visitStyle(style2, context);
      timeline.applyStylesToKeyframe();
    }
    context.currentAnimateTimings = null;
    context.previousNode = ast;
  }
  visitStyle(ast, context) {
    const timeline = context.currentTimeline;
    const timings = context.currentAnimateTimings;
    if (!timings && timeline.hasCurrentStyleProperties()) {
      timeline.forwardFrame();
    }
    const easing = timings && timings.easing || ast.easing;
    if (ast.isEmptyStep) {
      timeline.applyEmptyStep(easing);
    } else {
      timeline.setStyles(ast.styles, easing, context.errors, context.options);
    }
    context.previousNode = ast;
  }
  visitKeyframes(ast, context) {
    const currentAnimateTimings = context.currentAnimateTimings;
    const startTime = context.currentTimeline.duration;
    const duration = currentAnimateTimings.duration;
    const innerContext = context.createSubContext();
    const innerTimeline = innerContext.currentTimeline;
    innerTimeline.easing = currentAnimateTimings.easing;
    ast.styles.forEach((step) => {
      const offset = step.offset || 0;
      innerTimeline.forwardTime(offset * duration);
      innerTimeline.setStyles(step.styles, step.easing, context.errors, context.options);
      innerTimeline.applyStylesToKeyframe();
    });
    context.currentTimeline.mergeTimelineCollectedStyles(innerTimeline);
    context.transformIntoNewTimeline(startTime + duration);
    context.previousNode = ast;
  }
  visitQuery(ast, context) {
    const startTime = context.currentTimeline.currentTime;
    const options = ast.options || {};
    const delay = options.delay ? resolveTimingValue(options.delay) : 0;
    if (delay && (context.previousNode.type === AnimationMetadataType.Style || startTime == 0 && context.currentTimeline.hasCurrentStyleProperties())) {
      context.currentTimeline.snapshotCurrentStyles();
      context.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
    }
    let furthestTime = startTime;
    const elms = context.invokeQuery(ast.selector, ast.originalSelector, ast.limit, ast.includeSelf, options.optional ? true : false, context.errors);
    context.currentQueryTotal = elms.length;
    let sameElementTimeline = null;
    elms.forEach((element, i) => {
      context.currentQueryIndex = i;
      const innerContext = context.createSubContext(ast.options, element);
      if (delay) {
        innerContext.delayNextStep(delay);
      }
      if (element === context.element) {
        sameElementTimeline = innerContext.currentTimeline;
      }
      visitDslNode(this, ast.animation, innerContext);
      innerContext.currentTimeline.applyStylesToKeyframe();
      const endTime = innerContext.currentTimeline.currentTime;
      furthestTime = Math.max(furthestTime, endTime);
    });
    context.currentQueryIndex = 0;
    context.currentQueryTotal = 0;
    context.transformIntoNewTimeline(furthestTime);
    if (sameElementTimeline) {
      context.currentTimeline.mergeTimelineCollectedStyles(sameElementTimeline);
      context.currentTimeline.snapshotCurrentStyles();
    }
    context.previousNode = ast;
  }
  visitStagger(ast, context) {
    const parentContext = context.parentContext;
    const tl = context.currentTimeline;
    const timings = ast.timings;
    const duration = Math.abs(timings.duration);
    const maxTime = duration * (context.currentQueryTotal - 1);
    let delay = duration * context.currentQueryIndex;
    let staggerTransformer = timings.duration < 0 ? "reverse" : timings.easing;
    switch (staggerTransformer) {
      case "reverse":
        delay = maxTime - delay;
        break;
      case "full":
        delay = parentContext.currentStaggerTime;
        break;
    }
    const timeline = context.currentTimeline;
    if (delay) {
      timeline.delayNextStep(delay);
    }
    const startingTime = timeline.currentTime;
    visitDslNode(this, ast.animation, context);
    context.previousNode = ast;
    parentContext.currentStaggerTime = tl.currentTime - startingTime + (tl.startTime - parentContext.currentTimeline.startTime);
  }
};
var DEFAULT_NOOP_PREVIOUS_NODE = {};
var AnimationTimelineContext = class _AnimationTimelineContext {
  _driver;
  element;
  subInstructions;
  _enterClassName;
  _leaveClassName;
  errors;
  timelines;
  parentContext = null;
  currentTimeline;
  currentAnimateTimings = null;
  previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
  subContextCount = 0;
  options = {};
  currentQueryIndex = 0;
  currentQueryTotal = 0;
  currentStaggerTime = 0;
  constructor(_driver, element, subInstructions, _enterClassName, _leaveClassName, errors, timelines, initialTimeline) {
    this._driver = _driver;
    this.element = element;
    this.subInstructions = subInstructions;
    this._enterClassName = _enterClassName;
    this._leaveClassName = _leaveClassName;
    this.errors = errors;
    this.timelines = timelines;
    this.currentTimeline = initialTimeline || new TimelineBuilder(this._driver, element, 0);
    timelines.push(this.currentTimeline);
  }
  get params() {
    return this.options.params;
  }
  updateOptions(options, skipIfExists) {
    if (!options) return;
    const newOptions = options;
    let optionsToUpdate = this.options;
    if (newOptions.duration != null) {
      optionsToUpdate.duration = resolveTimingValue(newOptions.duration);
    }
    if (newOptions.delay != null) {
      optionsToUpdate.delay = resolveTimingValue(newOptions.delay);
    }
    const newParams = newOptions.params;
    if (newParams) {
      let paramsToUpdate = optionsToUpdate.params;
      if (!paramsToUpdate) {
        paramsToUpdate = this.options.params = {};
      }
      Object.keys(newParams).forEach((name) => {
        if (!skipIfExists || !paramsToUpdate.hasOwnProperty(name)) {
          paramsToUpdate[name] = interpolateParams(newParams[name], paramsToUpdate, this.errors);
        }
      });
    }
  }
  _copyOptions() {
    const options = {};
    if (this.options) {
      const oldParams = this.options.params;
      if (oldParams) {
        const params = options["params"] = {};
        Object.keys(oldParams).forEach((name) => {
          params[name] = oldParams[name];
        });
      }
    }
    return options;
  }
  createSubContext(options = null, element, newTime) {
    const target = element || this.element;
    const context = new _AnimationTimelineContext(this._driver, target, this.subInstructions, this._enterClassName, this._leaveClassName, this.errors, this.timelines, this.currentTimeline.fork(target, newTime || 0));
    context.previousNode = this.previousNode;
    context.currentAnimateTimings = this.currentAnimateTimings;
    context.options = this._copyOptions();
    context.updateOptions(options);
    context.currentQueryIndex = this.currentQueryIndex;
    context.currentQueryTotal = this.currentQueryTotal;
    context.parentContext = this;
    this.subContextCount++;
    return context;
  }
  transformIntoNewTimeline(newTime) {
    this.previousNode = DEFAULT_NOOP_PREVIOUS_NODE;
    this.currentTimeline = this.currentTimeline.fork(this.element, newTime);
    this.timelines.push(this.currentTimeline);
    return this.currentTimeline;
  }
  appendInstructionToTimeline(instruction, duration, delay) {
    const updatedTimings = {
      duration: duration != null ? duration : instruction.duration,
      delay: this.currentTimeline.currentTime + (delay != null ? delay : 0) + instruction.delay,
      easing: ""
    };
    const builder = new SubTimelineBuilder(this._driver, instruction.element, instruction.keyframes, instruction.preStyleProps, instruction.postStyleProps, updatedTimings, instruction.stretchStartingKeyframe);
    this.timelines.push(builder);
    return updatedTimings;
  }
  incrementTime(time) {
    this.currentTimeline.forwardTime(this.currentTimeline.duration + time);
  }
  delayNextStep(delay) {
    if (delay > 0) {
      this.currentTimeline.delayNextStep(delay);
    }
  }
  invokeQuery(selector, originalSelector, limit, includeSelf, optional, errors) {
    let results = [];
    if (includeSelf) {
      results.push(this.element);
    }
    if (selector.length > 0) {
      selector = selector.replace(ENTER_TOKEN_REGEX, "." + this._enterClassName);
      selector = selector.replace(LEAVE_TOKEN_REGEX, "." + this._leaveClassName);
      const multi = limit != 1;
      let elements = this._driver.query(this.element, selector, multi);
      if (limit !== 0) {
        elements = limit < 0 ? elements.slice(elements.length + limit, elements.length) : elements.slice(0, limit);
      }
      results.push(...elements);
    }
    if (!optional && results.length == 0) {
      errors.push(invalidQuery(originalSelector));
    }
    return results;
  }
};
var TimelineBuilder = class _TimelineBuilder {
  _driver;
  element;
  startTime;
  _elementTimelineStylesLookup;
  duration = 0;
  easing = null;
  _previousKeyframe = /* @__PURE__ */ new Map();
  _currentKeyframe = /* @__PURE__ */ new Map();
  _keyframes = /* @__PURE__ */ new Map();
  _styleSummary = /* @__PURE__ */ new Map();
  _localTimelineStyles = /* @__PURE__ */ new Map();
  _globalTimelineStyles;
  _pendingStyles = /* @__PURE__ */ new Map();
  _backFill = /* @__PURE__ */ new Map();
  _currentEmptyStepKeyframe = null;
  constructor(_driver, element, startTime, _elementTimelineStylesLookup) {
    this._driver = _driver;
    this.element = element;
    this.startTime = startTime;
    this._elementTimelineStylesLookup = _elementTimelineStylesLookup;
    if (!this._elementTimelineStylesLookup) {
      this._elementTimelineStylesLookup = /* @__PURE__ */ new Map();
    }
    this._globalTimelineStyles = this._elementTimelineStylesLookup.get(element);
    if (!this._globalTimelineStyles) {
      this._globalTimelineStyles = this._localTimelineStyles;
      this._elementTimelineStylesLookup.set(element, this._localTimelineStyles);
    }
    this._loadKeyframe();
  }
  containsAnimation() {
    switch (this._keyframes.size) {
      case 0:
        return false;
      case 1:
        return this.hasCurrentStyleProperties();
      default:
        return true;
    }
  }
  hasCurrentStyleProperties() {
    return this._currentKeyframe.size > 0;
  }
  get currentTime() {
    return this.startTime + this.duration;
  }
  delayNextStep(delay) {
    const hasPreStyleStep = this._keyframes.size === 1 && this._pendingStyles.size;
    if (this.duration || hasPreStyleStep) {
      this.forwardTime(this.currentTime + delay);
      if (hasPreStyleStep) {
        this.snapshotCurrentStyles();
      }
    } else {
      this.startTime += delay;
    }
  }
  fork(element, currentTime) {
    this.applyStylesToKeyframe();
    return new _TimelineBuilder(this._driver, element, currentTime || this.currentTime, this._elementTimelineStylesLookup);
  }
  _loadKeyframe() {
    if (this._currentKeyframe) {
      this._previousKeyframe = this._currentKeyframe;
    }
    this._currentKeyframe = this._keyframes.get(this.duration);
    if (!this._currentKeyframe) {
      this._currentKeyframe = /* @__PURE__ */ new Map();
      this._keyframes.set(this.duration, this._currentKeyframe);
    }
  }
  forwardFrame() {
    this.duration += ONE_FRAME_IN_MILLISECONDS;
    this._loadKeyframe();
  }
  forwardTime(time) {
    this.applyStylesToKeyframe();
    this.duration = time;
    this._loadKeyframe();
  }
  _updateStyle(prop, value) {
    this._localTimelineStyles.set(prop, value);
    this._globalTimelineStyles.set(prop, value);
    this._styleSummary.set(prop, {
      time: this.currentTime,
      value
    });
  }
  allowOnlyTimelineStyles() {
    return this._currentEmptyStepKeyframe !== this._currentKeyframe;
  }
  applyEmptyStep(easing) {
    if (easing) {
      this._previousKeyframe.set("easing", easing);
    }
    for (let [prop, value] of this._globalTimelineStyles) {
      this._backFill.set(prop, value || AUTO_STYLE);
      this._currentKeyframe.set(prop, AUTO_STYLE);
    }
    this._currentEmptyStepKeyframe = this._currentKeyframe;
  }
  setStyles(input, easing, errors, options) {
    if (easing) {
      this._previousKeyframe.set("easing", easing);
    }
    const params = options && options.params || {};
    const styles = flattenStyles(input, this._globalTimelineStyles);
    for (let [prop, value] of styles) {
      const val = interpolateParams(value, params, errors);
      this._pendingStyles.set(prop, val);
      if (!this._localTimelineStyles.has(prop)) {
        this._backFill.set(prop, this._globalTimelineStyles.get(prop) ?? AUTO_STYLE);
      }
      this._updateStyle(prop, val);
    }
  }
  applyStylesToKeyframe() {
    if (this._pendingStyles.size == 0) return;
    this._pendingStyles.forEach((val, prop) => {
      this._currentKeyframe.set(prop, val);
    });
    this._pendingStyles.clear();
    this._localTimelineStyles.forEach((val, prop) => {
      if (!this._currentKeyframe.has(prop)) {
        this._currentKeyframe.set(prop, val);
      }
    });
  }
  snapshotCurrentStyles() {
    for (let [prop, val] of this._localTimelineStyles) {
      this._pendingStyles.set(prop, val);
      this._updateStyle(prop, val);
    }
  }
  getFinalKeyframe() {
    return this._keyframes.get(this.duration);
  }
  get properties() {
    const properties = [];
    for (let prop in this._currentKeyframe) {
      properties.push(prop);
    }
    return properties;
  }
  mergeTimelineCollectedStyles(timeline) {
    timeline._styleSummary.forEach((details1, prop) => {
      const details0 = this._styleSummary.get(prop);
      if (!details0 || details1.time > details0.time) {
        this._updateStyle(prop, details1.value);
      }
    });
  }
  buildKeyframes() {
    this.applyStylesToKeyframe();
    const preStyleProps = /* @__PURE__ */ new Set();
    const postStyleProps = /* @__PURE__ */ new Set();
    const isEmpty = this._keyframes.size === 1 && this.duration === 0;
    let finalKeyframes = [];
    this._keyframes.forEach((keyframe, time) => {
      const finalKeyframe = new Map([...this._backFill, ...keyframe]);
      finalKeyframe.forEach((value, prop) => {
        if (value === \u0275PRE_STYLE) {
          preStyleProps.add(prop);
        } else if (value === AUTO_STYLE) {
          postStyleProps.add(prop);
        }
      });
      if (!isEmpty) {
        finalKeyframe.set("offset", time / this.duration);
      }
      finalKeyframes.push(finalKeyframe);
    });
    const preProps = [...preStyleProps.values()];
    const postProps = [...postStyleProps.values()];
    if (isEmpty) {
      const kf0 = finalKeyframes[0];
      const kf1 = new Map(kf0);
      kf0.set("offset", 0);
      kf1.set("offset", 1);
      finalKeyframes = [kf0, kf1];
    }
    return createTimelineInstruction(this.element, finalKeyframes, preProps, postProps, this.duration, this.startTime, this.easing, false);
  }
};
var SubTimelineBuilder = class extends TimelineBuilder {
  keyframes;
  preStyleProps;
  postStyleProps;
  _stretchStartingKeyframe;
  timings;
  constructor(driver, element, keyframes, preStyleProps, postStyleProps, timings, _stretchStartingKeyframe = false) {
    super(driver, element, timings.delay);
    this.keyframes = keyframes;
    this.preStyleProps = preStyleProps;
    this.postStyleProps = postStyleProps;
    this._stretchStartingKeyframe = _stretchStartingKeyframe;
    this.timings = {
      duration: timings.duration,
      delay: timings.delay,
      easing: timings.easing
    };
  }
  containsAnimation() {
    return this.keyframes.length > 1;
  }
  buildKeyframes() {
    let keyframes = this.keyframes;
    let {
      delay,
      duration,
      easing
    } = this.timings;
    if (this._stretchStartingKeyframe && delay) {
      const newKeyframes = [];
      const totalTime = duration + delay;
      const startingGap = delay / totalTime;
      const newFirstKeyframe = new Map(keyframes[0]);
      newFirstKeyframe.set("offset", 0);
      newKeyframes.push(newFirstKeyframe);
      const oldFirstKeyframe = new Map(keyframes[0]);
      oldFirstKeyframe.set("offset", roundOffset(startingGap));
      newKeyframes.push(oldFirstKeyframe);
      const limit = keyframes.length - 1;
      for (let i = 1; i <= limit; i++) {
        let kf = new Map(keyframes[i]);
        const oldOffset = kf.get("offset");
        const timeAtKeyframe = delay + oldOffset * duration;
        kf.set("offset", roundOffset(timeAtKeyframe / totalTime));
        newKeyframes.push(kf);
      }
      duration = totalTime;
      delay = 0;
      easing = "";
      keyframes = newKeyframes;
    }
    return createTimelineInstruction(this.element, keyframes, this.preStyleProps, this.postStyleProps, duration, delay, easing, true);
  }
};
function roundOffset(offset, decimalPoints = 3) {
  const mult = Math.pow(10, decimalPoints - 1);
  return Math.round(offset * mult) / mult;
}
function flattenStyles(input, allStyles) {
  const styles = /* @__PURE__ */ new Map();
  let allProperties;
  input.forEach((token) => {
    if (token === "*") {
      allProperties ??= allStyles.keys();
      for (let prop of allProperties) {
        styles.set(prop, AUTO_STYLE);
      }
    } else {
      for (let [prop, val] of token) {
        styles.set(prop, val);
      }
    }
  });
  return styles;
}
function createTransitionInstruction(element, triggerName, fromState, toState, isRemovalTransition, fromStyles, toStyles, timelines, queriedElements, preStyleProps, postStyleProps, totalTime, errors) {
  return {
    type: 0,
    element,
    triggerName,
    isRemovalTransition,
    fromState,
    fromStyles,
    toState,
    toStyles,
    timelines,
    queriedElements,
    preStyleProps,
    postStyleProps,
    totalTime,
    errors
  };
}
var EMPTY_OBJECT = {};
var AnimationTransitionFactory = class {
  _triggerName;
  ast;
  _stateStyles;
  constructor(_triggerName, ast, _stateStyles) {
    this._triggerName = _triggerName;
    this.ast = ast;
    this._stateStyles = _stateStyles;
  }
  match(currentState, nextState, element, params) {
    return oneOrMoreTransitionsMatch(this.ast.matchers, currentState, nextState, element, params);
  }
  buildStyles(stateName, params, errors) {
    let styler = this._stateStyles.get("*");
    if (stateName !== void 0) {
      styler = this._stateStyles.get(stateName?.toString()) || styler;
    }
    return styler ? styler.buildStyles(params, errors) : /* @__PURE__ */ new Map();
  }
  build(driver, element, currentState, nextState, enterClassName, leaveClassName, currentOptions, nextOptions, subInstructions, skipAstBuild) {
    const errors = [];
    const transitionAnimationParams = this.ast.options && this.ast.options.params || EMPTY_OBJECT;
    const currentAnimationParams = currentOptions && currentOptions.params || EMPTY_OBJECT;
    const currentStateStyles = this.buildStyles(currentState, currentAnimationParams, errors);
    const nextAnimationParams = nextOptions && nextOptions.params || EMPTY_OBJECT;
    const nextStateStyles = this.buildStyles(nextState, nextAnimationParams, errors);
    const queriedElements = /* @__PURE__ */ new Set();
    const preStyleMap = /* @__PURE__ */ new Map();
    const postStyleMap = /* @__PURE__ */ new Map();
    const isRemoval = nextState === "void";
    const animationOptions = {
      params: applyParamDefaults(nextAnimationParams, transitionAnimationParams),
      delay: this.ast.options?.delay
    };
    const timelines = skipAstBuild ? [] : buildAnimationTimelines(driver, element, this.ast.animation, enterClassName, leaveClassName, currentStateStyles, nextStateStyles, animationOptions, subInstructions, errors);
    let totalTime = 0;
    timelines.forEach((tl) => {
      totalTime = Math.max(tl.duration + tl.delay, totalTime);
    });
    if (errors.length) {
      return createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, [], [], preStyleMap, postStyleMap, totalTime, errors);
    }
    timelines.forEach((tl) => {
      const elm = tl.element;
      const preProps = getOrSetDefaultValue(preStyleMap, elm, /* @__PURE__ */ new Set());
      tl.preStyleProps.forEach((prop) => preProps.add(prop));
      const postProps = getOrSetDefaultValue(postStyleMap, elm, /* @__PURE__ */ new Set());
      tl.postStyleProps.forEach((prop) => postProps.add(prop));
      if (elm !== element) {
        queriedElements.add(elm);
      }
    });
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      checkNonAnimatableInTimelines(timelines, this._triggerName, driver);
    }
    return createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, timelines, [...queriedElements.values()], preStyleMap, postStyleMap, totalTime);
  }
};
function checkNonAnimatableInTimelines(timelines, triggerName, driver) {
  if (!driver.validateAnimatableStyleProperty) {
    return;
  }
  const allowedNonAnimatableProps = /* @__PURE__ */ new Set([
    // 'easing' is a utility/synthetic prop we use to represent
    // easing functions, it represents a property of the animation
    // which is not animatable but different values can be used
    // in different steps
    "easing"
  ]);
  const invalidNonAnimatableProps = /* @__PURE__ */ new Set();
  timelines.forEach(({
    keyframes
  }) => {
    const nonAnimatablePropsInitialValues = /* @__PURE__ */ new Map();
    keyframes.forEach((keyframe) => {
      const entriesToCheck = Array.from(keyframe.entries()).filter(([prop]) => !allowedNonAnimatableProps.has(prop));
      for (const [prop, value] of entriesToCheck) {
        if (!driver.validateAnimatableStyleProperty(prop)) {
          if (nonAnimatablePropsInitialValues.has(prop) && !invalidNonAnimatableProps.has(prop)) {
            const propInitialValue = nonAnimatablePropsInitialValues.get(prop);
            if (propInitialValue !== value) {
              invalidNonAnimatableProps.add(prop);
            }
          } else {
            nonAnimatablePropsInitialValues.set(prop, value);
          }
        }
      }
    });
  });
  if (invalidNonAnimatableProps.size > 0) {
    console.warn(`Warning: The animation trigger "${triggerName}" is attempting to animate the following not animatable properties: ` + Array.from(invalidNonAnimatableProps).join(", ") + "\n(to check the list of all animatable properties visit https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)");
  }
}
function oneOrMoreTransitionsMatch(matchFns, currentState, nextState, element, params) {
  return matchFns.some((fn) => fn(currentState, nextState, element, params));
}
function applyParamDefaults(userParams, defaults) {
  const result = __spreadValues({}, defaults);
  Object.entries(userParams).forEach(([key, value]) => {
    if (value != null) {
      result[key] = value;
    }
  });
  return result;
}
var AnimationStateStyles = class {
  styles;
  defaultParams;
  normalizer;
  constructor(styles, defaultParams, normalizer) {
    this.styles = styles;
    this.defaultParams = defaultParams;
    this.normalizer = normalizer;
  }
  buildStyles(params, errors) {
    const finalStyles = /* @__PURE__ */ new Map();
    const combinedParams = applyParamDefaults(params, this.defaultParams);
    this.styles.styles.forEach((value) => {
      if (typeof value !== "string") {
        value.forEach((val, prop) => {
          if (val) {
            val = interpolateParams(val, combinedParams, errors);
          }
          const normalizedProp = this.normalizer.normalizePropertyName(prop, errors);
          val = this.normalizer.normalizeStyleValue(prop, normalizedProp, val, errors);
          finalStyles.set(prop, val);
        });
      }
    });
    return finalStyles;
  }
};
function buildTrigger(name, ast, normalizer) {
  return new AnimationTrigger(name, ast, normalizer);
}
var AnimationTrigger = class {
  name;
  ast;
  _normalizer;
  transitionFactories = [];
  fallbackTransition;
  states = /* @__PURE__ */ new Map();
  constructor(name, ast, _normalizer) {
    this.name = name;
    this.ast = ast;
    this._normalizer = _normalizer;
    ast.states.forEach((ast2) => {
      const defaultParams = ast2.options && ast2.options.params || {};
      this.states.set(ast2.name, new AnimationStateStyles(ast2.style, defaultParams, _normalizer));
    });
    balanceProperties(this.states, "true", "1");
    balanceProperties(this.states, "false", "0");
    ast.transitions.forEach((ast2) => {
      this.transitionFactories.push(new AnimationTransitionFactory(name, ast2, this.states));
    });
    this.fallbackTransition = createFallbackTransition(name, this.states);
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(currentState, nextState, element, params) {
    const entry = this.transitionFactories.find((f) => f.match(currentState, nextState, element, params));
    return entry || null;
  }
  matchStyles(currentState, params, errors) {
    return this.fallbackTransition.buildStyles(currentState, params, errors);
  }
};
function createFallbackTransition(triggerName, states, normalizer) {
  const matchers = [(fromState, toState) => true];
  const animation = {
    type: AnimationMetadataType.Sequence,
    steps: [],
    options: null
  };
  const transition = {
    type: AnimationMetadataType.Transition,
    animation,
    matchers,
    options: null,
    queryCount: 0,
    depCount: 0
  };
  return new AnimationTransitionFactory(triggerName, transition, states);
}
function balanceProperties(stateMap, key1, key2) {
  if (stateMap.has(key1)) {
    if (!stateMap.has(key2)) {
      stateMap.set(key2, stateMap.get(key1));
    }
  } else if (stateMap.has(key2)) {
    stateMap.set(key1, stateMap.get(key2));
  }
}
var EMPTY_INSTRUCTION_MAP = /* @__PURE__ */ new ElementInstructionMap();
var TimelineAnimationEngine = class {
  bodyNode;
  _driver;
  _normalizer;
  _animations = /* @__PURE__ */ new Map();
  _playersById = /* @__PURE__ */ new Map();
  players = [];
  constructor(bodyNode, _driver, _normalizer) {
    this.bodyNode = bodyNode;
    this._driver = _driver;
    this._normalizer = _normalizer;
  }
  register(id, metadata) {
    const errors = [];
    const warnings = [];
    const ast = buildAnimationAst(this._driver, metadata, errors, warnings);
    if (errors.length) {
      throw registerFailed(errors);
    } else {
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        if (warnings.length) {
          warnRegister(warnings);
        }
      }
      this._animations.set(id, ast);
    }
  }
  _buildPlayer(i, preStyles, postStyles) {
    const element = i.element;
    const keyframes = normalizeKeyframes$1(this._normalizer, i.keyframes, preStyles, postStyles);
    return this._driver.animate(element, keyframes, i.duration, i.delay, i.easing, [], true);
  }
  create(id, element, options = {}) {
    const errors = [];
    const ast = this._animations.get(id);
    let instructions;
    const autoStylesMap = /* @__PURE__ */ new Map();
    if (ast) {
      instructions = buildAnimationTimelines(this._driver, element, ast, ENTER_CLASSNAME, LEAVE_CLASSNAME, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), options, EMPTY_INSTRUCTION_MAP, errors);
      instructions.forEach((inst) => {
        const styles = getOrSetDefaultValue(autoStylesMap, inst.element, /* @__PURE__ */ new Map());
        inst.postStyleProps.forEach((prop) => styles.set(prop, null));
      });
    } else {
      errors.push(missingOrDestroyedAnimation());
      instructions = [];
    }
    if (errors.length) {
      throw createAnimationFailed(errors);
    }
    autoStylesMap.forEach((styles, element2) => {
      styles.forEach((_, prop) => {
        styles.set(prop, this._driver.computeStyle(element2, prop, AUTO_STYLE));
      });
    });
    const players = instructions.map((i) => {
      const styles = autoStylesMap.get(i.element);
      return this._buildPlayer(i, /* @__PURE__ */ new Map(), styles);
    });
    const player = optimizeGroupPlayer(players);
    this._playersById.set(id, player);
    player.onDestroy(() => this.destroy(id));
    this.players.push(player);
    return player;
  }
  destroy(id) {
    const player = this._getPlayer(id);
    player.destroy();
    this._playersById.delete(id);
    const index = this.players.indexOf(player);
    if (index >= 0) {
      this.players.splice(index, 1);
    }
  }
  _getPlayer(id) {
    const player = this._playersById.get(id);
    if (!player) {
      throw missingPlayer(id);
    }
    return player;
  }
  listen(id, element, eventName, callback) {
    const baseEvent = makeAnimationEvent(element, "", "", "");
    listenOnPlayer(this._getPlayer(id), eventName, baseEvent, callback);
    return () => {
    };
  }
  command(id, element, command, args) {
    if (command == "register") {
      this.register(id, args[0]);
      return;
    }
    if (command == "create") {
      const options = args[0] || {};
      this.create(id, element, options);
      return;
    }
    const player = this._getPlayer(id);
    switch (command) {
      case "play":
        player.play();
        break;
      case "pause":
        player.pause();
        break;
      case "reset":
        player.reset();
        break;
      case "restart":
        player.restart();
        break;
      case "finish":
        player.finish();
        break;
      case "init":
        player.init();
        break;
      case "setPosition":
        player.setPosition(parseFloat(args[0]));
        break;
      case "destroy":
        this.destroy(id);
        break;
    }
  }
};
var QUEUED_CLASSNAME = "ng-animate-queued";
var QUEUED_SELECTOR = ".ng-animate-queued";
var DISABLED_CLASSNAME = "ng-animate-disabled";
var DISABLED_SELECTOR = ".ng-animate-disabled";
var STAR_CLASSNAME = "ng-star-inserted";
var STAR_SELECTOR = ".ng-star-inserted";
var EMPTY_PLAYER_ARRAY = [];
var NULL_REMOVAL_STATE = {
  namespaceId: "",
  setForRemoval: false,
  setForMove: false,
  hasAnimation: false,
  removedBeforeQueried: false
};
var NULL_REMOVED_QUERIED_STATE = {
  namespaceId: "",
  setForMove: false,
  setForRemoval: false,
  hasAnimation: false,
  removedBeforeQueried: true
};
var REMOVAL_FLAG = "__ng_removed";
var StateValue = class {
  namespaceId;
  value;
  options;
  get params() {
    return this.options.params;
  }
  constructor(input, namespaceId = "") {
    this.namespaceId = namespaceId;
    const isObj = input && input.hasOwnProperty("value");
    const value = isObj ? input["value"] : input;
    this.value = normalizeTriggerValue(value);
    if (isObj) {
      const _a = input, {
        value: value2
      } = _a, options = __objRest(_a, [
        "value"
      ]);
      this.options = options;
    } else {
      this.options = {};
    }
    if (!this.options.params) {
      this.options.params = {};
    }
  }
  absorbOptions(options) {
    const newParams = options.params;
    if (newParams) {
      const oldParams = this.options.params;
      Object.keys(newParams).forEach((prop) => {
        if (oldParams[prop] == null) {
          oldParams[prop] = newParams[prop];
        }
      });
    }
  }
};
var VOID_VALUE = "void";
var DEFAULT_STATE_VALUE = /* @__PURE__ */ new StateValue(VOID_VALUE);
var AnimationTransitionNamespace = class {
  id;
  hostElement;
  _engine;
  players = [];
  _triggers = /* @__PURE__ */ new Map();
  _queue = [];
  _elementListeners = /* @__PURE__ */ new Map();
  _hostClassName;
  constructor(id, hostElement, _engine) {
    this.id = id;
    this.hostElement = hostElement;
    this._engine = _engine;
    this._hostClassName = "ng-tns-" + id;
    addClass(hostElement, this._hostClassName);
  }
  listen(element, name, phase, callback) {
    if (!this._triggers.has(name)) {
      throw missingTrigger(phase, name);
    }
    if (phase == null || phase.length == 0) {
      throw missingEvent(name);
    }
    if (!isTriggerEventValid(phase)) {
      throw unsupportedTriggerEvent(phase, name);
    }
    const listeners = getOrSetDefaultValue(this._elementListeners, element, []);
    const data = {
      name,
      phase,
      callback
    };
    listeners.push(data);
    const triggersWithStates = getOrSetDefaultValue(this._engine.statesByElement, element, /* @__PURE__ */ new Map());
    if (!triggersWithStates.has(name)) {
      addClass(element, NG_TRIGGER_CLASSNAME);
      addClass(element, NG_TRIGGER_CLASSNAME + "-" + name);
      triggersWithStates.set(name, DEFAULT_STATE_VALUE);
    }
    return () => {
      this._engine.afterFlush(() => {
        const index = listeners.indexOf(data);
        if (index >= 0) {
          listeners.splice(index, 1);
        }
        if (!this._triggers.has(name)) {
          triggersWithStates.delete(name);
        }
      });
    };
  }
  register(name, ast) {
    if (this._triggers.has(name)) {
      return false;
    } else {
      this._triggers.set(name, ast);
      return true;
    }
  }
  _getTrigger(name) {
    const trigger = this._triggers.get(name);
    if (!trigger) {
      throw unregisteredTrigger(name);
    }
    return trigger;
  }
  trigger(element, triggerName, value, defaultToFallback = true) {
    const trigger = this._getTrigger(triggerName);
    const player = new TransitionAnimationPlayer(this.id, triggerName, element);
    let triggersWithStates = this._engine.statesByElement.get(element);
    if (!triggersWithStates) {
      addClass(element, NG_TRIGGER_CLASSNAME);
      addClass(element, NG_TRIGGER_CLASSNAME + "-" + triggerName);
      this._engine.statesByElement.set(element, triggersWithStates = /* @__PURE__ */ new Map());
    }
    let fromState = triggersWithStates.get(triggerName);
    const toState = new StateValue(value, this.id);
    const isObj = value && value.hasOwnProperty("value");
    if (!isObj && fromState) {
      toState.absorbOptions(fromState.options);
    }
    triggersWithStates.set(triggerName, toState);
    if (!fromState) {
      fromState = DEFAULT_STATE_VALUE;
    }
    const isRemoval = toState.value === VOID_VALUE;
    if (!isRemoval && fromState.value === toState.value) {
      if (!objEquals(fromState.params, toState.params)) {
        const errors = [];
        const fromStyles = trigger.matchStyles(fromState.value, fromState.params, errors);
        const toStyles = trigger.matchStyles(toState.value, toState.params, errors);
        if (errors.length) {
          this._engine.reportError(errors);
        } else {
          this._engine.afterFlush(() => {
            eraseStyles(element, fromStyles);
            setStyles(element, toStyles);
          });
        }
      }
      return;
    }
    const playersOnElement = getOrSetDefaultValue(this._engine.playersByElement, element, []);
    playersOnElement.forEach((player2) => {
      if (player2.namespaceId == this.id && player2.triggerName == triggerName && player2.queued) {
        player2.destroy();
      }
    });
    let transition = trigger.matchTransition(fromState.value, toState.value, element, toState.params);
    let isFallbackTransition = false;
    if (!transition) {
      if (!defaultToFallback) return;
      transition = trigger.fallbackTransition;
      isFallbackTransition = true;
    }
    this._engine.totalQueuedPlayers++;
    this._queue.push({
      element,
      triggerName,
      transition,
      fromState,
      toState,
      player,
      isFallbackTransition
    });
    if (!isFallbackTransition) {
      addClass(element, QUEUED_CLASSNAME);
      player.onStart(() => {
        removeClass(element, QUEUED_CLASSNAME);
      });
    }
    player.onDone(() => {
      let index = this.players.indexOf(player);
      if (index >= 0) {
        this.players.splice(index, 1);
      }
      const players = this._engine.playersByElement.get(element);
      if (players) {
        let index2 = players.indexOf(player);
        if (index2 >= 0) {
          players.splice(index2, 1);
        }
      }
    });
    this.players.push(player);
    playersOnElement.push(player);
    return player;
  }
  deregister(name) {
    this._triggers.delete(name);
    this._engine.statesByElement.forEach((stateMap) => stateMap.delete(name));
    this._elementListeners.forEach((listeners, element) => {
      this._elementListeners.set(element, listeners.filter((entry) => {
        return entry.name != name;
      }));
    });
  }
  clearElementCache(element) {
    this._engine.statesByElement.delete(element);
    this._elementListeners.delete(element);
    const elementPlayers = this._engine.playersByElement.get(element);
    if (elementPlayers) {
      elementPlayers.forEach((player) => player.destroy());
      this._engine.playersByElement.delete(element);
    }
  }
  _signalRemovalForInnerTriggers(rootElement, context) {
    const elements = this._engine.driver.query(rootElement, NG_TRIGGER_SELECTOR, true);
    elements.forEach((elm) => {
      if (elm[REMOVAL_FLAG]) return;
      const namespaces = this._engine.fetchNamespacesByElement(elm);
      if (namespaces.size) {
        namespaces.forEach((ns) => ns.triggerLeaveAnimation(elm, context, false, true));
      } else {
        this.clearElementCache(elm);
      }
    });
    this._engine.afterFlushAnimationsDone(() => elements.forEach((elm) => this.clearElementCache(elm)));
  }
  triggerLeaveAnimation(element, context, destroyAfterComplete, defaultToFallback) {
    const triggerStates = this._engine.statesByElement.get(element);
    const previousTriggersValues = /* @__PURE__ */ new Map();
    if (triggerStates) {
      const players = [];
      triggerStates.forEach((state, triggerName) => {
        previousTriggersValues.set(triggerName, state.value);
        if (this._triggers.has(triggerName)) {
          const player = this.trigger(element, triggerName, VOID_VALUE, defaultToFallback);
          if (player) {
            players.push(player);
          }
        }
      });
      if (players.length) {
        this._engine.markElementAsRemoved(this.id, element, true, context, previousTriggersValues);
        if (destroyAfterComplete) {
          optimizeGroupPlayer(players).onDone(() => this._engine.processLeaveNode(element));
        }
        return true;
      }
    }
    return false;
  }
  prepareLeaveAnimationListeners(element) {
    const listeners = this._elementListeners.get(element);
    const elementStates = this._engine.statesByElement.get(element);
    if (listeners && elementStates) {
      const visitedTriggers = /* @__PURE__ */ new Set();
      listeners.forEach((listener) => {
        const triggerName = listener.name;
        if (visitedTriggers.has(triggerName)) return;
        visitedTriggers.add(triggerName);
        const trigger = this._triggers.get(triggerName);
        const transition = trigger.fallbackTransition;
        const fromState = elementStates.get(triggerName) || DEFAULT_STATE_VALUE;
        const toState = new StateValue(VOID_VALUE);
        const player = new TransitionAnimationPlayer(this.id, triggerName, element);
        this._engine.totalQueuedPlayers++;
        this._queue.push({
          element,
          triggerName,
          transition,
          fromState,
          toState,
          player,
          isFallbackTransition: true
        });
      });
    }
  }
  removeNode(element, context) {
    const engine = this._engine;
    if (element.childElementCount) {
      this._signalRemovalForInnerTriggers(element, context);
    }
    if (this.triggerLeaveAnimation(element, context, true)) return;
    let containsPotentialParentTransition = false;
    if (engine.totalAnimations) {
      const currentPlayers = engine.players.length ? engine.playersByQueriedElement.get(element) : [];
      if (currentPlayers && currentPlayers.length) {
        containsPotentialParentTransition = true;
      } else {
        let parent = element;
        while (parent = parent.parentNode) {
          const triggers = engine.statesByElement.get(parent);
          if (triggers) {
            containsPotentialParentTransition = true;
            break;
          }
        }
      }
    }
    this.prepareLeaveAnimationListeners(element);
    if (containsPotentialParentTransition) {
      engine.markElementAsRemoved(this.id, element, false, context);
    } else {
      const removalFlag = element[REMOVAL_FLAG];
      if (!removalFlag || removalFlag === NULL_REMOVAL_STATE) {
        engine.afterFlush(() => this.clearElementCache(element));
        engine.destroyInnerAnimations(element);
        engine._onRemovalComplete(element, context);
      }
    }
  }
  insertNode(element, parent) {
    addClass(element, this._hostClassName);
  }
  drainQueuedTransitions(microtaskId) {
    const instructions = [];
    this._queue.forEach((entry) => {
      const player = entry.player;
      if (player.destroyed) return;
      const element = entry.element;
      const listeners = this._elementListeners.get(element);
      if (listeners) {
        listeners.forEach((listener) => {
          if (listener.name == entry.triggerName) {
            const baseEvent = makeAnimationEvent(element, entry.triggerName, entry.fromState.value, entry.toState.value);
            baseEvent["_data"] = microtaskId;
            listenOnPlayer(entry.player, listener.phase, baseEvent, listener.callback);
          }
        });
      }
      if (player.markedForDestroy) {
        this._engine.afterFlush(() => {
          player.destroy();
        });
      } else {
        instructions.push(entry);
      }
    });
    this._queue = [];
    return instructions.sort((a, b) => {
      const d0 = a.transition.ast.depCount;
      const d1 = b.transition.ast.depCount;
      if (d0 == 0 || d1 == 0) {
        return d0 - d1;
      }
      return this._engine.driver.containsElement(a.element, b.element) ? 1 : -1;
    });
  }
  destroy(context) {
    this.players.forEach((p) => p.destroy());
    this._signalRemovalForInnerTriggers(this.hostElement, context);
  }
};
var TransitionAnimationEngine = class {
  bodyNode;
  driver;
  _normalizer;
  players = [];
  newHostElements = /* @__PURE__ */ new Map();
  playersByElement = /* @__PURE__ */ new Map();
  playersByQueriedElement = /* @__PURE__ */ new Map();
  statesByElement = /* @__PURE__ */ new Map();
  disabledNodes = /* @__PURE__ */ new Set();
  totalAnimations = 0;
  totalQueuedPlayers = 0;
  _namespaceLookup = {};
  _namespaceList = [];
  _flushFns = [];
  _whenQuietFns = [];
  namespacesByHostElement = /* @__PURE__ */ new Map();
  collectedEnterElements = [];
  collectedLeaveElements = [];
  // this method is designed to be overridden by the code that uses this engine
  onRemovalComplete = (element, context) => {
  };
  /** @internal */
  _onRemovalComplete(element, context) {
    this.onRemovalComplete(element, context);
  }
  constructor(bodyNode, driver, _normalizer) {
    this.bodyNode = bodyNode;
    this.driver = driver;
    this._normalizer = _normalizer;
  }
  get queuedPlayers() {
    const players = [];
    this._namespaceList.forEach((ns) => {
      ns.players.forEach((player) => {
        if (player.queued) {
          players.push(player);
        }
      });
    });
    return players;
  }
  createNamespace(namespaceId, hostElement) {
    const ns = new AnimationTransitionNamespace(namespaceId, hostElement, this);
    if (this.bodyNode && this.driver.containsElement(this.bodyNode, hostElement)) {
      this._balanceNamespaceList(ns, hostElement);
    } else {
      this.newHostElements.set(hostElement, ns);
      this.collectEnterElement(hostElement);
    }
    return this._namespaceLookup[namespaceId] = ns;
  }
  _balanceNamespaceList(ns, hostElement) {
    const namespaceList = this._namespaceList;
    const namespacesByHostElement = this.namespacesByHostElement;
    const limit = namespaceList.length - 1;
    if (limit >= 0) {
      let found = false;
      let ancestor = this.driver.getParentElement(hostElement);
      while (ancestor) {
        const ancestorNs = namespacesByHostElement.get(ancestor);
        if (ancestorNs) {
          const index = namespaceList.indexOf(ancestorNs);
          namespaceList.splice(index + 1, 0, ns);
          found = true;
          break;
        }
        ancestor = this.driver.getParentElement(ancestor);
      }
      if (!found) {
        namespaceList.unshift(ns);
      }
    } else {
      namespaceList.push(ns);
    }
    namespacesByHostElement.set(hostElement, ns);
    return ns;
  }
  register(namespaceId, hostElement) {
    let ns = this._namespaceLookup[namespaceId];
    if (!ns) {
      ns = this.createNamespace(namespaceId, hostElement);
    }
    return ns;
  }
  registerTrigger(namespaceId, name, trigger) {
    let ns = this._namespaceLookup[namespaceId];
    if (ns && ns.register(name, trigger)) {
      this.totalAnimations++;
    }
  }
  destroy(namespaceId, context) {
    if (!namespaceId) return;
    this.afterFlush(() => {
    });
    this.afterFlushAnimationsDone(() => {
      const ns = this._fetchNamespace(namespaceId);
      this.namespacesByHostElement.delete(ns.hostElement);
      const index = this._namespaceList.indexOf(ns);
      if (index >= 0) {
        this._namespaceList.splice(index, 1);
      }
      ns.destroy(context);
      delete this._namespaceLookup[namespaceId];
    });
  }
  _fetchNamespace(id) {
    return this._namespaceLookup[id];
  }
  fetchNamespacesByElement(element) {
    const namespaces = /* @__PURE__ */ new Set();
    const elementStates = this.statesByElement.get(element);
    if (elementStates) {
      for (let stateValue of elementStates.values()) {
        if (stateValue.namespaceId) {
          const ns = this._fetchNamespace(stateValue.namespaceId);
          if (ns) {
            namespaces.add(ns);
          }
        }
      }
    }
    return namespaces;
  }
  trigger(namespaceId, element, name, value) {
    if (isElementNode(element)) {
      const ns = this._fetchNamespace(namespaceId);
      if (ns) {
        ns.trigger(element, name, value);
        return true;
      }
    }
    return false;
  }
  insertNode(namespaceId, element, parent, insertBefore) {
    if (!isElementNode(element)) return;
    const details = element[REMOVAL_FLAG];
    if (details && details.setForRemoval) {
      details.setForRemoval = false;
      details.setForMove = true;
      const index = this.collectedLeaveElements.indexOf(element);
      if (index >= 0) {
        this.collectedLeaveElements.splice(index, 1);
      }
    }
    if (namespaceId) {
      const ns = this._fetchNamespace(namespaceId);
      if (ns) {
        ns.insertNode(element, parent);
      }
    }
    if (insertBefore) {
      this.collectEnterElement(element);
    }
  }
  collectEnterElement(element) {
    this.collectedEnterElements.push(element);
  }
  markElementAsDisabled(element, value) {
    if (value) {
      if (!this.disabledNodes.has(element)) {
        this.disabledNodes.add(element);
        addClass(element, DISABLED_CLASSNAME);
      }
    } else if (this.disabledNodes.has(element)) {
      this.disabledNodes.delete(element);
      removeClass(element, DISABLED_CLASSNAME);
    }
  }
  removeNode(namespaceId, element, context) {
    if (isElementNode(element)) {
      const ns = namespaceId ? this._fetchNamespace(namespaceId) : null;
      if (ns) {
        ns.removeNode(element, context);
      } else {
        this.markElementAsRemoved(namespaceId, element, false, context);
      }
      const hostNS = this.namespacesByHostElement.get(element);
      if (hostNS && hostNS.id !== namespaceId) {
        hostNS.removeNode(element, context);
      }
    } else {
      this._onRemovalComplete(element, context);
    }
  }
  markElementAsRemoved(namespaceId, element, hasAnimation, context, previousTriggersValues) {
    this.collectedLeaveElements.push(element);
    element[REMOVAL_FLAG] = {
      namespaceId,
      setForRemoval: context,
      hasAnimation,
      removedBeforeQueried: false,
      previousTriggersValues
    };
  }
  listen(namespaceId, element, name, phase, callback) {
    if (isElementNode(element)) {
      return this._fetchNamespace(namespaceId).listen(element, name, phase, callback);
    }
    return () => {
    };
  }
  _buildInstruction(entry, subTimelines, enterClassName, leaveClassName, skipBuildAst) {
    return entry.transition.build(this.driver, entry.element, entry.fromState.value, entry.toState.value, enterClassName, leaveClassName, entry.fromState.options, entry.toState.options, subTimelines, skipBuildAst);
  }
  destroyInnerAnimations(containerElement) {
    let elements = this.driver.query(containerElement, NG_TRIGGER_SELECTOR, true);
    elements.forEach((element) => this.destroyActiveAnimationsForElement(element));
    if (this.playersByQueriedElement.size == 0) return;
    elements = this.driver.query(containerElement, NG_ANIMATING_SELECTOR, true);
    elements.forEach((element) => this.finishActiveQueriedAnimationOnElement(element));
  }
  destroyActiveAnimationsForElement(element) {
    const players = this.playersByElement.get(element);
    if (players) {
      players.forEach((player) => {
        if (player.queued) {
          player.markedForDestroy = true;
        } else {
          player.destroy();
        }
      });
    }
  }
  finishActiveQueriedAnimationOnElement(element) {
    const players = this.playersByQueriedElement.get(element);
    if (players) {
      players.forEach((player) => player.finish());
    }
  }
  whenRenderingDone() {
    return new Promise((resolve) => {
      if (this.players.length) {
        return optimizeGroupPlayer(this.players).onDone(() => resolve());
      } else {
        resolve();
      }
    });
  }
  processLeaveNode(element) {
    const details = element[REMOVAL_FLAG];
    if (details && details.setForRemoval) {
      element[REMOVAL_FLAG] = NULL_REMOVAL_STATE;
      if (details.namespaceId) {
        this.destroyInnerAnimations(element);
        const ns = this._fetchNamespace(details.namespaceId);
        if (ns) {
          ns.clearElementCache(element);
        }
      }
      this._onRemovalComplete(element, details.setForRemoval);
    }
    if (element.classList?.contains(DISABLED_CLASSNAME)) {
      this.markElementAsDisabled(element, false);
    }
    this.driver.query(element, DISABLED_SELECTOR, true).forEach((node) => {
      this.markElementAsDisabled(node, false);
    });
  }
  flush(microtaskId = -1) {
    let players = [];
    if (this.newHostElements.size) {
      this.newHostElements.forEach((ns, element) => this._balanceNamespaceList(ns, element));
      this.newHostElements.clear();
    }
    if (this.totalAnimations && this.collectedEnterElements.length) {
      for (let i = 0; i < this.collectedEnterElements.length; i++) {
        const elm = this.collectedEnterElements[i];
        addClass(elm, STAR_CLASSNAME);
      }
    }
    if (this._namespaceList.length && (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
      const cleanupFns = [];
      try {
        players = this._flushAnimations(cleanupFns, microtaskId);
      } finally {
        for (let i = 0; i < cleanupFns.length; i++) {
          cleanupFns[i]();
        }
      }
    } else {
      for (let i = 0; i < this.collectedLeaveElements.length; i++) {
        const element = this.collectedLeaveElements[i];
        this.processLeaveNode(element);
      }
    }
    this.totalQueuedPlayers = 0;
    this.collectedEnterElements.length = 0;
    this.collectedLeaveElements.length = 0;
    this._flushFns.forEach((fn) => fn());
    this._flushFns = [];
    if (this._whenQuietFns.length) {
      const quietFns = this._whenQuietFns;
      this._whenQuietFns = [];
      if (players.length) {
        optimizeGroupPlayer(players).onDone(() => {
          quietFns.forEach((fn) => fn());
        });
      } else {
        quietFns.forEach((fn) => fn());
      }
    }
  }
  reportError(errors) {
    throw triggerTransitionsFailed(errors);
  }
  _flushAnimations(cleanupFns, microtaskId) {
    const subTimelines = new ElementInstructionMap();
    const skippedPlayers = [];
    const skippedPlayersMap = /* @__PURE__ */ new Map();
    const queuedInstructions = [];
    const queriedElements = /* @__PURE__ */ new Map();
    const allPreStyleElements = /* @__PURE__ */ new Map();
    const allPostStyleElements = /* @__PURE__ */ new Map();
    const disabledElementsSet = /* @__PURE__ */ new Set();
    this.disabledNodes.forEach((node) => {
      disabledElementsSet.add(node);
      const nodesThatAreDisabled = this.driver.query(node, QUEUED_SELECTOR, true);
      for (let i2 = 0; i2 < nodesThatAreDisabled.length; i2++) {
        disabledElementsSet.add(nodesThatAreDisabled[i2]);
      }
    });
    const bodyNode = this.bodyNode;
    const allTriggerElements = Array.from(this.statesByElement.keys());
    const enterNodeMap = buildRootMap(allTriggerElements, this.collectedEnterElements);
    const enterNodeMapIds = /* @__PURE__ */ new Map();
    let i = 0;
    enterNodeMap.forEach((nodes, root) => {
      const className = ENTER_CLASSNAME + i++;
      enterNodeMapIds.set(root, className);
      nodes.forEach((node) => addClass(node, className));
    });
    const allLeaveNodes = [];
    const mergedLeaveNodes = /* @__PURE__ */ new Set();
    const leaveNodesWithoutAnimations = /* @__PURE__ */ new Set();
    for (let i2 = 0; i2 < this.collectedLeaveElements.length; i2++) {
      const element = this.collectedLeaveElements[i2];
      const details = element[REMOVAL_FLAG];
      if (details && details.setForRemoval) {
        allLeaveNodes.push(element);
        mergedLeaveNodes.add(element);
        if (details.hasAnimation) {
          this.driver.query(element, STAR_SELECTOR, true).forEach((elm) => mergedLeaveNodes.add(elm));
        } else {
          leaveNodesWithoutAnimations.add(element);
        }
      }
    }
    const leaveNodeMapIds = /* @__PURE__ */ new Map();
    const leaveNodeMap = buildRootMap(allTriggerElements, Array.from(mergedLeaveNodes));
    leaveNodeMap.forEach((nodes, root) => {
      const className = LEAVE_CLASSNAME + i++;
      leaveNodeMapIds.set(root, className);
      nodes.forEach((node) => addClass(node, className));
    });
    cleanupFns.push(() => {
      enterNodeMap.forEach((nodes, root) => {
        const className = enterNodeMapIds.get(root);
        nodes.forEach((node) => removeClass(node, className));
      });
      leaveNodeMap.forEach((nodes, root) => {
        const className = leaveNodeMapIds.get(root);
        nodes.forEach((node) => removeClass(node, className));
      });
      allLeaveNodes.forEach((element) => {
        this.processLeaveNode(element);
      });
    });
    const allPlayers = [];
    const erroneousTransitions = [];
    for (let i2 = this._namespaceList.length - 1; i2 >= 0; i2--) {
      const ns = this._namespaceList[i2];
      ns.drainQueuedTransitions(microtaskId).forEach((entry) => {
        const player = entry.player;
        const element = entry.element;
        allPlayers.push(player);
        if (this.collectedEnterElements.length) {
          const details = element[REMOVAL_FLAG];
          if (details && details.setForMove) {
            if (details.previousTriggersValues && details.previousTriggersValues.has(entry.triggerName)) {
              const previousValue = details.previousTriggersValues.get(entry.triggerName);
              const triggersWithStates = this.statesByElement.get(entry.element);
              if (triggersWithStates && triggersWithStates.has(entry.triggerName)) {
                const state = triggersWithStates.get(entry.triggerName);
                state.value = previousValue;
                triggersWithStates.set(entry.triggerName, state);
              }
            }
            player.destroy();
            return;
          }
        }
        const nodeIsOrphaned = !bodyNode || !this.driver.containsElement(bodyNode, element);
        const leaveClassName = leaveNodeMapIds.get(element);
        const enterClassName = enterNodeMapIds.get(element);
        const instruction = this._buildInstruction(entry, subTimelines, enterClassName, leaveClassName, nodeIsOrphaned);
        if (instruction.errors && instruction.errors.length) {
          erroneousTransitions.push(instruction);
          return;
        }
        if (nodeIsOrphaned) {
          player.onStart(() => eraseStyles(element, instruction.fromStyles));
          player.onDestroy(() => setStyles(element, instruction.toStyles));
          skippedPlayers.push(player);
          return;
        }
        if (entry.isFallbackTransition) {
          player.onStart(() => eraseStyles(element, instruction.fromStyles));
          player.onDestroy(() => setStyles(element, instruction.toStyles));
          skippedPlayers.push(player);
          return;
        }
        const timelines = [];
        instruction.timelines.forEach((tl) => {
          tl.stretchStartingKeyframe = true;
          if (!this.disabledNodes.has(tl.element)) {
            timelines.push(tl);
          }
        });
        instruction.timelines = timelines;
        subTimelines.append(element, instruction.timelines);
        const tuple = {
          instruction,
          player,
          element
        };
        queuedInstructions.push(tuple);
        instruction.queriedElements.forEach((element2) => getOrSetDefaultValue(queriedElements, element2, []).push(player));
        instruction.preStyleProps.forEach((stringMap, element2) => {
          if (stringMap.size) {
            let setVal = allPreStyleElements.get(element2);
            if (!setVal) {
              allPreStyleElements.set(element2, setVal = /* @__PURE__ */ new Set());
            }
            stringMap.forEach((_, prop) => setVal.add(prop));
          }
        });
        instruction.postStyleProps.forEach((stringMap, element2) => {
          let setVal = allPostStyleElements.get(element2);
          if (!setVal) {
            allPostStyleElements.set(element2, setVal = /* @__PURE__ */ new Set());
          }
          stringMap.forEach((_, prop) => setVal.add(prop));
        });
      });
    }
    if (erroneousTransitions.length) {
      const errors = [];
      erroneousTransitions.forEach((instruction) => {
        errors.push(transitionFailed(instruction.triggerName, instruction.errors));
      });
      allPlayers.forEach((player) => player.destroy());
      this.reportError(errors);
    }
    const allPreviousPlayersMap = /* @__PURE__ */ new Map();
    const animationElementMap = /* @__PURE__ */ new Map();
    queuedInstructions.forEach((entry) => {
      const element = entry.element;
      if (subTimelines.has(element)) {
        animationElementMap.set(element, element);
        this._beforeAnimationBuild(entry.player.namespaceId, entry.instruction, allPreviousPlayersMap);
      }
    });
    skippedPlayers.forEach((player) => {
      const element = player.element;
      const previousPlayers = this._getPreviousPlayers(element, false, player.namespaceId, player.triggerName, null);
      previousPlayers.forEach((prevPlayer) => {
        getOrSetDefaultValue(allPreviousPlayersMap, element, []).push(prevPlayer);
        prevPlayer.destroy();
      });
    });
    const replaceNodes = allLeaveNodes.filter((node) => {
      return replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements);
    });
    const postStylesMap = /* @__PURE__ */ new Map();
    const allLeaveQueriedNodes = cloakAndComputeStyles(postStylesMap, this.driver, leaveNodesWithoutAnimations, allPostStyleElements, AUTO_STYLE);
    allLeaveQueriedNodes.forEach((node) => {
      if (replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements)) {
        replaceNodes.push(node);
      }
    });
    const preStylesMap = /* @__PURE__ */ new Map();
    enterNodeMap.forEach((nodes, root) => {
      cloakAndComputeStyles(preStylesMap, this.driver, new Set(nodes), allPreStyleElements, \u0275PRE_STYLE);
    });
    replaceNodes.forEach((node) => {
      const post = postStylesMap.get(node);
      const pre = preStylesMap.get(node);
      postStylesMap.set(node, new Map([...post?.entries() ?? [], ...pre?.entries() ?? []]));
    });
    const rootPlayers = [];
    const subPlayers = [];
    const NO_PARENT_ANIMATION_ELEMENT_DETECTED = {};
    queuedInstructions.forEach((entry) => {
      const {
        element,
        player,
        instruction
      } = entry;
      if (subTimelines.has(element)) {
        if (disabledElementsSet.has(element)) {
          player.onDestroy(() => setStyles(element, instruction.toStyles));
          player.disabled = true;
          player.overrideTotalTime(instruction.totalTime);
          skippedPlayers.push(player);
          return;
        }
        let parentWithAnimation = NO_PARENT_ANIMATION_ELEMENT_DETECTED;
        if (animationElementMap.size > 1) {
          let elm = element;
          const parentsToAdd = [];
          while (elm = elm.parentNode) {
            const detectedParent = animationElementMap.get(elm);
            if (detectedParent) {
              parentWithAnimation = detectedParent;
              break;
            }
            parentsToAdd.push(elm);
          }
          parentsToAdd.forEach((parent) => animationElementMap.set(parent, parentWithAnimation));
        }
        const innerPlayer = this._buildAnimation(player.namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap);
        player.setRealPlayer(innerPlayer);
        if (parentWithAnimation === NO_PARENT_ANIMATION_ELEMENT_DETECTED) {
          rootPlayers.push(player);
        } else {
          const parentPlayers = this.playersByElement.get(parentWithAnimation);
          if (parentPlayers && parentPlayers.length) {
            player.parentPlayer = optimizeGroupPlayer(parentPlayers);
          }
          skippedPlayers.push(player);
        }
      } else {
        eraseStyles(element, instruction.fromStyles);
        player.onDestroy(() => setStyles(element, instruction.toStyles));
        subPlayers.push(player);
        if (disabledElementsSet.has(element)) {
          skippedPlayers.push(player);
        }
      }
    });
    subPlayers.forEach((player) => {
      const playersForElement = skippedPlayersMap.get(player.element);
      if (playersForElement && playersForElement.length) {
        const innerPlayer = optimizeGroupPlayer(playersForElement);
        player.setRealPlayer(innerPlayer);
      }
    });
    skippedPlayers.forEach((player) => {
      if (player.parentPlayer) {
        player.syncPlayerEvents(player.parentPlayer);
      } else {
        player.destroy();
      }
    });
    for (let i2 = 0; i2 < allLeaveNodes.length; i2++) {
      const element = allLeaveNodes[i2];
      const details = element[REMOVAL_FLAG];
      removeClass(element, LEAVE_CLASSNAME);
      if (details && details.hasAnimation) continue;
      let players = [];
      if (queriedElements.size) {
        let queriedPlayerResults = queriedElements.get(element);
        if (queriedPlayerResults && queriedPlayerResults.length) {
          players.push(...queriedPlayerResults);
        }
        let queriedInnerElements = this.driver.query(element, NG_ANIMATING_SELECTOR, true);
        for (let j = 0; j < queriedInnerElements.length; j++) {
          let queriedPlayers = queriedElements.get(queriedInnerElements[j]);
          if (queriedPlayers && queriedPlayers.length) {
            players.push(...queriedPlayers);
          }
        }
      }
      const activePlayers = players.filter((p) => !p.destroyed);
      if (activePlayers.length) {
        removeNodesAfterAnimationDone(this, element, activePlayers);
      } else {
        this.processLeaveNode(element);
      }
    }
    allLeaveNodes.length = 0;
    rootPlayers.forEach((player) => {
      this.players.push(player);
      player.onDone(() => {
        player.destroy();
        const index = this.players.indexOf(player);
        this.players.splice(index, 1);
      });
      player.play();
    });
    return rootPlayers;
  }
  afterFlush(callback) {
    this._flushFns.push(callback);
  }
  afterFlushAnimationsDone(callback) {
    this._whenQuietFns.push(callback);
  }
  _getPreviousPlayers(element, isQueriedElement, namespaceId, triggerName, toStateValue) {
    let players = [];
    if (isQueriedElement) {
      const queriedElementPlayers = this.playersByQueriedElement.get(element);
      if (queriedElementPlayers) {
        players = queriedElementPlayers;
      }
    } else {
      const elementPlayers = this.playersByElement.get(element);
      if (elementPlayers) {
        const isRemovalAnimation = !toStateValue || toStateValue == VOID_VALUE;
        elementPlayers.forEach((player) => {
          if (player.queued) return;
          if (!isRemovalAnimation && player.triggerName != triggerName) return;
          players.push(player);
        });
      }
    }
    if (namespaceId || triggerName) {
      players = players.filter((player) => {
        if (namespaceId && namespaceId != player.namespaceId) return false;
        if (triggerName && triggerName != player.triggerName) return false;
        return true;
      });
    }
    return players;
  }
  _beforeAnimationBuild(namespaceId, instruction, allPreviousPlayersMap) {
    const triggerName = instruction.triggerName;
    const rootElement = instruction.element;
    const targetNameSpaceId = instruction.isRemovalTransition ? void 0 : namespaceId;
    const targetTriggerName = instruction.isRemovalTransition ? void 0 : triggerName;
    for (const timelineInstruction of instruction.timelines) {
      const element = timelineInstruction.element;
      const isQueriedElement = element !== rootElement;
      const players = getOrSetDefaultValue(allPreviousPlayersMap, element, []);
      const previousPlayers = this._getPreviousPlayers(element, isQueriedElement, targetNameSpaceId, targetTriggerName, instruction.toState);
      previousPlayers.forEach((player) => {
        const realPlayer = player.getRealPlayer();
        if (realPlayer.beforeDestroy) {
          realPlayer.beforeDestroy();
        }
        player.destroy();
        players.push(player);
      });
    }
    eraseStyles(rootElement, instruction.fromStyles);
  }
  _buildAnimation(namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap) {
    const triggerName = instruction.triggerName;
    const rootElement = instruction.element;
    const allQueriedPlayers = [];
    const allConsumedElements = /* @__PURE__ */ new Set();
    const allSubElements = /* @__PURE__ */ new Set();
    const allNewPlayers = instruction.timelines.map((timelineInstruction) => {
      const element = timelineInstruction.element;
      allConsumedElements.add(element);
      const details = element[REMOVAL_FLAG];
      if (details && details.removedBeforeQueried) return new NoopAnimationPlayer(timelineInstruction.duration, timelineInstruction.delay);
      const isQueriedElement = element !== rootElement;
      const previousPlayers = flattenGroupPlayers((allPreviousPlayersMap.get(element) || EMPTY_PLAYER_ARRAY).map((p) => p.getRealPlayer())).filter((p) => {
        const pp = p;
        return pp.element ? pp.element === element : false;
      });
      const preStyles = preStylesMap.get(element);
      const postStyles = postStylesMap.get(element);
      const keyframes = normalizeKeyframes$1(this._normalizer, timelineInstruction.keyframes, preStyles, postStyles);
      const player2 = this._buildPlayer(timelineInstruction, keyframes, previousPlayers);
      if (timelineInstruction.subTimeline && skippedPlayersMap) {
        allSubElements.add(element);
      }
      if (isQueriedElement) {
        const wrappedPlayer = new TransitionAnimationPlayer(namespaceId, triggerName, element);
        wrappedPlayer.setRealPlayer(player2);
        allQueriedPlayers.push(wrappedPlayer);
      }
      return player2;
    });
    allQueriedPlayers.forEach((player2) => {
      getOrSetDefaultValue(this.playersByQueriedElement, player2.element, []).push(player2);
      player2.onDone(() => deleteOrUnsetInMap(this.playersByQueriedElement, player2.element, player2));
    });
    allConsumedElements.forEach((element) => addClass(element, NG_ANIMATING_CLASSNAME));
    const player = optimizeGroupPlayer(allNewPlayers);
    player.onDestroy(() => {
      allConsumedElements.forEach((element) => removeClass(element, NG_ANIMATING_CLASSNAME));
      setStyles(rootElement, instruction.toStyles);
    });
    allSubElements.forEach((element) => {
      getOrSetDefaultValue(skippedPlayersMap, element, []).push(player);
    });
    return player;
  }
  _buildPlayer(instruction, keyframes, previousPlayers) {
    if (keyframes.length > 0) {
      return this.driver.animate(instruction.element, keyframes, instruction.duration, instruction.delay, instruction.easing, previousPlayers);
    }
    return new NoopAnimationPlayer(instruction.duration, instruction.delay);
  }
};
var TransitionAnimationPlayer = class {
  namespaceId;
  triggerName;
  element;
  _player = new NoopAnimationPlayer();
  _containsRealPlayer = false;
  _queuedCallbacks = /* @__PURE__ */ new Map();
  destroyed = false;
  parentPlayer = null;
  markedForDestroy = false;
  disabled = false;
  queued = true;
  totalTime = 0;
  constructor(namespaceId, triggerName, element) {
    this.namespaceId = namespaceId;
    this.triggerName = triggerName;
    this.element = element;
  }
  setRealPlayer(player) {
    if (this._containsRealPlayer) return;
    this._player = player;
    this._queuedCallbacks.forEach((callbacks, phase) => {
      callbacks.forEach((callback) => listenOnPlayer(player, phase, void 0, callback));
    });
    this._queuedCallbacks.clear();
    this._containsRealPlayer = true;
    this.overrideTotalTime(player.totalTime);
    this.queued = false;
  }
  getRealPlayer() {
    return this._player;
  }
  overrideTotalTime(totalTime) {
    this.totalTime = totalTime;
  }
  syncPlayerEvents(player) {
    const p = this._player;
    if (p.triggerCallback) {
      player.onStart(() => p.triggerCallback("start"));
    }
    player.onDone(() => this.finish());
    player.onDestroy(() => this.destroy());
  }
  _queueEvent(name, callback) {
    getOrSetDefaultValue(this._queuedCallbacks, name, []).push(callback);
  }
  onDone(fn) {
    if (this.queued) {
      this._queueEvent("done", fn);
    }
    this._player.onDone(fn);
  }
  onStart(fn) {
    if (this.queued) {
      this._queueEvent("start", fn);
    }
    this._player.onStart(fn);
  }
  onDestroy(fn) {
    if (this.queued) {
      this._queueEvent("destroy", fn);
    }
    this._player.onDestroy(fn);
  }
  init() {
    this._player.init();
  }
  hasStarted() {
    return this.queued ? false : this._player.hasStarted();
  }
  play() {
    !this.queued && this._player.play();
  }
  pause() {
    !this.queued && this._player.pause();
  }
  restart() {
    !this.queued && this._player.restart();
  }
  finish() {
    this._player.finish();
  }
  destroy() {
    this.destroyed = true;
    this._player.destroy();
  }
  reset() {
    !this.queued && this._player.reset();
  }
  setPosition(p) {
    if (!this.queued) {
      this._player.setPosition(p);
    }
  }
  getPosition() {
    return this.queued ? 0 : this._player.getPosition();
  }
  /** @internal */
  triggerCallback(phaseName) {
    const p = this._player;
    if (p.triggerCallback) {
      p.triggerCallback(phaseName);
    }
  }
};
function deleteOrUnsetInMap(map2, key, value) {
  let currentValues = map2.get(key);
  if (currentValues) {
    if (currentValues.length) {
      const index = currentValues.indexOf(value);
      currentValues.splice(index, 1);
    }
    if (currentValues.length == 0) {
      map2.delete(key);
    }
  }
  return currentValues;
}
function normalizeTriggerValue(value) {
  return value != null ? value : null;
}
function isElementNode(node) {
  return node && node["nodeType"] === 1;
}
function isTriggerEventValid(eventName) {
  return eventName == "start" || eventName == "done";
}
function cloakElement(element, value) {
  const oldValue = element.style.display;
  element.style.display = value != null ? value : "none";
  return oldValue;
}
function cloakAndComputeStyles(valuesMap, driver, elements, elementPropsMap, defaultStyle) {
  const cloakVals = [];
  elements.forEach((element) => cloakVals.push(cloakElement(element)));
  const failedElements = [];
  elementPropsMap.forEach((props, element) => {
    const styles = /* @__PURE__ */ new Map();
    props.forEach((prop) => {
      const value = driver.computeStyle(element, prop, defaultStyle);
      styles.set(prop, value);
      if (!value || value.length == 0) {
        element[REMOVAL_FLAG] = NULL_REMOVED_QUERIED_STATE;
        failedElements.push(element);
      }
    });
    valuesMap.set(element, styles);
  });
  let i = 0;
  elements.forEach((element) => cloakElement(element, cloakVals[i++]));
  return failedElements;
}
function buildRootMap(roots, nodes) {
  const rootMap = /* @__PURE__ */ new Map();
  roots.forEach((root) => rootMap.set(root, []));
  if (nodes.length == 0) return rootMap;
  const NULL_NODE = 1;
  const nodeSet = new Set(nodes);
  const localRootMap = /* @__PURE__ */ new Map();
  function getRoot(node) {
    if (!node) return NULL_NODE;
    let root = localRootMap.get(node);
    if (root) return root;
    const parent = node.parentNode;
    if (rootMap.has(parent)) {
      root = parent;
    } else if (nodeSet.has(parent)) {
      root = NULL_NODE;
    } else {
      root = getRoot(parent);
    }
    localRootMap.set(node, root);
    return root;
  }
  nodes.forEach((node) => {
    const root = getRoot(node);
    if (root !== NULL_NODE) {
      rootMap.get(root).push(node);
    }
  });
  return rootMap;
}
function addClass(element, className) {
  element.classList?.add(className);
}
function removeClass(element, className) {
  element.classList?.remove(className);
}
function removeNodesAfterAnimationDone(engine, element, players) {
  optimizeGroupPlayer(players).onDone(() => engine.processLeaveNode(element));
}
function flattenGroupPlayers(players) {
  const finalPlayers = [];
  _flattenGroupPlayersRecur(players, finalPlayers);
  return finalPlayers;
}
function _flattenGroupPlayersRecur(players, finalPlayers) {
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    if (player instanceof AnimationGroupPlayer) {
      _flattenGroupPlayersRecur(player.players, finalPlayers);
    } else {
      finalPlayers.push(player);
    }
  }
}
function objEquals(a, b) {
  const k1 = Object.keys(a);
  const k2 = Object.keys(b);
  if (k1.length != k2.length) return false;
  for (let i = 0; i < k1.length; i++) {
    const prop = k1[i];
    if (!b.hasOwnProperty(prop) || a[prop] !== b[prop]) return false;
  }
  return true;
}
function replacePostStylesAsPre(element, allPreStyleElements, allPostStyleElements) {
  const postEntry = allPostStyleElements.get(element);
  if (!postEntry) return false;
  let preEntry = allPreStyleElements.get(element);
  if (preEntry) {
    postEntry.forEach((data) => preEntry.add(data));
  } else {
    allPreStyleElements.set(element, postEntry);
  }
  allPostStyleElements.delete(element);
  return true;
}
var AnimationEngine = class {
  _driver;
  _normalizer;
  _transitionEngine;
  _timelineEngine;
  _triggerCache = {};
  // this method is designed to be overridden by the code that uses this engine
  onRemovalComplete = (element, context) => {
  };
  constructor(doc, _driver, _normalizer) {
    this._driver = _driver;
    this._normalizer = _normalizer;
    this._transitionEngine = new TransitionAnimationEngine(doc.body, _driver, _normalizer);
    this._timelineEngine = new TimelineAnimationEngine(doc.body, _driver, _normalizer);
    this._transitionEngine.onRemovalComplete = (element, context) => this.onRemovalComplete(element, context);
  }
  registerTrigger(componentId, namespaceId, hostElement, name, metadata) {
    const cacheKey = componentId + "-" + name;
    let trigger = this._triggerCache[cacheKey];
    if (!trigger) {
      const errors = [];
      const warnings = [];
      const ast = buildAnimationAst(this._driver, metadata, errors, warnings);
      if (errors.length) {
        throw triggerBuildFailed(name, errors);
      }
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        if (warnings.length) {
          warnTriggerBuild(name, warnings);
        }
      }
      trigger = buildTrigger(name, ast, this._normalizer);
      this._triggerCache[cacheKey] = trigger;
    }
    this._transitionEngine.registerTrigger(namespaceId, name, trigger);
  }
  register(namespaceId, hostElement) {
    this._transitionEngine.register(namespaceId, hostElement);
  }
  destroy(namespaceId, context) {
    this._transitionEngine.destroy(namespaceId, context);
  }
  onInsert(namespaceId, element, parent, insertBefore) {
    this._transitionEngine.insertNode(namespaceId, element, parent, insertBefore);
  }
  onRemove(namespaceId, element, context) {
    this._transitionEngine.removeNode(namespaceId, element, context);
  }
  disableAnimations(element, disable) {
    this._transitionEngine.markElementAsDisabled(element, disable);
  }
  process(namespaceId, element, property, value) {
    if (property.charAt(0) == "@") {
      const [id, action] = parseTimelineCommand(property);
      const args = value;
      this._timelineEngine.command(id, element, action, args);
    } else {
      this._transitionEngine.trigger(namespaceId, element, property, value);
    }
  }
  listen(namespaceId, element, eventName, eventPhase, callback) {
    if (eventName.charAt(0) == "@") {
      const [id, action] = parseTimelineCommand(eventName);
      return this._timelineEngine.listen(id, element, action, callback);
    }
    return this._transitionEngine.listen(namespaceId, element, eventName, eventPhase, callback);
  }
  flush(microtaskId = -1) {
    this._transitionEngine.flush(microtaskId);
  }
  get players() {
    return [...this._transitionEngine.players, ...this._timelineEngine.players];
  }
  whenRenderingDone() {
    return this._transitionEngine.whenRenderingDone();
  }
  afterFlushAnimationsDone(cb) {
    this._transitionEngine.afterFlushAnimationsDone(cb);
  }
};
function packageNonAnimatableStyles(element, styles) {
  let startStyles = null;
  let endStyles = null;
  if (Array.isArray(styles) && styles.length) {
    startStyles = filterNonAnimatableStyles(styles[0]);
    if (styles.length > 1) {
      endStyles = filterNonAnimatableStyles(styles[styles.length - 1]);
    }
  } else if (styles instanceof Map) {
    startStyles = filterNonAnimatableStyles(styles);
  }
  return startStyles || endStyles ? new SpecialCasedStyles(element, startStyles, endStyles) : null;
}
var SpecialCasedStyles = class _SpecialCasedStyles {
  _element;
  _startStyles;
  _endStyles;
  static initialStylesByElement = /* @__PURE__ */ new WeakMap();
  _state = 0;
  _initialStyles;
  constructor(_element, _startStyles, _endStyles) {
    this._element = _element;
    this._startStyles = _startStyles;
    this._endStyles = _endStyles;
    let initialStyles = _SpecialCasedStyles.initialStylesByElement.get(_element);
    if (!initialStyles) {
      _SpecialCasedStyles.initialStylesByElement.set(_element, initialStyles = /* @__PURE__ */ new Map());
    }
    this._initialStyles = initialStyles;
  }
  start() {
    if (this._state < 1) {
      if (this._startStyles) {
        setStyles(this._element, this._startStyles, this._initialStyles);
      }
      this._state = 1;
    }
  }
  finish() {
    this.start();
    if (this._state < 2) {
      setStyles(this._element, this._initialStyles);
      if (this._endStyles) {
        setStyles(this._element, this._endStyles);
        this._endStyles = null;
      }
      this._state = 1;
    }
  }
  destroy() {
    this.finish();
    if (this._state < 3) {
      _SpecialCasedStyles.initialStylesByElement.delete(this._element);
      if (this._startStyles) {
        eraseStyles(this._element, this._startStyles);
        this._endStyles = null;
      }
      if (this._endStyles) {
        eraseStyles(this._element, this._endStyles);
        this._endStyles = null;
      }
      setStyles(this._element, this._initialStyles);
      this._state = 3;
    }
  }
};
function filterNonAnimatableStyles(styles) {
  let result = null;
  styles.forEach((val, prop) => {
    if (isNonAnimatableStyle(prop)) {
      result = result || /* @__PURE__ */ new Map();
      result.set(prop, val);
    }
  });
  return result;
}
function isNonAnimatableStyle(prop) {
  return prop === "display" || prop === "position";
}
var WebAnimationsPlayer = class {
  element;
  keyframes;
  options;
  _specialStyles;
  _onDoneFns = [];
  _onStartFns = [];
  _onDestroyFns = [];
  _duration;
  _delay;
  _initialized = false;
  _finished = false;
  _started = false;
  _destroyed = false;
  _finalKeyframe;
  // the following original fns are persistent copies of the _onStartFns and _onDoneFns
  // and are used to reset the fns to their original values upon reset()
  // (since the _onStartFns and _onDoneFns get deleted after they are called)
  _originalOnDoneFns = [];
  _originalOnStartFns = [];
  domPlayer = null;
  time = 0;
  parentPlayer = null;
  currentSnapshot = /* @__PURE__ */ new Map();
  constructor(element, keyframes, options, _specialStyles) {
    this.element = element;
    this.keyframes = keyframes;
    this.options = options;
    this._specialStyles = _specialStyles;
    this._duration = options["duration"];
    this._delay = options["delay"] || 0;
    this.time = this._duration + this._delay;
  }
  _onFinish() {
    if (!this._finished) {
      this._finished = true;
      this._onDoneFns.forEach((fn) => fn());
      this._onDoneFns = [];
    }
  }
  init() {
    if (!this._buildPlayer()) {
      return;
    }
    this._preparePlayerBeforeStart();
  }
  _buildPlayer() {
    if (this._initialized) return this.domPlayer;
    this._initialized = true;
    const keyframes = this.keyframes;
    const animation = this._triggerWebAnimation(this.element, keyframes, this.options);
    if (!animation) {
      this._onFinish();
      return null;
    }
    this.domPlayer = animation;
    this._finalKeyframe = keyframes.length ? keyframes[keyframes.length - 1] : /* @__PURE__ */ new Map();
    const onFinish = () => this._onFinish();
    animation.addEventListener("finish", onFinish);
    this.onDestroy(() => {
      animation.removeEventListener("finish", onFinish);
    });
    return animation;
  }
  _preparePlayerBeforeStart() {
    if (this._delay) {
      this._resetDomPlayerState();
    } else {
      this.domPlayer?.pause();
    }
  }
  _convertKeyframesToObject(keyframes) {
    const kfs = [];
    keyframes.forEach((frame) => {
      kfs.push(Object.fromEntries(frame));
    });
    return kfs;
  }
  /** @internal */
  _triggerWebAnimation(element, keyframes, options) {
    const keyframesObject = this._convertKeyframesToObject(keyframes);
    try {
      return element.animate(keyframesObject, options);
    } catch {
      return null;
    }
  }
  onStart(fn) {
    this._originalOnStartFns.push(fn);
    this._onStartFns.push(fn);
  }
  onDone(fn) {
    this._originalOnDoneFns.push(fn);
    this._onDoneFns.push(fn);
  }
  onDestroy(fn) {
    this._onDestroyFns.push(fn);
  }
  play() {
    const player = this._buildPlayer();
    if (!player) {
      return;
    }
    if (!this.hasStarted()) {
      this._onStartFns.forEach((fn) => fn());
      this._onStartFns = [];
      this._started = true;
      if (this._specialStyles) {
        this._specialStyles.start();
      }
    }
    player.play();
  }
  pause() {
    this.init();
    this.domPlayer?.pause();
  }
  finish() {
    this.init();
    if (!this.domPlayer) return;
    if (this._specialStyles) {
      this._specialStyles.finish();
    }
    this._onFinish();
    this.domPlayer.finish();
  }
  reset() {
    this._resetDomPlayerState();
    this._destroyed = false;
    this._finished = false;
    this._started = false;
    this._onStartFns = this._originalOnStartFns;
    this._onDoneFns = this._originalOnDoneFns;
  }
  _resetDomPlayerState() {
    this.domPlayer?.cancel();
  }
  restart() {
    this.reset();
    this.play();
  }
  hasStarted() {
    return this._started;
  }
  destroy() {
    if (!this._destroyed) {
      this._destroyed = true;
      this._resetDomPlayerState();
      this._onFinish();
      if (this._specialStyles) {
        this._specialStyles.destroy();
      }
      this._onDestroyFns.forEach((fn) => fn());
      this._onDestroyFns = [];
    }
  }
  setPosition(p) {
    if (!this.domPlayer) {
      this.init();
    }
    if (this.domPlayer) {
      this.domPlayer.currentTime = p * this.time;
    }
  }
  getPosition() {
    if (!this.domPlayer) {
      return this._initialized ? 1 : 0;
    }
    return +(this.domPlayer.currentTime ?? 0) / this.time;
  }
  get totalTime() {
    return this._delay + this._duration;
  }
  beforeDestroy() {
    const styles = /* @__PURE__ */ new Map();
    if (this.hasStarted()) {
      const finalKeyframe = this._finalKeyframe;
      finalKeyframe.forEach((val, prop) => {
        if (prop !== "offset") {
          styles.set(prop, this._finished ? val : computeStyle(this.element, prop));
        }
      });
    }
    this.currentSnapshot = styles;
  }
  /** @internal */
  triggerCallback(phaseName) {
    const methods = phaseName === "start" ? this._onStartFns : this._onDoneFns;
    methods.forEach((fn) => fn());
    methods.length = 0;
  }
};
var WebAnimationsDriver = class {
  validateStyleProperty(prop) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      return validateStyleProperty(prop);
    }
    return true;
  }
  validateAnimatableStyleProperty(prop) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      const cssProp = camelCaseToDashCase(prop);
      return validateWebAnimatableStyleProperty(cssProp);
    }
    return true;
  }
  containsElement(elm1, elm2) {
    return containsElement(elm1, elm2);
  }
  getParentElement(element) {
    return getParentElement(element);
  }
  query(element, selector, multi) {
    return invokeQuery(element, selector, multi);
  }
  computeStyle(element, prop, defaultValue) {
    return computeStyle(element, prop);
  }
  animate(element, keyframes, duration, delay, easing, previousPlayers = []) {
    const fill = delay == 0 ? "both" : "forwards";
    const playerOptions = {
      duration,
      delay,
      fill
    };
    if (easing) {
      playerOptions["easing"] = easing;
    }
    const previousStyles = /* @__PURE__ */ new Map();
    const previousWebAnimationPlayers = previousPlayers.filter((player) => player instanceof WebAnimationsPlayer);
    if (allowPreviousPlayerStylesMerge(duration, delay)) {
      previousWebAnimationPlayers.forEach((player) => {
        player.currentSnapshot.forEach((val, prop) => previousStyles.set(prop, val));
      });
    }
    let _keyframes = normalizeKeyframes(keyframes).map((styles) => new Map(styles));
    _keyframes = balancePreviousStylesIntoKeyframes(element, _keyframes, previousStyles);
    const specialStyles = packageNonAnimatableStyles(element, _keyframes);
    return new WebAnimationsPlayer(element, _keyframes, playerOptions, specialStyles);
  }
};
var ANIMATION_PREFIX = "@";
var DISABLE_ANIMATIONS_FLAG = "@.disabled";
var BaseAnimationRenderer = class {
  namespaceId;
  delegate;
  engine;
  _onDestroy;
  // We need to explicitly type this property because of an api-extractor bug
  // See https://github.com/microsoft/rushstack/issues/4390
  \u0275type = 0;
  constructor(namespaceId, delegate, engine, _onDestroy) {
    this.namespaceId = namespaceId;
    this.delegate = delegate;
    this.engine = engine;
    this._onDestroy = _onDestroy;
  }
  get data() {
    return this.delegate.data;
  }
  destroyNode(node) {
    this.delegate.destroyNode?.(node);
  }
  destroy() {
    this.engine.destroy(this.namespaceId, this.delegate);
    this.engine.afterFlushAnimationsDone(() => {
      queueMicrotask(() => {
        this.delegate.destroy();
      });
    });
    this._onDestroy?.();
  }
  createElement(name, namespace) {
    return this.delegate.createElement(name, namespace);
  }
  createComment(value) {
    return this.delegate.createComment(value);
  }
  createText(value) {
    return this.delegate.createText(value);
  }
  appendChild(parent, newChild) {
    this.delegate.appendChild(parent, newChild);
    this.engine.onInsert(this.namespaceId, newChild, parent, false);
  }
  insertBefore(parent, newChild, refChild, isMove = true) {
    this.delegate.insertBefore(parent, newChild, refChild);
    this.engine.onInsert(this.namespaceId, newChild, parent, isMove);
  }
  // TODO(thePunderWoman): remove the requireSynchronousElementRemoval flag after the
  // animations package has been fully deleted post v23.
  removeChild(parent, oldChild, isHostElement, requireSynchronousElementRemoval) {
    if (requireSynchronousElementRemoval) {
      this.delegate.removeChild(parent, oldChild, isHostElement, requireSynchronousElementRemoval);
      return;
    }
    if (this.parentNode(oldChild)) {
      this.engine.onRemove(this.namespaceId, oldChild, this.delegate);
    }
  }
  selectRootElement(selectorOrNode, preserveContent) {
    return this.delegate.selectRootElement(selectorOrNode, preserveContent);
  }
  parentNode(node) {
    return this.delegate.parentNode(node);
  }
  nextSibling(node) {
    return this.delegate.nextSibling(node);
  }
  setAttribute(el, name, value, namespace) {
    this.delegate.setAttribute(el, name, value, namespace);
  }
  removeAttribute(el, name, namespace) {
    this.delegate.removeAttribute(el, name, namespace);
  }
  addClass(el, name) {
    this.delegate.addClass(el, name);
  }
  removeClass(el, name) {
    this.delegate.removeClass(el, name);
  }
  setStyle(el, style2, value, flags) {
    this.delegate.setStyle(el, style2, value, flags);
  }
  removeStyle(el, style2, flags) {
    this.delegate.removeStyle(el, style2, flags);
  }
  setProperty(el, name, value) {
    if (name.charAt(0) == ANIMATION_PREFIX && name == DISABLE_ANIMATIONS_FLAG) {
      this.disableAnimations(el, !!value);
    } else {
      this.delegate.setProperty(el, name, value);
    }
  }
  setValue(node, value) {
    this.delegate.setValue(node, value);
  }
  listen(target, eventName, callback, options) {
    return this.delegate.listen(target, eventName, callback, options);
  }
  disableAnimations(element, value) {
    this.engine.disableAnimations(element, value);
  }
};
var AnimationRenderer = class extends BaseAnimationRenderer {
  factory;
  constructor(factory, namespaceId, delegate, engine, onDestroy) {
    super(namespaceId, delegate, engine, onDestroy);
    this.factory = factory;
    this.namespaceId = namespaceId;
  }
  setProperty(el, name, value) {
    if (name.charAt(0) == ANIMATION_PREFIX) {
      if (name.charAt(1) == "." && name == DISABLE_ANIMATIONS_FLAG) {
        value = value === void 0 ? true : !!value;
        this.disableAnimations(el, value);
      } else {
        this.engine.process(this.namespaceId, el, name.slice(1), value);
      }
    } else {
      this.delegate.setProperty(el, name, value);
    }
  }
  listen(target, eventName, callback, options) {
    if (eventName.charAt(0) == ANIMATION_PREFIX) {
      const element = resolveElementFromTarget(target);
      let name = eventName.slice(1);
      let phase = "";
      if (name.charAt(0) != ANIMATION_PREFIX) {
        [name, phase] = parseTriggerCallbackName(name);
      }
      return this.engine.listen(this.namespaceId, element, name, phase, (event) => {
        const countId = event["_data"] || -1;
        this.factory.scheduleListenerCallback(countId, callback, event);
      });
    }
    return this.delegate.listen(target, eventName, callback, options);
  }
};
function resolveElementFromTarget(target) {
  switch (target) {
    case "body":
      return document.body;
    case "document":
      return document;
    case "window":
      return window;
    default:
      return target;
  }
}
function parseTriggerCallbackName(triggerName) {
  const dotIndex = triggerName.indexOf(".");
  const trigger = triggerName.substring(0, dotIndex);
  const phase = triggerName.slice(dotIndex + 1);
  return [trigger, phase];
}
var AnimationRendererFactory = class {
  delegate;
  engine;
  _zone;
  _currentId = 0;
  _microtaskId = 1;
  _animationCallbacksBuffer = [];
  _rendererCache = /* @__PURE__ */ new Map();
  _cdRecurDepth = 0;
  constructor(delegate, engine, _zone) {
    this.delegate = delegate;
    this.engine = engine;
    this._zone = _zone;
    engine.onRemovalComplete = (element, delegate2) => {
      delegate2?.removeChild(null, element);
    };
  }
  createRenderer(hostElement, type) {
    const EMPTY_NAMESPACE_ID = "";
    const delegate = this.delegate.createRenderer(hostElement, type);
    if (!hostElement || !type?.data?.["animation"]) {
      const cache = this._rendererCache;
      let renderer = cache.get(delegate);
      if (!renderer) {
        const onRendererDestroy = () => cache.delete(delegate);
        renderer = new BaseAnimationRenderer(EMPTY_NAMESPACE_ID, delegate, this.engine, onRendererDestroy);
        cache.set(delegate, renderer);
      }
      return renderer;
    }
    const componentId = type.id;
    const namespaceId = type.id + "-" + this._currentId;
    this._currentId++;
    this.engine.register(namespaceId, hostElement);
    const registerTrigger = (trigger) => {
      if (Array.isArray(trigger)) {
        trigger.forEach(registerTrigger);
      } else {
        this.engine.registerTrigger(componentId, namespaceId, hostElement, trigger.name, trigger);
      }
    };
    const animationTriggers = type.data["animation"];
    animationTriggers.forEach(registerTrigger);
    return new AnimationRenderer(this, namespaceId, delegate, this.engine);
  }
  begin() {
    this._cdRecurDepth++;
    if (this.delegate.begin) {
      this.delegate.begin();
    }
  }
  _scheduleCountTask() {
    queueMicrotask(() => {
      this._microtaskId++;
    });
  }
  /** @internal */
  scheduleListenerCallback(count, fn, data) {
    if (count >= 0 && count < this._microtaskId) {
      this._zone.run(() => fn(data));
      return;
    }
    const animationCallbacksBuffer = this._animationCallbacksBuffer;
    if (animationCallbacksBuffer.length == 0) {
      queueMicrotask(() => {
        this._zone.run(() => {
          animationCallbacksBuffer.forEach((tuple) => {
            const [fn2, data2] = tuple;
            fn2(data2);
          });
          this._animationCallbacksBuffer = [];
        });
      });
    }
    animationCallbacksBuffer.push([fn, data]);
  }
  end() {
    this._cdRecurDepth--;
    if (this._cdRecurDepth == 0) {
      this._zone.runOutsideAngular(() => {
        this._scheduleCountTask();
        this.engine.flush(this._microtaskId);
      });
    }
    if (this.delegate.end) {
      this.delegate.end();
    }
  }
  whenRenderingDone() {
    return this.engine.whenRenderingDone();
  }
  /**
   * Used during HMR to clear any cached data about a component.
   * @param componentId ID of the component that is being replaced.
   */
  componentReplaced(componentId) {
    this.engine.flush();
    this.delegate.componentReplaced?.(componentId);
  }
};

// node_modules/@angular/platform-browser/fesm2022/animations.mjs
var InjectableAnimationEngine = class _InjectableAnimationEngine extends AnimationEngine {
  // The `ApplicationRef` is injected here explicitly to force the dependency ordering.
  // Since the `ApplicationRef` should be created earlier before the `AnimationEngine`, they
  // both have `ngOnDestroy` hooks and `flush()` must be called after all views are destroyed.
  constructor(doc, driver, normalizer) {
    super(doc, driver, normalizer);
  }
  ngOnDestroy() {
    this.flush();
  }
  static \u0275fac = function InjectableAnimationEngine_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InjectableAnimationEngine)(\u0275\u0275inject(DOCUMENT), \u0275\u0275inject(AnimationDriver), \u0275\u0275inject(AnimationStyleNormalizer));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _InjectableAnimationEngine,
    factory: _InjectableAnimationEngine.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InjectableAnimationEngine, [{
    type: Injectable
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: AnimationDriver
  }, {
    type: AnimationStyleNormalizer
  }], null);
})();
function instantiateDefaultStyleNormalizer() {
  return new WebAnimationsStyleNormalizer();
}
function instantiateRendererFactory(renderer, engine, zone) {
  return new AnimationRendererFactory(renderer, engine, zone);
}
var SHARED_ANIMATION_PROVIDERS = [{
  provide: AnimationStyleNormalizer,
  useFactory: instantiateDefaultStyleNormalizer
}, {
  provide: AnimationEngine,
  useClass: InjectableAnimationEngine
}, {
  provide: RendererFactory2,
  useFactory: instantiateRendererFactory,
  deps: [DomRendererFactory2, AnimationEngine, NgZone]
}];
var BROWSER_NOOP_ANIMATIONS_PROVIDERS = [{
  provide: AnimationDriver,
  useClass: NoopAnimationDriver
}, {
  provide: ANIMATION_MODULE_TYPE,
  useValue: "NoopAnimations"
}, ...SHARED_ANIMATION_PROVIDERS];
var BROWSER_ANIMATIONS_PROVIDERS = [
  // Note: the `ngServerMode` happen inside factories to give the variable time to initialize.
  {
    provide: AnimationDriver,
    useFactory: () => false ? new NoopAnimationDriver() : new WebAnimationsDriver()
  },
  {
    provide: ANIMATION_MODULE_TYPE,
    useFactory: () => false ? "NoopAnimations" : "BrowserAnimations"
  },
  ...SHARED_ANIMATION_PROVIDERS
];
var BrowserAnimationsModule = class _BrowserAnimationsModule {
  /**
   * Configures the module based on the specified object.
   *
   * @param config Object used to configure the behavior of the `BrowserAnimationsModule`.
   * @see {@link BrowserAnimationsModuleConfig}
   *
   * @usageNotes
   * When registering the `BrowserAnimationsModule`, you can use the `withConfig`
   * function as follows:
   * ```ts
   * @NgModule({
   *   imports: [BrowserAnimationsModule.withConfig(config)]
   * })
   * class MyNgModule {}
   * ```
   */
  static withConfig(config) {
    return {
      ngModule: _BrowserAnimationsModule,
      providers: config.disableAnimations ? BROWSER_NOOP_ANIMATIONS_PROVIDERS : BROWSER_ANIMATIONS_PROVIDERS
    };
  }
  static \u0275fac = function BrowserAnimationsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserAnimationsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _BrowserAnimationsModule,
    exports: [BrowserModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: BROWSER_ANIMATIONS_PROVIDERS,
    imports: [BrowserModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();
var NoopAnimationsModule = class _NoopAnimationsModule {
  static \u0275fac = function NoopAnimationsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NoopAnimationsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _NoopAnimationsModule,
    exports: [BrowserModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
    imports: [BrowserModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoopAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/sidenav.mjs
var _c0 = ["*"];
var _c1 = ["content"];
var _c2 = [[["mat-drawer"]], [["mat-drawer-content"]], "*"];
var _c3 = ["mat-drawer", "mat-drawer-content", "*"];
function MatDrawerContainer_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275listener("click", function MatDrawerContainer_Conditional_0_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1._onBackdropClicked());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("mat-drawer-shown", ctx_r1._isShowingBackdrop());
  }
}
function MatDrawerContainer_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-drawer-content");
    \u0275\u0275projection(1, 2);
    \u0275\u0275elementEnd();
  }
}
var _c4 = [[["mat-sidenav"]], [["mat-sidenav-content"]], "*"];
var _c5 = ["mat-sidenav", "mat-sidenav-content", "*"];
function MatSidenavContainer_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275listener("click", function MatSidenavContainer_Conditional_0_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1._onBackdropClicked());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("mat-drawer-shown", ctx_r1._isShowingBackdrop());
  }
}
function MatSidenavContainer_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-sidenav-content");
    \u0275\u0275projection(1, 2);
    \u0275\u0275elementEnd();
  }
}
var _c6 = ".mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));background-color:var(--mat-sidenav-content-background-color, var(--mat-sys-background));box-sizing:border-box;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent))}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}@media(forced-colors: active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-content.mat-drawer-content-hidden{opacity:0}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));box-shadow:var(--mat-sidenav-container-elevation-shadow, none);background-color:var(--mat-sidenav-container-background-color, var(--mat-sys-surface));border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));width:var(--mat-sidenav-container-width, 360px);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}@media(forced-colors: active){.mat-drawer,[dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}}@media(forced-colors: active){[dir=rtl] .mat-drawer,.mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-transition .mat-drawer{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating){visibility:hidden;box-shadow:none}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container{display:none}.mat-drawer.mat-drawer-opened.mat-drawer-opened{transform:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto}.mat-sidenav-fixed{position:fixed}\n";
function throwMatDuplicatedDrawerError(position) {
  throw Error(`A drawer was already declared for 'position="${position}"'`);
}
var MAT_DRAWER_DEFAULT_AUTOSIZE = new InjectionToken("MAT_DRAWER_DEFAULT_AUTOSIZE", {
  providedIn: "root",
  factory: MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY
});
var MAT_DRAWER_CONTAINER = new InjectionToken("MAT_DRAWER_CONTAINER");
function MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY() {
  return false;
}
var MatDrawerContent = class _MatDrawerContent extends CdkScrollable {
  _platform = inject(Platform);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _container = inject(MatDrawerContainer);
  constructor() {
    const elementRef = inject(ElementRef);
    const scrollDispatcher = inject(ScrollDispatcher);
    const ngZone = inject(NgZone);
    super(elementRef, scrollDispatcher, ngZone);
  }
  ngAfterContentInit() {
    this._container._contentMarginChanges.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }
  /** Determines whether the content element should be hidden from the user. */
  _shouldBeHidden() {
    if (this._platform.isBrowser) {
      return false;
    }
    const {
      start,
      end
    } = this._container;
    return start != null && start.mode !== "over" && start.opened || end != null && end.mode !== "over" && end.opened;
  }
  static \u0275fac = function MatDrawerContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatDrawerContent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatDrawerContent,
    selectors: [["mat-drawer-content"]],
    hostAttrs: [1, "mat-drawer-content"],
    hostVars: 6,
    hostBindings: function MatDrawerContent_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275styleProp("margin-left", ctx._container._contentMargins.left, "px")("margin-right", ctx._container._contentMargins.right, "px");
        \u0275\u0275classProp("mat-drawer-content-hidden", ctx._shouldBeHidden());
      }
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkScrollable,
      useExisting: _MatDrawerContent
    }]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function MatDrawerContent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275projection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDrawerContent, [{
    type: Component,
    args: [{
      selector: "mat-drawer-content",
      template: "<ng-content></ng-content>",
      host: {
        "class": "mat-drawer-content",
        "[style.margin-left.px]": "_container._contentMargins.left",
        "[style.margin-right.px]": "_container._contentMargins.right",
        "[class.mat-drawer-content-hidden]": "_shouldBeHidden()"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [{
        provide: CdkScrollable,
        useExisting: MatDrawerContent
      }]
    }]
  }], () => [], null);
})();
var MatDrawer = class _MatDrawer {
  _elementRef = inject(ElementRef);
  _focusTrapFactory = inject(FocusTrapFactory);
  _focusMonitor = inject(FocusMonitor);
  _platform = inject(Platform);
  _ngZone = inject(NgZone);
  _renderer = inject(Renderer2);
  _interactivityChecker = inject(InteractivityChecker);
  _doc = inject(DOCUMENT);
  _container = inject(MAT_DRAWER_CONTAINER, {
    optional: true
  });
  _focusTrap = null;
  _elementFocusedBeforeDrawerWasOpened = null;
  _eventCleanups;
  /** Whether the view of the component has been attached. */
  _isAttached;
  /** Anchor node used to restore the drawer to its initial position. */
  _anchor;
  /** The side that the drawer is attached to. */
  get position() {
    return this._position;
  }
  set position(value) {
    value = value === "end" ? "end" : "start";
    if (value !== this._position) {
      if (this._isAttached) {
        this._updatePositionInParent(value);
      }
      this._position = value;
      this.onPositionChanged.emit();
    }
  }
  _position = "start";
  /** Mode of the drawer; one of 'over', 'push' or 'side'. */
  get mode() {
    return this._mode;
  }
  set mode(value) {
    this._mode = value;
    this._updateFocusTrapState();
    this._modeChanged.next();
  }
  _mode = "over";
  /** Whether the drawer can be closed with the escape key or by clicking on the backdrop. */
  get disableClose() {
    return this._disableClose;
  }
  set disableClose(value) {
    this._disableClose = coerceBooleanProperty(value);
  }
  _disableClose = false;
  /**
   * Whether the drawer should focus the first focusable element automatically when opened.
   * Defaults to false in when `mode` is set to `side`, otherwise defaults to `true`. If explicitly
   * enabled, focus will be moved into the sidenav in `side` mode as well.
   * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or AutoFocusTarget
   * instead.
   */
  get autoFocus() {
    const value = this._autoFocus;
    if (value == null) {
      if (this.mode === "side") {
        return "dialog";
      } else {
        return "first-tabbable";
      }
    }
    return value;
  }
  set autoFocus(value) {
    if (value === "true" || value === "false" || value == null) {
      value = coerceBooleanProperty(value);
    }
    this._autoFocus = value;
  }
  _autoFocus;
  /**
   * Whether the drawer is opened. We overload this because we trigger an event when it
   * starts or end.
   */
  get opened() {
    return this._opened();
  }
  set opened(value) {
    this.toggle(coerceBooleanProperty(value));
  }
  _opened = signal(false, ...ngDevMode ? [{
    debugName: "_opened"
  }] : []);
  /** How the sidenav was opened (keypress, mouse click etc.) */
  _openedVia;
  /** Emits whenever the drawer has started animating. */
  _animationStarted = new Subject();
  /** Emits whenever the drawer is done animating. */
  _animationEnd = new Subject();
  /** Event emitted when the drawer open state is changed. */
  openedChange = (
    // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
    new EventEmitter(
      /* isAsync */
      true
    )
  );
  /** Event emitted when the drawer has been opened. */
  _openedStream = this.openedChange.pipe(filter((o) => o), map(() => {
  }));
  /** Event emitted when the drawer has started opening. */
  openedStart = this._animationStarted.pipe(filter(() => this.opened), mapTo(void 0));
  /** Event emitted when the drawer has been closed. */
  _closedStream = this.openedChange.pipe(filter((o) => !o), map(() => {
  }));
  /** Event emitted when the drawer has started closing. */
  closedStart = this._animationStarted.pipe(filter(() => !this.opened), mapTo(void 0));
  /** Emits when the component is destroyed. */
  _destroyed = new Subject();
  /** Event emitted when the drawer's position changes. */
  // tslint:disable-next-line:no-output-on-prefix
  onPositionChanged = new EventEmitter();
  /** Reference to the inner element that contains all the content. */
  _content;
  /**
   * An observable that emits when the drawer mode changes. This is used by the drawer container to
   * to know when to when the mode changes so it can adapt the margins on the content.
   */
  _modeChanged = new Subject();
  _injector = inject(Injector);
  _changeDetectorRef = inject(ChangeDetectorRef);
  constructor() {
    this.openedChange.pipe(takeUntil(this._destroyed)).subscribe((opened) => {
      if (opened) {
        this._elementFocusedBeforeDrawerWasOpened = this._doc.activeElement;
        this._takeFocus();
      } else if (this._isFocusWithinDrawer()) {
        this._restoreFocus(this._openedVia || "program");
      }
    });
    this._ngZone.runOutsideAngular(() => {
      const element = this._elementRef.nativeElement;
      fromEvent(element, "keydown").pipe(filter((event) => {
        return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
      }), takeUntil(this._destroyed)).subscribe((event) => this._ngZone.run(() => {
        this.close();
        event.stopPropagation();
        event.preventDefault();
      }));
      this._eventCleanups = [this._renderer.listen(element, "transitionrun", this._handleTransitionEvent), this._renderer.listen(element, "transitionend", this._handleTransitionEvent), this._renderer.listen(element, "transitioncancel", this._handleTransitionEvent)];
    });
    this._animationEnd.subscribe(() => {
      this.openedChange.emit(this.opened);
    });
  }
  /**
   * Focuses the provided element. If the element is not focusable, it will add a tabIndex
   * attribute to forcefully focus it. The attribute is removed after focus is moved.
   * @param element The element to focus.
   */
  _forceFocus(element, options) {
    if (!this._interactivityChecker.isFocusable(element)) {
      element.tabIndex = -1;
      this._ngZone.runOutsideAngular(() => {
        const callback = () => {
          cleanupBlur();
          cleanupMousedown();
          element.removeAttribute("tabindex");
        };
        const cleanupBlur = this._renderer.listen(element, "blur", callback);
        const cleanupMousedown = this._renderer.listen(element, "mousedown", callback);
      });
    }
    element.focus(options);
  }
  /**
   * Focuses the first element that matches the given selector within the focus trap.
   * @param selector The CSS selector for the element to set focus to.
   */
  _focusByCssSelector(selector, options) {
    let elementToFocus = this._elementRef.nativeElement.querySelector(selector);
    if (elementToFocus) {
      this._forceFocus(elementToFocus, options);
    }
  }
  /**
   * Moves focus into the drawer. Note that this works even if
   * the focus trap is disabled in `side` mode.
   */
  _takeFocus() {
    if (!this._focusTrap) {
      return;
    }
    const element = this._elementRef.nativeElement;
    switch (this.autoFocus) {
      case false:
      case "dialog":
        return;
      case true:
      case "first-tabbable":
        afterNextRender(() => {
          const hasMovedFocus = this._focusTrap.focusInitialElement();
          if (!hasMovedFocus && typeof element.focus === "function") {
            element.focus();
          }
        }, {
          injector: this._injector
        });
        break;
      case "first-heading":
        this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
        break;
      default:
        this._focusByCssSelector(this.autoFocus);
        break;
    }
  }
  /**
   * Restores focus to the element that was originally focused when the drawer opened.
   * If no element was focused at that time, the focus will be restored to the drawer.
   */
  _restoreFocus(focusOrigin) {
    if (this.autoFocus === "dialog") {
      return;
    }
    if (this._elementFocusedBeforeDrawerWasOpened) {
      this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, focusOrigin);
    } else {
      this._elementRef.nativeElement.blur();
    }
    this._elementFocusedBeforeDrawerWasOpened = null;
  }
  /** Whether focus is currently within the drawer. */
  _isFocusWithinDrawer() {
    const activeEl = this._doc.activeElement;
    return !!activeEl && this._elementRef.nativeElement.contains(activeEl);
  }
  ngAfterViewInit() {
    this._isAttached = true;
    if (this._position === "end") {
      this._updatePositionInParent("end");
    }
    if (this._platform.isBrowser) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
      this._updateFocusTrapState();
    }
  }
  ngOnDestroy() {
    this._eventCleanups.forEach((cleanup) => cleanup());
    this._focusTrap?.destroy();
    this._anchor?.remove();
    this._anchor = null;
    this._animationStarted.complete();
    this._animationEnd.complete();
    this._modeChanged.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }
  /**
   * Open the drawer.
   * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  open(openedVia) {
    return this.toggle(true, openedVia);
  }
  /** Close the drawer. */
  close() {
    return this.toggle(false);
  }
  /** Closes the drawer with context that the backdrop was clicked. */
  _closeViaBackdropClick() {
    return this._setOpen(
      /* isOpen */
      false,
      /* restoreFocus */
      true,
      "mouse"
    );
  }
  /**
   * Toggle this drawer.
   * @param isOpen Whether the drawer should be open.
   * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  toggle(isOpen = !this.opened, openedVia) {
    if (isOpen && openedVia) {
      this._openedVia = openedVia;
    }
    const result = this._setOpen(
      isOpen,
      /* restoreFocus */
      !isOpen && this._isFocusWithinDrawer(),
      this._openedVia || "program"
    );
    if (!isOpen) {
      this._openedVia = null;
    }
    return result;
  }
  /**
   * Toggles the opened state of the drawer.
   * @param isOpen Whether the drawer should open or close.
   * @param restoreFocus Whether focus should be restored on close.
   * @param focusOrigin Origin to use when restoring focus.
   */
  _setOpen(isOpen, restoreFocus, focusOrigin) {
    if (isOpen === this.opened) {
      return Promise.resolve(isOpen ? "open" : "close");
    }
    this._opened.set(isOpen);
    if (this._container?._transitionsEnabled) {
      this._setIsAnimating(true);
    } else {
      setTimeout(() => {
        this._animationStarted.next();
        this._animationEnd.next();
      });
    }
    this._elementRef.nativeElement.classList.toggle("mat-drawer-opened", isOpen);
    if (!isOpen && restoreFocus) {
      this._restoreFocus(focusOrigin);
    }
    this._changeDetectorRef.markForCheck();
    this._updateFocusTrapState();
    return new Promise((resolve) => {
      this.openedChange.pipe(take(1)).subscribe((open) => resolve(open ? "open" : "close"));
    });
  }
  /** Toggles whether the drawer is currently animating. */
  _setIsAnimating(isAnimating) {
    this._elementRef.nativeElement.classList.toggle("mat-drawer-animating", isAnimating);
  }
  _getWidth() {
    return this._elementRef.nativeElement.offsetWidth || 0;
  }
  /** Updates the enabled state of the focus trap. */
  _updateFocusTrapState() {
    if (this._focusTrap) {
      this._focusTrap.enabled = !!this._container?.hasBackdrop && this.opened;
    }
  }
  /**
   * Updates the position of the drawer in the DOM. We need to move the element around ourselves
   * when it's in the `end` position so that it comes after the content and the visual order
   * matches the tab order. We also need to be able to move it back to `start` if the sidenav
   * started off as `end` and was changed to `start`.
   */
  _updatePositionInParent(newPosition) {
    if (!this._platform.isBrowser) {
      return;
    }
    const element = this._elementRef.nativeElement;
    const parent = element.parentNode;
    if (newPosition === "end") {
      if (!this._anchor) {
        this._anchor = this._doc.createComment("mat-drawer-anchor");
        parent.insertBefore(this._anchor, element);
      }
      parent.appendChild(element);
    } else if (this._anchor) {
      this._anchor.parentNode.insertBefore(element, this._anchor);
    }
  }
  /** Event handler for animation events. */
  _handleTransitionEvent = (event) => {
    const element = this._elementRef.nativeElement;
    if (event.target === element) {
      this._ngZone.run(() => {
        if (event.type === "transitionrun") {
          this._animationStarted.next(event);
        } else {
          if (event.type === "transitionend") {
            this._setIsAnimating(false);
          }
          this._animationEnd.next(event);
        }
      });
    }
  };
  static \u0275fac = function MatDrawer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatDrawer)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatDrawer,
    selectors: [["mat-drawer"]],
    viewQuery: function MatDrawer_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c1, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._content = _t.first);
      }
    },
    hostAttrs: [1, "mat-drawer"],
    hostVars: 12,
    hostBindings: function MatDrawer_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("align", null)("tabIndex", ctx.mode !== "side" ? "-1" : null);
        \u0275\u0275styleProp("visibility", !ctx._container && !ctx.opened ? "hidden" : null);
        \u0275\u0275classProp("mat-drawer-end", ctx.position === "end")("mat-drawer-over", ctx.mode === "over")("mat-drawer-push", ctx.mode === "push")("mat-drawer-side", ctx.mode === "side");
      }
    },
    inputs: {
      position: "position",
      mode: "mode",
      disableClose: "disableClose",
      autoFocus: "autoFocus",
      opened: "opened"
    },
    outputs: {
      openedChange: "openedChange",
      _openedStream: "opened",
      openedStart: "openedStart",
      _closedStream: "closed",
      closedStart: "closedStart",
      onPositionChanged: "positionChanged"
    },
    exportAs: ["matDrawer"],
    ngContentSelectors: _c0,
    decls: 3,
    vars: 0,
    consts: [["content", ""], ["cdkScrollable", "", 1, "mat-drawer-inner-container"]],
    template: function MatDrawer_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275elementStart(0, "div", 1, 0);
        \u0275\u0275projection(2);
        \u0275\u0275elementEnd();
      }
    },
    dependencies: [CdkScrollable],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDrawer, [{
    type: Component,
    args: [{
      selector: "mat-drawer",
      exportAs: "matDrawer",
      host: {
        "class": "mat-drawer",
        // must prevent the browser from aligning text based on value
        "[attr.align]": "null",
        "[class.mat-drawer-end]": 'position === "end"',
        "[class.mat-drawer-over]": 'mode === "over"',
        "[class.mat-drawer-push]": 'mode === "push"',
        "[class.mat-drawer-side]": 'mode === "side"',
        // The styles that render the sidenav off-screen come from the drawer container. Prior to #30235
        // this was also done by the animations module which some internal tests seem to depend on.
        // Simulate it by toggling the `hidden` attribute instead.
        "[style.visibility]": '(!_container && !opened) ? "hidden" : null',
        // The sidenav container should not be focused on when used in side mode. See b/286459024 for
        // reference. Updates tabIndex of drawer/container to default to null if in side mode.
        "[attr.tabIndex]": '(mode !== "side") ? "-1" : null'
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      imports: [CdkScrollable],
      template: '<div class="mat-drawer-inner-container" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n'
    }]
  }], () => [], {
    position: [{
      type: Input
    }],
    mode: [{
      type: Input
    }],
    disableClose: [{
      type: Input
    }],
    autoFocus: [{
      type: Input
    }],
    opened: [{
      type: Input
    }],
    openedChange: [{
      type: Output
    }],
    _openedStream: [{
      type: Output,
      args: ["opened"]
    }],
    openedStart: [{
      type: Output
    }],
    _closedStream: [{
      type: Output,
      args: ["closed"]
    }],
    closedStart: [{
      type: Output
    }],
    onPositionChanged: [{
      type: Output,
      args: ["positionChanged"]
    }],
    _content: [{
      type: ViewChild,
      args: ["content"]
    }]
  });
})();
var MatDrawerContainer = class _MatDrawerContainer {
  _dir = inject(Directionality, {
    optional: true
  });
  _element = inject(ElementRef);
  _ngZone = inject(NgZone);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _animationDisabled = _animationsDisabled();
  _transitionsEnabled = false;
  /** All drawers in the container. Includes drawers from inside nested containers. */
  _allDrawers;
  /** Drawers that belong to this container. */
  _drawers = new QueryList();
  _content;
  _userContent;
  /** The drawer child with the `start` position. */
  get start() {
    return this._start;
  }
  /** The drawer child with the `end` position. */
  get end() {
    return this._end;
  }
  /**
   * Whether to automatically resize the container whenever
   * the size of any of its drawers changes.
   *
   * **Use at your own risk!** Enabling this option can cause layout thrashing by measuring
   * the drawers on every change detection cycle. Can be configured globally via the
   * `MAT_DRAWER_DEFAULT_AUTOSIZE` token.
   */
  get autosize() {
    return this._autosize;
  }
  set autosize(value) {
    this._autosize = coerceBooleanProperty(value);
  }
  _autosize = inject(MAT_DRAWER_DEFAULT_AUTOSIZE);
  /**
   * Whether the drawer container should have a backdrop while one of the sidenavs is open.
   * If explicitly set to `true`, the backdrop will be enabled for drawers in the `side`
   * mode as well.
   */
  get hasBackdrop() {
    return this._drawerHasBackdrop(this._start) || this._drawerHasBackdrop(this._end);
  }
  set hasBackdrop(value) {
    this._backdropOverride = value == null ? null : coerceBooleanProperty(value);
  }
  _backdropOverride;
  /** Event emitted when the drawer backdrop is clicked. */
  backdropClick = new EventEmitter();
  /** The drawer at the start/end position, independent of direction. */
  _start;
  _end;
  /**
   * The drawer at the left/right. When direction changes, these will change as well.
   * They're used as aliases for the above to set the left/right style properly.
   * In LTR, _left == _start and _right == _end.
   * In RTL, _left == _end and _right == _start.
   */
  _left;
  _right;
  /** Emits when the component is destroyed. */
  _destroyed = new Subject();
  /** Emits on every ngDoCheck. Used for debouncing reflows. */
  _doCheckSubject = new Subject();
  /**
   * Margins to be applied to the content. These are used to push / shrink the drawer content when a
   * drawer is open. We use margin rather than transform even for push mode because transform breaks
   * fixed position elements inside of the transformed element.
   */
  _contentMargins = {
    left: null,
    right: null
  };
  _contentMarginChanges = new Subject();
  /** Reference to the CdkScrollable instance that wraps the scrollable content. */
  get scrollable() {
    return this._userContent || this._content;
  }
  _injector = inject(Injector);
  constructor() {
    const platform = inject(Platform);
    const viewportRuler = inject(ViewportRuler);
    this._dir?.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._validateDrawers();
      this.updateContentMargins();
    });
    viewportRuler.change().pipe(takeUntil(this._destroyed)).subscribe(() => this.updateContentMargins());
    if (!this._animationDisabled && platform.isBrowser) {
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this._element.nativeElement.classList.add("mat-drawer-transition");
          this._transitionsEnabled = true;
        }, 200);
      });
    }
  }
  ngAfterContentInit() {
    this._allDrawers.changes.pipe(startWith(this._allDrawers), takeUntil(this._destroyed)).subscribe((drawer) => {
      this._drawers.reset(drawer.filter((item) => !item._container || item._container === this));
      this._drawers.notifyOnChanges();
    });
    this._drawers.changes.pipe(startWith(null)).subscribe(() => {
      this._validateDrawers();
      this._drawers.forEach((drawer) => {
        this._watchDrawerToggle(drawer);
        this._watchDrawerPosition(drawer);
        this._watchDrawerMode(drawer);
      });
      if (!this._drawers.length || this._isDrawerOpen(this._start) || this._isDrawerOpen(this._end)) {
        this.updateContentMargins();
      }
      this._changeDetectorRef.markForCheck();
    });
    this._ngZone.runOutsideAngular(() => {
      this._doCheckSubject.pipe(
        debounceTime(10),
        // Arbitrary debounce time, less than a frame at 60fps
        takeUntil(this._destroyed)
      ).subscribe(() => this.updateContentMargins());
    });
  }
  ngOnDestroy() {
    this._contentMarginChanges.complete();
    this._doCheckSubject.complete();
    this._drawers.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }
  /** Calls `open` of both start and end drawers */
  open() {
    this._drawers.forEach((drawer) => drawer.open());
  }
  /** Calls `close` of both start and end drawers */
  close() {
    this._drawers.forEach((drawer) => drawer.close());
  }
  /**
   * Recalculates and updates the inline styles for the content. Note that this should be used
   * sparingly, because it causes a reflow.
   */
  updateContentMargins() {
    let left = 0;
    let right = 0;
    if (this._left && this._left.opened) {
      if (this._left.mode == "side") {
        left += this._left._getWidth();
      } else if (this._left.mode == "push") {
        const width = this._left._getWidth();
        left += width;
        right -= width;
      }
    }
    if (this._right && this._right.opened) {
      if (this._right.mode == "side") {
        right += this._right._getWidth();
      } else if (this._right.mode == "push") {
        const width = this._right._getWidth();
        right += width;
        left -= width;
      }
    }
    left = left || null;
    right = right || null;
    if (left !== this._contentMargins.left || right !== this._contentMargins.right) {
      this._contentMargins = {
        left,
        right
      };
      this._ngZone.run(() => this._contentMarginChanges.next(this._contentMargins));
    }
  }
  ngDoCheck() {
    if (this._autosize && this._isPushed()) {
      this._ngZone.runOutsideAngular(() => this._doCheckSubject.next());
    }
  }
  /**
   * Subscribes to drawer events in order to set a class on the main container element when the
   * drawer is open and the backdrop is visible. This ensures any overflow on the container element
   * is properly hidden.
   */
  _watchDrawerToggle(drawer) {
    drawer._animationStarted.pipe(takeUntil(this._drawers.changes)).subscribe(() => {
      this.updateContentMargins();
      this._changeDetectorRef.markForCheck();
    });
    if (drawer.mode !== "side") {
      drawer.openedChange.pipe(takeUntil(this._drawers.changes)).subscribe(() => this._setContainerClass(drawer.opened));
    }
  }
  /**
   * Subscribes to drawer onPositionChanged event in order to
   * re-validate drawers when the position changes.
   */
  _watchDrawerPosition(drawer) {
    drawer.onPositionChanged.pipe(takeUntil(this._drawers.changes)).subscribe(() => {
      afterNextRender({
        read: () => this._validateDrawers()
      }, {
        injector: this._injector
      });
    });
  }
  /** Subscribes to changes in drawer mode so we can run change detection. */
  _watchDrawerMode(drawer) {
    drawer._modeChanged.pipe(takeUntil(merge(this._drawers.changes, this._destroyed))).subscribe(() => {
      this.updateContentMargins();
      this._changeDetectorRef.markForCheck();
    });
  }
  /** Toggles the 'mat-drawer-opened' class on the main 'mat-drawer-container' element. */
  _setContainerClass(isAdd) {
    const classList = this._element.nativeElement.classList;
    const className = "mat-drawer-container-has-open";
    if (isAdd) {
      classList.add(className);
    } else {
      classList.remove(className);
    }
  }
  /** Validate the state of the drawer children components. */
  _validateDrawers() {
    this._start = this._end = null;
    this._drawers.forEach((drawer) => {
      if (drawer.position == "end") {
        if (this._end != null && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throwMatDuplicatedDrawerError("end");
        }
        this._end = drawer;
      } else {
        if (this._start != null && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throwMatDuplicatedDrawerError("start");
        }
        this._start = drawer;
      }
    });
    this._right = this._left = null;
    if (this._dir && this._dir.value === "rtl") {
      this._left = this._end;
      this._right = this._start;
    } else {
      this._left = this._start;
      this._right = this._end;
    }
  }
  /** Whether the container is being pushed to the side by one of the drawers. */
  _isPushed() {
    return this._isDrawerOpen(this._start) && this._start.mode != "over" || this._isDrawerOpen(this._end) && this._end.mode != "over";
  }
  _onBackdropClicked() {
    this.backdropClick.emit();
    this._closeModalDrawersViaBackdrop();
  }
  _closeModalDrawersViaBackdrop() {
    [this._start, this._end].filter((drawer) => drawer && !drawer.disableClose && this._drawerHasBackdrop(drawer)).forEach((drawer) => drawer._closeViaBackdropClick());
  }
  _isShowingBackdrop() {
    return this._isDrawerOpen(this._start) && this._drawerHasBackdrop(this._start) || this._isDrawerOpen(this._end) && this._drawerHasBackdrop(this._end);
  }
  _isDrawerOpen(drawer) {
    return drawer != null && drawer.opened;
  }
  // Whether argument drawer should have a backdrop when it opens
  _drawerHasBackdrop(drawer) {
    if (this._backdropOverride == null) {
      return !!drawer && drawer.mode !== "side";
    }
    return this._backdropOverride;
  }
  static \u0275fac = function MatDrawerContainer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatDrawerContainer)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatDrawerContainer,
    selectors: [["mat-drawer-container"]],
    contentQueries: function MatDrawerContainer_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, MatDrawerContent, 5);
        \u0275\u0275contentQuery(dirIndex, MatDrawer, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._content = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._allDrawers = _t);
      }
    },
    viewQuery: function MatDrawerContainer_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(MatDrawerContent, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._userContent = _t.first);
      }
    },
    hostAttrs: [1, "mat-drawer-container"],
    hostVars: 2,
    hostBindings: function MatDrawerContainer_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mat-drawer-container-explicit-backdrop", ctx._backdropOverride);
      }
    },
    inputs: {
      autosize: "autosize",
      hasBackdrop: "hasBackdrop"
    },
    outputs: {
      backdropClick: "backdropClick"
    },
    exportAs: ["matDrawerContainer"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_DRAWER_CONTAINER,
      useExisting: _MatDrawerContainer
    }])],
    ngContentSelectors: _c3,
    decls: 4,
    vars: 2,
    consts: [[1, "mat-drawer-backdrop", 3, "mat-drawer-shown"], [1, "mat-drawer-backdrop", 3, "click"]],
    template: function MatDrawerContainer_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c2);
        \u0275\u0275conditionalCreate(0, MatDrawerContainer_Conditional_0_Template, 1, 2, "div", 0);
        \u0275\u0275projection(1);
        \u0275\u0275projection(2, 1);
        \u0275\u0275conditionalCreate(3, MatDrawerContainer_Conditional_3_Template, 2, 0, "mat-drawer-content");
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.hasBackdrop ? 0 : -1);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(!ctx._content ? 3 : -1);
      }
    },
    dependencies: [MatDrawerContent],
    styles: [".mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));background-color:var(--mat-sidenav-content-background-color, var(--mat-sys-background));box-sizing:border-box;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent))}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}@media(forced-colors: active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-content.mat-drawer-content-hidden{opacity:0}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));box-shadow:var(--mat-sidenav-container-elevation-shadow, none);background-color:var(--mat-sidenav-container-background-color, var(--mat-sys-surface));border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));width:var(--mat-sidenav-container-width, 360px);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}@media(forced-colors: active){.mat-drawer,[dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}}@media(forced-colors: active){[dir=rtl] .mat-drawer,.mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-transition .mat-drawer{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating){visibility:hidden;box-shadow:none}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container{display:none}.mat-drawer.mat-drawer-opened.mat-drawer-opened{transform:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto}.mat-sidenav-fixed{position:fixed}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDrawerContainer, [{
    type: Component,
    args: [{
      selector: "mat-drawer-container",
      exportAs: "matDrawerContainer",
      host: {
        "class": "mat-drawer-container",
        "[class.mat-drawer-container-explicit-backdrop]": "_backdropOverride"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [{
        provide: MAT_DRAWER_CONTAINER,
        useExisting: MatDrawerContainer
      }],
      imports: [MatDrawerContent],
      template: '@if (hasBackdrop) {\n  <div class="mat-drawer-backdrop" (click)="_onBackdropClicked()"\n       [class.mat-drawer-shown]="_isShowingBackdrop()"></div>\n}\n\n<ng-content select="mat-drawer"></ng-content>\n\n<ng-content select="mat-drawer-content">\n</ng-content>\n\n@if (!_content) {\n  <mat-drawer-content>\n    <ng-content></ng-content>\n  </mat-drawer-content>\n}\n',
      styles: [".mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));background-color:var(--mat-sidenav-content-background-color, var(--mat-sys-background));box-sizing:border-box;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent))}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}@media(forced-colors: active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-content.mat-drawer-content-hidden{opacity:0}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));box-shadow:var(--mat-sidenav-container-elevation-shadow, none);background-color:var(--mat-sidenav-container-background-color, var(--mat-sys-surface));border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));width:var(--mat-sidenav-container-width, 360px);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}@media(forced-colors: active){.mat-drawer,[dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}}@media(forced-colors: active){[dir=rtl] .mat-drawer,.mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-transition .mat-drawer{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating){visibility:hidden;box-shadow:none}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container{display:none}.mat-drawer.mat-drawer-opened.mat-drawer-opened{transform:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto}.mat-sidenav-fixed{position:fixed}\n"]
    }]
  }], () => [], {
    _allDrawers: [{
      type: ContentChildren,
      args: [MatDrawer, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }],
    _content: [{
      type: ContentChild,
      args: [MatDrawerContent]
    }],
    _userContent: [{
      type: ViewChild,
      args: [MatDrawerContent]
    }],
    autosize: [{
      type: Input
    }],
    hasBackdrop: [{
      type: Input
    }],
    backdropClick: [{
      type: Output
    }]
  });
})();
var MatSidenavContent = class _MatSidenavContent extends MatDrawerContent {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatSidenavContent_BaseFactory;
    return function MatSidenavContent_Factory(__ngFactoryType__) {
      return (\u0275MatSidenavContent_BaseFactory || (\u0275MatSidenavContent_BaseFactory = \u0275\u0275getInheritedFactory(_MatSidenavContent)))(__ngFactoryType__ || _MatSidenavContent);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatSidenavContent,
    selectors: [["mat-sidenav-content"]],
    hostAttrs: [1, "mat-drawer-content", "mat-sidenav-content"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkScrollable,
      useExisting: _MatSidenavContent
    }]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function MatSidenavContent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275projection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSidenavContent, [{
    type: Component,
    args: [{
      selector: "mat-sidenav-content",
      template: "<ng-content></ng-content>",
      host: {
        "class": "mat-drawer-content mat-sidenav-content"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [{
        provide: CdkScrollable,
        useExisting: MatSidenavContent
      }]
    }]
  }], null, null);
})();
var MatSidenav = class _MatSidenav extends MatDrawer {
  /** Whether the sidenav is fixed in the viewport. */
  get fixedInViewport() {
    return this._fixedInViewport;
  }
  set fixedInViewport(value) {
    this._fixedInViewport = coerceBooleanProperty(value);
  }
  _fixedInViewport = false;
  /**
   * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
   * mode.
   */
  get fixedTopGap() {
    return this._fixedTopGap;
  }
  set fixedTopGap(value) {
    this._fixedTopGap = coerceNumberProperty(value);
  }
  _fixedTopGap = 0;
  /**
   * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
   * fixed mode.
   */
  get fixedBottomGap() {
    return this._fixedBottomGap;
  }
  set fixedBottomGap(value) {
    this._fixedBottomGap = coerceNumberProperty(value);
  }
  _fixedBottomGap = 0;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatSidenav_BaseFactory;
    return function MatSidenav_Factory(__ngFactoryType__) {
      return (\u0275MatSidenav_BaseFactory || (\u0275MatSidenav_BaseFactory = \u0275\u0275getInheritedFactory(_MatSidenav)))(__ngFactoryType__ || _MatSidenav);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatSidenav,
    selectors: [["mat-sidenav"]],
    hostAttrs: [1, "mat-drawer", "mat-sidenav"],
    hostVars: 16,
    hostBindings: function MatSidenav_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("tabIndex", ctx.mode !== "side" ? "-1" : null)("align", null);
        \u0275\u0275styleProp("top", ctx.fixedInViewport ? ctx.fixedTopGap : null, "px")("bottom", ctx.fixedInViewport ? ctx.fixedBottomGap : null, "px");
        \u0275\u0275classProp("mat-drawer-end", ctx.position === "end")("mat-drawer-over", ctx.mode === "over")("mat-drawer-push", ctx.mode === "push")("mat-drawer-side", ctx.mode === "side")("mat-sidenav-fixed", ctx.fixedInViewport);
      }
    },
    inputs: {
      fixedInViewport: "fixedInViewport",
      fixedTopGap: "fixedTopGap",
      fixedBottomGap: "fixedBottomGap"
    },
    exportAs: ["matSidenav"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MatDrawer,
      useExisting: _MatSidenav
    }]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 3,
    vars: 0,
    consts: [["content", ""], ["cdkScrollable", "", 1, "mat-drawer-inner-container"]],
    template: function MatSidenav_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275elementStart(0, "div", 1, 0);
        \u0275\u0275projection(2);
        \u0275\u0275elementEnd();
      }
    },
    dependencies: [CdkScrollable],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSidenav, [{
    type: Component,
    args: [{
      selector: "mat-sidenav",
      exportAs: "matSidenav",
      host: {
        "class": "mat-drawer mat-sidenav",
        // The sidenav container should not be focused on when used in side mode. See b/286459024 for
        // reference. Updates tabIndex of drawer/container to default to null if in side mode.
        "[attr.tabIndex]": '(mode !== "side") ? "-1" : null',
        // must prevent the browser from aligning text based on value
        "[attr.align]": "null",
        "[class.mat-drawer-end]": 'position === "end"',
        "[class.mat-drawer-over]": 'mode === "over"',
        "[class.mat-drawer-push]": 'mode === "push"',
        "[class.mat-drawer-side]": 'mode === "side"',
        "[class.mat-sidenav-fixed]": "fixedInViewport",
        "[style.top.px]": "fixedInViewport ? fixedTopGap : null",
        "[style.bottom.px]": "fixedInViewport ? fixedBottomGap : null"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      imports: [CdkScrollable],
      providers: [{
        provide: MatDrawer,
        useExisting: MatSidenav
      }],
      template: '<div class="mat-drawer-inner-container" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n'
    }]
  }], null, {
    fixedInViewport: [{
      type: Input
    }],
    fixedTopGap: [{
      type: Input
    }],
    fixedBottomGap: [{
      type: Input
    }]
  });
})();
var MatSidenavContainer = class _MatSidenavContainer extends MatDrawerContainer {
  _allDrawers = void 0;
  // We need an initializer here to avoid a TS error.
  _content = void 0;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatSidenavContainer_BaseFactory;
    return function MatSidenavContainer_Factory(__ngFactoryType__) {
      return (\u0275MatSidenavContainer_BaseFactory || (\u0275MatSidenavContainer_BaseFactory = \u0275\u0275getInheritedFactory(_MatSidenavContainer)))(__ngFactoryType__ || _MatSidenavContainer);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatSidenavContainer,
    selectors: [["mat-sidenav-container"]],
    contentQueries: function MatSidenavContainer_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, MatSidenavContent, 5);
        \u0275\u0275contentQuery(dirIndex, MatSidenav, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._content = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._allDrawers = _t);
      }
    },
    hostAttrs: [1, "mat-drawer-container", "mat-sidenav-container"],
    hostVars: 2,
    hostBindings: function MatSidenavContainer_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mat-drawer-container-explicit-backdrop", ctx._backdropOverride);
      }
    },
    exportAs: ["matSidenavContainer"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_DRAWER_CONTAINER,
      useExisting: _MatSidenavContainer
    }, {
      provide: MatDrawerContainer,
      useExisting: _MatSidenavContainer
    }]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c5,
    decls: 4,
    vars: 2,
    consts: [[1, "mat-drawer-backdrop", 3, "mat-drawer-shown"], [1, "mat-drawer-backdrop", 3, "click"]],
    template: function MatSidenavContainer_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c4);
        \u0275\u0275conditionalCreate(0, MatSidenavContainer_Conditional_0_Template, 1, 2, "div", 0);
        \u0275\u0275projection(1);
        \u0275\u0275projection(2, 1);
        \u0275\u0275conditionalCreate(3, MatSidenavContainer_Conditional_3_Template, 2, 0, "mat-sidenav-content");
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.hasBackdrop ? 0 : -1);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(!ctx._content ? 3 : -1);
      }
    },
    dependencies: [MatSidenavContent],
    styles: [_c6],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSidenavContainer, [{
    type: Component,
    args: [{
      selector: "mat-sidenav-container",
      exportAs: "matSidenavContainer",
      host: {
        "class": "mat-drawer-container mat-sidenav-container",
        "[class.mat-drawer-container-explicit-backdrop]": "_backdropOverride"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [{
        provide: MAT_DRAWER_CONTAINER,
        useExisting: MatSidenavContainer
      }, {
        provide: MatDrawerContainer,
        useExisting: MatSidenavContainer
      }],
      imports: [MatSidenavContent],
      template: '@if (hasBackdrop) {\n  <div class="mat-drawer-backdrop" (click)="_onBackdropClicked()"\n       [class.mat-drawer-shown]="_isShowingBackdrop()"></div>\n}\n\n<ng-content select="mat-sidenav"></ng-content>\n\n<ng-content select="mat-sidenav-content">\n</ng-content>\n\n@if (!_content) {\n  <mat-sidenav-content>\n    <ng-content></ng-content>\n  </mat-sidenav-content>\n}\n',
      styles: [".mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));background-color:var(--mat-sidenav-content-background-color, var(--mat-sys-background));box-sizing:border-box;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent))}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}@media(forced-colors: active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-content.mat-drawer-content-hidden{opacity:0}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));box-shadow:var(--mat-sidenav-container-elevation-shadow, none);background-color:var(--mat-sidenav-container-background-color, var(--mat-sys-surface));border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));width:var(--mat-sidenav-container-width, 360px);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}@media(forced-colors: active){.mat-drawer,[dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}}@media(forced-colors: active){[dir=rtl] .mat-drawer,.mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-left-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-bottom-right-radius:var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-transition .mat-drawer{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating){visibility:hidden;box-shadow:none}.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container{display:none}.mat-drawer.mat-drawer-opened.mat-drawer-opened{transform:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color, transparent);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color, transparent);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto}.mat-sidenav-fixed{position:fixed}\n"]
    }]
  }], null, {
    _allDrawers: [{
      type: ContentChildren,
      args: [MatSidenav, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }],
    _content: [{
      type: ContentChild,
      args: [MatSidenavContent]
    }]
  });
})();
var MatSidenavModule = class _MatSidenavModule {
  static \u0275fac = function MatSidenavModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSidenavModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatSidenavModule,
    imports: [MatCommonModule, CdkScrollableModule, MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent],
    exports: [CdkScrollableModule, MatCommonModule, MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatCommonModule, CdkScrollableModule, CdkScrollableModule, MatCommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSidenavModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, CdkScrollableModule, MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent],
      exports: [CdkScrollableModule, MatCommonModule, MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav, MatSidenavContainer, MatSidenavContent]
    }]
  }], null, null);
})();

// src/app/core/services/notification.service.ts
var NotificationService = class _NotificationService {
  http;
  apiUrl = `${environment.apiUrl}/notifications`;
  storageKey = "bpbf_read_notifications_v1";
  notificationsSubject = new BehaviorSubject([]);
  notifications$ = this.notificationsSubject.asObservable();
  constructor(http) {
    this.http = http;
    this.refresh();
    setInterval(() => this.refresh(), 6e4);
  }
  get unreadCount() {
    return this.notificationsSubject.value.filter((n) => !n.read).length;
  }
  refresh() {
    this.http.get(this.apiUrl).subscribe({
      next: (items) => {
        const readIds = this.getReadIds();
        const enriched = (items || []).map((item) => __spreadProps(__spreadValues({}, item), {
          read: item.read || readIds.has(item.id)
        }));
        this.notificationsSubject.next(enriched);
      },
      error: (err) => {
        console.warn("[NotificationService] Impossible de r\xE9cup\xE9rer les notifications backend:", err);
      }
    });
  }
  markAllAsRead() {
    const current = this.notificationsSubject.value;
    const readIds = this.getReadIds();
    current.forEach((n) => readIds.add(n.id));
    this.saveReadIds(readIds);
    const updated = current.map((n) => __spreadProps(__spreadValues({}, n), { read: true }));
    this.notificationsSubject.next(updated);
  }
  markAsRead(id) {
    const readIds = this.getReadIds();
    readIds.add(id);
    this.saveReadIds(readIds);
    const updated = this.notificationsSubject.value.map((n) => n.id === id ? __spreadProps(__spreadValues({}, n), { read: true }) : n);
    this.notificationsSubject.next(updated);
  }
  getReadIds() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? new Set(JSON.parse(raw)) : /* @__PURE__ */ new Set();
    } catch {
      return /* @__PURE__ */ new Set();
    }
  }
  saveReadIds(ids) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(ids)));
    } catch {
    }
  }
  static \u0275fac = function NotificationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NotificationService, factory: _NotificationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/core/services/theme.service.ts
var ThemeService = class _ThemeService {
  STORAGE_KEY = "sgrh-theme";
  themeSubject = new BehaviorSubject(this.loadSavedTheme());
  theme$ = this.themeSubject.asObservable();
  get isDark() {
    return this.themeSubject.value === "dark";
  }
  get current() {
    return this.themeSubject.value;
  }
  constructor() {
    this.applyTheme(this.themeSubject.value);
  }
  toggle() {
    const next = this.themeSubject.value === "light" ? "dark" : "light";
    this.setTheme(next);
  }
  setTheme(theme) {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }
  applyTheme(theme) {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark-theme");
    } else {
      html.classList.remove("dark-theme");
    }
  }
  loadSavedTheme() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved === "dark" || saved === "light" ? saved : "light";
  }
  static \u0275fac = function ThemeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// node_modules/@angular/material/fesm2022/toolbar.mjs
var _c02 = ["*", [["mat-toolbar-row"]]];
var _c12 = ["*", "mat-toolbar-row"];
var MatToolbarRow = class _MatToolbarRow {
  static \u0275fac = function MatToolbarRow_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatToolbarRow)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatToolbarRow,
    selectors: [["mat-toolbar-row"]],
    hostAttrs: [1, "mat-toolbar-row"],
    exportAs: ["matToolbarRow"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatToolbarRow, [{
    type: Directive,
    args: [{
      selector: "mat-toolbar-row",
      exportAs: "matToolbarRow",
      host: {
        "class": "mat-toolbar-row"
      }
    }]
  }], null, null);
})();
var MatToolbar = class _MatToolbar {
  _elementRef = inject(ElementRef);
  _platform = inject(Platform);
  _document = inject(DOCUMENT);
  // TODO: should be typed as `ThemePalette` but internal apps pass in arbitrary strings.
  /**
   * Theme color of the toolbar. This API is supported in M2 themes only, it has
   * no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/toolbar/styling.
   *
   * For information on applying color variants in M3, see
   * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
   */
  color;
  /** Reference to all toolbar row elements that have been projected. */
  _toolbarRows;
  constructor() {
  }
  ngAfterViewInit() {
    if (this._platform.isBrowser) {
      this._checkToolbarMixedModes();
      this._toolbarRows.changes.subscribe(() => this._checkToolbarMixedModes());
    }
  }
  /**
   * Throws an exception when developers are attempting to combine the different toolbar row modes.
   */
  _checkToolbarMixedModes() {
    if (this._toolbarRows.length && (typeof ngDevMode === "undefined" || ngDevMode)) {
      const isCombinedUsage = Array.from(this._elementRef.nativeElement.childNodes).filter((node) => !(node.classList && node.classList.contains("mat-toolbar-row"))).filter((node) => node.nodeType !== (this._document ? this._document.COMMENT_NODE : 8)).some((node) => !!(node.textContent && node.textContent.trim()));
      if (isCombinedUsage) {
        throwToolbarMixedModesError();
      }
    }
  }
  static \u0275fac = function MatToolbar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatToolbar)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatToolbar,
    selectors: [["mat-toolbar"]],
    contentQueries: function MatToolbar_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, MatToolbarRow, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._toolbarRows = _t);
      }
    },
    hostAttrs: [1, "mat-toolbar"],
    hostVars: 6,
    hostBindings: function MatToolbar_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classMap(ctx.color ? "mat-" + ctx.color : "");
        \u0275\u0275classProp("mat-toolbar-multiple-rows", ctx._toolbarRows.length > 0)("mat-toolbar-single-row", ctx._toolbarRows.length === 0);
      }
    },
    inputs: {
      color: "color"
    },
    exportAs: ["matToolbar"],
    ngContentSelectors: _c12,
    decls: 2,
    vars: 0,
    template: function MatToolbar_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c02);
        \u0275\u0275projection(0);
        \u0275\u0275projection(1, 1);
      }
    },
    styles: [".mat-toolbar{background:var(--mat-toolbar-container-background-color, var(--mat-sys-surface));color:var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface))}.mat-toolbar,.mat-toolbar h1,.mat-toolbar h2,.mat-toolbar h3,.mat-toolbar h4,.mat-toolbar h5,.mat-toolbar h6{font-family:var(--mat-toolbar-title-text-font, var(--mat-sys-title-large-font));font-size:var(--mat-toolbar-title-text-size, var(--mat-sys-title-large-size));line-height:var(--mat-toolbar-title-text-line-height, var(--mat-sys-title-large-line-height));font-weight:var(--mat-toolbar-title-text-weight, var(--mat-sys-title-large-weight));letter-spacing:var(--mat-toolbar-title-text-tracking, var(--mat-sys-title-large-tracking));margin:0}@media(forced-colors: active){.mat-toolbar{outline:solid 1px}}.mat-toolbar .mat-form-field-underline,.mat-toolbar .mat-form-field-ripple,.mat-toolbar .mat-focused .mat-form-field-ripple{background-color:currentColor}.mat-toolbar .mat-form-field-label,.mat-toolbar .mat-focused .mat-form-field-label,.mat-toolbar .mat-select-value,.mat-toolbar .mat-select-arrow,.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow{color:inherit}.mat-toolbar .mat-input-element{caret-color:currentColor}.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed{--mat-button-text-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));--mat-button-outlined-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface))}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap;height:var(--mat-toolbar-standard-height, 64px)}@media(max-width: 599px){.mat-toolbar-row,.mat-toolbar-single-row{height:var(--mat-toolbar-mobile-height, 56px)}}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%;min-height:var(--mat-toolbar-standard-height, 64px)}@media(max-width: 599px){.mat-toolbar-multiple-rows{min-height:var(--mat-toolbar-mobile-height, 56px)}}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatToolbar, [{
    type: Component,
    args: [{
      selector: "mat-toolbar",
      exportAs: "matToolbar",
      host: {
        "class": "mat-toolbar",
        "[class]": 'color ? "mat-" + color : ""',
        "[class.mat-toolbar-multiple-rows]": "_toolbarRows.length > 0",
        "[class.mat-toolbar-single-row]": "_toolbarRows.length === 0"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: '<ng-content></ng-content>\n<ng-content select="mat-toolbar-row"></ng-content>\n',
      styles: [".mat-toolbar{background:var(--mat-toolbar-container-background-color, var(--mat-sys-surface));color:var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface))}.mat-toolbar,.mat-toolbar h1,.mat-toolbar h2,.mat-toolbar h3,.mat-toolbar h4,.mat-toolbar h5,.mat-toolbar h6{font-family:var(--mat-toolbar-title-text-font, var(--mat-sys-title-large-font));font-size:var(--mat-toolbar-title-text-size, var(--mat-sys-title-large-size));line-height:var(--mat-toolbar-title-text-line-height, var(--mat-sys-title-large-line-height));font-weight:var(--mat-toolbar-title-text-weight, var(--mat-sys-title-large-weight));letter-spacing:var(--mat-toolbar-title-text-tracking, var(--mat-sys-title-large-tracking));margin:0}@media(forced-colors: active){.mat-toolbar{outline:solid 1px}}.mat-toolbar .mat-form-field-underline,.mat-toolbar .mat-form-field-ripple,.mat-toolbar .mat-focused .mat-form-field-ripple{background-color:currentColor}.mat-toolbar .mat-form-field-label,.mat-toolbar .mat-focused .mat-form-field-label,.mat-toolbar .mat-select-value,.mat-toolbar .mat-select-arrow,.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow{color:inherit}.mat-toolbar .mat-input-element{caret-color:currentColor}.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed{--mat-button-text-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));--mat-button-outlined-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface))}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap;height:var(--mat-toolbar-standard-height, 64px)}@media(max-width: 599px){.mat-toolbar-row,.mat-toolbar-single-row{height:var(--mat-toolbar-mobile-height, 56px)}}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%;min-height:var(--mat-toolbar-standard-height, 64px)}@media(max-width: 599px){.mat-toolbar-multiple-rows{min-height:var(--mat-toolbar-mobile-height, 56px)}}\n"]
    }]
  }], () => [], {
    color: [{
      type: Input
    }],
    _toolbarRows: [{
      type: ContentChildren,
      args: [MatToolbarRow, {
        descendants: true
      }]
    }]
  });
})();
function throwToolbarMixedModesError() {
  throw Error("MatToolbar: Attempting to combine different toolbar modes. Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content inside of a `<mat-toolbar>` for a single row.");
}
var MatToolbarModule = class _MatToolbarModule {
  static \u0275fac = function MatToolbarModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatToolbarModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatToolbarModule,
    imports: [MatCommonModule, MatToolbar, MatToolbarRow],
    exports: [MatToolbar, MatToolbarRow, MatCommonModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatCommonModule, MatCommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatToolbarModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, MatToolbar, MatToolbarRow],
      exports: [MatToolbar, MatToolbarRow, MatCommonModule]
    }]
  }], null, null);
})();

// src/app/layout/toolbar/toolbar.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function ToolbarComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 32)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span", 33);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const mod_r2 = ctx;
    \u0275\u0275styleProp("background", "linear-gradient(135deg, " + mod_r2.gradientFrom + "14, " + mod_r2.gradientTo + "24)")("border-color", mod_r2.color + "40");
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", "linear-gradient(135deg, " + mod_r2.gradientFrom + ", " + mod_r2.gradientTo + ")");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mod_r2.icon);
    \u0275\u0275advance();
    \u0275\u0275styleProp("color", mod_r2.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(mod_r2.name);
  }
}
function ToolbarComponent_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function ToolbarComponent_For_23_Template_button_click_0_listener() {
      const n_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.handleNotificationClick(n_r4));
    });
    \u0275\u0275elementStart(1, "mat-icon", 35);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 36)(4, "span", 37);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 38);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const n_r4 = ctx.$implicit;
    \u0275\u0275classProp("unread", !n_r4.read);
    \u0275\u0275advance();
    \u0275\u0275classProp("warn", n_r4.type === "warning")("success", n_r4.type === "success")("info", n_r4.type === "info");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", n_r4.icon, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(n_r4.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(n_r4.message);
  }
}
function ToolbarComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "span", 39);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 40);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const user_r6 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", user_r6.prenom, " ", user_r6.nom);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r6.poste);
  }
}
function ToolbarComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 41);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 42);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const user_r7 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", user_r7.prenom, " ", user_r7.nom);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r7.email);
  }
}
var ToolbarComponent = class _ToolbarComponent {
  authService;
  moduleNav;
  notifService;
  themeService;
  router;
  constructor(authService, moduleNav, notifService, themeService, router) {
    this.authService = authService;
    this.moduleNav = moduleNav;
    this.notifService = notifService;
    this.themeService = themeService;
    this.router = router;
  }
  toggleDrawer() {
    this.moduleNav.toggleDrawer();
  }
  toggleSidebar() {
    this.moduleNav.toggleSidebar();
  }
  goHome() {
    this.moduleNav.clearModule();
    this.router.navigate(["/dashboard"]);
  }
  goToMonEspace() {
    this.router.navigate(["/mon-espace"]);
  }
  handleNotificationClick(n) {
    if (!n)
      return;
    this.notifService.markAsRead(n.id);
    if (n.route) {
      this.router.navigateByUrl(n.route);
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigate(["/auth/login"]);
  }
  static \u0275fac = function ToolbarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolbarComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(ModuleNavService), \u0275\u0275directiveInject(NotificationService), \u0275\u0275directiveInject(ThemeService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ToolbarComponent, selectors: [["app-toolbar"]], standalone: false, decls: 68, vars: 19, consts: [["notifMenu", "matMenu"], ["userMenu", "matMenu"], [1, "app-toolbar"], [1, "toolbar-left"], ["mat-icon-button", "", "matTooltip", "Menu", 1, "menu-btn", 3, "click"], [1, "brand", 3, "click"], ["src", "/bpbf-logo.png", "alt", "BPBF", 1, "brand-logo"], [1, "module-badge", 3, "background", "border-color"], [1, "flex-spacer"], [1, "toolbar-right"], ["mat-icon-button", "", "matTooltip", "Notifications", 1, "action-btn", 3, "matMenuTriggerFor"], ["matBadgeColor", "warn", "matBadgeSize", "small", 3, "matBadge", "matBadgeHidden"], ["xPosition", "before", 1, "notif-panel"], [1, "notif-header", 3, "click"], [1, "notif-title-hdr"], ["mat-button", "", "color", "primary", 3, "click"], ["mat-menu-item", "", 1, "notif-item", 3, "unread"], ["mat-icon-button", "", 1, "action-btn", "theme-btn", 3, "click", "matTooltip"], ["mat-icon-button", "", "matTooltip", "Param\xE8tres", 1, "action-btn"], ["mat-button", "", 1, "user-btn", 3, "matMenuTriggerFor"], [1, "avatar"], [1, "user-info"], [1, "chevron"], ["xPosition", "before"], [1, "user-menu-header", 3, "click"], [1, "avatar", "avatar-lg"], ["mat-menu-item", "", 3, "click"], [2, "color", "#0284c7"], [2, "font-weight", "700", "color", "#0284c7"], ["mat-menu-item", ""], ["mat-menu-item", "", 1, "logout-item", 3, "click"], [1, "module-badge"], [1, "mod-icon"], [1, "mod-name"], ["mat-menu-item", "", 1, "notif-item", 3, "click"], [1, "notif-icon"], [1, "notif-body"], [1, "notif-item-title"], [1, "notif-item-msg"], [1, "user-name"], [1, "user-role"], [1, "uh-name"], [1, "uh-email"]], template: function ToolbarComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "mat-toolbar", 2)(1, "div", 3)(2, "button", 4);
      \u0275\u0275listener("click", function ToolbarComponent_Template_button_click_2_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.toggleDrawer());
      });
      \u0275\u0275elementStart(3, "mat-icon");
      \u0275\u0275text(4, "menu");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 5);
      \u0275\u0275listener("click", function ToolbarComponent_Template_div_click_5_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.goHome());
      });
      \u0275\u0275element(6, "img", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(7, ToolbarComponent_Conditional_7_Template, 6, 10, "div", 7);
      \u0275\u0275pipe(8, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275element(9, "span", 8);
      \u0275\u0275elementStart(10, "div", 9)(11, "button", 10)(12, "mat-icon", 11);
      \u0275\u0275text(13, " notifications ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "mat-menu", 12, 0)(16, "div", 13);
      \u0275\u0275listener("click", function ToolbarComponent_Template_div_click_16_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView($event.stopPropagation());
      });
      \u0275\u0275elementStart(17, "span", 14);
      \u0275\u0275text(18, "Notifications");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "button", 15);
      \u0275\u0275listener("click", function ToolbarComponent_Template_button_click_19_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.notifService.markAllAsRead());
      });
      \u0275\u0275text(20, " Tout lire ");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(21, "mat-divider");
      \u0275\u0275repeaterCreate(22, ToolbarComponent_For_23_Template, 8, 11, "button", 16, _forTrack0);
      \u0275\u0275pipe(24, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "button", 17);
      \u0275\u0275listener("click", function ToolbarComponent_Template_button_click_25_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.themeService.toggle());
      });
      \u0275\u0275elementStart(26, "mat-icon");
      \u0275\u0275text(27);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "button", 18)(29, "mat-icon");
      \u0275\u0275text(30, "settings");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "button", 19)(32, "div", 20);
      \u0275\u0275text(33);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(34, ToolbarComponent_Conditional_34_Template, 5, 3, "div", 21);
      \u0275\u0275pipe(35, "async");
      \u0275\u0275elementStart(36, "mat-icon", 22);
      \u0275\u0275text(37, "keyboard_arrow_down");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "mat-menu", 23, 1)(40, "div", 24);
      \u0275\u0275listener("click", function ToolbarComponent_Template_div_click_40_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView($event.stopPropagation());
      });
      \u0275\u0275elementStart(41, "div", 25);
      \u0275\u0275text(42);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(43, ToolbarComponent_Conditional_43_Template, 5, 3, "div");
      \u0275\u0275pipe(44, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275element(45, "mat-divider");
      \u0275\u0275elementStart(46, "button", 26);
      \u0275\u0275listener("click", function ToolbarComponent_Template_button_click_46_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.goToMonEspace());
      });
      \u0275\u0275elementStart(47, "mat-icon", 27);
      \u0275\u0275text(48, "badge");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "span", 28);
      \u0275\u0275text(50, "Mon Espace Salari\xE9");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(51, "button", 26);
      \u0275\u0275listener("click", function ToolbarComponent_Template_button_click_51_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.goToMonEspace());
      });
      \u0275\u0275elementStart(52, "mat-icon");
      \u0275\u0275text(53, "person_outline");
      \u0275\u0275elementEnd();
      \u0275\u0275text(54, " Mon profil ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "button", 29)(56, "mat-icon");
      \u0275\u0275text(57, "manage_accounts");
      \u0275\u0275elementEnd();
      \u0275\u0275text(58, " Param\xE8tres du compte ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "button", 29)(60, "mat-icon");
      \u0275\u0275text(61, "help_outline");
      \u0275\u0275elementEnd();
      \u0275\u0275text(62, " Aide & support ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(63, "mat-divider");
      \u0275\u0275elementStart(64, "button", 30);
      \u0275\u0275listener("click", function ToolbarComponent_Template_button_click_64_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.logout());
      });
      \u0275\u0275elementStart(65, "mat-icon");
      \u0275\u0275text(66, "logout");
      \u0275\u0275elementEnd();
      \u0275\u0275text(67, " D\xE9connexion ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_11_0;
      let tmp_13_0;
      const notifMenu_r8 = \u0275\u0275reference(15);
      const userMenu_r9 = \u0275\u0275reference(39);
      \u0275\u0275advance(7);
      \u0275\u0275conditional((tmp_2_0 = \u0275\u0275pipeBind1(8, 11, ctx.moduleNav.activeModule$)) ? 7 : -1, tmp_2_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("matMenuTriggerFor", notifMenu_r8);
      \u0275\u0275advance();
      \u0275\u0275property("matBadge", ctx.notifService.unreadCount > 0 ? ctx.notifService.unreadCount : null)("matBadgeHidden", ctx.notifService.unreadCount === 0);
      \u0275\u0275advance(10);
      \u0275\u0275repeater(\u0275\u0275pipeBind1(24, 13, ctx.notifService.notifications$));
      \u0275\u0275advance(3);
      \u0275\u0275property("matTooltip", ctx.themeService.isDark ? "Mode clair" : "Mode sombre");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.themeService.isDark ? "light_mode" : "dark_mode");
      \u0275\u0275advance(4);
      \u0275\u0275property("matMenuTriggerFor", userMenu_r9);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.authService.getInitials());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_11_0 = \u0275\u0275pipeBind1(35, 15, ctx.authService.currentUser$)) ? 34 : -1, tmp_11_0);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.authService.getInitials());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_13_0 = \u0275\u0275pipeBind1(44, 17, ctx.authService.currentUser$)) ? 43 : -1, tmp_13_0);
    }
  }, dependencies: [MatToolbar, MatIcon, MatButton, MatIconButton, MatMenu, MatMenuItem, MatMenuTrigger, MatBadge, MatDivider, MatTooltip, AsyncPipe], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  position: sticky;\n  top: 0;\n  z-index: 60;\n}\n.app-toolbar[_ngcontent-%COMP%] {\n  background: var(--toolbar-bg);\n  color: var(--on-surface);\n  height: 64px;\n  padding: 0 12px 0 0;\n  box-shadow: var(--shadow-nav);\n  border-bottom: 1px solid var(--border);\n  gap: 0;\n}\n.toolbar-left[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-shrink: 0;\n}\n.menu-btn[_ngcontent-%COMP%] {\n  color: var(--on-surface-2);\n}\n.menu-btn[_ngcontent-%COMP%]:hover {\n  color: var(--on-surface);\n  background: var(--surface-hover);\n}\n.brand[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  padding: 4px 10px;\n  border-radius: 8px;\n  transition: background 0.2s;\n}\n.brand[_ngcontent-%COMP%]:hover {\n  background: var(--surface-hover);\n}\n.brand-logo[_ngcontent-%COMP%] {\n  height: 48px;\n  max-height: 50px;\n  width: auto;\n  display: block;\n  object-fit: contain;\n  background: #ffffff;\n  border-radius: 8px;\n  padding: 4px 8px;\n}\n.module-badge[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  border-radius: 24px;\n  padding: 4px 14px 4px 4px;\n  margin-left: 10px;\n  border: 1.5px solid transparent;\n  transition: all 0.25s ease;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);\n}\n.module-badge[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);\n}\n.mod-icon[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);\n}\n.mod-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: #ffffff !important;\n}\n.mod-name[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n}\n.flex-spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.toolbar-right[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n}\n.action-btn[_ngcontent-%COMP%] {\n  color: var(--on-surface-2);\n}\n.action-btn[_ngcontent-%COMP%]:hover {\n  color: var(--on-surface);\n  background: var(--surface-hover);\n}\n.user-btn[_ngcontent-%COMP%] {\n  color: var(--on-surface) !important;\n  padding: 4px 10px 4px 4px !important;\n  border-radius: 10px !important;\n  height: 44px !important;\n  margin-left: 4px;\n  min-width: unset !important;\n}\n.user-btn[_ngcontent-%COMP%]     .mdc-button__label {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.user-avatar[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  background: var(--surface-variant);\n  color: var(--on-surface);\n  border: 1px solid var(--border);\n  font-weight: 700;\n  font-size: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.user-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  line-height: 1.2;\n}\n.user-name[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--on-surface);\n}\n.user-role[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--on-surface-3);\n}\n.chevron[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--on-surface-3);\n}\n  .notif-panel {\n  min-width: 360px !important;\n  max-width: 400px !important;\n}\n  .notif-panel .notif-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 8px 16px;\n}\n  .notif-panel .notif-title-hdr {\n  font-size: 15px;\n  font-weight: 600;\n}\n  .notif-panel .notif-item {\n  height: auto !important;\n  padding: 12px 16px !important;\n  border-left: 3px solid transparent;\n}\n  .notif-panel .notif-item.unread {\n  border-left-color: #FFC700;\n  background: rgba(212, 160, 23, 0.06);\n}\n  .notif-panel .notif-item .mat-mdc-menu-item-text {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n}\n  .notif-panel .notif-icon {\n  margin-top: 2px;\n}\n  .notif-panel .notif-icon.warn {\n  color: #F57C00;\n}\n  .notif-panel .notif-icon.success {\n  color: #2E7D32;\n}\n  .notif-panel .notif-icon.info {\n  color: #0288D1;\n}\n  .notif-panel .notif-body {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n  .notif-panel .notif-item-title {\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1.3;\n}\n  .notif-panel .notif-item-msg {\n  font-size: 12px;\n  color: rgba(0, 0, 0, 0.6);\n  white-space: normal;\n  line-height: 1.4;\n}\n  .user-menu-header {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 16px;\n}\n  .user-menu-header .uh-name {\n  font-size: 14px;\n  font-weight: 600;\n}\n  .user-menu-header .uh-email {\n  font-size: 12px;\n  color: rgba(0, 0, 0, 0.55);\n}\n  .logout-item {\n  color: #D32F2F !important;\n}\n  .logout-item mat-icon {\n  color: #D32F2F !important;\n}\n@media (max-width: 600px) {\n  .user-info[_ngcontent-%COMP%], \n   .mod-name[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .brand-logo[_ngcontent-%COMP%] {\n    height: 28px;\n  }\n}\nhtml.dark-theme[_nghost-%COMP%]   .app-toolbar[_ngcontent-%COMP%], html.dark-theme   [_nghost-%COMP%]   .app-toolbar[_ngcontent-%COMP%] {\n  background: #030712 !important;\n  color: #f8fafc !important;\n  border-bottom-color: #1f293d !important;\n}\nhtml.dark-theme[_nghost-%COMP%]   .menu-btn[_ngcontent-%COMP%], html.dark-theme   [_nghost-%COMP%]   .menu-btn[_ngcontent-%COMP%] {\n  color: #e2e8f0 !important;\n}\nhtml.dark-theme[_nghost-%COMP%]   .menu-btn[_ngcontent-%COMP%]:hover, html.dark-theme   [_nghost-%COMP%]   .menu-btn[_ngcontent-%COMP%]:hover {\n  color: #38bdf8 !important;\n  background: rgba(56, 189, 248, 0.12) !important;\n}\nhtml.dark-theme[_nghost-%COMP%]   .brand[_ngcontent-%COMP%]:hover, html.dark-theme   [_nghost-%COMP%]   .brand[_ngcontent-%COMP%]:hover {\n  background: #0b1120 !important;\n}\nhtml.dark-theme[_nghost-%COMP%]   .module-badge[_ngcontent-%COMP%], html.dark-theme   [_nghost-%COMP%]   .module-badge[_ngcontent-%COMP%] {\n  background: #0b0f19 !important;\n  border-color: #1f293d !important;\n}\nhtml.dark-theme[_nghost-%COMP%]   .mod-name[_ngcontent-%COMP%], html.dark-theme   [_nghost-%COMP%]   .mod-name[_ngcontent-%COMP%] {\n  color: #f8fafc !important;\n}\nhtml.dark-theme[_nghost-%COMP%]   .action-btn[_ngcontent-%COMP%], html.dark-theme   [_nghost-%COMP%]   .action-btn[_ngcontent-%COMP%] {\n  color: #cbd5e1 !important;\n}\nhtml.dark-theme[_nghost-%COMP%]   .action-btn[_ngcontent-%COMP%]:hover, html.dark-theme   [_nghost-%COMP%]   .action-btn[_ngcontent-%COMP%]:hover {\n  color: #38bdf8 !important;\n  background: #0b1120 !important;\n}\nhtml.dark-theme[_nghost-%COMP%]   .user-btn[_ngcontent-%COMP%], html.dark-theme   [_nghost-%COMP%]   .user-btn[_ngcontent-%COMP%] {\n  color: #f8fafc !important;\n}\nhtml.dark-theme[_nghost-%COMP%]   .user-btn[_ngcontent-%COMP%]:hover, html.dark-theme   [_nghost-%COMP%]   .user-btn[_ngcontent-%COMP%]:hover {\n  background: #0f1f36 !important;\n}\nhtml.dark-theme[_nghost-%COMP%]   .user-name[_ngcontent-%COMP%], html.dark-theme   [_nghost-%COMP%]   .user-name[_ngcontent-%COMP%] {\n  color: #f1f5f9 !important;\n}\nhtml.dark-theme[_nghost-%COMP%]   .user-role[_ngcontent-%COMP%], html.dark-theme   [_nghost-%COMP%]   .user-role[_ngcontent-%COMP%], \nhtml.dark-theme[_nghost-%COMP%]   .chevron[_ngcontent-%COMP%], html.dark-theme   [_nghost-%COMP%]   .chevron[_ngcontent-%COMP%] {\n  color: #94a3b8 !important;\n}\n/*# sourceMappingURL=toolbar.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolbarComponent, [{
    type: Component,
    args: [{ selector: "app-toolbar", standalone: false, template: `<mat-toolbar class="app-toolbar">\r
  <div class="toolbar-left">\r
    <button mat-icon-button class="menu-btn" (click)="toggleDrawer()" matTooltip="Menu">\r
      <mat-icon>menu</mat-icon>\r
    </button>\r
\r
    <div class="brand" (click)="goHome()">\r
      <img src="/bpbf-logo.png" class="brand-logo" alt="BPBF">\r
    </div>\r
\r
    @if (moduleNav.activeModule$ | async; as mod) {\r
      <div class="module-badge"\r
           [style.background]="'linear-gradient(135deg, ' + mod.gradientFrom + '14, ' + mod.gradientTo + '24)'"\r
           [style.border-color]="mod.color + '40'">\r
        <div class="mod-icon"\r
             [style.background]="'linear-gradient(135deg, ' + mod.gradientFrom + ', ' + mod.gradientTo + ')'">\r
          <mat-icon>{{ mod.icon }}</mat-icon>\r
        </div>\r
        <span class="mod-name" [style.color]="mod.color">{{ mod.name }}</span>\r
      </div>\r
    }\r
  </div>\r
\r
  <span class="flex-spacer"></span>\r
\r
  <div class="toolbar-right">\r
\r
    <!-- Notifications -->\r
    <button mat-icon-button [matMenuTriggerFor]="notifMenu" class="action-btn" matTooltip="Notifications">\r
      <mat-icon [matBadge]="notifService.unreadCount > 0 ? notifService.unreadCount : null"\r
                [matBadgeHidden]="notifService.unreadCount === 0"\r
                matBadgeColor="warn"\r
                matBadgeSize="small">\r
        notifications\r
      </mat-icon>\r
    </button>\r
\r
    <mat-menu #notifMenu="matMenu" class="notif-panel" xPosition="before">\r
      <div class="notif-header" (click)="$event.stopPropagation()">\r
        <span class="notif-title-hdr">Notifications</span>\r
        <button mat-button color="primary" (click)="notifService.markAllAsRead()">\r
          Tout lire\r
        </button>\r
      </div>\r
      <mat-divider></mat-divider>\r
      @for (n of notifService.notifications$ | async; track n.id) {\r
        <button mat-menu-item class="notif-item" [class.unread]="!n.read"\r
                (click)="handleNotificationClick(n)">\r
          <mat-icon class="notif-icon"\r
            [class.warn]="n.type === 'warning'"\r
            [class.success]="n.type === 'success'"\r
            [class.info]="n.type === 'info'">\r
            {{ n.icon }}\r
          </mat-icon>\r
          <div class="notif-body">\r
            <span class="notif-item-title">{{ n.title }}</span>\r
            <span class="notif-item-msg">{{ n.message }}</span>\r
          </div>\r
        </button>\r
      }\r
    </mat-menu>\r
\r
    <!-- Theme toggle -->\r
    <button mat-icon-button class="action-btn theme-btn"\r
            (click)="themeService.toggle()"\r
            [matTooltip]="themeService.isDark ? 'Mode clair' : 'Mode sombre'">\r
      <mat-icon>{{ themeService.isDark ? 'light_mode' : 'dark_mode' }}</mat-icon>\r
    </button>\r
\r
    <!-- Settings -->\r
    <button mat-icon-button class="action-btn" matTooltip="Param\xE8tres">\r
      <mat-icon>settings</mat-icon>\r
    </button>\r
\r
    <!-- User menu -->\r
    <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">\r
      <div class="avatar">{{ authService.getInitials() }}</div>\r
      @if (authService.currentUser$ | async; as user) {\r
        <div class="user-info">\r
          <span class="user-name">{{ user.prenom }} {{ user.nom }}</span>\r
          <span class="user-role">{{ user.poste }}</span>\r
        </div>\r
      }\r
      <mat-icon class="chevron">keyboard_arrow_down</mat-icon>\r
    </button>\r
\r
    <mat-menu #userMenu="matMenu" xPosition="before">\r
      <div class="user-menu-header" (click)="$event.stopPropagation()">\r
        <div class="avatar avatar-lg">{{ authService.getInitials() }}</div>\r
        @if (authService.currentUser$ | async; as user) {\r
          <div>\r
            <div class="uh-name">{{ user.prenom }} {{ user.nom }}</div>\r
            <div class="uh-email">{{ user.email }}</div>\r
          </div>\r
        }\r
      </div>\r
      <mat-divider></mat-divider>\r
      <button mat-menu-item (click)="goToMonEspace()">\r
        <mat-icon style="color: #0284c7;">badge</mat-icon>\r
        <span style="font-weight: 700; color: #0284c7;">Mon Espace Salari\xE9</span>\r
      </button>\r
      <button mat-menu-item (click)="goToMonEspace()">\r
        <mat-icon>person_outline</mat-icon>\r
        Mon profil\r
      </button>\r
      <button mat-menu-item>\r
        <mat-icon>manage_accounts</mat-icon>\r
        Param\xE8tres du compte\r
      </button>\r
      <button mat-menu-item>\r
        <mat-icon>help_outline</mat-icon>\r
        Aide & support\r
      </button>\r
      <mat-divider></mat-divider>\r
      <button mat-menu-item (click)="logout()" class="logout-item">\r
        <mat-icon>logout</mat-icon>\r
        D\xE9connexion\r
      </button>\r
    </mat-menu>\r
\r
  </div>\r
</mat-toolbar>\r
`, styles: ["/* src/app/layout/toolbar/toolbar.component.scss */\n:host {\n  display: block;\n  position: sticky;\n  top: 0;\n  z-index: 60;\n}\n.app-toolbar {\n  background: var(--toolbar-bg);\n  color: var(--on-surface);\n  height: 64px;\n  padding: 0 12px 0 0;\n  box-shadow: var(--shadow-nav);\n  border-bottom: 1px solid var(--border);\n  gap: 0;\n}\n.toolbar-left {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-shrink: 0;\n}\n.menu-btn {\n  color: var(--on-surface-2);\n}\n.menu-btn:hover {\n  color: var(--on-surface);\n  background: var(--surface-hover);\n}\n.brand {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  padding: 4px 10px;\n  border-radius: 8px;\n  transition: background 0.2s;\n}\n.brand:hover {\n  background: var(--surface-hover);\n}\n.brand-logo {\n  height: 48px;\n  max-height: 50px;\n  width: auto;\n  display: block;\n  object-fit: contain;\n  background: #ffffff;\n  border-radius: 8px;\n  padding: 4px 8px;\n}\n.module-badge {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  border-radius: 24px;\n  padding: 4px 14px 4px 4px;\n  margin-left: 10px;\n  border: 1.5px solid transparent;\n  transition: all 0.25s ease;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);\n}\n.module-badge:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);\n}\n.mod-icon {\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);\n}\n.mod-icon mat-icon {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: #ffffff !important;\n}\n.mod-name {\n  font-size: 13.5px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n}\n.flex-spacer {\n  flex: 1;\n}\n.toolbar-right {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n}\n.action-btn {\n  color: var(--on-surface-2);\n}\n.action-btn:hover {\n  color: var(--on-surface);\n  background: var(--surface-hover);\n}\n.user-btn {\n  color: var(--on-surface) !important;\n  padding: 4px 10px 4px 4px !important;\n  border-radius: 10px !important;\n  height: 44px !important;\n  margin-left: 4px;\n  min-width: unset !important;\n}\n.user-btn ::ng-deep .mdc-button__label {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.user-avatar {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  background: var(--surface-variant);\n  color: var(--on-surface);\n  border: 1px solid var(--border);\n  font-weight: 700;\n  font-size: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.user-info {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  line-height: 1.2;\n}\n.user-name {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--on-surface);\n}\n.user-role {\n  font-size: 11px;\n  color: var(--on-surface-3);\n}\n.chevron {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--on-surface-3);\n}\n::ng-deep .notif-panel {\n  min-width: 360px !important;\n  max-width: 400px !important;\n}\n::ng-deep .notif-panel .notif-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 8px 16px;\n}\n::ng-deep .notif-panel .notif-title-hdr {\n  font-size: 15px;\n  font-weight: 600;\n}\n::ng-deep .notif-panel .notif-item {\n  height: auto !important;\n  padding: 12px 16px !important;\n  border-left: 3px solid transparent;\n}\n::ng-deep .notif-panel .notif-item.unread {\n  border-left-color: #FFC700;\n  background: rgba(212, 160, 23, 0.06);\n}\n::ng-deep .notif-panel .notif-item .mat-mdc-menu-item-text {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n}\n::ng-deep .notif-panel .notif-icon {\n  margin-top: 2px;\n}\n::ng-deep .notif-panel .notif-icon.warn {\n  color: #F57C00;\n}\n::ng-deep .notif-panel .notif-icon.success {\n  color: #2E7D32;\n}\n::ng-deep .notif-panel .notif-icon.info {\n  color: #0288D1;\n}\n::ng-deep .notif-panel .notif-body {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n::ng-deep .notif-panel .notif-item-title {\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1.3;\n}\n::ng-deep .notif-panel .notif-item-msg {\n  font-size: 12px;\n  color: rgba(0, 0, 0, 0.6);\n  white-space: normal;\n  line-height: 1.4;\n}\n::ng-deep .user-menu-header {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 16px;\n}\n::ng-deep .user-menu-header .uh-name {\n  font-size: 14px;\n  font-weight: 600;\n}\n::ng-deep .user-menu-header .uh-email {\n  font-size: 12px;\n  color: rgba(0, 0, 0, 0.55);\n}\n::ng-deep .logout-item {\n  color: #D32F2F !important;\n}\n::ng-deep .logout-item mat-icon {\n  color: #D32F2F !important;\n}\n@media (max-width: 600px) {\n  .user-info,\n  .mod-name {\n    display: none;\n  }\n  .brand-logo {\n    height: 28px;\n  }\n}\n:host-context(html.dark-theme) .app-toolbar {\n  background: #030712 !important;\n  color: #f8fafc !important;\n  border-bottom-color: #1f293d !important;\n}\n:host-context(html.dark-theme) .menu-btn {\n  color: #e2e8f0 !important;\n}\n:host-context(html.dark-theme) .menu-btn:hover {\n  color: #38bdf8 !important;\n  background: rgba(56, 189, 248, 0.12) !important;\n}\n:host-context(html.dark-theme) .brand:hover {\n  background: #0b1120 !important;\n}\n:host-context(html.dark-theme) .module-badge {\n  background: #0b0f19 !important;\n  border-color: #1f293d !important;\n}\n:host-context(html.dark-theme) .mod-name {\n  color: #f8fafc !important;\n}\n:host-context(html.dark-theme) .action-btn {\n  color: #cbd5e1 !important;\n}\n:host-context(html.dark-theme) .action-btn:hover {\n  color: #38bdf8 !important;\n  background: #0b1120 !important;\n}\n:host-context(html.dark-theme) .user-btn {\n  color: #f8fafc !important;\n}\n:host-context(html.dark-theme) .user-btn:hover {\n  background: #0f1f36 !important;\n}\n:host-context(html.dark-theme) .user-name {\n  color: #f1f5f9 !important;\n}\n:host-context(html.dark-theme) .user-role,\n:host-context(html.dark-theme) .chevron {\n  color: #94a3b8 !important;\n}\n/*# sourceMappingURL=toolbar.component.css.map */\n"] }]
  }], () => [{ type: AuthService }, { type: ModuleNavService }, { type: NotificationService }, { type: ThemeService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ToolbarComponent, { className: "ToolbarComponent", filePath: "src/app/layout/toolbar/toolbar.component.ts", lineNumber: 14 });
})();

// src/app/layout/nav-drawer/nav-drawer.component.ts
var _forTrack02 = ($index, $item) => $item.id;
function NavDrawerComponent_Conditional_0_For_13_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1, "Bient\xF4t");
    \u0275\u0275elementEnd();
  }
}
function NavDrawerComponent_Conditional_0_For_13_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 18);
    \u0275\u0275text(1, " expand_more ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r4 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("rotated", ctx_r1.isExpanded(item_r4));
  }
}
function NavDrawerComponent_Conditional_0_For_13_Conditional_0_For_10_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const child_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(child_r6.badge);
  }
}
function NavDrawerComponent_Conditional_0_For_13_Conditional_0_For_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function NavDrawerComponent_Conditional_0_For_13_Conditional_0_For_10_Template_button_click_0_listener() {
      const child_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.isFicheItem(child_r6) && !ctx_r1.isEmployeeSelected ? null : ctx_r1.navigateChild(child_r6.route));
    });
    \u0275\u0275elementStart(1, "mat-icon", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 21);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, NavDrawerComponent_Conditional_0_For_13_Conditional_0_For_10_Conditional_5_Template, 2, 1, "span", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const child_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute(child_r6.route))("ctx-disabled", ctx_r1.isFicheItem(child_r6) && !ctx_r1.isEmployeeSelected);
    \u0275\u0275property("matTooltip", ctx_r1.isFicheItem(child_r6) && !ctx_r1.isEmployeeSelected ? "S\xE9lectionnez ou ouvrez d'abord la fiche d'un employ\xE9" : "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r6.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r6.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(child_r6.badge ? 5 : -1);
  }
}
function NavDrawerComponent_Conditional_0_For_13_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "button", 11);
    \u0275\u0275listener("click", function NavDrawerComponent_Conditional_0_For_13_Conditional_0_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const item_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(item_r4.disabled ? null : ctx_r1.toggleItem(item_r4));
    });
    \u0275\u0275elementStart(2, "mat-icon", 12);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 13);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, NavDrawerComponent_Conditional_0_For_13_Conditional_0_Conditional_6_Template, 2, 0, "span", 14)(7, NavDrawerComponent_Conditional_0_For_13_Conditional_0_Conditional_7_Template, 2, 2, "mat-icon", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 16);
    \u0275\u0275repeaterCreate(9, NavDrawerComponent_Conditional_0_For_13_Conditional_0_For_10_Template, 6, 8, "button", 17, _forTrack02);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("group-disabled", item_r4.disabled);
    \u0275\u0275advance();
    \u0275\u0275classProp("disabled-btn", item_r4.disabled);
    \u0275\u0275property("matTooltip", item_r4.disabled ? "Fonctionnalit\xE9 non activ\xE9e pour le moment" : "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r4.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r4.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r4.disabled ? 6 : 7);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("open", !item_r4.disabled && ctx_r1.isExpanded(item_r4));
    \u0275\u0275advance();
    \u0275\u0275repeater(item_r4.children);
  }
}
function NavDrawerComponent_Conditional_0_For_13_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function NavDrawerComponent_Conditional_0_For_13_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const item_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.navigate(item_r4.route));
    });
    \u0275\u0275elementStart(1, "mat-icon", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 25);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute(item_r4.route));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r4.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r4.label);
  }
}
function NavDrawerComponent_Conditional_0_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, NavDrawerComponent_Conditional_0_For_13_Conditional_0_Template, 11, 10, "div", 8)(1, NavDrawerComponent_Conditional_0_For_13_Conditional_1_Template, 5, 4, "button", 9);
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    \u0275\u0275conditional(item_r4.children && item_r4.children.length > 0 ? 0 : 1);
  }
}
function NavDrawerComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 2);
    \u0275\u0275listener("click", function NavDrawerComponent_Conditional_0_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.navigateToOverview());
    });
    \u0275\u0275elementStart(2, "div", 3)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 4)(6, "span", 5);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 6);
    \u0275\u0275listener("click", function NavDrawerComponent_Conditional_0_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.moduleNav.toggleDrawer());
    });
    \u0275\u0275elementStart(9, "mat-icon");
    \u0275\u0275text(10, "chevron_left");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 7);
    \u0275\u0275repeaterCreate(12, NavDrawerComponent_Conditional_0_For_13_Template, 2, 1, null, null, _forTrack02);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", "linear-gradient(135deg, " + ctx_r1.activeModule.gradientFrom + ", " + ctx_r1.activeModule.gradientTo + ")");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.activeModule.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.activeModule.name);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.menuItems);
  }
}
function NavDrawerComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "mat-icon");
    \u0275\u0275text(2, "apps");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "S\xE9lectionnez un module");
    \u0275\u0275elementEnd()();
  }
}
var NavDrawerComponent = class _NavDrawerComponent {
  moduleNav;
  router;
  authService;
  destroy$ = new Subject();
  activeModule = null;
  menuItems = [];
  expandedItems = /* @__PURE__ */ new Set();
  currentEmpId = null;
  lastEmpId = "EMP-001";
  constructor(moduleNav, router, authService) {
    this.moduleNav = moduleNav;
    this.router = router;
    this.authService = authService;
  }
  get isEmployeeSelected() {
    return !!this.currentEmpId;
  }
  isItemPermitted(id) {
    switch (id) {
      case "donnees-base":
      case "gestion-admin":
      case "paie-section":
        return this.authService.hasPermission("DB_VIEW");
      case "grille-salariale":
        return this.authService.hasPermission("DB_GRILLE_EDIT");
      case "type-indemnite":
      case "param-indemnite":
      case "param-retraite":
        return this.authService.hasPermission("DB_INDEMNITE_EDIT") || this.authService.hasPermission("DB_REF_EDIT") || this.authService.hasPermission("DB_VIEW");
      case "emploi":
      case "fonction":
      case "agence":
      case "departement":
      case "direction":
      case "service":
        return this.authService.hasPermission("DB_REF_EDIT");
      case "employes":
      case "liste-employes":
      case "fiche-employe":
        return this.authService.hasPermission("EMP_VIEW");
      case "paie":
      case "paie-bulletins":
      case "bulletins":
      case "historique":
      case "generer":
      case "valider":
      case "cloture":
        return true;
      case "profils":
      case "securite-droits":
        return this.authService.hasPermission("PROFIL_EDIT") || this.authService.hasPermission("USER_MANAGE");
      case "utilisateurs":
        return this.authService.hasPermission("USER_MANAGE");
      case "habilitations":
      case "profils-roles":
        return this.authService.hasPermission("PROFIL_EDIT");
      case "manuel-utilisateur":
        return this.authService.hasPermission("MANUAL_VIEW");
      default:
        return true;
    }
  }
  refreshMenuItems() {
    const rawItems = this.moduleNav.getMenuForActiveModule();
    this.menuItems = rawItems.filter((item) => this.isItemPermitted(item.id)).map((item) => {
      if (!item.children)
        return item;
      const filteredChildren = item.children.filter((child) => this.isItemPermitted(child.id));
      return __spreadProps(__spreadValues({}, item), { children: filteredChildren });
    }).filter((item) => !item.children || item.children.length > 0);
  }
  ngOnInit() {
    this.moduleNav.activeModule$.pipe(takeUntil(this.destroy$)).subscribe((mod) => {
      const isSameModule = this.activeModule?.id === mod?.id;
      this.activeModule = mod;
      this.refreshMenuItems();
      if (!isSameModule) {
        this.expandedItems.clear();
        this.expandedItems.add("employes");
      }
    });
    this.moduleNav.menuUpdated$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.refreshMenuItems();
    });
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd), takeUntil(this.destroy$)).subscribe((e) => {
      const url = e.urlAfterRedirects || e.url;
      const empId = this.extractEmpId(url);
      this.currentEmpId = empId;
      if (empId) {
        this.lastEmpId = empId;
        this.expandedItems.add("employes");
      }
      if (url.includes("/paie/etats-synthese")) {
        this.expandedItems.add("etats-synthese");
      }
    });
    const initEmpId = this.extractEmpId(this.router.url);
    this.currentEmpId = initEmpId;
    if (initEmpId) {
      this.lastEmpId = initEmpId;
      this.expandedItems.add("employes");
    }
    if (this.router.url.includes("/paie/etats-synthese")) {
      this.expandedItems.add("etats-synthese");
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  extractEmpId(url) {
    const match = url.match(/\/grh\/employes\/([^\/\?]+)/);
    if (!match)
      return null;
    const id = match[1];
    return id === "nouveau" || id === "modifier" ? null : id;
  }
  resolveRoute(route) {
    if (!route)
      return void 0;
    if (route.includes("__emp__")) {
      const empId = this.currentEmpId || this.lastEmpId || "EMP-001";
      const cleanPath = route.replace("__emp__/", "").replace("__emp__", "");
      return `/grh/employes/${empId}/${cleanPath}`;
    }
    return route;
  }
  isFicheItem(item) {
    return !!item.route?.includes("__emp__");
  }
  selectModule(mod) {
    this.moduleNav.selectModule(mod);
    this.router.navigate([mod.route]);
  }
  navigateToOverview() {
    if (this.activeModule) {
      this.router.navigate([this.activeModule.route]);
    }
  }
  toggleItem(item) {
    if (this.expandedItems.has(item.id)) {
      this.expandedItems.delete(item.id);
    } else {
      this.expandedItems.add(item.id);
    }
  }
  isExpanded(item) {
    return this.expandedItems.has(item.id);
  }
  navigate(route) {
    if (route)
      this.router.navigate([route]);
  }
  navigateChild(route) {
    if (!route)
      return;
    const target = this.resolveRoute(route);
    if (target) {
      this.router.navigateByUrl(target);
    }
  }
  navigateFiche(route) {
    const resolved = this.resolveRoute(route);
    if (resolved)
      this.router.navigateByUrl(resolved);
  }
  isActiveRoute(route) {
    if (!route)
      return false;
    const resolved = this.resolveRoute(route) || route;
    return this.router.isActive(resolved, {
      paths: "exact",
      queryParams: "ignored",
      fragment: "ignored",
      matrixParams: "ignored"
    });
  }
  static \u0275fac = function NavDrawerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NavDrawerComponent)(\u0275\u0275directiveInject(ModuleNavService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavDrawerComponent, selectors: [["app-nav-drawer"]], standalone: false, decls: 2, vars: 1, consts: [[1, "drawer-container"], [1, "empty-drawer"], [1, "drawer-header", 2, "cursor", "pointer", 3, "click"], [1, "dh-icon"], [1, "dh-info"], [1, "dh-name"], ["mat-icon-button", "", "matTooltip", "R\xE9duire", 1, "dh-toggle", 3, "click"], [1, "drawer-menu"], [1, "menu-group", 3, "group-disabled"], [1, "leaf-item", 3, "active"], [1, "menu-group"], [1, "group-header", 3, "click", "matTooltip"], [1, "group-icon"], [1, "group-label"], [1, "disabled-pill"], [1, "expand-icon", 3, "rotated"], [1, "group-children"], [1, "child-item", 3, "active", "ctx-disabled", "matTooltip"], [1, "expand-icon"], [1, "child-item", 3, "click", "matTooltip"], [1, "child-icon"], [1, "child-label"], [1, "child-badge"], [1, "leaf-item", 3, "click"], [1, "leaf-icon"], [1, "leaf-label"]], template: function NavDrawerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, NavDrawerComponent_Conditional_0_Template, 14, 4, "div", 0)(1, NavDrawerComponent_Conditional_1_Template, 5, 0, "div", 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.activeModule ? 0 : 1);
    }
  }, dependencies: [MatIcon, MatIconButton, MatTooltip], styles: ['\n\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n}\n.drawer-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  width: 248px;\n  background: var(--surface);\n}\n.drawer-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 8px 12px 14px;\n  flex-shrink: 0;\n  color: #fff;\n}\n.dh-icon[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.2);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.dh-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #fff;\n}\n.dh-info[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.dh-name[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 13px;\n  font-weight: 700;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dh-toggle[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.75) !important;\n  width: 30px;\n  height: 30px;\n  flex-shrink: 0;\n}\n.dh-toggle[_ngcontent-%COMP%]:hover {\n  color: #fff !important;\n}\n.drawer-menu[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 8px 0 16px;\n}\n.drawer-menu[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.drawer-menu[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.drawer-menu[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #e0e0e0;\n  border-radius: 4px;\n}\n.menu-group[_ngcontent-%COMP%] {\n  margin-bottom: 2px;\n}\n.group-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 9px 12px 9px 14px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  text-align: left;\n  transition: background 0.15s;\n}\n.group-header[_ngcontent-%COMP%]:hover {\n  background: var(--surface-hover);\n}\n.group-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--on-surface-2);\n  flex-shrink: 0;\n}\n.group-label[_ngcontent-%COMP%] {\n  flex: 1;\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--on-surface);\n}\n.expand-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #bdbdbd;\n  transition: transform 0.2s;\n}\n.expand-icon.rotated[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.group-children[_ngcontent-%COMP%] {\n  max-height: 0;\n  overflow: hidden;\n  transition: max-height 0.25s ease;\n}\n.group-children.open[_ngcontent-%COMP%] {\n  max-height: 2000px;\n}\n.child-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 8px 12px 8px 42px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  text-align: left;\n  position: relative;\n  transition: background 0.15s;\n}\n.child-item[_ngcontent-%COMP%]:hover {\n  background: var(--surface-hover);\n}\n.child-item.ctx-disabled[_ngcontent-%COMP%] {\n  opacity: 0.45;\n  cursor: not-allowed !important;\n  background: none !important;\n}\n.child-item.ctx-disabled[_ngcontent-%COMP%]   .child-icon[_ngcontent-%COMP%], \n.child-item.ctx-disabled[_ngcontent-%COMP%]   .child-label[_ngcontent-%COMP%] {\n  color: #94a3b8 !important;\n}\n.child-item.active[_ngcontent-%COMP%] {\n  background: var(--active-bg);\n}\n.child-item.active[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  right: 0;\n  top: 4px;\n  bottom: 4px;\n  width: 3px;\n  background: var(--active-color);\n  border-radius: 3px 0 0 3px;\n}\n.child-item.active[_ngcontent-%COMP%]   .child-icon[_ngcontent-%COMP%], \n.child-item.active[_ngcontent-%COMP%]   .child-label[_ngcontent-%COMP%] {\n  color: var(--active-color);\n}\n.child-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: var(--on-surface-3);\n  flex-shrink: 0;\n}\n.child-label[_ngcontent-%COMP%] {\n  flex: 1;\n  font-size: 13px;\n  color: var(--on-surface);\n}\n.child-badge[_ngcontent-%COMP%] {\n  background: var(--badge-bg);\n  color: #fff;\n  font-size: 10px;\n  font-weight: 700;\n  min-width: 18px;\n  height: 18px;\n  border-radius: 9px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 4px;\n}\n.leaf-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 10px 12px 10px 14px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  text-align: left;\n  transition: background 0.15s;\n}\n.leaf-item[_ngcontent-%COMP%]:hover {\n  background: var(--surface-hover);\n}\n.leaf-item.active[_ngcontent-%COMP%] {\n  background: var(--active-bg);\n}\n.leaf-item.active[_ngcontent-%COMP%]   .leaf-icon[_ngcontent-%COMP%], \n.leaf-item.active[_ngcontent-%COMP%]   .leaf-label[_ngcontent-%COMP%] {\n  color: var(--active-color);\n}\n.leaf-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--on-surface-2);\n  flex-shrink: 0;\n}\n.leaf-label[_ngcontent-%COMP%] {\n  flex: 1;\n  font-size: 13.5px;\n  font-weight: 500;\n  color: var(--on-surface);\n}\n.disabled-pill[_ngcontent-%COMP%] {\n  font-size: 10px;\n  background: #f1f5f9;\n  color: #94a3b8;\n  padding: 2px 6px;\n  border-radius: 4px;\n}\n.empty-drawer[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  color: #94a3b8;\n  gap: 8px;\n  font-size: 13px;\n}\n.empty-drawer[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 32px;\n  width: 32px;\n  height: 32px;\n}\n/*# sourceMappingURL=nav-drawer.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavDrawerComponent, [{
    type: Component,
    args: [{ selector: "app-nav-drawer", standalone: false, template: `@if (activeModule) {\r
  <div class="drawer-container">\r
\r
    <!-- En-t\xEAte color\xE9 du module -->\r
    <div class="drawer-header" style="cursor: pointer;" (click)="navigateToOverview()"\r
         [style.background]="'linear-gradient(135deg, ' + activeModule.gradientFrom + ', ' + activeModule.gradientTo + ')'">\r
      <div class="dh-icon">\r
        <mat-icon>{{ activeModule.icon }}</mat-icon>\r
      </div>\r
      <div class="dh-info">\r
        <span class="dh-name">{{ activeModule.name }}</span>\r
      </div>\r
      <button mat-icon-button class="dh-toggle" (click)="moduleNav.toggleDrawer()"\r
              matTooltip="R\xE9duire">\r
        <mat-icon>chevron_left</mat-icon>\r
      </button>\r
    </div>\r
\r
    <!-- Arbre de menus -->\r
    <div class="drawer-menu">\r
      @for (item of menuItems; track item.id) {\r
        @if (item.children && item.children.length > 0) {\r
\r
          <!-- Groupe avec enfants -->\r
          <div class="menu-group" [class.group-disabled]="item.disabled">\r
            <button class="group-header" \r
                    [class.disabled-btn]="item.disabled"\r
                    [matTooltip]="item.disabled ? 'Fonctionnalit\xE9 non activ\xE9e pour le moment' : ''"\r
                    (click)="item.disabled ? null : toggleItem(item)">\r
              <mat-icon class="group-icon">{{ item.icon }}</mat-icon>\r
              <span class="group-label">{{ item.label }}</span>\r
              @if (item.disabled) {\r
                <span class="disabled-pill">Bient\xF4t</span>\r
              } @else {\r
                <mat-icon class="expand-icon" [class.rotated]="isExpanded(item)">\r
                  expand_more\r
                </mat-icon>\r
              }\r
            </button>\r
            <div class="group-children" [class.open]="!item.disabled && isExpanded(item)">\r
              @for (child of item.children; track child.id) {\r
                <button class="child-item"\r
                        [class.active]="isActiveRoute(child.route)"\r
                        [class.ctx-disabled]="isFicheItem(child) && !isEmployeeSelected"\r
                        [matTooltip]="isFicheItem(child) && !isEmployeeSelected ? 'S\xE9lectionnez ou ouvrez d\\'abord la fiche d\\'un employ\xE9' : ''"\r
                        (click)="(isFicheItem(child) && !isEmployeeSelected) ? null : navigateChild(child.route)">\r
                  <mat-icon class="child-icon">{{ child.icon }}</mat-icon>\r
                  <span class="child-label">{{ child.label }}</span>\r
                  @if (child.badge) {\r
                    <span class="child-badge">{{ child.badge }}</span>\r
                  }\r
                </button>\r
              }\r
            </div>\r
          </div>\r
\r
        } @else {\r
\r
          <!-- \xC9l\xE9ment simple -->\r
          <button class="leaf-item"\r
                  [class.active]="isActiveRoute(item.route)"\r
                  (click)="navigate(item.route)">\r
            <mat-icon class="leaf-icon">{{ item.icon }}</mat-icon>\r
            <span class="leaf-label">{{ item.label }}</span>\r
          </button>\r
\r
        }\r
      }\r
    </div>\r
\r
  </div>\r
} @else {\r
  <div class="empty-drawer">\r
    <mat-icon>apps</mat-icon>\r
    <span>S\xE9lectionnez un module</span>\r
  </div>\r
}\r
`, styles: ['/* src/app/layout/nav-drawer/nav-drawer.component.scss */\n:host {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n}\n.drawer-container {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  width: 248px;\n  background: var(--surface);\n}\n.drawer-header {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 8px 12px 14px;\n  flex-shrink: 0;\n  color: #fff;\n}\n.dh-icon {\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.2);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.dh-icon mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #fff;\n}\n.dh-info {\n  flex: 1;\n  min-width: 0;\n}\n.dh-name {\n  display: block;\n  font-size: 13px;\n  font-weight: 700;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dh-toggle {\n  color: rgba(255, 255, 255, 0.75) !important;\n  width: 30px;\n  height: 30px;\n  flex-shrink: 0;\n}\n.dh-toggle:hover {\n  color: #fff !important;\n}\n.drawer-menu {\n  flex: 1;\n  overflow-y: auto;\n  padding: 8px 0 16px;\n}\n.drawer-menu::-webkit-scrollbar {\n  width: 4px;\n}\n.drawer-menu::-webkit-scrollbar-track {\n  background: transparent;\n}\n.drawer-menu::-webkit-scrollbar-thumb {\n  background: #e0e0e0;\n  border-radius: 4px;\n}\n.menu-group {\n  margin-bottom: 2px;\n}\n.group-header {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 9px 12px 9px 14px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  text-align: left;\n  transition: background 0.15s;\n}\n.group-header:hover {\n  background: var(--surface-hover);\n}\n.group-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--on-surface-2);\n  flex-shrink: 0;\n}\n.group-label {\n  flex: 1;\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--on-surface);\n}\n.expand-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #bdbdbd;\n  transition: transform 0.2s;\n}\n.expand-icon.rotated {\n  transform: rotate(180deg);\n}\n.group-children {\n  max-height: 0;\n  overflow: hidden;\n  transition: max-height 0.25s ease;\n}\n.group-children.open {\n  max-height: 2000px;\n}\n.child-item {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 8px 12px 8px 42px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  text-align: left;\n  position: relative;\n  transition: background 0.15s;\n}\n.child-item:hover {\n  background: var(--surface-hover);\n}\n.child-item.ctx-disabled {\n  opacity: 0.45;\n  cursor: not-allowed !important;\n  background: none !important;\n}\n.child-item.ctx-disabled .child-icon,\n.child-item.ctx-disabled .child-label {\n  color: #94a3b8 !important;\n}\n.child-item.active {\n  background: var(--active-bg);\n}\n.child-item.active::after {\n  content: "";\n  position: absolute;\n  right: 0;\n  top: 4px;\n  bottom: 4px;\n  width: 3px;\n  background: var(--active-color);\n  border-radius: 3px 0 0 3px;\n}\n.child-item.active .child-icon,\n.child-item.active .child-label {\n  color: var(--active-color);\n}\n.child-icon {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: var(--on-surface-3);\n  flex-shrink: 0;\n}\n.child-label {\n  flex: 1;\n  font-size: 13px;\n  color: var(--on-surface);\n}\n.child-badge {\n  background: var(--badge-bg);\n  color: #fff;\n  font-size: 10px;\n  font-weight: 700;\n  min-width: 18px;\n  height: 18px;\n  border-radius: 9px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 4px;\n}\n.leaf-item {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 10px 12px 10px 14px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  text-align: left;\n  transition: background 0.15s;\n}\n.leaf-item:hover {\n  background: var(--surface-hover);\n}\n.leaf-item.active {\n  background: var(--active-bg);\n}\n.leaf-item.active .leaf-icon,\n.leaf-item.active .leaf-label {\n  color: var(--active-color);\n}\n.leaf-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--on-surface-2);\n  flex-shrink: 0;\n}\n.leaf-label {\n  flex: 1;\n  font-size: 13.5px;\n  font-weight: 500;\n  color: var(--on-surface);\n}\n.disabled-pill {\n  font-size: 10px;\n  background: #f1f5f9;\n  color: #94a3b8;\n  padding: 2px 6px;\n  border-radius: 4px;\n}\n.empty-drawer {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  color: #94a3b8;\n  gap: 8px;\n  font-size: 13px;\n}\n.empty-drawer mat-icon {\n  font-size: 32px;\n  width: 32px;\n  height: 32px;\n}\n/*# sourceMappingURL=nav-drawer.component.css.map */\n'] }]
  }], () => [{ type: ModuleNavService }, { type: Router }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavDrawerComponent, { className: "NavDrawerComponent", filePath: "src/app/layout/nav-drawer/nav-drawer.component.ts", lineNumber: 16 });
})();

// src/app/layout/main-layout/main-layout.component.ts
var _c03 = ["leftSidenav"];
var _c13 = ["rightSidenav"];
var _forTrack03 = ($index, $item) => $item.id;
function MainLayoutComponent_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275listener("click", function MainLayoutComponent_For_5_Template_button_click_0_listener() {
      const mod_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.selectModule(mod_r3));
    });
    \u0275\u0275elementStart(2, "div", 14);
    \u0275\u0275pipe(3, "async");
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 15);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_12_0;
    let tmp_13_0;
    const mod_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("--tab-color", mod_r3.color);
    \u0275\u0275classProp("active", ((tmp_12_0 = \u0275\u0275pipeBind1(1, 8, ctx_r3.moduleNav.activeModule$)) == null ? null : tmp_12_0.id) === mod_r3.id);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background", ((tmp_13_0 = \u0275\u0275pipeBind1(3, 10, ctx_r3.moduleNav.activeModule$)) == null ? null : tmp_13_0.id) === mod_r3.id ? "linear-gradient(135deg, " + mod_r3.gradientFrom + ", " + mod_r3.gradientTo + ")" : "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(mod_r3.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mod_r3.shortName);
  }
}
var MainLayoutComponent = class _MainLayoutComponent {
  moduleNav;
  router;
  leftSidenav;
  rightSidenav;
  destroy$ = new Subject();
  constructor(moduleNav, router) {
    this.moduleNav = moduleNav;
    this.router = router;
  }
  ngOnInit() {
    if (!this.moduleNav.activeModule) {
      const grh = this.moduleNav.modules.find((m) => m.id === "grh");
      if (grh)
        this.moduleNav.selectModule(grh);
    }
    this.moduleNav.drawerOpen$.pipe(takeUntil(this.destroy$)).subscribe((open) => {
      if (this.leftSidenav) {
        open ? this.leftSidenav.open() : this.leftSidenav.close();
      }
    });
    this.moduleNav.sidebarOpen$.pipe(takeUntil(this.destroy$)).subscribe((open) => {
      if (this.rightSidenav) {
        open ? this.rightSidenav.open() : this.rightSidenav.close();
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  selectModule(mod) {
    this.moduleNav.selectModule(mod);
    this.router.navigate([mod.route]);
  }
  static \u0275fac = function MainLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MainLayoutComponent)(\u0275\u0275directiveInject(ModuleNavService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MainLayoutComponent, selectors: [["app-main-layout"]], viewQuery: function MainLayoutComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c03, 5);
      \u0275\u0275viewQuery(_c13, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.leftSidenav = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.rightSidenav = _t.first);
    }
  }, standalone: false, decls: 24, vars: 0, consts: [["leftSidenav", ""], [1, "app-shell"], [1, "module-navbar"], [1, "module-tabs"], [1, "module-tab", 3, "active", "--tab-color"], [1, "navbar-right", 2, "display", "flex", "align-items", "center", "gap", "8px"], [1, "nav-home-link", 2, "background", "#0060B3", "color", "white", "border-radius", "8px", "font-weight", "700", "padding", "4px 12px", "display", "flex", "align-items", "center", "gap", "6px", "cursor", "pointer", 3, "click"], [2, "font-size", "18px", "width", "18px", "height", "18px"], [1, "nav-home-link", 3, "click"], ["autosize", "", 1, "sidenav-container"], ["mode", "side", "opened", "", 1, "left-sidenav"], [1, "main-content"], [1, "page-wrapper"], [1, "module-tab", 3, "click"], [1, "tab-icon"], [1, "tab-label"]], template: function MainLayoutComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1);
      \u0275\u0275element(1, "app-toolbar");
      \u0275\u0275elementStart(2, "div", 2)(3, "div", 3);
      \u0275\u0275repeaterCreate(4, MainLayoutComponent_For_5_Template, 8, 12, "button", 4, _forTrack03);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 5)(7, "a", 6);
      \u0275\u0275listener("click", function MainLayoutComponent_Template_a_click_7_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.router.navigate(["/mon-espace"]));
      });
      \u0275\u0275elementStart(8, "mat-icon", 7);
      \u0275\u0275text(9, "badge");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "span");
      \u0275\u0275text(11, "Mon Espace");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "a", 8);
      \u0275\u0275listener("click", function MainLayoutComponent_Template_a_click_12_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.router.navigate(["/dashboard"]));
      });
      \u0275\u0275elementStart(13, "mat-icon");
      \u0275\u0275text(14, "dashboard");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "span");
      \u0275\u0275text(16, "Accueil");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(17, "mat-sidenav-container", 9)(18, "mat-sidenav", 10, 0);
      \u0275\u0275element(20, "app-nav-drawer");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "mat-sidenav-content", 11)(22, "div", 12);
      \u0275\u0275element(23, "router-outlet");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.moduleNav.modules);
    }
  }, dependencies: [RouterOutlet, MatSidenav, MatSidenavContainer, MatSidenavContent, MatIcon, ToolbarComponent, NavDrawerComponent, AsyncPipe], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  height: 100vh;\n  overflow: hidden;\n}\n.app-shell[_ngcontent-%COMP%] {\n  height: 100vh;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.module-navbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--nav-bg);\n  border-bottom: 1px solid var(--border);\n  padding: 0 16px;\n  height: 52px;\n  flex-shrink: 0;\n  box-shadow: var(--shadow-nav);\n  z-index: 50;\n  position: relative;\n}\n.module-tabs[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  height: 100%;\n}\n.module-tab[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  justify-content: center;\n  gap: 3px;\n  padding: 0 18px;\n  height: 100%;\n  background: none;\n  border: none;\n  border-bottom: 2px solid transparent;\n  cursor: pointer;\n  border-radius: 0;\n  transition: all 0.2s;\n  position: relative;\n  white-space: nowrap;\n}\n.module-tab[_ngcontent-%COMP%]:hover:not(.active) {\n  background: var(--surface-hover);\n}\n.module-tab.active[_ngcontent-%COMP%] {\n  border-bottom: 2.5px solid #0060B3;\n  background: rgba(0, 96, 179, 0.08);\n}\n.tab-icon[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s;\n  background: transparent;\n}\n.tab-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--on-surface-3);\n  transition: color 0.2s;\n}\n.module-tab.active[_ngcontent-%COMP%]   .tab-icon[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #0060B3,\n      #004885) !important;\n  box-shadow: 0 2px 6px rgba(0, 96, 179, 0.35);\n}\n.module-tab.active[_ngcontent-%COMP%]   .tab-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #ffffff !important;\n}\n.module-tab[_ngcontent-%COMP%]:hover:not(.active)   .tab-icon[_ngcontent-%COMP%] {\n  background: var(--surface-hover);\n}\n.tab-label[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--on-surface-3);\n  letter-spacing: 0.3px;\n  transition: color 0.2s;\n  line-height: 1;\n}\n.module-tab.active[_ngcontent-%COMP%]   .tab-label[_ngcontent-%COMP%] {\n  color: #0060B3;\n  font-weight: 700;\n}\n.navbar-right[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  position: absolute;\n  right: 16px;\n}\n.nav-home-link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 6px 12px;\n  border-radius: 8px;\n  cursor: pointer;\n  color: var(--on-surface-2);\n  font-size: 13px;\n  font-weight: 500;\n  transition: all 0.15s;\n  text-decoration: none;\n}\n.nav-home-link[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 17px;\n  width: 17px;\n  height: 17px;\n}\n.nav-home-link[_ngcontent-%COMP%]:hover {\n  background: var(--surface-hover);\n  color: var(--on-surface);\n}\n.sidenav-container[_ngcontent-%COMP%] {\n  flex: 1;\n  min-height: 0;\n  position: relative;\n  z-index: 10;\n}\n.sidenav-container[_ngcontent-%COMP%]     .mat-drawer-content, \n.sidenav-container[_ngcontent-%COMP%]     .mat-sidenav-content {\n  z-index: auto !important;\n}\n.app-shell[_ngcontent-%COMP%]:has(.custom-modal-overlay)   .sidenav-container[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-backdrop)   .sidenav-container[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.bulletin-modal-overlay)   .sidenav-container[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-backdrop-custom)   .sidenav-container[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.session-modal-dialog)   .sidenav-container[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-container)   .sidenav-container[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-card)   .sidenav-container[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has([class*=modal-backdrop])   .sidenav-container[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has([class*=modal-overlay])   .sidenav-container[_ngcontent-%COMP%] {\n  z-index: 999999 !important;\n}\n.app-shell[_ngcontent-%COMP%]:has(.custom-modal-overlay)   .module-navbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-backdrop)   .module-navbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.bulletin-modal-overlay)   .module-navbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-backdrop-custom)   .module-navbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.session-modal-dialog)   .module-navbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-container)   .module-navbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-card)   .module-navbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has([class*=modal-backdrop])   .module-navbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has([class*=modal-overlay])   .module-navbar[_ngcontent-%COMP%] {\n  z-index: 1 !important;\n}\n.app-shell[_ngcontent-%COMP%]:has(.custom-modal-overlay)   app-toolbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-backdrop)   app-toolbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.bulletin-modal-overlay)   app-toolbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-backdrop-custom)   app-toolbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.session-modal-dialog)   app-toolbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-container)   app-toolbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has(.modal-card)   app-toolbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has([class*=modal-backdrop])   app-toolbar[_ngcontent-%COMP%], \n.app-shell[_ngcontent-%COMP%]:has([class*=modal-overlay])   app-toolbar[_ngcontent-%COMP%] {\n  z-index: 1 !important;\n}\n.left-sidenav[_ngcontent-%COMP%] {\n  width: auto;\n  border-right: none;\n  overflow: visible;\n  box-shadow: var(--shadow-sidenav);\n  z-index: 50 !important;\n}\n.right-sidenav[_ngcontent-%COMP%] {\n  width: 280px;\n  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.12);\n  z-index: 50 !important;\n}\n.main-content[_ngcontent-%COMP%] {\n  background: var(--app-bg);\n  overflow-y: auto;\n  z-index: auto !important;\n}\n.page-wrapper[_ngcontent-%COMP%] {\n  min-height: 100%;\n  padding: 24px;\n}\n@media (max-width: 900px) {\n  .module-tab[_ngcontent-%COMP%] {\n    padding: 0 12px;\n    min-width: 60px;\n  }\n  .nav-home-link[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n@media (max-width: 480px) {\n  .module-tab[_ngcontent-%COMP%] {\n    padding: 0 8px;\n    min-width: 52px;\n  }\n  .tab-icon[_ngcontent-%COMP%] {\n    width: 28px;\n    height: 28px;\n    border-radius: 8px;\n  }\n  .tab-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n    font-size: 16px;\n    width: 16px;\n    height: 16px;\n  }\n  .tab-label[_ngcontent-%COMP%] {\n    font-size: 9px;\n  }\n}\n@media (max-width: 600px) {\n  .page-wrapper[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n}\n/*# sourceMappingURL=main-layout.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MainLayoutComponent, [{
    type: Component,
    args: [{ selector: "app-main-layout", standalone: false, template: `<div class="app-shell">\r
\r
  <!-- \u2460 Toolbar fixe en haut -->\r
  <app-toolbar></app-toolbar>\r
\r
  <!-- \u2461 Barre de navigation des modules (sous la toolbar) -->\r
  <div class="module-navbar">\r
    <div class="module-tabs">\r
      @for (mod of moduleNav.modules; track mod.id) {\r
        <button class="module-tab"\r
                [class.active]="(moduleNav.activeModule$ | async)?.id === mod.id"\r
                [style.--tab-color]="mod.color"\r
                (click)="selectModule(mod)">\r
          <div class="tab-icon"\r
               [style.background]="(moduleNav.activeModule$ | async)?.id === mod.id\r
                 ? 'linear-gradient(135deg, ' + mod.gradientFrom + ', ' + mod.gradientTo + ')'\r
                 : ''">\r
            <mat-icon>{{ mod.icon }}</mat-icon>\r
          </div>\r
          <span class="tab-label">{{ mod.shortName }}</span>\r
        </button>\r
      }\r
    </div>\r
\r
    <div class="navbar-right" style="display: flex; align-items: center; gap: 8px;">\r
      <a class="nav-home-link" (click)="router.navigate(['/mon-espace'])"\r
         style="background: #0060B3; color: white; border-radius: 8px; font-weight: 700; padding: 4px 12px; display: flex; align-items: center; gap: 6px; cursor: pointer;">\r
        <mat-icon style="font-size: 18px; width: 18px; height: 18px;">badge</mat-icon>\r
        <span>Mon Espace</span>\r
      </a>\r
      <a class="nav-home-link" (click)="router.navigate(['/dashboard'])">\r
        <mat-icon>dashboard</mat-icon>\r
        <span>Accueil</span>\r
      </a>\r
    </div>\r
  </div>\r
\r
  <!-- \u2462 Zone principale : Drawer gauche + Contenu -->\r
  <mat-sidenav-container class="sidenav-container" autosize>\r
\r
    <!-- Drawer gauche : menu du module actif -->\r
    <mat-sidenav #leftSidenav mode="side" opened class="left-sidenav">\r
      <app-nav-drawer></app-nav-drawer>\r
    </mat-sidenav>\r
\r
    <!-- Contenu principal -->\r
    <mat-sidenav-content class="main-content">\r
      <div class="page-wrapper">\r
        <router-outlet></router-outlet>\r
      </div>\r
    </mat-sidenav-content>\r
\r
  </mat-sidenav-container>\r
</div>\r
`, styles: ["/* src/app/layout/main-layout/main-layout.component.scss */\n:host {\n  display: block;\n  height: 100vh;\n  overflow: hidden;\n}\n.app-shell {\n  height: 100vh;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.module-navbar {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--nav-bg);\n  border-bottom: 1px solid var(--border);\n  padding: 0 16px;\n  height: 52px;\n  flex-shrink: 0;\n  box-shadow: var(--shadow-nav);\n  z-index: 50;\n  position: relative;\n}\n.module-tabs {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  height: 100%;\n}\n.module-tab {\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  justify-content: center;\n  gap: 3px;\n  padding: 0 18px;\n  height: 100%;\n  background: none;\n  border: none;\n  border-bottom: 2px solid transparent;\n  cursor: pointer;\n  border-radius: 0;\n  transition: all 0.2s;\n  position: relative;\n  white-space: nowrap;\n}\n.module-tab:hover:not(.active) {\n  background: var(--surface-hover);\n}\n.module-tab.active {\n  border-bottom: 2.5px solid #0060B3;\n  background: rgba(0, 96, 179, 0.08);\n}\n.tab-icon {\n  width: 28px;\n  height: 28px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s;\n  background: transparent;\n}\n.tab-icon mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--on-surface-3);\n  transition: color 0.2s;\n}\n.module-tab.active .tab-icon {\n  background:\n    linear-gradient(\n      135deg,\n      #0060B3,\n      #004885) !important;\n  box-shadow: 0 2px 6px rgba(0, 96, 179, 0.35);\n}\n.module-tab.active .tab-icon mat-icon {\n  color: #ffffff !important;\n}\n.module-tab:hover:not(.active) .tab-icon {\n  background: var(--surface-hover);\n}\n.tab-label {\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--on-surface-3);\n  letter-spacing: 0.3px;\n  transition: color 0.2s;\n  line-height: 1;\n}\n.module-tab.active .tab-label {\n  color: #0060B3;\n  font-weight: 700;\n}\n.navbar-right {\n  display: flex;\n  align-items: center;\n  position: absolute;\n  right: 16px;\n}\n.nav-home-link {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 6px 12px;\n  border-radius: 8px;\n  cursor: pointer;\n  color: var(--on-surface-2);\n  font-size: 13px;\n  font-weight: 500;\n  transition: all 0.15s;\n  text-decoration: none;\n}\n.nav-home-link mat-icon {\n  font-size: 17px;\n  width: 17px;\n  height: 17px;\n}\n.nav-home-link:hover {\n  background: var(--surface-hover);\n  color: var(--on-surface);\n}\n.sidenav-container {\n  flex: 1;\n  min-height: 0;\n  position: relative;\n  z-index: 10;\n}\n.sidenav-container ::ng-deep .mat-drawer-content,\n.sidenav-container ::ng-deep .mat-sidenav-content {\n  z-index: auto !important;\n}\n.app-shell:has(.custom-modal-overlay) .sidenav-container,\n.app-shell:has(.modal-backdrop) .sidenav-container,\n.app-shell:has(.bulletin-modal-overlay) .sidenav-container,\n.app-shell:has(.modal-backdrop-custom) .sidenav-container,\n.app-shell:has(.session-modal-dialog) .sidenav-container,\n.app-shell:has(.modal-container) .sidenav-container,\n.app-shell:has(.modal-card) .sidenav-container,\n.app-shell:has([class*=modal-backdrop]) .sidenav-container,\n.app-shell:has([class*=modal-overlay]) .sidenav-container {\n  z-index: 999999 !important;\n}\n.app-shell:has(.custom-modal-overlay) .module-navbar,\n.app-shell:has(.modal-backdrop) .module-navbar,\n.app-shell:has(.bulletin-modal-overlay) .module-navbar,\n.app-shell:has(.modal-backdrop-custom) .module-navbar,\n.app-shell:has(.session-modal-dialog) .module-navbar,\n.app-shell:has(.modal-container) .module-navbar,\n.app-shell:has(.modal-card) .module-navbar,\n.app-shell:has([class*=modal-backdrop]) .module-navbar,\n.app-shell:has([class*=modal-overlay]) .module-navbar {\n  z-index: 1 !important;\n}\n.app-shell:has(.custom-modal-overlay) app-toolbar,\n.app-shell:has(.modal-backdrop) app-toolbar,\n.app-shell:has(.bulletin-modal-overlay) app-toolbar,\n.app-shell:has(.modal-backdrop-custom) app-toolbar,\n.app-shell:has(.session-modal-dialog) app-toolbar,\n.app-shell:has(.modal-container) app-toolbar,\n.app-shell:has(.modal-card) app-toolbar,\n.app-shell:has([class*=modal-backdrop]) app-toolbar,\n.app-shell:has([class*=modal-overlay]) app-toolbar {\n  z-index: 1 !important;\n}\n.left-sidenav {\n  width: auto;\n  border-right: none;\n  overflow: visible;\n  box-shadow: var(--shadow-sidenav);\n  z-index: 50 !important;\n}\n.right-sidenav {\n  width: 280px;\n  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.12);\n  z-index: 50 !important;\n}\n.main-content {\n  background: var(--app-bg);\n  overflow-y: auto;\n  z-index: auto !important;\n}\n.page-wrapper {\n  min-height: 100%;\n  padding: 24px;\n}\n@media (max-width: 900px) {\n  .module-tab {\n    padding: 0 12px;\n    min-width: 60px;\n  }\n  .nav-home-link span {\n    display: none;\n  }\n}\n@media (max-width: 480px) {\n  .module-tab {\n    padding: 0 8px;\n    min-width: 52px;\n  }\n  .tab-icon {\n    width: 28px;\n    height: 28px;\n    border-radius: 8px;\n  }\n  .tab-icon mat-icon {\n    font-size: 16px;\n    width: 16px;\n    height: 16px;\n  }\n  .tab-label {\n    font-size: 9px;\n  }\n}\n@media (max-width: 600px) {\n  .page-wrapper {\n    padding: 16px;\n  }\n}\n/*# sourceMappingURL=main-layout.component.css.map */\n"] }]
  }], () => [{ type: ModuleNavService }, { type: Router }], { leftSidenav: [{
    type: ViewChild,
    args: ["leftSidenav"]
  }], rightSidenav: [{
    type: ViewChild,
    args: ["rightSidenav"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MainLayoutComponent, { className: "MainLayoutComponent", filePath: "src/app/layout/main-layout/main-layout.component.ts", lineNumber: 15 });
})();

// src/app/core/guards/auth.guard.ts
var AuthGuard = class _AuthGuard {
  authService;
  router;
  snackBar;
  constructor(authService, router, snackBar) {
    this.authService = authService;
    this.router = router;
    this.snackBar = snackBar;
  }
  canActivate(route, state) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/auth/login"]);
      return false;
    }
    const url = state.url;
    const role = this.authService.currentUser?.role;
    if (this.authService.isAgentRole(role) && !url.includes("/mon-espace")) {
      this.router.navigate(["/mon-espace"]);
      return false;
    }
    if (url.startsWith("/donnees-base") && !this.authService.hasPermission("DB_VIEW") && !this.authService.hasPermission("donnees-base.view")) {
      this.denyAccess("Donn\xE9es de Base");
      return false;
    }
    if (url.startsWith("/paie") && !this.authService.hasPermission("PAIE_VIEW") && !this.authService.hasPermission("paie.view")) {
      this.denyAccess("Gestion de la Paie");
      return false;
    }
    if (url.startsWith("/grh") && !this.authService.hasPermission("EMP_VIEW") && !this.authService.hasPermission("grh.view")) {
      this.denyAccess("GRH & Employ\xE9s");
      return false;
    }
    if (url.startsWith("/profils") && !this.authService.hasPermission("PROFIL_EDIT") && !this.authService.hasPermission("USER_MANAGE") && !this.authService.hasPermission("profils.view")) {
      this.denyAccess("Profils & Habilitations");
      return false;
    }
    return true;
  }
  denyAccess(moduleName) {
    this.snackBar.open(`Acc\xE8s refus\xE9 : votre r\xF4le ne poss\xE8de pas les habilitations pour le module ${moduleName}.`, "Fermer", { duration: 5e3, horizontalPosition: "center", verticalPosition: "top" });
    this.router.navigate(["/dashboard"]);
  }
  static \u0275fac = function AuthGuard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthGuard)(\u0275\u0275inject(AuthService), \u0275\u0275inject(Router), \u0275\u0275inject(MatSnackBar));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthGuard, factory: _AuthGuard.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthGuard, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: AuthService }, { type: Router }, { type: MatSnackBar }], null);
})();

// src/app/app-routing-module.ts
var routes = [
  {
    path: "auth",
    loadChildren: () => import("./chunk-XYYLTUD3.js").then((m) => m.AuthModule)
  },
  {
    path: "maintenance",
    loadComponent: () => import("./chunk-E3TPVYJS.js").then((m) => m.MaintenanceComponent)
  },
  {
    // Portail Employé - route autonome sans sidebar
    path: "mon-espace",
    canActivate: [AuthGuard],
    loadChildren: () => import("./chunk-6AEWAZUE.js").then((m) => m.MonEspaceModule)
  },
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () => import("./chunk-FTNWXSVV.js").then((m) => m.DashboardModule)
      },
      {
        path: "grh",
        loadChildren: () => import("./chunk-NLOCBPTV.js").then((m) => m.GrhModule)
      },
      {
        path: "carrieres",
        loadChildren: () => import("./chunk-K5UDLUWZ.js").then((m) => m.CarrieresModule)
      },
      {
        path: "paie",
        loadChildren: () => import("./chunk-O7X2MKG6.js").then((m) => m.PaieModule)
      },
      {
        path: "donnees-base",
        loadChildren: () => import("./chunk-3J6TOL5W.js").then((m) => m.DonneesBaseModule)
      },
      {
        path: "profils",
        loadChildren: () => import("./chunk-OBBG7VD4.js").then((m) => m.ProfilsModule)
      },
      { path: "", redirectTo: "dashboard", pathMatch: "full" }
    ]
  },
  { path: "**", redirectTo: "dashboard" }
];
var AppRoutingModule = class _AppRoutingModule {
  static \u0275fac = function AppRoutingModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppRoutingModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AppRoutingModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forRoot(routes), RouterModule] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule]
    }]
  }], null, null);
})();

// src/app/core/services/inactivity.service.ts
var InactivityService = class _InactivityService {
  authService;
  router;
  snackBar;
  ngZone;
  // Délai d'inactivité avant déconnexion automatique (15 minutes en millisecondes)
  INACTIVITY_TIMEOUT = 15 * 60 * 1e3;
  timer;
  isListening = false;
  userEvents = [
    "mousemove",
    "keydown",
    "click",
    "scroll",
    "touchstart"
  ];
  constructor(authService, router, snackBar, ngZone) {
    this.authService = authService;
    this.router = router;
    this.snackBar = snackBar;
    this.ngZone = ngZone;
    this.initInactivityTracker();
  }
  initInactivityTracker() {
    if (this.isListening)
      return;
    this.isListening = true;
    this.ngZone.runOutsideAngular(() => {
      this.userEvents.forEach((event) => {
        window.addEventListener(event, () => this.resetTimer(), { passive: true });
      });
    });
    this.resetTimer();
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.resetTimer();
      } else {
        this.clearTimer();
      }
    });
  }
  resetTimer() {
    this.clearTimer();
    if (!this.authService.isAuthenticated())
      return;
    this.ngZone.runOutsideAngular(() => {
      this.timer = setTimeout(() => {
        this.ngZone.run(() => {
          this.handleInactivityLogout();
        });
      }, this.INACTIVITY_TIMEOUT);
    });
  }
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  handleInactivityLogout() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
      this.snackBar.open("Session expir\xE9e apr\xE8s 15 minutes d'inactivit\xE9. Veuillez vous reconnecter.", "Fermer", {
        duration: 7e3,
        horizontalPosition: "center",
        verticalPosition: "top",
        panelClass: ["warn-snackbar"]
      });
      this.router.navigate(["/auth/login"], {
        queryParams: { sessionExpired: "inactivity" }
      });
    }
  }
  static \u0275fac = function InactivityService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InactivityService)(\u0275\u0275inject(AuthService), \u0275\u0275inject(Router), \u0275\u0275inject(MatSnackBar), \u0275\u0275inject(NgZone));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _InactivityService, factory: _InactivityService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InactivityService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: AuthService }, { type: Router }, { type: MatSnackBar }, { type: NgZone }], null);
})();

// src/app/app.ts
var App = class _App {
  inactivityService;
  constructor(inactivityService) {
    this.inactivityService = inactivityService;
  }
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)(\u0275\u0275directiveInject(InactivityService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], standalone: false, decls: 1, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ selector: "app-root", standalone: false, template: "<router-outlet></router-outlet>\r\n" }]
  }], () => [{ type: InactivityService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 10 });
})();

// src/app/core/core.module.ts
var CoreModule = class _CoreModule {
  static \u0275fac = function CoreModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CoreModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _CoreModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [CommonModule] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CoreModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule]
    }]
  }], null, null);
})();

// src/app/layout/sidebar/sidebar.component.ts
var _forTrack04 = ($index, $item) => $item.route;
var _forTrack1 = ($index, $item) => $item.id;
function SidebarComponent_For_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function SidebarComponent_For_13_Template_button_click_0_listener() {
      const link_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.navigate(link_r2.route));
    });
    \u0275\u0275elementStart(1, "div", 13)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span", 14);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const link_r2 = ctx.$implicit;
    \u0275\u0275property("matTooltip", link_r2.label);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", link_r2.color + "1A")("color", link_r2.color);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(link_r2.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(link_r2.label);
  }
}
function SidebarComponent_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 15);
    \u0275\u0275listener("click", function SidebarComponent_For_20_Template_button_click_0_listener() {
      const mod_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.navigate(mod_r5.route));
    });
    \u0275\u0275elementStart(1, "div", 16)(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 17)(5, "span", 18);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 19);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const mod_r5 = ctx.$implicit;
    \u0275\u0275styleProp("--mod-color", mod_r5.color);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", "linear-gradient(135deg, " + mod_r5.gradientFrom + ", " + mod_r5.gradientTo + ")");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mod_r5.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(mod_r5.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mod_r5.description);
  }
}
var SidebarComponent = class _SidebarComponent {
  moduleNav;
  router;
  constructor(moduleNav, router) {
    this.moduleNav = moduleNav;
    this.router = router;
  }
  navigate(route) {
    this.router.navigate([route]);
  }
  close() {
    this.moduleNav.toggleSidebar();
  }
  static \u0275fac = function SidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarComponent)(\u0275\u0275directiveInject(ModuleNavService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SidebarComponent, selectors: [["app-sidebar"]], standalone: false, decls: 40, vars: 0, consts: [[1, "sidebar-container"], [1, "sidebar-header"], [1, "sidebar-title"], ["mat-icon-button", "", 1, "close-btn", 3, "click"], [1, "sidebar-section"], [1, "section-label"], [1, "quick-links-grid"], [1, "quick-link-btn", 3, "matTooltip"], [1, "modules-list"], [1, "module-shortcut", 3, "--mod-color"], [1, "action-link", 3, "click"], [1, "action-link"], [1, "quick-link-btn", 3, "click", "matTooltip"], [1, "ql-icon"], [1, "ql-label"], [1, "module-shortcut", 3, "click"], [1, "ms-icon"], [1, "ms-info"], [1, "ms-name"], [1, "ms-desc"]], template: function SidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "span", 2);
      \u0275\u0275text(3, "Raccourcis");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "button", 3);
      \u0275\u0275listener("click", function SidebarComponent_Template_button_click_4_listener() {
        return ctx.close();
      });
      \u0275\u0275elementStart(5, "mat-icon");
      \u0275\u0275text(6, "close");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(7, "mat-divider");
      \u0275\u0275elementStart(8, "div", 4)(9, "div", 5);
      \u0275\u0275text(10, "Acc\xE8s rapide");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 6);
      \u0275\u0275repeaterCreate(12, SidebarComponent_For_13_Template, 6, 7, "button", 7, _forTrack04);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(14, "mat-divider");
      \u0275\u0275elementStart(15, "div", 4)(16, "div", 5);
      \u0275\u0275text(17, "Modules");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 8);
      \u0275\u0275repeaterCreate(19, SidebarComponent_For_20_Template, 9, 7, "button", 9, _forTrack1);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(21, "mat-divider");
      \u0275\u0275elementStart(22, "div", 4)(23, "div", 5);
      \u0275\u0275text(24, "Tableau de bord");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "button", 10);
      \u0275\u0275listener("click", function SidebarComponent_Template_button_click_25_listener() {
        return ctx.navigate("/dashboard");
      });
      \u0275\u0275elementStart(26, "mat-icon");
      \u0275\u0275text(27, "dashboard");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "span");
      \u0275\u0275text(29, "Vue d'ensemble");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "button", 11)(31, "mat-icon");
      \u0275\u0275text(32, "bar_chart");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "span");
      \u0275\u0275text(34, "Rapports & analyses");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "button", 11)(36, "mat-icon");
      \u0275\u0275text(37, "help_outline");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "span");
      \u0275\u0275text(39, "Aide & documentation");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(12);
      \u0275\u0275repeater(ctx.moduleNav.quickLinks);
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.moduleNav.modules);
    }
  }, dependencies: [MatIcon, MatIconButton, MatDivider, MatTooltip], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n}\n.sidebar-container[_ngcontent-%COMP%] {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  background: var(--surface);\n  overflow-y: auto;\n}\n.sidebar-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 8px 12px 16px;\n  flex-shrink: 0;\n}\n.sidebar-title[_ngcontent-%COMP%] {\n  font-size: 15px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.close-btn[_ngcontent-%COMP%] {\n  color: #5f6368;\n}\n.sidebar-section[_ngcontent-%COMP%] {\n  padding: 12px;\n}\n.section-label[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 700;\n  color: #9e9e9e;\n  text-transform: uppercase;\n  letter-spacing: 0.8px;\n  padding: 4px 4px 8px;\n}\n.quick-links-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n}\n.quick-link-btn[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  padding: 12px 8px;\n  background: var(--surface-variant);\n  border: none;\n  border-radius: 12px;\n  cursor: pointer;\n  transition: all 0.2s;\n  text-align: center;\n}\n.quick-link-btn[_ngcontent-%COMP%]:hover {\n  background: var(--surface-hover);\n  transform: translateY(-1px);\n}\n.ql-icon[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ql-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.ql-label[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--on-surface);\n  line-height: 1.2;\n}\n.modules-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.module-shortcut[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 10px;\n  background: none;\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  cursor: pointer;\n  transition: all 0.2s;\n  text-align: left;\n}\n.module-shortcut[_ngcontent-%COMP%]:hover {\n  background: var(--surface-hover);\n  border-color: var(--mod-color, #0060B3);\n}\n.ms-icon[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 9px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.ms-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #fff;\n}\n.ms-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.ms-name[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--on-surface);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.ms-desc[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--on-surface-3);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  margin-top: 1px;\n}\n.action-link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 9px 8px;\n  background: none;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: background 0.15s;\n  text-align: left;\n  color: var(--on-surface);\n  font-size: 13px;\n}\n.action-link[_ngcontent-%COMP%]:hover {\n  background: var(--surface-hover);\n}\n.action-link[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--on-surface-2);\n}\n.sidebar-container[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.sidebar-container[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.sidebar-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #e0e0e0;\n  border-radius: 4px;\n}\n/*# sourceMappingURL=sidebar.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarComponent, [{
    type: Component,
    args: [{ selector: "app-sidebar", standalone: false, template: `<div class="sidebar-container">\r
  <div class="sidebar-header">\r
    <span class="sidebar-title">Raccourcis</span>\r
    <button mat-icon-button class="close-btn" (click)="close()">\r
      <mat-icon>close</mat-icon>\r
    </button>\r
  </div>\r
\r
  <mat-divider></mat-divider>\r
\r
  <div class="sidebar-section">\r
    <div class="section-label">Acc\xE8s rapide</div>\r
    <div class="quick-links-grid">\r
      @for (link of moduleNav.quickLinks; track link.route) {\r
        <button class="quick-link-btn" (click)="navigate(link.route)" [matTooltip]="link.label">\r
          <div class="ql-icon" [style.background-color]="link.color + '1A'" [style.color]="link.color">\r
            <mat-icon>{{ link.icon }}</mat-icon>\r
          </div>\r
          <span class="ql-label">{{ link.label }}</span>\r
        </button>\r
      }\r
    </div>\r
  </div>\r
\r
  <mat-divider></mat-divider>\r
\r
  <div class="sidebar-section">\r
    <div class="section-label">Modules</div>\r
    <div class="modules-list">\r
      @for (mod of moduleNav.modules; track mod.id) {\r
        <button class="module-shortcut" [style.--mod-color]="mod.color" (click)="navigate(mod.route)">\r
          <div class="ms-icon"\r
               [style.background]="'linear-gradient(135deg, ' + mod.gradientFrom + ', ' + mod.gradientTo + ')'">\r
            <mat-icon>{{ mod.icon }}</mat-icon>\r
          </div>\r
          <div class="ms-info">\r
            <span class="ms-name">{{ mod.name }}</span>\r
            <span class="ms-desc">{{ mod.description }}</span>\r
          </div>\r
        </button>\r
      }\r
    </div>\r
  </div>\r
\r
  <mat-divider></mat-divider>\r
\r
  <div class="sidebar-section">\r
    <div class="section-label">Tableau de bord</div>\r
    <button class="action-link" (click)="navigate('/dashboard')">\r
      <mat-icon>dashboard</mat-icon>\r
      <span>Vue d'ensemble</span>\r
    </button>\r
    <button class="action-link">\r
      <mat-icon>bar_chart</mat-icon>\r
      <span>Rapports & analyses</span>\r
    </button>\r
    <button class="action-link">\r
      <mat-icon>help_outline</mat-icon>\r
      <span>Aide & documentation</span>\r
    </button>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/layout/sidebar/sidebar.component.scss */\n:host {\n  display: block;\n  height: 100%;\n}\n.sidebar-container {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  background: var(--surface);\n  overflow-y: auto;\n}\n.sidebar-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 8px 12px 16px;\n  flex-shrink: 0;\n}\n.sidebar-title {\n  font-size: 15px;\n  font-weight: 700;\n  color: var(--on-surface);\n}\n.close-btn {\n  color: #5f6368;\n}\n.sidebar-section {\n  padding: 12px;\n}\n.section-label {\n  font-size: 11px;\n  font-weight: 700;\n  color: #9e9e9e;\n  text-transform: uppercase;\n  letter-spacing: 0.8px;\n  padding: 4px 4px 8px;\n}\n.quick-links-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n}\n.quick-link-btn {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  padding: 12px 8px;\n  background: var(--surface-variant);\n  border: none;\n  border-radius: 12px;\n  cursor: pointer;\n  transition: all 0.2s;\n  text-align: center;\n}\n.quick-link-btn:hover {\n  background: var(--surface-hover);\n  transform: translateY(-1px);\n}\n.ql-icon {\n  width: 40px;\n  height: 40px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ql-icon mat-icon {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.ql-label {\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--on-surface);\n  line-height: 1.2;\n}\n.modules-list {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.module-shortcut {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 10px;\n  background: none;\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  cursor: pointer;\n  transition: all 0.2s;\n  text-align: left;\n}\n.module-shortcut:hover {\n  background: var(--surface-hover);\n  border-color: var(--mod-color, #0060B3);\n}\n.ms-icon {\n  width: 36px;\n  height: 36px;\n  border-radius: 9px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.ms-icon mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #fff;\n}\n.ms-info {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.ms-name {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--on-surface);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.ms-desc {\n  font-size: 11px;\n  color: var(--on-surface-3);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  margin-top: 1px;\n}\n.action-link {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 9px 8px;\n  background: none;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: background 0.15s;\n  text-align: left;\n  color: var(--on-surface);\n  font-size: 13px;\n}\n.action-link:hover {\n  background: var(--surface-hover);\n}\n.action-link mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--on-surface-2);\n}\n.sidebar-container::-webkit-scrollbar {\n  width: 4px;\n}\n.sidebar-container::-webkit-scrollbar-track {\n  background: transparent;\n}\n.sidebar-container::-webkit-scrollbar-thumb {\n  background: #e0e0e0;\n  border-radius: 4px;\n}\n/*# sourceMappingURL=sidebar.component.css.map */\n"] }]
  }], () => [{ type: ModuleNavService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SidebarComponent, { className: "SidebarComponent", filePath: "src/app/layout/sidebar/sidebar.component.ts", lineNumber: 11 });
})();

// src/app/layout/layout.module.ts
var LayoutModule = class _LayoutModule {
  static \u0275fac = function LayoutModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _LayoutModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule,
    MatListModule,
    MatRippleModule
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutModule, [{
    type: NgModule,
    args: [{
      declarations: [
        ToolbarComponent,
        NavDrawerComponent,
        SidebarComponent,
        MainLayoutComponent
      ],
      imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatBadgeModule,
        MatDividerModule,
        MatTooltipModule,
        MatListModule,
        MatRippleModule
      ],
      exports: [MainLayoutComponent]
    }]
  }], null, null);
})();

// src/app/app-module.ts
var AppModule = class _AppModule {
  static \u0275fac = function AppModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AppModule, bootstrap: [App] });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: "fr" }
  ], imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    LayoutModule
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppModule, [{
    type: NgModule,
    args: [{
      declarations: [App],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule,
        LayoutModule
      ],
      providers: [
        provideBrowserGlobalErrorListeners(),
        provideHttpClient(),
        { provide: LOCALE_ID, useValue: "fr" }
      ],
      bootstrap: [App]
    }]
  }], null, null);
})();

// src/main.ts
registerLocaleData(fr_default, "fr");
platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
}).catch((err) => console.error(err));
/*! Bundled license information:

@angular/animations/fesm2022/private_export.mjs:
@angular/animations/fesm2022/util.mjs:
@angular/animations/fesm2022/browser.mjs:
@angular/platform-browser/fesm2022/animations.mjs:
  (**
   * @license Angular v20.3.25
   * (c) 2010-2025 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
//# sourceMappingURL=main.js.map
