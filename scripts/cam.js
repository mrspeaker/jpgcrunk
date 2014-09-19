(function () {

	"use strict";

	var cam = {

		init: function () {

		},

		capture: function () {
			var v = $("#videoElement")[0],
				ctx = $("#camout")[0].getContext("2d");

			navigator.getUserMedia = navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia ||
				navigator.oGetUserMedia;

			if (!navigator.getUserMedia) {
				console.log("No user media.");
				return;
			}

			navigator.getUserMedia(
				{video: true},
				(stream) => v.src = window.URL.createObjectURL(stream),
				(e) => console.error(e));

			$("#camsave").click(() => {
				var can = ctx.canvas,
					{width, height} = can;

				if (v.paused || v.ended) return;
				ctx.drawImage(v, 0, 0, width, height);
			});

		}

	};

	window.cam = cam;

}());
