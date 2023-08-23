const Blockchain = require('./blockchain');

const journalChain = new Blockchain();

journalChain.createBlock(1, 'previousHash', 'currentHash');
journalChain.addJournalData('Matilda', 'Blablabla', 'Emelie', 'Danderyd Hospital');
journalChain.createBlock(2, 'previousHash', 'currentHash');
journalChain.createBlock(3, 'previousHash', 'currentHash');
journalChain.createBlock(3, 'previousHash', 'currentHash');





console.log(journalChain);
console.log(journalChain.chain.at(1));