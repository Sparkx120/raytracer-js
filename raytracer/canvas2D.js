/**
 * Raytracer Canvas Control Wrapper object to handle pixel level drawing on the HTML5 Canvas
 * A
 * @param {[type]} canvasID [description]
 */
function Canvas2D(){
	// this.canvas = document.getElementById(canvasID);
	// <canvas id="2dray" style="border: 1px solid black; margin-left: 5%; width:90%; height:95%"></canvas>
	this.canvas = document.createElement('canvas');
	this.canvas.style.border = "1px solid black";
	this.canvas.style.margin = "5%";
	this.canvas.style.width = "90%";
	this.canvas.style.height = "90%";
	this.context = this.canvas.getContext('2d');
	document.body.appendChild(this.canvas);

	this.rect = this.canvas.getBoundingClientRect();
	$(window).on('resize', function(event){
		this.rect = this.canvas.getBoundingClientRect();
		this.canvas.width = rect.width;
	this.canvas.height = rect.height;
	}.bind(this));

	this.canvas.width = this.rect.width;
	this.canvas.height = this.rect.height;

	this.pixelImageData = this.context.createImageData(1,1);
	// this.pixelData = this.pixelImageData.data
}

Canvas2D.prototype.getCanvas = function(){
	return this.canvas;
}

/**
 * Draws a pixel to this Canvas. Note that RGBA are between 0 and 255
 * @param  {{x: Number, y: Number, r: Number, g: Number, b: Number, a: Number}} pixel The Pixel to draw
 */
Canvas2D.prototype.drawPixel = function(pixel){
	// setTimeout(function(){
		this.pixelImageData.data[0] = pixel.r;
		this.pixelImageData.data[1] = pixel.g;
		this.pixelImageData.data[2] = pixel.b;
		this.pixelImageData.data[3] = pixel.a;
		this.context.putImageData(this.pixelImageData, pixel.x, pixel.y);
	// }.bind(this),0);
}