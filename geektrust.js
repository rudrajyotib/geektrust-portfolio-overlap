const fs = require("fs")
const { commandProcessor } = require("./src/command-processor")
const {  fundApi } = require("./src/funds-definition")
const { portfolio } = require("./src/portfolio")
const readline = require("readline")

const filename = process.argv[2]

const output = []
const fund = fundApi
const folio = portfolio(fund)

var lineReader = readline.createInterface({
    input: require('fs').createReadStream(filename)
  });

lineReader.on('line', function (line) {
    commandProcessor(line, folio, fund, output)
});
  
lineReader.on('close', ()=>{
    output.forEach(element => {
        console.log(element)
    })
})
  
