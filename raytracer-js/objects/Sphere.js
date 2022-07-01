import { GenericObject } from "./GenericObject.js";
import { Math3D, Matrices3D } from "../lib";

/**import {Math3D, Matricies3D} from "../static/Math3D.js";
 * Sphere is a Generic Object Sphere Definition for Raytracer-JS (Now in ES6)
 * @class  Sphere
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
export class Sphere extends GenericObject {
	constructor(config) {
		super(config);
	}

	/**
	 * Ray Intersect the Object to see if it is in the Rays path.
	 * @param  {Ray} ray The ray to intersect
	 */
	rayIntersect(ray) {
		//Ray computation
		var eRay = ray.e;
		var dRay = ray.d;
		var e = Math3D.multiplyVectorByMatrix(this.transformInverse, eRay);
		var d = Math3D.multiplyVectorByMatrix(this.transformInverse, dRay);
		//d = Math3D.scalarMultiply(d, -1);
		var eVec = { x: e.x, y: e.y, z: e.z, h: 0 };

		//define Spherical Geometry Intersection here
		var magD = Math3D.magnitudeOfVector(d);
		var magE = Math3D.magnitudeOfVector(eVec);

		var a = (magD * magD);
		var b = Math3D.dotProduct(e, d);
		var c = (magE * magE) - 1;

		var det = (b * b) - (a * c);

		// if(det>=0){
		// 	console.log("intersect");
		// }
		// else{
		// 	console.log('no intersect', ray, dRay, d, magD, eRay, eVec, magE, a, b, c, det);
		// }

		// Intersection Calculations and Intersection Additions
		if (det == 0) {
			var t = b / a;
			ray.addIntersect(t, this);
		}

		if (det > 0) {
			var t1 = ((-b / (a)) + (Math.sqrt(det) / (a)));
			var t2 = ((-b / (a)) - (Math.sqrt(det) / (a)));
			ray.addIntersect({ t: t1, obj: this });
			ray.addIntersect({ t: t2, obj: this });
		}
	}

	/**
	 * Compute the normal vector relative to a specific point (prefrably on the surface)
	 * @param  {Object{x,y,z,h}} point The Point to compute at
	 * @return {Object{x,y,z,h}}       The Normal Vector
	 */
	getNormalAt(point) {
		var p = Math3D.multiplyVectorByMatrix(this.transformInverse, point);
		var norm = { x: -p.x, y: -p.y, z: -p.z, h: 0 };
		norm = Math3D.normalizeVector(norm);
		norm = Math3D.multiplyVectorByMatrix(this.transform, norm);
		return norm;
	}

	/**
	 * Get the UVMap Color at a point on the surface
	 * @param  {Object{x,y,z,h}} point The Point to compute at
	 * @return {Object{r,g,b,a}}       The Color of the UVMap pixel
	 */
	getUVMapAt(point) {
		return { r: 0, g: 0, b: 0, a: 0 }; //Not Implemented Yet
	}
}