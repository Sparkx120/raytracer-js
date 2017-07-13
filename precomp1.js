/**
 * Matrix Math 
 * 
 * Matrices are defined as
 * [[1,0,0,0],
 *  [0,1,0,0],
 *  [0,0,1,0],
 *  [0,0,0,1]]
 *
 * Vectors and Points are defined as
 * {x:0, y:0, z:0, h:0}
 *
 * @author  James Wake (Sparkx120)
 * @version 1.0 (2015/07)
 * @license MIT
 */
function Math3D() {};

Math3D.transformPipe = function (matrixPipe) {
	var data = Matrices3D.I;

	for (let i = 0; i < matrixPipe.length; i++) {
		data = Math3D.multiplyMatrices(data, matrixPipe[i]);
	}

	return data;
};

Math3D.scale = function (xf, yf, zf) {
	var data = Math3D.initMatrix(4, 4);

	//Setup Scale Matrix
	data[0][0] = xf;data[0][1] = 0;data[0][2] = 0;data[0][3] = 0;
	data[1][0] = 0;data[1][1] = yf;data[1][2] = 0;data[1][3] = 0;
	data[2][0] = 0;data[2][1] = 0;data[2][2] = zf;data[2][3] = 0;
	data[3][0] = 0;data[3][1] = 0;data[3][2] = 0;data[3][3] = 1;

	return data;
};

Math3D.translate = function (x, y, z) {
	var data = Math3D.initMatrix(4, 4);

	//Setup Scale Matrix
	data[0][0] = 1;data[0][1] = 0;data[0][2] = 0;data[0][3] = x;
	data[1][0] = 0;data[1][1] = 1;data[1][2] = 0;data[1][3] = y;
	data[2][0] = 0;data[2][1] = 0;data[2][2] = 1;data[2][3] = z;
	data[3][0] = 0;data[3][1] = 0;data[3][2] = 0;data[3][3] = 1;

	return data;
};

Math3D.rotateOnArbitrary = function (deg, axis) {
	//Preconfig
	var cos = Math.cos(Math.PI / 180 * deg);
	var sin = Math.sin(Math.PI / 180 * deg);
	var v = Math3D.normalizeVector(axis);

	var data = Math3D.initMatrix(4, 4);

	//Setup Jv Matrix
	data[0][0] = 0;data[0][1] = -v.z();data[0][2] = v.y();data[0][3] = 0;
	data[1][0] = v.z();data[1][1] = 0;data[1][2] = -v.x();data[1][3] = 0;
	data[2][0] = -v.y();data[2][1] = v.x();data[2][2] = 0;data[2][3] = 0;
	data[3][0] = 0;data[3][1] = 0;data[3][2] = 0;data[3][3] = 1;

	var R = Math3D.addMatrix(Matrices3D.I, MatrixMath3D.addMatrix(Math3D.scalarMultiplyMatrix(data, sin)), Math3D.scalarMultiplyMatrix(Math3D.multiplyMatrices(data, data), 1 - cos));

	return R;
};

/**
 * Vectorizes two points
 * @param  {{x:Number, y:Number, z:Number, h:Number}} pointA	The start point
 * @param  {{x:Number, y:Number, z:Number, h:Number}} pointB	The end point
 * @return {{x:Number, y:Number, z:Number, h:Number}} 			The Vector represented by these two points
 */
Math3D.vectorizePoints = function (pointA, pointB) {
	var v = Math3D.subtractPoints(pointA, pointB);
	v.h = 0;
	return v;
};

/**
 * Compute the cross product of two vectors
 * @param  {{x:Number, y:Number, z:Number, h:Number}} a	Vector A
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Vector B
 * @return {{x:Number, y:Number, z:Number, h:Number}} 	The Crossproduct Resultant
 */
Math3D.crossProduct = function (a, b) {
	// if(a.h > 0 || b.h > 0){
	// 	console.log("Point!!!");
	// 	throw "Error Points can't be used in Crossproduct";
	// }
	return { x: a.y * b.z - a.z * b.y,
		y: a.z * b.x - a.x * b.z,
		z: a.x * b.y - a.y * b.x,
		h: 0.0 };
};

/**
 * Compute the dot product of two vectors
 * @param  {{x:Number, y:Number, z:Number, h:Number}} a	Vector A
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Vector B
 * @return {Number} 									The Crossproduct Resultant
 */
Math3D.dotProduct = function (a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z + a.h * b.h;
};

/**
 * Scalar Multiply a point of vector
 * @param  {{x:Number, y:Number, z:Number, h:Number}} v  	The point or vector to multiple
 * @param  {{x:Number, y:Number, z:Number, h:Number}} mag	The magnitude to multiple
 * @return {{x:Number, y:Number, z:Number, h:Number}}     	The new point
 */
Math3D.scalarMultiply = function (v, mag) {
	return { x: v.x * mag,
		y: v.y * mag,
		z: v.z * mag,
		h: v.h * mag };
};

/**
 * Compute the magnitude of a Vecotr
 * @param  {{x:Number, y:Number, z:Number, h:Number}} v	The vector to find the magnitude of
 * @return {Number}        								The Magnitude
 */
Math3D.magnitudeOfVector = function (v) {
	return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z + v.h * v.h);
};

/**
 * Adds two points A+B
 * @param  {{x:Number, y:Number, z:Number, h:Number}} a	First point to add 
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Second point to add
 * @return {{x:Number, y:Number, z:Number, h:Number}} 	The resultant point
 */
Math3D.addPoints = function (a, b) {
	return { x: a.x + b.x,
		y: a.y + b.y,
		z: a.z + b.z,
		h: a.h + b.h };
};

/**
 * Adds two vectors A+B
 * @param  {{x:Number, y:Number, z:Number, h:Number}} a	First vector to add 
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Second vector to add
 * @return {{x:Number, y:Number, z:Number, h:Number}} 	The resultant vector
 */
Math3D.addVectors = function (a, b) {
	return Math3D.addPoints(a, b);
};

