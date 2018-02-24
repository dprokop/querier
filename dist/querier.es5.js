import { Component, createElement } from 'react';
import { object } from 'prop-types';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};









function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

var QuerierLogger = /** @class */ (function () {
    function QuerierLogger() {
        // tslint:disable-next-line
        this.logs = [];
    }
    QuerierLogger.prototype.log = function (label, data) {
        if (process.env.NODE_ENV === 'development') {
            console.groupCollapsed('Querier: ' + label);
            // tslint:disable-next-line
            console.info(data);
            console.groupEnd();
        }
    };
    return QuerierLogger;
}());

var QuerierState;
(function (QuerierState) {
    QuerierState[QuerierState["Pending"] = 0] = "Pending";
    QuerierState[QuerierState["Active"] = 1] = "Active";
    QuerierState[QuerierState["Success"] = 2] = "Success";
    QuerierState[QuerierState["Error"] = 3] = "Error";
})(QuerierState || (QuerierState = {}));

var QuerierProvider = /** @class */ (function (_super) {
    __extends(QuerierProvider, _super);
    function QuerierProvider(props) {
        var _this = _super.call(this, props) || this;
        _this.querier = props.querier || new Querier();
        return _this;
    }
    QuerierProvider.prototype.getChildContext = function () {
        return {
            querier: this.querier
        };
    };
    QuerierProvider.prototype.render = function () {
        return this.props.children;
    };
    QuerierProvider.childContextTypes = {
        querier: object
    };
    return QuerierProvider;
}(Component));

// tslint:disable-next-line
var buildQueryKey = function (query, props) {
    if (props) {
        return query.name + ":" + JSON.stringify(props);
    }
    else {
        return "" + query.name;
    }
};

var inputQueryDescriptorsBuilder = function (inputQueries) {
    var wrappedInputQueries = {};
    var _loop_1 = function (inputQueryProp) {
        if (inputQueryProp) {
            var query_1 = inputQueries[inputQueryProp].query;
            var wrappedQuery = function (props) { return query_1(props); };
            var queryKey = buildQueryKey(query_1);
            var wrappedQueryDescriptor = {};
            wrappedQueryDescriptor[inputQueryProp] = {
                query: wrappedQuery,
                hot: !!inputQueries[inputQueryProp].hot,
                resultActions: inputQueries[inputQueryProp].resultActions,
                key: queryKey
            };
            wrappedInputQueries = Object.assign({}, wrappedInputQueries, wrappedQueryDescriptor);
        }
    };
    for (var inputQueryProp in inputQueries) {
        _loop_1(inputQueryProp);
    }
    return wrappedInputQueries;
};
var actionQueryDescriptorsBuilder = function (actionQueries) {
    var wrappedActionQueries = {};
    var _loop_2 = function (actionQueryProp) {
        if (actionQueryProp) {
            var query_2 = actionQueries[actionQueryProp].query;
            // tslint:disable-next-line
            var wrappedQuery = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return query_2.apply(void 0, args);
            };
            var queryDescriptor = {};
            queryDescriptor[actionQueryProp] = {
                query: wrappedQuery,
                hot: !!actionQueries[actionQueryProp].hot,
                key: buildQueryKey(actionQueries[actionQueryProp].query)
            };
            wrappedActionQueries = Object.assign({}, wrappedActionQueries, queryDescriptor);
        }
    };
    for (var actionQueryProp in actionQueries) {
        _loop_2(actionQueryProp);
    }
    return wrappedActionQueries;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant;

