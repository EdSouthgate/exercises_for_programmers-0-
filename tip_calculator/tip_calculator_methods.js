const http = require('http');

function calculateTip(billAmount, tipPercentage) {
  billAmount = parseFloat(billAmount);
  tipPercentage = parseFloat(tipPercentage);
  let tipAmount = (billAmount / 100 * tipPercentage).toFixed(2);
  tipAmount = parseFloat(tipAmount);
  if(isNaN(tipAmount)) {
    let err = new Error("Input is not a number");
    return err
  } else {
    tipAmount = tipAmount.toFixed(2);
    tipAmount = parseFloat(tipAmount);
    return tipAmount;
  }
}

function calculateTotalPlusTip(billAmount, tipPercentage) {
  billAmount = parseFloat(billAmount);
  tipPercentage = parseFloat(tipPercentage);
  let tipAmount = calculateTip(billAmount, tipPercentage);
  let total = billAmount + tipAmount;
  if(isNaN(total)) {
    let err = new Error("Input is not a number");
    return err
  } else {
    total = total.toFixed(2);
    total = parseFloat(total);
    return total;
  }
}

function splitBill(amount, people) {
  amount = parseFloat(amount);
  people = parseFloat(people);
  if(isNaN(amount) || isNaN(people)) {
    const err = new Error('Input is not a number');
    return err;
  } else {
    let amountPerPerson = amount / people;
    amountPerPerson = amountPerPerson.toFixed(2);
    amountPerPerson = parseFloat(amountPerPerson)
    return amountPerPerson;
  }
}



function BillObject(currency, billAmount, tipPercentage, people) {
  this.currency = currency;
  this.billAmount = parseFloat(billAmount);
  this.tipPercentage = parseFloat(tipPercentage);
  this.tip = parseFloat(calculateTip(billAmount, tipPercentage));
  this.total = parseFloat(calculateTotalPlusTip(billAmount, tipPercentage));
  this.people = parseFloat(people);
  this.billPerPerson = splitBill(this.billAmount, this.people);
  this.tipPerPerson = splitBill(this.tip, this.people);
  this.totalPerPerson = parseFloat(this.billPerPerson) + parseFloat(this.tipPerPerson);
}

function getExchangeRate(currencyFrom, currencyTo) {
  //connect to API url
  const exchangeRateRequest = http.get(`http://api.fixer.io/latest?base=${currencyFrom}`, response => {
    //read data
    let body = "";
    response.on('data', data => {
      body += data.toString();
    });
    response.on('end', () => {
      //parse data
      const exchangeRates = JSON.parse(body);
      //find exchange rate
      const exchangeRate = exchangeRates.rates[currencyTo];
      //return data
      return exchangeRate;
    });
  });
}

function currencyConvert(value, exchangeRate) {
  return value * exchangeRate;
}

module.exports.calculateTip = calculateTip;
module.exports.calculateTotalPlusTip = calculateTotalPlusTip;
module.exports.splitBill = splitBill;
module.exports.BillObject = BillObject;
module.exports.getExchangeRate = getExchangeRate;
module.exports.currencyConvert = currencyConvert;
