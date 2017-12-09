function roundUp(number, decimalPlaces) {
  return Math.ceil(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

function divide(dividend, divisor) {
  let quotient = parseFloat(dividend) / parseFloat(divisor);
  return quotient;
}

module.exports.roundUp = roundUp;
module.exports.divide = divide;
