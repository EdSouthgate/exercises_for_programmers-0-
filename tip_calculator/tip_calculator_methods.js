function calculateTip(billAmount, tipPercentage) {
  let tipAmount = (billAmount / 100 * tipPercentage).toFixed(2);
  tipAmount = parseFloat(tipAmount);
  if(isNaN(tipAmount)) {
    return "Error input is not a number";
  } else {
    return tipAmount;
  }
}

function calculateTotalPlusTip(billAmount, tipPercentage) {
  let tipAmount = calculateTip(billAmount, tipPercentage);
  let total = (parseFloat(billAmount) + parseFloat(tipAmount)).toFixed(2);
  if(isNaN(total)) {
    return "Error input is not a number";
  } else {
    return parseFloat(total);
  }

}

function PersonObject(name, billAmount, tipPercentage) {
  this.name = name;
  this.billAmount = parseFloat(billAmount);
  this.tipPercentage = parseFloat(tipPercentage);
  this.tip = parseFloat(calculateTip(billAmount, tipPercentage));
  this.total = parseFloat(calculateTotalPlusTip(billAmount, tipPercentage));
}

module.exports.calculateTip = calculateTip;
module.exports.calculateTotalPlusTip = calculateTotalPlusTip;
module.exports.PersonObject = PersonObject;
