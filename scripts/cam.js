(function () {

	"use strict";

	var cam = {

		init: function () {
			
		},

		capture: function () {
			var video = document.querySelector("#videoElement");

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

			var v, canvas, context, w, h;
			var imgtag = document.getElementById('imgtag');

			//document.addEventListener('DOMContentLoaded', () => {
				// when DOM loaded, get canvas 2D context and store width and height of element
				v = document.getElementById('videoElement');
				canvas = document.getElementById('canvas');
				context = canvas.getContext('2d');
				w = canvas.width;
				h = canvas.height;

			//},false);

			function draw(v, c, w, h) {

				if (v.paused || v.ended) return false;
				context.drawImage(v, 0, 0, w, h);

				var uri = canvas.toDataURL("image/png");
				imgtag.src = uri;
			}

			document.getElementById('save').addEventListener('click',(e) => {

				draw(v, context, w, h); // when save button is clicked, draw video feed to canvas

			});

		}

	}

	window.cam = cam;

}());
