//modular code that will pass an object between the different functions and
//transform it

const bill = (function () {

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
      return throwError({message: "Bill amount and tip percentage not provided", code: 500});
    } else if (!bill.billAmount) {
      return throwError({message: "Bill amount not provided", code: 500});
    } else if (!bill.tipPercentage) {
      return throwError({message: "Tip percentage not provided", code: 500});
    } else {
      //perform function
      bill.billAmount = parseFloat(bill.billAmount);
      bill.tipPercentage = parseFloat(bill.tipPercentage);
      let tipAmount = (bill.billAmount / 100 * bill.tipPercentage);
      tipAmount = parseFloat(tipAmount);
      if(Number.isNaN(tipAmount)) {
        return throwError({message: "Input is not a number", code: 500});
      } else {
        bill.tip = tipAmount;
      }
    }
  }

  const calculateTotalPlusTip = function(bill) {
    if(!bill.billAmount && !bill.tipPercentage) {
      return throwError({message: "Bill amount and tip percentage not provided", code: 500});
    } else if (!bill.billAmount) {
      return throwError({message: "Bill amount not provided", code: 500});
    } else if (!bill.tipPercentage) {
      return throwError({message: "Tip percentage not provided", code: 500});
    } else {
    bill.billAmount = parseFloat(bill.billAmount);
    bill.tipPercentage = parseFloat(bill.tipPercentage);
    let total = (bill.billAmount / 100 * (100 + bill.tipPercentage))
    if(Number.isNaN(total)) {
      return throwError({message: "Input is not a number", code: 500});
    }
    bill.total = total;
    }
  }

  const splitBill = function(bill) {
      bill.billAmount = parseFloat(bill.billAmount);
      bill.tip = parseFloat(bill.tip);
      bill.total = parseFloat(bill.total);
      bill.people = parseFloat(bill.people);
      let billPerPerson = divide(bill.billAmount, bill.people);
      let tipPerPerson = divide(bill.tip, bill.people);
      let totalPerPerson = divide(bill.total, bill.people);
      if(Number.isNaN(billPerPerson) || Number.isNaN(tipPerPerson) || Number.isNaN(totalPerPerson)) {
        return throwError({message: "Input is not a number", code: 500})
      } else {
        bill.billPerPerson = billPerPerson;
        bill.tipPerPerson = tipPerPerson;
        bill.totalPerPerson = totalPerPerson;
      }
  }

  // return public methods
  return {
    calculateTip: calculateTip,
    calculateTotalPlusTip: calculateTotalPlusTip,
    splitBill: splitBill
  }

})()

module.exports.bill = bill;
