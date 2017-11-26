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
