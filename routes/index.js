const express = require('express');
const router = express.Router();
const BillObject = require('../tip_calculator/tip_calculator_methods.js').BillObject

router.get('/', (req, res, next) => {
  res.render('app');
  next();
});

router.post('/result', (req, res, next) => {
  let bill = new BillObject(req.body.currency, req.body.billAmount, req.body.tipPercentage, req.body.people);
  // res.send('Name = ' + person.name + 'Bill Amount = ' + person.billAmount +
  // 'Tip Percentage = ' + person.tipPercentage + 'Tip Amount = ' + person.tip
  // + 'Total = ' + person.total);
  res.render('result', {currency: bill.currency, billAmount: bill.billAmount, tipPercentage: bill.tipPercentage,
  tip: bill.tip, total: bill.total, people: bill.people, billPerPerson: bill.billPerPerson, tipPerPerson: bill.tipPerPerson,
  totalPerPerson: bill.totalPerPerson});
});

module.exports = router;
