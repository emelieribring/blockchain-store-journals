const express = require('express');
const router = express.Router();
const { addJournal, sendJournal } = require('../controllers/journal-controller');

router.route('/').post(addJournal);
router.route('/broadcast').post(sendJournal);

module.exports = router;