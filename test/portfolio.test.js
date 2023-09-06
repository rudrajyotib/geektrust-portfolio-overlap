const { expect } = require("chai");
const { describe } = require("mocha");


let fund

describe('Portfolio functions', () => {

    describe('Portfolio base functions', () => {
        beforeEach(() => {
            delete require.cache[require.resolve("../src/portfolio")];
            delete require.cache[require.resolve("../src/funds-definition")];
            fund = require("../src/funds-definition").fundApi
        })

        it('should add valid fund and list', () => {
            const { portfolio } = require("../src/portfolio");
            let folio1 = portfolio()
            let folio2 = portfolio()
            folio1.addFund('ICICI_PRU_NIFTY_NEXT_50_INDEX')
            folio1.addFund('ICICI_PRU_NIFTY_NEXT_50_INDEX_NOT_EXISTS')
            folio2.addFund('PARAG_PARIKH_CONSERVATIVE_HYBRID')
            expect(folio1.exists('ICICI_PRU_NIFTY_NEXT_50_INDEX')).true
            expect(folio1.exists('PARAG_PARIKH_CONSERVATIVE_HYBRID')).false
            expect(folio2.exists('ICICI_PRU_NIFTY_NEXT_50_INDEX')).false
            expect(folio2.exists('PARAG_PARIKH_CONSERVATIVE_HYBRID')).true
            expect(folio1.fundList().has('ICICI_PRU_NIFTY_NEXT_50_INDEX_NOT_EXISTS')).true
            expect(folio1.fundList().has('ICICI_PRU_NIFTY_NEXT_50_INDEX')).true
        })

    })
})