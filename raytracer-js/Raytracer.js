import {GenericObject, Light} from "./objects";
import {Camera, Ray, Math3D, Matrices3D} from "./lib";

export const Version = "1.0.0"
if(window){
	window.raytracer_version = Version;
}

/**
 * Raytracer object to raytrace a world definition
 * @param {Object} config The configuration object
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */

export default class Raytracer{
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
		this.recursionFactor = 4;

		this.drawTitle();
	}

	drawTitle(){
		var width  = this.pixelRenderer.width;
		var height = this.pixelRenderer.height;
		var ctx    = this.pixelRenderer.context;
		var x      = width  / 2;
      	var y1     = height * (1/3);
      	var y2     = height * (2/3);

		ctx.font = '30pt Helvetica,Arial,sans-serif';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'Black';
		ctx.fillText('Raytracer-JS', x, y1);

		ctx.font = '15pt Helvetica,Arial,sans-serif';
		ctx.fillText(`Version ${Version} By SparkX120`, x, y2);

	}

	drawRenderingPlaceholder(){
		var width  = this.pixelRenderer.width;
		var height = this.pixelRenderer.height;
		var ctx    = this.pixelRenderer.context;
		var x      = width  / 2;
      	var y      = height / 2;

		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(0,0,width,height);

		this.progress       = document.createElement("progress");
		this.progress.max   = 100;
		this.progress.value = 0;
		this.progress.style.left 			= '0%';
		this.progress.style.zindex          = "99";
		this.progress.style.width           = "100%";
		this.progress.style.height          = "3em";
		this.progress.style.bottom          = "50%";
		this.progress.style.position        = "absolute";
		// this.progress.style.border          = "1px solid black";
		this.progress.className             = "prog";

		if(this.pixelRenderer.container)
			this.pixelRenderer.container.appendChild(this.progress);
	}

	getObjectList(){
		return this.world.filter((elem) => elem instanceof GenericObject);
	}

	getLightList(){
		return this.world.filter((elem) => elem instanceof Light);
	}

	stop(){
		if(this.timeint){
			console.log("killing render");
			clearInterval(this.timeint);
			this.timeint = null;
		}
	}

	render(){
		this.drawRenderingPlaceholder();

		//Give canvas async time to update
		var renderLoop = setTimeout(()=>{
			this.pixelRenderer.clearBuffer();
			this.camera.width = this.pixelRenderer.width;
			this.camera.height = this.pixelRenderer.height;
			this.camera.setupVectors();

			//Run outerloop in interval so canvas can live update
			var i = 0;
			this.timeint = setInterval(()=>{
				if(i<this.camera.y){ i++;
					for(var j=0; j<this.camera.x; j++){
						var ray   = new Ray({x: j, y:i, camera: this.camera, depth: 0});
						var color = this.raytrace(ray);
						var pixel = color;
						pixel.x = j;
						pixel.y = i;
						this.pixelRenderer.drawPixel(pixel);
					}
					// this.pixelRenderer.flushBuffer();

					//Update Progress Bar
					var progress = Math.floor((i/this.camera.y)*100);
					if(this.progress && this.progress.value != progress){
						this.progress.value = progress;
					}

				}else{
					//Get rid of the Progress Bar
					if(this.progress){
						this.pixelRenderer.container.removeChild(this.progress);
						this.progress = null;
					}
					// this.pixelRenderer.flushBuffer();
					clearInterval(this.timeint);
				}
			}, 0);

			
		},0);
	}

	

	raytrace(ray, recursion, objR){
		if(recursion && recusion > this.recursionFactor) return {r:0, g:0, b:0, a:0};

		var objList   = this.getObjectList();
		var lightList = this.getLightList();

		objList.map((obj)=>{
			if(objR){ //Don't intersect with self surface under recursion
				if(objR != obj) obj.rayIntersect(ray);
			}
			else{
				obj.rayIntersect(ray);
			}
		});

		if(ray.intersectedObject){
			var object = ray.lowestIntersectObject;

			var ambientFactor  = object.ambientFactor;
			var diffuseFactor  = object.diffuseFactor;
			var specularFactor = object.specularFactor;
			var reflectionFactor = object.reflectionFactor;
			var refractionFactor = object.refractionFactor;

			var ambientColor   = object.ambientC;
			var diffuseColor   = {r:0,g:0,b:0,a:0};
			var specularColor  = {r:0,g:0,b:0,a:0};
			var reflectionColor  = {r:0,g:0,b:0,a:0};
			var refractionColor = {r:0,g:0,b:0,a:0};

			if(this.getLightList()){
				if(object.diffuseFactor>0)
					diffuseColor   = this._diffuseShader(ray);
				if(object.specularFactor>0)
					specularColor  = this._specularShader(ray);	
				if(object.reflectionFactor>0)
					reflectionColor  = this._reflectionShader(ray);
				if(object.refractionFactor>0){
					refractionColor = this._refractionShader(ray, recursion);
				}
			}
			

			var computedColor = {
				r: ambientColor.r*ambientFactor + diffuseColor.r*diffuseFactor + specularColor.r*specularFactor + reflectionColor.r*reflectionFactor + refractionColor.r*refractionFactor,
				g: ambientColor.g*ambientFactor + diffuseColor.g*diffuseFactor + specularColor.g*specularFactor + reflectionColor.g*reflectionFactor + refractionColor.g*refractionFactor,
				b: ambientColor.b*ambientFactor + diffuseColor.b*diffuseFactor + specularColor.b*specularFactor + reflectionColor.b*reflectionFactor + refractionColor.b*refractionFactor,
				a: object.opacity*255,
			}

			// console.log("intersect at ", i, j);
			return{
				r: Math.min(computedColor.r, 255),
				g: Math.min(computedColor.g, 255),
				b: Math.min(computedColor.b, 255),
				a: Math.min(computedColor.a, 255),
			};
		}

		return {
			r: this.backgroundColor.r,
			g: this.backgroundColor.g,
			b: this.backgroundColor.b,
			a: this.backgroundColor.a,
		};
	}

	_diffuseShader(ray){
		var object        = ray.lowestIntersectObject;
		var intersect     = ray.lowestIntersectPoint;
		var n             = object.getNormalAt(intersect);
		var falloffFactor = this.falloffFactor;

		var intensities      = [];
		var unShadowedLights = 0;
		var totalIntensity   = 0;

		if(this.getLightList()){
			this.getLightList().map((light, index, lights)=>{
				var s = Math3D.vectorizePoints(intersect, light.source);
				var v = Math3D.vectorizePoints(intersect, ray.e);
				var ns    = Math3D.dotProduct(n, s);

				var shadowDetect = new Ray({e:intersect, d: s, exclusionObj: object});
				this.getObjectList().map((obj)=>{
					obj.rayIntersect(shadowDetect)
				});	

				if(!shadowDetect.intersectedObject){
					//Compute Falloff from Lightsource
					// var distance = Math3D.magnitudeOfVector(s);

					//Compute Diffuse Intensity
					var div   = Math3D.magnitudeOfVector(s)*Math3D.magnitudeOfVector(n);
					if(div != 0){
						var nDots = ns/(div);
						var diffuseIntensity = (light.intensity*Math.max(nDots, 0));
						totalIntensity += diffuseIntensity;	
					}	
				}
			});
		}

		return {
			r:object.diffuseC.r*totalIntensity,
			g:object.diffuseC.g*totalIntensity,
			b:object.diffuseC.b*totalIntensity,
			a:255}
	}

	_specularShader(ray){
		var object        = ray.lowestIntersectObject;
		var intersect     = ray.lowestIntersectPoint;
		var n             = object.getNormalAt(intersect);
		var falloffFactor = this.falloffFactor;

		var intensities      = [];
		var unShadowedLights = 0;
		var totalIntensity   = 0;
		if(this.getLightList()){
			this.getLightList().map((light, index, lights)=>{
				var s = Math3D.vectorizePoints(intersect, light.source);
				var v = Math3D.vectorizePoints(intersect, ray.e);
				var ns    = Math3D.dotProduct(n, s);

				var shadowDetect = new Ray({e:intersect, d: s, exclusionObj: object});
				this.getObjectList().map((obj)=>{
					obj.rayIntersect(shadowDetect)
				});	
				if(!shadowDetect.intersectedObject){
					var magN  = Math3D.magnitudeOfVector(n);
					var coeff = 2*((ns/(magN*magN)));
					
					var r = Math3D.addVectors(
							Math3D.scalarMultiply(s, -1.0),
							Math3D.scalarMultiply(n, coeff)
						);

					var f = object.specularFalloff;

					//Compute Falloff from Lightsource
					// var distance = Math3D.magnitudeOfVector(s);

					// if(distance < 1)
					// 	distance = 1;

					//Compute Specular Intensity
					var specularIntensity = 0;
					var vDotr = Math3D.dotProduct(v, r)/(Math3D.magnitudeOfVector(v)*Math3D.magnitudeOfVector(r));
					if(vDotr > 0){
						specularIntensity = (light.intensity*Math.max(Math.pow(vDotr,f), 0));
					}

					totalIntensity = totalIntensity + specularIntensity;	
				}
			});
		// if(totalIntensity > 0){
		// 	console.log(totalIntensity);
		// }
		}
		return {
			r:object.specularC.r*totalIntensity,
			g:object.specularC.g*totalIntensity,
			b:object.specularC.b*totalIntensity,
			a:255}
	}

	_reflectionShader(ray){
		var object        = ray.lowestIntersectObject;
		var intersect     = ray.lowestIntersectPoint;
		var norm          = object.getNormalAt(intersect);

		var iDotn = Math3D.dotProduct(Math3D.normalizeVector(ray.d), Math3D.normalizeVector(norm));
		if((object.reflectionFactor > 0) && ray.depth < this.recursionFactor && iDotn < 0){
			//Reflection Vector
			var coeff = -2*(iDotn);
			var reflectionD = Math3D.scalarMultiply(norm, coeff);
			reflectionD = Math3D.normalizeVector(reflectionD);

			var incident = new Ray({e:intersect, d:reflectionD, depth: ray.depth+1, exclusionObj: object});	
			var reflection = this.raytrace(incident); //uses incident object detection aka this obj
			return {
			r:reflection.r,
			g:reflection.g,
			b:reflection.b,
			a:255}
		}

		return this.backgroundColor;
	}

	_refractionShader(ray, recursion){
		var object        = ray.lowestIntersectObject;
		var intersect     = ray.lowestIntersectPoint;
		var norm          = object.getNormalAt(intersect);
		
		//Refraction Vector (assuming transitions with air)
		//Based on math from http://graphics.stanford.edu/courses/cs148-10-summer/docs/2006--degreve--reflection_refraction.pdf
		//Based on Derivation from http://www.starkeffects.com/snells-law-vector.shtml
		var nTheta = Math3D.dotProduct(Math3D.normalizeVector(Math3D.scalarMultiply(ray.d, 1)), Math3D.normalizeVector(norm));
		var cosNTheta = nTheta;//(float) Math.cos(nTheta);
		var refractionIndex = object.refractionIndex;

		//start with white
		var refraction = {r: 255, g: 255, b:255, a: 255}

		if(object.refractionIndex > 0.0){
			//Do Refraction Angle Computation
			var nCrossD = Math3D.crossProduct(norm, ray.d);
			var i = Math3D.crossProduct(norm, Math3D.crossProduct(Math3D.scalarMultiply(norm, -1), ray.d));
			i = Math3D.scalarMultiply(i, refractionIndex);
			var nDotn = Math3D.dotProduct(nCrossD, nCrossD);
			var coeff = Math.sqrt(1-refractionIndex*refractionIndex*nDotn);
			var j = Math3D.scalarMultiply(norm, coeff);
			var refractionD = Math3D.normalizeVector(Math3D.vectorizePoints(i, j));
			
			//Create Refraction Ray
			var refracted = new Ray({e:ray.e, d:refractionD});
			
			//Run Recursive RayTrace
			object.rayIntersect(refracted);
			if(refracted.intersectedObject)
				refracted = new Ray({e:refracted.lowestIntersectPoint, d:ray.d});
			
			refraction = this.raytrace(refracted, recursion+1, object); //Detect object
			
		}
				
		
		return {
			r:refraction.r,
			g:refraction.g,
			b:refraction.b,
			a:255}
	}
}
