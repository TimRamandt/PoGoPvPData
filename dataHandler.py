import os.path
from leagues import getSeasonOptions

def getSeasonFilePath():
    basePath = "./webclient/data/" + getSeasonOptions()[0]
    dataPath = basePath + "/data.txt"
    if os.path.isdir(basePath) != True:
        os.mkdir(basePath)
        f = open(dataPath, "w")
        f.write("x\nx\nx\n")

    return dataPath 