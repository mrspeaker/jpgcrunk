// Built from scripts/rand.js

(function() {
  "use strict";
  var CRand,
      _rands = {};
  CRand = function() {
    this.seed = 42;
  };
  CRand.prototype.rand = function(max, min) {
    return Math.round(this.randFloat(max, min));
  };
  CRand.prototype.randFloat = function() {
    var max = arguments[0] !== (void 0) ? arguments[0] : 1;
    var min = arguments[1] !== (void 0) ? arguments[1] : 0;
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return ((this.seed / 233280) * (max - min) + min);
  };
  function Rand() {
    var name = arguments[0] !== (void 0) ? arguments[0] : "default";
    if (!_rands[name]) {
      _rands[name] = new CRand();
    }
    return _rands[name];
  }
  ;
  window.Rand = Rand;
}());

