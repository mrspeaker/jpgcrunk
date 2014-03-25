(function () {
    "use strict";

    var settings = {

        quality: 50,
        procBreak: 0.001,
        makeUpBits: 10,
        aasfDeviation: 2,
        startPerc: 50,
        stopPerc: 50,

        started: false,
        ended: false,

        update: function () {
            this.started = false;
            this.ended = false;

            this.quality = parseFloat($("#quality").data("exp"), 10);
            this.procBreak = parseFloat($("#procBreak").data("exp"), 10);
            if (this.procBreak < 0.0001) {
                this.procBreak = 0;
            }
            $("#makeUpBits").prop("disabled", this.procBreak === 0);

            this.makeUpBits = parseFloat($("#makeUpBits").val(), 10);
            this.aasfDeviation = parseFloat($("#aasfDeviation").val(), 10);

            this.startPerc = parseFloat($("#startPerc").val(), 10);
            this.stopPerc = parseFloat($("#stopPerc").val(), 10);
            if (this.startPerc > this.stopPerc) {
                this.stopPerc = this.startPerc;
                $("#stopPerc").val(this.stopPerc);
            }

        }
    };

    window.settings = settings;

}());