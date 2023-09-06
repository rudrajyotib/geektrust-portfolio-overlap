const { config } = require("./config");

commands = {

    'CURRENT_PORTFOLIO': (commandLine, folioManager, output) => {
        let fundNames = commandLine.split(' ')
        fundNames.forEach(element => {
            folioManager.addFund(element)
        });
    },
    'CALCULATE_OVERLAP': (commandLine, folioManager, output) => {
        const overlap = folioManager.calculateOverlap(commandLine)
        if (overlap.result === false) {
            output.push('FUND_NOT_FOUND')
        } else {
            overlap.overlapList.forEach(element => {
                if (element.overlapPercent > 0) {
                    output.push([element.source, element.target, element.overlapPercent.toFixed(config.DECIMAL_VALUE) + '%'].join(' '))
                }
            })
        }
    },
    'ADD_STOCK': (commandLine, folioManager, output) => {
        let indexOfSpaceChar = commandLine.indexOf(' ')
        let fundName = commandLine.slice(0, indexOfSpaceChar)
        let stockName = commandLine.slice(indexOfSpaceChar + 1)

        if (!folioManager.addStock(fundName, stockName)) {
            output.push('FUND_NOT_FOUND')
        }
    }

}

module.exports = { commands }