/**
 * Subtracts two points A-B
 * @param  {{x:Number, y:Number, z:Number, h:Number}} a	The point to subtract from
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	The point being substracted from a
 * @return {{x:Number, y:Number, z:Number, h:Number}} 	The resultant point
 */
Math3D.subtractPoints = function (a, b) {
	return { x: a.x - b.x,
		y: a.y - b.y,
		z: a.z - b.z,
		h: 1.0 };
};

Math3D.normalizeVector = function (v) {
	var out = {};
	var mag = Math3D.magnitudeOfVector(v);
	out = Math3D.scalarMultiply(v, 1 / mag);

	return out;
};

/**
 * Initializes a Zeroed 4x4 Matrix
 * @return {Array<Number[]>} The Zeroed Matrix
 */
Math3D.initMatrix = function (x, y) {
	var m = [];
	if (x && y) {
		for (var i = 0; i < x; i++) {
			var r = [];
			for (var j = 0; j < y; j++) {
				r.push(0);
			}
			m.push(r);
		}
	} else {
		for (var i = 0; i < 4; i++) m.push([0, 0, 0, 0]);
	}
	return m;
};

/**
 * Adds two matricies together
 * @param {Array<Number[]>} a	First Matrix to add
 * @param {Array<Number[]>} b	Second Matrix to add
 * @return {Array<Number[]>} 	The Resultant Matrix
 */
Math3D.addMatrix = function (a, b) {
	var m = this.initMatrix();
	for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) m[i][j] = a[i][j] + b[i][j];
	return m;
};

/**
 * Scalar Multiples a Matrix by a value
 * @param  {Array<Number[]>} a	The matrix to multiply
 * @param  {Number} mag 		The Scalar Multiple
 * @return {Array<Number[]>}    The Result of the multiplication
 */
Math3D.scalarMultiplyMatrix = function (a, mag) {
	var m = this.initMatrix();
	for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) m[i][j] = a[i][j] * mag;
	return m;
};

/**
 * Multiplies two matricies together
 * @param  {Array<Number[]>} a	First matrix to multiply
 * @param  {Array<Number[]>} b	Second matrix to multiply
 * @return {Array<Number[]>}  	The resultant matrix
 */
Math3D.multiplyMatrices = function (a, b) {
	var m = this.initMatrix();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var v = 0;
			for (var k = 0; k < 4; k++) v += a[i][k] * b[k][j];
			m[i][j] = v;
		}
	}
	return m;
};

/**
 * Multiplies a vector or point by the matrix
 * @param  {Array<Number[]>} m 							The matrix
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	The vector
 * @return {{x:Number, y:Number, z:Number, h:Number}}   The resultant vector
 */
Math3D.multiplyVectorByMatrix = function (m, b) {
	return { x: b.x * m[0][0] + b.y * m[0][1] + b.z * m[0][2] + b.h * m[0][3],
		y: b.x * m[1][0] + b.y * m[1][1] + b.z * m[1][2] + b.h * m[1][3],
		z: b.x * m[2][0] + b.y * m[2][1] + b.z * m[2][2] + b.h * m[2][3],
		h: b.x * m[3][0] + b.y * m[3][1] + b.z * m[3][2] + b.h * m[3][3] };
};

/**
 * Computes a cofactor matrix
 * @param  {Array<Number[]>} 	matrix Input Matrix
 * @param  {Number} row    		The row to cofactor on
 * @param  {Number} col    		The column to cofactor on
 * @return {Array<Number[]>}    The resultant cofactor matrix
 */
Math3D.matrixCofactor = function (matrix, row, col) {
	var result = this.initMatrix(matrix.length - 1, matrix.length - 1);
	var rowPointer = 0;
	var colPointer = 0;
	for (var r = 0; r < result.length && rowPointer < matrix.length; r++) {
		if (r == row) rowPointer = r + 1;
		for (var c = 0; c < result.length && colPointer < matrix.length; c++) {
			if (c == col) colPointer = c + 1;
			result[r][c] = matrix[rowPointer][colPointer];
			colPointer++;
		}
		colPointer = 0;
		rowPointer++;
	}
	return result;
};

/**
 * Compute the determinate of a Matrix
 * @param  {Array<Number[]>} matrix	The Matrix
 * @return {Number}        			Its Determinate
 */
Math3D.matrixDeterminate = function (matrix) {
	if (matrix.length == 2) {
		return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
	}
	//Use first row
	var determinate = 0;
	for (var c = 0; c < matrix.length; c++) {
		var coeffPM = Math.floor(Math.pow(-1, c));
		determinate += coeffPM * matrix[0][c] * this.matrixDeterminate(this.matrixCofactor(matrix, 0, c));
	}

	return determinate;
};

/**
 * Compute the transpose for the Adjugate Matrix
 * @param  {Array<Number[]>} matrix	The Matrix
 * @return {Array<Number[]>} 		The Transpose
 */
Math3D.matrixPTranspose = function (matrix) {
	var result = this.initMatrix(matrix[0].length, matrix.length);
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[0].length; j++) {
			result[j][i] = matrix[i][j];
		}
	}
	return result;
};

/**
 * Compute the Adjugate Matrix
 * @param  {Array<Number[]>} matrix	The Matrix
 * @return {Array<Number[]>} 		The Adjugate
 */
Math3D.matrixAdjugate = function (matrix) {
	if (matrix.length < 3) {
		return null;
	}

	var result = this.initMatrix(matrix.length, matrix.length);

	for (var r = 0; r < matrix.length; r++) {
		for (var c = 0; c < matrix.length; c++) {
			var coeffPM = Math.floor(Math.pow(-1, r + c));
			result[r][c] = coeffPM * this.matrixDeterminate(this.matrixCofactor(matrix, r, c));
		}
	}

	return this.matrixPTranspose(result);
};

/**
 * Compute the inverse of this Matrix using Crammer's Rule and the Determinate
 * @param  {Array<Number[]>} matrix	The Matrix
 * @return {Array<Number[]>} 		The Inverse of the matrix
 */
