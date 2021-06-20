const fetch = require('node-fetch')
const url = "http://data.fixer.io/api/latest?access_key=6d849d84c502b954336a649422dfa309"
const settings = {method: "Get"}

exports.getPromisedCurrencies = () => {
    return new Promise((resolve, reject) => {
            try {
                fetch(url, settings)
                    .then(res => res.json())
                    .then((json) => {
                        resolve(json)
                    }).catch(ignore => {
                    reject()
                })
            } catch (ignore) {
                reject()
            }
    })
}