def launch():
    print("Pokemon Go PvP Data Collector.")
    print("Syntax")
    print("W/L/D:Pokemon1,Pokemon2,Pokemon3")
    userInput = input("> ")

    parseData(userInput)


def parseData(userInput):
    #outcome = userInput.split(":")[0]
    #print(outcome)

    #need to figure out dataclass I'll be using an array now
    pokemons = []
    pokemon = ""
    for c in list(userInput.split(":")[1]):
        if c == ",":
            pokemons.append(pokemon)
            pokemon = ""
            continue
        if c.isalpha():
            pokemon += c

    pokemons.append(pokemon)
    print(pokemons)

launch()