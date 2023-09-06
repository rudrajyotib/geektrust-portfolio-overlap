const { assert, expect } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
const { commandProcessor } = require("../src/command-processor");
const { commands } = require("../src/commands");

describe('Commands processor', () => {

    let command
    let stubCommand
    let stubFunction

    before(() => {
        command = commands
    })

    beforeEach(() => {
        stubFunction = sinon.stub()
        stubCommand = sinon.stub(command, 'CURRENT_PORTFOLIO').value(stubFunction)
    })

    afterEach(() => {
        stubCommand.restore()
    })

    it('', () => {
        stubFunction.onFirstCall().returns(0)
        commandProcessor('CURRENT_PORTFOLIO ABC', { id: 'folioManager' }, command, ['XX'])
        expect(stubFunction.calledOnce)
        expect(stubFunction.calledWith(sinon.match(arg => {
            expect(arg).equals('ABC')
            return true
        }), sinon.match(arg => {
            expect(arg.id).equals('folioManager')
            return true
        }), sinon.match(arg => {
            expect(arg[0]).equals('XX')
            return true
        }))).true
    })

})