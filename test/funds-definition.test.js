const { expect } = require("chai");
const { describe, it } = require("mocha");
const { fundApi } = require("../src/funds-definition");

let funds

describe("Funds definition", () => {

    beforeEach(() => {
        delete require.cache[require.resolve("../src/funds-definition")];
        funds = fundApi
    })

    it("should list funds and check exists or not", () => {
        expect(funds.exists('No I do not')).to.be.false
        expect(funds.exists('ICICI_PRU_NIFTY_NEXT_50_INDEX')).true
        expect(funds.exists('UTI_NIFTY_INDEX')).true
    })

    it("should return list of stocks if fund exists", () => {
        expect(funds.stocks('ICICI_PRU_NIFTY_NEXT_50_INDEX').length).equal(51)
    })

    it("should return empty list if fund does not exist", () => {
        expect(funds.stocks('I do not exist')).empty
    })

    it("should return clone of original list", () => {
        let stocks = funds.stocks('ICICI_PRU_NIFTY_NEXT_50_INDEX')
        stocks.push('SomeStock')
        expect(stocks.length).equal(52)
        expect(funds.stocks('ICICI_PRU_NIFTY_NEXT_50_INDEX').length).equal(51)
    })

    it('should add stock to an existing fund', () => {
        expect(funds.stocks('SBI_LARGE_&_MIDCAP').length).equal(53)
        expect(funds.addStockToFund('SBI_LARGE_&_MIDCAP', 'TCS')).true
        expect(funds.stocks('SBI_LARGE_&_MIDCAP').length).equal(54)
    })

    it('should not add stock to a fund that does not exist', () => {
        expect(funds.addStockToFund('ICICI_PRU_NIFTY_NEXT_50_INDEX_NONE', 'TCS')).false
    })

    describe('overlap percent', () => {
        it('calculates overlap', () => {
            let overlap = fundApi.calculateOverlap('SBI_LARGE_&_MIDCAP', 'PARAG_PARIKH_CONSERVATIVE_HYBRID')
            expect(overlap.result).true
            expect(overlap.overlapPercent.toFixed(2)).equal('8.40')
        })

        it('should report non-existent fund', () => {
            let overlap = fundApi.calculateOverlap('SBI_LARGE_&_MIDCAP', 'INVALID_FUND')
            expect(overlap.result).false
            fundApi.calculateOverlap('INVALID_FUND', 'SBI_LARGE_&_MIDCAP')
            expect(overlap.result).false
        })

        it('should report zero overlap', () => {
            let overlap = fundApi.calculateOverlap('SBI_LARGE_&_MIDCAP', 'ICICI_PRU_NIFTY_NEXT_50_INDEX')
            expect(overlap.result).true
            expect(overlap.overlapPercent).equal(0)
        })
    })

});
