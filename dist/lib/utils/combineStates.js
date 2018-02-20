"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var combineStates = function (states) {
    var successes = 0;
    for (var key in states) {
        if (key && states[key]) {
            if (states[key].state === types_1.QuerierState.Active) {
                return {
                    state: types_1.QuerierState.Active
                };
            }
            if (states[key].state === types_1.QuerierState.Error) {
                return {
                    state: types_1.QuerierState.Error,
                    error: states[key].error
                };
            }
            if (states[key].state === types_1.QuerierState.Success) {
                successes++;
            }
        }
    }
    if (successes === Object.keys(states).length) {
        return {
            state: types_1.QuerierState.Success
        };
    }
    return {
        state: types_1.QuerierState.Pending
    };
};
exports.default = combineStates;
//# sourceMappingURL=combineStates.js.map