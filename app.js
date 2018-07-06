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

});

app.use('/result', (req, res, next) => {
  let myBill = res.locals.bill;
  let currencyInfo = res.locals.currencyInfo;
  try {
      bill.build(myBill, currencyInfo);
      res.locals.bill = myBill;
      next();
   } catch (err) {
     //console.dir(err);
     error = err;
     error.status = 500;
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
