(function (JPEGEncoder, settings, Rand) {

    "use strict";

    var jpgcrunk = {

        speed: 1000,
        encoder: null,
        running: false,

        init: function () {
            var self = this;

            this.encoder = new JPEGEncoder();
            this.main_image = $("#main_image")[0];

            Rand.seed = Math.random() * 100000 | 0;
            $("#seed").val(Rand.seed);

            this.outputImg = document.createElement('img');
            $("#output_canvas").append(this.outputImg);

            $("#run_button").click(function () {

                clearTimeout(self.timer);
                self.running = !self.running;
                self.run();
                $(this).text(self.running ? "STOP" : "RUN");

            });

            $("#png_button").click(function () {

                self.copyToPNG();

            });

            $("#controls input[type=text]").on("keyup", function () {

                self.crunkify();

            });

            $("#controls input[type=checkbox]").on("change", function () {

                self.crunkify();

            });

            this.crunkify();
        },

        run: function () {

            var self = this;

            this.crunkify();
            this.speed = parseInt($("#speed").val(), 10);
            this.timer = setTimeout(function () {

                if (!self.running) {
                    return;
                }
                $("#seed").val(Rand.seed);
                self.run();

            }, this.speed);

        },

        crunkify: function () {

            var imgData = this.getImageDataFromImage(this.main_image);

            settings.update();

            Rand.seed = parseInt($("#seed").val(), 10);
            this.outputImg.src = this.encoder.encode(imgData);

        },

        copyImageToCanvas: function (selectorOrElement) {

            var img = typeof selectorOrElement === "string" ? document.querySelector(selectorOrElement) : selectorOrElement,
                canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            return ctx;

        },

        getImageDataFromImage: function (selectorOrElement) {

            var ctx = this.copyImageToCanvas(selectorOrElement);

            return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

        },

        copyToPNG: function () {

            var canvas = this.copyImageToCanvas(this.outputImg).canvas;

            $("#png_output").remove();
            $("<img></img>", {
                id: "png_output",
                src: canvas.toDataURL(),
                width: canvas.width,
                height: canvas.height
            }).appendTo("body");

        }

    };

    window.jpgcrunk = jpgcrunk;

}(
    window.JPEGEncoder,
    window.settings,
    window.Rand
));
