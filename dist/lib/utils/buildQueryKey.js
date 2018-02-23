"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line
exports.buildQueryKey = function (query, props) {
    if (props) {
        return query.name + ":" + JSON.stringify(props);
    }
    else {
        return "" + query.name;
    }
};
//# sourceMappingURL=buildQueryKey.js.map