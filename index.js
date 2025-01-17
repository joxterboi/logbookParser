const { log } = require("node:console");
const fs = require("node:fs");
const { exit } = require("node:process");

const fileName = "joakim.csv";

const fileContent = fs.readFileSync(fileName, "utf-8");

let workingContent = fileContent.split("\n");

let blockHrs = 0;

let Y, M, T, R

process.argv.slice(2).forEach(arg => {
    const argData = arg.slice(2).toUpperCase();
    const inp = arg.slice(0,2).toUpperCase();
    if(inp == "Y:") {
        Y = argData;
    } else if(inp == "M:") {
        M = argData;
    } else if(inp == "R:") {
        R = argData;
    } else if(inp == "T:") {
        T = argData;
    } else if(arg.toUpperCase() == "HELP") {
        console.log("You can use arguments to filter flights.");
        console.log("If you only wanna se the flights from 2025 you type 'y:2025'.");
        console.log("You can combine how ever many commands you want.");
        console.log("\nFull list of commands:");
        console.log("Year Y:xxxx \nMonth M:xx \nType T:xxx \nRegistration R:xxxxx")
        return process.exit();
    } else {
        console.log(`${arg} is not a command.`);
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
    const month = details[3].split("-")[1];
    const day = details[3].split("-")[2].replaceAll('"', '');
    const depTime = details[4].replaceAll('"', '').slice(0, 5)
    const arrTime = details[6].replaceAll('"', '').slice(0, 5)
    const reg = details[7].replaceAll('"', '');
    const type = details[8].replaceAll('"', '');
    const capt = details[11].replaceAll('"', '');
    const flightNr = details[2].split("-")[0].replaceAll('"', '');
    let flightTime = details[9];
    let blockHrsDecimal = min2hrs(flightTime);

    // Filter section
    if (filterThis(Y, year)) return;
    if (filterThis(M, month)) return;
    if (filterThis(R, reg)) return;
    if (filterThis(T, type)) return;



    if(flightTime.length < 3) {
        flightTime=0+flightTime
    }

    // DIff months
    // 4,5,7
    // 6 only 0.1 diff

    // 11 is the big fuck off


    const output = `${dep}-${arr} Flight time minutes: ${flightTime}. Block hrs: ${blockHrsDecimal}   ${month}/${year}.`;
    const testOutput = `${year}-${month}-${day} ${dep} ${depTime} ${arr} ${arrTime} ${type} ${reg} ${capt} ${flightNr}`;
    console.log(testOutput);
    blockHrs += blockHrsDecimal;
});

console.log(Math.round(blockHrs*10)/10)

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