const SHA256 = require('crypto-js/sha256');
const validator = require('validator');

function Blockchain() {
    this.chain = [];
    this.pendingList = [];
    this.difficulty = 4; 
    this.createBlock(1, 'Genisis', 'Genisis');
}


Blockchain.prototype.createBlock = function () {
    const previousBlock = this.getLastBlock();
    const data = this.pendingList;
    let nonce = 0;

    while (true) {
        const hash = this.calculateHash(previousBlock, nonce);
        if (hash.substring(0, this.difficulty) === Array(this.difficulty + 1).join('0')) {
            const newBlock = this.generateNewBlock(previousBlock, data, nonce, hash);

            this.pendingList = [];
            this.chain.push(newBlock);

            return newBlock;
        }
        nonce++;
    }
};

Blockchain.prototype.generateNewBlock = function (previousBlock, data, nonce, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Math.floor(Date.now() / 1000),
        data: data,
        nonce: nonce,
        previousHash: previousBlock.hash,
        hash: hash,
    };

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


Blockchain.prototype.calculateHash = function (block, nonce) {
    return this.createHash(block.previousHash, block.data, nonce);
};



Blockchain.prototype.validateChain = function (blockChain) {
    let isValid = true;
  
    for (i = 1; i < blockChain.length; i++) {
      const block = blockChain[i];
      const previousBlock = blockChain[i - 1];
      const hash = this.createHash(previousBlock.hash, { data: block.data, index: block.index }, block.nonce);
  
      if (hash !== block.hash) {
        isValid = false;
      }
  
      if (block.previousHash !== previousBlock.hash) {
        isValid = false;
      }
    }
  
    // Validera genisis blocket...
    const genesisBlock = blockChain.at(0);
    const isGenesisNonceValid = genesisBlock.nonce === 1;
    const isGenesisHashValid = genesisBlock.hash === 'Genisis';
    const isGenesisPreviousHashValid = genesisBlock.previousHash === 'Genisis';
    const hasNoData = genesisBlock.data.length === 0;
  
    if (!isGenesisNonceValid || !isGenesisHashValid || !isGenesisPreviousHashValid || !hasNoData) {
      isValid = false;
    }
  
    return isValid;
  };


Blockchain.prototype.findBlock = function (blockHash) {
    return this.chain.find((block) => block.hash === blockHash);
};

Blockchain.prototype.findJournal = function (journalId) {
const block = this.chain.find((block) => block.data.find((journal) => journal.journalId === journalId));

if (!block) {
    return null;
} else {
    const journal = block.data.find((journal) => journal.journalId === journalId);
    return { journal, block };
}
};


module.exports = Blockchain;