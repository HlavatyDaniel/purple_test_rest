const mongoose = require("../services/mongoose.service").mongoose;
const Schema = mongoose.Schema;

const currencySchema = new Schema ({
    amount: Number,
    currencyFrom: String,
    currencyTo: String
});

const CurrencyConversion = mongoose.model("CurrencyConversions", currencySchema);

exports.createCurrencyConversion = (currencyData) => {
    const currencyConversion = new CurrencyConversion(currencyData);
    return currencyConversion.save();
};

exports.list = () => {
    return new Promise((resolve, reject) => {
        CurrencyConversion.find()
            .exec(function (err, currencyConversions) {
                if (err) {
                    reject(err);
                } else {
                    resolve(currencyConversions);
                }
            })
    });
};

exports.conversionCount = () => {
    return CurrencyConversion.countDocuments();
};

//this should work but im too cheap to upgrade cluster to paid one.
// exports.conversionAmount = () => {
//     return CurrencyConversion.aggregate([{ $sum: "amount"}]);
// }