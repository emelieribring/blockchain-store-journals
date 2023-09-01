const express = require('express');
const router = express.Router();
const { addJournal, sendJournal, findJournal } = require('../controllers/journal-controller');

router.route('/:id').get(findJournal);
router.route('/').post(addJournal);
router.route('/send').post(sendJournal);

module.exports = router;