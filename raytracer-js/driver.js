(function(){
	//Canvas
	window.canvas2D = new Canvas2D();

	//Wait for Window load to build system
	$(window).on("load", ()=>{
		//Camera
		var camera = new Camera({
			position:     {x:2, y:2, z:2, h:1},
			gaze:         {x:0, y:0,  z:0.5, h:1},
			width:        canvas2D.width,
			height:       canvas2D.height,
			viewingAngle: 60,
			world:        null,
			noPipe:       false
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
		var scale = 0.2;
		//Scale of jitter of scale
		var scaleF = 0.0;
		//Spatial Jitter
		var jitter = 0;
		//Size of x in +/-0
		var xsphere = 0.5;
		//Size of y in +/-0
		var ysphere = 0.5;
		//Size of z in 0+
		var zsphere = 1;
		//Step in x,y,z
		var fsphere = 0.5;

		for(var i=-xsphere; i<=xsphere; i=i+fsphere){
			for(var j=-ysphere; j<=ysphere; j=j+fsphere){
				for(var k=0; k<=zsphere; k=k+fsphere){
					console.log("Making sphere at x:" + i + " y:" + j);

					var sfact = scale*((Math.random()*scaleF)+(1-scaleF));
					var x = i + (Math.random()*jitter-jitter);
					var y = j + (Math.random()*jitter-jitter);
					var z = k + (Math.random()*jitter-jitter);
					let pipe = [
						Math3D.translate(x, y, z),
						Math3D.scale(sfact, sfact, sfact)
					];
					let mat = Math3D.transformPipe(pipe);
					console.log(mat);

					world.push(new Sphere({baseC: {r:0, g:0, b:255, a:255},
						specularC: {r:255, g:255, b:255, a:255},
						transform: mat
					})); //Create Generic Sphere
				}
			}
		}

		var plane = new Plane({baseC: {r:100, g:100, b:100, a:255},
								diffuseFactor: 0.8,
								specularFactor: 0.0001,
								reflectionFactor: 0.0001,
								transform: Math3D.translate(0,0,-1)
								});

		var olight = new OmniLight({intensity:2.0,
									source:{x:0, y:0, z: 8, h:1}}); //Create an OmniLight

		world.push(plane);
		world.push(olight);
		world.push(new OmniLight({intensity:1.0,
									source:{x:0, y:8, z: 1, h:1}}),
				   new OmniLight({intensity:1.0,
									source:{x:0, y:-8, z: 1, h:1}}),
				   new OmniLight({intensity:1.0,
									source:{x:8, y:0, z: 1, h:1}})),
				   new OmniLight({intensity:1.0,
									source:{x:-8, y:0, z: 1, h:1}})

		var raytracer = new Raytracer({
			world: world,
			pixelRenderer: window.canvas2D
		});

		console.log(raytracer);

		setTimeout(()=>raytracer.render(),2000) //Do this in a timeout to allow page to finish loading...

		var resizeTimer;
		$(window).on('resize', ()=>{
			raytracer.stop();
			if(resizeTimer) clearTimeout(resizeTimer);
			resizeTimer = setTimeout(()=>raytracer.render(),100);
		});
	});

	
	
	// for(var x=0; x<100; x++){
	// 	// console.log(x);
	// 	canvas2D.drawPixel({x:x,y:x,r:0,g:0,b:0,a:255});
	// }
})();