// Built from scripts/main.js

(function(JPEGEncoder, settings, rand) {
  "use strict";
  var jpgcrunk = {
    speed: 1000,
    encoder: null,
    running: false,
    past: [],
    init: function() {
      this.encoder = new JPEGEncoder();
      this.main_image = $("#main_image")[0];
      this.setRandSeed();
      this.outputImg = document.createElement("img");
      $("#output_canvas").append(this.outputImg);
      this.bindUI();
      this.bindDragDrop();
      this.crunkify();
    },
    setRandSeed: function() {
      rand("crunk").seed = Math.random() * 100000 | 0;
      $("#seed").val(rand("crunk").seed);
    },
    bindUI: function() {
      var $__0 = this;
      $("#rnd").click((function() {
        $__0.setRandSeed();
        settings.rand();
        $__0.crunkify();
      }));
      $("#run_button").click((function(e) {
        clearTimeout($__0.timer);
        $__0.running = !$__0.running;
        $__0.run();
        $(e.target).text($__0.running ? "STOP" : "RUN");
      }));
      $("#png_button").click((function() {
        return $__0.copyToPNG();
      }));
      $("#next_button").click((function() {
        $("#seed").val(rand("crunk").rand(0, 100000));
        $__0.crunkify();
      }));
      $("#prev_button").click((function() {
        if ($__0.past.length < 2) {
          return;
        }
        $__0.past.pop();
        $("#seed").val($__0.past.pop());
        $__0.crunkify();
      }));
      $("#controls input[type=text]").on("keyup", (function() {
        return $__0.crunkify();
      }));
      $("#controls input[type=range]").on("change", (function() {
        var id = $($__0).attr("id");
        if (id === "speed") {
          clearTimeout($__0.timer);
          $__0.run();
        }
        $__0.crunkify();
      })).change();
    },
    bindDragDrop: function() {
      if (typeof window.FileReader === "undefined") {
        $("#hover").text("no drag n drop available.");
        return;
      }
      var drag = $("#dragn");
      drag.on("dragover", (function() {
        drag.addClass("hover");
        return false;
      })).on("dragleave", (function() {
        drag.removeClass("hover");
        return false;
      })).on("drop", (function(e) {
        e.preventDefault();
        drag.removeClass("hover");
        var file = e.originalEvent.dataTransfer.files[0],
            reader = new FileReader();
        if (!file) {
          window.alert("couldn't open that file.");
          return;
        }
        reader.onload = (function(event) {
          $("#main_image").attr("src", event.target.result).load((function() {
            return jpgcrunk.crunkify();
          }));
        });
        reader.readAsDataURL(file);
      }));
    },
    run: function() {
      var $__0 = this;
      this.crunkify();
      this.speed = 2000 - parseInt($("#speed").val(), 10);
      this.timer = setTimeout((function() {
        if (!$__0.running) {
          return;
        }
        $("#seed").val(rand("crunk").seed);
        $__0.run();
      }), this.speed);
    },
    crunkify: function() {
      var imgData = this.getImageDataFromImage($("#main_image")[0]);
      settings.update();
      var seed = rand("crunk").seed = parseInt($("#seed").val(), 10);
      rand("mash").seed = rand("crunk").seed;
      this.past.push(rand("crunk").seed);
      this.outputImg.src = this.encoder.encode(imgData);
    },
    copyImageToCanvas: function(selectorOrElement, w, h) {
      var img = $(selectorOrElement),
          rawImg = img.get(0),
          canvas = $("<canvas></canvas>"),
          ctx = canvas.get(0).getContext("2d");
      canvas.prop("width", w || img.width());
      canvas.prop("height", h || img.height());
      try {
        ctx.drawImage(rawImg, 0, 0);
      } catch (e) {
        setTimeout((function() {
          $("#next_button").click();
        }), 700);
      }
      return ctx;
    },
    getImageDataFromImage: function(selectorOrElement) {
      var ctx = this.copyImageToCanvas(selectorOrElement);
      return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    },
    copyToPNG: function() {
      var canvas = this.copyImageToCanvas(this.outputImg, $("#main_image").width(), $("#main_image").height()).canvas;
      var lnk = $("<a></a>", {
        href: canvas.toDataURL(),
        download: "jpgcrunk.png"
      }).appendTo("#out_png");
      $("<img></img>", {
        id: "png_output",
        src: canvas.toDataURL()
      }).appendTo(lnk);
    }
  };
  window.jpgcrunk = jpgcrunk;
}(window.JPEGEncoder, window.settings, window.Rand));

