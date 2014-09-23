# jpgcrunk by Mr Speaker

[jpgcrunk](http://www.mrspeaker.net/dev/jpgcrunk/) is a tool for crunking images. 
![jpgcrunk](http://www.mrspeaker.net/dev/jpgcrunk/images/icohead.png)

## How to use

Drag an image into the "drag n drop" area. Mess around with the sliders or press the "rnd" button. When you see something vaguely interesting, try variations with the "next/prev" buttons.

The sliders set some properties of the random number generator. Pressing the "next" button will generate crunks with those properties. You can also crunk slide-show style with the RUN button.

If you see something you like, either right-click and save it, or hit "make png" to add it to your preview list.

## Parameters

Quality: The jpg quality.
Crunk: Crunkiness.
Skew: Straightens-up (or skews) to account for data lost to the crunk.
Mash: Distant cousin of Crunk.
Start %: When to start crunking (leaves start of pic uncrunked)
End %: When to stop crunking (no more chance of new crunks towards end of pic)
RUN Speed: slideshow time - becareful with big images, takes a while to process
Seed: Having the same seed and parameter values will always return the same image.

## Only jpgs?! 

Nope! The source file doesn't have to be a jpeg, but it's *encoded* as a jpeg - with lots of jpeg crunkiness. If you right-click and save the image, you'll get a jpeg. If you hit the "make png" button, it will be save into the preview section as a png.

# TODO

* Prev work with RND changes (save settings)
* Stop button.
* Save settings with previews (so can re-load them)
* Unique filenames (from init image name)
* Scrollable preview pane
* Warnings on big images
* Add meta data to generated images
* Allow dragging saved crunked image into uploader
* Move encoding to webworker
