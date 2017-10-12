const http = require('http');

getExchangeRate = function(currencyFrom, currencyTo) {
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

getDecimalPlaces = function(currencyFrom, currencyTo) {
}

module.exports.getExchangeRate = getExchangeRate;
