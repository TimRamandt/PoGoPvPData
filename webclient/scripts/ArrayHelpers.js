export {getNearestPriorToValue, lookUpValue}

function getNearestPriorToValue(value, array) {
    //TO DO: Binary search
    if(array.length < 1) {
        return 0;
    }

    var nearLeftIndex = 0;
    for(var i = 0; i < array.length; i++) {
        if (parseInt(array[i]) < value) {
            nearLeftIndex = i;
        } else {
            return nearLeftIndex;
        }
    }

    return getLastIndex(array); 
}

function getLastIndex(array) {
    if ((array.length - 1) < 0) {
        return 0;
    } 
    return array.length - 1;
}

function lookUpValue(value, array) {
    //TO DO: Binary search
    for(var i = 0; i < array.length; i++) {
        if(parseInt(array[i]) === value) {
            return i;
        }
    }

    return -1;
}