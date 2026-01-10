// @ts-nocheck
export function min2hrs(minutes) {
    return Math.round(minutes / 6) / 10;
}

export function sort(flights, sortBy) {
    const category = {}

    flights.forEach(flight => {
        const currentSort = flight[sortBy];

        if (!category[currentSort]) {
            category[currentSort] = [];
        }
        category[currentSort].push(flight)
    })

    return category
}



export function loadButtons() {
    const buttons = document.getElementsByClassName("expandButton")
    for (const button of buttons) {
        button.addEventListener("click", (e) => {
            const div = e.target.parentElement.parentElement
            const state = button.dataset.state

            if (state == "open") {
                div.style.height = "60px"
                button.dataset.state = "closed"
                button.style.rotate = "180deg"
            } else if (state == "closed") {
                div.style.height = "auto"
                button.dataset.state = "open"
                button.style.rotate = "0deg"
            } else {
                console.error("State is fucked")
            }
        })
    }
}


export function printAll(flights) {
    const output = document.getElementById("logContainer");

    Object.entries(flights).forEach(([year, months]) => {

        // Create a container for each year
        const yearDiv = document.createElement("div");
        yearDiv.classList.add("yearDiv")
        let yearBlh = 0;


        // Create a list for that year's months

        Object.entries(months).forEach(month => {
            // Create a list item for each day
            const monthsDiv = document.createElement("div");
            monthsDiv.classList.add("monthCard")
            let monthBlh = 0;


            Object.entries(month[1]).forEach(day => {
                // Create a list item for each day
                const dayDiv = document.createElement("div");
                dayDiv.classList.add("dayCard")
                let dayBlh = 0;
                

                const flightList = document.createElement("ul");
                day[1].forEach(flight => {
                    const flightEntry = document.createElement("li");
                    flightEntry.classList.add("flightCard")
                    flightEntry.dataset.flightId = flight.fid
                    dayBlh += flight.blockHrsDecimal;

                    const content = `
                        ${flight.flightNr}<br>
                        ${flight.dep}-${flight.arr}<br>
                        BLH: ${flight.blockHrsDecimal}
                    `
                    flightEntry.innerHTML = content;
                    flightList.appendChild(flightEntry);
                })
                dayDiv.innerHTML = `<h4 class="day">Day ${day[0]} - BLH:${roundDecimal(dayBlh)}</h4>` + dayDiv.innerHTML;
                dayDiv.appendChild(flightList)

                monthsDiv.appendChild(dayDiv)
                monthBlh += dayBlh;
            });
            yearBlh += monthBlh
            monthsDiv.innerHTML = `<h3 class="month">Month ${month[0]} - BLH:${roundDecimal(monthBlh)}</h3>` + monthsDiv.innerHTML;
            yearDiv.appendChild(monthsDiv)
        });


        //Ads the styling, at the end because the total time needs to be summed first
        yearDiv.innerHTML = `<div class="yearHeader">
        <h2 class="year">${year} - BLH:${roundDecimal(yearBlh)}</h2>
        <button class="expandButton" data-state="open">/
        \\</button></div>` + yearDiv.innerHTML;

        output ? output.appendChild(yearDiv) : console.log("NO OUTPUT FOUND")
    });
}


export function flightClickable() {
    const flightCards = document.getElementsByClassName("flightCard")
    for (const flightCard of flightCards) {
        flightCard.addEventListener("click", e => {
            loadFlight(e.target.dataset.flightId)
        })
    }
    document.getElementById("closeFlightWindow").addEventListener("click", () => {
        document.getElementById("displayFlightWindow").style.display = "none"
    })
}

export function loadFlight(flightId) {
    const flights = JSON.parse(localStorage.getItem("flights"))
    const correctFlight = flights.find(flight => flight.fid === flightId)

    displayFlight(correctFlight)
}

function displayFlight(flight) {
    document.getElementById("flightNum").innerText = flight.flightNr
    document.getElementById("blockOffTime").innerText = flight.depTime
    document.getElementById("blockOnTime").innerText = flight.arrTime
    document.getElementById("depStation").innerText = flight.dep
    document.getElementById("arrStation").innerText = flight.arr
    document.getElementById("totalBlockTime").innerText = flight.blockHrsDecimal
    document.getElementById("type").innerText = "A" + flight.type
    document.getElementById("date").innerText = `${flight.day}/${("0" + flight.month).slice(-2)}-${flight.year.slice(-2)}`
    document.getElementById("reg").innerText = flight.reg.slice(0, 2) + "-" + flight.reg.slice(2, 5);
    document.getElementById("pic").innerText = flight.capt
    document.getElementById("landed").innerText = flight.land


    document.getElementById("displayFlightWindow").style.display = "block"
}

function roundDecimal(decimalNum) {
    let workingNum = Math.round(decimalNum * 10)/10
    return workingNum
}