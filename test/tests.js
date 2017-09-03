var expect = require('chai').expect;

// test suite
describe('Mocha', function() {
  //Test spec (unit test)
  it('should run our tests using npm', function(){
    expect(true).to.be.ok;
  });
});

describe('calculateTip', function() {
  const calculateTip = require('../tip_calculator/tip_calculator_methods').calculateTip;
    it('should take the total bill and tip percentage and return the amount of the tip',
  function() {
    expect(calculateTip(100, 10)).to.equal(10);
  })

  it('it should return a number rounded to two decimal figures',
function() {
  expect(calculateTip(15.78234, 12.782)).to.equal(2.02);
  })

  it('it should be able to accept numbers as strings types and number types',
function() {
  expect(calculateTip('15.78234', '12.782')).to.equal(2.02);
  })

  it('it should return an error if the input is not a number',
function() {

  expect(calculateTip("fifteen", "twenty five")).to.be.an('error');
  expect(calculateTip("fifteen", 25)).to.be.an('error');
  expect(calculateTip(15 , "twenty five")).to.be.an('error');
  });
});

describe('calculateTotal', function() {
  const calculateTotalPlusTip = require('../tip_calculator/tip_calculator_methods').calculateTotalPlusTip

  it('should take bill amount and tip rate and return the total including the tip',
  function() {
    expect(calculateTotalPlusTip(100, 10)).to.equal(110);
  });

  it('should round the output to two decimal figures',
  function() {
    expect(calculateTotalPlusTip(15.78234, 12.782)).to.equal(17.80);
  });

  it('it should be able to accept numbers as strings types and number types',
function() {
  expect(calculateTotalPlusTip('15.78234', '12.782')).to.equal(17.80);
  });

  it('it should return an error if the input is not a number',
function() {

  expect(calculateTotalPlusTip("fifteen", "twenty five")).to.be.an('error');
  expect(calculateTotalPlusTip("fifteen", 25)).to.be.an('error');
  expect(calculateTotalPlusTip(15 , "twenty five")).to.be.an('error');
  });
})

describe('splitBill', function() {
  const splitBill = require('../tip_calculator/tip_calculator_methods').splitBill
    it('should take two parameters amount (either tip or bill) and number of people and divide one by the other',
      function(){
      expect(splitBill(100, 10)).to.equal(10);
    });
    it('should be able to take numbers as string values', function() {
      expect(splitBill('100', '10')).to.equal(10);
    });
    it('should throw an error if parameters given are not numbers', function() {
      expect(splitBill('One Hundred', 'Ten')).to.be.an('error');
    });
    it('should round the results to two decimal places', function() {
      expect(splitBill(100, 3)).to.equal(33.33);
    });

});

describe('BillObject', function() {
  const BillObject = require('../tip_calculator/tip_calculator_methods').BillObject
  it('should take a currency, bill amount tip amount value and a number of people value and create a bill object to be outputted to the console',
function() {
    expect(new BillObject("£", "100", "10", "5")).to.deep.equal({currency: "£", billAmount: 100, tipPercentage: 10, tip: 10.00, total: 110.00, people: 5, billPerPerson: 20, tipPerPerson: 2, totalPerPerson: 22});
  })
  it('should return all currency values to two decimal places', function() {
    expect(new BillObject('£', '158.89', '20', '6')).to.deep.equal({currency: "£", billAmount: 158.89, tipPercentage: 20, tip: 31.78, total: 190.67, people: 6, billPerPerson: 26.48, tipPerPerson: 5.30, totalPerPerson: 31.78})
  })
});

describe('getExchangeRate', function() {
  const getExchangeRate = require('../tip_calculator/tip_calculator_methods').getExchangeRate
  it('should take two currency values as iso codes and return the exchange rate as a number', function(done) {
    done();
    expect(getExchangeRate('USD', 'GBP')).to.be.a('number');
  })
  it('should return an error if the values entered are not currency ISO values', function(done) {
    done();
    expect(getExchangeRate('Pounds', 'Dollars')).to.throw(new Error('Input is not valid ISO code'));
  })
});

describe('currencyConvert', function() {
  const currencyConvert = require('../tip_calculator/tip_calculator_methods').currencyConvert
  it('should take a value and an exchange rate and return a converted currency', function() {
    expect(currencyConvert(1, 1.30)).to.equal(1.30);
  })
});
