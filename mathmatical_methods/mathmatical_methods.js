function roundUp(number, decimalPlaces) {
  return Math.ceil(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

module.exports.roundUp = roundUp;
