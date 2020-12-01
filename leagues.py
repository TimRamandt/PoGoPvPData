from datetime import datetime, timedelta
import re

def getLeagueOptions():
    schedule = open("./leagues/league.schedule", "r").read().splitlines()

    for line in schedule:
        if line.startswith("season"):
            #logic about this soon tm
            continue
        if checkScheduleEntry(line):
            return line.split(":")[0]

    return "error with league.schedule"

def selectLeague(infoMethodCall, errorMethodCall):
    options = getLeagueOptions().split(',')
    if len(options) <= 1:
        infoMethodCall("current league is set on ", options[0])
        return getLeagueAbbrivation(options[0]) 
    
    print("Which league are you participating in? The following leagues are open:")
    infoMethodCall("",getLeagueOptions())
    print("please type in the correct abbreviation.")

    while True:
        selectedLeague = input("> ").upper()
        for option in options:
            if selectedLeague == getLeagueAbbrivation(option):
              infoMethodCall("current league is set on ", option)
              return selectedLeague

        errorMethodCall("ERR: " + selectedLeague + " is not a correct abbreviation. Try again please.") 

    return "??" 


def getLeagueAbbrivation(option):
    leagueAbbrivation = ""
    startWriting = False 
    for i in list(option):
        if i == '(':
            startWriting = True
            continue

        if i == ')':
            return leagueAbbrivation.upper()

        if startWriting == True:
            leagueAbbrivation = leagueAbbrivation + i

def checkScheduleEntry(line):
    #example: Little Cup (LC) : 09-11-2020->16-11-2020 : GTM-8
    scheduleParts = line.split(":")
    gameTime = getGameTime(scheduleParts[2].strip())

    dates = scheduleParts[1].split("->") 
    if gameTime > parseTime(dates[0]) and gameTime < parseTime(dates[1]):
        return True
    
    return False

def getGameTime(timeZone):
    if timeZone.startswith("GTM-"):
        digit = re.findall("\d",timeZone)[0]
        return (datetime.utcnow() - timedelta(hours=int(digit),minutes=0))
    
    return datetime.utcnow()

def parseTime(date):
    dateArray = date.split("-")
    return datetime(int(dateArray[2]),int(dateArray[1]),int(dateArray[0]),13,0)
