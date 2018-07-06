var expect = require('chai').expect;
const bill = require('../middleware/tip_calculator.js').bill;
// test suite
describe('Mocha', function() {
  //Test spec (unit test)
  it('should run our tests using npm', function(){
    expect(true).to.be.ok;
  });
});

describe('bill.toConvert', function() {
  it('should accept an object and return true if currencyFrom and currencyTo keys are not the same', function() {
    const myBill = {
      currencyTo: "HUF",
      currencyFrom: "GBP"
    }

    expect(bill.toConvert(myBill)).to.be.true;
  });

  it('should accept an object and return false if currencyFrom and currencyTo keys are the same', function() {
    const myBill = {
      currencyTo: "HUF",
      currencyFrom: "HUF"
    }

    expect(bill.toConvert(myBill)).to.be.false;
  });
});

describe('bill.create', function() {
  it('should take an object containing the keys currency from, currencyTo, bill amount tip percentage value and a number of people and create a bill object with those values', function() {
    const myBill = {
      currencyTo: "HUF",
      currencyFrom: "GBP",
      billAmount: 100,
      people: 3,
      tipPercentage: 10,
      convertCurrency: true
    };

    const myNewBill = bill.create(myBill);

    expect(myNewBill).to.deep.equal({
      currencyTo: "HUF",
      currencyFrom: "GBP",
      billAmount: 100,
      people: 3,
      tipPercentage: 10,
      convertCurrency: true
    });
  });
});

describe('bill.calculateTip', function() {
  it('should take an object containing bill information and return that object with an additional key containing the calulated tip amount',
  function() {
      const myBill = {billAmount: 100, tipPercentage: 10};
      bill.calculateTip(myBill);
      expect(myBill).to.deep.equal({billAmount: 100, tipPercentage: 10, tip: 10});
    });

  it('should function be able to accept numbers as strings as inputs', function() {
      const myBill = {billAmount: "100", tipPercentage: "10"};
      bill.calculateTip(myBill);
      expect(myBill).to.deep.equal({billAmount: 100, tipPercentage: 10, tip: 10});
  });

  it('should throw an error if there is no billAmount or tipPercentage in the object passed in', function(){
    expect(bill.calculateTip.bind(bill.calculateTip, {})).to.throw();
    expect(bill.calculateTip.bind(bill.calculateTip, {billAmount: 100})).to.throw();
    expect(bill.calculateTip.bind(bill.calculateTip, {tipPercentage: 100})).to.throw();
  });

  it('should return an error if the input is not a number', function() {
    expect(bill.calculateTip.bind(bill.calculateTip, {billAmount: 'twenty pounds', tipPercentage: 'fifteen percent'})).to.throw();
    expect(bill.calculateTip.bind(bill.calculateTip, {billAmount: 20, tipPercentage: 'fifteen percent'})).to.throw();
    expect(bill.calculateTip.bind(bill.calculateTip, {billAmount: 'twenty pounds', tipPercentage: 15})).to.throw();
  })
});

describe('bill.calculateTotalPlusTip', function() {
  it('should take an object containing a billAmount and a tipPercentage and return an object with a new key of total', function() {
    const myBill = {billAmount: 100, tipPercentage: 10};
    bill.calculateTotalPlusTip(myBill);
    expect(myBill).to.deep.equal({billAmount: 100, tipPercentage: 10, total: 110});
  });

  it('should be able to take numbers as strings as inputs', function() {
    const myBill = {billAmount: "100", tipPercentage: "10"};
    bill.calculateTotalPlusTip(myBill);
    expect(myBill).to.deep.equal({billAmount: 100, tipPercentage: 10, total: 110});
  });

  it('should return an error if either either the billAmount or tipPercentage is not a number', function() {
    expect(bill.calculateTotalPlusTip.bind(bill.calculateTotalPlusTip, {billAmount: 'twenty pounds', tipPercentage: 'fifteen percent'})).to.throw();
    expect(bill.calculateTotalPlusTip.bind(bill.calculateTotalPlusTip, {billAmount: 20, tipPercentage: 'fifteen percent'})).to.throw();
    expect(bill.calculateTotalPlusTip.bind(bill.calculateTotalPlusTip, {billAmount: 'twenty pounds', tipPercentage: 15})).to.throw();
  });

  it('should return an error if there is no billAmount or tipPercentage in the object passed in', function(){
    expect(bill.calculateTotalPlusTip.bind(bill.calculateTotalPlusTip, {})).to.throw();
    expect(bill.calculateTotalPlusTip.bind(bill.calculateTotalPlusTip, {billAmount: 100})).to.throw();
    expect(bill.calculateTotalPlusTip.bind(bill.calculateTotalPlusTip, {tipPercentage: 100})).to.throw();
  });

});

