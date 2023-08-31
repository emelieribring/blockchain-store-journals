const express = require('express');
const blockchain = require('./routes/blockchain-routes');
const block = require('./routes/block-routes');
const journal = require('./routes/journal-routes');
const node = require('./routes/node-routes');
const consensus = require('./routes/consensus-routes');

const app = express();

const PORT = process.argv[2];

app.use(express.json());


app.use('/api/v1/blockchain', blockchain);
app.use('/api/v1/block', block);
app.use('/api/v1/journal', journal);
app.use('/api/v1/node', node);
app.use('/api/v1/consensus', consensus);



app.listen(PORT, () => console.log(`Server kör på port ${PORT}`));