Math3D.matrixInverse = function (matrix) {
	var det = this.matrixDeterminate(matrix);
	var adj = this.matrixAdjugate(matrix);
	var result = this.scalarMultiplyMatrix(adj, 1 / det);

	return result;
};

/**
 * A set of predefined Matricies and Functions to build Matricies
 * @type {Object}
 */
var Matrices3D = {
	/**
  * The Identity 4x4 Matrix
  * @type {Array<Number[]>}
  */
	I: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]],

	/**
  * Invertable Matrix A
  * THe Inverse is below
  * 	№	A1	A2	A3	A4
  *	1	18	-35	-28	1
  *	2	9	-18	-14	1
  *	3	-2	4	3	0
  *	4	-12	24	19	-1
  * @type {Array<Number[]>}
  */
	testA: [[2, 3, 1, 5], [1, 0, 3, 1], [0, 2, -3, 2], [0, 2, 3, 1]],
	/**
  * The inversion of TestA
  * @type {Array<Number[]>}
  */
	testAV: [[18, -35, -28, 1], [9, -18, -14, 1], [-2, 4, 3, 0], [-12, 24, 19, -1]]

	/**
  * Matrix Inversion Sanity Test
  */
};function matrixInversionTest() {
	var I = Matrices3D.I;
	var test = Matrices3D.testA;
	console.log(matrixToString(test));
	test = Math3D.matrixInverse(test);
	var valid = true;
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (test[i][j] != Matrices3D.testAV[i][j]) valid = false;
		}
	}
	console.log(valid, "\n", matrixToString(test));
}

/**
 * Formats a matrix into a string
 * @param  {Array<Number[]>} m The Matrix to format
 * @return {String}   The formatted String
 */
function matrixToString(m) {
	var string = "";
	for (var i = 0; i < m.length; i++) {
		for (var j = 0; j < m[0].length; j++) {
			string += m[i][j] + " ";
		}
		string += "\n";
	}
	return string;
}
/**
 * Canvas Wrapper object to handle pixel level drawing on the HTML5 Canvas as well as manage the canvas
 * Automatically deploys a canvas to the body
 *
 * (Now in ES6)
 * 
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/07)
 * @license MIT
 */
class Canvas2D {
	constructor() {
		// //Create the Canvas and Deploy it
		this.container = document.createElement('div');
		this.canvas = document.createElement('canvas');
		this.canvas.style.border = "1px solid black";
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		this.canvas.style.position = "absolute";
		this.container.style.margin = "5%";
		this.container.style.width = "90%";
		this.container.style.height = "75vh";
		this.container.style.position = "relative";
		this.context = this.canvas.getContext('2d');
		this.container.appendChild(this.canvas);
		document.body.appendChild(this.container);

		//Positioning and Scaling
		this.rect = this.canvas.getBoundingClientRect();
		$(window).on('resize', function (event) {
			this.rect = this.canvas.getBoundingClientRect();
			this.canvas.width = this.rect.width;
			this.canvas.height = this.rect.height;
			this.width = this.rect.width;
			this.height = this.rect.height;
			this.buffer = this.context.createImageData(this.width, this.height);
		}.bind(this));
		this.canvas.width = this.rect.width;
		this.canvas.height = this.rect.height;
		this.width = this.rect.width;
		this.height = this.rect.height;
		//Persistant Pixel Image Data Object
		this.pixelImageData = this.context.createImageData(1, 1);
		this.buffer = this.context.createImageData(this.width, this.height);
		// this.pixelData = this.pixelImageData.data
	}

	/**
  * Draws a pixel to this Canvas. Note that RGBA are between 0 and 255
  * @param  {{x: Number, y: Number, r: Number, g: Number, b: Number, a: Number}} pixel The Pixel to draw
  */
	drawPixel(pixel) {
		// setTimeout(function(){
		//console.log("this Happened", pixel.r, pixel.g, pixel.b, pixel.a);
		this.pixelImageData.data[0] = pixel.r;
		this.pixelImageData.data[1] = pixel.g;
		this.pixelImageData.data[2] = pixel.b;
		this.pixelImageData.data[3] = pixel.a;
		this.context.putImageData(this.pixelImageData, pixel.x, pixel.y);
		// }.bind(this),0);
	}

	drawPixelToBuffer(pixel) {
		var index = 4 * (pixel.x + pixel.y * this.width) - 4;
		this.buffer.data[index] = pixel.r;
		this.buffer.data[index + 1] = pixel.g;
		this.buffer.data[index + 2] = pixel.b;
		this.buffer.data[index + 3] = pixel.a;
	}

	flushBuffer() {
		this.context.putImageData(this.buffer, 0, 0);
	}

	clearBuffer() {
		this.buffer = this.context.createImageData(this.width, this.height);
	}

	drawLine(line) {
		this.context.beginPath();
		this.context.moveTo(line.x1, line.y1);
		this.context.lineTo(line.x2, line.y2);
		this.context.stroke();
	}
}
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
class Camera {
	constructor(config) {
		//Camera Specific Points and Vectors
		/**
   * e is the Camera position
   * u is the up vector
   * v is the left right vector
   * n is the gaze vector
   */
		this.e = { x: 0, y: 0, z: 0, h: 1 };
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

		this.width = config.width;
		this.height = config.height;

		this.setupVectors = function () {
			//Setup Camera Specifics and the world
			this.x = this.width;
			this.y = this.height;
			this.aspect = this.width / this.height;
			this.theta = config.viewingAngle;
			this.world = config.world;

			//Compute the n vector
			var nP = Math3D.vectorizePoints(this.g, this.e);
			var nPmag = 1 / Math3D.magnitudeOfVector(nP);
			this.n = Math3D.scalarMultiply(nP, nPmag);

			//Compute Vector u (+y axis = up)
			var pP = { x: 0, y: 0, z: 1, h: 0 };
			this.u = Math3D.crossProduct(pP, this.n);
			//this.u = Math3D.scalarMultiply(this.u,-1);

			//Compute Vector v
			this.v = Math3D.crossProduct(this.n, this.u);

			//Set Camera Variables
			this.t = this.N * Math.tan(Math.PI / 180 * (this.theta / 2));
			this.b = -this.t;
			this.r = this.aspect * this.t;
			this.l = -this.r;

			//Setup the Matrix Pipe
			this.updateMatrixPipe();
		}.bind(this);

		this.setupVectors();

		//Setup Debug
		this.debug = false;

		if (config.noPipe) {
			this.noPipe = true;
		}
	}

