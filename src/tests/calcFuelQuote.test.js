const assert = require('assert');
const { calcFuelQuote } = require('../calc/fuel.calc');

describe('Test fuel.calc.js', () => {
    it('GallonsRequested = 1, Price = 1.50, Client in Texas, No fuel history, Profit factor = 0.10', () => {
        let result = calcFuelQuote(1.50, 1, 'TX', false, 0.10);
        assert.equal(result.suggestedPrice, 1.73);
        assert.equal(result.totalAmountDue, 1.73)
    })
    it('GallonsRequested = 2, Price = 1.50, Client in Texas, Has fuel history, Profit factor = 0.10', () => {
        let result = calcFuelQuote(1.50, 2, 'TX', true, 0.10);
        assert.equal(result.suggestedPrice, 1.71)
        assert.equal(result.totalAmountDue, 2*1.71)
    })
    it('GallonsRequested = 3, Price = 1.50, Client NOT in Texas, No fuel history, Profit factor = 0.10', () => {
        let result = calcFuelQuote(1.50, 3, 'LA', false, 0.10);
        assert.equal(result.suggestedPrice, 1.76)
        assert.equal(result.totalAmountDue, 3*1.76)
    })

    it('GallonsRequested = 4, Price = 1.50, Client NOT in Texas, Has fuel history, Profit factor = 0.10', () => {
        let result = calcFuelQuote(1.50, 4, 'LA', true, 0.10);
        assert.equal(result.suggestedPrice, 1.74)
        assert.equal(result.totalAmountDue, 4*1.74)
    })

    it('GallonsRequested = 1001, Price = 1.50, Client NOT in Texas, Has fuel history, Profit factor = 0.10', () => {
        let result = calcFuelQuote(1.50, 1001, 'LA', true, 0.10);
        assert.equal(result.suggestedPrice, 1.73, "Hint: make sure gallons requested factor is implemented correctly")
        assert.equal(result.totalAmountDue, 1001*1.73, "Hint: make sure gallons requested factor is implemented correctly")
    })
})