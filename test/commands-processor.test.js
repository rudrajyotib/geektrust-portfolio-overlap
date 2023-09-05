const { expect } = require("chai");
const { describe } = require("mocha");
const { commandProcessor } = require("../src/command-processor");
const { portfolio } = require("../src/portfolio")
const { fundApi } = require("../src/funds-definition")

describe('commands processor', () => {
    beforeEach(() => {
        delete require.cache[require.resolve("../src/portfolio")];
        delete require.cache[require.resolve("../src/funds-definition")];
    })

    it('scenario 1', () => {
        
        
        const folio = portfolio(fundApi)
        const output = []
        const commands = [
            'CURRENT_PORTFOLIO AXIS_BLUECHIP ICICI_PRU_BLUECHIP UTI_NIFTY_INDEX',
            'CALCULATE_OVERLAP MIRAE_ASSET_EMERGING_BLUECHIP',
            'CALCULATE_OVERLAP MIRAE_ASSET_LARGE_CAP',
            'ADD_STOCK AXIS_BLUECHIP TCS',
            'CALCULATE_OVERLAP MIRAE_ASSET_EMERGING_BLUECHIP'
        ]
        commands.forEach(element => {
            commandProcessor(element, folio, fundApi, output)
        });

        expect(output).deep.equal([
            'MIRAE_ASSET_EMERGING_BLUECHIP AXIS_BLUECHIP 39.13%',
            'MIRAE_ASSET_EMERGING_BLUECHIP ICICI_PRU_BLUECHIP 38.10%',
            'MIRAE_ASSET_EMERGING_BLUECHIP UTI_NIFTY_INDEX 65.52%',
            'MIRAE_ASSET_LARGE_CAP AXIS_BLUECHIP 43.75%',
            'MIRAE_ASSET_LARGE_CAP ICICI_PRU_BLUECHIP 44.62%',
            'MIRAE_ASSET_LARGE_CAP UTI_NIFTY_INDEX 95.00%',
            'MIRAE_ASSET_EMERGING_BLUECHIP AXIS_BLUECHIP 38.71%',
            'MIRAE_ASSET_EMERGING_BLUECHIP ICICI_PRU_BLUECHIP 38.10%',
            'MIRAE_ASSET_EMERGING_BLUECHIP UTI_NIFTY_INDEX 65.52%'

        ])
    })

    it('scenario 2', () => {
        // const { portfolio } = require("../src/portfolio")
        // const { fundApi } = require("../src/funds-definition")
        const folio = portfolio(fundApi)
        const output = []
        const commands = [
            'CURRENT_PORTFOLIO UTI_NIFTY_INDEX AXIS_MIDCAP PARAG_PARIKH_FLEXI_CAP',
            'CALCULATE_OVERLAP ICICI_PRU_NIFTY_NEXT_50_INDEX',
            'CALCULATE_OVERLAP NIPPON_INDIA_PHARMA_FUND',
            'ADD_STOCK PARAG_PARIKH_FLEXI_CAP NOCIL',
            'ADD_STOCK AXIS_MIDCAP NOCIL',
            'CALCULATE_OVERLAP ICICI_PRU_NIFTY_NEXT_50_INDEX'
        ]
        commands.forEach(element => {
            commandProcessor(element, folio, fundApi, output)
        });

        expect(output).deep.equal([
            'ICICI_PRU_NIFTY_NEXT_50_INDEX UTI_NIFTY_INDEX 20.37%',
            'ICICI_PRU_NIFTY_NEXT_50_INDEX AXIS_MIDCAP 14.81%',
            'ICICI_PRU_NIFTY_NEXT_50_INDEX PARAG_PARIKH_FLEXI_CAP 7.41%',
            'FUND_NOT_FOUND',
            'ICICI_PRU_NIFTY_NEXT_50_INDEX UTI_NIFTY_INDEX 20.37%',
            'ICICI_PRU_NIFTY_NEXT_50_INDEX AXIS_MIDCAP 14.68%',
            'ICICI_PRU_NIFTY_NEXT_50_INDEX PARAG_PARIKH_FLEXI_CAP 7.32%'
        ])
    })
})