const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let productSchema = new Schema({
    name : String,
    url : String,
    seller : String,
    users : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    prices : [{
        price : Number,
        date : Date
    }]
});


let Product = mongoose.model('product', productSchema);


module.exports = Product