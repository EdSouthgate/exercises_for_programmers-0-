const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const bill = require('./middleware/tip_calculator.js').bill;
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
            .then(data => {
              res.locals.currencyInfo = data;
              next();
            })
            .catch(error => {
              console.dir(error);
              next(error);
            })

});

app.use('/result', (req, res, next) => {
  let myBill = bill.create(req.body);
  let currencyInfo = res.locals.currencyInfo;
  bill.getExchangeRate(myBill)
      .then((data) => {
        console.log(data);
        myBill.exchangeRate = data;
        res.locals.bill = myBill;
        next();
      })
      .catch(error => {
        console.dir(error);
        next(error);
      });
  // const bill = new Bill(req.body);
  // getExchangeRate(bill.currencyFrom, bill.currencyTo)
  //     .then((value) => {
  //       bill.exchangeRate = value;
  //     })
  //     .then(function(){
  //       const decimalPlaceInfo = getDecimalPlaces(bill, res.locals.currencyInfo);
  //       bill.currencyFromPlaces = decimalPlaceInfo.currencyFromPlaces;
  //       bill.currencyToPlaces = decimalPlaceInfo.currencyToPlaces;
  //       bill.calculateTip();
  //       bill.calculateTotalPlusTip();
  //       bill.splitBill();
  //       bill.convertBill();
  //       bill.roundBill();
  //       res.locals.bill = bill;
  //       next();
  //     }).catch((err) => {
  //       next(err);
  //     })
});

app.use('/result', (req, res, next) => {
  let myBill = res.locals.bill;
  let currencyInfo = res.locals.currencyInfo
  console.dir(currencyInfo);
  console.dir(myBill)
  try {
    const decimalPlaceInfo = bill.getDecimalPlaces(myBill, currencyInfo);
     myBill.currencyFromPlaces = decimalPlaceInfo.currencyFromPlaces;
     myBill.currencyToPlaces = decimalPlaceInfo.currencyToPlaces;
     console.log(decimalPlaceInfo);
     //console.log(1)
     bill.calculateTip(myBill);
     //console.log(2)
     bill.calculateTotalPlusTip(myBill);
     //console.log(3)
     bill.splitBill(myBill);
     //console.log(4)
     bill.convert(myBill);
     ///console.log(5)
     bill.round(myBill);
     //console.log(6)
     res.locals.bill = myBill;
     //console.log('BUILD')
     //console.log(myBill);
     next();
   } catch (err) {
     //console.dir(err);
     error = err;
     error.status = 500;
     console.log("this fires")
     next(error);
   }

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
