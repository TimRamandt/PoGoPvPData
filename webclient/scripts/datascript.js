readData();

async function readData() {
    const response = await fetch("http://localhost:8088/data/s4/data.txt");
    const data = await response.text();
    return parseData(data); 
    //var fileReader = new FileReader();
    //return fileReader.readAsText("./data/s4/data.txt")
}

function visualizeData(outcome, pokemons) {
    var table = document.getElementById("tableData");
    var row = document.createElement("tr");

    var clazz = document.createAttribute("class");
    clazz.value = outcome;
    row.setAttributeNode(clazz);

    for (i = 0; i < pokemons.length; i++) {
        console.log(pokemons[i])
        var tabledata = document.createElement("td");
        var textNode = document.createTextNode(pokemons[i]);
        tabledata.append(textNode)

        row.append(tabledata);
    }

    table.append(row);
}

function parseData(data) {
    var split = data.split(":");

    var outcome = split[0];
    var pokemonsData = split[1];

    var pokemons = new Array();
    var pokemon = ""; 

    var charArray = Array.from(pokemonsData)
    for (i = 0; i < charArray.length; i++) {
       if (charArray[i] == ",") {
           pokemons.push(pokemon)
           pokemon = "";
           continue;
       }

        if (isAlpha(charArray[i])) {
            pokemon += charArray[i];
        }
    }

    pokemons.push(pokemon);

    visualizeData(outcome, pokemons) 
}

function isAlpha(char) {
    return /^[A-Z]$/i.test(char);
}
