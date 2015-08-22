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
class OmniLight extends Light{
	constructor(config){
		super(config);
		if(config.source)
			this.source = config.source
		else
			throw "Please define source in config for OmniLight";
	}
}