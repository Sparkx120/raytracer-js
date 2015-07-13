/**
 * Raytracer object to raytrace a world definition
 * @param {Object} config The configuration object
 */
function Raytracer(config){
	this.camera = config.camera;
	this.world = config.world;
	this.pixelRenderer = config.pixelRenderer; //Must support function drawPixel({x, y, r, g, b, a});
}

Raytracer.prototype.render = function(){
	
}

// Raytracer.prototype.

