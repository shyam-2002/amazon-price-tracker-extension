require("dotenv").config();

let jwt = require("jsonwebtoken");

let secret_key = process.env.jwtSecret;

// decoder middleware to decode the user id encoded with jwt.

let decode_user_id = (req, res, next)=>{
    let encoded_user_id = req.body.userId;
    let is_valid = jwt.verify(encoded_user_id, secret_key, async(err, decodedToken)=>{
        if(err){
            console.log(err);
            next();
        }
        else{
            req.body.userId = decodedToken.userId;
            next();
        }
    })
}

module.exports = {decode_user_id};