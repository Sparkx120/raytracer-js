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
function Math3D(){};

Math3D.transformPipe = function(matrixPipe){
	var data = Matrices3D.I;

	for(let i=0; i<matrixPipe.length; i++){
		data = Math3D.multiplyMatrices(
			data,
			matrixPipe[i]
		);
	}

	return data;
}

Math3D.scale = function(xf, yf, zf){
	var data = Math3D.initMatrix(4,4);

	//Setup Scale Matrix
	data[0][0] = xf;	data[0][1] = 0;		data[0][2] = 0;		data[0][3] = 0;
	data[1][0] = 0;		data[1][1] = yf;	data[1][2] = 0;		data[1][3] = 0;
	data[2][0] = 0;		data[2][1] = 0;		data[2][2] = zf;	data[2][3] = 0;
	data[3][0] = 0;		data[3][1] = 0;		data[3][2] = 0;		data[3][3] = 1;

	return data;
}

Math3D.translate = function(x, y, z){
	var data = Math3D.initMatrix(4,4);

	//Setup Scale Matrix
	data[0][0] = 1;		data[0][1] = 0;		data[0][2] = 0;		data[0][3] = x;
	data[1][0] = 0;		data[1][1] = 1;		data[1][2] = 0;		data[1][3] = y;
	data[2][0] = 0;		data[2][1] = 0;		data[2][2] = 1;		data[2][3] = z;
	data[3][0] = 0;		data[3][1] = 0;		data[3][2] = 0;		data[3][3] = 1;

	return data;
}

Math3D.rotateOnArbitrary = function(deg, axis){
	//Preconfig
	var cos = Math.cos((Math.PI/180)*deg);
	var sin = Math.sin((Math.PI/180)*deg);
	var v = Math3D.normalizeVector(axis);
	
	var data = Math3D.initMatrix(4,4);
	
	//Setup Jv Matrix
	data[0][0] = 0;			data[0][1] = -v.z();	data[0][2] = v.y();		data[0][3] = 0;
	data[1][0] = v.z();		data[1][1] = 0;			data[1][2] = -v.x();	data[1][3] = 0;
	data[2][0] = -v.y();	data[2][1] = v.x();		data[2][2] = 0;			data[2][3] = 0;
	data[3][0] = 0;			data[3][1] = 0;			data[3][2] = 0;			data[3][3] = 1;
	

	var R = Math3D.addMatrix(
					Matrices3D.I, MatrixMath3D.addMatrix(
						Math3D.scalarMultiplyMatrix(
							data, 
							sin)), 
						Math3D.scalarMultiplyMatrix(
							Math3D.multiplyMatrices(
								data,
								data),
							 1-cos));
	
	return R;
}

/**
 * Vectorizes two points
 * @param  {{x:Number, y:Number, z:Number, h:Number}} pointA	The start point
 * @param  {{x:Number, y:Number, z:Number, h:Number}} pointB	The end point
 * @return {{x:Number, y:Number, z:Number, h:Number}} 			The Vector represented by these two points
 */
Math3D.vectorizePoints = function(pointA, pointB){
	var v = Math3D.subtractPoints(pointA,pointB);
	v.h = 0;
	return v;
}

/**
 * Compute the cross product of two vectors
 * @param  {{x:Number, y:Number, z:Number, h:Number}} a	Vector A
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Vector B
 * @return {{x:Number, y:Number, z:Number, h:Number}} 	The Crossproduct Resultant
 */
Math3D.crossProduct = function(a, b){
	// if(a.h > 0 || b.h > 0){
	// 	console.log("Point!!!");
	// 	throw "Error Points can't be used in Crossproduct";
	// }
	return {x: (a.y*b.z)-(a.z*b.y),
			y: (a.z*b.x)-(a.x*b.z),
			z: (a.x*b.y)-(a.y*b.x),
			h: 0.0}
}

/**
 * Compute the dot product of two vectors
 * @param  {{x:Number, y:Number, z:Number, h:Number}} a	Vector A
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Vector B
 * @return {Number} 									The Crossproduct Resultant
 */
Math3D.dotProduct = function(a, b){
	return ((a.x*b.x) + (a.y*b.y) + (a.z*b.z) + (a.h*b.h));
}

/**
 * Scalar Multiply a point of vector
 * @param  {{x:Number, y:Number, z:Number, h:Number}} v  	The point or vector to multiple
 * @param  {{x:Number, y:Number, z:Number, h:Number}} mag	The magnitude to multiple
 * @return {{x:Number, y:Number, z:Number, h:Number}}     	The new point
 */
Math3D.scalarMultiply = function(v, mag){
	return {x:v.x*mag,
			y:v.y*mag,
			z:v.z*mag,
			h:v.h*mag};
}

