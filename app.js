const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const Bill = require('./tip_calculator/tip_calculator_methods.js').Bill;
const getExchangeRate = require('./middleware/index.js').getExchangeRate;
const getCurrencyInfo = require('./middleware/index.js').getCurrencyInfo;
const getDecimalPlaces = require('./middleware/index.js').getDecimalPlaces;

app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use('/static', express.static('public'))
app.set('view engine', 'pug');

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  getCurrencyInfo()
            .then((data) => {
              const currencyInfo = data
              res.locals.currencyInfo = currencyInfo;
              next();
            })
            .catch((error) => {
              next(error);
            })

});

app.use('/result', (req, res, next) => {
  const bill = new Bill(req.body);
  getExchangeRate(bill.currencyFrom, bill.currencyTo)
      .then((value) => {
        bill.exchangeRate = value;
      })
      .then(function(){
        const decimalPlaceInfo = getDecimalPlaces(bill, res.locals.currencyInfo);
        bill.currencyFromPlaces = decimalPlaceInfo.currencyFromPlaces;
        bill.currencyToPlaces = decimalPlaceInfo.currencyToPlaces;
        bill.calculateTip();
        bill.calculateTotalPlusTip();
        bill.splitBill();
        bill.convertBill();
        bill.roundBill();
        res.locals.bill = bill;
        next();
      }).catch((err) => {
        next(err);
      })
});



app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});









const mainRoutes = require('./routes');
app.use(mainRoutes);






app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});

//code below is to test exchange rate function in console
// let currency1 = process.argv.slice(2, 3)[0];
// let currency2 = process.argv.slice(3, 4);




module.exports.app = app;