	/**
  * Moves camera along U Axis
  * @param  {Number} mag Magnitude to move
  */
	moveU(mag) {
		var motion = Math3D.scalarMultiply(this.u, mag);
		this.e = Math3D.addPoints(motion, this.e);
		this.updateMatrixPipe();
	}

	/**
  * Moves camera along V Axis
  * @param  {Number} mag Magnitude to move
  */
	moveV(mag) {
		var motion = Math3D.scalarMultiply(this.v, mag);
		this.e = Math3D.addPoints(motion, this.e);
		this.updateMatrixPipe();
	}

	/**
  * Moves camera along N Axis
  * @param  {Number} mag Magnitude to move
  */
	moveN(mag) {
		var motion = Math3D.scalarMultiply(this.n, mag);
		this.e = Math3D.addPoints(motion, this.e);
		this.updateMatrixPipe();
	}

	/**
  * Rotates camera along U Axis
  * @param  {Number} mag Magnitude to rotate (degrees)
  */
	rotateU(mag) {
		var rotate = Math3D.rotateOnArbitrary(mag, this.u);
		this.v = multiplyMatrixWithVector(rotate, this.v);
		this.n = multiplyMatrixWithVector(rotate, this.n);
	}

	/**
  * Rotates camera along V Axis
  * @param  {Number} mag Magnitude to rotate (degrees)
  */
	rotateV(mag) {
		var rotate = Math3D.rotateOnArbitrary(mag, this.v);
		this.u = multiplyMatrixWithVector(rotate, this.u);
		this.n = multiplyMatrixWithVector(rotate, this.n);
	}

	/**
  * Rotates camera along N Axis
  * @param  {Number} mag Magnitude to rotate (degrees)
  */
	rotateN(mag) {
		var rotate = Math3D.rotateOnArbitrary(mag, this.n);
		this.u = multiplyMatrixWithVector(rotate, this.u);
		this.v = multiplyMatrixWithVector(rotate, this.v);
	}

	/**
  * Updates the Matrix Pipe for the camera
  * Pipe is currently untested
  */
	updateMatrixPipe() {
		if (!this.noPipe) {
			this.WS2T2 = this.computeWS2T2();
			if (this.debug) {
				console.log(matrixToString(this.WS2T2));
			}

			this.S1T1Mp = this.computeS1T1Mp();
			if (this.debug) {
				console.log(matrixToString(this.S1T1Mp));
			}

			this.Mv = this.computeMv();
			if (this.debug) {
				console.log(matrixToString(this.Mv));
			}

			var mid = Math3D.multiplyMatrices(this.WS2T2, this.S1T1Mp);
			if (this.debug) {
				console.log(matrixToString(mid));
			}

			this.matrixPipe = Math3D.multiplyMatrices(mid, this.Mv);
			if (this.debug) {
				console.log(matrixToString(this.matrixPipe));
			}
		}
	}

	computeWS2T2() {
		var data = Math3D.initMatrix();

		//Localize Vars
		var width = this.width;
		var height = this.height;

		//Setup matrix array
		data[0][0] = width / 2;data[0][1] = 0;data[0][2] = 0;data[0][3] = width / 2;
		data[1][0] = 0;data[1][1] = -height / 2;data[1][2] = 0;data[1][3] = -height / 2 + height;
		data[2][0] = 0;data[2][1] = 0;data[2][2] = 1;data[2][3] = 0;
		data[3][0] = 0;data[3][1] = 0;data[3][2] = 0;data[3][3] = 1;

		return data;
	}

	computeS1T1Mp() {
		var data = Math3D.initMatrix();

		//Localize Vars
		var t = this.t;var b = this.b;var r = this.r;var l = this.l;
		var N = this.N;var F = this.F;

		//Setup matrix array
		data[0][0] = 2 * N / (r - 1);data[0][1] = 0;data[0][2] = (r + l) / (r - l);data[0][3] = 0;
		data[1][0] = 0;data[1][1] = 2 * N / (t - b);data[1][2] = (t + b) / (t - b);data[1][3] = 0;
		data[2][0] = 0;data[2][1] = 0;data[2][2] = -(F + N) / (F - N);data[2][3] = -2 * F * N / (F - N);
		data[3][0] = 0;data[3][1] = 0;data[3][2] = -1;data[3][3] = 0;

		return data;
	}

