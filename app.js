const express = require('express');

const indexRouter = require('./routes/index');
const currenciesRouter = require('./routes/currencies');
const calculateRouter = require('./routes/calculate');
const statisticRouter = require('./routes/statistics');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/currencies', currenciesRouter);
app.use('/calculate', calculateRouter);
app.use('/statistics', statisticRouter);

module.exports = app;
