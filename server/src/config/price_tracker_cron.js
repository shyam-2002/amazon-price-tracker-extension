const axios = require('axios');
const cheerio = require('cheerio');
const CronJob = require('cron').CronJob;
const { Product } = require('../models');



let find_price = (price_str)=>{
    if(price_str === undefined || price_str === "unavailable"){
        return null;
    }else{
        return price_str.substr(1);
    }

}


let find_price_str = (seller, markup) => {
    let price_str;
    if (seller === 'flipkart') {
        let price_str = markup('._30jeq3').html();
    } else if (seller === 'amazon') {

    }
    return price_str;
}



let priceTrackingJob = new CronJob('*/10 */1 * * * *', async function () {
    try {
        console.log("hi every minute");
        let products = await Product.find({}).populate({path : 'prices'});
        let productCount = products.length;
        for (let i = 0; i < productCount; i++) {
            let product = products[i];
            let url = product.url;
            let html = await axios.get(url);
            let markup = cheerio.load(html.data);
            let price_str = find_price_str(product.seller, markup);
            let price = find_price(price_str);
            let len = product.prices.length;
            if(price < product.prices[len-1]) {
                await Product.updateOne({_id : product._id}, {'$push' : {"prices" : {price : price, date : new Date()}}});
            }
        }
    }
    catch (err) {
        console.log(err.message);
    }
}, null, true, 'Asia/Kolkata');

module.exports = priceTrackingJob;
