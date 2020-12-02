import { createStatistics, getLeague } from './statistics.js'
import { drawWinRatio } from './ratioBar.js'

var leagueOptions = new Array();
var dataObject = "";
on_load()

async function on_load() {
    const dataResponse = await fetch("http://localhost:8088/data/s6/data.txt")
    const dataRaw = (await dataResponse.text()).split("\n")
    console.log(dataRaw)

    var indexesObject = {startOfDay:dataRaw[0].split(";")}
    dataObject = {indexes:indexesObject, data:dataRaw}
    console.log(dataObject)
    loadLeagueOptions(dataObject)
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

function loadLeagueOptions(dataObject) {
    for (var i = 0; i < dataObject.indexes.startOfDay.length; i++) { 
        var league = getLeague(dataObject.data[parseInt(dataObject.indexes.startOfDay[i])])
        if (leagueOptions.find(lo => lo.league === league) === undefined) {
            leagueOptions.push({league: league, startIndex: parseInt(dataObject.indexes.startOfDay[i])})
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
                console.log(dataObject)
                var statistics = createStatistics(dataObject.data, selectedLeague.startIndex, false, selectedLeague.league)
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