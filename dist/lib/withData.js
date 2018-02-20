"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryDescriptorBuilders_1 = require("./utils/queryDescriptorBuilders");
var withDataFactory_1 = require("./withDataFactory");
function withData(dependencies) {
    var actionQueries = dependencies.actionQueries;
    var inputQueriesDescriptor = dependencies.inputQueries &&
        queryDescriptorBuilders_1.inputQueryDescriptorsBuilder(dependencies.inputQueries);
    var actionQueriesDescriptor = actionQueries &&
        queryDescriptorBuilders_1.actionQueryDescriptorsBuilder(actionQueries);
    return withDataFactory_1.withDataFactory({
        inputQueries: inputQueriesDescriptor,
        actionQueries: actionQueriesDescriptor,
    });
}
exports.withData = withData;
//# sourceMappingURL=withData.js.map