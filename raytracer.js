(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Canvas Wrapper object to handle pixel level drawing on the HTML5 Canvas as well as manage the canvas
 * Automatically deploys a canvas to the body (for now)
 * 
 * (Now in ES6)
 * 
 * @author  James Wake (SparkX120)
 * @version 0.0.6 (2017/12)
 * @license MIT
 */
var Canvas2D = function () {
	function Canvas2D(config) {
		var _this = this;

		_classCallCheck(this, Canvas2D);

		//Create the Canvas and Deploy it
		this.container = document.createElement('div');
		this.canvas = document.createElement('canvas');
		this.bufferedImage = document.createElement('canvas');

		//Get Supersampling and Style configurations
		if (config && config.supersampling) this.supersampling = config.supersampling;else this.supersampling = 1.0;

		if (config.canvasStyle) {
			for (var i in config.canvasStyle) {
				this.canvas.style[i] = config.canvasStyle[i];
			}
		}
		if (config.containerStyle) {
			for (var _i in config.containerStyle) {
				this.container.style[_i] = config.containerStyle[_i];
			}
		} else {
			this.container.style.margin = "0%";
			this.container.style.width = "100vw";
			this.container.style.height = "100vh";
			this.container.style.position = "relative";
		}

		//Setup Contexts
		this.context = this.canvas.getContext('2d');
		this.bufferedContext = this.bufferedImage.getContext('2d');

		//Compose the container and put into the document
		this.container.appendChild(this.canvas);
		document.body.appendChild(this.container);

		//Positioning and Scaling
		this.rect = this.container.getBoundingClientRect();
		window.addEventListener('resize', function (event) {
			_this.setSupersampling(_this.supersampling);
			if (_this.resizeCB) {
				_this.resizeCB();
			}
		});
		window.addEventListener('load', function (event) {
			_this.setSupersampling(_this.supersampling);
			if (_this.resizeCB) {
				_this.resizeCB();
			}
		});
		this.canvas.width = this.rect.width;
		this.canvas.height = this.rect.height;
		this.width = this.rect.width;
		this.height = this.rect.height;

		//Persistant Pixel Image Data Object
		this.pixelImageData = this.context.createImageData(1, 1);
		this.buffer = this.context.createImageData(this.width, this.height);
	}

	/**
  * Set a supersampling factor for the buffered canvas (access super sample width and height via getWidth and getHeight)
  * @param {*} supersampling - The supersampling factor to use
  */


	_createClass(Canvas2D, [{
		key: 'setSupersampling',
		value: function setSupersampling(supersampling) {
			//Compute Dimensions to use
			this.supersampling = supersampling;
			this.rect = this.canvas.getBoundingClientRect();
			this.canvas.width = Math.floor(this.rect.width);
			this.canvas.height = Math.floor(this.rect.height);
			this.width = Math.floor(this.rect.width);
			this.height = Math.floor(this.rect.height);
			this.context.scale(1 / supersampling, 1 / supersampling);

			//Setup the supersampled ArrayBuffer
			this.buffer = this.context.createImageData(this.getWidth(), this.getHeight());
			this.bufferedImage.width = this.getWidth();
			this.bufferedImage.height = this.getHeight();
			return this;
		}

		/**
   * Get the width of canvas with supersampling
   * @returns the width with supersampling
   */

	}, {
		key: 'getWidth',
		value: function getWidth() {
			return Math.ceil(this.width * this.supersampling);
		}

		/**
   * Get height of canvas with supersampling
   * @returns the height with supersampling
   */

	}, {
		key: 'getHeight',
		value: function getHeight() {
			return Math.ceil(this.height * this.supersampling);
		}

		/**
   * Draws a pixel to this Canvas. Note that RGBA are between 0 and 255
   * @param  {{x: Number, y: Number, r: Number, g: Number, b: Number, a: Number}} pixel The Pixel to draw
   */

	}, {
		key: 'drawPixel',
		value: function drawPixel(pixel) {
			this.pixelImageData.data[0] = pixel.r;
			this.pixelImageData.data[1] = pixel.g;
			this.pixelImageData.data[2] = pixel.b;
			this.pixelImageData.data[3] = pixel.a;
			this.context.putImageData(this.pixelImageData, pixel.x / this.supersampling, pixel.y / this.supersampling);
		}

		/**
   * Draws a pixel to the supersampled ArrayBuffer
   * @param {*} pixel - The pixel to draw
   */

	}, {
		key: 'drawBufferedPixel',
		value: function drawBufferedPixel(pixel) {
			var index = 4 * (pixel.x + pixel.y * this.getWidth()) - 4;
			this.buffer.data[index] = pixel.r;
			this.buffer.data[index + 1] = pixel.g;
			this.buffer.data[index + 2] = pixel.b;
			this.buffer.data[index + 3] = pixel.a;
		}

		/**
   * Flushes the supersampled ArrayBuffer to the rendered canvas' drawing context
   */

	}, {
		key: 'flushBuffer',
		value: function flushBuffer() {
			this.bufferedContext.putImageData(this.buffer, 0, 0);
			this.context.drawImage(this.bufferedImage, 0, 0); //Still not working
		}

		/**
   * Clears the supersampled ArrayBuffer
   */

	}, {
		key: 'clearBuffer',
		value: function clearBuffer() {
			this.buffer = this.context.createImageData(this.getWidth(), this.getHeight());
		}

		/**
   * Draws a Line on the canvas directly between 2 points
   * @param {{x1,x2,y1,y2}} line 
   */

	}, {
		key: 'drawLine',
		value: function drawLine(line) {
			this.context.beginPath();
			this.context.moveTo(line.x1, line.y1);
			this.context.lineTo(line.x2, line.y2);
			this.context.stroke();
		}
	}]);

	return Canvas2D;
}();

exports.default = Canvas2D;

},{}],2:[function(require,module,exports){
"use strict";

var _index = require("./raytracer-js/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index2.default)();

},{"./raytracer-js/index.js":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Version = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objects = require("./objects");

var _lib = require("./lib");

var _syntheticWebworker = require("synthetic-webworker");

var _syntheticWebworker2 = _interopRequireDefault(_syntheticWebworker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Version = exports.Version = "1.1.0a";
if (window) {
	window.raytracer_version = Version;
}

/**
 * Raytracer object to raytrace a world definition
 * @param {Object} config The configuration object
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */

var Raytracer = function () {
	function Raytracer(config) {
		_classCallCheck(this, Raytracer);

		// this.camera = config.camera;
		if (config.world instanceof _lib.World) this.world = config.world;else throw "World passed in is not a World Object";

		this.camera = this.world.getCamera();
		// this.world.some((e) => {if(e instanceof Camera){this.camera = e;};});
		// if(!this.camera)
		// 	throw "World Does not have a Camera!";

		this.pixelRenderer = config.pixelRenderer; //Must support function drawPixel({x, y, r, g, b, a});

		this.backgroundColor = { r: 0, g: 0, b: 0, a: 255 };
		this.color = { r: 100, g: 100, b: 100, a: 255 };

		this.falloffFactor = 10;
		this.recursionFactor = 4;

		this.running = false;
		this.noplaceholder = false;

		this.parallelism = 1;
		this.renderThreads = [];

		this.drawTitle();
	}

	/**
  * Draw the Title Image to the Raytracer TODO Make this optional
  */


	_createClass(Raytracer, [{
		key: "drawTitle",
		value: function drawTitle() {
			var width = this.pixelRenderer.getWidth();
			var height = this.pixelRenderer.getHeight();
			var ctx = this.pixelRenderer.context;
			var x = width / 2;
			var y1 = height * (1 / 3);
			var y2 = height * (2 / 3);

			ctx.font = '30pt Helvetica,Arial,sans-serif';
			ctx.textAlign = 'center';
			ctx.fillStyle = 'Black';
			ctx.fillText('Raytracer-JS', x, y1);

			ctx.font = '15pt Helvetica,Arial,sans-serif';
			ctx.fillText("Version " + Version + " By SparkX120", x, y2);
		}

		/**
   * Draw a placeholder before render
   */

	}, {
		key: "drawRenderingPlaceholder",
		value: function drawRenderingPlaceholder() {
			var width = this.pixelRenderer.getWidth();
			var height = this.pixelRenderer.getHeight();
			var ctx = this.pixelRenderer.context;
			var x = width / 2;
			var y = height / 2;

			ctx.fillStyle = 'rgba(255,255,255,1)';
			ctx.fillRect(0, 0, width, height);

			this.progress = document.createElement("progress");
			this.progress.max = 100;
			this.progress.value = 0;
			this.progress.style.left = '2.5%';
			this.progress.style.zindex = "99";
			this.progress.style.width = "95%";
			this.progress.style.margin = "0px";
			this.progress.style.height = "3em";
			this.progress.style.bottom = "50%";
			this.progress.style.position = "absolute";
			// this.progress.style.border          = "1px solid black";
			this.progress.className = "prog";

			if (this.pixelRenderer.container) this.pixelRenderer.container.appendChild(this.progress);
		}

		/**
   * Draw Controls over the render
   * 
   * TODO Consider adding this to Canvas 2D and making it configurable
   * for my other projects
   */

	}, {
		key: "drawControls",
		value: function drawControls() {
			var _this = this;

			this.controlContainer = document.createElement("div");
			this.controlContainer.style.position = "absolute";
			this.controlContainer.style.right = "0";
			this.controlContainer.style.top = "0";
			this.controlContainer.style.zindex = "100";

			this.animateBtn = document.createElement("button");
			this.animateBtn.innerHTML = "Animate";
			this.animateBtn.onclick = function () {
				return _this.renderAnimated();
			};
			this.controlContainer.appendChild(this.animateBtn);

			if (this.pixelRenderer.container) {
				this.pixelRenderer.container.appendChild(this.controlContainer);
			}
		}

		/**
   * Gets the Array of Objects in the world (Wrapper Function)
   * 
   * @returns {[GenericObject]} The Array of Generic Objects in the world
   */

	}, {
		key: "getObjectList",
		value: function getObjectList() {
			return this.world.getObjects();
		}

		/**
   * Gets the Array of Lights in the world (Wrapper Function)
   * 
   * @returns {[Light]} The Array of Lights in the world
   */

	}, {
		key: "getLightList",
		value: function getLightList() {
			return this.world.getLights();
		}

		/**
   * Stop an inprogress render
   * Currently unsafe to call before the first render FIXME
   */

	}, {
		key: "stop",
		value: function stop() {
			if (this.timeint) {
				console.log("killing render");
				clearInterval(this.timeint);
				this.timeint = null;
				this.running = false;
			}
		}

		/**
   * Render in animated mode at some small subsampled rate
   */

	}, {
		key: "renderAnimated",
		value: function renderAnimated() {
			var _this2 = this;

			if (this.running) {
				this.stop();
			}
			var counter = 0;
			this.pixelRenderer.setSupersampling(0.15);

			this.running = true;
			//Multithreaded Animation NOT READY YET
			if (this.parallelism > 1) {
				for (var i = 0; i < this.parallelism; i++) {
					this.renderThreads[i] = new _syntheticWebworker2.default(this._renderLineT, function (e) {
						e.data.line.map(function (intensity, idx) {
							_this2.canvas2d.drawBufferedPixel(_this2._pixelShader(e.data.Px, idx, intensity, _this2.shader));
						});
						_this2.heightScalar = e.data.heightScalar;
						if ( /*e.data.Px % (width*xSkip) <= 1 ||*/e.data.Px > width - xSkip - 1) _this2.canvas2d.flushBuffer();
						if (e.data.Px >= width - (xSkip - i)) _this2.renderThreads[i].terminate();
					});

					rConfig.xInit = i;
					this.renderThreads[i].postMessage(rConfig);
				}
			}
			//Standard Animation on one thread
			else {
					this.timeint = setInterval(function () {
						if (!_this2.running) {
							clearInterval(_this2.timeint);
						}
						//Move by chord length on circle (ie edge of segment)
						_this2.camera = new _lib.Camera({
							position: { x: 2 * Math.sin(counter), y: 2 * Math.cos(counter), z: 2 * (Math.sin(Math.PI + counter / 2) + 1), h: 1 },
							gaze: { x: 0, y: 0, z: 0.25, h: 1 },
							width: _this2.pixelRenderer.getWidth(),
							height: _this2.pixelRenderer.getHeight(),
							viewingAngle: 60,
							world: null,
							noPipe: true
						});

						//Render image
						for (var i = 0; i <= _this2.camera.y; i++) {
							_this2._renderLine(i, true);
						}

						counter += Math.PI / 20;
						// this.running = false;
					}, 0);
				}
		}

		/**
   * Render the scene in the world to the pixelrenderer
   */

	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			if (!this.noplaceholder) {
				this.drawRenderingPlaceholder();
				this.drawControls();
			}
			this.pixelRenderer.setSupersampling(1.5);

			//Give canvas async time to update
			this.running = true;
			var renderLoop = setTimeout(function () {
				_this3.pixelRenderer.clearBuffer();
				_this3.camera.width = _this3.pixelRenderer.getWidth();
				_this3.camera.height = _this3.pixelRenderer.getHeight();
				_this3.camera.setupVectors();

				//Run outerloop in interval so canvas can live update
				var i = 0;
				_this3.timeint = setInterval(function () {
					i++;
					_this3._renderLine(i, true, _this3.timeint);
				}, 0);
			}, 0);
		}

		/**
   * Primite single Line Render for use in direct draw.
   * 
   * @private
   * @param {*} i - The pixel line to render
   * @param {*} enableFlush - Enables flushing to the PixelRenderer directly here
   * @param {*} interval - The Interval this is running in (Maybe removed later)
   */

	}, {
		key: "_renderLine",
		value: function _renderLine(i, enableFlush, interval) {
			if (i < this.camera.y) {
				for (var j = 0; j < this.camera.x; j++) {
					var ray = new _lib.Ray({ x: j, y: i, camera: this.camera, depth: 0 });
					var color = this.raytrace(ray, null, null, this.getObjectList(), this.getLightList(), this.backgroundColor);
					var pixel = color;
					pixel.x = j;
					pixel.y = i;
					this.pixelRenderer.drawBufferedPixel(pixel);
				}
				if (enableFlush) this.pixelRenderer.flushBuffer();

				//Update Progress Bar
				var progress = Math.floor(i / this.camera.y * 100);
				if (this.progress && this.progress.value != progress) {
					this.progress.value = progress;
				}
				if (interval && !this.running) {
					clearInterval(interval);
				}
			} else {
				//Get rid of the Progress Bar
				if (this.progress) {
					this.pixelRenderer.container.removeChild(this.progress);
					this.progress = null;
				}
				// this.pixelRenderer.flushBuffer();
				if (interval) {
					clearInterval(interval);
				}
			}
		}

		/**
   * Threaded (WebWorker) Line Renderer. NOT COMPLETE
   * 
   * @private
   * @param {*} i - The pixel line to render
   * @param {*} config - The state of the raytracer (MAY USE COMPLETELY INITIALIZED RAYTRACING CLASS INSTEAD)
   */

	}, {
		key: "_renderLineT",
		value: function _renderLineT(i, config) {
			var objectList = config.objectList();
			var lightList = config.lightList();
			if (i < config.camera.y) {
				for (var j = 0; j < config.camera.x; j++) {
					var ray = new _lib.Ray({ x: j, y: i, camera: config.camera, depth: 0 });
					var color = this.raytrace(ray, null, null, objectList, lightList, config.backgroundColor);
					var pixel = color;
					pixel.x = j;
					pixel.y = i;
					this.pixelRenderer.drawBufferedPixel(pixel);
				}
				if (enableFlush) this.pixelRenderer.flushBuffer();

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
				if (interval) {
					clearInterval(interval);
				}
			}
		}

		/**
   * Raytrace a single pixel (point)
   * @param {Ray} ray - The Ray to raytrace on
   * @param {Number} recursion - The recursion depth
   * @param {GenericObject} objR  - The object that was recursed on (not necessary for some shaders)
   * @param {[GenericObject]} objList - The list of objects in the scene to render (MAY REMOVE LATER)
   * @param {[Light]} lightList - The list of lights in the scene to render (MAY REMOVE LATER)
   * @param {Pixel} backgroundColor - The background color to use (MAY REMOVE LATER)
   */

	}, {
		key: "raytrace",
		value: function raytrace(ray, recursion, objR, objList, lightList, backgroundColor) {
			if (recursion && recursion > this.recursionFactor) return { r: 0, g: 0, b: 0, a: 0 };

			objList.map(function (obj) {
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

				if (lightList) {
					if (object.diffuseFactor > 0) diffuseColor = this._diffuseShader(ray, objList, lightList);
					if (object.specularFactor > 0) specularColor = this._specularShader(ray, objList, lightList);
					if (object.reflectionFactor > 0) reflectionColor = this._reflectionShader(ray, recursion, objList, lightList);
					if (object.refractionFactor > 0) {
						refractionColor = this._refractionShader(ray, recursion, objList, lightList);
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
	}, {
		key: "_diffuseShader",
		value: function _diffuseShader(ray, objList, lightList) {
			var _this4 = this;

			var object = ray.lowestIntersectObject;
			var intersect = ray.lowestIntersectPoint;
			var n = object.getNormalAt(intersect);
			var falloffFactor = this.falloffFactor;

			var intensities = [];
			var unShadowedLights = 0;
			var totalIntensity = 0;

			if (this.getLightList()) {
				this.getLightList().map(function (light, index, lights) {
					var s = _lib.Math3D.vectorizePoints(intersect, light.source);
					var v = _lib.Math3D.vectorizePoints(intersect, ray.e);
					var ns = _lib.Math3D.dotProduct(n, s);

					var shadowDetect = new _lib.Ray({ e: intersect, d: s, exclusionObj: object, targetPoint: light.source });
					_this4.getObjectList().map(function (obj) {
						obj.rayIntersect(shadowDetect);
					});

					if (!shadowDetect.intersectedObject) {
						//Compute Falloff from Lightsource
						// var distance = Math3D.magnitudeOfVector(s);

						//Compute Diffuse Intensity
						var div = _lib.Math3D.magnitudeOfVector(s) * _lib.Math3D.magnitudeOfVector(n);

						if (div != 0) {
							var nDots = ns / div;
							var diffuseIntensity = light.intensity * Math.max(nDots, 0);
							totalIntensity += diffuseIntensity;
						} else {
							console.log(div);
						}
					}
				});
			}

			return {
				r: object.diffuseC.r * totalIntensity,
				g: object.diffuseC.g * totalIntensity,
				b: object.diffuseC.b * totalIntensity,
				a: 255
			};
		}
	}, {
		key: "_specularShader",
		value: function _specularShader(ray, objList, lightList) {
			var _this5 = this;

			var object = ray.lowestIntersectObject;
			var intersect = ray.lowestIntersectPoint;
			var n = object.getNormalAt(intersect);
			var falloffFactor = this.falloffFactor;

			var intensities = [];
			var unShadowedLights = 0;
			var totalIntensity = 0;
			if (this.getLightList()) {
				this.getLightList().map(function (light, index, lights) {
					var s = _lib.Math3D.vectorizePoints(intersect, light.source);
					var v = _lib.Math3D.vectorizePoints(intersect, ray.e);
					var ns = _lib.Math3D.dotProduct(n, s);

					var shadowDetect = new _lib.Ray({ e: intersect, d: s, exclusionObj: object });
					_this5.getObjectList().map(function (obj) {
						obj.rayIntersect(shadowDetect);
					});
					if (!shadowDetect.intersectedObject) {
						var magN = _lib.Math3D.magnitudeOfVector(n);
						var coeff = 2 * (ns / (magN * magN));

						var r = _lib.Math3D.addVectors(_lib.Math3D.scalarMultiply(s, -1.0), _lib.Math3D.scalarMultiply(n, coeff));

						var f = object.specularFalloff;

						//Compute Falloff from Lightsource
						// var distance = Math3D.magnitudeOfVector(s);

						// if(distance < 1)
						// 	distance = 1;

						//Compute Specular Intensity
						var specularIntensity = 0;
						var vDotr = _lib.Math3D.dotProduct(v, r) / (_lib.Math3D.magnitudeOfVector(v) * _lib.Math3D.magnitudeOfVector(r));
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
				a: 255
			};
		}
	}, {
		key: "_reflectionShader",
		value: function _reflectionShader(ray, recursion, objList, lightList) {
			var object = ray.lowestIntersectObject;
			var intersect = ray.lowestIntersectPoint;
			var norm = object.getNormalAt(intersect);

			var iDotn = _lib.Math3D.dotProduct(_lib.Math3D.normalizeVector(ray.d), _lib.Math3D.normalizeVector(norm));
			if (object.reflectionFactor > 0 && ray.depth < this.recursionFactor && iDotn < 0) {
				//Reflection Vector
				var coeff = -2 * iDotn;
				var reflectionD = _lib.Math3D.scalarMultiply(norm, coeff);
				reflectionD = _lib.Math3D.normalizeVector(reflectionD);

				var incident = new _lib.Ray({ e: intersect, d: reflectionD, depth: ray.depth + 1, exclusionObj: object });
				var reflection = this.raytrace(incident, recursion + 1, null, objList, lightList); //uses incident object detection aka this obj
				return {
					r: reflection.r,
					g: reflection.g,
					b: reflection.b,
					a: 255
				};
			}

			return this.backgroundColor;
		}
	}, {
		key: "_refractionShader",
		value: function _refractionShader(ray, recursion, objList, lightList) {
			var object = ray.lowestIntersectObject;
			var intersect = ray.lowestIntersectPoint;
			var norm = object.getNormalAt(intersect);

			//Refraction Vector (assuming transitions with air)
			//Based on math from http://graphics.stanford.edu/courses/cs148-10-summer/docs/2006--degreve--reflection_refraction.pdf
			//Based on Derivation from http://www.starkeffects.com/snells-law-vector.shtml
			var nTheta = _lib.Math3D.dotProduct(_lib.Math3D.normalizeVector(_lib.Math3D.scalarMultiply(ray.d, 1)), _lib.Math3D.normalizeVector(norm));
			var cosNTheta = nTheta; //(float) Math.cos(nTheta);
			var refractionIndex = object.refractionIndex;

			//start with white
			var refraction = { r: 255, g: 255, b: 255, a: 255 };

			if (object.refractionIndex > 0.0) {
				//Do Refraction Angle Computation
				var nCrossD = _lib.Math3D.crossProduct(norm, ray.d);
				var i = _lib.Math3D.crossProduct(norm, _lib.Math3D.crossProduct(_lib.Math3D.scalarMultiply(norm, -1), ray.d));
				i = _lib.Math3D.scalarMultiply(i, refractionIndex);
				var nDotn = _lib.Math3D.dotProduct(nCrossD, nCrossD);
				var coeff = Math.sqrt(1 - refractionIndex * refractionIndex * nDotn);
				var j = _lib.Math3D.scalarMultiply(norm, coeff);
				var refractionD = _lib.Math3D.normalizeVector(_lib.Math3D.vectorizePoints(i, j));

				//Create Refraction Ray
				var refracted = new _lib.Ray({ e: ray.e, d: refractionD });

				//Run Recursive RayTrace
				object.rayIntersect(refracted);
				if (refracted.intersectedObject) refracted = new _lib.Ray({ e: refracted.lowestIntersectPoint, d: ray.d });

				refraction = this.raytrace(refracted, recursion + 1, object, objList, lightList); //Detect object
			}

			return {
				r: refraction.r,
				g: refraction.g,
				b: refraction.b,
				a: 255
			};
		}
	}]);

	return Raytracer;
}();

exports.default = Raytracer;

},{"./lib":9,"./objects":15,"synthetic-webworker":16}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = init;

var _canvas2dFramework = require("canvas-2d-framework");

var _canvas2dFramework2 = _interopRequireDefault(_canvas2dFramework);

var _Raytracer = require("./Raytracer.js");

var _Raytracer2 = _interopRequireDefault(_Raytracer);

var _objects = require("./objects");

var _lib = require("./lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
	//Canvas
	window.canvas2D = new _canvas2dFramework2.default({
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
	window.onload = function () {
		//Camera
		var camera = new _lib.Camera({
			position: { x: 2, y: 2, z: 1.25, h: 1 },
			gaze: { x: 0, y: 0, z: 0, h: 1 },
			width: canvas2D.width,
			height: canvas2D.height,
			viewingAngle: 60,
			world: null,
			noPipe: true
		});

		//Scene Object Defs

		//World List
		var world = new _lib.World({ camera: camera });
		// world.push(camera);

		// var scale = 0.1;
		// var scaleF = 0.01;
		// var jitter = 0.1
		// var xsphere = 0.5;
		// var ysphere = 0.5;
		// var zsphere = 1;
		// var fsphere = 0.25;

		//Scale of Sphere
		var scale = 0.10;
		//Scale of jitter of scale
		var scaleF = 0;
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
		//color jitter
		var cjitter = 1;

		for (var i = -xsphere; i <= xsphere; i = i + fsphere) {
			for (var j = -ysphere; j <= ysphere; j = j + fsphere) {
				for (var k = 0; k <= zsphere; k = k + fsphere) {
					console.log("Making sphere at x:" + i + " y:" + j);

					var sfact = scale * (Math.random() * scaleF + (1 - scaleF));
					var cfactr = 255 * (Math.random() * cjitter + (1 - cjitter));
					var cfactg = 255 * (Math.random() * cjitter + (1 - cjitter));
					var cfactb = 255 * (Math.random() * cjitter + (1 - cjitter));
					var x = i + (Math.random() * jitter - jitter);
					var y = j + (Math.random() * jitter - jitter);
					var z = k + (Math.random() * jitter - jitter);
					var pipe = [_lib.Math3D.translate(x, y, z), _lib.Math3D.scale(sfact, sfact, sfact)];
					// let mat = Math3D.transformPipe(pipe);
					// console.log(mat);

					world.addObject(new _objects.Sphere({
						baseC: { r: cfactr, g: cfactg, b: cfactb, a: 255 },
						specularC: { r: 255, g: 255, b: 255, a: 255 },
						diffuseFactor: 0.8,
						reflectionFactor: 0.1,
						transform: _lib.Math3D.transformPipe(pipe)
					})); //Create Generic Sphere
				}
			}
		}

		world.addObject(new _objects.Sphere({
			baseC: { r: 255, g: 255, b: 255, a: 255 },
			specularC: { r: 255, g: 255, b: 255, a: 255 },
			reflectionFactor: 0.5,
			diffuseFactor: 0.4,
			transform: _lib.Math3D.transformPipe([_lib.Math3D.translate(0, 0, 0.5), _lib.Math3D.scale(0.25, 0.25, 0.25)])
		})); //Create Generic Sphere

		var floor = new _objects.Plane({
			baseC: { r: 100, g: 100, b: 100, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0.2,
			transform: _lib.Math3D.transformPipe([_lib.Math3D.translate(0, 0, -0.25), _lib.Math3D.scale(10, 10, 10)]),
			restricted: true
		});
		world.addObject(floor);

		var wall1 = new _objects.Plane({
			baseC: { r: 200, g: 200, b: 50, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0,
			transform: _lib.Math3D.transformPipe([_lib.Math3D.translate(-4, -4, 0), _lib.Math3D.scale(10, 10, 10), _lib.Math3D.rotateOnArbitrary(Math.PI / 2, { x: 0, y: 1, z: 0, h: 1 })])
		});
		// world.addObject(wall1);

		var wall2 = new _objects.Plane({
			baseC: { r: 200, g: 50, b: 50, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0,
			transform: _lib.Math3D.transformPipe([_lib.Math3D.translate(-4, -4, 0), _lib.Math3D.scale(10, 10, 10), _lib.Math3D.rotateOnArbitrary(-Math.PI / 2, { x: 1, y: 0, z: 0, h: 1 })])
		});
		// world.addObject(wall2);

		var wall3 = new _objects.Plane({
			baseC: { r: 50, g: 200, b: 50, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0,
			transform: _lib.Math3D.transformPipe([_lib.Math3D.translate(4, 4, 0), _lib.Math3D.scale(10, 10, 10), _lib.Math3D.rotateOnArbitrary(-Math.PI / 2, { x: 0, y: 1, z: 0, h: 1 })])
		});
		// world.addObject(wall3);

		var wall4 = new _objects.Plane({
			baseC: { r: 50, g: 50, b: 200, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0,
			transform: _lib.Math3D.transformPipe([_lib.Math3D.translate(4, 4, 0), _lib.Math3D.scale(10, 10, 10), _lib.Math3D.rotateOnArbitrary(Math.PI / 2, { x: 1, y: 0, z: 0, h: 1 })])
		});
		// world.addObject(wall4);

		var cieling = new _objects.Plane({
			baseC: { r: 50, g: 50, b: 50, a: 255 },
			diffuseFactor: 0.8,
			specularFactor: 0.1,
			reflectionFactor: 0,
			transform: _lib.Math3D.transformPipe([_lib.Math3D.translate(0, 0, 9), _lib.Math3D.scale(10, 10, 10), _lib.Math3D.rotateOnArbitrary(Math.PI, { x: 0, y: 0, z: 1, h: 1 })])
		});
		// world.addObject(cieling);

		var olight = new _objects.OmniLight({
			intensity: 2.5,
			source: { x: -2, y: -1, z: 3, h: 1 }
		}); //Create an OmniLight

		world.addLight(olight);

		// Setup Raytracer and Kick it off
		var raytracer = new _Raytracer2.default({
			world: world,
			pixelRenderer: window.canvas2D
		});

		console.log(raytracer);

		setTimeout(function () {
			return raytracer.render();
		}, 2000); //Do this in a timeout to allow page to finish loading...

		var resizeTimer;
		window.onresize = function () {
			raytracer.stop();
			if (resizeTimer) clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				return raytracer.render();
			}, 100);
		};
	};
};

},{"./Raytracer.js":3,"./lib":9,"./objects":15,"canvas-2d-framework":1}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Camera = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Math3D = require("./Math3D");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var Camera = exports.Camera = function () {
	function Camera(config) {
		_classCallCheck(this, Camera);

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
			var nP = _Math3D.Math3D.vectorizePoints(this.g, this.e);
			var nPmag = 1 / _Math3D.Math3D.magnitudeOfVector(nP);
			this.n = _Math3D.Math3D.scalarMultiply(nP, nPmag);

			//Compute Vector u (+y axis = up)
			var pP = { x: 0, y: 0, z: 1, h: 0 };
			this.u = _Math3D.Math3D.crossProduct(pP, this.n);
			//this.u = Math3D.scalarMultiply(this.u,-1);

			//Compute Vector v
			this.v = _Math3D.Math3D.crossProduct(this.n, this.u);

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


	_createClass(Camera, [{
		key: "moveU",
		value: function moveU(mag) {
			var motion = _Math3D.Math3D.scalarMultiply(this.u, mag);
			this.e = _Math3D.Math3D.addPoints(motion, this.e);
			this.updateMatrixPipe();
		}

		/**
   * Moves camera along V Axis
   * @param  {Number} mag Magnitude to move
   */

	}, {
		key: "moveV",
		value: function moveV(mag) {
			var motion = _Math3D.Math3D.scalarMultiply(this.v, mag);
			this.e = _Math3D.Math3D.addPoints(motion, this.e);
			this.updateMatrixPipe();
		}

		/**
   * Moves camera along N Axis
   * @param  {Number} mag Magnitude to move
   */

	}, {
		key: "moveN",
		value: function moveN(mag) {
			var motion = _Math3D.Math3D.scalarMultiply(this.n, mag);
			this.e = _Math3D.Math3D.addPoints(motion, this.e);
			this.updateMatrixPipe();
		}

		/**
   * Rotates camera along U Axis
   * @param  {Number} mag Magnitude to rotate (degrees)
   */

	}, {
		key: "rotateU",
		value: function rotateU(mag) {
			var rotate = _Math3D.Math3D.rotateOnArbitrary(mag, this.u);
			this.v = multiplyMatrixWithVector(rotate, this.v);
			this.n = multiplyMatrixWithVector(rotate, this.n);
		}

		/**
   * Rotates camera along V Axis
   * @param  {Number} mag Magnitude to rotate (degrees)
   */

	}, {
		key: "rotateV",
		value: function rotateV(mag) {
			var rotate = _Math3D.Math3D.rotateOnArbitrary(mag, this.v);
			this.u = multiplyMatrixWithVector(rotate, this.u);
			this.n = multiplyMatrixWithVector(rotate, this.n);
		}

		/**
   * Rotates camera along N Axis
   * @param  {Number} mag Magnitude to rotate (degrees)
   */

	}, {
		key: "rotateN",
		value: function rotateN(mag) {
			var rotate = _Math3D.Math3D.rotateOnArbitrary(mag, this.n);
			this.u = multiplyMatrixWithVector(rotate, this.u);
			this.v = multiplyMatrixWithVector(rotate, this.v);
		}

		/**
   * Updates the Matrix Pipe for the camera
   * Pipe is currently untested
   */

	}, {
		key: "updateMatrixPipe",
		value: function updateMatrixPipe() {
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

				var mid = _Math3D.Math3D.multiplyMatrices(this.WS2T2, this.S1T1Mp);
				if (this.debug) {
					console.log(matrixToString(mid));
				}

				this.matrixPipe = _Math3D.Math3D.multiplyMatrices(mid, this.Mv);
				if (this.debug) {
					console.log(matrixToString(this.matrixPipe));
				}
			}
		}
	}, {
		key: "computeWS2T2",
		value: function computeWS2T2() {
			var data = _Math3D.Math3D.initMatrix();

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
	}, {
		key: "computeS1T1Mp",
		value: function computeS1T1Mp() {
			var data = _Math3D.Math3D.initMatrix();

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
	}, {
		key: "computeMv",
		value: function computeMv() {
			var data = _Math3D.Math3D.initMatrix();

			//Localize Vars
			var u = this.u;var v = this.v;var n = this.n;var e = this.e;

			//Setup matrix array
			data[0][0] = u.x;data[0][1] = u.y;data[0][2] = u.z;data[0][3] = -_Math3D.Math3D.dotProduct(e, u);
			data[1][0] = v.x;data[1][1] = v.y;data[1][2] = v.z;data[1][3] = -_Math3D.Math3D.dotProduct(e, v);
			data[2][0] = n.x;data[2][1] = n.y;data[2][2] = n.z;data[2][3] = -_Math3D.Math3D.dotProduct(e, n);
			data[3][0] = 0;data[3][1] = 0;data[3][2] = 0;data[3][3] = 1;

			return data;
		}
	}]);

	return Camera;
}();

},{"./Math3D":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.matrixInversionTest = matrixInversionTest;
exports.matrixToString = matrixToString;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var Math3D = exports.Math3D = function () {
	function Math3D() {
		_classCallCheck(this, Math3D);
	}

	_createClass(Math3D, null, [{
		key: "transformPipe",
		value: function transformPipe(matrixPipe) {
			var data = Matrices3D.I;

			for (var i = 0; i < matrixPipe.length; i++) {
				data = Math3D.multiplyMatrices(data, matrixPipe[i]);
			}

			return data;
		}
	}, {
		key: "scale",
		value: function scale(xf, yf, zf) {
			var data = Math3D.initMatrix(4, 4);

			//Setup Scale Matrix
			data[0][0] = xf;data[0][1] = 0;data[0][2] = 0;data[0][3] = 0;
			data[1][0] = 0;data[1][1] = yf;data[1][2] = 0;data[1][3] = 0;
			data[2][0] = 0;data[2][1] = 0;data[2][2] = zf;data[2][3] = 0;
			data[3][0] = 0;data[3][1] = 0;data[3][2] = 0;data[3][3] = 1;

			return data;
		}
	}, {
		key: "translate",
		value: function translate(x, y, z) {
			var data = Math3D.initMatrix(4, 4);

			//Setup Scale Matrix
			data[0][0] = 1;data[0][1] = 0;data[0][2] = 0;data[0][3] = x;
			data[1][0] = 0;data[1][1] = 1;data[1][2] = 0;data[1][3] = y;
			data[2][0] = 0;data[2][1] = 0;data[2][2] = 1;data[2][3] = z;
			data[3][0] = 0;data[3][1] = 0;data[3][2] = 0;data[3][3] = 1;

			return data;
		}
	}, {
		key: "rotateOnArbitrary",
		value: function rotateOnArbitrary(rad, axis) {
			//Preconfig
			var cos = Math.cos(rad);
			var sin = Math.sin(rad);
			var v = Math3D.normalizeVector(axis);

			var data = Math3D.initMatrix(4, 4);

			//Setup Jv Matrix
			data[0][0] = 0;data[0][1] = -v.z;data[0][2] = v.y;data[0][3] = 0;
			data[1][0] = v.z;data[1][1] = 0;data[1][2] = -v.x;data[1][3] = 0;
			data[2][0] = -v.y;data[2][1] = v.x;data[2][2] = 0;data[2][3] = 0;
			data[3][0] = 0;data[3][1] = 0;data[3][2] = 0;data[3][3] = 1;

			var R = Math3D.addMatrix(Matrices3D.I, Math3D.addMatrix(Math3D.scalarMultiplyMatrix(data, sin), Math3D.scalarMultiplyMatrix(Math3D.multiplyMatrices(data, data), 1 - cos)));

			return R;
		}

		/**
   * Vectorizes two points
   * @param  {{x:Number, y:Number, z:Number, h:Number}} pointA	The start point
   * @param  {{x:Number, y:Number, z:Number, h:Number}} pointB	The end point
   * @return {{x:Number, y:Number, z:Number, h:Number}} 			The Vector represented by these two points
   */

	}, {
		key: "vectorizePoints",
		value: function vectorizePoints(pointA, pointB) {
			var v = Math3D.subtractPoints(pointA, pointB);
			v.h = 0;
			return v;
		}

		/**
   * Compute the cross product of two vectors
   * @param  {{x:Number, y:Number, z:Number, h:Number}} a	Vector A
   * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Vector B
   * @return {{x:Number, y:Number, z:Number, h:Number}} 	The Crossproduct Resultant
   */

	}, {
		key: "crossProduct",
		value: function crossProduct(a, b) {
			return {
				x: a.y * b.z - a.z * b.y,
				y: a.z * b.x - a.x * b.z,
				z: a.x * b.y - a.y * b.x,
				h: 0.0
			};
		}

		/**
   * Compute the dot product of two vectors
   * @param  {{x:Number, y:Number, z:Number, h:Number}} a	Vector A
   * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Vector B
   * @return {Number} 									The Crossproduct Resultant
   */

	}, {
		key: "dotProduct",
		value: function dotProduct(a, b) {
			return a.x * b.x + a.y * b.y + a.z * b.z + a.h * b.h;
		}

		/**
   * Scalar Multiply a point of vector
   * @param  {{x:Number, y:Number, z:Number, h:Number}} v  	The point or vector to multiple
   * @param  {{x:Number, y:Number, z:Number, h:Number}} mag	The magnitude to multiple
   * @return {{x:Number, y:Number, z:Number, h:Number}}     	The new point
   */

	}, {
		key: "scalarMultiply",
		value: function scalarMultiply(v, mag) {
			return {
				x: v.x * mag,
				y: v.y * mag,
				z: v.z * mag,
				h: v.h * mag
			};
		}

		/**
   * Compute the magnitude of a Vecotr
   * @param  {{x:Number, y:Number, z:Number, h:Number}} v	The vector to find the magnitude of
   * @return {Number}        								The Magnitude
   */

	}, {
		key: "magnitudeOfVector",
		value: function magnitudeOfVector(v) {
			return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z + v.h * v.h);
		}

		/**
   * Adds two points A+B
   * @param  {{x:Number, y:Number, z:Number, h:Number}} a	First point to add 
   * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Second point to add
   * @return {{x:Number, y:Number, z:Number, h:Number}} 	The resultant point
   */

	}, {
		key: "addPoints",
		value: function addPoints(a, b) {
			return {
				x: a.x + b.x,
				y: a.y + b.y,
				z: a.z + b.z,
				h: a.h + b.h
			};
		}

		/**
   * Adds two vectors A+B
   * @param  {{x:Number, y:Number, z:Number, h:Number}} a	First vector to add 
   * @param  {{x:Number, y:Number, z:Number, h:Number}} b	Second vector to add
   * @return {{x:Number, y:Number, z:Number, h:Number}} 	The resultant vector
   */

	}, {
		key: "addVectors",
		value: function addVectors(a, b) {
			return Math3D.addPoints(a, b);
		}

		/**
   * Subtracts two points A-B
   * @param  {{x:Number, y:Number, z:Number, h:Number}} a	The point to subtract from
   * @param  {{x:Number, y:Number, z:Number, h:Number}} b	The point being substracted from a
   * @return {{x:Number, y:Number, z:Number, h:Number}} 	The resultant point
   */

	}, {
		key: "subtractPoints",
		value: function subtractPoints(a, b) {
			return {
				x: a.x - b.x,
				y: a.y - b.y,
				z: a.z - b.z,
				h: 1.0
			};
		}
	}, {
		key: "normalizeVector",
		value: function normalizeVector(v) {
			var out = {};
			var mag = Math3D.magnitudeOfVector(v);
			out = Math3D.scalarMultiply(v, 1 / mag);

			return out;
		}

		/**
   * Initializes a Zeroed 4x4 Matrix
   * @return {Array<Number[]>} The Zeroed Matrix
   */

	}, {
		key: "initMatrix",
		value: function initMatrix(x, y) {
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
				for (var i = 0; i < 4; i++) {
					m.push([0, 0, 0, 0]);
				}
			}
			return m;
		}

		/**
   * Adds two matricies together
   * @param {Array<Number[]>} a	First Matrix to add
   * @param {Array<Number[]>} b	Second Matrix to add
   * @return {Array<Number[]>} 	The Resultant Matrix
   */

	}, {
		key: "addMatrix",
		value: function addMatrix(a, b) {
			var m = this.initMatrix();
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					m[i][j] = a[i][j] + b[i][j];
				}
			}return m;
		}

		/**
   * Scalar Multiples a Matrix by a value
   * @param  {Array<Number[]>} a	The matrix to multiply
   * @param  {Number} mag 		The Scalar Multiple
   * @return {Array<Number[]>}    The Result of the multiplication
   */

	}, {
		key: "scalarMultiplyMatrix",
		value: function scalarMultiplyMatrix(a, mag) {
			var m = this.initMatrix();
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					m[i][j] = a[i][j] * mag;
				}
			}return m;
		}

		/**
   * Multiplies two matricies together
   * @param  {Array<Number[]>} a	First matrix to multiply
   * @param  {Array<Number[]>} b	Second matrix to multiply
   * @return {Array<Number[]>}  	The resultant matrix
   */

	}, {
		key: "multiplyMatrices",
		value: function multiplyMatrices(a, b) {
			var m = this.initMatrix();
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					var v = 0;
					for (var k = 0; k < 4; k++) {
						v += a[i][k] * b[k][j];
					}m[i][j] = v;
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

	}, {
		key: "multiplyVectorByMatrix",
		value: function multiplyVectorByMatrix(m, b) {
			return {
				x: b.x * m[0][0] + b.y * m[0][1] + b.z * m[0][2] + b.h * m[0][3],
				y: b.x * m[1][0] + b.y * m[1][1] + b.z * m[1][2] + b.h * m[1][3],
				z: b.x * m[2][0] + b.y * m[2][1] + b.z * m[2][2] + b.h * m[2][3],
				h: b.x * m[3][0] + b.y * m[3][1] + b.z * m[3][2] + b.h * m[3][3]
			};
		}

		/**
   * Computes a cofactor matrix
   * @param  {Array<Number[]>} 	matrix Input Matrix
   * @param  {Number} row    		The row to cofactor on
   * @param  {Number} col    		The column to cofactor on
   * @return {Array<Number[]>}    The resultant cofactor matrix
   */

	}, {
		key: "matrixCofactor",
		value: function matrixCofactor(matrix, row, col) {
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
		}

		/**
   * Compute the determinate of a Matrix
   * @param  {Array<Number[]>} matrix	The Matrix
   * @return {Number}        			Its Determinate
   */

	}, {
		key: "matrixDeterminate",
		value: function matrixDeterminate(matrix) {
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
		}

		/**
   * Compute the transpose for the Adjugate Matrix
   * @param  {Array<Number[]>} matrix	The Matrix
   * @return {Array<Number[]>} 		The Transpose
   */

	}, {
		key: "matrixPTranspose",
		value: function matrixPTranspose(matrix) {
			var result = this.initMatrix(matrix[0].length, matrix.length);
			for (var i = 0; i < matrix.length; i++) {
				for (var j = 0; j < matrix[0].length; j++) {
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

	}, {
		key: "matrixAdjugate",
		value: function matrixAdjugate(matrix) {
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
		}

		/**
   * Compute the inverse of this Matrix using Crammer's Rule and the Determinate
   * @param  {Array<Number[]>} matrix	The Matrix
   * @return {Array<Number[]>} 		The Inverse of the matrix
   */

	}, {
		key: "matrixInverse",
		value: function matrixInverse(matrix) {
			var det = this.matrixDeterminate(matrix);
			var adj = this.matrixAdjugate(matrix);
			var result = this.scalarMultiplyMatrix(adj, 1 / det);

			return result;
		}
	}]);

	return Math3D;
}();

;

/**
 * A set of predefined Matricies and Functions to build Matricies
 * @type {Object}
 */
var Matrices3D = exports.Matrices3D = {
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

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Ray = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Math3D = require("./Math3D.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Ray Object to contain data for a Ray Intersect List (Now in ES6)
 * @class  Ray
 * @param {Object} config See Constructor
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
var Ray = exports.Ray = function () {
	function Ray(config) {
		_classCallCheck(this, Ray);

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
			var a = _Math3D.Math3D.scalarMultiply(this.n, -this.N);
			this.a = a;

			var bcoeff = this.W * (2 * this.x / (this.camera.width * this.superSampleRate) - 1);
			this.bcoeff = bcoeff;
			var b = _Math3D.Math3D.scalarMultiply(this.u, bcoeff);
			this.b = b;

			var ccoeff = this.H * (2 * this.y / (this.camera.height * this.superSampleRate) - 1);
			this.ccoeff = ccoeff;
			var c = _Math3D.Math3D.scalarMultiply(this.v, ccoeff);
			this.c = c;

			this.d = _Math3D.Math3D.addVectors(_Math3D.Math3D.addVectors(a, b), c);
		}

		//Object Point to Target Point Constructor
		else if (config.objectPoint && config.targetPoint) {
				this.e = objectPoint;
				this.d = _Math3D.Math3D.vectorizePoints(objectPoint, targetPoint);
				this.d = _Math3D.Math3D.scalarMultiply(this.d, 1 / _Math3D.Math3D.magnitudeOfVector(this.d));
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

		if (config.targetPoint) this.tThreshold = -this.rayDetect(config.targetPoint);else this.tThreshold = -Infinity;

		// console.log(this.tThreshold);

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


	_createClass(Ray, [{
		key: "addIntersect",
		value: function addIntersect(config) {
			// console.log(config.t);
			if (config.obj != this.exclusionObj && config.t != 0 && config.t > this.tThreshold + 1) //Skip 0
				if (config.t && config.obj) {
					var dt = _Math3D.Math3D.scalarMultiply(this.d, config.t);
					var intersect = _Math3D.Math3D.addPoints(this.e, dt);
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

	}, {
		key: "rayDetect",
		value: function rayDetect(point) {
			var t = 0;
			if (this.d.x != 0) {
				t = point.x - this.e.x / this.d.x;
			} else {
				if (this.d.y != 0) {
					t = point.y - this.e.y / this.d.y;
				} else {
					if (this.d.z != 0) {
						t = point.z - this.e.z / this.d.z;
					}
				}
			}

			return t;
		}
	}]);

	return Ray;
}();

},{"./Math3D.js":6}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.World = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objects = require("../objects");

var _ = require(".");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Ray Object to contain data for a Ray Intersect List (Now in ES6)
 * @class  World
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2018/06)
 * @license MIT
 */
var World = exports.World = function () {
    /**
     * Instantiate a World Object
     * @param {{camera:Camera}} config The Configuration Object for this world including the default camera
     */
    function World(config) {
        _classCallCheck(this, World);

        if (config.camera) this.camera = config.camera;

        this.objects = [];
        this.lights = [];
    }

    /**
     * Add an object to the World
     * @param {GenericObject} object 
     */


    _createClass(World, [{
        key: "addObject",
        value: function addObject(object) {
            if (!object instanceof _objects.GenericObject) throw "Error Inavlid Object Type passed to World.addObject";
            this.objects.push(object);
        }

        /**
         * Add a light to the World
         * @param {Light} light 
         */

    }, {
        key: "addLight",
        value: function addLight(light) {
            if (!light instanceof _objects.Light) throw "Error Invald Light Type passed to World.addLight";
            this.lights.push(light);
        }

        /**
         * Get the World Camera
         * @returns {Camera} The World Camera
         */

    }, {
        key: "getCamera",
        value: function getCamera() {
            return this.camera;
        }

        /**
         * Get the Object List for this World
         * @returns {[GenericObject]} A List of GenericObjects
         */

    }, {
        key: "getObjects",
        value: function getObjects() {
            return this.objects;
        }

        /**
         * Get the Light List for this World
         * @returns {[Light]} A List of Lights
         */

    }, {
        key: "getLights",
        value: function getLights() {
            return this.lights;
        }
    }]);

    return World;
}();

},{".":9,"../objects":15}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Camera = require("./Camera.js");

Object.keys(_Camera).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Camera[key];
    }
  });
});

var _Ray = require("./Ray.js");

Object.keys(_Ray).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Ray[key];
    }
  });
});

var _Math3D = require("./Math3D.js");

Object.keys(_Math3D).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Math3D[key];
    }
  });
});

var _World = require("./World.js");

Object.keys(_World).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _World[key];
    }
  });
});

},{"./Camera.js":5,"./Math3D.js":6,"./Ray.js":7,"./World.js":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GenericObject = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lib = require("../lib");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Generic Object is the abstract 3DObject Definition for Raytracer-JS (Now in ES6)
 * @class  GenericObject
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
var GenericObject = exports.GenericObject = function () {
	function GenericObject(config) {
		_classCallCheck(this, GenericObject);

		if (config) for (var key in config) {
			this[key] = config[key];
		}if (!this.baseC) this.baseC = { r: 255, g: 255, b: 255, a: 255 };
		if (!this.ambientC) this.ambientC = this.baseC;
		if (!this.diffuseC) this.diffuseC = this.baseC;
		if (!this.specularC) this.specularC = this.baseC;

		if (!this.ambientFactor) this.ambientFactor = 0.0;
		if (!this.diffuseFactor) this.diffuseFactor = 0.2;
		if (!this.specularFactor) this.specularFactor = 0.5;
		if (!this.reflectionFactor) this.reflectionFactor = 0.6;
		if (!this.refractionFactor) this.refractionFactor = 0.0;
		if (!this.specularFalloff) this.specularFalloff = 40;
		if (!this.refractionIndex) this.refractionIndex = 1.0;

		if (!this.opacity) this.opacity = 1.0;

		if (!this.transform) {
			this.transform = _lib.Matrices3D.I;
			this.transformInverse = _lib.Matrices3D.I;
		} else {
			this.transformInverse = _lib.Math3D.matrixInverse(this.transform);
		}

		if (!this.UVMap) this.UVMap = null;
	}

	/**
  * Sets the transform on this Generic Object
  * @param {Array{Array{}}} transform The Transform
  */


	_createClass(GenericObject, [{
		key: "setTransform",
		value: function setTransform(transform) {
			this.transform = transform;
			this.transformInverse = _lib.Math3D.matrixInverse(this.transform);
		}

		//Abstract Methods
		/**
   * Ray Intersect the Object to see if it is in the Rays path.
   * @param  {Ray} ray The ray to intersect
   */

	}, {
		key: "rayIntersect",
		value: function rayIntersect(ray) {}
	}, {
		key: "getNormalAt",


		/**
   * Compute the normal vector relative to a specific point (prefrably on the surface)
   * @param  {Object{x,y,z,h}} point The Point to compute at
   * @return {Object{x,y,z,h}}       The Normal Vector
   */
		value: function getNormalAt(point) {}
	}, {
		key: "getUVMapAt",


		/**
   * Get the UVMap Color at a point on the surface
   * @param  {Object{x,y,z,h}} point The Point to compute at
   * @return {Object{r,g,b,a}}       The Color of the UVMap pixel
   */
		value: function getUVMapAt(point) {}
	}]);

	return GenericObject;
}();

},{"../lib":9}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var Light = exports.Light = function Light(config) {
	_classCallCheck(this, Light);

	if (config.color) this.color = config.color;else this.color = { r: 255, g: 255, b: 255, a: 255 };
	if (config.intensity) this.intensity = config.intensity;else this.inensity = 1.0;
};

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OmniLight = undefined;