	computeMv() {
		var data = Math3D.initMatrix();

		//Localize Vars
		var u = this.u;var v = this.v;var n = this.n;var e = this.e;

		//Setup matrix array
		data[0][0] = u.x;data[0][1] = u.y;data[0][2] = u.z;data[0][3] = -Math3D.dotProduct(e, u);
		data[1][0] = v.x;data[1][1] = v.y;data[1][2] = v.z;data[1][3] = -Math3D.dotProduct(e, v);
		data[2][0] = n.x;data[2][1] = n.y;data[2][2] = n.z;data[2][3] = -Math3D.dotProduct(e, n);
		data[3][0] = 0;data[3][1] = 0;data[3][2] = 0;data[3][3] = 1;

		return data;
	}
}
/**
 * Generic Object is the abstract 3DObject Definition for Raytracer-JS (Now in ES6)
 * @class  GenericObject
 * 
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
class GenericObject {
	constructor(config) {
		if (config) for (var key in config) this[key] = config[key];

		if (!this.baseC) this.baseC = { r: 255, g: 255, b: 255, a: 255 };
		if (!this.ambientC) this.ambientC = this.baseC;
		if (!this.diffuseC) this.diffuseC = this.baseC;
		if (!this.specularC) this.specularC = this.baseC;

		if (!this.ambientFactor) this.ambientFactor = 0.0;
		if (!this.diffuseFactor) this.diffuseFactor = 0.2;
		if (!this.specularFactor) this.specularFactor = 0.5;
		if (!this.reflectionFactor) this.reflectionFactor = 0.9;
		if (!this.refractionFactor) this.refractionFactor = 0.0;
		if (!this.specularFalloff) this.specularFalloff = 40;
		if (!this.refractionIndex) this.refractionIndex = 1.0;

		if (!this.opacity) this.opacity = 1.0;

		if (!this.transform) {
			this.transform = Matrices3D.I;
			this.transformInverse = Matrices3D.I;
		} else {
			this.transformInverse = Math3D.matrixInverse(this.transform);
		}

		if (!this.UVMap) this.UVMap = null;
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
	rayIntersect(ray) {}

	/**
  * Compute the normal vector relative to a specific point (prefrably on the surface)
  * @param  {Object{x,y,z,h}} point The Point to compute at
  * @return {Object{x,y,z,h}}       The Normal Vector
  */
	getNormalAt(point) {}

	/**
  * Get the UVMap Color at a point on the surface
  * @param  {Object{x,y,z,h}} point The Point to compute at
  * @return {Object{r,g,b,a}}       The Color of the UVMap pixel
  */
	getUVMapAt(point) {}
}
/**
 * Light class (now in ES6 Standard format)
 * This is an Abstract Class for Light Sources
 * 
 * @class Light
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
class Light {
	constructor(config) {
		if (config.color) this.color = config.color;else this.color = { r: 255, g: 255, b: 255, a: 255 };
		if (config.intensity) this.intensity = config.intensity;else this.inensity = 1.0;
	}
}
/**
 * Ray Object to contain data for a Ray Intersect List (Now in ES6)
 * @class  Ray
 * @param {Object} config See Constructor
 * 
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
class Ray {
	constructor(config) {
		//Camera Config Constructor
		if (config.camera) {
			//Set Position on camera view
			this.x = config.x;
			this.y = config.y;

			this.camera = config.camera;

			//Configure Supersampling
			if (config.superSampleRate) this.superSampleRate = config.superSampleRate;else this.superSampleRate = 1;

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

			var bcoeff = this.W * (2 * this.x / (this.camera.width * this.superSampleRate) - 1);
			this.bcoeff = bcoeff;
			var b = Math3D.scalarMultiply(this.u, bcoeff);
			this.b = b;

			var ccoeff = this.H * (2 * this.y / (this.camera.height * this.superSampleRate) - 1);
			this.ccoeff = ccoeff;
			var c = Math3D.scalarMultiply(this.v, ccoeff);
			this.c = c;

			this.d = Math3D.addVectors(Math3D.addVectors(a, b), c);
		}

		//Object Point to Target Point Constructor
		else if (config.objectPoint && config.targetPoint) {
				this.e = objectPoint;
				this.d = Math3D.vectorizePoints(objectPoint, targetPoint);
				this.d = Math3D.scalarMultiply(this.d, 1 / Math3D.magnitudeOfVector(this.d));
			}

			//Direct Config Constructor
			else if (config.e && config.d) {
					this.e = config.e;
					this.d = config.d;
				} else {
					throw "Error not a valid Ray Constructor";
				}

		this.depth = config.depth;

		if (config.exclusionObj) this.exclusionObj = config.exclusionObj;else this.exclusionObj = {};

		//Setup Intersect Persistance
		this.lowestIntersectValue = 0;
		this.lowestIntersectObject = null;
		this.lowestIntersectPoint = null;
		this.intersectedObjects = [];

		this.intersectedObject = false;
	}

	/**
  * Adds an intersection on the ray.
  * @param {Object{t, obj}} config Intersection at position t on object obj
  */
	addIntersect(config) {
		if (config.obj != this.exclusionObj && config.t != 0) //Skip 0
			if (config.t && config.obj) {
				var dt = Math3D.scalarMultiply(this.d, config.t);
				var intersect = Math3D.addPoints(this.e, dt);
				// console.log("added intersect");

				if (!this.intersectedObject && config.t < 0) {
					this.lowestIntersectValue = config.t;
					this.lowestIntersectObject = config.obj;
					this.lowestIntersectPoint = intersect;
					this.intersectedObjects.push(config.obj);
					this.intersectedObject = true;
				} else {
					if (config.t > this.lowestIntersectValue && config.t < 0) {
						this.lowestIntersectValue = config.t;
						this.lowestIntersectObject = config.obj;
						this.lowestIntersectPoint = intersect;
					}
				}
			} else {
				throw "Not a valid addIntersect";
			}
	}

	/**
  * Detects where a point is on the ray
  * @param  {Object{x,y,z,h}} point The point to detect
  * @return {Number}          The IntersectValue
  */
	rayDetect(point) {
		var t = 0;
		if (this.d.x != 0) {
			t = point.x - this.e.x / this.d.x;
		} else {
			if (this.d.y != 0) {
				t = point.y - this.e.y / this.d.y;
			} else {
				if (this.d.z != 0) {
					t = point.z - this.e.z / thid.d.z;
				}
			}
		}

		return t;
	}
}
/**
 * Raytracer object to raytrace a world definition
 * @param {Object} config The configuration object
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */

class Raytracer {
	constructor(config) {
		// this.camera = config.camera;
		this.world = config.world;

		this.world.some(e => {
			if (e instanceof Camera) {
				this.camera = e;
			};
		});
		if (!this.camera) throw "World Does not have a Camera!";

		this.pixelRenderer = config.pixelRenderer; //Must support function drawPixel({x, y, r, g, b, a});

		this.backgroundColor = { r: 0, g: 0, b: 0, a: 255 };
		this.color = { r: 100, g: 100, b: 100, a: 255 };

		this.falloffFactor = 10;
		this.recursionFactor = 4;

		this.drawTitle();
	}

