

const portfolioManager = (fundsDefinition, folio) => {
    return {
        addFund: (fundName) => {
            folio.addFund(fundName)
        },
        addStock: (fundName, stockName) => {
            return fundsDefinition.addStockToFund(fundName, stockName)
        },
        calculateOverlap: (fundName) => {
            const overlap = {
                result: false,
                overlapList: []
            }
            if (!fundsDefinition.exists(fundName)) {
                return overlap
            }
            overlap.result = true
            folio.fundList().forEach((fund) => {
                const overlapBetweenFunds = fundsDefinition.calculateOverlap(fundName, fund)
                if (overlapBetweenFunds.result === false) {
                    return
                }
                overlap.overlapList.push({
                    source: fundName,
                    target: fund,
                    overlapPercent: overlapBetweenFunds.overlapPercent
                })
            })
            return overlap
        }
    }
}

module.exports = { portfolioManager }