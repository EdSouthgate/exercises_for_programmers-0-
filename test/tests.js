var expect = require('chai').expect;
const Bill = require('../tip_calculator/tip_calculator_methods').Bill;
const getExchangeRate = require('../middleware/index.js').getExchangeRate;
// test suite
describe('Mocha', function() {
  //Test spec (unit test)
  it('should run our tests using npm', function(){
    expect(true).to.be.ok;
  });
});

describe('Bill.calculateTip', function() {

    it('should take the total bill and tip percentage values and set the objects tipAmount key to the amount of the tip',
  function() {
    myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 100, tipPercentage: 10, people: 5});
    myBill.calculateTip()
    expect(myBill.tip).to.equal(10);
  })

  it('it should return a number rounded to two decimal figures',
function() {
    myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 15.78234, tipPercentage: 12.782, people: 5});
    myBill.calculateTip();
    expect(myBill.tip).to.equal(2.02);
  })

  it('it should be able to accept numbers as strings types and number types',
function() {
    myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: '15.78234', tipPercentage: '12.782', people: 5});
    myBill.calculateTip()
    expect(myBill.tip).to.equal(2.02);
  })

  it('it should return an error if the input is not a number',
function() {
  const myBill1 = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: "fifteen", tipPercentage: "twentyfive", people: 5});
  const myBill2 = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 15, tipPercentage: "twentyfive", people: 5});
  const myBill3 = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: "fifteen", tipPercentage: 25, people: 5})
  expect(myBill1.calculateTip()).to.be.an('error');
  expect(myBill2.calculateTip()).to.be.an('error');
  expect(myBill3.calculateTip()).to.be.an('error');
  });
});

describe('Bill.calculateTotalPlusTip', function() {
  it('should take bill amount and tip amount and add the total to the the tip',
  function() {
    const myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 100, tipPercentage: 10, people: 5});
    myBill.calculateTip();
    myBill.calculateTotalPlusTip();
    expect(myBill.total).to.equal(110);
  });

  it('should round the output to two decimal figures',
  function() {
    const myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 15.78234, tipPercentage: 12.782, people: 5});
    myBill.calculateTip();
    myBill.calculateTotalPlusTip();
    expect(myBill.total).to.equal(17.80);
  });

  it('it should be able to accept numbers as strings types and number types',
function() {
  const myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: '15.78234', tipPercentage: '12.782', people: 5});
  myBill.calculateTip();
  myBill.calculateTotalPlusTip();
  expect(myBill.total).to.equal(17.80);
  });

  it('it should return an error if the input is not a number',
function() {
  const myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 'fifteen', tipPercentage: 12, people: 5});
  myBill.calculateTip();
  expect(myBill.calculateTotalPlusTip()).to.be.an('error');
  });
})

describe('Bill.splitBill', function() {
  it('should divide the bill, the tip, the total plus tip by the number of people',
  function() {
    myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 100, tipPercentage: 10, people: 5});
    myBill.calculateTip();
    myBill.calculateTotalPlusTip();
    myBill.splitBill();
    expect(myBill.billPerPerson).to.equal(20.00);
    expect(myBill.tipPerPerson).to.equal(2.00);
    expect(myBill.totalPerPerson).to.equal(22.00);
  });

  it('should round up the total per person in order to avoid short fall in bill',
  function() {
    myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 100, tipPercentage: 10, people: 3});
    myBill.calculateTip();
    myBill.calculateTotalPlusTip();
    myBill.splitBill();
    expect(myBill.billPerPerson).to.equal(33.34);
    expect(myBill.tipPerPerson).to.equal(3.33);
    expect(myBill.totalPerPerson).to.equal(36.67);
  });

  it('should set a new key called amountPaid giving the total paid when rounding',
  function() {
    myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 100, tipPercentage: 10, people: 3});
    myBill.calculateTip();
    myBill.calculateTotalPlusTip();
    myBill.splitBill();
    expect(myBill.totalPaid).to.equal(100.02);
  });

  it('should only create totalPaid key if the amount being paid is not the same as the amount due',
  function() {
    myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 100, tipPercentage: 10, people: 2});
    myBill.calculateTip();
    myBill.calculateTotalPlusTip();
    myBill.splitBill();
    expect(myBill.totalPaid).to.be.undefined;
  });

});

describe('Bill', function() {
  it('should take an object containing the keys currency from, currencyTo, bill amount tip amount value and a number of people and create a bill object with those values',
function(done) {
    done()
    const myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: "100", tipPercentage: "10", people: "5"})
    expect(myBill).to.deep.equal({currencyFrom: "GBP", currencyTo: "USD", billAmount: 100, tipPercentage: 10,
    people: 5});
  })
  it('should return all currency values to two decimal places', function() {
    const myBill = new Bill({currencyFrom: 'GBP', currencyTo: "USD", billAmount: 158.333, tipPercentage: '20', people: '6'})
    expect(myBill.billAmount).to.equal(158.33);
  })
});

describe('Bill.convertBill', function() {
  it('should convert the currency of the bill using the exchange rate and create new key value pairs', function() {
      myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 100, tipPercentage: 10, people: 5});
      myBill.calculateTip();
      myBill.calculateTotalPlusTip();
      myBill.splitBill();
      myBill.exchangeRate = 1.33975;
      myBill.convertBill();
      expect(myBill.convBillAmount).to.equal(133.97);
      expect(myBill.convTip).to.equal(13.40);
      expect(myBill.convTotal).to.equal(147.37);
      expect(myBill.convBillPerPerson).to.equal(26.80);
      expect(myBill.convTipPerPerson).to.equal(2.68);
      expect(myBill.convTotalPerPerson).to.equal(29.47);
  });
});

describe('roundUp', function() {
  it('should take a number and a number of decimal places and round it up to that number of decimal places',
  function() {
    const roundUp = require('../mathmatical_methods/mathmatical_methods.js').roundUp
    expect(roundUp(3.33333, 0)).to.equal(4);
    expect(roundUp(3.33333, 1)).to.equal(3.4);
    expect(roundUp(3.33333, 2)).to.equal(3.34);
    expect(roundUp(3.33333, 3)).to.equal(3.334);
  });
  it('should only round up if the following decimal place is above 0',
  function() {
    const roundUp = require('../mathmatical_methods/mathmatical_methods.js').roundUp
    expect(roundUp(3, 0)).to.equal(3);
    expect(roundUp(3.3, 1)).to.equal(3.3);
    expect(roundUp(3.33, 2)).to.equal(3.33);
    expect(roundUp(3.333, 3)).to.equal(3.333);
  });
})


describe('getExchangeRate', function(done) {
  it('should take two currency values as iso codes and set the exchange rate key of Bill object to a number', function(done) {
    done();
    expect(exchangeRate('GBP', 'USD')).to.be.a('number');
  })
  it('should return an error if the values entered are not currency ISO values', function(done) {
    done();
    expect(getExchangeRate('pounds', 'dollars')).to.be.an('error');
  })
});
