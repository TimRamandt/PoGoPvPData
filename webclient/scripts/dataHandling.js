export {fetchDataObject, createDataObjectFromUrl}

async function fetchDataObject() {
    return await createDataObjectFromUrl("http://localhost:8088/data/s6/data.txt")
}

//only use this in tests
async function createDataObjectFromUrl(location) {
    const dataResponse = await fetch(location)
    const dataRaw = (await dataResponse.text()).split("\n")
    
    var indexesObject = {startOfDay:dataRaw[0].split(";"), teamIndexes: dataRaw[1].split(";")}
    return {indexes:indexesObject, data:dataRaw}
}