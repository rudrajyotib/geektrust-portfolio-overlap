const { commands } = require("./commands");

commandProcessor = (commandLine, folio, funds, output) => {

    let firstSpaceChar = commandLine.indexOf(' ');
    let command = commandLine.slice(0, firstSpaceChar)
    commands[command](commandLine.slice(firstSpaceChar+1), folio, funds, output)
}

module.exports = { commandProcessor }