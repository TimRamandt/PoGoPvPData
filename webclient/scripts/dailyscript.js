import { createStatistics, pokemonsToArray } from './statistics.js'

on_load()

var input = document.getElementById("currentView");
input.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        switchView(event)
    }
});

async function switchView(e) {
        resetUI()

        var currentView = parseInt(document.getElementById("currentView").value);

        const dataResponse = await fetch("http://localhost:8088/data/s5/data.txt")
        const data = (await dataResponse.text()).split("\n")

        const indexFileResponse = await fetch("http://localhost:8088/data/s5/sIndex.txt")
        const indexFile = (await indexFileResponse.text()).split("\n")
        
        var indexFileLine = (indexFile.length) - currentView;

        //to prevent out of bound exceptions
        if (indexFileLine < 0) {
            indexFileLine = 0;
        } 

        parseData(data, indexFile[indexFileLine])
        fillDate(data, parseInt(indexFile[indexFileLine]))

        var statistics = createStatistics(data, indexFile[indexFileLine], true)
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
    const dataResponse = await fetch("http://localhost:8088/data/s5/data.txt")
    const data = (await dataResponse.text()).split("\n")
    
    const indexFileResponse = await fetch("http://localhost:8088/data/s5/sIndex.txt")
    const indexFile = (await indexFileResponse.text()).split("\n")
    console.log(indexFile)
    fillAmountOfDays(indexFile)

    var recentIndex = indexFile[indexFile.length-1]
    var statistics = createStatistics(data, recentIndex, true)

    showStatistics(statistics)
    fillDate(data, parseInt(recentIndex))
    parseData(data, parseInt(recentIndex))
}

function fillAmountOfDays(indexFile) {
    var lblAmountOfDays = document.getElementById("amountOfDays");
    var textNode = document.createTextNode("/" + indexFile.length);
    lblAmountOfDays.replaceWith(textNode)
}

function parseData(lines, indexStart) {
    console.log(lines)
    var sets = new Array()
    var set = new Array()

    var battles = 0;
    for (var lineIndex = parseInt(indexStart)+1; lineIndex < lines.length; lineIndex++) {
        console.log(lines[lineIndex])

        if(lines[lineIndex].startsWith("- ")) {
            break;
        }

        if (lines[lineIndex] === "") {
            continue;
        }

        var split = lines[lineIndex].split(":");

        var outcome = split[0];

        var battle = {outcome: outcome, pokemons: pokemonsToArray(split[1])}
        set.push(battle)

        battles++;
        if (battles % 5 === 0) {
            sets.push(set)
            set = new Array();
        }
    }
    console.log(sets)

    //displaying the data we parsed
    for(var setIndex = 0; setIndex < sets.length; setIndex++) {
        console.log(sets[setIndex])
        //setIndex+1 because sets are 1 based (silly humans!)
        showSetUI(setIndex+1);
        for(var battleIndex = 0; battleIndex < sets[setIndex].length; battleIndex++) {
            console.log(sets[setIndex][battleIndex])
            visualizeData(sets[setIndex][battleIndex].outcome, sets[setIndex][battleIndex].pokemons, setIndex+1)
        }
    }
}

function visualizeData(outcome, pokemons, setNr) {
    var table = document.getElementById("dataSet" + setNr);
    var row = document.createElement("tr");

    var clazz = document.createAttribute("class");
    clazz.value = outcome;
    row.setAttributeNode(clazz)

    console.log(pokemons)
    for (var pokemonIndex = 0; pokemonIndex < pokemons.length; pokemonIndex++) {
        var tabledata = document.createElement("td");
        var textNode = document.createTextNode(pokemons[pokemonIndex]);
        tabledata.append(textNode)

        row.append(tabledata);
    }

    table.append(row);
}


function showSetUI(setNr) {
    var setdiv = document.getElementById("set" + setNr)
    setdiv.classList.remove("invisible")

    replaceClassAttributes("hiden", "noSetMsg" + setNr)
}

function replaceClassAttributes(value, parentId) {
    var parent = document.getElementById(parentId)
    var invisibleClass = document.createAttribute("class")
    invisibleClass.value = value 
    parent.setAttributeNode(invisibleClass)
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