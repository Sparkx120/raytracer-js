(function(){
	//Bootstrap Canvas
	// body.innerHTML += "<script src='./raytracer/canvas2DControl.js'></script>";
	window.canvas2D = new Canvas2D();

	console.log(canvas2D)
	// setTimeout(function(){
	// 	for(var x=0; x<100000; x++){
	// 		canvas2D.drawPixel({x:(Math.floor(Math.random()*canvas2D.rect.width)), y:(Math.floor(Math.random()*canvas2D.rect.height)),
	// 							r:(Math.floor(Math.random()*256)),
	// 							g:(Math.floor(Math.random()*256)),
	// 							b:(Math.floor(Math.random()*256)),
	// 							a:255});
	// 	}
	// },100);
	
	// for(var x=0; x<100; x++){
	// 	// console.log(x);
	// 	canvas2D.drawPixel({x:x,y:x,r:0,g:0,b:0,a:255});
	// }
})();