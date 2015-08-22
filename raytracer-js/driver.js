(function(){
	//Canvas
	window.canvas2D = new Canvas2D();

	//Wait for Window load to build system
	$(window).on("load", ()=>{
		//Camera
		var camera = new Camera({
			position:     {x:0, y:20, z:0, h:1},
			gaze:         {x:0, y:0,  z:0, h:1},
			width:        canvas2D.width,
			height:       canvas2D.height,
			viewingAngle: 90,
			world:        null,
			noPipe:       false
		});

		//Scene Object Defs
		var sphere = new Sphere({baseC: {r:0, g:0, b:255, a:255},
								 specularC: {r:255, g:255, b:255, a:255}
								}); //Create Generic Sphere
		var plane  = new Plane({baseC: {r:100, g:100, b:100, a:255},
								specularFactor: 0,
								reflectionFactor: 0,
								transform: [[1,0,0, 0],
											[0,1,0, 0],
											[0,0,1, 0],
											[0,0,0, 1]]
								});
		var olight = new OmniLight({intensity:1.8,
									source:{x:-8, y:12, z: 1, h:1}}); //Create an OmniLight

		//World List
		var world = [];
		world.push(camera);
		world.push(sphere);
		world.push(plane);
		world.push(olight);

		var raytracer = new Raytracer({
			world: world,
			pixelRenderer: window.canvas2D
		});

		console.log(raytracer);

		setTimeout(()=>raytracer.render(),2000) //Do this in a timeout to allow page to finish loading...

		$(window).on('resize', ()=>{raytracer.render();});
	});

	
	
	// for(var x=0; x<100; x++){
	// 	// console.log(x);
	// 	canvas2D.drawPixel({x:x,y:x,r:0,g:0,b:0,a:255});
	// }
})();