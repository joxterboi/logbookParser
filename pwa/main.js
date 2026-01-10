import { min2hrs, sort, loadButtons, printAll, flightClickable } from "./js/util.js";

document.getElementById("loadLogbook")?.addEventListener("click", () => {
    loadLogBook()
})




async function loadLogBook() {
    const fileContent = await fetchLogBook();
    const totals = calculate(fileContent);
    const sorted = sortEntries(totals);
    printAll(sorted)
    localStorage.setItem("flights", JSON.stringify(totals))

    loadButtons()
    flightClickable()
}

async function fetchLogBook() {
    const logPath = "./books/joakim.csv"
    const res = await fetch(logPath)
    const content = await res.text()

    return content
}

function calculate(fileContent) {
    const entries = fileContent.split("\n");
    const totals = [];


    entries.forEach(flight => {
        if (flight.includes("Employee")) {
            return;
        }

        const total = {}

        let details = flight.split(",");

        total.dep = details[2].split("-")[2];
        total.arr = details[2].split("-")[3].slice(0, -1);
        total.year = details[3].split("-")[0].split('"')[1];
        total.month = parseInt(details[3].split("-")[1]);
        total.day = details[3].split("-")[2].replaceAll('"', '');
        total.depTime = details[4].replaceAll('"', '').slice(0, 5);
        total.arrTime = details[6].replaceAll('"', '').slice(0, 5);
        total.reg = details[7].replaceAll('"', '');
        total.type = details[8].replaceAll('"', '');
        total.land = details[10].replaceAll('"', '');
        total.capt = details[11].replaceAll('"', '');
        total.flightNr = details[2].split("-")[0].replaceAll('"', '');
        total.flightTime = details[9];
        total.blockHrsDecimal = min2hrs(total.flightTime);

        total.fid = (total.depTime + total.day + total.month + total.year).replaceAll(":", "")

        totals.push(total)

    })

    return totals;

}

function sortEntries(entries) {
    const sortedYears = sort(entries, "year");

    Object.entries(sortedYears).forEach(year => {
        const months = sort(year[1], "month");

        Object.entries(months).forEach(month => {
            const days = sort(month[1], "day");
            months[month[0]] = days

        })

        sortedYears[year[0]] = months
    })

    return sortedYears
}

