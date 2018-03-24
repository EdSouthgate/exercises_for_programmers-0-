//modular code that will pass an object between the different functions and
//transform it

const bill = (function () {
  const http = require('http');

  const create = function (spec) {
    var that = {}
    that.currencyFrom = spec.currencyFrom;
    that.currencyTo = spec.currencyTo;
    that.billAmount = spec.billAmount;
    that.people = spec.people || 1;
    return that;
  }

  const divide = function (dividend, divisor) {
    let quotient = parseFloat(dividend) / parseFloat(divisor);
    return quotient;
  }

  const roundUp = function (number, decimalPlaces) {
    return Math.ceil(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  }

  const throwError = function (object) {
    let err = new Error(object.message);
    err.status = object.code;
    return err;
  }

  const calculateTip = function (bill) {
    //validate input
    if(!bill.billAmount && !bill.tipPercentage) {
      return throwError({message: "Bill amount and tip percentage not provided", code: 500});
    } else if (!bill.billAmount) {
      return throwError({message: "Bill amount not provided", code: 500});
    } else if (!bill.tipPercentage) {
      return throwError({message: "Tip percentage not provided", code: 500});
    } else {
      //perform function
      bill.billAmount = parseFloat(bill.billAmount);
      bill.tipPercentage = parseFloat(bill.tipPercentage);
      let tipAmount = (bill.billAmount / 100 * bill.tipPercentage);
      tipAmount = parseFloat(tipAmount);
      if(Number.isNaN(tipAmount)) {
        return throwError({message: "Input is not a number", code: 500});
      } else {
        bill.tip = tipAmount;
      }
    }
  }

  const calculateTotalPlusTip = function(bill) {
    if(!bill.billAmount && !bill.tipPercentage) {
      return throwError({message: "Bill amount and tip percentage not provided", code: 500});
    } else if (!bill.billAmount) {
      return throwError({message: "Bill amount not provided", code: 500});
    } else if (!bill.tipPercentage) {
      return throwError({message: "Tip percentage not provided", code: 500});
    } else {
    bill.billAmount = parseFloat(bill.billAmount);
    bill.tipPercentage = parseFloat(bill.tipPercentage);
    let total = (bill.billAmount / 100 * (100 + bill.tipPercentage))
    if(Number.isNaN(total)) {
      return throwError({message: "Input is not a number", code: 500});
    }
    bill.total = total;
    }
  }

  const splitBill = function(bill) {

      if(!bill.decimalPlaces) {
        bill.decimalPlaces = 2;
      }
      bill.billAmount = parseFloat(bill.billAmount);
      bill.tip = parseFloat(bill.tip);
      bill.total = parseFloat(bill.total);
      bill.people = parseFloat(bill.people);
      let billPerPerson = divide(bill.billAmount, bill.people);
      let tipPerPerson = divide(bill.tip, bill.people);
      let totalPerPerson = divide(bill.total, bill.people);
      if(Number.isNaN(billPerPerson) || Number.isNaN(tipPerPerson) || Number.isNaN(totalPerPerson)) {
        return throwError({message: "Input is not a number", code: 500})
      } else {
        if(!bill.people || bill.people < 1) {
          bill.people = 1;
          return bill
        }
        billPerPerson = roundUp(billPerPerson, bill.decimalPlaces);
        tipPerPerson = tipPerPerson.toFixed(bill.decimalPlaces);
        totalPerPerson = totalPerPerson.toFixed(bill.decimalPlaces);
        bill.billPerPerson = parseFloat(billPerPerson);
        bill.tipPerPerson = parseFloat(tipPerPerson);
        bill.totalPerPerson = parseFloat(totalPerPerson);

        let amountPaid = (bill.billPerPerson * bill.people);
        if(amountPaid != bill.billAmount) {
          amountPaid = amountPaid.toFixed(bill.decimalPlaces);
          bill.amountPaid = parseFloat(amountPaid);
        }
      }
  }

  const convert = function (bill) {
    if(!bill.exchangeRate) {
      return throwError({message: "No exchange rate provided", code: 500});
    }
    if(bill.currencyFrom && bill.currencyTo && bill.currencyFrom !== bill.currencyTo) {
      let convBillAmount = parseFloat(bill.billAmount) * parseFloat(bill.exchangeRate);
      if(Number.isNaN(convBillAmount)) {
        return throwError({message: "Bill amount is not a number", code: 500});
      } else {
        bill.convBillAmount = parseFloat(convBillAmount);
      }


      let convTip = parseFloat(bill.tip) * parseFloat(bill.exchangeRate);
      if(Number.isNaN(convTip)) {
        return throwError({message: "Tip amount is not a number", code: 500});
      } else {
        bill.convTip = parseFloat(convTip);
      }

      let convTotal = parseFloat(bill.total) * parseFloat(bill.exchangeRate);
      if(Number.isNaN(convTotal)) {
        return throwError({message: "Bill amount is not a number", code: 500});
      } else {
          bill.convTotal = parseFloat(convTotal);
      }

      if(bill.billPerPerson) {
        let convBillPerPerson = parseFloat(bill.billPerPerson) * parseFloat(bill.exchangeRate);
        bill.convBillPerPerson = parseFloat(convBillPerPerson);
      }

      if(bill.tipPerPerson) {
        let convTipPerPerson = parseFloat(bill.tipPerPerson) * parseFloat(bill.exchangeRate);
        bill.convTipPerPerson = parseFloat(convTipPerPerson);
      }

      if(bill.convTotalPerPerson) {
        let convTotalPerPerson = parseFloat(bill.totalPerPerson) * parseFloat(bill.exchangeRate);
        bill.convTotalPerPerson = parseFloat(convTotalPerPerson);
      }


      if(bill.totalPaid) {
        let convTotalPaid = parseFloat(bill.totalPaid) * parseFloat(bill.exchangeRate);
        bill.convTotalPaid = parseFloat(convTotalPaid);
      }
    } else {
      const err = new Error('Incorrect input for convert bill function');
      err.status = 500;
      return err;
    }
  }

  const round = function(bill) {
    for(var key in bill) {
      if(typeof bill[key] === "number") {
        if( key === "billAmount" || key == "total" || key === "billPerPerson" ||
            key === "tipPerPerson" || key === "totalPaid" || key === "tip") {
        bill[key] = (bill[key]).toFixed(bill.currencyFromPlaces);
      } else if (key === "convBillAmount" || key == "convTotal" || key === "convBillPerPerson" ||
          key === "convTipPerPerson" || key === "convTotalPaid" || key === "convTip" || key === "convTotalPerPerson") {
          bill[key] = (bill[key]).toFixed(bill.currencyToPlaces);
        } else if (key === "totalPerPerson") {
          bill[key] = roundUp(bill[key], bill.currencyFromPlaces);
          bill[key] = String(bill[key]);
        }
      }
    }

  }

  const getCurrencyInfo = function (bill) {
    return new Promise(function(resolve, reject) {
      const currencyInfoRequest = http.get(`http://www.localeplanet.com/api/auto/currencymap.json?name=Y`, response => {
        let body = "";
        response.on('data', data => {
          body += data.toString();
        });
        response.on('end', () => {
          const currencyInfo = JSON.parse(body);
          const supportedCurrencies = ['AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK',
           'EUR','GBP','HKD','HRK','HUF','IDR','ILS','INR','JPY','KRW','MXN','MYR',
           'NOK','NZD','PHP','PLN','RON','RUB','SEK','SGD','THB','TRY','USD','ZAR'];
           let currenciesToReturn = {};
           for (key in currencyInfo) {
             for(let i = 0; i < supportedCurrencies.length; i++) {
               let currency = supportedCurrencies[i];
               currenciesToReturn[currency] = currencyInfo[currency];
             }
           }
           resolve(currenciesToReturn);
        })
      });
    }).catch((err) => throwError(err));
  }

  const getExchangeRate = function (bill) {
    currencyFrom = bill.currencyFrom.slice(0, 3);
    currencyTo = bill.currencyTo.slice(0, 3);
    return new Promise(function(resolve, reject) {
      const exchangeRateRequest = http.get(`http://api.fixer.io/latest?base=${currencyFrom}`, response => {
        let body = "";
        response.on('data', data => {
          body += data.toString();
        });
        response.on('end', () => {
          const exchangeRates = JSON.parse(body);
          if(exchangeRates.error) {
            reject(new Error('Exchange rate request failed'));
          } else {
            const exchangeRate = exchangeRates.rates[currencyTo];
            resolve(exchangeRate);
          }
        })
      });
    }).catch((err) => throwError(err));
  }
  // return public methods
  return {
    create: create,
    calculateTip: calculateTip,
    calculateTotalPlusTip: calculateTotalPlusTip,
    splitBill: splitBill,
    convert: convert,
    round: round,
    getCurrencyInfo: getCurrencyInfo,
    getExchangeRate: getExchangeRate
  }

})()

module.exports.bill = bill;
