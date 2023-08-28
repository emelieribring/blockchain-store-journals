const SHA256 = require('crypto-js/sha256');
const validator = require('validator');

function Blockchain() {
    this.chain = [];
    this.pendingList = [];
    this.createGenesisBlock();
    this.difficulty = 4; 
}

Blockchain.prototype.createGenesisBlock = function () {
    const genesisBlock = {
        index: 0,
        timestamp: Math.floor(Date.now() / 1000),
        data: [],
        nonce: 0,
        previousHash: '0',
    };

    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.chain.push(genesisBlock);
};

Blockchain.prototype.createBlock = function () {
    const previousBlock = this.getLastBlock();
    let nonce = 0;
    let newBlock = null;

    while (newBlock === null || newBlock.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
        nonce++;
        newBlock = {
            index: this.chain.length,
            timestamp: Math.floor(Date.now() / 1000),
            data: this.pendingList,
            nonce: nonce,
            previousHash: previousBlock.hash,
        };

        newBlock.hash = this.calculateHash(newBlock);
    }

    this.pendingList = [];
    this.chain.push(newBlock);

    return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
};


Blockchain.prototype.addJournalData = function(patient, patientDateOfBirth, diagnosis, medicine, message, sender, recipient) {
    if (validator.isEmpty(patient) ||
        validator.isEmpty(patientDateOfBirth) ||
        validator.isEmpty(diagnosis) ||
        validator.isEmpty(medicine) ||
        validator.isEmpty(message) ||
        validator.isEmpty(sender) ||
        validator.isEmpty(recipient)) {
        throw new Error('Ogiltiga eller tomma fält i journaldata.');
    }

    const sanitizedPatient = validator.escape(patient);
    const sanitizedPatientDateOfBirth = validator.escape(patientDateOfBirth);
    const sanitizedDiagnosis = validator.escape(diagnosis);
    const sanitizedMedicine = validator.escape(medicine);
    const sanitizedMessage = validator.escape(message);
    const sanitizedSender = validator.escape(sender);
    const sanitizedRecipient = validator.escape(recipient);

    const journalData = {
        patient: sanitizedPatient,
        patientDateOfBirth: sanitizedPatientDateOfBirth,
        diagnosis: sanitizedDiagnosis,
        medicine: sanitizedMedicine,
        message: sanitizedMessage,
        sender: sanitizedSender,
        recipient: sanitizedRecipient
    };

    this.pendingList.push(journalData);

    return this.getLastBlock()['index'] + 1;
};


Blockchain.prototype.calculateHash = function (block) {
    let calculatedHash = "";
    let prefix = "0".repeat(this.difficulty);

    while (calculatedHash.substring(0, this.difficulty) !== prefix) {
        block.nonce++;
        calculatedHash = SHA256(
            block.index +
            block.previousHash +
            block.timestamp +
            JSON.stringify(block.data) +
            block.nonce
        ).toString();
    }

    return calculatedHash;
};

Blockchain.prototype.validateChain = function () {
    for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];

        if (currentBlock.hash !== this.calculateHashWithoutPoW(currentBlock)) {
            return false;
        }

        if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
        }
    }

    return true;
};

Blockchain.prototype.calculateHashWithoutPoW = function (block) {
    return SHA256(
        block.index +
        block.previousHash +
        block.timestamp +
        JSON.stringify(block.data) +
        block.nonce
    ).toString();
};


module.exports = Blockchain;