	drawTitle() {
		var width = this.pixelRenderer.width;
		var height = this.pixelRenderer.height;
		var ctx = this.pixelRenderer.context;
		var x = width / 2;
		var y1 = height * (1 / 3);
		var y2 = height * (2 / 3);

		ctx.font = '30pt Helvetica,Arial,sans-serif';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'Black';
		ctx.fillText('Raytracer-JS', x, y1);

		ctx.font = '15pt Helvetica,Arial,sans-serif';
		ctx.fillText('Version 0.0.2 By SparkX120', x, y2);
	}

	drawRenderingPlaceholder() {
		var width = this.pixelRenderer.width;
		var height = this.pixelRenderer.height;
		var ctx = this.pixelRenderer.context;
		var x = width / 2;
		var y = height / 2;

		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fillRect(0, 0, width, height);

		this.progress = document.createElement("progress");
		this.progress.max = 100;
		this.progress.value = 0;
		this.progress.style.zindex = "99";
		this.progress.style.width = "100%";
		this.progress.style.height = "3em";
		this.progress.style.bottom = "50%";
		this.progress.style.position = "absolute";
		this.progress.style.border = "1px solid black";
		this.progress.className = "prog";

		if (this.pixelRenderer.container) this.pixelRenderer.container.appendChild(this.progress);
	}

	getObjectList() {
		return this.world.filter(elem => elem instanceof GenericObject);
	}

	getLightList() {
		return this.world.filter(elem => elem instanceof Light);
	}

	stop() {
		if (this.timeint) {
			console.log("killing render");
			clearInterval(this.timeint);
			this.timeint = null;
		}
	}

	render() {
		this.drawRenderingPlaceholder();

		//Give canvas async time to update
		var renderLoop = setTimeout(() => {
			this.pixelRenderer.clearBuffer();
			this.camera.width = this.pixelRenderer.width;
			this.camera.height = this.pixelRenderer.height;
			this.camera.setupVectors();

			//Run outerloop in interval so canvas can live update
			var i = 0;
			this.timeint = setInterval(() => {
				if (i < this.camera.y) {
					i++;
					for (var j = 0; j < this.camera.x; j++) {
						var ray = new Ray({ x: j, y: i, camera: this.camera, depth: 0 });
						var color = this.raytrace(ray);
						var pixel = color;
						pixel.x = j;
						pixel.y = i;
						this.pixelRenderer.drawPixel(pixel);
					}
					// this.pixelRenderer.flushBuffer();

					//Update Progress Bar
					var progress = Math.floor(i / this.camera.y * 100);
					if (this.progress && this.progress.value != progress) {
						this.progress.value = progress;
					}
				} else {
					//Get rid of the Progress Bar
					if (this.progress) {
						this.pixelRenderer.container.removeChild(this.progress);
						this.progress = null;
					}
					// this.pixelRenderer.flushBuffer();
					clearInterval(this.timeint);
				}
			}, 0);
		}, 0);
	}

	raytrace(ray, recursion, objR) {
		if (recursion && recusion > this.recursionFactor) return { r: 0, g: 0, b: 0, a: 0 };

		var objList = this.getObjectList();
		var lightList = this.getLightList();

		objList.map(obj => {
			if (objR) {
				//Don't intersect with self surface under recursion
				if (objR != obj) obj.rayIntersect(ray);
			} else {
				obj.rayIntersect(ray);
			}
		});

		if (ray.intersectedObject) {
			var object = ray.lowestIntersectObject;

			var ambientFactor = object.ambientFactor;
			var diffuseFactor = object.diffuseFactor;
			var specularFactor = object.specularFactor;
			var reflectionFactor = object.reflectionFactor;
			var refractionFactor = object.refractionFactor;

			var ambientColor = object.ambientC;
			var diffuseColor = { r: 0, g: 0, b: 0, a: 0 };
			var specularColor = { r: 0, g: 0, b: 0, a: 0 };
			var reflectionColor = { r: 0, g: 0, b: 0, a: 0 };
			var refractionColor = { r: 0, g: 0, b: 0, a: 0 };

			if (this.getLightList()) {
				if (object.diffuseFactor > 0) diffuseColor = this._diffuseShader(ray);
				if (object.specularFactor > 0) specularColor = this._specularShader(ray);
				if (object.reflectionFactor > 0) reflectionColor = this._reflectionShader(ray);
				if (object.refractionFactor > 0) {
					refractionColor = this._refractionShader(ray, recursion);
				}
			}

			var computedColor = {
				r: ambientColor.r * ambientFactor + diffuseColor.r * diffuseFactor + specularColor.r * specularFactor + reflectionColor.r * reflectionFactor + refractionColor.r * refractionFactor,
				g: ambientColor.g * ambientFactor + diffuseColor.g * diffuseFactor + specularColor.g * specularFactor + reflectionColor.g * reflectionFactor + refractionColor.g * refractionFactor,
				b: ambientColor.b * ambientFactor + diffuseColor.b * diffuseFactor + specularColor.b * specularFactor + reflectionColor.b * reflectionFactor + refractionColor.b * refractionFactor,
				a: object.opacity * 255

				// console.log("intersect at ", i, j);
			};return {
				r: Math.min(computedColor.r, 255),
				g: Math.min(computedColor.g, 255),
				b: Math.min(computedColor.b, 255),
				a: Math.min(computedColor.a, 255)
			};
		}

		return {
			r: this.backgroundColor.r,
			g: this.backgroundColor.g,
			b: this.backgroundColor.b,
			a: this.backgroundColor.a
		};
	}

