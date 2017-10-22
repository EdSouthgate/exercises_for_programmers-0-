const http = require('http');

function getExchangeRate(currencyFrom, currencyTo) {
  currencyFrom = currencyFrom.slice(0, 3);
  currencyTo = currencyTo.slice(0, 3);
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
  });
}

function getCurrencyInfo(currencyFrom, currencyTo) {
  return new Promise(function(resolve, reject) {
    const currencyInfoRequest = http.get(`http://www.localeplanet.com/api/auto/currencymap.json?name=Y`, response => {
      let body = "";
      response.on('data', data => {
        body += data.toString();
      });
      response.on('end', () => {
        const currencyInfo = JSON.parse(body);
        resolve(currencyInfo);
      })
    });
  });
}

function getDecimalPlaces(targetCurrency, currencyInfo) {
  var decimalPlaceInfo = {};
  for(var index in currencyInfo) {
    if(currencyInfo.hasOwnProperty(index)) {
      if(targetCurrency.currencyFrom === index) {
        decimalPlaceInfo.currencyFromPlaces = currencyInfo[index].decimal_digits;
      }
      if(targetCurrency.currencyTo === index) {
        decimalPlaceInfo.currencyToPlaces = currencyInfo[index].decimal_digits;
      }
    }
  }
  return decimalPlaceInfo;
}

module.exports.getExchangeRate = getExchangeRate;
module.exports.getCurrencyInfo = getCurrencyInfo;
module.exports.getDecimalPlaces = getDecimalPlaces;
