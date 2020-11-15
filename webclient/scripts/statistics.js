export { createStatistics, pokemonsToArray }

function createStatistics(data, startIndex, daily) {
    var leadArray = new Array();
    var teams = new Array();
    if (daily === true) {
        //shifting the index to the next line 
        //because the first line is - <league> <date>
        startIndex++;
    }
    for(var i = startIndex; i < data.length; i++) {
        if(data[i].startsWith("- ") && daily === true) {
            break;
        }

        if(data[i].startsWith("- ")) {
            //for now do nothing, since season 5 is only great league
            continue;
        }

        if(data[i] === "") {
            continue;
        }

        console.log(data[i])

        var pokemons = pokemonsToArray(data[i].split(":")[1])

        leadArray = getLeadStats(leadArray, pokemons[0])
        teams = getUniqueTeams(teams, pokemons)
    }
    return {leads: leadArray, teams: teams}
}

function getLeadStats(leads, pokemon) {
    //TO DO: optimize this search algo. Linear search will do for now
    if(leads.length === 0) {
        leads.push({lead:pokemon, encountered:1})
        return leads;
    }

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

function getUniqueTeams(teams, team) {
    if (checkIfInvalidTeam(team)) {
        return teams;
    }

    //TO DO: optimize this search algo. Linear search will do for now
    if(teams.length === 0) {
        teams.push({lead:team[0], backEnd: [team[1],team[2]], encountered:1})
        return teams;
    }

    //for example:
    //UNIQUE: togekiss, swampert, metagross
    //UNIQUE: swampert, togekiss, metagross
    //NOT UNIQUE: togekiss, metagross, swampert
    for (var i = 0; i < teams.length; i++) { 
        //check if the team exists
        if(teams[i].lead === team[0] && !isUniqueBackEnd(team, teams[i].backEnd)) {
            teams[i].encountered++;
            return reOrder(teams, i)
        }        
    }

    //team doesn't exist, add it to the array
    teams.push({lead:team[0], backEnd: [team[1],team[2]], encountered:1})

    return teams;
}

function checkIfInvalidTeam(team) {
    for(var i = 0; i < team.length; i++) {
        if (team[i] === "?") {
            return true;
        }
    }    

    return false;
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
    return /^[A-Z]$/i.test(char);;
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