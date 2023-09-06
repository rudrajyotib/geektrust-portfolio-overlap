commandProcessor = (commandLine, folioManager, commandProvider, output) => {
    let firstSpaceChar = commandLine.indexOf(' ');
    let command = commandLine.slice(0, firstSpaceChar)
    commandProvider[command](commandLine.slice(firstSpaceChar + 1), folioManager, output)
}

module.exports = { commandProcessor }