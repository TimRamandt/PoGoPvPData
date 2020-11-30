import datetime
import sys
from colorama import Fore 
from leagues import selectLeague
from teamsetCmd import executeTeamSet
from battlerecordCmd import registerBattleRecord


def launch():
    dataPath = "webclient/data/s5/data.txt"
    indexPath = "webclient/data/s5/sIndex.txt"

    testApp = False 
    if testApp:
        print("testing mode")
        dataPath = "webclient/data/s4/testData.txt"
        indexPath = "webclient/data/s4/sIndex.txt"

    print("Pokemon Go PvP Data Collector.")
    print("v0.2-alpha")

    #loading the commands from the other python files
    commands = [executeTeamSet, registerBattleRecord]

    league = selectLeague()

    amountOfbattles = determineRemainingBattles(dataPath, indexPath, league)
    if amountOfbattles >= 25:
        errorMessage("Unable to input more battles, max amount (5) of sets is reached for today") 
        return

    print("Syntax")
    print("W/L/D:Pokemon1,Pokemon2,Pokemon3")

    #battle registration
    while amountOfbattles < 25:
        userInput = input("> ")

        if (userInput == "reindex"):
            print("reindexing...")
            reIndex(dataPath, indexPath)
            continue

        for command in commands:
            result = command(userInput)
            if (type(result) is tuple):
                writeToFile(result[0], dataPath)
                if result[1] != "" and result[2] != "":
                    selectMessage(result[1], result[2])
                break

            if result.startswith("ERR:"):
               errorMessage(result)
               break 

            if result == "OTHER_COMMAND":
                continue

            amountOfbattles += 1
            break

    errorMessage("Unable to input more battles, max amount (5) of sets is reached for today") 

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

def writeToFile(input, dataPath):
    file = open(dataPath, "a")
    file.write(input + "\n")


def errorMessage(errorMessage):
    print(Fore.RED + errorMessage + Fore.RESET)

def selectMessage(pretext, value):
    print(pretext + Fore.CYAN + value + Fore.RESET)

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