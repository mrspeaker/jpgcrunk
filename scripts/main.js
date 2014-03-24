(function (JPEGEncoder, settings, Rand) {

    "use strict";

    var jpgcrunk = {

        speed: 1000,
        encoder: null,
        running: false,

        past: [],

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

            $("#next_button").click(function () {

                $("#seed").val(Rand.rand(0, 100000));
                self.crunkify();

            });

            $("#prev_button").click(function () {

                if (!self.past.length) {
                    return;
                }
                self.past.pop();
                $("#seed").val(self.past.pop());
                self.crunkify();

            });

            $("#controls input[type=text]").on("keyup", function () {

                self.crunkify();

            });

            function expo(pos, min, max, minv, maxv) {

                var position = parseFloat(pos, 10),
                    scale = (maxv - minv) / (max - min);

                return Math.exp(minv + scale * (position - min));

            }

            $("#controls #quality").on("change", function () {

                $(this).data("exp", expo(this.value, 0, 100, 0, Math.log(100)));

                self.crunkify();

            });

            $("#controls #procBreak").on("change", function () {

                var ex = 1 / expo(100 - this.value, 0, 100, Math.log(10), Math.log(10000));

                $(this).data("exp", ex);

                self.crunkify();

            });

            $("#controls #speed").on("change", function () {

                self.crunkify();

            });

            $("#controls input[type=range]").change();

            $("#controls input[type=checkbox]").on("change", function () {

                self.crunkify();

            });

            this.bindDragDrop();
            this.crunkify();
        },

        bindDragDrop: function () {
            if (typeof window.FileReader === 'undefined') {
                $("#hover").text("no drag n drop available.");
                return;
            }
            var holder = $("#holder")[0];
            holder.ondragover = function () { this.classList.add("hover"); return false; };
            holder.ondragleave = function () { this.classList.remove("hover"); return false; };
            holder.ondrop = function (e) {
                this.classList.remove("hover");
                e.preventDefault();

                var file = e.dataTransfer.files[0],
                    reader = new FileReader();

                //console.log("YTOU!", $(e.dataTransfer.getData('text/html')).filter('img').attr('src'));
                if (!file) {
                    alert("couldn't open that file.");
                    return;
                }

                reader.onload = function (event) {
                    $("#main_image").attr("src", event.target.result).load(function () {
                        jpgcrunk.crunkify();
                    });
                };

                reader.readAsDataURL(file);

                return false;
            };
        },

        run: function () {

            var self = this;

            this.crunkify();
            this.speed = 2000 - parseInt($("#speed").val(), 10);
            this.timer = setTimeout(function () {

                if (!self.running) {
                    return;
                }
                $("#seed").val(Rand.seed);
                self.run();

            }, this.speed);

        },

        crunkify: function () {

            var imgData = this.getImageDataFromImage($("#main_image")[0]);

            settings.update();

            Rand.seed = parseInt($("#seed").val(), 10);

            this.past.push(Rand.seed);

            this.outputImg.src = this.encoder.encode(imgData);

            $("#output_canvas").css({
                marginTop: 30
            });

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
                src: canvas.toDataURL()
            }).appendTo("#out_png");

        }

    };

    window.jpgcrunk = jpgcrunk;

}(
    window.JPEGEncoder,
    window.settings,
    window.Rand
));
