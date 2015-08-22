/**
 * Plane is a Generic Object Plane Definition for Raytracer-JS (Now in ES6)
 * @class  Plane
 * 
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
class Plane extends GenericObject{
	constructor(config){
		super(config);
		if(config.restricted)
			this.restricted = config.restricted;
	}

	/**
	 * Ray Intersect the Object to see if it is in the Rays path.
	 * @param  {Ray} ray The ray to intersect
	 */
	rayIntersect(ray){
		//Ray computation
		var eRay = ray.e;
		var dRay = ray.d;
		var e = Math3D.multiplyVectorByMatrix(this.transformInverse, eRay);
		var d = Math3D.multiplyVectorByMatrix(this.transformInverse, dRay);
	    var eVec = {x:e.x, y:e.y, z:e.z, h:0};

		//Intersection Commputation and Additions
		if(d.z != 0){
			var t = -(e.z/d.z);
			if(t>0)
				if(!this.restricted)
					ray.addIntersect(t, this);
				else{
					var x = e.x + d.x*t;
					var y = e.y + d.y*t;
					if((Math.sqrt(x*x + y*y)) <= 1)
						ray.addIntersect(t, this);
				}
		}
	}

	/**
	 * Compute the normal vector relative to a specific point (prefrably on the surface)
	 * @param  {Object{x,y,z,h}} point The Point to compute at
	 * @return {Object{x,y,z,h}}       The Normal Vector
	 */
	getNormalAt(point){
		var norm = {x:0, y:0, z:-1, h:1};
		norm = Math3D.multiplyVectorByMatrix(norm);
		return norm;
	}

	/**
	 * Get the UVMap Color at a point on the surface
	 * @param  {Object{x,y,z,h}} point The Point to compute at
	 * @return {Object{r,g,b,a}}       The Color of the UVMap pixel
	 */
	getUVMapAt(point){
		return {r:0,g:0,b:0,a:0}; //Not Implemented Yet
	}
}