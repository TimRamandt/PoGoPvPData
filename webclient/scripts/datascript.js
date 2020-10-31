readData()

async function readData() {
    const response = await fetch("http://localhost:8088/data/s4/data.txt")
    const data = await response.text()
    parseData(data)
}

function parseData(data) {
    console.log(data)
    var lines = data.split("\n")

    for (lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        console.log(lines[lineIndex])
        if (lines[lineIndex] === "" || lines[lineIndex].startsWith("- ")) {
            continue;
        }

        var split = lines[lineIndex].split(":");

        var outcome = split[0];
        console.log(split[1])
        visualizeData(outcome, pokemonsToArray(split[1]))
    }
}

function visualizeData(outcome, pokemons) {
    var table = document.getElementById("tableData");
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

function pokemonsToArray(pokemons) {
    console.log(pokemons)
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
