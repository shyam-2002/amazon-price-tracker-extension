require("dotenv").config();

let { User } = require("../../../models/");
let { handle_err } = require("../../../error_handeling");



let secret_key = process.env.jwtSecret;

let jwt = require("jsonwebtoken");


//controller for logging the user in

let login_post = async (req, res, next) => {
    try {
        let user = await User.login(req.body.email, req.body.password);
        let userId = user._id;
        let encoded_user_id = jwt.sign({userId}, secret_key);
        res.status(200).json({
            success : true,
            message : "successfully logged in",
            error : null,
            data : {id : encoded_user_id, username : user.username}
        })
    }
    catch (err) {
        let errors = handle_err(err);
        res.status(400).json({
            success : false,
            message : "error logging in the user",
            error : err.message,
            data : errors
        })
    }
}


//controller for signing the user up

let signup_post = async (req, res, next) => {
    let user = new User(req.body);
    try {
        let us = await user.save();
        let userId = us._id;
        let encoded_user_id = jwt.sign({userId}, secret_key);
        res.status(200).json({
            success : true,
            message : "successfully signed up",
            error : null,
            data : {id : encoded_user_id, username : us.username}
        })
    }
    catch (err) {
        let errors = handle_err(err);
        res.status(400).json({
            success : false,
            message : "error signing up the user",
            error : err.message,
            data : errors
        })
    }
}


module.exports = { login_post, signup_post };
