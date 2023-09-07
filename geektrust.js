const fs = require("fs")
const { commandProcessor } = require("./src/command-processor")
const { fundApi } = require("./src/funds-definition")
const { portfolio } = require("./src/portfolio")
const readline = require("readline")
const { portfolioManager } = require("./src/portfolio-manager")
const { commands } = require("./src/commands")

const filename = process.argv[2]

const output = []
const folioManager = portfolioManager(fundApi, portfolio())

readline.createInterface({
    input: require('fs').createReadStream(filename)
}).on('line', function (line) {
    commandProcessor(line, folioManager, commands, output)
}).on('close', () => {
    output.forEach(element => {
        console.log(element)
    })
})

