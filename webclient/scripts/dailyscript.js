import { createStatistics, findTeamIndex, parseTeamObject, pokemonsToArray } from './statistics.js'
import { drawWinRatio } from './ratioBar.js'
import { fetchDataObject } from './dataHandling.js'
import { getNearestPriorToValue } from './ArrayHelpers.js'

export {parseDailySets}

var dataObject = {}
on_load()

async function switchView() {
        resetUI()

        var currentView = parseInt(document.getElementById("currentView").value);

        var indexFileLine = dataObject.indexes.startOfDay.length - currentView;

        //to prevent out of bound exceptions
        if (indexFileLine < 0) {
            indexFileLine = 0;
        } 

        var setData = parseDailySets(dataObject, dataObject.indexes.startOfDay[indexFileLine]) 
        console.log(setData)

        drawSetUI(setData)
        drawUserTeamsTable(setData.UserTeams) 

        fillDate(dataObject.data, parseInt(dataObject.indexes.startOfDay[indexFileLine]))

        var statistics = createStatistics(dataObject.data, dataObject.indexes.startOfDay[indexFileLine], true, undefined)
        console.log("stats",statistics)

        drawWinRatio(statistics.outcomes, 1130)
        showStatistics(statistics)
}


function resetUI() {
    for(var setNr = 1; setNr < 6; setNr++) {
        replaceClassAttributes("text-center", "noSetMsg" + setNr)
        replaceClassAttributes("teamDisplayTable invisible", "set"+setNr)

        var setNode = document.getElementById("dataSet" + setNr);
        while (setNode.firstChild) {
            setNode.removeChild(setNode.lastChild);
        }
    }
}

async function on_load() {
    
    var txbCurrentView = document.getElementById("currentView");
    if (txbCurrentView === null) {
        //have to do this bs, because if an exported function will try to resolve txbCurrentView
        //and it'll fail since currentView will not be there
        return;
    }

    txbCurrentView.addEventListener("keypress", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            switchView()
        }
    });

    dataObject = await fetchDataObject() 
    
    console.log(dataObject)

    fillAmountOfDays(dataObject.indexes.startOfDay)

    var lastIndex = dataObject.indexes.startOfDay.length -1
    var recentIndex = dataObject.indexes.startOfDay[lastIndex]
    var statistics = createStatistics(dataObject.data, recentIndex, true, undefined)
    console.log(statistics)

    showStatistics(statistics)
    fillDate(dataObject.data, parseInt(recentIndex))

    var setData = parseDailySets(dataObject, recentIndex) 
    console.log(setData)

    drawSetUI(setData)
    drawUserTeamsTable(setData.UserTeams) 
    drawWinRatio(statistics.outcomes, 1130)
}

function fillAmountOfDays(indexFile) {
    var lblAmountOfDays = document.getElementById("amountOfDays");
    var textNode = document.createTextNode("/" + indexFile.length);
    lblAmountOfDays.replaceWith(textNode)
}

function parseDailySets(dataObject, indexStart) {
    var sets = new Array()
    var set = new Array()
    var userTeams = new Array()

    var battles = 0;
    var data = dataObject.data;
    var teamId = 0;
    for (var lineIndex = parseInt(indexStart)+1; lineIndex < data.length; lineIndex++) {

        if(data[lineIndex].startsWith("- ")) {
            break;
        }

        if(data[lineIndex].startsWith("~ts")) {
            if (userTeams.length === 0 && battles !== 0) {
                userTeams.push(getPriorTeam(dataObject, indexStart))
            }
            
            var team = pokemonsToArray(data[lineIndex].split(':')[1].trim())
            var teamIndex = findTeamIndex(userTeams, team)

            if (teamIndex < 0) {
                teamId = userTeams.length;
                userTeams.push(parseTeamObject(data[lineIndex].split(':')[1].trim()))
                continue;
            }

            teamId = teamIndex;
            continue;
        }

        if (data[lineIndex] === "") {
            continue;
        }

        var split = data[lineIndex].split(":");

        var outcome = split[0];

        var battle = {outcome: outcome, pokemons: pokemonsToArray(split[1]), teamId: teamId}
        set.push(battle)

        battles++;
        if (battles % 5 === 0) {
            sets.push(set)
            set = new Array();
        }
    }

    if (userTeams.length === 0) {
        userTeams.push(getPriorTeam(dataObject, indexStart))
    }
    return {sets: sets, UserTeams: userTeams}
}

function getPriorTeam(dataObject, startIndex) {
    var teamIndex = dataObject.indexes.userTeams[getNearestPriorToValue(startIndex, dataObject.indexes.userTeams)]
    return parseTeamObject(dataObject.data[parseInt(teamIndex)].split(':')[1].trim());
}

function drawSetUI(setData) {
    var sets = setData.sets
    for(var setIndex = 0; setIndex < sets.length; setIndex++) {
        //setNr is the human variant, and is 1 based
        var setNr = setIndex+1;

        showSetTable(setNr)
        for(var battleIndex = 0; battleIndex < sets[setIndex].length; battleIndex++) {
            var battleRecord = sets[setIndex][battleIndex];
            addBattleRecordToSetTable(battleRecord, setNr)
        }
    }
}

