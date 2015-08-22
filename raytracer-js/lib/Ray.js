/**
 * Ray Object to contain data for a Ray Intersect List (Now in ES6)
 * @class  Ray
 * @param {Object} config See Constructor
 * 
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
class Ray{
	constructor(config){
		//Camera Config Constructor
		if(config.camera){
			//Set Position on camera view
			this.x = config.x;
			this.y = config.y;

			this.camera = config.camera;

			//Configure Supersampling
			if(config.superSampleRate)
				this.superSampleRate = config.superSampleRate;
			else
				this.superSampleRate = 1;

			//Setup Camera Position
			this.e = config.camera.e;

			//Setup Camera UVN Axis System
			this.u = config.camera.u;
			this.v = config.camera.v;
			this.n = config.camera.n;

			//Setup Camera Dimensions
			this.N = config.camera.N;
			this.W = config.camera.r;
			this.H = config.camera.t;	

			//Compute Ray Vector
			var a = Math3D.scalarMultiply(this.n, -this.N);
			this.a = a;

			var bcoeff = this.W*(((2*this.x)/(this.camera.width*this.superSampleRate))-1);
			this.bcoeff = bcoeff;
			var b = Math3D.scalarMultiply(this.u, bcoeff);
			this.b = b;
			
			var ccoeff = this.H*(((2*this.y)/(this.camera.height*this.superSampleRate))-1);
			this.ccoeff = ccoeff;
			var c = Math3D.scalarMultiply(this.v, ccoeff);
			this.c = c;

			this.d = Math3D.addVectors(Math3D.addVectors(a,b),c);
		}

		//Object Point to Target Point Constructor
		else if(config.objectPoint && config.targetPoint){
			this.e = objectPoint;
			this.d = Math3D.vectorizePoints(objectPoint, targetPoint);
			this.d = Math3D.scalarMultiply(this.d, 1/Math3D.magnitudeOfVector(this.d));
		}
		
		//Direct Config Constructor
		else if(config.e && config.d){
			this.e = config.e;
			this.d = config.d;
		}

		else {throw "Error not a valid Ray Constructor"}

		//Setup Intersect Persistance
		this.lowestIntersectValue = 0;
		this.lowestIntersectObject = null;
		this.lowestIntersectPoint = null;
		this.intersectedObjects = [];

		this.intersectedObject = false;
	}

	/**
	 * Adds an intersection ot the ray.
	 * @param {Object{t, obj}} config Intersection at position t on object obj
	 */
	addIntersect(config){
		if(config.t && config.obj){
			var dt = Math3D.scalarMultiply(this.d, config.t);
			var intersect = Math3D.addPoints(this.e, dt);
			// console.log("added intersect");

			if(!this.intersectedObject && config.t < 0){
				this.lowestIntersectValue = config.t;
				this.lowestIntersectObject = config.obj;
				this.lowestIntersectPoint = intersect;
				this.intersectedObjects.push(config.obj);
				this.intersectedObject = true;
			}
			else{
				if(config.t<this.lowestIntersectValue && config.t < 0){
					this.lowestIntersectValue = config.t;
					this.lowestIntersectObject = config.obj;
					this.lowestIntersectPoint = intersect;
				}
			}

			
		}
		else {throw "Not a valid addIntersect"}
	}

	/**
	 * Detects where a point is on the ray
	 * @param  {Object{x,y,z,h}} point The point to detect
	 * @return {Number}          The IntersectValue
	 */
	rayDetect(point){
		var t = 0;
		if(this.d.x != 0){
			t = (point.x - (this.e.x/this.d.x));
		}
		else{
			if(this.d.y != 0){
				t = (point.y - (this.e.y/this.d.y));
			}
			else{
				if(this.d.z != 0){
					t = (point.z - (this.e.z/thid.d.z));
				}
			}
		}

		return t;
	}
}