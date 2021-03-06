import { createStatistics, getLeague } from './statistics.js'
import { drawWinRatio } from './ratioBar.js'

var leagueOptions = new Array();
var dataObject = {};
on_load()

async function on_load() {
    const dataResponse = await fetch("http://localhost:8088/data/s6/data.txt")
    const dataRaw = (await dataResponse.text()).split("\n")
    console.log(dataRaw)

    var indexesObject = {startOfDay:dataRaw[0].split(";")}
    dataObject = {indexes:indexesObject, data:dataRaw}
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

function populatePokemons(statistics) {
    var pokemons = statistics.encounteredPokemons
    var totalBattles = statistics.outcomes.wins + statistics.outcomes.draws + statistics.outcomes.loses

    var table = document.getElementById("encountered-pokemons-table");
    table.innerHTML = "";

    for (var pokemonIndex = 0; pokemonIndex < pokemons.length; pokemonIndex++) {
        var row = document.createElement("tr");
        var tableDataPokemon = document.createElement("td");
        var pokemonName = document.createTextNode(pokemons[pokemonIndex].name);
        tableDataPokemon.append(pokemonName)

        row.append(tableDataPokemon);

        var tableDataTotalEnc = document.createElement("td");
        var encStat = pokemons[pokemonIndex].encountered
        var totalEncounters = document.createTextNode(encStat + " (" + (encStat/(totalBattles*3)*100).toFixed(2) + " %)");
        tableDataTotalEnc.append(totalEncounters)

        row.append(tableDataTotalEnc);

        var tableDataLead = document.createElement("td");
        var leadStat = pokemons[pokemonIndex].lead
        var wasLead = document.createTextNode(leadStat + " (" + ((leadStat/encStat)*100).toFixed(2) + " %)");
        tableDataLead.append(wasLead)

        row.append(tableDataLead);

        var tableDataLead = document.createElement("td");
        var backEndStat = pokemons[pokemonIndex].encountered - pokemons[pokemonIndex].lead
        var wasLead = document.createTextNode(backEndStat + " (" + ((backEndStat/encStat)*100).toFixed(2) + " %)");
        tableDataLead.append(wasLead)

        row.append(tableDataLead);
        table.append(row);
    }
}

function populateLeads(statistics) {
    var pokemons = statistics.leads
    var totalBattles = statistics.outcomes.wins + statistics.outcomes.draws + statistics.outcomes.loses

    var table = document.getElementById("pokemons-leads-table");
    table.innerHTML = "";

    for (var pokemonIndex = 0; pokemonIndex < pokemons.length; pokemonIndex++) {
        var row = document.createElement("tr");
        var tableDataPokemon = document.createElement("td");
        var pokemonName = document.createTextNode(pokemons[pokemonIndex].lead);
        tableDataPokemon.append(pokemonName)

        row.append(tableDataPokemon);

        var tableDataTotalEnc = document.createElement("td");
        var leadStat = pokemons[pokemonIndex].encountered
        var totalEncounters = document.createTextNode(leadStat + " (" + ((leadStat/totalBattles)*100).toFixed(2) + " %)");
        tableDataTotalEnc.append(totalEncounters)

        row.append(tableDataTotalEnc);

        table.append(row);
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
                showUIElements(["ratio-bar", "encountered-pokemons", "pokemons-leads"])
                var selectedOptions = document.getElementsByClassName("highlight"); 
                for(var i = 0; i < selectedOptions.length; i++) {
                    selectedOptions[i].setAttribute('class', 'leagueOption')
                }
                var selectedLeague = leagueOptions.find(lo => lo.league === altAttribute.value)
                var statistics = createStatistics(dataObject.data, selectedLeague.startIndex, false, selectedLeague.league)
                console.log(statistics)
                populateTeams(statistics.teams)
                populatePokemons(statistics)
                populateLeads(statistics)
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

function showUIElements(elementIds) {
    for(var i = 0; i < elementIds.length; i++) {
        var element = document.getElementById(elementIds[i])
        element.removeAttribute("class")
    } 
}