	_diffuseShader(ray) {
		var object = ray.lowestIntersectObject;
		var intersect = ray.lowestIntersectPoint;
		var n = object.getNormalAt(intersect);
		var falloffFactor = this.falloffFactor;

		var intensities = [];
		var unShadowedLights = 0;
		var totalIntensity = 0;

		if (this.getLightList()) {
			this.getLightList().map((light, index, lights) => {
				var s = Math3D.vectorizePoints(intersect, light.source);
				var v = Math3D.vectorizePoints(intersect, ray.e);
				var ns = Math3D.dotProduct(n, s);

				var shadowDetect = new Ray({ e: intersect, d: s, exclusionObj: object });
				this.getObjectList().map(obj => {
					obj.rayIntersect(shadowDetect);
				});

				if (!shadowDetect.intersectedObject) {
					//Compute Falloff from Lightsource
					// var distance = Math3D.magnitudeOfVector(s);

					//Compute Diffuse Intensity
					var div = Math3D.magnitudeOfVector(s) * Math3D.magnitudeOfVector(n);
					if (div != 0) {
						var nDots = ns / div;
						var diffuseIntensity = light.intensity * Math.max(nDots, 0);
						totalIntensity += diffuseIntensity;
					}
				}
			});
		}

		return {
			r: object.diffuseC.r * totalIntensity,
			g: object.diffuseC.g * totalIntensity,
			b: object.diffuseC.b * totalIntensity,
			a: 255 };
	}

	_specularShader(ray) {
		var object = ray.lowestIntersectObject;
		var intersect = ray.lowestIntersectPoint;
		var n = object.getNormalAt(intersect);
		var falloffFactor = this.falloffFactor;

		var intensities = [];
		var unShadowedLights = 0;
		var totalIntensity = 0;
		if (this.getLightList()) {
			this.getLightList().map((light, index, lights) => {
				var s = Math3D.vectorizePoints(intersect, light.source);
				var v = Math3D.vectorizePoints(intersect, ray.e);
				var ns = Math3D.dotProduct(n, s);

				var shadowDetect = new Ray({ e: intersect, d: s, exclusionObj: object });
				this.getObjectList().map(obj => {
					obj.rayIntersect(shadowDetect);
				});
				if (!shadowDetect.intersectedObject) {
					var magN = Math3D.magnitudeOfVector(n);
					var coeff = 2 * (ns / (magN * magN));

					var r = Math3D.addVectors(Math3D.scalarMultiply(s, -1.0), Math3D.scalarMultiply(n, coeff));

					var f = object.specularFalloff;

					//Compute Falloff from Lightsource
					// var distance = Math3D.magnitudeOfVector(s);

					// if(distance < 1)
					// 	distance = 1;

					//Compute Specular Intensity
					var specularIntensity = 0;
					var vDotr = Math3D.dotProduct(v, r) / (Math3D.magnitudeOfVector(v) * Math3D.magnitudeOfVector(r));
					if (vDotr > 0) {
						specularIntensity = light.intensity * Math.max(Math.pow(vDotr, f), 0);
					}

					totalIntensity = totalIntensity + specularIntensity;
				}
			});
			// if(totalIntensity > 0){
			// 	console.log(totalIntensity);
			// }
		}
		return {
			r: object.specularC.r * totalIntensity,
			g: object.specularC.g * totalIntensity,
			b: object.specularC.b * totalIntensity,
			a: 255 };
	}

	_reflectionShader(ray) {
		var object = ray.lowestIntersectObject;
		var intersect = ray.lowestIntersectPoint;
		var norm = object.getNormalAt(intersect);

		var iDotn = Math3D.dotProduct(Math3D.normalizeVector(ray.d), Math3D.normalizeVector(norm));
		if (object.reflectionFactor > 0 && ray.depth < this.recursionFactor && iDotn < 0) {
			//Reflection Vector
			var coeff = -2 * iDotn;
			var reflectionD = Math3D.scalarMultiply(norm, coeff);
			reflectionD = Math3D.normalizeVector(reflectionD);

			var incident = new Ray({ e: intersect, d: reflectionD, depth: ray.depth + 1, exclusionObj: object });
			var reflection = this.raytrace(incident); //uses incident object detection aka this obj
			return {
				r: reflection.r,
				g: reflection.g,
				b: reflection.b,
				a: 255 };
		}

		return this.backgroundColor;
	}

