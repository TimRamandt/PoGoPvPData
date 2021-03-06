export { createStatistics, pokemonsToArray, getLeague, findTeamIndex, parseTeamObject}

function createStatistics(data, startIndex, daily, league) {
    var leadArray = new Array();
    var teams = new Array();
    var encounteredPokemons = new Array();

    var outcomes = {wins: 0, loses:0, draws: 0}
    var requestedLeague = true;

    if (daily === true) {
        //shifting the index to the next line 
        //because the first line is - <league> <date>
        startIndex++;
    }
    for(var i = startIndex; i < data.length; i++) {
        if(data[i].startsWith("- ") && daily === true) {
            break;
        }

        if (data[i].startsWith("~ts")) {
            continue
        }

        if(data[i].startsWith("- ")) {
            if (league === undefined) {
                continue;
            }

            if (getLeague(data[i]) !== league) {
                requestedLeague = false
                continue;
            }

            requestedLeague = true;
            continue;
        }

        if(!requestedLeague) {
            continue;
        }

        var seperatedData = data[i].split(":");
        if (seperatedData[0] === "W") {
            outcomes.wins++;
        }

        if (seperatedData[0] === "L") {
            outcomes.loses++;
        }

        if (seperatedData[0] === "D") {
            outcomes.draws++;
        }

        if (seperatedData[1] !== undefined) {
            var pokemons = pokemonsToArray(seperatedData[1])
            leadArray = getLeadStats(leadArray, pokemons[0])
            teams = getOpponentTeams(teams, pokemons)

            for(var p = 0; p < pokemons.length; p++) {
                var isLead = false;

                if (p === 0) {
                    isLead = true;
                }

                if (pokemons[p] === "?") {
                    //skip incomplete data
                    continue;
                }
                encounteredPokemons = getEncounteredPokemons(pokemons[p], encounteredPokemons, isLead)
            }
        }
    }
    return {leads: leadArray, teams: teams, outcomes: outcomes, encounteredPokemons: encounteredPokemons}
}

function getEncounteredPokemons(pokemon, encounteredPokemons, isLead) {
    if (encounteredPokemons.length === 0) {
        encounteredPokemons.push({name: pokemon, encountered: 1, lead: 1})
        return encounteredPokemons;
    }

    //TO DO: optimize this search algo. Linear search will do for now
    for (var i = 0; i < encounteredPokemons.length; i++) { 
        if(encounteredPokemons[i].name === pokemon) {
            encounteredPokemons[i].encountered++;
            if (isLead) {
                encounteredPokemons[i].lead++;
            }
            if (i > 0) {
                return reOrder(encounteredPokemons, i)
            }
            return encounteredPokemons;
        }
    }

    var leadStat = 0;
    if (isLead) {
        leadStat++;
    }

    encounteredPokemons.push({name: pokemon, encountered: 1, lead: leadStat})
    return encounteredPokemons;
}

function getLeadStats(leads, pokemon) {
    if(leads.length === 0) {
        leads.push({lead:pokemon, encountered:1})
        return leads;
    }

    //TO DO: optimize this search algo. Linear search will do for now
    for (var i = 0; i < leads.length; i++) { 
        if(leads[i].lead === pokemon) {
            leads[i].encountered++;
            if (i > 0) {
                return reOrder(leads, i)
            }
            return leads;
        }
    }

    leads.push({lead:pokemon, encountered:1})
    return leads;
}

function getOpponentTeams(teams, team) {
    if(!isValidTeam(team)) {
        return teams;
    }

    var exisitingTeamIndex = findTeamIndex(teams, team);
    if (exisitingTeamIndex < 0) {
        //team doesn't exist, add it to the array
        teams.push({lead:team[0], backEnd: [team[1],team[2]], encountered:1})
        return teams;
    }

    teams[exisitingTeamIndex].encountered++;
    return reOrder(teams, exisitingTeamIndex)
}

function findTeamIndex(teams, team) {
    if (!isValidTeam(team)) {
        return null;
    }

    if(teams.length === 0) {
        return -1;
    }

    //TO DO: optimize this search algo. Linear search will do for now

    //for example:
    //UNIQUE: togekiss, swampert, metagross
    //UNIQUE: swampert, togekiss, metagross
    //NOT UNIQUE: togekiss, metagross, swampert
    for (var i = 0; i < teams.length; i++) { 
        //check if the team exists
        if(teams[i].lead === team[0] && !isUniqueBackEnd(team, teams[i].backEnd)) {
            return i;
        }        
    }
    return -1;
}

function parseTeamObject(strTeam) {
    var teamMembers = pokemonsToArray(strTeam);
    return {lead: teamMembers[0], backEnd: [teamMembers[1], teamMembers[2]]}
}

function isValidTeam(team) {
    for(var i = 0; i < team.length; i++) {
        if (team[i] === "?") {
            return false;
        }
    }    

    return true;
}

function isUniqueBackEnd(team, backEnd) {
    for(var i = 1; i < 3; i++) {
        if (team[i] !== backEnd[0] && team[i] !== backEnd[1]) {
            return true;
        }
    }
    return false;
}

function pokemonsToArray(pokemons) {
    var pokemonsArray = new Array();
    var pokemon = ""; 
    
    var charArray = Array.from(pokemons)
    for (var charIndex = 0; charIndex < charArray.length; charIndex++) {
        if (charArray[charIndex] === ",") {
           pokemonsArray.push(pokemon)
           pokemon = "";
           continue;
        }

        if (charArray[charIndex] === "?" && !pokemon.includes("?")) {
           pokemon = "?";
           continue;
        }


        if (isAlphaOrUnderscore(charArray[charIndex]) && !pokemon.includes("?")) {
            pokemon += charArray[charIndex];
        }
    }

    pokemonsArray.push(pokemon)
    return pokemonsArray
}

function isAlphaOrUnderscore(char) {
    if (char === "_") {
        return true
    }
    return /^[A-Z]$/i.test(char)
}

function reOrder(array, indexOfElement) {
    var element = array[indexOfElement]

    var newElementIndex = getIndexOfFirstElementWithHigherValue(array, (indexOfElement-1), element)+1;

    //create the ordered array
    var sortedArray = new Array();
    for(var j = 0; j < array.length; j++) {
        if (j === newElementIndex) {
            sortedArray.push(element)
        }

        if (j !== indexOfElement) {
            sortedArray.push(array[j]);
            continue;
        }

    }
    return sortedArray
}

function getIndexOfFirstElementWithHigherValue(array, startPoint, element) {
    //comparing the previous element
    var index = startPoint;

    while(true) {
        if(index < 0) {
            break;
        }

        if (element.encountered < array[index].encountered) {
            break;
        }

        index--;
    }
    
    return index;
}

function getLeague(line) {
    var charArrayLine = Array.from(line) 
    var league = ""; 
    for(var j = 0; j < charArrayLine.length; j++) {
        if (charArrayLine[j] !== "" && isAlphaOrUnderscore(charArrayLine[j])){
            league = league + charArrayLine[j]
        }
    }
    return league
}