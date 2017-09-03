const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const getExchangeRate = require('./tip_calculator/tip_calculator_methods.js').getExchangeRate;

app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use('/static', express.static('public'))
app.set('view engine', 'pug');

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mainRoutes = require('./routes');

app.use(mainRoutes);

app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});

// code below is to test exchange rate function in console
// let currency1 = process.argv.slice(2, 3)[0];
// let currency2 = process.argv.slice(3, 4);
//
// getExchangeRate(currency1, currency2);

module.exports.app = app;
