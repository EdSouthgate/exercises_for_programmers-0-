
const roundUp = require('../mathmatical_methods/mathmatical_methods.js').roundUp;

function Bill(object) {
  this.currencyFrom = (object.currencyFrom).slice(0, 3);
  this.currencyTo = (object.currencyTo).slice(0, 3);
  let billAmount = parseFloat(object.billAmount);
  billAmount = billAmount.toFixed(this.currencyFromPlaces);
  this.billAmount = parseFloat(billAmount);
  this.tipPercentage = parseFloat(object.tipPercentage);
  this.people = parseFloat(object.people);

}

Bill.prototype.calculateTip = function () {
  let tipAmount = (this.billAmount / 100 * this.tipPercentage).toFixed(this.currencyFromPlaces);
  tipAmount = parseFloat(tipAmount);
  if(isNaN(tipAmount)) {
    let err = new Error("Input is not a number");
    return err;
  } else {
    tipAmount = tipAmount.toFixed(this.currencyFromPlaces);
    tipAmount = parseFloat(tipAmount);
    this.tip = tipAmount;
  }
}


Bill.prototype.calculateTotalPlusTip = function () {
  let total = this.billAmount + this.tip;
  if(isNaN(total)) {
    let err = new Error("Input is not a number");
    return err;
  } else {
    total = total.toFixed(this.currencyFromPlaces);
    total = parseFloat(total);
    this.total = total;
  }
}

Bill.prototype.splitBill = function() {
  let billPerPerson = this.billAmount / this.people;
  billPerPerson = roundUp(billPerPerson, this.currencyFromPlaces);
  billPerPerson = parseFloat(billPerPerson);
  this.billPerPerson = billPerPerson;

  let tipPerPerson = (this.tip / this.people).toFixed(this.currencyFromPlaces);
  tipPerPerson = parseFloat(tipPerPerson);
  this.tipPerPerson = tipPerPerson;

  let totalPerPerson = (this.total / this.people).toFixed(this.currencyFromPlaces);
  totalPerPerson = parseFloat(totalPerPerson);
  this.totalPerPerson = totalPerPerson;

  let totalPaid = (billPerPerson * this.people).toFixed(this.currencyFromPlaces);
  totalPaid = parseFloat(totalPaid);
  if(totalPaid !== this.billAmount) {
    this.totalPaid = totalPaid;
  }
}

Bill.prototype.convertBill = function() {
  let convBillAmount = parseFloat(this.billAmount) * parseFloat(this.exchangeRate);
  convBillAmount = convBillAmount.toFixed(this.currencyToPlaces);
  this.convBillAmount = parseFloat(convBillAmount);

  let convTip = parseFloat(this.tip) * parseFloat(this.exchangeRate);
  convTip = convTip.toFixed(this.currencyToPlaces);
  this.convTip = parseFloat(convTip);

  let convTotal = parseFloat(this.total) * parseFloat(this.exchangeRate);
  convTotal = convTotal.toFixed(this.currencyToPlaces);
  this.convTotal = parseFloat(convTotal);

  let convBillPerPerson = parseFloat(this.billPerPerson) * parseFloat(this.exchangeRate);
  convBillPerPerson = convBillPerPerson.toFixed(this.currencyToPlaces);
  this.convBillPerPerson = parseFloat(convBillPerPerson);

  let convTipPerPerson = parseFloat(this.tipPerPerson) * parseFloat(this.exchangeRate);
  convTipPerPerson = convTipPerPerson.toFixed(this.currencyToPlaces);
  this.convTipPerPerson = parseFloat(convTipPerPerson);

  let convTotalPerPerson = parseFloat(this.totalPerPerson) * parseFloat(this.exchangeRate);
  convTotalPerPerson = convTotalPerPerson.toFixed(this.currencyToPlaces);
  this.convTotalPerPerson = parseFloat(convTotalPerPerson);

  if(this.totalPaid) {
    let convTotalPaid = parseFloat(this.totalPaid) * parseFloat(this.exchangeRate);
    convTotalPaid = convTotalPaid.toFixed(this.currencyToPlaces);
    this.convTotalPaid = parseFloat(convTotalPaid);
  }

}

function callBack(data) {
  return data;
}

module.exports.Bill = Bill;
module.exports.callBack = callBack;