var _Light2 = require("./Light.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var OmniLight = exports.OmniLight = function (_Light) {
  _inherits(OmniLight, _Light);

  function OmniLight(config) {
    _classCallCheck(this, OmniLight);

    var _this = _possibleConstructorReturn(this, (OmniLight.__proto__ || Object.getPrototypeOf(OmniLight)).call(this, config));

    if (config.source) _this.source = config.source;else throw "Please define source in config for OmniLight";
    return _this;
  }

  return OmniLight;
}(_Light2.Light);

},{"./Light.js":11}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Plane = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GenericObject2 = require("./GenericObject.js");

var _lib = require("../lib");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Plane is a Generic Object Plane Definition for Raytracer-JS (Now in ES6)
 * @class  Plane
 * 
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
var Plane = exports.Plane = function (_GenericObject) {
	_inherits(Plane, _GenericObject);

	function Plane(config) {
		_classCallCheck(this, Plane);

		var _this = _possibleConstructorReturn(this, (Plane.__proto__ || Object.getPrototypeOf(Plane)).call(this, config));

		if (config.restricted) _this.restricted = config.restricted;
		return _this;
	}

	/**
  * Ray Intersect the Object to see if it is in the Rays path.
  * @param  {Ray} ray The ray to intersect
  */


	_createClass(Plane, [{
		key: "rayIntersect",
		value: function rayIntersect(ray) {
			//Ray computation
			var eRay = ray.e;
			var dRay = ray.d;
			var e = _lib.Math3D.multiplyVectorByMatrix(this.transformInverse, eRay);
			var d = _lib.Math3D.multiplyVectorByMatrix(this.transformInverse, dRay);
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

	}, {
		key: "getNormalAt",
		value: function getNormalAt(point) {
			var norm = { x: 0, y: 0, z: -1, h: 1 };
			norm = _lib.Math3D.multiplyVectorByMatrix(this.transform, norm);
			return norm;
		}

		/**
   * Get the UVMap Color at a point on the surface
   * @param  {Object{x,y,z,h}} point The Point to compute at
   * @return {Object{r,g,b,a}}       The Color of the UVMap pixel
   */

	}, {
		key: "getUVMapAt",
		value: function getUVMapAt(point) {
			return { r: 0, g: 0, b: 0, a: 0 }; //Not Implemented Yet
		}
	}]);

	return Plane;
}(_GenericObject2.GenericObject);

},{"../lib":9,"./GenericObject.js":10}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Sphere = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GenericObject2 = require("./GenericObject.js");

