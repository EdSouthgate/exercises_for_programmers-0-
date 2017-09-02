const express = require('express');
const router = express.Router();
const PersonObject = require('../tip_calculator/tip_calculator_methods.js').PersonObject


router.get('/', (req, res, next) => {
  res.render('app');
  next();
});

router.post('/result', (req, res, next) => {
  let person = new PersonObject(req.body.name, req.body.billAmount, req.body.tipPercentage);
  // res.send('Name = ' + person.name + 'Bill Amount = ' + person.billAmount +
  // 'Tip Percentage = ' + person.tipPercentage + 'Tip Amount = ' + person.tip
  // + 'Total = ' + person.total);
  res.render('result', {name: person.name, billAmount: person.billAmount, tipPercentage: person.tipPercentage,
  tip: person.tip, total: person.total});
});

module.exports = router;