describe('bill.splitBill', function() {
    it('should take an object and divide the bill, the tip, the total plus tip by the number of people', function() {
      const myBill1 = {
        billAmount: 100,
        tipPercentage: 10,
        total: 110,
        tip: 10,
        people: 5
      };
      bill.splitBill(myBill1);
      expect(myBill1).to.deep.equal({
        billAmount: 100,
        tipPercentage: 10,
        tip: 10,
        people: 5,
        total: 110,
        billPerPerson: 20,
        tipPerPerson: 2,
        totalPerPerson: 22,
        currencyFromPlaces: 2
      })
    });

    it('should be able to accept numbers as strings as well as number types', function() {
      const myBill1 = {
        billAmount: '100',
        total: '110',
        tip: '10',
        people: '5'
      };
      bill.splitBill(myBill1);
      expect(myBill1).to.deep.equal({
        billAmount: 100,
        tip: 10,
        people: 5,
        total: 110,
        billPerPerson: 20,
        tipPerPerson: 2,
        totalPerPerson: 22,
        currencyFromPlaces: 2
      })
    });

    it('should return an error if the results of any of the calculations are not numbers', function() {
      const myBill1 = {
        billAmount: 'One Hundred',
        total: '110',
        tip: '10',
        people: '5'
      };
      const myBill2 = {
        billAmount: '100',
        total: 'One Hundred and Ten',
        tip: '10',
        people: '5'
      };
      const myBill3 = {
        billAmount: '100',
        total: '110',
        tip: 'ten',
        people: '5'
      };
      const myBill4 = {
        billAmount: '100',
        total: '110',
        tip: '10',
        people: 'five'
      };


      expect(bill.splitBill.bind(bill.splitBill, myBill1)).to.throw();
      expect(bill.splitBill.bind(bill.splitBill, myBill2)).to.throw();
      expect(bill.splitBill.bind(bill.splitBill, myBill3)).to.throw();
      expect(bill.splitBill.bind(bill.splitBill, myBill4)).to.throw();
    });

    it('should return an error if there is no billAmount, total, tip or people key in the object passed in', function(){
      expect(bill.splitBill.bind(bill.splitBill, {})).to.throw();
      expect(bill.splitBill.bind(bill.splitBill, {billAmount: 100})).to.throw();
      expect(bill.splitBill.bind(bill.splitBill, {tipPercentage: 100})).to.throw();
    });

    it('should round up the bill per person in order to avoid short fall in bill',
      function() {
        const myBill = {
            billAmount: 100,
            tipPercentage: 10,
            tip: 10, total: 110,
            people: 3
          };
        bill.splitBill(myBill);
        expect(myBill.billPerPerson).to.equal(33.34);
      });

      it('should set a new key called amountPaid giving the total paid when rounding', function() {
        const myBill = {
            billAmount: 100,
            tipPercentage: 10,
            tip: 10, total: 110,
            people: 3
          };
        bill.splitBill(myBill);
        expect(myBill).to.deep.equal({
          billAmount: 100,
          tipPercentage: 10,
          tip: 10,
          people: 3,
          total: 110,
          billPerPerson: 33.34,
          currencyFromPlaces: 2,
          tipPerPerson: 3.33,
          totalPerPerson: 36.67,
          amountPaid: 100.02
        });
      });

      it('should not split the bill if the people key < 1', function() {
        const myBill = {
          billAmount: 100,
          tipPercentage: 10,
          tip: 10, total: 110,
          people: 0
        };

        bill.splitBill(myBill);

        expect(myBill).to.deep.equal({
                    billAmount: 100,
                    tipPercentage: 10,
                    tip: 10, total: 110,
                    people: 1,
                    currencyFromPlaces: 2
                  });


      });
});

