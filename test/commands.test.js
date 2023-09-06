const { expect } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
const { commands } = require("../src/commands");
const { portfolioManager } = require("../src/portfolio-manager");

let folioManager
let mockFolioManager

describe('Commands', () => {

    before(() => {
        folioManager = portfolioManager({}, {})
    })


    beforeEach(() => {
        mockFolioManager = sinon.mock(folioManager)
    })

    afterEach(() => {
        mockFolioManager.restore()
    })

    describe('Current portfolio', () => {

        it('should add funds to folio', () => {
            const output = []
            let folioManagerAddFundExpectations = mockFolioManager.expects('addFund').exactly(3)
            commands['CURRENT_PORTFOLIO']('AXIS_BLUECHIP ICICI_PRU_BLUECHIP UTI_NIFTY_INDEX', folioManager, output)
            sinon.assert.calledWith(folioManagerAddFundExpectations.getCall(0), 'AXIS_BLUECHIP')
            sinon.assert.calledWith(folioManagerAddFundExpectations.getCall(1), 'ICICI_PRU_BLUECHIP')
            sinon.assert.calledWith(folioManagerAddFundExpectations.getCall(2), 'UTI_NIFTY_INDEX')
            expect(output).empty
            folioManagerAddFundExpectations.verify()
        })
    })

    describe('Add stock to fund', () => {
        it('should add valid stock to fund', () => {
            const output = []
            let folioManagerAddFundExpectations = mockFolioManager.expects('addStock').exactly(1)
            folioManagerAddFundExpectations.onCall(0).returns(true)
            commands['ADD_STOCK']('SBI_LARGE_&_MIDCAP HDFC BANK INDIA', folioManager, output)
            expect(output).empty
            sinon.assert.calledWith(folioManagerAddFundExpectations.getCall(0), 'SBI_LARGE_&_MIDCAP', 'HDFC BANK INDIA')
            folioManagerAddFundExpectations.verify()
        })

        it('should report invalid fund', () => {
            const output = []
            let folioManagerAddFundExpectations = mockFolioManager.expects('addStock').exactly(1)
            folioManagerAddFundExpectations.onCall(0).returns(false)
            commands['ADD_STOCK']('SBI_LARGE_&_MIDCAP HDFC BANK INDIA', folioManager, output)
            expect(output.length).equals(1)
            sinon.assert.calledWith(folioManagerAddFundExpectations.getCall(0), 'SBI_LARGE_&_MIDCAP', 'HDFC BANK INDIA')
            folioManagerAddFundExpectations.verify()
            expect(output.length).equal(1)
            expect(output[0]).equal('FUND_NOT_FOUND')
        })
    })

    describe('calculate overlap', () => {
        it('should calculate overlap', () => {
            const output = []
            let folioManagerAddFundExpectations = mockFolioManager.expects('calculateOverlap').exactly(1)
            folioManagerAddFundExpectations.onCall(0).returns({
                result: true,
                overlapList: [
                    { source: 'X', target: 'Y', overlapPercent: 33.112 },
                    { source: 'X', target: 'A', overlapPercent: 43.177 }
                ]
            })
            commands['CALCULATE_OVERLAP']('MIRAE_ASSET_EMERGING_BLUECHIP', folioManager, output)
            expect(output.length).equal(2)
            expect(output[0]).equal('X Y 33.11%')
            expect(output[1]).equal('X A 43.18%')
            folioManagerAddFundExpectations.verify()
        })

        it('should report no fund error', () => {
            const output = []
            let folioManagerAddFundExpectations = mockFolioManager.expects('calculateOverlap').exactly(1)
            folioManagerAddFundExpectations.onCall(0).returns({
                result: false
            })
            commands['CALCULATE_OVERLAP']('MIRAE_ASSET_EMERGING_BLUECHIP', folioManager, output)
            expect(output.length).equal(1)
            expect(output[0]).equal('FUND_NOT_FOUND')
            folioManagerAddFundExpectations.verify()
        })

        it('should report non-zero overlap percent only', () => {
            const output = []
            let folioManagerAddFundExpectations = mockFolioManager.expects('calculateOverlap').exactly(1)
            folioManagerAddFundExpectations.onCall(0).returns({
                result: true,
                overlapList: [
                    { source: 'X', target: 'Y', overlapPercent: 33.112 },
                    { source: 'X', target: 'B', overlapPercent: 0 },
                    { source: 'X', target: 'A', overlapPercent: 43.177 }
                ]
            })
            commands['CALCULATE_OVERLAP']('MIRAE_ASSET_EMERGING_BLUECHIP', folioManager, output)
            expect(output.length).equal(2)
            expect(output[0]).equal('X Y 33.11%')
            expect(output[1]).equal('X A 43.18%')
            folioManagerAddFundExpectations.verify()

        })
    })
})