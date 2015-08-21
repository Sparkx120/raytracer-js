/**
 * Raytracer object to raytrace a world definition
 * @param {Object} config The configuration object
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */

class Raytracer{
	constructor(config){
		// this.camera = config.camera;
		this.world = config.world;

		this.world.some((e) => {if(e instanceof Camera){this.camera = e;};});
		if(!this.camera)
			throw "World Does not have a Camera!";

		this.pixelRenderer = config.pixelRenderer; //Must support function drawPixel({x, y, r, g, b, a});

		this.backgroundColor = {r: 0, g: 0, b: 0, a: 255};
		this.color = {r: 100, g: 100, b: 100, a: 255};

		this.falloffFactor = 10;
	}

	renderIntersectsOnly(){
		for(var i=0; i<this.camera.y; i++){
			for(var j=0; j<this.camera.x; j++){
				var ray = new Ray({x: j, y:i, camera: this.camera});
				this.world.map((obj)=>{
					if(obj instanceof GenericObject){
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

	getObjectList(){
		return this.world.filter((elem) => elem instanceof GenericObject);
	}

	getLightList(){
		return this.world.filter((elem) => elem instanceof Light);
	}

	render(){
		var objList   = this.getObjectList();
		var lightList = this.getLightList();

		for(var i=0; i<this.camera.y; i++){
			for(var j=0; j<this.camera.x; j++){
				var ray = new Ray({x: j, y:i, camera: this.camera});
				objList.map((obj)=>{
					obj.rayIntersect(ray);
				});

				if(ray.intersectedObject){
					var object = ray.lowestIntersectObject;

					var ambientFactor  = object.ambientFactor;
					var diffuseFactor  = object.diffuseFactor;
					var specularFactor = object.specularFactor;

					var ambientColor   = object.ambientC;
					var diffuseColor   = {r:0,g:0,b:0,a:0};
					var specularColor  = {r:0,g:0,b:0,a:0};

					if(this.getLightList()){
						diffuseColor   = this._diffuseShader(ray);
						specularColor  = this._specularShader(ray);	
					}
					

					var computedColor = {
						r: ambientColor.r*ambientFactor + diffuseColor.r*diffuseFactor + specularColor.r*specularFactor,
						g: ambientColor.g*ambientFactor + diffuseColor.g*diffuseFactor + specularColor.g*specularFactor,
						b: ambientColor.b*ambientFactor + diffuseColor.b*diffuseFactor + specularColor.b*specularFactor,
						a: object.opacity*255,
					}

					// console.log("intersect at ", i, j);
					this.pixelRenderer.drawPixel({
						x: j,
						y: i,
						r: computedColor.r,
						g: computedColor.g,
						b: computedColor.b,
						a: computedColor.a,
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

	_diffuseShader(ray){
		var object        = ray.lowestIntersectObject;
		var intersect     = ray.lowestIntersectPoint;
		var n             = object.getNormalAt(intersect);
		var falloffFactor = this.falloffFactor;

		var intensities      = [];
		var unShadowedLights = 0;
		var totalIntensity   = 0;

		if(this.getLightList())
			this.getLightList().map((light, index, lights)=>{
				var s = Matrix3DMath.vectorizePoints(intersect, light.source);
				var v = Matrix3DMath.vectorizePoints(intersect, ray.e);

				var ns    = Matrix3DMath.dotProduct(n, s);
				// var magN  = MatrixMath3D.magnitudeOfVector(n);
				// var coeff = 2*((ns/(magN*magN)));
				
				// var r = MatrixMath3D.vectorAdd(
				// 		MatrixMath3D.scalarMultiplyVector(s, -1F),
				// 		MatrixMath3D.scalarMultiplyVector(n, coeff)
				// 	);

				//Compute Falloff from Lightsource
				var distance = Matrix3DMath.magnitudeOfVector(s);

				if(distance > -1 && distance < 1)
					distance = 1;

				//Compute Diffuse Intensity
				var nDots = ns/(Matrix3DMath.magnitudeOfVector(s)*Matrix3DMath.magnitudeOfVector(n));
				var diffuseIntensity = Math.max(nDots, 0)/((distance/falloffFactor)^2);

				totalIntensity += diffuseIntensity;
			});

		return {
			r:object.diffuseC.r*totalIntensity,
			g:object.diffuseC.g*totalIntensity,
			b:object.diffuseC.b*totalIntensity,
			a:255}
	}

	_specularShader(ray){
		return {r:0,g:0,b:0,a:255}
	}
}