describe('bill.convert', function () {
  it('should take an object with a currencyFrom key and a currencyTo key and convert the bill using the exchangeRate key.', function () {
      var myBill = {
        currencyFrom: "GBP",
        currencyTo: "HUF",
        billAmount: 100,
        tip: 10,
        people: 5,
        total: 110,
        billPerPerson: 20,
        tipPerPerson: 2,
        totalPerPerson: 22,
        currencyFromPlaces: 2,
        exchangeRate: 2.5
      };
      bill.convert(myBill);
      expect(myBill.convBillAmount).to.equal(250);
      expect(myBill.convTip).to.equal(25);
      expect(myBill.convTotal).to.equal(275);
      expect(myBill.convBillPerPerson).to.equal(50);
      expect(myBill.convTipPerPerson).to.equal(5);
  });

  it('should be able to take numbers as strings as well as number types', function() {
    var myBill = {
      currencyFrom: "GBP",
      currencyTo: "HUF",
      billAmount: '100',
      tip: '10',
      people: '5',
      total: '110',
      billPerPerson: '20',
      tipPerPerson: '2',
      totalPerPerson: '22',
      currencyFromPlaces: '2',
      exchangeRate: '2.5'
    };
    bill.convert(myBill);
    expect(myBill.convBillAmount).to.equal(250);
    expect(myBill.convTip).to.equal(25);
    expect(myBill.convTotal).to.equal(275);
    expect(myBill.convBillPerPerson).to.equal(50);
    expect(myBill.convTipPerPerson).to.equal(5);
  });

  it('should return an error if no exchange rate key is provided', function() {
    const myBill = {
      currencyFrom: "GBP",
      currencyTo: "HUF",
      billAmount: 100,
      tip: 10,
      people: 5,
      total: 110,
      billPerPerson: 20,
      tipPerPerson: 2,
      totalPerPerson: 22,
      currencyFromPlaces: 2,
    };

    expect(bill.convert.bind(bill.convert, myBill)).to.throw();
  });

  it('should return an error if billAmount, tip or total are not numbers', function() {
    const myBill1 = {
      currencyFrom: "GBP",
      currencyTo: "HUF",
      billAmount: 'one hundred',
      tip: 10,
      people: 5,
      total: 110,
      billPerPerson: 20,
      tipPerPerson: 2,
      totalPerPerson: 22,
      currencyFromPlaces: 2,
      exchangeRate: 2.5
    };

    const myBill2 = {
      currencyFrom: "GBP",
      currencyTo: "HUF",
      billAmount: 100,
      tip: 'ten',
      people: 5,
      total: 110,
      billPerPerson: 20,
      tipPerPerson: 2,
      totalPerPerson: 22,
      currencyFromPlaces: 2,
      exchangeRate: 2.5
    };

    const myBill3 = {
      currencyFrom: "GBP",
      currencyTo: "HUF",
      billAmount: 100,
      tip: 10,
      people: 5,
      total: 'one hundred and ten',
      billPerPerson: 20,
      tipPerPerson: 2,
      totalPerPerson: 22,
      currencyFromPlaces: 2,
      exchangeRate: 2.5
    };

    expect(bill.convert.bind(bill.convert, myBill1)).to.throw();
    expect(bill.convert.bind(bill.convert, myBill2)).to.throw();
    expect(bill.convert.bind(bill.convert, myBill3)).to.throw();
  });

  it('should still convert the bill if there is no billPerPerson, tipPerPerson or totalPerPerson is provided', function() {
    var myBill = {
      currencyFrom: "GBP",
      currencyTo: "HUF",
      billAmount: 100,
      tip: 10,
      people: 5,
      total: 110,
      currencyFromPlaces: 2,
      exchangeRate: 2.5
    };

    bill.convert(myBill);
    expect(myBill.convBillAmount).to.equal(250);
    expect(myBill.convTip).to.equal(25);
    expect(myBill.convTotal).to.equal(275);
  });
});

