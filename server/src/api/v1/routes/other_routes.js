const express = require("express");
let {get_data, add_data, verify_product, remove_item} = require("../controllers/other_controllers");

let {decode_user_id} = require("../middlewares/decodeer");

let router = express.Router();



router.post("/getdata", decode_user_id ,get_data);
router.post("/addproduct",decode_user_id, add_data);
router.post("/verifyProduct",decode_user_id, verify_product);
router.post("/remove_item", decode_user_id, remove_item);

module.exports = router;