var _lib = require("../lib");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**import {Math3D, Matricies3D} from "../static/Math3D.js";
 * Sphere is a Generic Object Sphere Definition for Raytracer-JS (Now in ES6)
 * @class  Sphere
 *
 * @author  James Wake (SparkX120)
 * @version 0.1 (2015/08)
 * @license MIT
 */
var Sphere = exports.Sphere = function (_GenericObject) {
	_inherits(Sphere, _GenericObject);

	function Sphere(config) {
		_classCallCheck(this, Sphere);

		return _possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this, config));
	}

	/**
  * Ray Intersect the Object to see if it is in the Rays path.
  * @param  {Ray} ray The ray to intersect
  */


	_createClass(Sphere, [{
		key: "rayIntersect",
		value: function rayIntersect(ray) {
			//Ray computation
			var eRay = ray.e;
			var dRay = ray.d;
			var e = _lib.Math3D.multiplyVectorByMatrix(this.transformInverse, eRay);
			var d = _lib.Math3D.multiplyVectorByMatrix(this.transformInverse, dRay);
			//d = Math3D.scalarMultiply(d, -1);
			var eVec = { x: e.x, y: e.y, z: e.z, h: 0 };

			//define Spherical Geometry Intersection here
			var magD = _lib.Math3D.magnitudeOfVector(d);
			var magE = _lib.Math3D.magnitudeOfVector(eVec);

			var a = magD * magD;
			var b = _lib.Math3D.dotProduct(e, d);
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

	}, {
		key: "getNormalAt",
		value: function getNormalAt(point) {
			var p = _lib.Math3D.multiplyVectorByMatrix(this.transformInverse, point);
			var norm = { x: -p.x, y: -p.y, z: -p.z, h: 0 };
			norm = _lib.Math3D.normalizeVector(norm);
			norm = _lib.Math3D.multiplyVectorByMatrix(this.transform, norm);
			return norm;
		}

		/**
   * Get the UVMap Color at a point on the surface
   * @param  {Object{x,y,z,h}} point The Point to compute at
   * @return {Object{r,g,b,a}}       The Color of the UVMap pixel
   */

	}, {
		key: "getUVMapAt",
		value: function getUVMapAt(point) {
			return { r: 0, g: 0, b: 0, a: 0 }; //Not Implemented Yet
		}
	}]);

	return Sphere;
}(_GenericObject2.GenericObject);

},{"../lib":9,"./GenericObject.js":10}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _GenericObject = require("./GenericObject.js");

