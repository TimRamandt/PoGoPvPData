import { createStatistics, getLeague } from './statistics.js'
import { drawWinRatio } from './ratioBar.js'

var leagueOptions = new Array();
var data = new Array();
on_load()

async function on_load() {
    const dataResponse = await fetch("http://localhost:8088/data/s5/data.txt")
    data = (await dataResponse.text()).split("\n")
    console.log(data)

    const indexFileResponse = await fetch("http://localhost:8088/data/s5/sIndex.txt")
    const indexFile = (await indexFileResponse.text()).split("\n")

    loadLeagueOptions(indexFile, data)
    loadLeagueOptionsUI()
}


function populateTeams (teams) {
    var ulTeams = document.getElementById("teams");
    clearList(ulTeams)
    for(var i = 0; i < teams.length; i++) {
        var text = teams[i].lead + ", " + teams[i].backEnd[0] + ", " + teams[i].backEnd[1] + " (" + teams[i].encountered + ")";
        ulTeams.append(createNode(text, "li"))
    }
}

function populateLeads(leads) {
    var ulLead = document.getElementById("leads");
    clearList(ulLead)
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
    for (var i = 0; i < indexFile.length; i++) { 
        var league = getLeague(data[parseInt(indexFile[i])])
        if (leagueOptions.find(lo => lo.league === league) === undefined) {
            leagueOptions.push({league: league, startIndex: parseInt(indexFile[i])})
        }
    }
}

function loadLeagueOptionsUI() {
    var leagueOptionsElement = document.getElementById("leagues")
    for(var i = 0; i < leagueOptions.length; i++) {
        var img = document.createElement('img')
        img.setAttribute('src', './style/images/leagues/' + leagueOptions[i].league + '.png')
        img.setAttribute('alt', leagueOptions[i].league)
        img.setAttribute('class', 'leagueOption')
        img.addEventListener('click', function(event) {
            event.preventDefault()
            var sourceElement = event.srcElement
            var altAttribute = sourceElement.attributes.alt;

            if (sourceElement.attributes.class.value !== "highlight") {
                var ratioBar = document.getElementById("ratioBar")
                ratioBar.removeAttribute("class")
                var selectedOptions = document.getElementsByClassName("highlight"); 
                for(var i = 0; i < selectedOptions.length; i++) {
                    selectedOptions[i].setAttribute('class', 'leagueOption')
                }
                var selectedLeague = leagueOptions.find(lo => lo.league === altAttribute.value)
                var statistics = createStatistics(data, selectedLeague.startIndex, false, selectedLeague.league)
                console.log(statistics)
                populateTeams(statistics.teams)
                populateLeads(statistics.leads)
                drawWinRatio(statistics.outcomes)
                sourceElement.setAttribute('class', 'highlight')
            }
        })
        leagueOptionsElement.appendChild(img)
    }
}

function clearList(ul) {
    ul.innerHTML = "";
}