// tslint:disable-next-line
var getComponentDisplayName = function (wrapped) {
    return wrapped.displayName || wrapped.name || 'Component';
};
var withDataFactory = function (queries) { return function (Component$$1) {
    var WithData = /** @class */ (function (_super) {
        __extends(WithData, _super);
        function WithData(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.querierSubscriptions = [];
            _this.propsToQueryKeysMap = new Map();
            _this.handleQuerierUpdate = _this.handleQuerierUpdate.bind(_this);
            _this.initializePropsToQueryKeysMap();
            invariant_1(context.querier, 'Querier is not available in the context. Make sure you have wrapped your root component ' +
                'with QuerierProvider');
            return _this;
        }
        WithData.prototype.componentDidMount = function () {
            this.fireInputQueries(this.props);
        };
        WithData.prototype.componentWillReceiveProps = function (nextProps) {
            this.unsubscribeQuerier();
            this.fireInputQueries(nextProps);
        };
        WithData.prototype.componentWillUnmount = function () {
            this.unsubscribeQuerier();
        };
        WithData.prototype.initializePropsToQueryKeysMap = function () {
            var inputQueries = queries.inputQueries;
            if (inputQueries) {
                for (var prop in inputQueries) {
                    if (prop) {
                        var queryKey = inputQueries[prop].key + ":" + JSON.stringify(this.props);
                        this.propsToQueryKeysMap.set(prop, queryKey);
                    }
                }
            }
        };
        WithData.prototype.fireInputQueries = function (props) {
            var querier = this.context.querier;
            var inputQueries = queries.inputQueries;
            if (inputQueries) {
                var _loop_1 = function (prop) {
                    if (prop) {
                        var query = function () { return inputQueries[prop].query(props); };
                        var queryKey = inputQueries[prop].key + ":" + JSON.stringify(props);
                        this_1.propsToQueryKeysMap.set(prop, queryKey);
                        this_1.querierSubscriptions.push(querier.subscribe(queryKey, this_1.handleQuerierUpdate));
                        querier.sendQuery({
                            query: query,
                            queryKey: queryKey,
                            props: props,
                            reason: getComponentDisplayName(Component$$1),
                            effects: inputQueries[prop].resultActions,
                            hot: !!inputQueries[prop].hot,
                        });
                    }
                };
                var this_1 = this;
                for (var prop in inputQueries) {
                    _loop_1(prop);
                }
            }
        };
        WithData.prototype.unsubscribeQuerier = function () {
            this.querierSubscriptions = this.querierSubscriptions.filter(function (unsubscribe) {
                return unsubscribe();
            });
        };
        WithData.prototype.handleQuerierUpdate = function (queryData) {
            this.setState({});
        };
        WithData.prototype.buildComponentPropsFromResults = function () {
            var _this = this;
            var props = {
                results: {},
                states: {}
            };
            this.propsToQueryKeysMap.forEach(function (queryKey, prop) {
                var queryStoreEntry = _this.context.querier.getEntry(queryKey);
                var result = {};
                var states = {};
                result[prop] = queryStoreEntry && queryStoreEntry.result;
                states[prop] = queryStoreEntry && queryStoreEntry.state;
                props = {
                    results: __assign({}, props.results, result),
                    states: __assign({}, props.states, states)
                };
            });
            // console.log(props);
            return props;
        };
        WithData.prototype.getWrappedActionQueries = function () {
            var _this = this;
            var actionQueries = queries.actionQueries;
            var querier = this.context.querier;
            var wrappedActionQueries = {};
            if (actionQueries) {
                var _loop_2 = function (actionQueryProp) {
                    if (actionQueryProp) {
                        var wrappedActionQuery = {};
                        wrappedActionQuery[actionQueryProp] = function (actionQueryParams) {
                            var query = function () { return actionQueries[actionQueryProp].query(actionQueryParams); };
                            var queryKey = actionQueries[actionQueryProp].key + ":" + JSON.stringify(actionQueryParams);
                            _this.propsToQueryKeysMap.set(actionQueryProp, queryKey);
                            querier.subscribe(queryKey, _this.handleQuerierUpdate);
                            querier.sendQuery({
                                query: query,
                                queryKey: queryKey,
                                hot: actionQueries[actionQueryProp].hot,
                                props: actionQueryParams,
                                reason: getComponentDisplayName(Component$$1)
                            });
                        };
                        wrappedActionQueries = __assign({}, wrappedActionQueries, wrappedActionQuery);
                    }
                };
                for (var actionQueryProp in actionQueries) {
                    _loop_2(actionQueryProp);
                }
            }
            return wrappedActionQueries;
        };
        WithData.prototype.render = function () {
            var _a = this.buildComponentPropsFromResults(), results = _a.results, states = _a.states;
            return (createElement(Component$$1, __assign({ results: results, actionQueries: this.getWrappedActionQueries(), states: states }, this.props)));
        };
        WithData.displayName = "WithData(" + getComponentDisplayName(Component$$1) + ")";
        WithData.contextTypes = {
            querier: object
        };
        return WithData;
    }(Component));
    return WithData;
}; };

function withData(dependencies) {
    var actionQueries = dependencies.actionQueries;
    var inputQueriesDescriptor = dependencies.inputQueries &&
        inputQueryDescriptorsBuilder(dependencies.inputQueries);
    var actionQueriesDescriptor = actionQueries &&
        actionQueryDescriptorsBuilder(actionQueries);
    return withDataFactory({
        inputQueries: inputQueriesDescriptor,
        actionQueries: actionQueriesDescriptor,
    });
}

var combineStates = function (states) {
    var successes = 0;
    for (var key in states) {
        if (key && states[key]) {
            if (states[key].state === QuerierState.Active) {
                return {
                    state: QuerierState.Active
                };
            }
            if (states[key].state === QuerierState.Error) {
                return {
                    state: QuerierState.Error,
                    error: states[key].error
                };
            }
            if (states[key].state === QuerierState.Success) {
                successes++;
            }
        }
    }
    if (successes === Object.keys(states).length) {
        return {
            state: QuerierState.Success
        };
    }
    return {
        state: QuerierState.Pending
    };
};

var Querier = /** @class */ (function () {
    // tslint:disable-next-line
    function Querier(store, dispatch) {
        this.logger = new QuerierLogger();
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
                                possibleQueryResult.state.state === QuerierState.Active)) {
                            this.logger.log('Serving query from cache', possibleQueryResult);
                            this.notify(queryKey);
                            return [2 /*return*/];
                        }
                        queryState = {};
                        queryState[queryKey] = {
                            id: queryKey,
                            result: null,
                            state: {
                                state: QuerierState.Active
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
                                state: QuerierState.Success
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
                                state: QuerierState.Error,
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

export { QuerierState, QuerierLogger, QuerierProvider, withData, combineStates, buildQueryKey };
export default Querier;
//# sourceMappingURL=querier.es5.js.map
