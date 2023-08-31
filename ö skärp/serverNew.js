


/* {
    "patient": "Nils",
    "patientDateOfBirth": "980505",
    "diagnosis": "Förskyld",
    "medicine": "alvedon",
    "message": "hejhej",
    "sender": "Mila",
    "recipient": "södersjukhuset"
} */



const express = require('express');
//const fetch = require('node-fetch');
//const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json()); 

const Blockchain = require('./blockchaintest');
const journalChain = new Blockchain();

const PORT = process.argv[2];
const nodeAddress = uuidv4().split('-').join('');

journalChain.createBlock(1, 'previousHash', 'currentHash');
journalChain.createBlock(2, 'previousHash', 'currentHash');
journalChain.addJournalData('Matilda', '980505', 'Astma', 'Astma-medicin', 'Blablabla', 'Emelie', 'Danderyd Hospital');
journalChain.addJournalData('Isabell', '980505', 'Astma', 'Astma-medicin','litet meddelande', 'Ida', 'Södersjukhuset');
journalChain.createBlock(3, 'previousHash', 'currentHash');
journalChain.createBlock(4, 'previousHash', 'currentHash');

app.get('/api/getBlockchain', (req, res) => {
  res.json(journalChain.chain); 
});

app.post('/api/addJournalData', (req, res) => {
  const { patient, patientDateOfBirth, diagnosis, medicine, message, sender, recipient } = req.body;
  const newIndex = journalChain.addJournalData(patient, patientDateOfBirth, diagnosis, medicine, message, sender, recipient); 
  res.json({ message: `Journaldata kommer att läggas till i block ${newIndex}` });
});

app.get('/api/mine', (req, res) => {
  const previousBlock = journalChain.getLastBlock();
  const previousHash = previousBlock.hash;
  const data = {
    data: journalChain.pendingList,
    index: previousBlock.index + 1,
  };
  const nonce = journalChain.proofOfWork(previousHash, data);
  const hash = journalChain.createHash(previousHash, data, nonce);

  journalChain.addJournalData('Matilda', '980505', 'Astma', 'Astma-medicin', 'Blablabla', 'Emelie', 'Danderyd Hospital');

  const block = journalChain.createBlock(nonce, previousHash, hash);

  res.status(200).json({
    success: true,
    data: block,
  });

});

app.get('/validateBlockchain', (req, res) => {
  const isValid = journalChain.validateChain(journalChain); 
  res.json({ isValid: isValid });
});

app.listen(3000, () => console.log('Server kör på port 3000'));



/*  
console.log(journalChain);
console.log(journalChain.chain.at(2)); */