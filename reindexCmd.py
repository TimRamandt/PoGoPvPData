from dataHandler import getSeasonFilePath
import enum

class IndexType(enum.Enum):
   StartOfDay = 0
   TeamSwitch = 1
   LeagueSwitch = 2 

def executeReIndex(userInput):
    if userInput.strip() == "reindex":
        dataPath = getSeasonFilePath()
        content = open(dataPath, "r").read().splitlines()

        if len(content) <= 3:
            open(dataPath, "w").write("x\nx\nx\n")
            print("done!")
            return 

        lineIndex = 2
        indexes = ["x", "x", "x"]
        while lineIndex < len(content):
        
            if content[lineIndex].startswith('- '):
                indexes = appendIndex(indexes, IndexType.StartOfDay, lineIndex)

            if content[lineIndex].startswith('~ts'):
                indexes = appendIndex(indexes, IndexType.TeamSwitch, lineIndex)

            lineIndex = lineIndex + 1

        for i in range(0,3): 
            if indexes[i] != "x":
                content[i] = indexes[i][:-1] 
                continue
         
            content[i] = indexes[i]

        with open(dataPath, "w") as f:
            for i,line in enumerate(content,0):
                f.write(line + "\n")

        return ("","")

    return "OTHER_COMMAND"

def appendIndex(indexes, indexType, lineIndex):
    if indexes[indexType.value] == "x":
        indexes[indexType.value] = ""

    indexes[indexType.value] = indexes[indexType.value] + str(lineIndex) + ";" 
    return indexes
