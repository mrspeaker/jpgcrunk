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

            Rand("crunk").seed = Math.random() * 100000 | 0;
            $("#seed").val(Rand("crunk").seed);

            this.outputImg = document.createElement('img');
            $("#output_canvas").append(this.outputImg);

            $("#rnd").click(function () {
                Rand("crunk").seed = Math.random() * 100000 | 0;
                $("#seed").val(Rand("crunk").seed);

                settings.rand();

                self.crunkify();
            });

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

                $("#seed").val(Rand("crunk").rand(0, 100000));
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

            $("#controls input[type=range]")
                .on("change", function () {

                    var id = $(this).attr("id");

                    if (id === "speed") {
                        clearTimeout(self.timer);
                        self.run();
                    }

                    self.crunkify();

                })
                .change();

            this.bindDragDrop();
            this.crunkify();

            this.capture();
        },

        bindDragDrop: function () {
            if (typeof window.FileReader === 'undefined') {
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
                        alert("couldn't open that file.");
                        return;
                    }

                    reader.onload = function (event) {
                        $("#main_image").attr("src", event.target.result).load(function () {
                            jpgcrunk.crunkify();
                        });
                    };

                    reader.readAsDataURL(file);

                });
        },

        run: function () {

            var self = this;

            this.crunkify();
            this.speed = 2000 - parseInt($("#speed").val(), 10);
            this.timer = setTimeout(function () {

                if (!self.running) {
                    return;
                }
                $("#seed").val(Rand("crunk").seed);
                self.run();

            }, this.speed);

        },

        crunkify: function () {

            var imgData = this.getImageDataFromImage($("#main_image")[0]);

            settings.update();

            Rand("crunk").seed = parseInt($("#seed").val(), 10);
            Rand("mash").seed = Rand("crunk").seed;
            this.past.push(Rand("crunk").seed);

            this.outputImg.src = this.encoder.encode(imgData);

            $("#output_canvas").css({
                marginTop: 30
            });

        },

        copyImageToCanvas: function (selectorOrElement, w, h) {

            var img = $(selectorOrElement),
                canvas = $("<canvas></canvas>"),
                ctx = canvas.get(0).getContext("2d");

            canvas.prop("width", w || img.width());
            canvas.prop("height", h || img.height());
            ctx.drawImage(img.get(0), 0, 0);

            return ctx;

        },

        getImageDataFromImage: function (selectorOrElement) {

            var ctx = this.copyImageToCanvas(selectorOrElement);

            return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

        },

        copyToPNG: function () {

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

        },

        capture: function () {
            var video = document.querySelector("#videoElement");

            // check for getUserMedia support
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

            if (navigator.getUserMedia) {
                // get webcam feed if available
                navigator.getUserMedia({video: true}, handleVideo, videoError);
            }

            function handleVideo(stream) {
                // if found attach feed to video element
                video.src = window.URL.createObjectURL(stream);
            }

            function videoError(e) {
                // no webcam found - do something
            }
            var v,canvas,context,w,h;
            var imgtag = document.getElementById('imgtag'); // get reference to img tag

            //document.addEventListener('DOMContentLoaded', function(){
                // when DOM loaded, get canvas 2D context and store width and height of element
                v = document.getElementById('videoElement');
                canvas = document.getElementById('canvas');
                context = canvas.getContext('2d');
                w = canvas.width;
                h = canvas.height;

            //},false);

            function draw(v,c,w,h) {

                if(v.paused || v.ended) return false;
                context.drawImage(v,0,0,w,h);

                var uri = canvas.toDataURL("image/png");
                imgtag.src = uri;
            }

            document.getElementById('save').addEventListener('click',function(e){

                draw(v,context,w,h); // when save button is clicked, draw video feed to canvas

            });

        }

    };

    window.jpgcrunk = jpgcrunk;

}(
    window.JPEGEncoder,
    window.settings,
    window.Rand
));
