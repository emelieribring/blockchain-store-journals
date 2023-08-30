const sha256 = require('sha256');
const validator = require('validator');


function Blockchain() {
  this.chain = [];
  this.pendingList = [];
  this.nodeUrl = process.argv[3];
  this.networkNodes = [];

  this.createBlock(1, 'Genisis', 'Genisis');
}

Blockchain.prototype.createBlock = function (nonce, previousHash, hash) {
    const block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      data: this.pendingList,
      nonce: nonce,
      hash: hash,
      previousHash: previousHash,
    };
  
    this.pendingList = [];
    this.chain.push(block);
  
    return block;
  };

// Hämta senaste blocket...
Blockchain.prototype.getLastBlock = function () {
  return this.chain.at(-1);
};

Blockchain.prototype.createHash = function (prevHash, data, nonce) {
    const stringToHash = prevHash + JSON.stringify(data) + nonce.toString();
    const hash = sha256(stringToHash);
    return hash;
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

/* Blockchain.prototype.validateChain = function (blockChain) {
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
    const genesisBlock = blockChain[0];
    const isGenesisNonceValid = genesisBlock.nonce === 1;
    const isGenesisHashValid = genesisBlock.hash === 'Genesis';
    const isGenesisPreviousHashValid = genesisBlock.previousHash === 'Genesis';
    const hasNoData = genesisBlock.data.length === 0;
  
    if (!isGenesisNonceValid || !isGenesisHashValid || !isGenesisPreviousHashValid || !hasNoData) {
      isValid = false;
    } 
  
    return isValid;
}; */

module.exports = Blockchain;