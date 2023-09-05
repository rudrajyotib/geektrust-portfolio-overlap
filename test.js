const { describe } = require("mocha");

//Add your tests here

describe("portfolio", function () {
    require('./test/commands.test')    
    require('./test/commands-processor.test')
    require('./test/funds-definition.test')
    require('./test/portfolio-ops.test')
    require('./test/portfolio.test')
});