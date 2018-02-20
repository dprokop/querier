"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = QuerierLogger;
//# sourceMappingURL=QuerierLogger.js.map