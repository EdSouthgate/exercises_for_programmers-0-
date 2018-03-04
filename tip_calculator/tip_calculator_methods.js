"use strict";
const roundUp = require("../mathmatical_methods/mathmatical_methods.js").roundUp;
const divide = require("../mathmatical_methods/mathmatical_methods.js").divide;

function Bill(object) {
  if(object.currencyFrom && object.currencyTo && object.currencyFrom !== object.currencyTo) {
  this.currencyFrom = (object.currencyFrom).slice(0, 3);
  this.currencyTo = (object.currencyTo).slice(0, 3);
} else if(typeof object.currencyFrom === 'string'){
  this.currencyFrom = (object.currencyFrom).slice(0,3);
} else {
  this.currencyFrom = undefined;
}
  this.billAmount = parseFloat(object.billAmount);
  this.tipPercentage = parseFloat(object.tipPercentage);
  if(object.people && object.people > 1) {
    this.people = parseFloat(object.people);
  }
}

Bill.prototype.calculateTip = function (next) {
  let tipAmount = (this.billAmount / 100 * this.tipPercentage);
  tipAmount = parseFloat(tipAmount);
  if(Number.isNaN(tipAmount)) {
    let err = new Error("Input is not a number");
    err.status(500);
    throw err;

  } else {
    this.tip = tipAmount;
  }
}



Bill.prototype.calculateTotalPlusTip = function (next) {
  let total = this.billAmount + this.tip;
  if(Number.isNaN(total)) {
    let err = new Error("Input is not a number");
    err.status(500);
    throw err;
  }
  total = parseFloat(total);
  this.total = total;

};

Bill.prototype.splitBill = function() {
    if(!this.people) return;
    let billPerPerson = divide(this.billAmount, this.people);
    if(this.currencyFromPlaces) {
      billPerPerson = roundUp(billPerPerson, this.currencyFromPlaces);
    } else {
      billPerPerson = roundUp(billPerPerson, 2);
    }
    billPerPerson = parseFloat(billPerPerson);
    this.billPerPerson = billPerPerson;

    let tipPerPerson = divide(this.tip, this.people);
    this.tipPerPerson = tipPerPerson;

    let totalPerPerson = divide(this.total, this.people);
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

Bill.prototype.convertBill = function(next) {
  if(this.currencyFrom && this.currencyTo && this.currencyFrom !== this.currencyTo) {
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
  } else {
    const err = new Error('Incorrect input for convert bill function');
    err.status(500);
    throw err;
  }
};

Bill.prototype.roundBill = function() {
    for(var key in this) {
      if(typeof this[key] === "number") {
        if( key === "billAmount" || key == "total" || key === "billPerPerson" ||
            key === "tipPerPerson" || key === "totalPaid" || key === "tip") {
        this[key] = (this[key]).toFixed(this.currencyFromPlaces);
      } else if (key === "convBillAmount" || key == "convTotal" || key === "convBillPerPerson" ||
          key === "convTipPerPerson" || key === "convTotalPaid" || key === "convTip" || key === "convTotalPerPerson") {
          this[key] = (this[key]).toFixed(this.currencyToPlaces);
        } else if (key === "totalPerPerson") {
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
