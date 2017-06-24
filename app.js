const PersonObject = require('./tip_calculator/tip_calculator_methods.js').PersonObject

let name = process.argv.slice(2, 3)[0];
let billAmount = process.argv.slice(3, 4);
let tipPercentage = process.argv.slice(4, 5);

console.dir(new PersonObject(name, billAmount, tipPercentage));
