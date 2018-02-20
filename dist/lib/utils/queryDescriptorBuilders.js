"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buildQueryKey_1 = require("./buildQueryKey");
exports.inputQueryDescriptorsBuilder = function (inputQueries) {
    var wrappedInputQueries = {};
    var _loop_1 = function (inputQueryProp) {
        if (inputQueryProp) {
            var query_1 = inputQueries[inputQueryProp].query;
            var wrappedQuery = function (props) { return query_1(props); };
            var queryKey = buildQueryKey_1.default(query_1);
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
exports.actionQueryDescriptorsBuilder = function (actionQueries) {
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
                key: buildQueryKey_1.default(actionQueries[actionQueryProp].query)
            };
            wrappedActionQueries = Object.assign({}, wrappedActionQueries, queryDescriptor);
        }
    };
    for (var actionQueryProp in actionQueries) {
        _loop_2(actionQueryProp);
    }
    return wrappedActionQueries;
};
//# sourceMappingURL=queryDescriptorBuilders.js.map