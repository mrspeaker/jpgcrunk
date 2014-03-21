(function () {

    "use strict";

    var jpgcrunk = {

        encoder: null,

        running: false,
        speed: 1000,

        init: function () {
            this.encoder = new JPEGEncoder();
            this.main_image = $("#main_image")[0];

            var c = document.createElement('canvas');
            c.width = this.main_image.width;
            c.height = this.main_image.height;

            Rand.seed = Math.random() * 100000 | 0;
            $("#seed").val(Rand.seed);

            this.outputImg = document.createElement('img');
            $("#output_canvas").append(this.outputImg);

            var self = this;
            $("#run_button").click(function () {
                clearTimeout(self.timer);
                self.running = !self.running;
                self.run();
                $(this).text(self.running ? "STOP" : "RUN");
            });

            $("#seed").on("keyup", function () {
                self.process();
            });

            this.process();
        },

        run: function () {
            var self = this;

            this.process();

            this.speed = parseInt($("#speed").val(), 10);

            this.timer = setTimeout(function () {
                if (!self.running) {
                    return;
                }
                $("#seed").val(Rand.seed);
                self.run();
            }, this.speed);
        },

        process: function () {
            Rand.seed = parseInt($("#seed").val(), 10);
            var imgData = this.getImageDataFromImage(this.main_image);
            this.outputImg.src = this.encoder.encode(imgData, 80);
        },

        getImageDataFromImage: function (idOrElement) {
            var theImg = typeof idOrElement == "string" ? document.getElementById(idOrElement) : idOrElement,
                cvs = document.createElement('canvas'),
                ctx = cvs.getContext("2d");

            cvs.width = theImg.width;
            cvs.height = theImg.height;
            ctx.drawImage(theImg,0,0);

            return (ctx.getImageData(0, 0, cvs.width, cvs.height));
        }

    };

    window.jpgcrunk = jpgcrunk;

}());
