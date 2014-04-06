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

            function expo(pos, min, max, minv, maxv) {

                var position = parseFloat(pos, 10),
                    scale = (maxv - minv) / (max - min);

                return Math.exp(minv + scale * (position - min));

            }

            this.started = false;
            this.ended = false;

            this.quality = expo($("#quality").val(), 0, 100, 0, Math.log(100));
            this.procBreak = 1 / expo(100 - $("#procBreak").val(), 0, 100, Math.log(10), Math.log(10000));
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

        },

        rand: function () {

            $("#quality").val(Math.random() * 100 | 0);
            $("#procBreak").val(Math.random() * 75 | 0);
            $("#makeUpBits").val(Math.random() * 50 | 0);
            $("#aasfDeviation").val(Math.random() * 2);

            var start = Math.random() * 70,
                end = Math.random() * (99 - start) + start + 1;
            $("#startPerc").val(start);
            $("#stopPerc").val(end);

            this.update();

        }
    };

    window.settings = settings;

}());
