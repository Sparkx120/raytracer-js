(function(){
	//Bootstrap Canvas
	// body.innerHTML += "<script src='./raytracer/canvas2DControl.js'></script>";
	window.canvas2D = new Canvas2D();

	//console.log(canvas2D)
	// setTimeout(function(){
	// 	for(var x=0; x<10000; x++){
	// 		canvas2D.drawPixel({x:(Math.floor(Math.random()*canvas2D.rect.width)), y:(Math.floor(Math.random()*canvas2D.rect.height)),
	// 							r:(Math.floor(Math.random()*256)),
	// 							g:(Math.floor(Math.random()*256)),
	// 							b:(Math.floor(Math.random()*256)),
	// 							a:255});
	// 	}
	// },100);
	
	var camera = new Camera({
		position: {x:0, y:16, z:1, h:1},
		gaze: {x:0, y:0, z:0, h:1},
		width: canvas2D.width,
		height: canvas2D.height,
		viewingAngle: 90,
		world: null,
		noPipe: false
	});

	var sphere = new Sphere({baseC: {r:0, g:0, b:255, a:255}}); //Create Generic Sphere

	var world = [];
	world.push(camera);
	world.push(sphere);


	var raytracer = new Raytracer({
		world: world,
		pixelRenderer: window.canvas2D
	});

	console.log(raytracer);

	raytracer.render();

	$(window).on('resize', ()=>{raytracer.render();});
	
	// for(var x=0; x<100; x++){
	// 	// console.log(x);
	// 	canvas2D.drawPixel({x:x,y:x,r:0,g:0,b:0,a:255});
	// }
})();