function showSetTable(setNr) {
    var setdiv = document.getElementById("set" + setNr)
    setdiv.classList.remove("invisible")

    replaceClassAttributes("hiden", "noSetMsg" + setNr)
}

function addBattleRecordToSetTable(battleRecord, setNr) {
    //DOM stuff
    var table = document.getElementById("dataSet" + setNr);
    var row = document.createElement("tr");

    row.setAttributeNode(createClassAttribute(battleRecord.outcome))

    var dataTeamId = document.createAttribute("data-battle-team-id");
    dataTeamId.value = battleRecord.teamId;
    row.setAttributeNode(dataTeamId)

    var dataOutcome = document.createAttribute("data-outcome");
    dataOutcome.value = battleRecord.outcome;
    row.setAttributeNode(dataOutcome)

    for (var pokemonIndex = 0; pokemonIndex < battleRecord.pokemons.length; pokemonIndex++) {
        var tabledata = document.createElement("td");
        var textNode = document.createTextNode(battleRecord.pokemons[pokemonIndex]);
        tabledata.append(textNode)

        row.append(tabledata);
    }

    table.append(row);
}

function drawUserTeamsTable(userTeams) {
    var table = document.getElementById("tableUserTeams");

    table.innerHTML = "";

    for(var i = 0; i < userTeams.length; i++) {
        var row = document.createElement("tr");
        var dataTeamId = document.createAttribute("data-team-id");
        dataTeamId.value = i;
        row.setAttributeNode(dataTeamId)

        row.addEventListener("click", function(event) {
            event.preventDefault();
            highLightTeam(userTeams, this)
        })

        row.append(createTableData(userTeams[i].lead))
        for(var j = 0; j < userTeams[i].backEnd.length; j++) {
            row.append(createTableData(userTeams[i].backEnd[j]))
        }

        table.append(row)
    }
}

function highLightTeam(userTeams, teamNode) {
    if (userTeams.length <= 1) {
        //if there is only 1 (or less) team, no need to highlight
        return;
    }

    var userTeamSelected = "userTeamSelected"
    var teamId = teamNode.getAttribute("data-team-id")


    if(teamNode.getAttribute("class") === userTeamSelected) {
        //reset back to normal
        restoreBackToDefault();
        teamNode.setAttributeNode(createClassAttribute(""))
        return;
    }

    restoreBackToDefault();
    var table = document.getElementById("tableUserTeams");
    table.childNodes.forEach(tr => {
        tr.setAttributeNode(createClassAttribute("")) 
    });
    teamNode.setAttributeNode(createClassAttribute(userTeamSelected))

    var rows = document.getElementsByTagName("tr");
    for(var i = 0; i < rows.length; i++) {
        var battleUserTeamId = rows[i].getAttribute("data-battle-team-id"); 
        if (battleUserTeamId === null || undefined) {
            continue;
        }

        if (battleUserTeamId !== teamId) {
            rows[i].setAttributeNode(createClassAttribute("teamDefocus"))
        }
    }
    
    console.log("teamId:", teamId)
}

function createTableData(data) {
    var tabledata = document.createElement("td");
    var textNode = document.createTextNode(data);
    tabledata.append(textNode)

    return tabledata;
}

function createClassAttribute(value) {
    var classNode = document.createAttribute("class")
    classNode.value = value 
    return classNode
}

function replaceClassAttributes(value, parentId) {
    var parent = document.getElementById(parentId)
    parent.setAttributeNode(createClassAttribute(value))
}

function restoreBackToDefault() {
    var rows = document.getElementsByTagName("tr");
    for(var i = 0; i < rows.length; i++) {
        var outcome = rows[i].getAttribute("data-outcome"); 
        if (outcome === null || undefined) {
            continue;
        }

        rows[i].setAttributeNode(createClassAttribute(outcome))
    }
}

function fillDate(data, index) {
    var date = data[parseInt(index)].split(" ")[2]
    document.getElementById("date").innerText = date 
}

function showStatistics(statistics) {
    console.log(statistics)
    showMostCommonLead(statistics.leads)
    showMostCommonTeam(statistics.teams)
    showUniqueTeamCount(statistics.teams.length)
}

function showMostCommonLead(leads) {
    var lead = leads[0]
    for(var i = 1; i < leads.length; i++) {
        if (leads[i].encountered > lead.encountered) {
            lead = leads[i]
        }
    }

    document.getElementById("lead").innerText = "most common lead: " + lead.lead + " (" + lead.encountered + ")" 
}

function showMostCommonTeam(teams) {
    var team = teams[0]
    for(var i = 1; i < teams.length; i++) {
        if (teams[i].encountered >= team.encountered) {
            team = teams[i]
        }
    }
    var teamText = team.lead + ", " + team.backEnd[0] + ", " + team.backEnd[1] + " (" + team.encountered + ")";

    document.getElementById("common_team").innerText = "most common team: " + teamText
}

function showUniqueTeamCount(amount) {
    document.getElementById("unique_teams").innerText = "unique teams: " + amount 
}