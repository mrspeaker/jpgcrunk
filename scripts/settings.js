(function () {
    "use strict";

    var settings = {

        quality: 50,
        procBreak: 0.001,
        randAasf: true,

        update: function () {
            this.quality = parseFloat($("#quality").val(), 10);
            this.procBreak = parseFloat($("#procBreak").val(), 10);
            this.randAasf = $("#randAasf").is(':checked');
        }
    };

    window.settings = settings;

}());