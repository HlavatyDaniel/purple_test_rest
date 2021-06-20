const express = require('express');
const router = express.Router();
const cors = require('cors');

const CurrencyConversionModel = require("../models/CurrencyConversion.model");
const dataFixer = require("../fixer/dataFixer")

router.get('/', cors(), function(req, res, ignore) {
    let currencyFrom = req.query?.from;
    let currencyTo = req.query?.to;
    let amount = req.query?.amount;

    if (currencyFrom === undefined || currencyTo === undefined || amount === undefined || Number.isNaN(Number(amount))) {
        res.status(400).send()
        return
    }

    let promisedCurrencies = dataFixer.getPromisedCurrencies()

    promisedCurrencies.then(response => {
        //This had to be here, cos i cant specify base currency, its paid version
        let resultAmount = 0

        const currencyFromRate = response.rates[currencyFrom]
        const currencyToRate = response.rates[currencyTo]

        let toBaseAmount = amount / currencyFromRate
        resultAmount = toBaseAmount * currencyToRate

        CurrencyConversionModel.createCurrencyConversion({
            amount: amount,
            currencyFrom: currencyFrom,
            currencyTo: currencyTo
        }).then((ignore) => {
            res.status(200).send({result: resultAmount})
        }).catch(ignore => {
            res.status(400).send()
        })

    }).catch(ignore => {
        res.status(400).send()
    })
});

module.exports = router;
