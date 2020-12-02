import datetime
import sys
from dataHandler import getSeasonFilePath
from colorama import Fore 
from leagues import selectLeague, getSeasonOptions
from teamsetCmd import executeTeamSet
from reindexCmd import executeReIndex
from battlerecordCmd import registerBattleRecord

TITLE = "Pokemon Go PvP Data Collector" 
VERSION = "v0.3-alpha"

def launch():
    dataPath = getSeasonFilePath()

    print(TITLE)
    print(VERSION)

    #loading the commands from the other python files
    commands = [executeTeamSet, executeReIndex ,registerBattleRecord]

    league = selectLeague(infoMessage, errorMessage)

    amountOfbattles = determineRemainingBattles(dataPath, league)
    if amountOfbattles >= 25:
        errorMessage("Unable to input more battles, max amount (5) of sets is reached for today") 
        return

    print("Syntax")
    print("W/L/D:Pokemon1,Pokemon2,Pokemon3")

    #battle registration
    while amountOfbattles < 25:
        userInput = input("> ")

        if userInput == "exit":
           print(TITLE + " has been terminated by the user")
           return

        for command in commands:
            result = command(userInput)
            if (type(result) is tuple):
                writeToFile(result[0], dataPath)
                if result[1] != "" and result[2] != "":
                    infoMessage(result[1], result[2])
                break

            if result.startswith("ERR:"):
               errorMessage(result)
               break 

            if result == "OTHER_COMMAND":
                continue

            amountOfbattles += 1
            break

    errorMessage("Unable to input more battles, max amount (5) of sets is reached for today") 

def determineRemainingBattles(dataPath, league):
    content = open(dataPath, "r").read().splitlines()

    if len(content) <= 3:
        print("Good luck in the new season, trainer!")
        writeToFile("- "+ league + " "  + datetime.date.today().strftime("%Y-%m-%d"), dataPath)
        return 0

    lineIndex = len(content) - 1
    amountOfBattles = 0
    while lineIndex >= 0:
        if content[lineIndex] == "":
            lineIndex -= 1
            continue

        if content[lineIndex].startswith('- '):
            if isInPast(content[lineIndex].split(' ')[2]):
                writeToFile("- " + league + " " + datetime.date.today().strftime("%Y-%m-%d"), dataPath)
                executeReIndex("reindex")
                return 0
            
            print("You have done " + str(amountOfBattles) + " battles so far.")
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

def infoMessage(pretext, value):
    print(pretext + Fore.CYAN + value + Fore.RESET)

launch()