//modular code that will pass an object between the different functions and
//transform it

const bill = (function () {
  const http = require('http');

  const toConvert = function(obj) {
    obj.currencyFrom = obj.currencyFrom.slice(0, 3);
    obj.currencyTo = obj.currencyTo.slice(0, 3);
    if(obj.currencyFrom !== obj.currencyTo) {
      obj.convertCurrency = true;
      return true;
    } else {
      obj.convertCurrency = false;
      return false;
    }
  }

  const create = function (spec) {
    var that = {}
    that.currencyFrom = spec.currencyFrom;
    that.currencyTo = spec.currencyTo;
    that.billAmount = spec.billAmount;
    that.tipPercentage = spec.tipPercentage;
    that.people = spec.people || 1;
    that.convertCurrency = toConvert(spec);
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

  const calculateTip = function (obj) {
    //validate input
    if(!obj.billAmount && !obj.tipPercentage) {
      throw new Error("Bill amount and tip percentage not provided");
    } else if (!obj.billAmount) {
      throw new Error("Bill amount not provided");
    } else if (!obj.tipPercentage) {
      throw new Error("Tip percentage not provided");
    } else {
      //perform function
      obj.billAmount = parseFloat(obj.billAmount);
      obj.tipPercentage = parseFloat(obj.tipPercentage);
      let tipAmount = (obj.billAmount / 100 * obj.tipPercentage);
      tipAmount = parseFloat(tipAmount);
      if(Number.isNaN(tipAmount)) {
        throw new Error({message: "Input is not a number", code: 500});
      } else {
        obj.tip = tipAmount;
      }
    }
  }

  const calculateTotalPlusTip = function(obj) {
    if(!obj.billAmount && !obj.tipPercentage) {
      throw new Error("Bill amount and tip percentage not provided");
    } else if (!obj.billAmount) {
      throw new Error("Bill amount not provided");
    } else if (!obj.tipPercentage) {
      throw new Error("Tip percentage not provided");
    } else {
      obj.billAmount = parseFloat(obj.billAmount);
      obj.tipPercentage = parseFloat(obj.tipPercentage);
      let total = (obj.billAmount / 100 * (100 + obj.tipPercentage))
      if(Number.isNaN(total)) {
        throw new Error("Input is not a number");
      }
      obj.total = total;
    }
  }

  const splitBill = function(obj) {

      if(!obj.currencyFromPlaces) {
        obj.currencyFromPlaces = 2;
      }
      obj.billAmount = parseFloat(obj.billAmount);
      obj.tip = parseFloat(obj.tip);
      obj.total = parseFloat(obj.total);
      obj.people = parseFloat(obj.people);
      let billPerPerson = divide(obj.billAmount, obj.people);
      let tipPerPerson = divide(obj.tip, obj.people);
      let totalPerPerson = divide(obj.total, obj.people);
      if(Number.isNaN(billPerPerson) || Number.isNaN(tipPerPerson) || Number.isNaN(totalPerPerson)) {
        throw new Error("Input is not a number");
      } else {
        if(!obj.people || obj.people < 1) {
          obj.people = 1;
          return obj
        }
        billPerPerson = roundUp(billPerPerson, obj.currencyFromPlaces);
        tipPerPerson = tipPerPerson.toFixed(obj.currencyFromPlaces);
        totalPerPerson = totalPerPerson.toFixed(obj.currencyFromPlaces);
        obj.billPerPerson = parseFloat(billPerPerson);
        obj.tipPerPerson = parseFloat(tipPerPerson);
        obj.totalPerPerson = parseFloat(totalPerPerson);

        let amountPaid = (obj.billPerPerson * obj.people);
        if(amountPaid != obj.billAmount) {
          amountPaid = amountPaid.toFixed(obj.currencyFromPlaces);
          obj.amountPaid = parseFloat(amountPaid);
        }
      }
  }

  const convert = function (obj) {
    if(!obj.exchangeRate) {
      throw new Error("No exchange rate provided");
    }
    if(obj.currencyFrom && obj.currencyTo && obj.currencyFrom !== obj.currencyTo) {
      let convBillAmount = parseFloat(obj.billAmount) * parseFloat(obj.exchangeRate);
      if(Number.isNaN(convBillAmount)) {
        throw new Error("Bill amount is not a number");
      } else {
        obj.convBillAmount = parseFloat(convBillAmount);
      }


      let convTip = parseFloat(obj.tip) * parseFloat(obj.exchangeRate);
      if(Number.isNaN(convTip)) {
        throw new Error("Tip amount is not a number");
      } else {
        obj.convTip = parseFloat(convTip);
      }

      let convTotal = parseFloat(obj.total) * parseFloat(obj.exchangeRate);
      if(Number.isNaN(convTotal)) {
        throw new Error("Bill amount is not a number");
      } else {
          obj.convTotal = parseFloat(convTotal);
      }

      if(obj.billPerPerson) {
        let convBillPerPerson = parseFloat(obj.billPerPerson) * parseFloat(obj.exchangeRate);
        obj.convBillPerPerson = parseFloat(convBillPerPerson);
      }

      if(obj.tipPerPerson) {
        let convTipPerPerson = parseFloat(obj.tipPerPerson) * parseFloat(obj.exchangeRate);
        obj.convTipPerPerson = parseFloat(convTipPerPerson);
      }

      if(obj.totalPerPerson) {
        let convTotalPerPerson = parseFloat(obj.totalPerPerson) * parseFloat(obj.exchangeRate);
        obj.convTotalPerPerson = parseFloat(convTotalPerPerson);
      }


      if(obj.amountPaid) {
        let convAmountPaid = parseFloat(obj.amountPaid) * parseFloat(obj.exchangeRate);
        obj.convAmountPaid = parseFloat(convAmountPaid);
      }
    } else {
      throw new Error("Currency from cannot equal currency to");
    }
  }

  const round = function(obj) {
    for(var key in obj) {
      if(typeof obj[key] === "number") {
        if( key === "billAmount" || key == "total" || key === "billPerPerson" ||
            key === "tipPerPerson" || key === "amountPaid" || key === "tip") {
        obj[key] = (obj[key]).toFixed(obj.currencyFromPlaces);
      } else if (key=== "totalPerPerson", key === "convBillAmount" || key == "convTotal" || key === "convBillPerPerson" ||
          key === "convTipPerPerson" || key === "convAmountPaid" || key === "convTip" || key === "convTotalPerPerson") {
          obj[key] = (obj[key]).toFixed(obj.currencyToPlaces);
        } else if (key === "totalPerPerson") {
          obj[key] = roundUp(obj[key], obj.currencyFromPlaces);
          obj[key] = String(obj[key]);
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

  const getExchangeRate = function (obj) {
    obj.currencyFrom = obj.currencyFrom.slice(0, 3);
    obj.currencyTo = obj.currencyTo.slice(0, 3);

    return new Promise(function(resolve, reject) {
      const exchangeRateRequest = http.get(`http://free.currencyconverterapi.com/api/v5/convert?q=${obj.currencyFrom}_${obj.currencyTo}&compact=y`, response => {
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
            const exchangeRate = exchangeRates[obj.currencyFrom + "_" + obj.currencyTo]['val'];
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
        } else {
          decimalPlaceInfo.currencyFromPlaces = 2;
        }
        if(targetCurrency.currencyTo === index) {
          decimalPlaceInfo.currencyToPlaces = currencyInfo[index].decimal_digits;
        } else {
          decimalPlaceInfo.currencyFromPlaces = 2;
        }
      }
    }
    return decimalPlaceInfo;
  }

  const build = function(obj, currencyInfo) {
    bill.toConvert(obj);
    const decimalPlaceInfo = bill.getDecimalPlaces(obj, currencyInfo);
    obj.currencyFromPlaces = decimalPlaceInfo.currencyFromPlaces;
    if(obj.convertCurrency) {
      obj.currencyToPlaces = decimalPlaceInfo.currencyToPlaces;
    }
    bill.calculateTip(obj);
    bill.calculateTotalPlusTip(obj);
    bill.splitBill(obj);
    if(obj.convertCurrency) {
      bill.convert(obj);
    }
    bill.round(obj);
    return obj;
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
    getDecimalPlaces: getDecimalPlaces,
    toConvert: toConvert,
    build: build
  }

})()

module.exports.bill = bill;
