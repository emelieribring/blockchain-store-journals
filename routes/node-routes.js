const express = require('express');
const router = express.Router();
const { addNode, addNodes, sendNodes } = require('../controllers/node-controller');

router.route('/').post(sendNodes);
router.route('/register-node').post(addNode);
router.route('/register-nodes').post(addNodes);

module.exports = router;
