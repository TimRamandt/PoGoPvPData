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

function showTeams(startIndex) {
    checkIfTeamsAreIninted();
    var requestedUserTeams = new Array(); 

    for(var i = getLastIndex(userTeams); i > -1; i--) {
        var userTeamIndex = parseInt(userTeams[i]) 
        console.log(userTeamIndex < startIndex, startIndex, userTeamIndex)
        if(userTeamIndex < startIndex) {
            requestedUserTeams.push(data[userTeamIndex].split(":")[1]) 
        }
    }

    return requestedUserTeams;

    /*if(lastUserTeam < startIndex) {
        console.log("okkkkkkkkkkkkkkkkk")
        //means we have the lastest day
        if (userTeams[lastIndexTeams] < startOfDays[startOfDay]) {
            console.log("heyyyyyyyyyyyyyyy")
            //means we are using a team from the previous day
            return data[lastUserTeam].split(":")[1] 
        }
    }*/
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