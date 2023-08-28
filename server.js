const express = require('express');
const app = express();

app.use(express.json()); 

const Blockchain = require('./blockchain');

const journalChain = new Blockchain();

journalChain.createBlock(1, 'previousHash', 'currentHash');
journalChain.addJournalData('Matilda', 'Blablabla', 'Emelie', 'Danderyd Hospital');
journalChain.createBlock(2, 'previousHash', 'currentHash');
journalChain.createBlock(3, 'previousHash', 'currentHash');
journalChain.createBlock(4, 'previousHash', 'currentHash');
journalChain.addJournalData('Isabell', 'litet meddelande', 'Ida', 'Södersjukhuset');
journalChain.createBlock(5, 'previousHash', 'currentHash');

app.post('/addData', (req, res) => {
  const { patient, message, sender, recipient } = req.body;
  const newIndex = journalChain.addJournalData(patient, message, sender, recipient); 
  res.json({ message: `Journaldata kommer att läggas till i block ${newIndex}` });
});

app.get('/getBlockchain', (req, res) => {
  res.json(journalChain.chain); 
});

app.get('/validateBlockchain', (req, res) => {
  const isValid = journalChain.validateChain(); 
  res.json({ isValid: isValid });
});

app.listen(3000, () => console.log('Server kör på port 3000'));



/*  
console.log(journalChain);
console.log(journalChain.chain.at(2)); */