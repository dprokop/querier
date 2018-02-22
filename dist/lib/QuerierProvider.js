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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var Querier_1 = require("./Querier");
var QuerierProvider = /** @class */ (function (_super) {
    __extends(QuerierProvider, _super);
    function QuerierProvider(props) {
        var _this = _super.call(this, props) || this;
        _this.querier = props.querier || new Querier_1.default();
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
        querier: PropTypes.object
    };
    return QuerierProvider;
}(React.Component));
exports.QuerierProvider = QuerierProvider;
//# sourceMappingURL=QuerierProvider.js.map