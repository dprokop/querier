"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line
var buildQueryKey = function (query, props) {
    if (props) {
        return query.name + ":" + JSON.stringify(props);
    }
    else {
        return "" + query.name;
    }
};
exports.default = buildQueryKey;
//# sourceMappingURL=buildQueryKey.js.map