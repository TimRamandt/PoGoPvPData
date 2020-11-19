from datetime import datetime, timedelta
import re
from colorama import Fore 

def getLeagueOptions():
    schedule = open("./leagues/league.schedule", "r").read().splitlines()

    for line in schedule:
        if line.startswith("season"):
            #logic about this soon tm
            continue
        if checkScheduleEntry(line):
            return line.split(":")[0]

    return "error with league.schedule"

def selectLeague():
    options = getLeagueOptions()
    if "," in options:
       #this is probably for season 6
       return ""

    option = ""
    startWriting = False 
    for i in list(options):
        if i == '(':
            startWriting = True
            continue

        if i == ')':
            selectLeagueMessage(options) 
            return option

        if startWriting == True:
            option = option + i

    
    return "unable to retrieve league information :/"



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

def selectLeagueMessage(league):
    print("league set to: " + Fore.CYAN + league)

    #reset the console back to the regular color
    print(Fore.RESET)
