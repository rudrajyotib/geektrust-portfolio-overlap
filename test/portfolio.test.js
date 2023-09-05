const { expect } = require("chai");
const { describe } = require("mocha");


let fund

describe('Portfolio functions', () => {

    

    describe('Portfolio base functions', () => {
        beforeEach(()=>{
            delete require.cache[require.resolve("../src/portfolio")];
            delete require.cache[require.resolve("../src/funds-definition")];
            fund = require("../src/funds-definition").fundApi
        })
        
        it('should add valid fund', () => {
            const { portfolio } = require("../src/portfolio");
            let folio1 = portfolio(fund)
            let folio2 = portfolio(fund)
            folio1.addFund('ICICI_PRU_NIFTY_NEXT_50_INDEX')
            folio2.addFund('PARAG_PARIKH_CONSERVATIVE_HYBRID')
            expect(folio1.exists('ICICI_PRU_NIFTY_NEXT_50_INDEX')).true
            expect(folio1.exists('PARAG_PARIKH_CONSERVATIVE_HYBRID')).false
            expect(folio2.exists('ICICI_PRU_NIFTY_NEXT_50_INDEX')).false
            expect(folio2.exists('PARAG_PARIKH_CONSERVATIVE_HYBRID')).true
        })

        it('should not add invalid fund', ()=>{
            const { portfolio } = require("../src/portfolio");
            let folio = portfolio(fund)
            folio.addFund('ICICI_PRU_NIFTY_NEXT_50_INDEX')
            folio.addFund('PARAG_PARIKH_CONSERVATIVE_HYBRID_NONE')
            expect(folio.exists('PARAG_PARIKH_CONSERVATIVE_HYBRID_NONE')).false
            expect(folio.exists('ICICI_PRU_NIFTY_NEXT_50_INDEX')).true
        })

        it('should calculate overlap percent', ()=>{
            const { portfolio } = require("../src/portfolio");
            let folio = portfolio(fund)
            folio.addFund('AXIS_BLUECHIP')
            folio.addFund('ICICI_PRU_BLUECHIP')
            folio.addFund('UTI_NIFTY_INDEX')
            const result = folio.overlap('MIRAE_ASSET_EMERGING_BLUECHIP')
            expect(result.result).true
            const overlapList = result.overlapList
            expect(overlapList.filter((fund)=>{
                return fund.target === 'AXIS_BLUECHIP'
            })[0].overlapPercent.toFixed(2)).equal('39.13')
            expect(overlapList.filter((fund)=>{
                return fund.target === 'ICICI_PRU_BLUECHIP'
            })[0].overlapPercent.toFixed(2)).equal('38.10')
            expect(overlapList.filter((fund)=>{
                return fund.target === 'UTI_NIFTY_INDEX'
            })[0].overlapPercent.toFixed(2)).equal('65.52')
            expect(overlapList.filter((fund)=>{
                return fund.source === 'MIRAE_ASSET_EMERGING_BLUECHIP'
            }).length).equal(3)
        })

        it('should not calculate overlap for a fund that does not exist', ()=>{
            const { portfolio } = require("../src/portfolio");
            let folio = portfolio(fund)
            folio.addFund('AXIS_BLUECHIP')
            const result = folio.overlap('MIRAE_ASSET_EMERGING_BLUECHIP_NOT_EXIXST')
            expect(result.result).false
        })
        
    })
})