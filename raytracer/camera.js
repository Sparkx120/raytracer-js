function Camera(config){
	//Camera Specific Points and Vectors
	/**
	 * e is the Camera position
	 * u is the up vector
	 * v is the left right vector
	 * n is the gaze vector
	 */
	this.e = {x:0,y:0,z:0,h:1};
	this.u = {};
	this.v = {};
	this.n = {};
	//Define Near and Far Plane
	this.N = 0.5;
	this.F = 100;

	//Matrices
	this.M = {};
	this.S1T1Mp = {};
	this.WS2T2 = {};
	this.world = {};

	this.e = config.position;
	this.g = config.gaze;

	//Setup Camera Specifics and the world
	this.width = config.width;
	this.height = config.height;
	this.aspect = this.width/this.height;
	this.theta = config.viewingAngle;
	this.world = config.world;

	//Compute the n vector
	var nP = Matrix3DMath.vectorizePoints(this.g,this.e);
	var nPmag = 

}

Camera.prototype.doSomething = function(){
	

}