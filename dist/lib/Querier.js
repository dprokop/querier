"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var QuerierLogger_1 = require("./QuerierLogger");
var types_1 = require("./types");
var Querier = /** @class */ (function () {
    // tslint:disable-next-line
    function Querier(store, dispatch) {
        this.logger = new QuerierLogger_1.QuerierLogger();
        this.store = store || {};
        this.listeners = new Map();
        this.reduxDispatch = dispatch;
        this.sendQuery = this.sendQuery.bind(this);
        this.notify = this.notify.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.getEntry = this.getEntry.bind(this);
    }
    Querier.prototype.sendQuery = function (queryDescriptor) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryKey, effects, hot, props, possibleQueryResult, queryState, result_1, dispatch_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = queryDescriptor.query, queryKey = queryDescriptor.queryKey, effects = queryDescriptor.effects, hot = queryDescriptor.hot, props = queryDescriptor.props;
                        possibleQueryResult = this.store[queryKey];
                        if (!!!hot &&
                            possibleQueryResult &&
                            (possibleQueryResult.result ||
                                possibleQueryResult.state.state === types_1.QuerierState.Active)) {
                            this.logger.log('Serving query from cache', possibleQueryResult);
                            this.notify(queryKey);
                            return [2 /*return*/];
                        }
                        queryState = {};
                        queryState[queryKey] = {
                            id: queryKey,
                            result: null,
                            state: {
                                state: types_1.QuerierState.Active
                            },
                            $props: props,
                            $reason: queryDescriptor.reason || null
                        };
                        this.store = __assign({}, this.store, queryState);
                        this.notify(queryKey);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.logger.log('Sending query', __assign({}, queryState[queryKey]));
                        return [4 /*yield*/, query()];
                    case 2:
                        result_1 = _a.sent();
                        queryState[queryKey] = __assign({}, queryState[queryKey], { result: result_1, state: {
                                state: types_1.QuerierState.Success
                            } });
                        this.store = __assign({}, this.store, queryState);
                        this.logger.log('Query succeeded', __assign({}, queryState[queryKey]));
                        if (effects && this.reduxDispatch) {
                            this.logger.log('Performing query effects', __assign({}, effects));
                            dispatch_1 = this.reduxDispatch;
                            effects.forEach(function (effect) {
                                dispatch_1(effect(result_1));
                            });
                        }
                        this.notify(queryKey);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        queryState[queryKey] = __assign({}, queryState[queryKey], { result: null, state: {
                                state: types_1.QuerierState.Error,
                                error: e_1
                            } });
                        this.store = __assign({}, this.store, queryState);
                        this.logger.log('Query failed', __assign({}, queryState[queryKey]));
                        this.notify(queryKey);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Querier.prototype.getStore = function () {
        return this.store;
    };
    Querier.prototype.getEntry = function (key) {
        if (this.getStore()[key]) {
            return this.getStore()[key];
        }
        return null;
    };
    Querier.prototype.subscribe = function (queryKey, listener) {
        var _this = this;
        // TODO: add typings
        var listeners = this.listeners.get(queryKey);
        this.listeners.set(queryKey, listeners ? listeners.concat([listener]) : [listener]);
        return function () {
            var _listeners = _this.listeners.get(queryKey);
            if (_listeners) {
                var index = _listeners.indexOf(listener);
                _this.listeners.set(queryKey, _listeners.slice(0, index).concat(_listeners.slice(index + 1, _listeners.length)));
            }
        };
    };
    Querier.prototype.notify = function (queryKey) {
        var _this = this;
        var listeners = this.listeners.get(queryKey);
        if (listeners) {
            listeners.map(function (listener) { return listener(_this.store[queryKey]); });
        }
    };
    return Querier;
}());
exports.default = Querier;
__export(require("./types"));
__export(require("./QuerierLogger"));
__export(require("./QuerierProvider"));
__export(require("./withData"));
__export(require("./utils/combineStates"));
//# sourceMappingURL=Querier.js.map