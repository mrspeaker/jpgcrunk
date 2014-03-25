(function () {
    "use strict";

    var settings = {

        quality: 50,
        procBreak: 0.001,
        makeUpBits: 10,
        aasfDeviation: 2,

        update: function () {
            this.quality = parseFloat($("#quality").data("exp"), 10);
            this.procBreak = parseFloat($("#procBreak").data("exp"), 10);
            if (this.procBreak < 0.0001) {
                this.procBreak = 0;
            }
            $("#makeUpBits").prop("disabled", this.procBreak === 0);

            this.makeUpBits = parseFloat($("#makeUpBits").val(), 10);
            this.aasfDeviation = parseFloat($("#aasfDeviation").val(), 10);

        }
    };

    window.settings = settings;

}());