(function(){
	//Canvas
	window.canvas2D = new Canvas2D();

	//Wait for Window load to build system
	$(window).on("load", ()=>{
		//Camera
		var camera = new Camera({
			position:     {x:0, y:5, z:3, h:1},
			gaze:         {x:0, y:0,  z:0, h:1},
			width:        canvas2D.width,
			height:       canvas2D.height,
			viewingAngle: 70,
			world:        null,
			noPipe:       false
		});

		//Scene Object Defs
		var sphere1 = new Sphere({baseC: {r:0, g:0, b:255, a:255},
								 specularC: {r:255, g:255, b:255, a:255},
								 transform: [[1,0,0, 2],
											[0,1,0, 0],
											[0,0,1, 0],
											[0,0,0, 1]]
								}); //Create Generic Sphere
		var sphere2 = new Sphere({baseC: {r:0, g:0, b:255, a:255},
								 specularC: {r:255, g:255, b:255, a:255},
								 transform: [[1,0,0, 0],
											[0,1,0, 2],
											[0,0,1, 0],
											[0,0,0, 1]]
								}); //Create Generic Sphere
		var sphere3 = new Sphere({baseC: {r:0, g:0, b:255, a:255},
								 specularC: {r:255, g:255, b:255, a:255},
								 transform: [[1,0,0, -2],
											[0,1,0, 0],
											[0,0,1, 0],
											[0,0,0, 1]]
								}); //Create Generic Sphere
		var sphere4 = new Sphere({baseC: {r:0, g:0, b:255, a:255},
								 specularC: {r:255, g:255, b:255, a:255},
								 transform: [[1,0,0, 0],
											[0,1,0, -2],
											[0,0,1, 0],
											[0,0,0, 1]]
								}); //Create Generic Sphere

		//World List
		var world = [];

		var scale = 0.35
		var xsphere = 1;
		var ysphere = 1;
		var zsphere = 1;
		var fsphere = 1;


		for(var i=-xsphere; i<=xsphere; i=i+fsphere){
			for(var j=-ysphere; j<=ysphere; j=j+fsphere){
				for(var k=0; k<=zsphere; k=k+fsphere){
					console.log("Making sphere at x:" + i + " y:" + j);

					var sfact = scale*(Math.random()+0.5);
					var x = i * (Math.random()/2+0.75);
					var y = j * (Math.random()/2+0.75);
					var z = k * (Math.random()/2+0.75);
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

		var plane  = new Plane({baseC: {r:100, g:100, b:100, a:255},
								diffuseFactor: 0.8,
								specularFactor: 0.0001,
								reflectionFactor: 0.0001,
								transform: [[1,0,0, 0],
											[0,1,0, 0],
											[0,0,1, -1],
											[0,0,0, 1]]
								});

		var plane2 = new Plane({baseC: {r:200, g:200, b:200, a:255},
								diffuseFactor: 0.8,
								specularFactor: 0.0001,
								reflectionFactor: 0.0001,
								transform: [[1,0,0, 0],
											[0,1,0, 0],
											[0,0,1, 10],
											[0,0,0, 1]]
								});
		var olight = new OmniLight({intensity:2.0,
									source:{x:0, y:0, z: 8, h:1}}); //Create an OmniLight

		
		world.push(camera);
		world.push(sphere1);
		world.push(sphere2);
		world.push(sphere3);
		world.push(sphere4);
		world.push(plane);
		// world.push(plane2);
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