import { Math3D, Matrices3D } from "../lib";

/**
 * Generic Object is the abstract 3DObject Definition for Raytracer-JS (Now in ES6)
 * @class  GenericObject
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
export class GenericObject {
	constructor(config) {
		if (config)
			for (var key in config)
				this[key] = config[key];

		if (!this.baseC)
			this.baseC = { r: 255, g: 255, b: 255, a: 255 };
		if (!this.ambientC)
			this.ambientC = this.baseC;
		if (!this.diffuseC)
			this.diffuseC = this.baseC;
		if (!this.specularC)
			this.specularC = this.baseC;

		if (!this.ambientFactor)
			this.ambientFactor = 0.0;
		if (!this.diffuseFactor)
			this.diffuseFactor = 0.2;
		if (!this.specularFactor)
			this.specularFactor = 0.5;
		if (!this.reflectionFactor)
			this.reflectionFactor = 0.6;
		if (!this.refractionFactor)
			this.refractionFactor = 0.0;
		if (!this.specularFalloff)
			this.specularFalloff = 40;
		if (!this.refractionIndex)
			this.refractionIndex = 1.0;

		if (!this.opacity)
			this.opacity = 1.0;

		if (!this.transform) {
			this.transform = Matrices3D.I;
			this.transformInverse = Matrices3D.I;
		}
		else {
			this.transformInverse = Math3D.matrixInverse(this.transform);
		}

		if (!this.UVMap)
			this.UVMap = null;
	}

	/**
	 * Sets the transform on this Generic Object
	 * @param {Array{Array{}}} transform The Transform
	 */
	setTransform(transform) {
		this.transform = transform;
		this.transformInverse = Math3D.matrixInverse(this.transform);
	}

	//Abstract Methods
	/**
	 * Ray Intersect the Object to see if it is in the Rays path.
	 * @param  {Ray} ray The ray to intersect
	 */
	rayIntersect(ray) { };

	/**
	 * Compute the normal vector relative to a specific point (prefrably on the surface)
	 * @param  {Object{x,y,z,h}} point The Point to compute at
	 * @return {Object{x,y,z,h}}       The Normal Vector
	 */
	getNormalAt(point) { };

	/**
	 * Get the UVMap Color at a point on the surface
	 * @param  {Object{x,y,z,h}} point The Point to compute at
	 * @return {Object{r,g,b,a}}       The Color of the UVMap pixel
	 */
	getUVMapAt(point) { };
}