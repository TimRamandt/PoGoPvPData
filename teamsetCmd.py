def executeTeamSet(input):
    if input.startswith('teamset') or input.startswith('ts'):
        if ':' in input:
            pokemons = input.split(':')[1]
            if len(pokemons.split(',')) != 3:
                return "ERR: invalid syntax for setting a team. A PvP team must have 3 pokémons. All pokémons must be seperated with ','"
            return ("~ts: "+pokemons.strip(), "Your current team has been set to: ", pokemons.strip())
        return "ERR: invalid syntax for setting a team. The command and pokémons needs ':' as seperator" 
    return "OTHER_COMMAND"
