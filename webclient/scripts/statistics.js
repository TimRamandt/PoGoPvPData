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

        if(data[i] === "") {
            continue;
        }

        var pokemons = pokemonsToArray(data[i].split(":")[1])
        getLeadStats(leadArray, pokemons[0])
        getUniqueTeams(teams, pokemons)
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
            return leads;
        }
    }

    leads.push({lead:pokemon, encountered:1})
}

function getUniqueTeams(teams, team) {
    //TO DO: optimize this search algo. Linear search will do for now
    if(teams.length === 0) {
        teams.push({lead:team[0], backEnd: [team[1],team[2]], encountered:1})
        return;
    }

    //for example:
    //UNIQUE: togekiss, swampert, metagross
    //UNIQUE: swampert, togekiss, metagross
    //NOT UNIQUE: togekiss, metagross, swampert
    console.log(team)
    for (var i = 0; i < teams.length; i++) { 
        if(teams[i].lead !== team[0]) {
            teams.push({lead:team[0], backEnd: [team[1],team[2]], encountered:1})
            return teams;
        } 

        if(isUniqueBackEnd(team, teams[i].backEnd)) {
            teams.push({lead:team[0], backEnd: [team[1],team[2]], encountered:1})
            return teams;
        } 
        teams[i].encountered++;
    }

    return teams;
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

export { createStatistics, pokemonsToArray }