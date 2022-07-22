let express = require('express');
let router = express.Router();


router.use('/user', require('./log_sign_routes'));
router.use('/', require('./other_routes'));

module.exports = router;