let { User, Product } = require("../../../models/");


// controller for getting the product data a user has added

let get_data = async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.body.userId }, { "tracking_list": 1 });
        let products = [];
        let len = user.tracking_list.length;
        for (let i = 0; i < len; i++) {
            let product = user.tracking_list[i];
            let obj = await Product.findOne({ _id: product.product_id }, { "name": 1, "url": 1, "prices": 1 });
            products.push({
                _id: obj._id,
                name: obj.name,
                url: obj.url,
                currentPrice: obj.prices[obj.prices.length-1].price,
                thresholdPrice: product.threshold_price
            })
        }
        res.status(200).json({
            success: true,
            message: "successfully fetched tracking list",
            error: null,
            data: products
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "could not fetch tracking list",
            error: err.message,
            data: null
        })
    }
};


// controller to add a new product

let add_data = async (req, res, next) => {
    try {
        let product = await Product.findOne({ url: req.body.url });
        if (product) {
            await User.updateOne({ _id: req.body.userId }, { "$push": { "tracking_list": { product_id: product._id, threshold_price: req.body.threshold_price } } });
            product.users.push(req.body.userId);
            await product.save();
        } else {
            let product = new Product({ name: req.body.name, url: req.body.url, seller: req.body.seller, users: [req.body.userId], prices: [{ price: req.body.current_price, date: new Date() }] });
            await product.save();
            await User.updateOne({ _id: req.body.userId }, { "$push": { "tracking_list": { product_id: product._id, threshold_price : req.body.threshold_price } } });
        }
        res.status(200).json({
            success: true,
            message: "successfully added product to tracking list",
            error: null,
            data: null
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "could not add product to tracking list",
            error: err.message,
            data: null
        })
    }
}

//controller for checking if a product is available in tracking list or not

let verify_product = async (req, res, next) => {
    try {
        let product = await Product.findOne({ "url": req.body.url, "users": req.body.userId });
        let data, msg;
        if (product != null) {
            data = { available: true };
            msg = "product is available in tracking list";
        }
        else {
            data = { available: false }
            msg = "product is not available in tracking list";
        }
        res.status(200).json({
            success: true,
            message: msg,
            error: null,
            data: data
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "could not check the availability of the product",
            error: err.message,
            data: null
        })
    }
}

// controller for removing a product from tracking list

let remove_item = async (req, res, next) => {
    try {
        await User.updateOne({ _id: req.body.userId }, { "$pull": { "tracking_list": { "product_id": req.body.product_id } } });
        await Product.updateOne({_id : req.body.product_id}, {"$pull" : {"users" : req.body.userId}});
        res.status(200).json({
            success: true,
            message: "successfully removed product from tracking list",
            error: null,
            data: null
        })
    }
    catch (err) {
        res.status(500).json({
            success: true,
            message: "could not remove product from tracking list",
            error: err.message,
            data: null
        })
    }
}

module.exports = { get_data, add_data, verify_product, remove_item };