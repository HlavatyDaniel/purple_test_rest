const mongoose = require("mongoose");

const options = {
    autoIndex: true,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connectWithRetry = () => {
    //this will be exposed on github, dont think it matters though in this case
    mongoose.connect("mongodb+srv://Purple_Test_User:purpletestuser@cluster0.bbons.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", options).then(() =>{
    }).catch(ignore => {
        setTimeout(connectWithRetry, 5000);
    })
};

connectWithRetry();

exports.mongoose = mongoose;