describe('bill.round', function() {
  it('should round currencies to the appropriate number of decimal places', function() {
      const myBill = {
                      currencyFrom: 'GBP',
                      currencyTo: 'HUF',
                      billAmount: 100,
                      tipPercentage: 10,
                      people: 3,
                      tip: 10,
                      total: 110,
                      billPerPerson: 33.34,
                      tipPerPerson: 3.3333333333,
                      totalPerPerson: 36.6733333333,
                      amountPaid: 100.02,
                      exchangeRate: 350.19,
                      convBillAmount: 35019,
                      convTip: 3501.9,
                      convTotal: 38520.9,
                      convBillPerPerson: 11675.3346,
                      convTipPerPerson: 1167.3,
                      convTotalPerPerson: 12842.6346,
                      convAmountPaid: 35036.0038,
                      currencyFromPlaces: 2,
                      currencyToPlaces: 0
                    };



      bill.round(myBill);
      expect(myBill.billAmount).to.equal('100.00');
      expect(myBill.tip).to.equal('10.00');
      expect(myBill.total).to.equal('110.00');
      expect(myBill.totalPerPerson).to.equal('36.68');
      expect(myBill.billPerPerson).to.equal('33.34');
      expect(myBill.tipPerPerson).to.equal('3.33');
      expect(myBill.convTotalPerPerson).to.equal('12843');
      expect(myBill.amountPaid).to.equal('100.02');
      expect(myBill.convBillAmount).to.equal('35019');
      expect(myBill.convTip).to.equal('3502');
      expect(myBill.convTotal).to.equal('38521');
      expect(myBill.convBillPerPerson).to.equal('11675');
      expect(myBill.convTipPerPerson).to.equal('1167');
      expect(myBill.convAmountPaid).to.equal('35036');
  });
});

describe('bill.getCurrencyInfo', function() {
  it('should return an object containing information about currencies', function(done) {
    const currencyInfo = bill.getCurrencyInfo();
    done();
    expect(currencyInfo).to.be.an('object');
  });
});

describe('bill.getExchangeRate', function(done) {
  it('should take two currency values as iso codes and set the exchange rate key of Bill object to a number', function(done) {
    const exchangeRate = bill.getExchangeRate({currencyFrom: 'GBP', currencyTo: 'USD'});
    done();
    expect(exchangeRate).to.be.a('number');
  });
  it('should return an error if the values entered are not currency ISO values', function(done) {
    done();
    expect(bill.getExchangeRate('pounds', 'dollars')).to.be.an('error');
  });
});

describe('bill.getDecimalPlaces', function() {
  it('take an object containing two currency ISO codes and return an object containing the number of decimal places from the currencyInfo object', function() {
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

    expect(bill.getDecimalPlaces({currencyFrom: 'GBP', currencyTo: 'HUF'}, currencyInfo)).to.deep.equal({currencyFromPlaces: 2, currencyToPlaces: 0});
  });
});

describe('bill.build', function() {
  it('should take a bill object complete and an exchange rate object and return the completed bill object', function() {
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
                                "decimal_digits": 2,
                                "rounding": 0,
                                "code": "HUF",
                                "name_plural": "Hungarian forints"
                            }
                          };

    const myBill = {
                    currencyFrom: 'GBP',
                    currencyTo: 'HUF',
                    billAmount: 100,
                    tipPercentage: 10,
                    people: 3,
                    tip: 10,
                    total: 110,
                    exchangeRate: 300
                  };

    const completeBill = bill.build(myBill, currencyInfo);

    expect(completeBill).to.deep.equal({
      currencyFrom: 'GBP',
      currencyTo: 'HUF',
      billAmount: '100.00',
      tipPercentage: 10,
      people: 3,
      tip: '10.00',
      total: '110.00',
      billPerPerson: '33.34',
      tipPerPerson: '3.33',
      totalPerPerson: '36.67',
      amountPaid: '100.02',
      exchangeRate: 300,
      convBillAmount: '30000.00',
      convTip: '3000.00',
      convTotal: '33000.00',
      convBillPerPerson: '10002.00',
      convTipPerPerson: '999.00',
      convTotalPerPerson: '11001.00',
      convAmountPaid: '30006.00',
      currencyFromPlaces: 2,
      currencyToPlaces: 2,
      convertCurrency: true
    });
  });

  it('should not convert the bill if the currencyTo and currencyFrom values are identical', function() {
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
                                "decimal_digits": 2,
                                "rounding": 0,
                                "code": "HUF",
                                "name_plural": "Hungarian forints"
                            }
                          };

    const myBill = {
                    currencyFrom: 'GBP',
                    currencyTo: 'GBP',
                    billAmount: 100,
                    tipPercentage: 10,
                    people: 3,
                    tip: 10,
                    total: 110
                  };

    const completeBill = bill.build(myBill, currencyInfo);

    expect(completeBill).to.deep.equal({
      currencyFrom: 'GBP',
      currencyTo: 'GBP',
      billAmount: '100.00',
      tipPercentage: 10,
      people: 3,
      tip: '10.00',
      total: '110.00',
      billPerPerson: '33.34',
      tipPerPerson: '3.33',
      totalPerPerson: '36.67',
      amountPaid: '100.02',
      convertCurrency: false,
      currencyFromPlaces: 2
    });
  });
});
