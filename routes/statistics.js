const express = require('express');
const router = express.Router();
const cors = require('cors');
const dataFixer = require("../fixer/dataFixer")

const CurrencyConversionModel = require("../models/CurrencyConversion.model");

router.get('/', cors(), function(req, res, ignore) {

    let specifyStatistic = req.query?.specifyStatistic;

    if (specifyStatistic === 'amountConverted')
        getAmountConverted();
    else if (specifyStatistic === 'conversionCount')
        getConversionCount();
    else if (specifyStatistic === 'favoriteDestination')
        getFavoriteDestination();
    else
        res.status(400).send();

    //return total amount converted
    //would love to just add arg base=USD, but its paid
    function getAmountConverted()
    {
        let promisedCurrencies = dataFixer.getPromisedCurrencies()

        promisedCurrencies.then(response => {

            CurrencyConversionModel.list()
                .then((dbResponse) => {

                    let amountSum = 0

                    for (let item of dbResponse)
                    {
                        if (item.currencyFrom === 'USD')
                        {
                            amountSum += item.amount
                        }
                        else
                        {
                            let currencyFromRate = response.rates[item.currencyFrom]
                            let currencyToRate = response.rates['USD']

                            let toBaseAmount = item.amount / currencyFromRate
                            amountSum += toBaseAmount * currencyToRate
                        }
                    }

                    res.status(200).send({result: amountSum})
                }).catch(ignore => {
                    res.status(400).send()
            })

        }).catch(ignore => {
            res.status(400).send()
        })
    }

    //return total count of conversions
    function getConversionCount() {
        CurrencyConversionModel.conversionCount()
            .then((result) => {
                res.status(200).send({result: result});
            }).catch(ignore => {
                res.status(400).send()
        })
    }

    //return most popular destination currency.
    function getFavoriteDestination() {
        CurrencyConversionModel.list()
            .then((result) => {
                res.status(200).send({result: getHighestOccurrence(result)});
            }).catch(ignore => {
                res.status(400).send()
        })
    }

    function getHighestOccurrence(array)
    {
        let map = {};
        let maxEl = array[0].currencyTo, maxCount = 1;

        for(let i = 0; i < array.length; i++)
        {
                let el = array[i].currencyTo;
                if (map[el] == null)
                    map[el] = 1;
                else
                    map[el]++;

                if (map[el] > maxCount)
                {
                    maxEl = el;
                    maxCount = map[el];
                }
        }

        return maxEl;
    }
})

module.exports = router;
