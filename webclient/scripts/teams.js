export {showTeams, initTeams}

var startOfDayIndexes = [];
var teamSwitchIndexes = [];
var leagueSwitchIndexes = [];
var data = []

function initTeams(dataObject) {
    var indexes = dataObject.indexes; 
    startOfDayIndexes = indexes.startOfDay;
    teamSwitchIndexes = indexes.teamIndexes;
    leagueSwitchIndexes = indexes.leagueSwitchIndexes;
    data = dataObject.data;
}

function showTeams(startIndex) {
    checkIfTeamsAreIninted()

    var lastIndexDay = getLastIndex(startOfDayIndexes);
    var lastIndexTeams = getLastIndex(teamSwitchIndexes);
    if(startIndex <= lastIndexDay) {
        //means we have the lastest day
        if (teamSwitchIndexes[lastIndexTeams] < startOfDayIndexes[lastIndexDay]) {
            var lastTeamUsed = parseInt(teamSwitchIndexes[lastIndexTeams]); 
            //means we are using a team from the previous day
            return data[lastTeamUsed].split(":")[1] 
        }
    }
}

function getLastIndex(array) {
    return array.length - 1;
}

function checkIfTeamsAreIninted() {
    if (startOfDayIndexes === undefined) {
        console.log("ERR: Need to call the initTeam function first to run this module!")
    }
}