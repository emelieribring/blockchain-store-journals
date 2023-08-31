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
    const data = this.pendingList;
    const nonce = this.proofOfWork(previousBlock.hash, data);
    
    const newBlock = {
        index: this.chain.length,
        timestamp: Math.floor(Date.now() / 1000),
        data: data,
        nonce: nonce,
        previousHash: previousBlock.hash,
    };

    newBlock.hash = this.calculateHash(newBlock);
    
    this.pendingList = [];
    this.chain.push(newBlock);

    return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
};

Blockchain.prototype.proofOfWork = function (prevHash, data) {
    let nonce = 0;
    let hash = this.createHash(prevHash, data, nonce);

    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.createHash(prevHash, data, nonce);
    }

    return nonce;
};

Blockchain.prototype.validateChain = function () {
    let isValid = true;    
    for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];

        const calculatedHash = this.calculateHash(previousBlock, currentBlock.data, currentBlock.nonce);
        
        if (calculatedHash !== currentBlock.hash) {
            return false;
        }

        if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
        }
    }

    const genesisBlock = this.chain[0];
    const isGenesisNonceValid = genesisBlock.nonce === 1;
    const isGenesisHashValid = genesisBlock.hash === genesisBlock.calculateHash();; // Justera denna sträng beroende på din implementation
    const isGenesisPreviousHashValid = genesisBlock.previousHash === '0'; // Justera denna sträng beroende på din implementation
    const hasNoData = genesisBlock.data.length === 0;

    if (!isGenesisNonceValid || !isGenesisHashValid || !isGenesisPreviousHashValid || !hasNoData) {
        isValid = false;
    }

    return isValid;
};


Blockchain.prototype.calculateHash = function (block) {
    return SHA256(
        block.index +
        block.previousHash +
        block.timestamp +
        JSON.stringify(block.data) +
        block.nonce
    ).toString();
};

Blockchain.prototype.createHash = function (prevHash, data, nonce) {
    return SHA256(
        prevHash +
        JSON.stringify(data) +
        nonce
    ).toString();
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

module.exports = Blockchain;
