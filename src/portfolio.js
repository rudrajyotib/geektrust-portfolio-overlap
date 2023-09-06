const portfolio = () => {
    const fundsInFolio = new Set()
    return {
        addFund: (fundName) => {
            fundsInFolio.add(fundName)
        },
        exists: (fundName) => {
            return fundsInFolio.has(fundName)
        },
        fundList: () => {
            return new Set(fundsInFolio)
        }
    }
}

module.exports = { portfolio }