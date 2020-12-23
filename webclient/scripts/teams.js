export {showTeams, initTeams}

var startOfDays = [];
var userTeams = [];
var leagueSwitchs = [];
var data = []

function initTeams(dataObject) {
    var indexes = dataObject.indexes; 
    startOfDays = indexes.startOfDay;
    userTeams = indexes.teamIndexes;
    leagueSwitchs = indexes.leagueSwitchIndexes;
    data = dataObject.data;
}

function showTeams(start, end) {
    checkIfTeamsAreIninted();
    var requestedUserTeams = new Array(); 

    var startValue = start

    start = lookUpIndex(start+1, userTeams)
    //check if the next line is a team switch otherwise we'd have to go back to the previous line
    if (start === -1) {
        start = getNearestPriorToStart(startValue, userTeams);
    }

    if(end == undefined) {
        end = getLastIndex(userTeams); 
    }

    for(var i = start; i < end+1; i++) {
        var teamIndex = parseInt(userTeams[i])
        requestedUserTeams.push(data[teamIndex].split(":")[1].trim())     
    }

    return requestedUserTeams;
}

function getNearestPriorToStart(start, array) {
    if(array.length < 1) {
        return 0;
    }

    var nearLeftIndex = 0;
    for(var i = 0; i < array.length; i++) {
        if (parseInt(array[i]) < start) {
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

function checkIfTeamsAreIninted() {
    if (startOfDays === undefined) {
        console.log("ERR: Need to call the initTeam function first to run this module!")
    }
}

function lookUpIndex(value, array) {
    for(var i = 0; i < array.length; i++) {
        if(parseInt(array[i]) === value) {
            return i;
        }
    }

    return -1;
}