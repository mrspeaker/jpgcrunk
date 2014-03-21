(function () {

    "use strict";

    var Rand = {

        seed: 42,

        rand: function(max, min) {

            return this.randFloat(max, min) | 0;

        },

        randFloat: function(max, min) {

            max = max || 1;
            min = min || 0;

            this.seed = (this.seed * 9301 + 49297) % 233280;

            return ((this.seed / 233280) * (max - min) + min);

        }

    };

    window.Rand = Rand;

}());
