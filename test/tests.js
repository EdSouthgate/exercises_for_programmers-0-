var expect = require('chai').expect;
const Bill = require('../tip_calculator/tip_calculator_methods').Bill;
const getExchangeRate = require('../middleware/index.js').getExchangeRate;
const getCurrencyInfo = require('../middleware/index.js').getCurrencyInfo;
const getDecimalPlaces = require('../middleware/index.js').getDecimalPlaces;
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

  it('it should be able to accept numbers as strings types and number types',
function() {
    myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: '15.78234', tipPercentage: '12.782', people: 5});
    myBill.calculateTip()
    expect(myBill.tip).to.equal(2.0169996);
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

  it('it should be able to accept numbers as strings types and number types',
function() {
  const myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: '15.78234', tipPercentage: '12.782', people: 5});
  myBill.calculateTip();
  myBill.calculateTotalPlusTip();
  expect(myBill.total).to.equal(17.7969996);
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

  it('should not split the bill if no number of people is provided or if the number of people provided <= 1',
  function() {
    myBill = new Bill({currencyFrom: "GBP", currencyTo: "USD", billAmount: 100, tipPercentage: 10, people: 1});
    expect(myBill.billPerPerson).to.be.an('undefined');
    expect(myBill.tipPerPerson).to.be.an('undefined');
    expect(myBill.totalPerPerson).to.be.an('undefined');
    expect(myBill.totalPaid).to.be.an('undefined');


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
      expect(myBill.convBillAmount).to.equal(133.975);
      expect(myBill.convTip).to.equal(13.3975);
      expect(myBill.convTotal).to.equal(147.3725);
      expect(myBill.convBillPerPerson).to.equal(26.795);
      expect(myBill.convTipPerPerson).to.equal(2.6795);
      expect(myBill.convTotalPerPerson).to.equal(29.4745);
  });
});

describe('Bill.roundBill', function() {
  it('should round currencies to the appropriate number of decimal places', function() {
      const myBill = new Bill({ currencyFrom: 'GBP',
                                currencyTo: 'HUF',
                                billAmount: 100,
                                tipPercentage: 10,
                                people: 3})

      myBill.tip = 10;
      myBill.total = 110;
      myBill.billPerPerson = 33.34;
      myBill.tipPerPerson = 3.3333333333;
      myBill.totalPerPerson = 36.6733333333;
      myBill.totalPaid = 100.02;
      myBill.exchangeRate = 350.19;
      myBill.convBillAmount = 35019;
      myBill.convTip = 3501.9;
      myBill.convTotal = 38520.9;
      myBill.convBillPerPerson = 11675.3346;
      myBill.convTipPerPerson = 1167.3;
      myBill.convTotalPerPerson = 12842.6346;
      myBill.convTotalPaid = 35036.0038;
      myBill.currencyFromPlaces = 2;
      myBill.currencyToPlaces = 0;

      myBill.roundBill();

      expect(myBill.billAmount).to.equal('100.00');
      expect(myBill.tip).to.equal('10.00');
      expect(myBill.total).to.equal('110.00');
      expect(myBill.totalPerPerson).to.equal('36.68');
      expect(myBill.billPerPerson).to.equal('33.34');
      expect(myBill.tipPerPerson).to.equal('3.33');
      expect(myBill.convTotalPerPerson).to.equal('12843');
      expect(myBill.totalPaid).to.equal('100.02');
      expect(myBill.convBillAmount).to.equal('35019');
      expect(myBill.convTip).to.equal('3502');
      expect(myBill.convTotal).to.equal('38521');
      expect(myBill.convBillPerPerson).to.equal('11675');
      expect(myBill.convTipPerPerson).to.equal('1167');
      expect(myBill.convTotalPaid).to.equal('35036');
  })
})

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

describe('getCurrencyInfo', function() {
  it('should return an object containing information about currencies', function(done) {
    done();
    expect(getCurrencyInfo()).to.be.an('object');
  });
});

describe('getDecimalPlaces', function() {
  it('take two currency ISO codes and return the number of decimal places from the currencyInfo object', function() {
    const currencyInfo = {
                            "GBP": {
                                "symbol": "£",
                                "name": "British Pound Sterling",
                                "symbol_native": "£",
                                "decimal_digits": 2,
                                "rounding": 0,
                                "code": "GBP",
                                "name_plural": "British pounds sterling"
                            },
                            "HRK": {
                                "symbol": "kn",
                                "name": "Croatian Kuna",
                                "symbol_native": "kn",
                                "decimal_digits": 2,
                                "rounding": 0,
                                "code": "HRK",
                                "name_plural": "Croatian kunas"
                            },
                            "HUF": {
                                "symbol": "Ft",
                                "name": "Hungarian Forint",
                                "symbol_native": "Ft",
                                "decimal_digits": 0,
                                "rounding": 0,
                                "code": "HUF",
                                "name_plural": "Hungarian forints"
                            }
                          }

    expect(getDecimalPlaces({currencyFrom: 'GBP', currencyTo: 'HUF'}, currencyInfo)).to.deep.equal({currencyFromPlaces: 2, currencyToPlaces: 0});
  });
});
