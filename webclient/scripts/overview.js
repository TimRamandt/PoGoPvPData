import { createStatistics } from './statistics.js'

on_load()

async function on_load() {
    const dataResponse = await fetch("http://localhost:8088/data/s5/data.txt")
    const data = (await dataResponse.text()).split("\n")

    const indexFileResponse = await fetch("http://localhost:8088/data/s5/sIndex.txt")
    const indexFile = (await indexFileResponse.text()).split("\n")

    //for now 0, because season 5 is only great league
    loadLeagueOptions(indexFile, data)
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

function loadLeagueOptions(indexFile, data) {
    var leagues = new Array()
    for (var i = 0; i < indexFile.length; i++) {
        var startOfDay = Array.from(data[parseInt(indexFile[i])]) 
        var league = ""; 
        for(var j = 0; j < startOfDay.length; j++) {
            if (startOfDay[j] !== "" && isAlpha(startOfDay[j])){
                league = league + startOfDay[j]
            }
        }
        if (leagues.find(l => l === league) === undefined) {
            leagues.push(league)
        }
    }
    console.log(leagues)

    var leagueOptions = document.getElementById("leagues")
    for(var i = 0; i < leagues.length; i++) {
        var img = document.createElement('img')
        img.setAttribute('src', './style/images/leagues/' + leagues[i] + '.png')
        img.setAttribute('alt', leagues[i])
        img.setAttribute('class', 'leagueOption')
        img.addEventListener('click', function(event) {
            event.preventDefault()
            var sourceElement = event.srcElement
            var selectLeague = sourceElement.attributes.alt.value;
            console.log(selectLeague)

            if (sourceElement.attributes.class.value !== "highlight") {
                var selectedOptions = document.getElementsByClassName("highlight"); 
                for(var i = 0; i < selectedOptions.length; i++) {
                    selectedOptions[i].setAttribute('class', 'leagueOption')
                }

                sourceElement.setAttribute('class', 'highlight')
            }
        })
        leagueOptions.appendChild(img)
    }
}

function isAlpha(char) {
    return /^[A-Z]$/i.test(char)
}