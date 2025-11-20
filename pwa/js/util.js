export function min2hrs(minutes) {
    return Math.round(minutes/6)/10;
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