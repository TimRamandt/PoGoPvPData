allowedOutComes = ["W", "D", "L"]

def registerBattleRecord(input):
    for outcome in allowedOutComes:
        if input.startswith(outcome):
            if ':' in input:
                if len(input.split(':')[1].split(',')) != 3:
                    return "ERR: invalid syntax for registering a battle record. A PvP team must have 3 pokémons. All pokémons must be seperated with ','"
                return (input.strip(), "", "")
            return "ERR: invalid syntax for registering a battle record. The command and pokémons needs ':' as seperator" 
    return "ERR: registering a battle record must have an outcome. Possible outcomes are W(on), D(raw), L(ost). Please use the abbrivations"