const Blockchain = require('../models/blockchain');
const { v4: uuidv4 } = require('uuid');

const journalChain = new Blockchain();
const nodeAddress = uuidv4().split('-').join('');

module.exports = { journalChain, nodeAddress };
