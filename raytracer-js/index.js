import Canvas2D from "canvas-2d-framework";
import Raytracer from "./Raytracer.js";
import {OmniLight, Plane, Sphere} from "./objects";
import {Camera, Math3D, Matrices3D} from "./lib";

export default function init(){
	//Canvas
	window.canvas2D = new Canvas2D({
		containerStyle: {
			left: "0px",
			right: "0px",
			margin: "0px",
			width: "100%",
			height: "100%",
			position: "absolute",
		}
	});

	//Wait for Window load to build system
	window.onload = ()=>{
		//Camera
		var camera = new Camera({
			position:     {x:2, y:2, z:2, h:1},
			gaze:         {x:0, y:0,  z:0, h:1},
			width:        canvas2D.width,
			height:       canvas2D.height,
			viewingAngle: 60,
			world:        null,
			noPipe:       true
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

		for(let i=-xsphere; i<=xsphere; i=i+fsphere){
			for(let j=-ysphere; j<=ysphere; j=j+fsphere){
				for(let k=0; k<=zsphere; k=k+fsphere){
					console.log("Making sphere at x:" + i + " y:" + j);

					let sfact = scale*((Math.random()*scaleF)+(1-scaleF));
					let x = i + (Math.random()*jitter-jitter);
					let y = j + (Math.random()*jitter-jitter);
					let z = k + (Math.random()*jitter-jitter);
					let pipe = [
						Math3D.translate(x, y, z),
						Math3D.scale(sfact, sfact, sfact)
					];
					// let mat = Math3D.transformPipe(pipe);
					// console.log(mat);

					world.push(new Sphere({
						baseC: {r:0, g:0, b:255, a:255},
						specularC: {r:255, g:255, b:255, a:255},
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
									source:{x:8, y:0, z: 1, h:1}}),
				   new OmniLight({intensity:1.0,
									source:{x:-8, y:0, z: 1, h:1}}))

		var raytracer = new Raytracer({
			world: world,
			pixelRenderer: window.canvas2D
		});

		console.log(raytracer);

		setTimeout(()=>raytracer.render(),2000) //Do this in a timeout to allow page to finish loading...

		var resizeTimer;
		window.onresize = ()=>{
			raytracer.stop();
			if(resizeTimer) clearTimeout(resizeTimer);
			resizeTimer = setTimeout(()=>raytracer.render(),100);
		};
	};

	// for(var x=0; x<100; x++){
	// 	// console.log(x);
	// 	canvas2D.drawPixel({x:x,y:x,r:0,g:0,b:0,a:255});
	// }
};