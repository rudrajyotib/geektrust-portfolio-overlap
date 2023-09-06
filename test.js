const { describe } = require("mocha");

//Add your tests here

describe("portfolio", function () {
    require('./test/commands.test')    
    require('./test/portfolio-manager.test')    
    require('./test/commands-processor.test')
    require('./test/funds-definition.test')
    require('./test/portfolio.test')
    require('./test/commands-processor-acceptance.test')
});