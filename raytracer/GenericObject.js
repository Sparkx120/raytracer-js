/**
 * Generic Object is the abstract 3DObject Definition for Raytracer-JS
 * @class  GenericObject
 * 
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
function GenericObject(config){
	if(config)
		for(var key in config)
			this[key] = config[key];

	if(!this.baseC)
		this.baseC = {r:100, g:100, b:100, a:255};
	if(!this.ambiantC)
		this.ambiantC = this.baseC;
	if(!this.diffuseC)
		this.diffuseC = this.baseC;
	if(!this.specularC)
		this.specularC = this.baseC;

	if(!this.ambiantFactor)
		this.ambiantFactor = 0.1;
	if(!this.diffuseFactor)
		this.diffuseFactor = 0.4;
	if(!this.specularFactor)
		this.specularFactor = 0.2;
	if(!this.reflectionFactor)
		this.reflectionFactor = 0.3;
	if(!this.refractionFactor)
		this.refractionFactor = 0.0;
	if(!this.specularFalloff)
		this.specularFalloff = 2.0;
	if(!this.refractionIndex)
		this.refractionIndex = 1.4;

	if(!this.transform){
		this.transform = Matrices3D.I;
		this.transformInverse = Matrices3D.I;
	}
	else{
		this.transformInverse = Matrix3DMath.matrixInverse(this.transform);
	}

	if(!this.UVMap)
		this.UVMap = null;
}

/**
 * Sets the transform on this Generic Object
 * @param {Array{Array{}}} transform The Transform
 */
GenericObject.prototype.setTransform = function(transform){
	this.transform = transform;
	this.transformInverse = Matrix3DMath.matrixInverse(this.transform);
}

//Abstract Methods


/**
 * Ray Intersect the Object to see if it is in the Rays path.
 * @param  {Ray} ray The ray to intersect
 */
GenericObject.prototype.rayIntersect = function(ray){};

/**
 * Compute the normal vector relative to a specific point (prefrably on the surface)
 * @param  {Object{x,y,z,h}} point The Point to compute at
 * @return {Object{x,y,z,h}}       The Normal Vector
 */
GenericObject.prototype.getNormalAt = function(point){};

/**
 * Get the UVMap Color at a point on the surface
 * @param  {Object{x,y,z,h}} point The Point to compute at
 * @return {Object{r,g,b,a}}       The Color of the UVMap pixel
 */
GenericObject.prototype.getUVMapAt = function(point){};