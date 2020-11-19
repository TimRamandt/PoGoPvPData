import datetime
import sys
from colorama import Fore 
from leagues import selectLeague


def launch():
    dataPath = "webclient/data/s5/data.txt"
    indexPath = "webclient/data/s5/sIndex.txt"

    testApp = False 
    if testApp:
        print("testing mode")
        dataPath = "webclient/data/s4/testData.txt"
        indexPath = "webclient/data/s4/sIndex.txt"

    print("Pokemon Go PvP Data Collector.")
    
    league = selectLeague()
    amountOfbattles = determineRemainingBattles(dataPath, indexPath, league)
    if amountOfbattles >= 25:
        errorMessage("Unable to input more battles, max amount (6) of sets is reached for today") 
        return

    print("Syntax")
    print("W/L/D:Pokemon1,Pokemon2,Pokemon3")

    #battle registration
    while amountOfbattles < 25:
        userInput = input("> ")
        print(userInput)

        if (userInput == "reindex"):
            print("reindexing...")
            reIndex(dataPath, indexPath)
            continue

        writeToFile(userInput, dataPath)
        amountOfbattles += 1

    errorMessage("Unable to input more battles, max amount (5) of sets is reached for today") 
    #parseData(userInput)

def determineRemainingBattles(dataPath, indexPath, league):
    content = open(dataPath, "r").read().splitlines()

    if len(content) <= 0:
        print("A fresh season! Good luck trainer!")
        writeToFile("- "+ league + " "  + datetime.date.today().strftime("%Y-%m-%d") + "\n", dataPath)
        reIndex(dataPath, indexPath)
        return 0

    lineIndex = len(content) - 1
    amountOfBattles = 0
    while lineIndex >= 0:
        if content[lineIndex].startswith('- '):
            if isInPast(content[lineIndex].split(' ')[2]):
                print("Welcome back trainer, good luck on today's battles.")
                writeToFile("- " + league + " " + datetime.date.today().strftime("%Y-%m-%d") + "\n", dataPath)
                reIndex(dataPath, indexPath)
                return 0
            
            print("You have do " + str(amountOfBattles) + " battles so far.")
            return amountOfBattles

        amountOfBattles += 1
        lineIndex -= 1

    return 0

def isInPast(strDate):
    now = datetime.date.today()
    dateArray = strDate.split('-')
    return datetime.datetime(now.year, now.month, now.day) > datetime.datetime(int(dateArray[0]), int(dateArray[1]), int(dateArray[2]))


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

def writeToFile(input, dataPath):
    file = open(dataPath, "a")
    file.write(input + "\n")


def errorMessage(errorMessage):
    print(Fore.RED + errorMessage)

    #reset the console back to the regular color
    print(Fore.RESET)

def reIndex(dataPath, indexPath):
    indexFile = open(indexPath, "w")

    content = open(dataPath, "r").read().splitlines()

    if len(content) <= 0:
        print("done!")
        return 

    lineIndex = 0
    indexContent = ""
    while lineIndex < len(content):
        
        if content[lineIndex].startswith('- '):
            indexContent = indexContent + str(lineIndex) + "\n" 

        lineIndex = lineIndex + 1

    indexFile.write(indexContent.rstrip("\n"))
    print("done!")


launch()