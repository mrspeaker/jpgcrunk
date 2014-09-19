(function (JPEGEncoder, settings, rand, cam) {

    "use strict";

    var jpgcrunk = {

        speed: 1000,
        encoder: null,
        running: false,

        past: [],

        initDone: false,

        init () {

            //cam.init();
            this.encoder = new JPEGEncoder();
            this.main_image = $("#main_image")[0];
            this.setRandSeed();

            this.outputImg = document.createElement("img");
            $("#output_canvas").append(this.outputImg);

            this.bindUI();
            this.bindDragDrop();

            this.crunkify();

            this.initDone = true;
            // cam.capture();

        },

        setRandSeed () {

            rand("crunk").seed = Math.random() * 100000 | 0;
            $("#seed").val(rand("crunk").seed);

        },

        bindUI () {

            $("#rnd").click(() => {

                this.setRandSeed();
                settings.rand();
                this.crunkify();

            });

            $("#run_button").click((e) => {

                clearTimeout(this.timer);
                this.running = !this.running;
                this.run();
                $(e.target).text(this.running ? "STOP" : "RUN");

            });

            $("#png_button").click(() => this.copyToPNG());

            $("#next_button").click(() => {

                $("#seed").val(rand("crunk").rand(0, 100000));
                this.crunkify();

            });

            $("#prev_button").click(() => {

                if (!this.past.length) {
                    return;
                }
                this.past.pop();
                $("#seed").val(this.past.pop());
                this.crunkify();

            });

            $("#controls input[type=text]").on("keyup", () => this.crunkify());

            $("#controls input[type=range]")
                .on("change", () => {

                    if (!this.initDone) return;

                    var id = $(this).attr("id");

                    if (id === "speed") {
                        clearTimeout(this.timer);
                        this.run();
                    }

                    this.crunkify();

                })
                .change();

        },

        bindDragDrop () {

            if (typeof window.FileReader === "undefined") {
                $("#hover").text("no drag n drop available.");
                return;
            }

            $("#dragn")
                .on("dragover", function () { $(this).addClass("hover"); return false; })
                .on("dragleave", function () { $(this).removeClass("hover"); return false; })
                .on("drop", function (e) {

                    e.preventDefault();
                    $(this).removeClass("hover");

                    var file = e.originalEvent.dataTransfer.files[0],
                        reader = new FileReader();

                    //console.log($(e.dataTransfer.getData('text/html')).filter('img').attr('src'));
                    if (!file) {
                        window.alert("couldn't open that file.");
                        return;
                    }

                    reader.onload = (event) => {
                        $("#main_image")
                            .attr("src", event.target.result)
                            .load(() => jpgcrunk.crunkify()
                        );
                    };
                    reader.readAsDataURL(file);

                });

        },

        run () {

            this.crunkify();
            this.speed = 2000 - parseInt($("#speed").val(), 10);
            this.timer = setTimeout(() => {

                if (!this.running) {
                    return;
                }
                $("#seed").val(rand("crunk").seed);
                this.run();

            }, this.speed);

        },

        crunkify () {

            var imgData = this.getImageDataFromImage($("#main_image")[0]);

            settings.update();

            rand("crunk").seed = parseInt($("#seed").val(), 10);
            rand("mash").seed = rand("crunk").seed;
            this.past.push(rand("crunk").seed);

            this.outputImg.src = this.encoder.encode(imgData);

        },

        copyImageToCanvas (selectorOrElement, w, h) {

            var img = $(selectorOrElement),
                canvas = $("<canvas></canvas>"),
                ctx = canvas.get(0).getContext("2d");

            canvas.prop("width", w || img.width());
            canvas.prop("height", h || img.height());

            try {
                ctx.drawImage(img.get(0), 0, 0);
            } catch (e) {
                console.log("Couldn't draw:", e.result, e.name, e.message);
                setTimeout(() => {
                    // TODO: figure out why I need this hack when loading images!
                    // Maybe not loaded yet?
                    // 2147746065 "NS_ERROR_NOT_AVAILABLE"
                    $("#next_button").click();
                }, 700);
            }

            return ctx;

        },

        getImageDataFromImage (selectorOrElement) {

            var ctx = this.copyImageToCanvas(selectorOrElement);

            return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

        },

        copyToPNG () {

            var canvas = this.copyImageToCanvas(
                    this.outputImg,
                    $("#main_image").width(),
                    $("#main_image").height()
                )
                .canvas;

            var lnk = $("<a></a>", {
                href: canvas.toDataURL(),
                download: "jpgcrunk.png",
            }).appendTo("#out_png");

            $("<img></img>", {
                id: "png_output",
                src: canvas.toDataURL()
            }).appendTo(lnk);

        }

    };

    window.jpgcrunk = jpgcrunk;

}(
    window.JPEGEncoder,
    window.settings,
    window.Rand,
    window.cam
));

