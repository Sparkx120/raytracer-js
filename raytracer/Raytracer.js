/**
 * Raytracer object to raytrace a world definition
 * @param {Object} config The configuration object
 */
function Raytracer(config){
	// this.camera = config.camera;
	this.world = config.world;

	this.world.some((e) => {if(e instanceof Camera){this.camera = e;};});
	if(!this.camera)
		throw "World Does not have a Camera!";

	this.pixelRenderer = config.pixelRenderer; //Must support function drawPixel({x, y, r, g, b, a});

	this.backgroundColor = {r: 0, g: 0, b: 0, a: 0};
}

Raytracer.prototype.render = function(){
	
}

// Raytracer.prototype.

