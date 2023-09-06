const { describe } = require("mocha");
const fundsDefinition = require("../src/funds-definition");
const { portfolio } = require("../src/portfolio");
const sinon = require('sinon');
const { portfolioManager } = require("../src/portfolio-manager");
const { expect } = require("chai");



describe('Portfolio manager', () => {

    let funds
    let folioManager
    let mockFolio
    let mockFunds
    let folio

    before(() => {
        funds = fundsDefinition.fundApi
        folio = portfolio()
    })

    beforeEach(() => {
        mockFolio = sinon.mock(folio)
        mockFunds = sinon.mock(funds)
        folioManager = portfolioManager(funds, folio)
    })

    afterEach(() => {
        mockFolio.restore()
        mockFunds.restore()
    })

    it('should add fund to folio', () => {
        let expectations = mockFolio.expects('addFund').withExactArgs('X').once()
        folioManager.addFund('X')
        expectations.verify()
    })

    it('should add stock to fund definition successfully', () => {
        let expectations = mockFunds.expects('addStockToFund').withExactArgs('X', 'Y').once().returns(true)
        expect(folioManager.addStock('X', 'Y')).true
        expectations.verify()
    })

    it('should handle failure to add stock to fund definition', () => {
        let expectations = mockFunds.expects('addStockToFund').withExactArgs('X', 'Y').once().returns(false)
        expect(folioManager.addStock('X', 'Y')).false
        expectations.verify()
    })

    it('should not calculate overlap when fund does not exist', () => {
        let fundExistsExpectations = mockFunds.expects('exists').withExactArgs('X').once().returns(false)
        let fundListInFolioExpectations = mockFolio.expects('fundList').never()
        let result = folioManager.calculateOverlap('X')
        expect(result.result).false
        fundExistsExpectations.verify()
        fundListInFolioExpectations.verify()
    })

    it('should return emptly list when there is no fund in folio', () => {
        let fundExistsExpectations = mockFunds.expects('exists').withExactArgs('X').once().returns(true)
        let fundListInFolioExpectations = mockFolio.expects('fundList').once().returns(new Set())
        let result = folioManager.calculateOverlap('X')
        expect(result.result).true
        expect(result.overlapList).empty
        fundExistsExpectations.verify()
        fundListInFolioExpectations.verify()
    })

    it('should return overlap if calculated', () => {
        let fundExistsExpectations = mockFunds.expects('exists').withExactArgs('X').once().returns(true)
        let fundListInFolioExpectations = mockFolio.expects('fundList').once().returns(new Set(['Y', 'Z', 'A']))
        let fundsDefinitionOverlapExpectations = mockFunds.expects('calculateOverlap').exactly(3)
        fundsDefinitionOverlapExpectations.onCall(0).returns({ result: true, overlapPercent: 33.331 })
        fundsDefinitionOverlapExpectations.onCall(1).returns({ result: false })
        fundsDefinitionOverlapExpectations.onCall(2).returns({ result: true, overlapPercent: 33.332 })

        let result = folioManager.calculateOverlap('X')
        expect(result.result).true
        expect(result.overlapList.length).equals(2)

        fundExistsExpectations.verify()
        fundListInFolioExpectations.verify()
        fundsDefinitionOverlapExpectations.verify()

        expect(result.overlapList[0].overlapPercent).equals(33.331)
        expect(result.overlapList[0].source).equals('X')
        expect(result.overlapList[0].target).equals('Y')

        expect(result.overlapList[1].overlapPercent).equals(33.332)
        expect(result.overlapList[1].source).equals('X')
        expect(result.overlapList[1].target).equals('A')

        sinon.assert.calledWith(fundsDefinitionOverlapExpectations.getCall(0), 'X', 'Y')
        sinon.assert.calledWith(fundsDefinitionOverlapExpectations.getCall(1), 'X', 'Z')
        sinon.assert.calledWith(fundsDefinitionOverlapExpectations.getCall(2), 'X', 'A')
    })

})