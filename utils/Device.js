import React from 'react';
import {Dimensions, Alert} from 'react-native'

//Tablet portrait dimensuions
    const tablet = {
        width: 552,
        height: 960
    };

class Device {

    getPortraitDimensions() {
        const {width, height} = Dimensions.get("window");
    
        return {
            width: Math.min(width, height),
            height: Math.max(width, height)
        };
    }

    getLandscapeDimensions() {
        const {width, height} = Dimensions.get("window");
        console.log(width, height)
    
        return {
            width: Math.max(width, height),
            height: Math.min(width, height)
        };
    }

    isPhone() {
        const dimensions = this.getPortraitDimensions();
        return dimensions.height > tablet.height;
    } 

    isTablet() {
        const dimensions = this.getPortraitDimensions();
        return dimensions.height >= tablet.height;
    } 
}

const device = new Device();
export default device;