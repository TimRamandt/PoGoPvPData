var data = "W:Swampert,Togekiss,Machamp";
parseData(data);


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

function parseData() {
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
