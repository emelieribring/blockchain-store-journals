exports.addBlock = (req, res) => {
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
};