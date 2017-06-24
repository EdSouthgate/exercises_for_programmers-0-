var expect = require('chai').expect;

// test suite
describe('Mocha', function() {
  //Test spec (unit test)
  it('should run our tests using npm', function(){
    expect(true).to.be.ok;
  });
});

describe('calculateTip', function() {
  const calculateTip = require('../tip_calculator/tip_calculator_methods').calculateTip;
    it('should take the total bill and tip percentage and return the amount of the tip',
  function() {
    expect(calculateTip(100, 10)).to.equal(10);
  })

  it('it should return a number rounded to two decimal figures',
function() {
  expect(calculateTip(15.78234, 12.782)).to.equal(2.02);
  })

  it('it should be able to accept numbers as strings types and number types',
function() {
  expect(calculateTip('15.78234', '12.782')).to.equal(2.02);
  })

  it('it should return an error if the input is not a number',
function() {

  expect(calculateTip("fifteen", "twenty five")).to.equal("Error input is not a number");
  expect(calculateTip("fifteen", 25)).to.equal("Error input is not a number");
  expect(calculateTip(15 , "twenty five")).to.equal("Error input is not a number");
  });
});

describe('calculateTotal', function() {
  const calculateTotalPlusTip = require('../tip_calculator/tip_calculator_methods').calculateTotalPlusTip

  it('should take bill amount and tip rate and return the total including the tip',
  function() {
    expect(calculateTotalPlusTip(100, 10)).to.equal(110);
  });

  it('should round the output to two decimal figures',
  function() {
    expect(calculateTotalPlusTip(15.78234, 12.782)).to.equal(17.80);
  });

  it('it should be able to accept numbers as strings types and number types',
function() {
  expect(calculateTotalPlusTip('15.78234', '12.782')).to.equal(17.80);
  });

  it('it should return an error if the input is not a number',
function() {

  expect(calculateTotalPlusTip("fifteen", "twenty five")).to.equal("Error input is not a number");
  expect(calculateTotalPlusTip("fifteen", 25)).to.equal("Error input is not a number");
  expect(calculateTotalPlusTip(15 , "twenty five")).to.equal("Error input is not a number");
  });
})

describe('PersonObject', function() {
  const PersonObject = require('../tip_calculator/tip_calculator_methods').PersonObject
  it('should take input and create a person object to be outputted to the console',
function() {
    expect(new PersonObject("Name", "100", "10")).to.deep.equal({name: "Name", billAmount: 100, tipPercentage: 10, tip: 10.00, total: 110.00});
  })
});
