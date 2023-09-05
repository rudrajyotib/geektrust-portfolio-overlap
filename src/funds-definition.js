const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'resources', 'funds.json'), { encoding: 'utf8', flag: 'r' }))

const fundDictionary = new Map()

    data.funds.forEach((element) => {
        let set = new Set(element.stocks);
        fundDictionary.set(element.name, set)
    });

const fundInterface = {

        exists: (fundName) => {
            return fundDictionary.has(fundName)
        },
        stocks: (fundName) => {
            if (!fundDictionary.has(fundName)) {
                return []
            }
            return Array.from(fundDictionary.get(fundName))
        },
        addStockToFund: (fundName, stockName) => {
            if (!fundDictionary.has(fundName)) {
                return false
            }
            fundDictionary.get(fundName).add(stockName)
            return true
        }
}



module.exports = { fundApi :fundInterface}
