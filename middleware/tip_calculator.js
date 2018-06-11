//modular code that will pass an object between the different functions and
//transform it

const bill = (function () {
  const http = require('http');

  const create = function (spec) {
    var that = {}
    that.currencyFrom = spec.currencyFrom;
    that.currencyTo = spec.currencyTo;
    that.billAmount = spec.billAmount;
    that.tipPercentage = spec.tipPercentage;
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
      throw new Error("Bill amount and tip percentage not provided");
    } else if (!bill.billAmount) {
      throw new Error("Bill amount not provided");
    } else if (!bill.tipPercentage) {
      throw new Error("Tip percentage not provided");
    } else {
      //perform function
      bill.billAmount = parseFloat(bill.billAmount);
      bill.tipPercentage = parseFloat(bill.tipPercentage);
      let tipAmount = (bill.billAmount / 100 * bill.tipPercentage);
      tipAmount = parseFloat(tipAmount);
      if(Number.isNaN(tipAmount)) {
        throw new Error({message: "Input is not a number", code: 500});
      } else {
        bill.tip = tipAmount;
      }
    }
  }

  const calculateTotalPlusTip = function(bill) {
    if(!bill.billAmount && !bill.tipPercentage) {
      throw new Error("Bill amount and tip percentage not provided");
    } else if (!bill.billAmount) {
      throw new Error("Bill amount not provided");
    } else if (!bill.tipPercentage) {
      throw new Error("Tip percentage not provided");
    } else {
      bill.billAmount = parseFloat(bill.billAmount);
      bill.tipPercentage = parseFloat(bill.tipPercentage);
      let total = (bill.billAmount / 100 * (100 + bill.tipPercentage))
      if(Number.isNaN(total)) {
        throw new Error("Input is not a number");
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
        throw new Error("Input is not a number");
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
      throw new Error("No exchange rate provided");
    }
    if(bill.currencyFrom && bill.currencyTo && bill.currencyFrom !== bill.currencyTo) {
      let convBillAmount = parseFloat(bill.billAmount) * parseFloat(bill.exchangeRate);
      if(Number.isNaN(convBillAmount)) {
        throw new Error("Bill amount is not a number");
      } else {
        bill.convBillAmount = parseFloat(convBillAmount);
      }


      let convTip = parseFloat(bill.tip) * parseFloat(bill.exchangeRate);
      if(Number.isNaN(convTip)) {
        throw new Error("Tip amount is not a number");
      } else {
        bill.convTip = parseFloat(convTip);
      }

      let convTotal = parseFloat(bill.total) * parseFloat(bill.exchangeRate);
      if(Number.isNaN(convTotal)) {
        throw new Error("Bill amount is not a number");
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

      if(bill.totalPerPerson) {
        let convTotalPerPerson = parseFloat(bill.totalPerPerson) * parseFloat(bill.exchangeRate);
        bill.convTotalPerPerson = parseFloat(convTotalPerPerson);
      }


      if(bill.amountPaid) {
        let convAmountPaid = parseFloat(bill.amountPaid) * parseFloat(bill.exchangeRate);
        bill.convAmountPaid = parseFloat(convAmountPaid);
      }
    } else {
      throw new Error("Currency from cannot equal currency to");
    }
  }

  const round = function(bill) {
    for(var key in bill) {
      if(typeof bill[key] === "number") {
        if( key === "billAmount" || key == "total" || key === "billPerPerson" ||
            key === "tipPerPerson" || key === "amountPaid" || key === "tip") {
        bill[key] = (bill[key]).toFixed(bill.currencyFromPlaces);
      } else if (key=== "totalPerPerson", key === "convBillAmount" || key == "convTotal" || key === "convBillPerPerson" ||
          key === "convTipPerPerson" || key === "convAmountPaid" || key === "convTip" || key === "convTotalPerPerson") {
          bill[key] = (bill[key]).toFixed(bill.currencyToPlaces);
        } else if (key === "totalPerPerson") {
          bill[key] = roundUp(bill[key], bill.currencyFromPlaces);
          bill[key] = String(bill[key]);
        }
      }
    }

  }

  const getCurrencyInfo = function () {
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
    bill.currencyFrom = bill.currencyFrom.slice(0, 3);
    bill.currencyTo = bill.currencyTo.slice(0, 3);

    return new Promise(function(resolve, reject) {
      const exchangeRateRequest = http.get(`http://free.currencyconverterapi.com/api/v5/convert?q=${bill.currencyFrom}_${bill.currencyTo}&compact=y`, response => {
        let body = "";
        response.on('data', data => {
          body += data.toString();
        });
        response.on('end', () => {
          const exchangeRates = JSON.parse(body);
          if(exchangeRates.error) {
            console.dir(exchangeRates);
            reject(new Error('Exchange rate request failed'));
          } else {
            const exchangeRate = exchangeRates[bill.currencyFrom + "_" + bill.currencyTo]['val'];
            resolve(exchangeRate);
          }
        })
      })
      .on('error', error => {
        reject(error);
      })
    })
  }

  const getDecimalPlaces = function(targetCurrency, currencyInfo) {
    var decimalPlaceInfo = {};
    for(var index in currencyInfo) {
      if(currencyInfo.hasOwnProperty(index)) {
        if(targetCurrency.currencyFrom === index) {
          decimalPlaceInfo.currencyFromPlaces = currencyInfo[index].decimal_digits;
          console.log("currencyFrom = " + decimalPlaceInfo.currencyFromPlaces);
        } else {
          decimalPlaceInfo.currencyFromPlaces = 2;
        }
        if(targetCurrency.currencyTo === index) {
          decimalPlaceInfo.currencyToPlaces = currencyInfo[index].decimal_digits;
          console.log("currencyTo = " + decimalPlaceInfo.currencyToPlaces);
        } else {
          decimalPlaceInfo.currencyFromPlaces = 2;
        }
      }
    }
    return decimalPlaceInfo;
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
    getExchangeRate: getExchangeRate,
    getDecimalPlaces: getDecimalPlaces
  }

})()

module.exports.bill = bill;
