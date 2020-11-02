readData()

async function readData() {
    const response = await fetch("http://localhost:8088/data/s4/testData.txt")
    const data = await response.text()
    parseData(data)
}

function parseData(data) {
    console.log(data)
    var lines = data.split("\n")

    var sets = new Array()
    var set = new Array()

    var battles = 0;
    for (lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        console.log(lines[lineIndex])

        if (lines[lineIndex] === "" || lines[lineIndex].startsWith("- ")) {
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
    for(setIndex = 0; setIndex < sets.length; setIndex++) {
        console.log(sets[setIndex])
        //setIndex+1 because sets are 1 based (silly humans!)
        showSetUI(setIndex+1);
        for(battleIndex = 0; battleIndex < sets[setIndex].length; battleIndex++) {
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
    for (pokemonIndex = 0; pokemonIndex < pokemons.length; pokemonIndex++) {
        var tabledata = document.createElement("td");
        var textNode = document.createTextNode(pokemons[pokemonIndex]);
        tabledata.append(textNode)

        row.append(tabledata);
    }

    table.append(row);
    console.log("appended!")
}


function showSetUI(setNr) {
    var setdiv = document.getElementById("set" + setNr)
    setdiv.classList.remove("invisible")

    var noSetMsg = document.getElementById("noSetMsg" + setNr)
    var clazz = document.createAttribute("class");
    clazz.value = "hiden";
    noSetMsg.setAttributeNode(clazz)
}

function pokemonsToArray(pokemons) {
    var pokemonsArray = new Array();
    var pokemon = ""; 
    
    var charArray = Array.from(pokemons)
    for (charIndex = 0; charIndex < charArray.length; charIndex++) {
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