	_refractionShader(ray, recursion) {
		var object = ray.lowestIntersectObject;
		var intersect = ray.lowestIntersectPoint;
		var norm = object.getNormalAt(intersect);

		//Refraction Vector (assuming transitions with air)
		//Based on math from http://graphics.stanford.edu/courses/cs148-10-summer/docs/2006--degreve--reflection_refraction.pdf
		//Based on Derivation from http://www.starkeffects.com/snells-law-vector.shtml
		var nTheta = Math3D.dotProduct(Math3D.normalizeVector(Math3D.scalarMultiply(ray.d, 1)), Math3D.normalizeVector(norm));
		var cosNTheta = nTheta; //(float) Math.cos(nTheta);
		var refractionIndex = object.refractionIndex;

		//start with white
		var refraction = { r: 255, g: 255, b: 255, a: 255 };

		if (object.refractionIndex > 0.0) {
			//Do Refraction Angle Computation
			var nCrossD = Math3D.crossProduct(norm, ray.d);
			var i = Math3D.crossProduct(norm, Math3D.crossProduct(Math3D.scalarMultiply(norm, -1), ray.d));
			i = Math3D.scalarMultiply(i, refractionIndex);
			var nDotn = Math3D.dotProduct(nCrossD, nCrossD);
			var coeff = Math.sqrt(1 - refractionIndex * refractionIndex * nDotn);
			var j = Math3D.scalarMultiply(norm, coeff);
			var refractionD = Math3D.normalizeVector(Math3D.vectorizePoints(i, j));

			//Create Refraction Ray
			var refracted = new Ray({ e: ray.e, d: refractionD });

			//Run Recursive RayTrace
			object.rayIntersect(refracted);
			if (refracted.intersectedObject) refracted = new Ray({ e: refracted.lowestIntersectPoint, d: ray.d });

			refraction = this.raytrace(refracted, recursion + 1, object); //Detect object
		}

		return {
			r: refraction.r,
			g: refraction.g,
			b: refraction.b,
			a: 255 };
	}
}
/**
 * OmniLight class (now in ES6 Standard format)
 * This defines an OmniDirectional Light Source
 *
 * @class OmniLight
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
class OmniLight extends Light {
  constructor(config) {
    super(config);
    if (config.source) this.source = config.source;else throw "Please define source in config for OmniLight";
  }
}
/**
 * Plane is a Generic Object Plane Definition for Raytracer-JS (Now in ES6)
 * @class  Plane
 * 
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
class Plane extends GenericObject {
	constructor(config) {
		super(config);
		if (config.restricted) this.restricted = config.restricted;
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
		var eVec = { x: e.x, y: e.y, z: e.z, h: 0 };

		//Intersection Commputation and Additions
		if (d.z != 0) {
			var t = -(e.z / d.z);
			if (t < 0) if (!this.restricted) ray.addIntersect({ t: t, obj: this });else {
				var x = e.x + d.x * t;
				var y = e.y + d.y * t;
				if (Math.sqrt(x * x + y * y) <= 1) ray.addIntersect({ t: t, obj: this });
			}
		}
	}

	/**
  * Compute the normal vector relative to a specific point (prefrably on the surface)
  * @param  {Object{x,y,z,h}} point The Point to compute at
  * @return {Object{x,y,z,h}}       The Normal Vector
  */
	getNormalAt(point) {
		var norm = { x: 0, y: 0, z: -1, h: 1 };
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
/**
 * Sphere is a Generic Object Sphere Definition for Raytracer-JS (Now in ES6)
 * @class  Sphere
 * 
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
class Sphere extends GenericObject {
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

		var a = magD * magD;
		var b = Math3D.dotProduct(e, d);
		var c = magE * magE - 1;

		var det = b * b - a * c;

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
			var t1 = -b / a + Math.sqrt(det) / a;
			var t2 = -b / a - Math.sqrt(det) / a;
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
(function () {
	//Canvas
	window.canvas2D = new Canvas2D();

	//Wait for Window load to build system
	$(window).on("load", () => {
		//Camera
		var camera = new Camera({
			position: { x: 2, y: 2, z: 2, h: 1 },
			gaze: { x: 0, y: 0, z: 0, h: 1 },
			width: canvas2D.width,
			height: canvas2D.height,
			viewingAngle: 60,
			world: null,
			noPipe: true
		});

		//Scene Object Defs

		//World List
		var world = [];
		world.push(camera);

		// var scale = 0.1;
		// var scaleF = 0.01;
		// var jitter = 0.1
		// var xsphere = 0.5;
		// var ysphere = 0.5;
		// var zsphere = 1;
		// var fsphere = 0.25;

		//Scale of Sphere
		let scale = 0.2;
		//Scale of jitter of scale
		let scaleF = 0.0;
		//Spatial Jitter
		let jitter = 0;
		//Size of x in +/-0
		let xsphere = 0.5;
		//Size of y in +/-0
		let ysphere = 0.5;
		//Size of z in 0+
		let zsphere = 1;
		//Step in x,y,z
		let fsphere = 0.5;

		for (let i = -xsphere; i <= xsphere; i = i + fsphere) {
			for (let j = -ysphere; j <= ysphere; j = j + fsphere) {
				for (let k = 0; k <= zsphere; k = k + fsphere) {
					console.log("Making sphere at x:" + i + " y:" + j);

					let sfact = scale * (Math.random() * scaleF + (1 - scaleF));
					let x = i + (Math.random() * jitter - jitter);
					let y = j + (Math.random() * jitter - jitter);
					let z = k + (Math.random() * jitter - jitter);
					let pipe = [Math3D.translate(x, y, z), Math3D.scale(sfact, sfact, sfact)];
					// let mat = Math3D.transformPipe(pipe);
					// console.log(mat);

					world.push(new Sphere({
						baseC: { r: 0, g: 0, b: 255, a: 255 },
						specularC: { r: 255, g: 255, b: 255, a: 255 },
						transform: Math3D.transformPipe(pipe)
					})); //Create Generic Sphere
				}
			}
		}

		// world.push(new Sphere({
		// 	baseC: {r:0, g:0, b:255, a:255},
		// 	specularC: {r:255, g:255, b:255, a:255},
		// 	transform: Math3D.translate(2, 2, 0.5)
		// })); //Create Generic Sphere
		// world.push(new Sphere({
		// 	baseC: {r:0, g:0, b:255, a:255},
		// 	specularC: {r:255, g:255, b:255, a:255},
		// 	transform: Math3D.transformPipe([
		// 				Math3D.translate(-1, -1, 0.5),
		// 				Math3D.scale(0.5, 0.5, 0.5)
		// 			])
		// })); //Create Generic Sphere

		var plane = new Plane({ baseC: { r: 100, g: 100, b: 100, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.0001,
			reflectionFactor: 0.0001,
			transform: Math3D.translate(0, 0, -1)
		});

		var olight = new OmniLight({ intensity: 2.0,
			source: { x: 0, y: 0, z: 8, h: 1 } }); //Create an OmniLight

		world.push(plane);
		world.push(olight);
		world.push(new OmniLight({ intensity: 1.0,
			source: { x: 0, y: 8, z: 1, h: 1 } }), new OmniLight({ intensity: 1.0,
			source: { x: 0, y: -8, z: 1, h: 1 } }), new OmniLight({ intensity: 1.0,
			source: { x: 8, y: 0, z: 1, h: 1 } }), new OmniLight({ intensity: 1.0,
			source: { x: -8, y: 0, z: 1, h: 1 } }));

		var raytracer = new Raytracer({
			world: world,
			pixelRenderer: window.canvas2D
		});

		console.log(raytracer);

		setTimeout(() => raytracer.render(), 2000); //Do this in a timeout to allow page to finish loading...

		var resizeTimer;
		$(window).on('resize', () => {
			raytracer.stop();
			if (resizeTimer) clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => raytracer.render(), 100);
		});
	});

	// for(var x=0; x<100; x++){
	// 	// console.log(x);
	// 	canvas2D.drawPixel({x:x,y:x,r:0,g:0,b:0,a:255});
	// }
})();

