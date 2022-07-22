require("dotenv").config();

const mongoose = require('mongoose');


let dbURI = process.env.dbURI;
let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(dbURI, options)
    .then(() => {
        console.info(`Connected to ${dbURI}`);
    })
    .catch(err => {
        console.error(`Mongoose Connection error : ${err}`);
    })

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(`Error connecting to Database : ${error}`);
});

db.once('open', () => {
    console.info('Connected to Database');
});        