/**
 * Compute the magnitude of a Vecotr
 * @param  {{x:Number, y:Number, z:Number, h:Number}} v	The vector to find the magnitude of
 * @return {Number}        								The Magnitude
 */
Math3D.magnitudeOfVector = function(v){
	return Math.sqrt((v.x*v.x) + (v.y*v.y) + (v.z*v.z) + (v.h*v.h));
}

/**
 * Adds two points A+B
 * @param  {{x:Number, y:Number, z:Number, h:Number}} a	First point to add 
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Second point to add
 * @return {{x:Number, y:Number, z:Number, h:Number}} 	The resultant point
 */
Math3D.addPoints = function(a, b){
	return {x:a.x+b.x,
			y:a.y+b.y,
			z:a.z+b.z,
			h:a.h+b.h};
}

/**
 * Adds two vectors A+B
 * @param  {{x:Number, y:Number, z:Number, h:Number}} a	First vector to add 
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Second vector to add
 * @return {{x:Number, y:Number, z:Number, h:Number}} 	The resultant vector
 */
Math3D.addVectors = function(a, b){
	return Math3D.addPoints(a,b);
}

/**
 * Subtracts two points A-B
 * @param  {{x:Number, y:Number, z:Number, h:Number}} a	The point to subtract from
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	The point being substracted from a
 * @return {{x:Number, y:Number, z:Number, h:Number}} 	The resultant point
 */
Math3D.subtractPoints = function(a, b){
	return {x:a.x-b.x,
			y:a.y-b.y,
			z:a.z-b.z,
			h:1.0};
}

Math3D.normalizeVector = function(v) {
		var out = {};
		var mag = Math3D.magnitudeOfVector(v);
		out = Math3D.scalarMultiply(v, (1/mag));
		
		return out;
	}

/**
 * Initializes a Zeroed 4x4 Matrix
 * @return {Array<Number[]>} The Zeroed Matrix
 */
Math3D.initMatrix = function(x, y){
	var m = [];
	if(x && y){
		for(var i=0;i<x;i++){
			var r = [];
			for(var j=0;j<y;j++){
				r.push(0);
			}
			m.push(r);
		}
	}
	else{
		for(var i=0;i<4;i++)
			m.push([0,0,0,0]);
	}
	return m;
}

/**
 * Adds two matricies together
 * @param {Array<Number[]>} a	First Matrix to add
 * @param {Array<Number[]>} b	Second Matrix to add
 * @return {Array<Number[]>} 	The Resultant Matrix
 */
Math3D.addMatrix = function(a, b){
	var m = this.initMatrix();
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++)
			m[i][j] = a[i][j] + b[i][j];
	return m;
}

/**
 * Scalar Multiples a Matrix by a value
 * @param  {Array<Number[]>} a	The matrix to multiply
 * @param  {Number} mag 		The Scalar Multiple
 * @return {Array<Number[]>}    The Result of the multiplication
 */
Math3D.scalarMultiplyMatrix = function(a, mag){
	var m = this.initMatrix();
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++)
			m[i][j] = a[i][j]*mag;
	return m;
}

/**
 * Multiplies two matricies together
 * @param  {Array<Number[]>} a	First matrix to multiply
 * @param  {Array<Number[]>} b	Second matrix to multiply
 * @return {Array<Number[]>}  	The resultant matrix
 */
Math3D.multiplyMatrices = function(a, b){
	var m = this.initMatrix();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var v = 0;
			for(var k=0;k<4;k++)
				v += a[i][k]*b[k][j];
			m[i][j] = v;
		}
	}
	return m;
}

/**
 * Multiplies a vector or point by the matrix
 * @param  {Array<Number[]>} m 							The matrix
 * @param  {{x:Number, y:Number, z:Number, h:Number}} b	The vector
 * @return {{x:Number, y:Number, z:Number, h:Number}}   The resultant vector
 */
Math3D.multiplyVectorByMatrix = function(m, b){
	return {x: b.x*m[0][0] + b.y*m[0][1] + b.z*m[0][2] + b.h*m[0][3],
			y: b.x*m[1][0] + b.y*m[1][1] + b.z*m[1][2] + b.h*m[1][3],
			z: b.x*m[2][0] + b.y*m[2][1] + b.z*m[2][2] + b.h*m[2][3],
			h: b.x*m[3][0] + b.y*m[3][1] + b.z*m[3][2] + b.h*m[3][3]};

}

/**
 * Computes a cofactor matrix
 * @param  {Array<Number[]>} 	matrix Input Matrix
 * @param  {Number} row    		The row to cofactor on
 * @param  {Number} col    		The column to cofactor on
 * @return {Array<Number[]>}    The resultant cofactor matrix
 */
