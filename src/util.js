const calculateOverlap = (stocks1, stocks2) => {
    let stocksInCommon = 0
    stocks1.forEach((value, key, set) => {
        if (stocks2.has(value)) {
            ++stocksInCommon;
        }
    })
    return ((2 * stocksInCommon) / (stocks1.size + stocks2.size)) * 100
}

module.exports = { calculateOverlap }