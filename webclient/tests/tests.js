import { createStatistics} from '../scripts/statistics.js'
import { createDataObjectFromUrl} from '../scripts/dataHandling.js'
import { showTeams, initTeams } from '../scripts/teams.js'

on_load()

async function on_load() {
    console.log("--!--TEST PAGE --!--")
    test_Simple_Lead_Statistic()
    test_Lead_Statistic()
    test_Unique_teams()
    await test_Team_Set_Previous_Day()
}

function test_Simple_Lead_Statistic() {
    var id = "testSimpleLeadStatic"

    var data = ["W:a,b,c", "W:c,b,a", "L:d,e,f", "L:d,f,e"]
    var actual = createStatistics(data, 0, false).leads;

    var expected = [{lead:"d", encountered:2}, {lead:"a", encountered:1}, {lead:"c", encountered:1}]

    console.log(actual)
    if(arrayCheck(expected, actual, false) === false) {
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

    if(arrayCheck(expected, actual, false) === false) {
        markTest(id, false)
        return;
    }

    markTest(id, true)
}

function test_Unique_teams() {
    var id = "testUniqueTeams"

    var data = ["W:a,b,al", "L:a,al,b", "W:g,m,s"]
    var expected = [{lead:"a", backEnd: ["b","al"], encountered:2}, {lead:"g", backEnd: ["m","s"], encountered:1}]
    console.log("testing unique teams")
    var actual = createStatistics(data, 0, false).teams;

    console.log(actual)
    if(arrayCheck(expected, actual, true) === false) {
        markTest(id, false)
        return;
    }

    markTest(id, true)
}

async function test_Team_Set_Previous_Day() {
   var id = "testTeamSetPreviousDay";
   var dataObject = await createDataObjectFromUrl("http://localhost:8088/tests/resources/setPreviousDay.txt")
   initTeams(dataObject)

   console.log("teams is undefined in test with id:", test_Team_Set_Previous_Day.name)
   var teams = showTeams(parseInt(dataObject.indexes.startOfDay[1]))
   if (teams === undefined || teams.length !== 1) {
        markTest(id, false)
        return;
   }

   var expected = ["abomasnow","mew","gl_stunfisk"]
   for (var i = 0; i < expected.length; i++) {
       if (expected[i] !== teams[0][i]) {
            markTest(id, false)
       }
   }
   markTest(id, true)
}

function arrayCheck(expected, actual, teamFlag) {
    if (actual.length !== expected.length) {
       return false;
    }

    for(var i = 0 ; i < actual.length; i++) {
        if (actual[i].lead !== expected[i].lead || actual[i].encountered !== expected[i].encountered) {
            return false;
        }

        if (teamFlag === true) {
            if (actual[i].backEnd.length !== expected[i].backEnd.length) {
                return false;
            }

            for (var j = 0; j < actual[i].backEnd.length; j++) {
                if (actual[i].backEnd[j] !== expected[i].backEnd[j]) {
                    return false;
                }
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