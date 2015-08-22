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
class Light{
	constructor(config){
		if(config.color)
			this.color = config.color;
		else
			this.color = {r:255,g:255,b:255,a:255}
		if(config.intensity)
			this.intensity = config.intensity;
		else
			this.inensity = 1.0;
	}
}