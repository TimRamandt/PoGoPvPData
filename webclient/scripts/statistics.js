function createStatistics(data, startIndex, daily) {
    var leadArray = new Array();
    if (daily === true) {
        //shifting the index to the next line 
        //because the first line is - <league> <date>
        startIndex++;
    }
    for(var i = startIndex; i < data.length; i++) {
        if(data[i].startsWith("- ") && daily === true) {
            break;
        }

        var pokemons = pokemonsToArray(data[i].split(":")[1])
        getLeadStats(leadArray, pokemons[0])
    }
    return {leads: leadArray}
}

function getLeadStats(array, pokemon) {
    //TO DO: optimize this search algo. Linear search will do for now
    if(array.length === 0) {
        array.push({lead:pokemon, encountered:1})
        return;
    }

    for (var i = 0; i < array.length; i++) { 
        if(array[i].lead === pokemon) {
            array[i].encountered++;
            return;
        }
    }

    array.push({lead:pokemon, encountered:1})
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