(function () {

    "use strict";

    var CRand = function () {

        this.seed = 42;
    };
    CRand.prototype.rand = function(max, min) {

        return this.randFloat(max, min) | 0;

    };
    CRand.prototype.randFloat = function(max, min) {

        max = max || 1;
        min = min || 0;

        this.seed = (this.seed * 9301 + 49297) % 233280;

        return ((this.seed / 233280) * (max - min) + min);

    };

    var _rands = {

    };

    var Rand = function (name) {
        if (!_rands[name]) {
            _rands[name] = new CRand();
        }
        return _rands[name];
    };

    window.Rand = Rand;

}());
