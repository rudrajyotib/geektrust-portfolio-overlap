const { expect } = require("chai");
const { describe, it } = require("mocha");
const { portfolio } = require("../src/portfolio");

let fundApi

describe('Operations on portfolio and funds', ()=>{

    beforeEach(()=>{
        delete require.cache[require.resolve("../src/funds-definition")];
        fundApi = require("../src/funds-definition").fundApi;
    })

    describe("add stocks to funds", () => {
        it('add stocks to fund and calculate overlap -set1', ()=>{
            let folio = portfolio(fundApi)
            folio.addFund('AXIS_BLUECHIP')
            folio.addFund('ICICI_PRU_BLUECHIP')
            folio.addFund('UTI_NIFTY_INDEX')
            let overlap = folio.overlap('MIRAE_ASSET_EMERGING_BLUECHIP')
            expect(overlap.result).true
            expect(overlap.overlapList.length).equal(3)
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'AXIS_BLUECHIP'
            })[0].overlapPercent.toFixed(2)).equal('39.13')
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'ICICI_PRU_BLUECHIP'
            })[0].overlapPercent.toFixed(2)).equal('38.10')
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'UTI_NIFTY_INDEX'
            })[0].overlapPercent.toFixed(2)).equal('65.52')
            
            overlap = folio.overlap('MIRAE_ASSET_LARGE_CAP')
            expect(overlap.result).true
            expect(overlap.overlapList.length).equal(3)
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'AXIS_BLUECHIP'
            })[0].overlapPercent.toFixed(2)).equal('43.75')
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'ICICI_PRU_BLUECHIP'
            })[0].overlapPercent.toFixed(2)).equal('44.62')
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'UTI_NIFTY_INDEX'
            })[0].overlapPercent.toFixed(2)).equal('95.00')

            expect(fundApi.addStockToFund('AXIS_BLUECHIP', 'TCS')).true

            overlap = folio.overlap('MIRAE_ASSET_EMERGING_BLUECHIP')
            expect(overlap.result).true
            expect(overlap.overlapList.length).equal(3)
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'AXIS_BLUECHIP'
            })[0].overlapPercent.toFixed(2)).equal('38.71')
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'ICICI_PRU_BLUECHIP'
            })[0].overlapPercent.toFixed(2)).equal('38.10')
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'UTI_NIFTY_INDEX'
            })[0].overlapPercent.toFixed(2)).equal('65.52')
            
        })
        
        it('add stocks to fund and calculate overlap -set2', ()=>{
            let folio = portfolio(fundApi)
            folio.addFund('UTI_NIFTY_INDEX')
            folio.addFund('AXIS_MIDCAP')
            folio.addFund('PARAG_PARIKH_FLEXI_CAP')
            let overlap = folio.overlap('ICICI_PRU_NIFTY_NEXT_50_INDEX')
            expect(overlap.result).true
            expect(overlap.overlapList.length).equal(3)
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'UTI_NIFTY_INDEX'
            })[0].overlapPercent.toFixed(2)).equal('20.37')
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'AXIS_MIDCAP'
            })[0].overlapPercent.toFixed(2)).equal('14.81')
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'PARAG_PARIKH_FLEXI_CAP'
            })[0].overlapPercent.toFixed(2)).equal('7.41')

            overlap = folio.overlap('NIPPON_INDIA_PHARMA_FUND')
            expect(overlap.result).false

            expect(fundApi.addStockToFund('PARAG_PARIKH_FLEXI_CAP','NOCIL')).true
            expect(fundApi.addStockToFund('AXIS_MIDCAP','NOCIL')).true

            overlap = folio.overlap('ICICI_PRU_NIFTY_NEXT_50_INDEX')
            expect(overlap.result).true
            expect(overlap.overlapList.length).equal(3)
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'UTI_NIFTY_INDEX'
            })[0].overlapPercent.toFixed(2)).equal('20.37')
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'AXIS_MIDCAP'
            })[0].overlapPercent.toFixed(2)).equal('14.68')
            expect(overlap.overlapList.filter((element)=>{
                return element.target === 'PARAG_PARIKH_FLEXI_CAP'
            })[0].overlapPercent.toFixed(2)).equal('7.32')
        })
    });
    
})