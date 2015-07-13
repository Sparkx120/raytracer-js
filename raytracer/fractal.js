/**
 * @author James Wake
 * @license MIT
 * @version 0.2
 *
 * @fileOverview 
 * Fractal.js handles the generation of line fractals.
 */

function runKockCurveOnCanvas2D(canvas2D){
	var line1 = [{x1:10,y1:150,x2:502,y2:150}];
	var line2 = [{x1: 502, y1:150, x2:256, y2:502}];
	var line3 = [{x1: 256, y1:502, x2:10, y2:150}]

	var iterations = 4;
	line1 = kochCurve(line1, iterations);
	line2 = (kochCurve(line2, iterations));
	line3 = (kochCurve(line3, iterations));

	for(i = 0; i<line1.length;i++){
		canvas2D.drawLine(line1[i]);
	}
	for(i = 0; i<line2.length;i++){
		canvas2D.drawLine(line2[i]);
	}
	for(i = 0; i<line3.length;i++){
		canvas2D.drawLine(line3[i]);
	}
}

/**
 * Iterates the last line in an array of lines into a Koch Curve.
 * 
 * Due to the innacuracy of rounding for the Bresenham Algo there will
 * be 1 pixel discontinuity at end points in some of the lines returned....
 * 
 * @param  {Array} array      The Array of Lines
 * @param  {Number} iterations Number of iterations to compute
 * @return {Array}            The koch curve lines
 */
function kochCurve(array, iterations){
	if(iterations > 0){
		//Get The last line an configure Vector U
		var line = array.pop();
		var vectorU = {};
		vectorU.x = line.x2-line.x1;
		vectorU.y = line.y2-line.y1;

		//Compute the SubLine Vectors to be added to the Pointer Vector P
		var vectorA = {};
		vectorA.x = vectorU.x / 3;
		vectorA.y = vectorU.y / 3;

		var vectorB = rotate2D(vectorA, -Math.PI/3);

		var vectorC = rotate2D(vectorA, (Math.PI/3));

		var vectorD = vectorA;

		//Set Pointer Vector P to start and compute SubLine 1 & Iterate
		var vectorP = {};
		vectorP.x = line.x1;
		vectorP.y = line.y1;
		var vectorP2 = vectorAdd2D(vectorP, vectorA);

		var subLine1 = {};
		subLine1.x1 = vectorP.x;
		subLine1.x2 = vectorP2.x;
		subLine1.y1 = vectorP.y;
		subLine1.y2 = vectorP2.y;
		array.push(subLine1);
		array = kochCurve(array, iterations-1);


		//Set Pointer Vector P to end of SubLine 1 and compute SubLine 2 & Iterate
		vectorP = vectorP2;
		vectorP2 = vectorAdd2D(vectorP, vectorB);

		var subLine2 = {};
		subLine2.x1 = vectorP.x;
		subLine2.x2 = vectorP2.x;
		subLine2.y1 = vectorP.y;
		subLine2.y2 = vectorP2.y;
		array.push(subLine2);
		array = kochCurve(array, iterations-1);

		//Set Pointer Vector P to end of SubLine 2 and compute SubLine 3 & Iterate
		vectorP = vectorP2;
		vectorP2 = vectorAdd2D(vectorP, vectorC);

		var subLine3 = {};
		subLine3.x1 = vectorP.x;
		subLine3.x2 = vectorP2.x;
		subLine3.y1 = vectorP.y;
		subLine3.y2 = vectorP2.y;
		array.push(subLine3);
		array = kochCurve(array, iterations-1);

		//Set Pointer Vector P to end of SubLine 3 and compute SubLine 4 & Iterate
		vectorP = vectorP2;
		vectorP2 = vectorAdd2D(vectorP, vectorD);

		var subLine4 = {};
		subLine4.x1 = vectorP.x;
		subLine4.x2 = vectorP2.x;
		subLine4.y1 = vectorP.y;
		subLine4.y2 = vectorP2.y;
		array.push(subLine4);
		array = kochCurve(array, iterations-1);

		//Return Array filled with all Lines generated through iterating the Koch Curve
		return array;
	}
	else{
		//Return on 0 Iterations Left
		return array;
	}
}

/**
 * Integer Rotation Transform in 2D (Using Roation Matrix and Rounding into Integers)
 * @param  {Point} point 	A point object with x and y relative to origin
 * @param  {Number} theta 	An angle in Radians
 * @return {Point}       	The rotated point object in Absolute Coordinates
 */
function rotate2D(point, theta){
	var sinTheta = Math.sin(theta); //Precompute the Sin
	var cosTheta = Math.cos(theta); //Precompute the Cos

	var x = point.x;
	var y = point.y;

	var newx = x*cosTheta - y*sinTheta;
	var newy = x*sinTheta + y*cosTheta;

	var pointOut = {};
	pointOut.x = Math.round(newx);
	pointOut.y = Math.round(newy);

	return pointOut;
}

/**
 * Integer Vector Addition in 2D (Uses rounding to generate Integer Values)
 * @param  {Point} vectorA First Vector Point from Origin
 * @param  {Point} vectorB Second Vector Point from Origin
 * @return {Point}         Added Vectors from Origin in Absolute Coordinates
 */
function vectorAdd2D(vectorA, vectorB){
	var x1 = vectorA.x;
	var x2 = vectorB.x;
	var y1 = vectorA.y;
	var y2 = vectorB.y;

	var x = Math.round(x1+x2);
	var y = Math.round(y1+y2);

	return {x:x, y:y};
}

/**
 * A Point Object should contain x, y
 */
var Point = function(){}