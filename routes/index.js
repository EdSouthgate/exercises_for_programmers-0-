const express = require('express');
const router = express.Router();
const Bill = require('../tip_calculator/tip_calculator_methods.js').Bill;
const getCurrencyInfo = require('../middleware/index.js').getCurrencyInfo;

router.get('/', (req, res) => {
  res.render('app', {currencyInfo: res.locals.currencyInfo});
});



router.post('/result', (req, res) => {
  res.render('result', {bill: res.locals.bill});
});




module.exports = router;
