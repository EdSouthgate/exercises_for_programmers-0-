
const roundUp = require('../mathmatical_methods/mathmatical_methods.js').roundUp;

function Bill(object) {
  this.currencyFrom = (object.currencyFrom).slice(0, 3);
  this.currencyTo = (object.currencyTo).slice(0, 3);
  let billAmount = parseFloat(object.billAmount);
  if(object.currencyFromPlaces) {
    billAmount = billAmount.toFixed(object.currencyFromPlaces);
    this.billAmount = parseFloat(billAmount);
  } else {
    billAmount = billAmount.toFixed(2);
    this.billAmount = parseFloat(billAmount);
  }
  this.tipPercentage = parseFloat(object.tipPercentage);
  this.people = parseFloat(object.people);
}

Bill.prototype.calculateTip = function () {
  let tipAmount = (this.billAmount / 100 * this.tipPercentage);
  tipAmount = parseFloat(tipAmount);
  if(isNaN(tipAmount)) {
    let err = new Error("Input is not a number");
    return err;
  } else {
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
    total = parseFloat(total);
    this.total = total;
  }
}

Bill.prototype.splitBill = function() {
  let billPerPerson = this.billAmount / this.people;
  if(this.currencyFromPlaces) {
    billPerPerson = roundUp(billPerPerson, this.currencyFromPlaces);
  } else {
    billPerPerson = roundUp(billPerPerson, 2);
  }
  billPerPerson = parseFloat(billPerPerson);
  this.billPerPerson = billPerPerson;

  let tipPerPerson = (this.tip / this.people);
  if(this.currencyFromPlaces) {
    tipPerPerson = tipPerPerson.toFixed(this.currencyFromPlaces);
  } else {
    tipPerPerson = tipPerPerson.toFixed(2);
  }
  tipPerPerson = parseFloat(tipPerPerson);
  this.tipPerPerson = tipPerPerson;

  let totalPerPerson = (this.total / this.people);
  if(this.currencyFromPlaces) {
      totalPerPerson = totalPerPerson.toFixed(this.currencyFromPlaces);
  } else {
      totalPerPerson = totalPerPerson.toFixed(2);
  }
  totalPerPerson = parseFloat(totalPerPerson);
  this.totalPerPerson = totalPerPerson;

  let totalPaid = (billPerPerson * this.people);
  if(this.currencyFromPlaces) {
      totalPaid = totalPaid.toFixed(this.currencyFromPlaces);
  } else {
      totalPaid = totalPaid.toFixed(2);
  }
  totalPaid = parseFloat(totalPaid);
  if(totalPaid != this.billAmount) {
    this.totalPaid = totalPaid;
  }
}

Bill.prototype.convertBill = function() {
  let convBillAmount = parseFloat(this.billAmount) * parseFloat(this.exchangeRate);
  this.convBillAmount = parseFloat(convBillAmount);

  let convTip = parseFloat(this.tip) * parseFloat(this.exchangeRate);
  this.convTip = parseFloat(convTip);

  let convTotal = parseFloat(this.total) * parseFloat(this.exchangeRate);
  this.convTotal = parseFloat(convTotal);

  let convBillPerPerson = parseFloat(this.billPerPerson) * parseFloat(this.exchangeRate);
  this.convBillPerPerson = parseFloat(convBillPerPerson);

  let convTipPerPerson = parseFloat(this.tipPerPerson) * parseFloat(this.exchangeRate);
  this.convTipPerPerson = parseFloat(convTipPerPerson);

  let convTotalPerPerson = parseFloat(this.totalPerPerson) * parseFloat(this.exchangeRate);
  this.convTotalPerPerson = parseFloat(convTotalPerPerson);

  if(this.totalPaid) {
    let convTotalPaid = parseFloat(this.totalPaid) * parseFloat(this.exchangeRate);
    this.convTotalPaid = parseFloat(convTotalPaid);
  }

}

Bill.prototype.roundBill = function() {
    for(var key in this) {
      if(typeof this[key] === 'number') {
        if( key === 'billAmount' || key == 'total' || key === 'billPerPerson' ||
            key === 'tipPerPerson' || key === 'totalPaid' || key === 'tip') {
        this[key] = (this[key]).toFixed(this.currencyFromPlaces);
        } else if (key === 'convBillAmount' || key == 'convTotal' || key === 'convBillPerPerson' ||
          key === 'convTipPerPerson' || key === 'convTotalPaid' || key === 'convTip' || key === 'convTotalPerPerson') {
          this[key] = (this[key]).toFixed(this.currencyToPlaces);
        } else if (key === 'totalPerPerson') {
          this[key] = roundUp(this[key], this.currencyFromPlaces);
          this[key] = String(this[key]);
        }
      }
    }

}

function callBack(data) {
  return data;
}

module.exports.Bill = Bill;
module.exports.callBack = callBack;
