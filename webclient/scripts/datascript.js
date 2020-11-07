on_load()

async function switchView(e) {
    if (e.keyCode === 13) {
        e.preventDefault()
        resetUI()

        var currentView = parseInt(document.getElementById("currentView").value);

        const dataResponse = await fetch("http://localhost:8088/data/s4/testData.txt")
        const data = (await dataResponse.text()).split("\n")

        const indexFileResponse = await fetch("http://localhost:8088/data/s4/sIndex.txt")
        const indexFile = (await indexFileResponse.text()).split("\n")
        
        indexFileLine = indexFile.length - currentView;

        //to prevent out of bound exceptions
        if (indexFileLine < 0) {
            indexFileLine = 0;
        } 

        parseData(data, parseInt(indexFile[indexFileLine]))
        fillDate(data, parseInt(indexFile[indexFileLine]))
    }
}


function resetUI() {
    for(setNr = 1; setNr < 6; setNr++) {
        
        replaceClassAttributes("text-center", "noSetMsg" + setNr)
        replaceClassAttributes("teamDisplayTable invisible", "set"+setNr)

        setNode = document.getElementById("dataSet" + setNr);
        while (setNode.firstChild) {
            setNode.removeChild(setNode.lastChild);
        }
    }
}

async function on_load() {
    const dataResponse = await fetch("http://localhost:8088/data/s4/testData.txt")
    const data = (await dataResponse.text()).split("\n")
    
    const indexFileResponse = await fetch("http://localhost:8088/data/s4/sIndex.txt")
    const indexFile = (await indexFileResponse.text()).split("\n")
    console.log(indexFile)
    fillAmountOfDays(indexFile)

    recentIndex = indexFile[indexFile.length-1]

    fillDate(data, parseInt(recentIndex))
    parseData(data, parseInt(recentIndex))
}

function fillAmountOfDays(indexFile) {
    var lblAmountOfDays = document.getElementById("amountOfDays");
    var textNode = document.createTextNode("/" + indexFile.length);
    lblAmountOfDays.replaceWith(textNode)
}

function parseData(lines, indexStart) {
    console.log(lines)
    var sets = new Array()
    var set = new Array()

    var battles = 0;
    for (lineIndex = parseInt(indexStart)+1; lineIndex < lines.length; lineIndex++) {
        console.log(lines[lineIndex])

        if(lines[lineIndex].startsWith("- ")) {
            break;
        }

        if (lines[lineIndex] === "") {
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

    replaceClassAttributes("hiden", "noSetMsg" + setNr)
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

function replaceClassAttributes(value, parentId) {
    var parent = document.getElementById(parentId)
    var invisibleClass = document.createAttribute("class")
    invisibleClass.value = value 
    parent.setAttributeNode(invisibleClass)
}

function fillDate(data, index) {
    var date = data[index].split(" ")[2]
    document.getElementById("date").innerText = date 
}