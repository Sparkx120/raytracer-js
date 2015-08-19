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

	this.backgroundColor = {r: 0, g: 0, b: 0, a: 255};
	this.color = {r: 100, g: 100, b: 100, a: 255};
}

Raytracer.prototype.renderIntersectsOnly = function(){
	for(var i=0; i<this.camera.y; i++){
		for(var j=0; j<this.camera.x; j++){
			var ray = new Ray({x: j, y:i, camera: this.camera});
			this.world.map((obj)=>{
				if(!(obj instanceof Camera)){
					obj.rayIntersect(ray);
				}
			});

			//s
			if(ray.intersectedObject){
				// console.log("intersect at ", i, j);
				this.pixelRenderer.drawPixel({
					x: j,
					y: i,
					r: this.color.r,
					g: this.color.g,
					b: this.color.b,
					a: this.color.a,
				});
			}else{
				// console.log("Nothing at ", i, j);
				this.pixelRenderer.drawPixel({
					x: j,
					y: i,
					r: this.backgroundColor.r,
					g: this.backgroundColor.g,
					b: this.backgroundColor.b,
					a: this.backgroundColor.a,
				});
			}
		}
	}
}

Raytracer.prototype.render = function(){
	
}

// Raytracer.prototype.

