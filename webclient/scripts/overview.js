import { createStatistics, pokemonsToArray } from './statistics.js'

on_load()

async function on_load() {
    const dataResponse = await fetch("http://localhost:8088/data/s4/testData.txt")
    const data = (await dataResponse.text()).split("\n")

    //for now 0, because season 5 is only great league
    var statistics = createStatistics(data, 0, false);
    console.log(statistics)
    populateLeads(statistics.leads)
    populateTeams(statistics.teams)
}


function populateTeams (teams) {
    var ulTeams = document.getElementById("teams");
    for(var i = 0; i < teams.length; i++) {
        var text = teams[i].lead + ", " + teams[i].backEnd[0] + ", " + teams[i].backEnd[1] + " (" + teams[i].encountered + ")";
        ulTeams.append(createNode(text, "li"))
    }
}

function populateLeads(leads) {
    var ulLead = document.getElementById("leads");
    for(var i = 0; i < leads.length; i++) {
        var text = leads[i].lead + " (" + leads[i].encountered + ")" 
        ulLead.append(createNode(text, "li"))
    }
}

function createNode(text, element) {
    var node = document.createElement(element);
    var textNode = document.createTextNode(text);
    node.append(textNode)
    return node
}