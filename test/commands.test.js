const { expect } = require("chai");
const { describe } = require("mocha");
const { commands } = require("../src/commands");

let funds
let folio

describe('Commands', ()=>{

    beforeEach(()=>{
        delete require.cache[require.resolve("../src/portfolio")];
        delete require.cache[require.resolve("../src/funds-definition")];
        const { portfolio } = require("../src/portfolio")
        const { fundApi } = require("../src/funds-definition")
        funds = fundApi
        folio = portfolio(funds)
    })

    describe('Current portfolio', ()=>{

        it('should add funds to folio', ()=> {
            // const { portfolio } = require("../src/portfolio")
            // const { fundApi } = require("../src/funds-definition")
            // const folio = portfolio()
            const output = []
            commands['CURRENT_PORTFOLIO']('AXIS_BLUECHIP ICICI_PRU_BLUECHIP UTI_NIFTY_INDEX', folio, funds, output)
            expect(folio.exists('AXIS_BLUECHIP')).true
            expect(folio.exists('ICICI_PRU_BLUECHIP')).true
            expect(folio.exists('UTI_NIFTY_INDEX')).true
            expect(output).empty
        })
        
        it('should add funds to folio more than once', ()=> {
            // const { portfolio } = require("../src/portfolio")
            // const { fundApi } = require("../src/funds-definition")
            // const folio = portfolio()
            const output = []
            commands['CURRENT_PORTFOLIO']('AXIS_BLUECHIP ICICI_PRU_BLUECHIP UTI_NIFTY_INDEX', folio, funds, output)
            expect(folio.exists('AXIS_BLUECHIP')).true
            expect(folio.exists('ICICI_PRU_BLUECHIP')).true
            expect(folio.exists('UTI_NIFTY_INDEX')).true
            expect(folio.exists('MIRAE_ASSET_EMERGING_BLUECHIP')).false
            commands['CURRENT_PORTFOLIO']('MIRAE_ASSET_EMERGING_BLUECHIP', folio, funds, output)
            expect(folio.exists('AXIS_BLUECHIP')).true
            expect(folio.exists('ICICI_PRU_BLUECHIP')).true
            expect(folio.exists('UTI_NIFTY_INDEX')).true
            expect(folio.exists('MIRAE_ASSET_EMERGING_BLUECHIP')).true
            expect(output).empty
        })
    })

    describe('Add stock to fund', ()=>{
        it('should add valid stock to fund', ()=>{
            // const { portfolio } = require("../src/portfolio")
            // const { fundApi } = require("../src/funds-definition")
            // const folio = portfolio()
            const output = []
            let stockList = funds.stocks('SBI_LARGE_&_MIDCAP')
            expect(stockList.length).equal(53)
            commands['ADD_STOCK']('SBI_LARGE_&_MIDCAP HDFC BANK INDIA', folio, funds, output)
            expect(output).empty
            stockList = funds.stocks('SBI_LARGE_&_MIDCAP')
            expect(stockList.length).equal(54)
            expect(stockList.filter((element)=>{
                return element === 'HDFC BANK INDIA'   
            }).length).equal(1)
        })

        it('should report invalid fund', ()=>{
            // const { portfolio } = require("../src/portfolio")
            // const { fundApi } = require("../src/funds-definition")
            // const folio = portfolio()
            const output = []
            let stockList = funds.stocks('SBI_LARGE_&_MIDCAP')
            expect(stockList.length).equal(53)
            commands['ADD_STOCK']('SBI_LARGE_&_MIDCAP HDFC BANK INDIA', folio, funds, output)
            expect(output).empty
            stockList = funds.stocks('SBI_LARGE_&_MIDCAP')
            expect(stockList.length).equal(54)
            commands['ADD_STOCK']('SBI_LARGE_&_MIDCAP_NOWHERE HDFC BANK INDIA',folio, funds, output)
            expect(output.length).equal(1)
            expect(output[0]).equal('FUND_NOT_FOUND')
        })
    })

    describe('calculate overlap', ()=>{
        it('should calculate overlap', ()=>{
            // const { portfolio } = require("../src/portfolio")
            // const { fundApi } = require("../src/funds-definition")
            // const folio = portfolio()
            const output = []
            folio.addFund('AXIS_BLUECHIP')
            folio.addFund('ICICI_PRU_BLUECHIP')
            folio.addFund('UTI_NIFTY_INDEX')

            commands['CALCULATE_OVERLAP']('MIRAE_ASSET_EMERGING_BLUECHIP', folio,funds, output)
            expect(output.length).equal(3)
            expect(output[0]).equal('MIRAE_ASSET_EMERGING_BLUECHIP AXIS_BLUECHIP 39.13%')
            expect(output[1]).equal('MIRAE_ASSET_EMERGING_BLUECHIP ICICI_PRU_BLUECHIP 38.10%')
            expect(output[2]).equal('MIRAE_ASSET_EMERGING_BLUECHIP UTI_NIFTY_INDEX 65.52%')

        })
        
        it('should report no fund error', ()=>{
            // const { portfolio } = require("../src/portfolio")
            // const { fundApi } = require("../src/funds-definition")
            // const folio = portfolio()
            const output = []
            folio.addFund('AXIS_BLUECHIP')
            folio.addFund('ICICI_PRU_BLUECHIP')
            folio.addFund('UTI_NIFTY_INDEX')

            commands['CALCULATE_OVERLAP']('NIPPON_INDIA_PHARMA_FUND', folio, funds, output)
            expect(output.length).equal(1)
            expect(output[0]).equal('FUND_NOT_FOUND')

        })
        
        it('should not report no overlap', ()=>{
            // const { portfolio } = require("../src/portfolio")
            // const { fundApi } = require("../src/funds-definition")
            // const folio = portfolio()
            const output = []
            folio.addFund('ICICI_PRU_NIFTY_NEXT_50_INDEX')
            folio.addFund('PARAG_PARIKH_CONSERVATIVE_HYBRID')
            folio.addFund('ICICI_PRU_BLUECHIP')

            commands['CALCULATE_OVERLAP']('SBI_LARGE_&_MIDCAP', folio, funds, output)
            expect(output.length).equal(1)
            expect(output[0]).equal('SBI_LARGE_&_MIDCAP PARAG_PARIKH_CONSERVATIVE_HYBRID 8.47%')

        })
    })
})