(function () {

    "use strict";

    var jpgcrunk = {

        init: function () {
            var imgData = this.getImageDataFromImage("mrman"),
                c = document.createElement('canvas'),
                enc = new JPEGEncoder();

            c.width = imgData.width;
            c.height = imgData.height;

            var img = document.createElement('img');
            img.src = enc.encode(imgData, 80);
            document.body.appendChild(img);
        },

        getImageDataFromImage: function (idOrElement) {
            var theImg = (typeof(idOrElement)=='string')? document.getElementById(idOrElement):idOrElement;
            var cvs = document.createElement('canvas');
            cvs.width = theImg.width;
            cvs.height = theImg.height;
            var ctx = cvs.getContext("2d");
            ctx.drawImage(theImg,0,0);

            return (ctx.getImageData(0, 0, cvs.width, cvs.height));
        }

    };

    window.jpgcrunk = jpgcrunk;

}());
