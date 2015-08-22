/**
 * Canvas Wrapper object to handle pixel level drawing on the HTML5 Canvas as well as manage the canvas
 * Automatically deploys a canvas to the body
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/07)
 * @license MIT
 */
function Canvas2D(){
	// //Create the Canvas and Deploy it
	this.canvas = document.createElement('canvas');
	this.canvas.style.border = "1px solid black";
	this.canvas.style.margin = "5%";
	this.canvas.style.width = "90%";
	this.canvas.style.height = "90%";
	this.context = this.canvas.getContext('2d');
	document.body.appendChild(this.canvas);

	//Positioning and Scaling
	this.rect = this.canvas.getBoundingClientRect();
	$(window).on('resize', function(event){
		this.rect = this.canvas.getBoundingClientRect();
		this.canvas.width = this.rect.width;
		this.canvas.height = this.rect.height;
	}.bind(this));
	this.canvas.width = this.rect.width;
	this.canvas.height = this.rect.height;
	this.width = this.rect.width;
	this.height = this.rect.height;
	//Persistant Pixel Image Data Object
	this.pixelImageData = this.context.createImageData(1,1);
	// this.pixelData = this.pixelImageData.data
}

/**
 * Draws a pixel to this Canvas. Note that RGBA are between 0 and 255
 * @param  {{x: Number, y: Number, r: Number, g: Number, b: Number, a: Number}} pixel The Pixel to draw
 */
Canvas2D.prototype.drawPixel = function(pixel){
	// setTimeout(function(){
		//console.log("this Happened", pixel.r, pixel.g, pixel.b, pixel.a);
		this.pixelImageData.data[0] = pixel.r;
		this.pixelImageData.data[1] = pixel.g;
		this.pixelImageData.data[2] = pixel.b;
		this.pixelImageData.data[3] = pixel.a;
		this.context.putImageData(this.pixelImageData, pixel.x, pixel.y);
	// }.bind(this),0);
}

Canvas2D.prototype.drawLine = function(line){
	this.context.beginPath();
	this.context.moveTo(line.x1, line.y1);
	this.context.lineTo(line.x2, line.y2);
	this.context.stroke();
}