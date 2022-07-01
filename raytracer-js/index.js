import Canvas2D from "canvas-2d-framework";
import Raytracer from "./Raytracer.js";
import { OmniLight, Plane, Sphere } from "./objects";
import { Camera, Math3D, Matrices3D, World } from "./lib";

export default function init() {
	//Canvas
	window.canvas2D = new Canvas2D({
		containerStyle: {
			margin: "0%",
			width: "100vw",
			height: "calc(100vh - 2px)",
			position: "relative"
		},
		canvasStyle: {
			margin: "0%",
			width: "100vw",
			height: "calc(100vh - 5px)",
			position: "relative"
		}
	});

	//Wait for Window load to build system
	window.onload = () => {
		//Camera
		var camera = new Camera({
			position: { x: 2, y: 2, z: 1, h: 1 },
			gaze: { x: 0, y: 0, z: 0, h: 1 },
			width: canvas2D.width,
			height: canvas2D.height,
			viewingAngle: 60,
			world: null,
			noPipe: true
		});

		//Scene Object Defs

		//World List
		var world = new World({ camera: camera });
		// world.push(camera);

		// var scale = 0.1;
		// var scaleF = 0.01;
		// var jitter = 0.1
		// var xsphere = 0.5;
		// var ysphere = 0.5;
		// var zsphere = 1;
		// var fsphere = 0.25;

		//Scale of Sphere
		let scale = 0.15;
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

					let sfact = scale * ((Math.random() * scaleF) + (1 - scaleF));
					let x = i + (Math.random() * jitter - jitter);
					let y = j + (Math.random() * jitter - jitter);
					let z = k + (Math.random() * jitter - jitter);
					let pipe = [
						Math3D.translate(x, y, z),
						Math3D.scale(sfact, sfact, sfact)
					];
					// let mat = Math3D.transformPipe(pipe);
					// console.log(mat);

					world.addObject(new Sphere({
						baseC: { r: 0, g: 0, b: 255, a: 255 },
						specularC: { r: 255, g: 255, b: 255, a: 255 },
						transform: Math3D.transformPipe(pipe)
					})); //Create Generic Sphere
				}
			}
		}

		var floor = new Plane({
			baseC: { r: 100, g: 100, b: 100, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0.2,
			transform: Math3D.transformPipe([
				Math3D.translate(0, 0, -0.25),
				Math3D.scale(10, 10, 10),
			]),
			restricted: true
		});
		world.addObject(floor);

		var wall1 = new Plane({
			baseC: { r: 100, g: 100, b: 100, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0.1,
			transform: Math3D.transformPipe([
				Math3D.translate(-4, -4, 0),
				Math3D.scale(10, 10, 10),
				Math3D.rotateOnArbitrary(Math.PI / 2, { x: 0, y: 1, z: 0, h: 1 })

			])
		});
		// world.addObject(wall1);

		var wall2 = new Plane({
			baseC: { r: 100, g: 100, b: 100, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0.1,
			transform: Math3D.transformPipe([
				Math3D.translate(-4, -4, 0),
				Math3D.scale(10, 10, 10),
				Math3D.rotateOnArbitrary(-Math.PI / 2, { x: 1, y: 0, z: 0, h: 1 })

			])
		});
		// world.addObject(wall2);

		var wall3 = new Plane({
			baseC: { r: 100, g: 100, b: 100, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0.003,
			transform: Math3D.transformPipe([
				Math3D.translate(4, 4, 0),
				Math3D.scale(10, 10, 10),
				Math3D.rotateOnArbitrary(-Math.PI / 2, { x: 0, y: 1, z: 0, h: 1 })

			])
		});
		// world.addObject(wall3);

		var wall4 = new Plane({
			baseC: { r: 100, g: 100, b: 100, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0.003,
			transform: Math3D.transformPipe([
				Math3D.translate(4, 4, 0),
				Math3D.scale(10, 10, 10),
				Math3D.rotateOnArbitrary(Math.PI / 2, { x: 1, y: 0, z: 0, h: 1 })

			])
		});
		// world.addObject(wall4);

		var cieling = new Plane({
			baseC: { r: 100, g: 100, b: 100, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0.003,
			transform: Math3D.transformPipe([
				Math3D.translate(0, 0, 9),
				Math3D.scale(10, 10, 10),
				Math3D.rotateOnArbitrary(Math.PI, { x: 0, y: 0, z: 1, h: 1 })
			])
		});
		// world.addObject(cieling);

		var olight = new OmniLight({
			intensity: 2.5,
			source: { x: -2, y: -1, z: 3, h: 1 }
		}); //Create an OmniLight

		world.addLight(olight);

		// Setup Raytracer and Kick it off
		var raytracer = new Raytracer({
			world: world,
			pixelRenderer: window.canvas2D
		});

		console.log(raytracer);

		setTimeout(() => raytracer.render(), 2000) //Do this in a timeout to allow page to finish loading...

		var resizeTimer;
		window.onresize = () => {
			raytracer.stop();
			if (resizeTimer) clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => raytracer.render(), 100);
		};
	};
};