//const axios = require('axios');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const Blockchain = require('./blockchaintest');
const app = express();
app.use(express.json()); 

const journalChain = new Blockchain();

const PORT = process.argv[2];
const nodeAddress = uuidv4().split('-').join('');

/* journalChain.createBlock(1, 'previousHash', 'currentHash');
journalChain.createBlock(2, 'previousHash', 'currentHash');
journalChain.addJournalData('Matilda', '980505', 'Astma', 'Astma-medicin', 'Blablabla', 'Emelie', 'Danderyd Hospital');
journalChain.addJournalData('Isabell', '980505', 'Astma', 'Astma-medicin','litet meddelande', 'Ida', 'Södersjukhuset');
journalChain.createBlock(3, 'previousHash', 'currentHash');
journalChain.createBlock(4, 'previousHash', 'currentHash'); */

app.get('/api/getBlockchain', (req, res) => {
  res.status(200).json(journalChain); 
});

app.post('/api/journal', (req, res) => {
    const index = journalChain.addJournalData(req.body.patient, req.body.patientDateOfBirth, req.body.diagnosis, req.body.medicine, req.body.message, req.body.sender, req.body.recipient);
    res.status(201).json({success: true, data: `Block index: ${index}`});
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
  //journalChain.addJournalData(6.25, '00', nodeAddress);
  const block = journalChain.createBlock(nonce, previousHash, hash);

  res.status(200).json({
    success: true,
    data: block,
  });
});


//Extern registrering av en node
app.post('/api/register-broadcast-node', async (req, res) => {
    const urlAdd = req.body.nodeUrl;

    if(journalChain.networkNodes.indexOf(urlAdd) === -1) {
        journalChain.networkNodes.push(urlAdd);
    };

    journalChain.networkNodes.forEach(async(url) => {
        const body = { nodeUrl: urlAdd };

        await fetch (`${url}/api/register-node`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        }); 
    });

    const body = {nodes: [...journalChain.networkNodes, journalChain.nodeUrl] };

    //Extern registrering av noder
    await fetch(`${urlAdd}/api/register-nodes`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });

    res.status(201).json({success: true, data: 'Ny node tillagd i nätverket'});
});


//Addera ny node till blockkedjan
app.post('/api/register-node', (req, res) => {
    const url = req.body.nodeUrl;

    if(journalChain.networkNodes.indexOf(url) === -1 && journalChain.nodeUrl !== url){
        journalChain.networkNodes.push(url);
    }

    res.status(201).json({success: true, data: 'Ny node tillagd'});
});

//Adderar en lista med noder
app.post('/api/register-nodes', (req, res) => {
    const allNodes = req.body.nodes;

    allNodes.forEach((url) => {
        if (journalChain.networkNodes.indexOf(url) === -1 && journalChain.nodeUrl !== url) {
            journalChain.networkNodes.push(url);
        }
    });

    res.status(201).json({success: true, data: 'Nya noder tillagda'})
});






/* app.get('/validateBlockchain', (req, res) => {
  const isValid = journalChain.validateChain(journalChain); 
  res.json({ isValid: isValid });
}); */

app.listen(PORT, () => console.log(`Server kör på port ${PORT}`));



/*  
console.log(journalChain);
console.log(journalChain.chain.at(2)); */