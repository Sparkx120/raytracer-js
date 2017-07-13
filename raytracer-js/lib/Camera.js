/**
 * The Camera Object (Now in ES6)
 * @class Camera Object
 * 
 * @param {Object} config Configuration Object (width height viewingAngle world position gaze point)
 *
 * @author  James Wake (Sparkx120)
 * @version 1.1 (2015/08)
 * @license MIT
 */
class Camera{
		constructor(config){
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
		this.M      = {};
		this.S1T1Mp = {};
		this.WS2T2  = {};
		this.world  = {};

		this.e = config.position;
		this.g = config.gaze;
		
		this.width  = config.width;
		this.height = config.height;

		this.setupVectors = function(){
			//Setup Camera Specifics and the world
			this.x      = this.width;
			this.y      = this.height;
			this.aspect = this.width/this.height;
			this.theta  = config.viewingAngle;
			this.world  = config.world;

			//Compute the n vector
			var nP = Math3D.vectorizePoints(this.g,this.e);
			var nPmag = 1/Math3D.magnitudeOfVector(nP);
			this.n = Math3D.scalarMultiply(nP, nPmag);

			//Compute Vector u (+y axis = up)
			var pP = {x:0, y:0, z:1, h:0};
			this.u = Math3D.crossProduct(pP, this.n);
			//this.u = Math3D.scalarMultiply(this.u,-1);

			//Compute Vector v
			this.v = Math3D.crossProduct(this.n, this.u);

			//Set Camera Variables
			this.t = this.N*Math.tan((Math.PI/180)*(this.theta/2));
			this.b = -this.t;
			this.r = this.aspect*this.t;
			this.l = -this.r;

			//Setup the Matrix Pipe
			this.updateMatrixPipe();
		}.bind(this);

		this.setupVectors();

		//Setup Debug
		this.debug = false;

		if(config.noPipe){
			this.noPipe = true;
		}
	}

	/**
	 * Moves camera along U Axis
	 * @param  {Number} mag Magnitude to move
	 */
	moveU(mag){
		var motion = Math3D.scalarMultiply(this.u,mag);
		this.e = Math3D.addPoints(motion, this.e);
		this.updateMatrixPipe();
	}

	/**
	 * Moves camera along V Axis
	 * @param  {Number} mag Magnitude to move
	 */
	moveV(mag){
		var motion = Math3D.scalarMultiply(this.v,mag);
		this.e = Math3D.addPoints(motion, this.e);
		this.updateMatrixPipe();
	}

	/**
	 * Moves camera along N Axis
	 * @param  {Number} mag Magnitude to move
	 */
	moveN(mag){
		var motion = Math3D.scalarMultiply(this.n,mag);
		this.e = Math3D.addPoints(motion, this.e);
		this.updateMatrixPipe();
	}

	/**
	 * Rotates camera along U Axis
	 * @param  {Number} mag Magnitude to rotate (degrees)
	 */
	rotateU(mag){
		var rotate = Math3D.rotateOnArbitrary(mag, this.u);
		this.v = multiplyMatrixWithVector(rotate, this.v);
		this.n = multiplyMatrixWithVector(rotate, this.n);
	}

	/**
	 * Rotates camera along V Axis
	 * @param  {Number} mag Magnitude to rotate (degrees)
	 */
	rotateV(mag){
		var rotate = Math3D.rotateOnArbitrary(mag, this.v);
		this.u = multiplyMatrixWithVector(rotate, this.u);
		this.n = multiplyMatrixWithVector(rotate, this.n);
	}

	/**
	 * Rotates camera along N Axis
	 * @param  {Number} mag Magnitude to rotate (degrees)
	 */
	rotateN(mag){
		var rotate = Math3D.rotateOnArbitrary(mag, this.n);
		this.u = multiplyMatrixWithVector(rotate, this.u);
		this.v = multiplyMatrixWithVector(rotate, this.v);
	}

	/**
	 * Updates the Matrix Pipe for the camera
	 * Pipe is currently untested
	 */
	updateMatrixPipe(){
		if(!this.noPipe){
			this.WS2T2 = this.computeWS2T2();
			if(this.debug){console.log(matrixToString(this.WS2T2));}

			this.S1T1Mp = this.computeS1T1Mp();
			if(this.debug){console.log(matrixToString(this.S1T1Mp));}

			this.Mv = this.computeMv();
			if(this.debug){console.log(matrixToString(this.Mv));}

			var mid = Math3D.multiplyMatrices(this.WS2T2, this.S1T1Mp);
			if(this.debug){console.log(matrixToString(mid));}

			this.matrixPipe = Math3D.multiplyMatrices(mid, this.Mv);
			if(this.debug){console.log(matrixToString(this.matrixPipe));}
		}
	}

	computeWS2T2(){
		var data = Math3D.initMatrix();

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

	computeS1T1Mp(){
		var data = Math3D.initMatrix();

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

	computeMv(){
		var data = Math3D.initMatrix();
		
		//Localize Vars
		var u = this.u; var v = this.v; var n = this.n; var e = this.e;

		//Setup matrix array
		data[0][0] = u.x;	data[0][1] = u.y;	data[0][2] = u.z;	data[0][3] = -Math3D.dotProduct(e, u);
		data[1][0] = v.x;	data[1][1] = v.y;	data[1][2] = v.z;	data[1][3] = -Math3D.dotProduct(e, v);
		data[2][0] = n.x;	data[2][1] = n.y;	data[2][2] = n.z;	data[2][3] = -Math3D.dotProduct(e, n);
		data[3][0] = 0;		data[3][1] = 0;		data[3][2] = 0;		data[3][3] = 1;

		return data;
	}
}