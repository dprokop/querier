"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PropTypes = require("prop-types");
var React = require("react");
var invariant_1 = require("invariant");
// tslint:disable-next-line
var getComponentDisplayName = function (wrapped) {
    return wrapped.displayName || wrapped.name || 'Component';
};
exports.withDataFactory = function (queries) { return function (Component) {
    var WithData = /** @class */ (function (_super) {
        __extends(WithData, _super);
        function WithData(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.querierSubscriptions = [];
            _this.propsToQueryKeysMap = new Map();
            _this.handleQuerierUpdate = _this.handleQuerierUpdate.bind(_this);
            _this.initializePropsToQueryKeysMap();
            invariant_1.default(context.querier, 'Querier is not available in the context. Make sure you have wrapped your root component ' +
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
                            reason: getComponentDisplayName(Component),
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
                                reason: getComponentDisplayName(Component)
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
            return (React.createElement(Component, __assign({ results: results, actionQueries: this.getWrappedActionQueries(), states: states }, this.props)));
        };
        WithData.displayName = "WithData(" + getComponentDisplayName(Component) + ")";
        WithData.contextTypes = {
            querier: PropTypes.object
        };
        return WithData;
    }(React.Component));
    return WithData;
}; };
//# sourceMappingURL=withDataFactory.js.map