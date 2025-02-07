const { log } = require("node:console");
const fs = require("node:fs");
const { exit } = require("node:process");

const fileName = "joakim.csv";

const fileContent = fs.readFileSync(`./logbooks/${fileName}`, "utf-8");

let workingContent = fileContent.split("\n");

let blockHrs = 0;
let flightCounter = 0;
let totalOutput = "";

let Y, M, T, R, S, O, A, departureInput, arrivalInput, landing, notLanding, PIC, rteArpt1, rteArpt2;

process.argv.slice(2).forEach(arg => {
    if (!arg.includes(":")) {
        arg += ":"
    }
    const inp = arg.split(":")[0].toUpperCase();
    const argData = arg.split(":")[1].toUpperCase();

    if(inp == "Y") { //Year
        Y = argData;
    } else if(inp == "M") { //Month
        M = argData;
    } else if(inp == "R") { //Reg
        R = argData;
    } else if(inp == "T") { //Type
        T = argData;
    } else if(inp == "S") { //timeSpan
        S = timespan(argData);
    } else if(inp == "O") {
        O = argData;
    }  else if(inp == "A") { //Airport
        A = argData;
    } else if(inp == "PIC") { //Reg
        PIC = argData;
    }  else if(inp == "LAND") { //Airport
        landing = true;
    }  else if(inp == "NOLAND") { //Airport
        notLanding = true;
    }  else if(inp == "DEP") { //Airport
        departureInput = argData;
    }  else if(inp == "ARR") { //Airport
        arrivalInput = argData;
    }  else if(inp == "RTE") { //Airport
        rteArpt1 = argData.split("-")[0];
        rteArpt2 = argData.split("-")[1];
    } else if(inp == "HELP") {
        console.log("You can use arguments to filter flights.");
        console.log("If you only wanna se the flights from 2025 you type 'y:2025'.");
        console.log("You can combine how ever many commands you want.");
        console.log("\nFull list of commands:");
        console.log("Year Y:xxxx \nMonth M:xx \nType T:xxx \nRegistration R:xxxxx  \nSpan months S:xx-xx \nFilter airport A:xxx \nOutput to file O:fileName \nDeparture station DEP:xxx \nArrival station ARR:xxx \nPilot in command PIC:employee number \nAll flights between two airports RTE:xxx-xxx");
        console.log("\nStatic flags")
        console.log("To see only flights you have landed type: LAND \nTo see only flights you have NOT landed type: NOLAND")
        return process.exit();
    } else {
        console.log(`${inp} is not a command.`);
        console.log(`To see all commands type 'help' in the command line.`);
        return process.exit();
    }
});

workingContent = workingContent.reverse();

workingContent.forEach(flight => {
    if(flight.includes("Employee")) {
        return;
    }

    let details = flight.split(",");

    const dep = details[2].split("-")[2];
    const arr = details[2].split("-")[3].slice(0,-1);
    const year = details[3].split("-")[0].split('"')[1];
    const month = parseInt(details[3].split("-")[1]);
    const day = details[3].split("-")[2].replaceAll('"', '');
    const depTime = details[4].replaceAll('"', '').slice(0, 5);
    const arrTime = details[6].replaceAll('"', '').slice(0, 5);
    const reg = details[7].replaceAll('"', '');
    const type = details[8].replaceAll('"', '');
    const land = details[10].replaceAll('"', '');
    const capt = details[11].replaceAll('"', '');
    const flightNr = details[2].split("-")[0].replaceAll('"', '');
    let flightTime = details[9];
    let blockHrsDecimal = min2hrs(flightTime);

    // Filter section
    if (filterThis(Y, year)) return;
    if (filterThis(M, month)) return;
    if (filterThis(R, reg)) return;
    if (filterThis(T, type)) return;
    if (filterSpan(S, month)) return;
    if (filterThis(departureInput, dep)) return;
    if (filterThis(arrivalInput, arr)) return;
    if (filterThis(A, dep) && filterThis(A, arr)) return;
    if (filterThis(PIC, capt)) return;
    if (rteArpt1 && rteArpt1 != dep && rteArpt1 != arr) return;
    if (rteArpt2 && rteArpt2 != dep && rteArpt2 != arr) return;
    
    if(landing) {
        if(land == "false") {
            return;
        }
    }
    if(notLanding) {
        if(land == "true") {
            return;
        }
    }


    if(flightTime.length < 3) {
        flightTime=0+flightTime;
    }

    // DIff months
    // 4,5,7
    // 6 only 0.1 diff

    // 11 is the big fuck off


    const output = `${dep}-${arr} Flight time minutes: ${flightTime}. Block hrs: ${blockHrsDecimal}   ${month}/${year}.`;
    const testOutput = `${year}-${month}-${day} ${dep} ${depTime} ${arr} ${arrTime} ${type} ${reg} ${capt} ${flightNr}`;
    console.log(testOutput);
    totalOutput += testOutput + "\n";
    blockHrs += blockHrsDecimal;
    flightCounter++;
});
totalOutput += "\nBlock hours for selected period: " + Math.round(blockHrs*10)/10 + " hrs";
console.log(Math.round(blockHrs*10)/10);
console.log(`Total flights: ${flightCounter}`)
if(O) {
    fs.writeFileSync(O+".txt", totalOutput);
}

function min2hrs(minutes) {
    return Math.round(minutes/6)/10;
}

function filterThis(consoleInput, logbookEntry) {
    if(consoleInput && consoleInput != logbookEntry) {
        return true;
    } else {
        return false;
    }
}


function timespan(spanInput) {
    let span = {};
    const splitInput = spanInput.split("-");
    span.lower = parseInt(splitInput[0]);
    span.upper = parseInt(splitInput[1]);

    return span;
}

function filterSpan(span, currentMonth) {    
    if(!span) return false;
    if(span.lower <= currentMonth && span.upper >= currentMonth) {
        return false;
    } else {
        return true;
    }
}