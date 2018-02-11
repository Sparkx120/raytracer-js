/**
 * Canvas Wrapper object to handle pixel level drawing on the HTML5 Canvas as well as manage the canvas
 * Automatically deploys a canvas to the body (for now)
 * 
 * (Now in ES6)
 * 
 * @author  James Wake (SparkX120)
 * @version 0.0.6 (2017/12)
 * @license MIT
 */
export default class Canvas2D {
	constructor(config){
		//Create the Canvas and Deploy it
		this.container = document.createElement('div');
		this.canvas = document.createElement('canvas');

		if(config && config.supersampling)
			this.supersampling = config.supersampling;
		else
			this.supersampling = 1.0;

		if(config.canvasStyle){
			for(let i in config.canvasStyle){
				this.canvas.style[i] = config.canvasStyle[i];
			}
		}

		if(config.containerStyle){
			for(let i in config.containerStyle){
				this.container.style[i] = config.containerStyle[i];
			}
		}
		else{
			this.container.style.margin   = "0%";
			this.container.style.width    = "100vw";
			this.container.style.height   = "100vh";
			this.container.style.position = "relative";
		}
		
		this.context = this.canvas.getContext('2d');
		this.container.appendChild(this.canvas);

		document.body.appendChild(this.container);

		//Positioning and Scaling
		this.rect = this.container.getBoundingClientRect();
		//TODO Remove Dependency on jQuery
		$(window).on('resize', (event) => {
			this.rect = this.container.getBoundingClientRect();
			this.canvas.width = this.rect.width;
			this.canvas.height = this.rect.height;
			this.width = this.rect.width;
			this.height = this.rect.height;
			this.buffer = this.context.createImageData(this.width*this.supersampling, this.height*this.supersampling);
			if(this.resizeCB){
				this.resizeCB();
			}
		});
		this.canvas.width = this.rect.width;
		this.canvas.height = this.rect.height;
		this.width = this.rect.width;
		this.height = this.rect.height;
		//Persistant Pixel Image Data Object
		this.pixelImageData = this.context.createImageData(1,1);
		this.buffer = this.context.createImageData(this.width, this.height);
		// console.log(this);
		// this.pixelData = this.pixelImageData.data
	}
    
    setSupersampling(supersampling){
        this.supersampling = supersampling;
        this.rect = this.canvas.getBoundingClientRect();
        this.canvas.width = this.rect.width;
        this.canvas.height = this.rect.height;
        this.width = this.rect.width;
        this.height = this.rect.height;
        this.buffer = this.context.createImageData(this.width*this.supersampling, this.height*this.supersampling);
        return this;
    }
    
    getWidth(){
        return this.width*this.supersampling;
    }
    
    getHeight(){
        return this.height*this.supersampling;
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

	drawBufferedPixel(pixel){
		var index = 4 * (pixel.x + pixel.y * this.width*this.supersampling) - 4;
		this.buffer.data[index] = pixel.r;
		this.buffer.data[index+1] = pixel.g;
		this.buffer.data[index+2] = pixel.b;
		this.buffer.data[index+3] = pixel.a;
	}

	flushBuffer(){
        if(this.supersampling > 1)
		    this.context.putImageData(this.buffer, 0,0,0,0,this.width,this.height); //TODO Not functional
        else
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