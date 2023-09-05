const { fundApi } = require("./funds-definition")

const calculateOverlap = (stocks1, stocks2) => {
    let stocksInCommon = 0
    stocks1.forEach((value, key, set) => {
        if (stocks2.has(value)) {
            ++stocksInCommon;
        }
    })
    return ((2 * stocksInCommon) / (stocks1.size + stocks2.size)) * 100
}


const portfolio = (funds) => {

    const fundsInFolio = new Set()

    return {
        addFund: (fundName) => {
            if (!funds.exists(fundName)) {
                return
            }
            fundsInFolio.add(fundName)
        },
        exists: (fundName) => {
            return fundsInFolio.has(fundName)
        },
        overlap: (fundName) => {
            if (!funds.exists(fundName)) {
                return { result: false }
            }
            overlapList = []
            fundsInFolio.forEach((value) => {
                overlapList.push({
                    source: fundName,
                    target: value,
                    overlapPercent: calculateOverlap(new Set(funds.stocks(fundName)), new Set(funds.stocks(value)))
                })
            })
            return { result: true, overlapList: overlapList }
        }
    }

}

module.exports = { portfolio }