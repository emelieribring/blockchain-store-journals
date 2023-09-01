const { journalChain } = require('../utilities/config');

exports.addBlock = (req, res) => {
  const block = req.body.block;
    const lastBlock = journalChain.getLastBlock();
    const hashIsCorrect = lastBlock.hash === block.previousHash;
    const hasCorrectIndex = lastBlock.index + 1 === block.index;

    if(hashIsCorrect && hasCorrectIndex) {
        console.log('godkänt block');
        journalChain.chain.push(block);
        journalChain.pendingList = [];
        res.status(201).json({ 
            success: true, 
            data: 'blocket är godkänt', block, 
        });
    } else {
        res.status(400).json({ 
            success: false, 
            errorMessage: 'Blocket är inte godkänt'
        });
    }  
};

exports.findBlock = (req, res) => {
    const block = journalChain.findBlock(req.params.hash);
    if (!block) {
      res.status(404).json({ status: 404, success: false, message: 'Kunde inte hitta blocket' });
    } else {
      res.status(200).json({ success: true, data: block });
    }
  };
  