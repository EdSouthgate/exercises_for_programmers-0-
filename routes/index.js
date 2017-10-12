const express = require('express');
const router = express.Router();
const Bill = require('../tip_calculator/tip_calculator_methods.js').Bill

router.get('/', (req, res) => {
  res.render('app');
  next();
});

router.post('/result', (req, res) => {

  console.dir(res.locals.bill)
  // res.render('result', {currencyFrom: res.locals.bill.currencyFrom, currencyTo: res.locals.bill.currencyTo,
  //                       billAmount: res.locals.bill.billAmount, tipPercentage: res.locals.bill.tipPercentage,
  //                       tip: res.locals.bill.tip, total: res.locals.bill.total, people: res.locals.bill.people,
  //                       billPerPerson: res.locals.bill.billPerPerson, tipPerPerson: res.locals.bill.tipPerPerson,
  //                       totalPerPerson: res.locals.bill.totalPerPerson, totalPaid: res.locals.bill.totalPaid,
  //                       convBillAmount: res.locals.bill.convBillAmount, convTip: res.locals.bill.convTip,
  //                       convTotal: res.locals.bill.convTotal, convBillPerPerson: res.locals.bill.convBillPerPerson,
  //                       convTipPerPerson: res.locals.bill.convTipPerPerson, convTotalPaid: res.locals.bill.convTotalPaid,
  //                       });
  res.render('result', {bill: res.locals.bill});
});



module.exports = router;
