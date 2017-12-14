/**
 * Canvas Wrapper object to handle pixel level drawing on the HTML5 Canvas as well as manage the canvas
 * Automatically deploys a canvas to the body
 *
 * (Now in ES6)
 * 
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/07)
 * @license MIT
 */
class Canvas2D{
	constructor(){
		// //Create the Canvas and Deploy it
		this.container = document.createElement('div');
		this.canvas = document.createElement('canvas');
		this.canvas.style.border      = "1px solid black";
		this.canvas.style.width       = "100%";
		this.canvas.style.height      = "100%";
		this.canvas.style.position    = "absolute";
		this.container.style.margin   = "5%";
		this.container.style.width    = "90%";
		this.container.style.height   = "75vh";
		this.container.style.position = "relative";
		this.context = this.canvas.getContext('2d');
		this.container.appendChild(this.canvas);
		document.body.appendChild(this.container);

		//Positioning and Scaling
		this.rect = this.canvas.getBoundingClientRect();
		$(window).on('resize', function(event){
			this.rect = this.canvas.getBoundingClientRect();
			this.canvas.width = this.rect.width;
			this.canvas.height = this.rect.height;
			this.width = this.rect.width;
			this.height = this.rect.height;
			this.buffer = this.context.createImageData(this.width, this.height);
		}.bind(this));
		this.canvas.width = this.rect.width;
		this.canvas.height = this.rect.height;
		this.width = this.rect.width;
		this.height = this.rect.height;
		//Persistant Pixel Image Data Object
		this.pixelImageData = this.context.createImageData(1,1);
		this.buffer = this.context.createImageData(this.width, this.height);
		// this.pixelData = this.pixelImageData.data
	}

	/**
	 * Draws a pixel to this Canvas. Note that RGBA are between 0 and 255
	 * @param  {{x: Number, y: Number, r: Number, g: Number, b: Number, a: Number}} pixel The Pixel to draw
	 */
	drawPixel(pixel){
		// setTimeout(function(){
			//console.log("this Happened", pixel.r, pixel.g, pixel.b, pixel.a);
			this.pixelImageData.data[0] = pixel.r;
			this.pixelImageData.data[1] = pixel.g;
			this.pixelImageData.data[2] = pixel.b;
			this.pixelImageData.data[3] = pixel.a;
			this.context.putImageData(this.pixelImageData, pixel.x, pixel.y);
		// }.bind(this),0);
	}

	drawPixelToBuffer(pixel){
		var index = 4 * (pixel.x + pixel.y * this.width) - 4;
		this.buffer.data[index] = pixel.r;
		this.buffer.data[index+1] = pixel.g;
		this.buffer.data[index+2] = pixel.b;
		this.buffer.data[index+3] = pixel.a;
	}

	flushBuffer(){
		this.context.putImageData(this.buffer, 0,0);
	}

	clearBuffer(){
		this.buffer = this.context.createImageData(this.width, this.height);
	}

	drawLine(line){
		this.context.beginPath();
		this.context.moveTo(line.x1, line.y1);
		this.context.lineTo(line.x2, line.y2);
		this.context.stroke();
	}
}