Object.keys(_GenericObject).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _GenericObject[key];
    }
  });
});

var _Light = require("./Light.js");

Object.keys(_Light).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Light[key];
    }
  });
});

var _OmniLight = require("./OmniLight.js");

Object.keys(_OmniLight).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _OmniLight[key];
    }
  });
});

var _Plane = require("./Plane.js");

Object.keys(_Plane).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Plane[key];
    }
  });
});

var _Sphere = require("./Sphere.js");

Object.keys(_Sphere).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Sphere[key];
    }
  });
});

},{"./GenericObject.js":10,"./Light.js":11,"./OmniLight.js":12,"./Plane.js":13,"./Sphere.js":14}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Synthetic Worker Class
 * 
 * Alows a worker to be made without an external file.
 * 
 * workfunc is the body of the onmessage listener in the worker
 * onMsg is the parents listener for postedMessages from your workfunc
 * 
 * please terminate the worker when it finishes.
 * 
 * @author  James Wake (SparkX120)
 * @version 0.0.5 (2017/12)
 * @license MIT
 */
var SyntheticWorker = function () {
    function SyntheticWorker(workerfunc, onMsg) {
        _classCallCheck(this, SyntheticWorker);

        var funcStr = workerfunc.toString();

        if (funcStr.indexOf("function") == 0) {
            //Fix for next Fix for when Compiled
            funcStr = funcStr.replace("function", "");
        }
        if (funcStr.indexOf("prototype.") >= 0) {
            //Fix for IE when not Compiled
            funcStr = funcStr.replace("prototype.", "");
        }
        // Make a worker from an anonymous function body that instantiates the workerFunction as an onmessage callback
        var blob = new Blob(['(function(global) { global.addEventListener(\'message\', function(e) {', 'var cb = function ', funcStr, ';', 'cb(e)', '}, false); } )(this)'], { type: 'application/javascript' });
        this.blobURL = URL.createObjectURL(blob); //Generate the Blob URL

        this.worker = new Worker(this.blobURL);
        // Cleanup
        this.worker.onmessage = function (e) {
            if (e.data.term) worker.terminate();else if (onMsg) onMsg(e);
        };
    }

    _createClass(SyntheticWorker, [{
        key: "terminate",
        value: function terminate() {
            if (this.worker) {
                this.worker.terminate();
                URL.revokeObjectURL(this.blobURL);
            }
        }
    }, {
        key: "postMessage",
        value: function postMessage(msg) {
            if (this.worker) this.worker.postMessage(msg);
        }
    }]);

    return SyntheticWorker;
}();

exports.default = SyntheticWorker;

},{}]},{},[2]);
