const express = require('express');
const router = express.Router();
const cors = require('cors');
const dataFixer = require('../fixer/dataFixer')

router.get('/', cors(), function(req, res, ignore) {

    let promisedCurrencies = dataFixer.getPromisedCurrencies()

    promisedCurrencies.then(response => {
        res.status(200).send(response.rates)
    }).catch(ignore => {
        res.status(400).send()
    })

});

module.exports = router;