Math3D.matrixCofactor = function(matrix, row, col){
	var result = this.initMatrix(matrix.length-1, matrix.length-1);
	var rowPointer = 0;
	var colPointer = 0;
	for(var r=0; r<result.length && rowPointer < matrix.length; r++){
		if(r == row)
			rowPointer = r + 1;
		for(var c=0; c<result.length && colPointer < matrix.length; c++){
			if(c == col)
				colPointer = c + 1;
			result[r][c] = matrix[rowPointer][colPointer];
			colPointer ++;
		}
		colPointer = 0;
		rowPointer ++;
	}
	return result;
}

/**
 * Compute the determinate of a Matrix
 * @param  {Array<Number[]>} matrix	The Matrix
 * @return {Number}        			Its Determinate
 */
Math3D.matrixDeterminate = function(matrix){
	if(matrix.length == 2){
		return (matrix[0][0]*matrix[1][1]) - (matrix[0][1]*matrix[1][0]);
	}
	//Use first row
	var determinate = 0;
	for(var c=0; c<matrix.length; c++){
		var coeffPM = Math.floor(Math.pow(-1, c));
		determinate += coeffPM * matrix[0][c] * this.matrixDeterminate(this.matrixCofactor(matrix, 0, c));
	}
	
	return determinate;
}

/**
 * Compute the transpose for the Adjugate Matrix
 * @param  {Array<Number[]>} matrix	The Matrix
 * @return {Array<Number[]>} 		The Transpose
 */
Math3D.matrixPTranspose = function(matrix){
	var result = this.initMatrix(matrix[0].length, matrix.length);
	for(var i=0; i<matrix.length; i++){
		for(var j=0; j<matrix[0].length; j++){
			result[j][i] = matrix[i][j];
		}
	}
	return result;
}

/**
 * Compute the Adjugate Matrix
 * @param  {Array<Number[]>} matrix	The Matrix
 * @return {Array<Number[]>} 		The Adjugate
 */
Math3D.matrixAdjugate = function(matrix){
	if(matrix.length < 3){
		return null;
	}
	
	var result = this.initMatrix(matrix.length, matrix.length);
	
	for(var r=0; r<matrix.length; r++){
		for(var c=0; c<matrix.length; c++){
			var coeffPM = Math.floor(Math.pow(-1, r+c));
			result[r][c] = coeffPM * this.matrixDeterminate(this.matrixCofactor(matrix, r, c));
		}
	}
	
	return this.matrixPTranspose(result);
}

/**
 * Compute the inverse of this Matrix using Crammer's Rule and the Determinate
 * @param  {Array<Number[]>} matrix	The Matrix
 * @return {Array<Number[]>} 		The Inverse of the matrix
 */
Math3D.matrixInverse = function(matrix){
	var det = this.matrixDeterminate(matrix);
	var adj = this.matrixAdjugate(matrix);
	var result = this.scalarMultiplyMatrix(adj, 1/det);
	
	return result;
}

/**
 * A set of predefined Matricies and Functions to build Matricies
 * @type {Object}
 */
var Matrices3D = {
	/**
	 * The Identity 4x4 Matrix
	 * @type {Array<Number[]>}
	 */
	I: [[1,0,0,0],
		[0,1,0,0],
		[0,0,1,0],
		[0,0,0,1]],
	
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
	testA: [[ 2, 3, 1, 5],
			[ 1, 0, 3, 1],
			[ 0, 2,-3, 2],
			[ 0, 2, 3, 1]],
	/**
	 * The inversion of TestA
	 * @type {Array<Number[]>}
	 */
	testAV: [[ 18, -35, -28, 1],
			[ 9, -18, -14, 1],
			[ -2, 4, 3, 0],
			[ -12, 24, 19, -1]],
}

/**
 * Matrix Inversion Sanity Test
 */
function matrixInversionTest(){
	var I = Matrices3D.I;
	var test = Matrices3D.testA;
	console.log(matrixToString(test));
	test = Math3D.matrixInverse(test);
	var valid = true;
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(test[i][j] != Matrices3D.testAV[i][j])
				valid = false;
		}
	}
	console.log(valid, "\n", matrixToString(test));
}

/**
 * Formats a matrix into a string
 * @param  {Array<Number[]>} m The Matrix to format
 * @return {String}   The formatted String
 */
function matrixToString(m){
	var string = "";
	for(var i=0; i<m.length; i++){
		for(var j=0; j<m[0].length; j++){
			string += m[i][j] + " ";
		}
		string += "\n";
	}
	return string;
}