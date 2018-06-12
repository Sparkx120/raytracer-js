import { GenericObject, Light } from "../objects";
import { Camera } from ".";

/**
 * Ray Object to contain data for a Ray Intersect List (Now in ES6)
 * @class  World
 * 
 * @author  James Wake (SparkX120)
 * @version 0.1 (2018/06)
 * @license MIT
 */
export class World{
    /**
     * Instantiate a World Object
     * @param {{camera:Camera}} config The Configuration Object for this world including the default camera
     */
    constructor(config){
        if(config.camera)
            this.camera = config.camera
        
        this.objects    = [];
        this.lights     = [];
    }

    /**
     * Add an object to the World
     * @param {GenericObject} object 
     */
    addObject(object){
        if(! object instanceof GenericObject)
            throw "Error Inavlid Object Type passed to World.addObject";
        this.objects.push(object);
    }

    /**
     * Add a light to the World
     * @param {Light} light 
     */
    addLight(light){
        if(! light instanceof Light)
            throw "Error Invald Light Type passed to World.addLight"
        this.lights.push(light);
    }

    /**
     * Get the World Camera
     * @returns {Camera} The World Camera
     */
    getCamera(){
        return this.camera;
    }

    /**
     * Get the Object List for this World
     * @returns {[GenericObject]} A List of GenericObjects
     */
    getObjects(){
        return this.objects;
    }

    /**
     * Get the Light List for this World
     * @returns {[Light]} A List of Lights
     */
    getLights(){
        return this.lights;
    }
}