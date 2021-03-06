(function (JPEGEncoder, settings, rand) {

    "use strict";

    const jpgcrunk = {

        speed: 1000,
        encoder: null,
        running: false,

        past: [],

        init () {

            this.encoder = new JPEGEncoder();
            this.main_image = $("#main_image")[0];
            this.setRandSeed();

            this.outputImg = document.createElement("img");
            $("#output_canvas").append(this.outputImg);

            this.bindUI();
            this.bindDragDrop();

            this.crunkify();

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

                if (this.past.length < 2) {
                    return;
                }
                this.past.pop();
                $("#seed").val(this.past.pop());

                this.crunkify();

            });

            $("#controls input[type=text]").on("keyup", () => this.crunkify());

            $("#controls input[type=range]")
                .on("change", () => {

                    const id = $(this).attr("id");

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

            var drag = $("#dragn");

            drag
                .on("dragover", () => { drag.addClass("hover"); return false; })
                .on("dragleave", () => { drag.removeClass("hover"); return false; })
                .on("drop", (e) => {

                    e.preventDefault();
                    drag.removeClass("hover");

                    const file = e.originalEvent.dataTransfer.files[0];
                    const reader = new FileReader();

                    //console.log($(e.dataTransfer.getData('text/html')).filter('img').attr('src'));
                    if (!file) {
                        window.alert("couldn't open that file.");
                        return;
                    }

                    reader.onload = ev => {
                        $("#main_image")
                            .attr("src", e.target.result)
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

            const imgData = this.getImageDataFromImage($("#main_image")[0]);

            settings.update();

            const seed = rand("crunk").seed = parseInt($("#seed").val(), 10);
            rand("mash").seed = rand("crunk").seed;
            this.past.push(rand("crunk").seed);

            this.outputImg.src = this.encoder.encode(imgData);

        },

        copyImageToCanvas (selectorOrElement, w, h) {

            const img = $(selectorOrElement);
            const rawImg = img.get(0);
            const canvas = $("<canvas></canvas>");
            const ctx = canvas.get(0).getContext("2d");

            canvas.prop("width", w || img.width());
            canvas.prop("height", h || img.height());

            try {
                ctx.drawImage(rawImg, 0, 0);
            } catch (e) {
                setTimeout(() => {
                    // TODO: figure out why I need this hack when loading images!
                    // Maybe not loaded yet? Maybe, but rawImg.complete is true, soo...
                    // 2147746065 "NS_ERROR_NOT_AVAILABLE"
                    $("#next_button").click();
                }, 700);
            }

            return ctx;

        },

        getImageDataFromImage (selectorOrElement) {

            const ctx = this.copyImageToCanvas(selectorOrElement);

            return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

        },

        copyToPNG () {

            const canvas = this.copyImageToCanvas(
                    this.outputImg,
                    $("#main_image").width(),
                    $("#main_image").height()
                )
                .canvas;

            const lnk = $("<a></a>", {
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
    window.Rand
));

