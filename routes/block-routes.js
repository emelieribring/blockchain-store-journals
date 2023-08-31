const express = require('express');
const router = express.Router();
const { addBlock } = require('../controllers/block-controller');

router.route('/').post(addBlock);

module.exports = router;
