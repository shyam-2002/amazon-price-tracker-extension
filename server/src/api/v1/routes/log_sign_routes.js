const express = require("express");
let { login_post, signup_post } = require("../controllers/log_signup_controller");

let router = express.Router();

//router for handeling login , signup post requests

router.post("/login", login_post);
router.post("/signup", signup_post);

module.exports =  router ;