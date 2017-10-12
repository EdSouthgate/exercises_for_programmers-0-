
const roundUp = require('../mathmatical_methods/mathmatical_methods.js').roundUp;

function Bill(object) {
  this.currencyFrom = object.currencyFrom;
  this.currencyTo = object.currencyTo;
  let billAmount = parseFloat(object.billAmount);
  billAmount = billAmount.toFixed(2);
  this.billAmount = parseFloat(billAmount);
  this.tipPercentage = parseFloat(object.tipPercentage);
  this.people = parseFloat(object.people);
}

Bill.prototype.calculateTip = function () {
  let tipAmount = (this.billAmount / 100 * this.tipPercentage).toFixed(2);
  tipAmount = parseFloat(tipAmount);
  if(isNaN(tipAmount)) {
    let err = new Error("Input is not a number");
    return err;
  } else {
    tipAmount = tipAmount.toFixed(2);
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
    total = total.toFixed(2);
    total = parseFloat(total);
    this.total = total;
  }
}

Bill.prototype.splitBill = function() {
  let billPerPerson = this.billAmount / this.people;
  billPerPerson = roundUp(billPerPerson, 2);
  billPerPerson = parseFloat(billPerPerson);
  this.billPerPerson = billPerPerson;

  let tipPerPerson = (this.tip / this.people).toFixed(2);
  tipPerPerson = parseFloat(tipPerPerson);
  this.tipPerPerson = tipPerPerson;

  let totalPerPerson = (this.total / this.people).toFixed(2);
  totalPerPerson = parseFloat(totalPerPerson);
  this.totalPerPerson = totalPerPerson;

  let totalPaid = (billPerPerson * this.people).toFixed(2);
  totalPaid = parseFloat(totalPaid);
  if(totalPaid !== this.billAmount) {
    this.totalPaid = totalPaid;
  }
}

Bill.prototype.convertBill = function() {
  let convBillAmount = parseFloat(this.billAmount) * parseFloat(this.exchangeRate);
  convBillAmount = convBillAmount.toFixed(2);
  this.convBillAmount = parseFloat(convBillAmount);

  let convTip = parseFloat(this.tip) * parseFloat(this.exchangeRate);
  convTip = convTip.toFixed(2);
  this.convTip = parseFloat(convTip);

  let convTotal = parseFloat(this.total) * parseFloat(this.exchangeRate);
  convTotal = convTotal.toFixed(2);
  this.convTotal = parseFloat(convTotal);

  let convBillPerPerson = parseFloat(this.billPerPerson) * parseFloat(this.exchangeRate);
  convBillPerPerson = convBillPerPerson.toFixed(2);
  this.convBillPerPerson = parseFloat(convBillPerPerson);

  let convTipPerPerson = parseFloat(this.tipPerPerson) * parseFloat(this.exchangeRate);
  convTipPerPerson = convTipPerPerson.toFixed(2);
  this.convTipPerPerson = parseFloat(convTipPerPerson);

  let convTotalPerPerson = parseFloat(this.totalPerPerson) * parseFloat(this.exchangeRate);
  convTotalPerPerson = convTotalPerPerson.toFixed(2);
  this.convTotalPerPerson = parseFloat(convTotalPerPerson);

  if(this.totalPaid) {
    let convTotalPaid = parseFloat(this.totalPaid) * parseFloat(this.exchangeRate);
    convTotalPaid = convTotalPaid.toFixed(2);
    this.convTotalPaid = parseFloat(convTotalPaid);
  }

}

function callBack(data) {
  return data;
}

module.exports.Bill = Bill;
module.exports.callBack = callBack;
