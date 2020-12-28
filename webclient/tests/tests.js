import { createStatistics} from '../scripts/statistics.js'
import { createDataObjectFromUrl} from '../scripts/dataHandling.js'
import { parseDailySets } from '../scripts/dailyscript.js'

on_load()

async function on_load() {
    console.log("--!--TEST PAGE --!--")
    test_Simple_Lead_Statistic()
    test_Lead_Statistic()
    test_Unique_teams()
    await test_Team_Set_Previous_Day()
    await test_Team_Set_Today()
    await test_Multiple_Teams_A_Day()
    await test_Teams_Duplicates()
}

function test_Simple_Lead_Statistic() {
    var id = "testSimpleLeadStatic"

    var data = ["W:a,b,c", "W:c,b,a", "L:d,e,f", "L:d,f,e"]
    var actual = createStatistics(data, 0, false).leads;

    var expected = [{lead:"d", encountered:2}, {lead:"a", encountered:1}, {lead:"c", encountered:1}]

    if(!areEqualLeads(expected, actual)) {
        markTest(id, false)
        return;
    }

    markTest(id, true)
} 

function test_Lead_Statistic() {
    var id = "testLeadStatic"

    var data = ["W:a,b,c", "W:c,b,a", "L:d,e,f", "L:d,f,e", "W:a,d,f", "L:a,b,e"]
    var actual = createStatistics(data, 0, false).leads;

    var expected = [{lead:"a", encountered:3}, {lead:"d", encountered:2}, {lead:"c", encountered:1}]

    if(!areEqualLeads(expected, actual)) {
        markTest(id, false)
        return;
    }

    markTest(id, true)
}

function test_Unique_teams() {
    var id = "testUniqueTeams"

    var data = ["W:a,b,al", "W:g,m,s", "L:a,al,b"]
    var expected = [{lead:"a", backEnd: ["b","al"], encountered:2}, {lead:"g", backEnd: ["m","s"], encountered:1}]
    var actual = createStatistics(data, 0, false).teams;

    if(!areEqualLeads(expected, actual)) {
        markTest(id, false)
        return;
    }
    if(!areEqualTeams(expected, actual, test_Unique_teams)) {
        markTest(id, false)
        return;
    }

    markTest(id, true)
}

async function test_Team_Set_Previous_Day() {
   var id = "testTeamSetPreviousDay";
   var dataObject = await createDataObjectFromUrl("http://localhost:8088/tests/resources/setPreviousDay.txt")

   var teams = parseDailySets(dataObject, parseInt(dataObject.indexes.startOfDay[1])).UserTeams;
   if (teams === undefined || teams.length !== 1) {
        markTest(id, false)
        return;
   }

   var expected = [{lead: "abomasnow", backEnd: ["mew", "gl_stunfisk"]}]
   console.log(expected, teams)
   if (!areEqualTeams(expected, teams, test_Team_Set_Previous_Day)) {
        markTest(id, false)
        return;
   }
   markTest(id, true)
}

async function test_Team_Set_Today() {
   var id = "testTeamSetToday";
   var dataObject = await createDataObjectFromUrl("http://localhost:8088/tests/resources/setTeamToday.txt")

   var teams = parseDailySets(dataObject, parseInt(dataObject.indexes.startOfDay[1])).UserTeams;
   if (teams === undefined || teams.length !== 2) {
        markTest(id, false)
        return;
   }

   var expected = [{lead: "obstagoon", backEnd: ["azumarill","hypno"]},
                   {lead:"rainy_castform", backEnd: ["al_marowak","wigglytuff"]}]
   console.log(expected, teams)
   if (!areEqualTeams(expected, teams, test_Team_Set_Today)) {
        markTest(id, false)
        return;
   }
   
   markTest(id, true)
}

async function test_Multiple_Teams_A_Day() {
   var id = "testMultipleTeamsADay";
   var dataObject = await createDataObjectFromUrl("http://localhost:8088/tests/resources/multipleTeamsADay.txt")

   var teams = parseDailySets(dataObject, parseInt(dataObject.indexes.startOfDay[1])).UserTeams;
   if (teams === undefined || teams.length !== 3) {
        markTest(id, false)
        return;
   }

   var expected = [{lead:"altaria", backEnd: ["umbreon","scafty"]},
                   {lead:"rainy_castform", backEnd: ["al_marowak","wigglytuff"]},
                   {lead:"bastiodon", backEnd: ["medicham","hitmontop"]}]
   if (!areEqualTeams(expected, teams, test_Multiple_Teams_A_Day)) {
        markTest(id, false)
        return;
   }

   markTest(id, true)
}

async function test_Teams_Duplicates() {
   var id = "testTeamsWithDuplicateTeam";
   var dataObject = await createDataObjectFromUrl("http://localhost:8088/tests/resources/teamsWithDuplicateTeam.txt")

   var teams = parseDailySets(dataObject, parseInt(dataObject.indexes.startOfDay[0])).UserTeams;
   console.log(teams)
   if (teams === undefined || teams.length !== 2) {
        markTest(id, false)
        return;
   }

   var expected = [{lead:"abomasnow", backEnd: ["mew","gl_stunfisk"]},
                   {lead:"dewgong", backEnd: ["azumaril","tentacool"]}]
   if (!areEqualTeams(expected, teams, test_Teams_Duplicates)) {
        markTest(id, false)
        return;
   }
   
   markTest(id, true)
}


function areEqualLeads(expected, actual) {
    if (actual.length !== expected.length) {
       return false;
    }

    for(var i = 0 ; i < actual.length; i++) {
        if (actual[i].lead !== expected[i].lead || actual[i].encountered !== expected[i].encountered) {
            return false;
        }
    }

    return true;
}

function areEqualTeams(expected, actual, func) {
    if (expected.length !== actual.length) {
        return false;
    }

    for(var i = 0; i < actual.length; i++) {
        if (actual[i].lead !== expected[i].lead) {
            console.log(func.name, "mismatch in leads", actual[i].lead, "!==", expected[i].lead)
            return false;
        }

        if (actual[i].backEnd.length !== expected[i].backEnd.length) {
            console.log(func.name, "backEnd pokemons length is not the same")
            return false;
        }

        for (var j = 0; j < actual[i].backEnd.length; j++) {
            if (actual[i].backEnd[j] !== expected[i].backEnd[j]) {
                console.log(func.name, "mismatch in backEnd", actual[i].backEnd[j],"!==",expected[i].backEnd[j])
                return false;
            }
        }
    }
    return true;
}


function markTest(id, passed) {
    var testStatus = "testFailed"
    if (passed === true)  {
        testStatus = "testPassed"
    } 

    var testElement = document.getElementById(id)
    var testStatusClass = document.createAttribute("class")
    testStatusClass.value = testStatus 
    testElement.setAttributeNode(testStatusClass)
}