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
	var nPmag = 1/Matrix3DMath.magnitudeOfVector(nP);
	this.n = Matrix3DMath.scalarMultiply(nP, nPmag);

	//Compute Vector u (+y axis = up)
	var pP = {x:0, y:1, z:0, h:0};
	this.u = Matrix3DMath.crossProduct(pP, n);
	this.u = Matrix3DMath.scalarMultiply(this.u,-1);

	//Compute Vector v
	this.v = Matrix3DMath.crossProduct(this.n, this.u);

	//Setup the Matrix Pipe
	this.updateMatrixPipe();

	//Setup Debug
	this.debug = true;
}

/**
 * Updates the Matrix Pipe for the camera
 */
Camera.prototype.updateMatrixPipe = function(){
	this.WS2T2 = this.computeWS2T2();
	if(this.debug){console.log(matrixToString(this.WS2T2));}

	this.S1T1Mp = this.computeS1T1Mp();
	if(this.debug){console.log(matrixToString(this.S1T1Mp));}

	this.Mv = this.computeMv();
	if(this.debug){console.log(matrixToString(this.Mv));}

	var mid = Matrix3DMath.multiplyMatricies(Ws2T2, S1T1Mp);
	if(this.debug){console.log(matrixToString(mid));}

	this.matrixPipe = Matrix3DMath.multiplyMatricies(mid, Mv);
	if(this.debug){console.log(matrixToString(this.matrixPipe));}
}

Camera.prototype.computeWS2T2 = function(){
	var data = Matrix3DMath.initMatrix();

	//Localize Vars
	var width = this.width;
	var height = this.height;

	//Setup matrix array
	data[0][0] = width/2;	data[0][1] = 0;			data[0][2] = 0;	data[0][3] = width/2;
	data[1][0] = 0;			data[1][1] = -height/2;	data[1][2] = 0; data[1][3] = ((-height/2) + height);
	data[2][0] = 0;			data[2][1] = 0;			data[2][2] = 1;	data[2][3] = 0;
	data[3][0] = 0;			data[3][1] = 0;			data[3][2] = 0; data[3][3] = 1;

	return data;
}

Camera.prototype.computeS1T1Mp = function(){
	var data = Matrix3DMath.initMatrix();
		
	//Set Camera Variables
	this.t = (float) (N*Math.tan((Math.PI/180)*(theta/2)));
	this.b = -t;
	this.r = aspect*t;
	this.l = -r;

	//Localize Vars
	var t = this.t; var b = this.b; var r = this.r; var l = this.l;
	var N = this.N; var F = this.F;
	
	//Setup matrix array
	data[0][0] = ((2*N)/(r-1)); data[0][1] = 0;				data[0][2] = ((r+l)/(r-l));		data[0][3] = 0;
	data[1][0] = 0;				data[1][1] = ((2*N)/(t-b)); data[1][2] = ((t+b)/(t-b));		data[1][3] = 0;
	data[2][0] = 0;				data[2][1] = 0;				data[2][2] = ((-(F+N))/(F-N));	data[2][3] = ((-2*F*N)/(F-N));
	data[3][0] = 0;				data[3][1] = 0;				data[3][2] = -1;				data[3][3] = 0;

	return data;
}

Camera.prototype.computeMv = function(){
	var data = Matrix3DMath.initMatrix();
	var u = this.u; var v = this.v; var n = this.n;
	//Setup matrix array
	data[0][0] = u.x;	data[0][1] = u.y;	data[0][2] = u.z;	data[0][3] = -Matrix3DMath.dotProduct(e, u);
	data[1][0] = v.x;	data[1][1] = v.y;	data[1][2] = v.z;	data[1][3] = -Matrix3DMath.dotProduct(e, v);
	data[2][0] = n.x;	data[2][1] = n.y;	data[2][2] = n.z;	data[2][3] = -Matrix3DMath.dotProduct(e, n);
	data[3][0] = 0;		data[3][1] = 0;		data[3][2] = 0;		data[3][3] = 1;

	return data;
}