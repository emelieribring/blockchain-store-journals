const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');

const Blockchain = require('./models/blockchain');
const journalChain = new Blockchain();

const app = express();
app.use(express.json()); 

const PORT = process.argv[2];

//HÄMTA BLOCKCHAIN
app.get('/api/getBlockchain', (req, res) => {
    res.status(200).json({ success: true, data: journalChain });
}); 

//SKAPA JOURNALDATA
app.post('/api/journal/send', (req, res) => {
    const journalData = journalChain.addJournalData(req.body.patient, req.body.patientDateOfBirth, req.body.diagnosis, req.body.medicine, req.body.message, req.body.sender, req.body.recipient);
    journalChain.addToPendingList(journalData);

    journalChain.networkNodes.forEach(async(url) => {
        axios.post(`${url}/api/journal`, journalData)
    });
      
    res.status(200).json({
        success: true,
        data: 'Journaldatan är skapad och uppdaterad',
    });
});

//SKICKA JOURNALDATA TILL ALLA NODERS PENDINGLIST
app.post('/api/journal', (req, res) => {
    const journaldata = req.body;
    const index = journalChain.addToPendingList(journaldata); 

    res.status(200).json({
        success: true,
        data: index,
      });
}); 


//SKAPA BLOCKET, HÄMTA JORNALDATAN FRÅN PENDNINGLIST & SKICKA TILL ALLA NODER MED VALIDERING
app.get('/api/mine', async (req, res) => {
  const previousBlock = journalChain.getLastBlock();
  const previousHash = previousBlock.hash;
  const data = {
    data: journalChain.pendingList,
    index: previousBlock.index + 1,
  };
  const nonce = journalChain.proofOfWork(previousHash, data);
  const hash = journalChain.createHash(previousHash, data, nonce);
  const block = journalChain.createBlock(nonce, previousHash, hash);

  //SKICKA BLOCKET TILL ALLA NODER, VALIDERAS INNAN.
  journalChain.networkNodes.forEach(async(url) => {
    await axios.post(`${url}/api/block`, {block: block})
  });

  res.status(200).json({
    success: true,
    data: block,
  });
});

//VALIDERA OCH SKICKA IN I BLOCKCHAIN
app.post('/api/block', (req, res) => {
    const block = req.body.block;
    const lastBlock = journalChain.getLastBlock();
    const hashIsCorrect = lastBlock.hash === block.previousHash;
    const hasCorrectIndex = lastBlock.index + 1 === block.index;

    if(hashIsCorrect && hasCorrectIndex) {
        journalChain.chain.push(block);
        journalChain.pendingList = [];

        res.status(201).json({ 
            success: true, 
            errorMessage: 'Blocket är inte godkänt', 
            data: block 
        });
    } else {
        res.status(400).json({ 
            success: false, 
            data: 'Block är inte godkänt' 
        });
    }
});


//NODER (SKAPA & KOPPLA SAMMA NODERNA EXTERNT & INTERNT)

//Extern registrering av en node
app.post('/api/register-send-node', async (req, res) => {
    const urlAdd = req.body.nodeUrl;

    if(journalChain.networkNodes.indexOf(urlAdd) === -1) {
        journalChain.networkNodes.push(urlAdd);
    };

    const networkNodes = journalChain.networkNodes;
        for (let i = 0; i < networkNodes.length; i++) {
        const url = networkNodes[i];
        const body = { nodeUrl: urlAdd };

        try {
            await fetch(`${url}/api/register-node`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error(`Error registering node at ${url}: ${error.message}`);
        }
    }


    const body = {nodes: [...journalChain.networkNodes, journalChain.nodeUrl] };

    //Extern registrering av noder
    await fetch(`${urlAdd}/api/register-nodes`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });

    res.status(201).json({
        success: true, 
        data: 'Ny node tillagd i nätverket'
    });
});


//Addera ny node till blockkedjan
app.post('/api/register-node', (req, res) => {
    const url = req.body.nodeUrl;

    if(journalChain.networkNodes.indexOf(url) === -1 && journalChain.nodeUrl !== url){
        journalChain.networkNodes.push(url);
    }

    res.status(201).json({
        success: true, 
        data: 'Ny node tillagd'
    });
});

//Adderar en lista med noder
app.post('/api/register-nodes', (req, res) => {
    const allNodes = req.body.nodes;

    allNodes.forEach((url) => {
        if (journalChain.networkNodes.indexOf(url) === -1 && journalChain.nodeUrl !== url) {
            journalChain.networkNodes.push(url);
        }
    });

    res.status(201).json({
        success: true, 
        data: 'Nya noder tillagda'
    })
});


//CONSENSUS

app.get('/api/consensus', async (req, res) => {
    const chainLength = journalChain.chain.length;
    let maxLength = chainLength;
    let longestChain = null;
    let pendingList = null;

    const promises = journalChain.networkNodes.map(async (node) => {
        try {
            const response = await axios(`${node}/api/getBlockchain`);
            const data = response.data.data;

            if (data.chain.length > maxLength) {
                maxLength = data.chain.length;
                longestChain = data.chain;
                pendingList = data.pendingList;
            }
        } catch (error) {
            console.error(`Error fetching data from ${node}: ${error.message}`);
        }
    });

    await Promise.all(promises);

    if (!longestChain || (longestChain && !journalChain.validateChain(longestChain))) {
        console.log('No replacement needed');
        res.status(200).json({ success: true, data: journalChain });
    } else {
        journalChain.chain = longestChain;
        journalChain.pendingList = pendingList;

        res.status(200).json({ 
            success: true, 
            data: journalChain 
        });
    }
});

app.listen(PORT, () => console.log(`Server kör på port ${PORT}`));


/* {
    "patient": "Nils",
    "patientDateOfBirth": "980505",
    "diagnosis": "Förskyld",
    "medicine": "alvedon",
    "message": "hejhej",
    "sender": "Mila",
    "recipient": "södersjukhuset"
} */