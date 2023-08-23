const SHA256 = require('crypto-js/sha256');

function Blockchain(){
    this.chain = [];
    this.pendeingList = [];
    this.createGenesisBlock();
}

Blockchain.prototype.createGenesisBlock = function () {
    const genesisBlock = {
        index: 0,
        timestamp: Date.now(),
        data: [],
        nonce: 0,
        previousHash: '0',
    }

    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.chain.push(genesisBlock);
};

Blockchain.prototype.createBlock = function (nonce) {
    const previousBlock = this.getLastBlock();
    const block = {
        index: this.chain.length,
        timestamp: Date.now(),
        data: this.pendingList,
        nonce: nonce,
        previousHash: previousBlock.hash, 
    };

    block.hash = this.calculateHash(block);

    this.pendingList = [];
    this.chain.push(block);

    return block;
};

Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
};

Blockchain.prototype.addJournalData = function(patient, message, sender, recipient) {
 const journalData = {
    patient,
    message,
    sender,
    recipient
 }

 this.pendeingList.push(journalData);

 return this.getLastBlock()['index'] + 1;
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


module.exports = Blockchain;