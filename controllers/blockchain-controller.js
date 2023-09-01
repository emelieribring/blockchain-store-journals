const { journalChain } = require('../utilities/config');
const axios = require('axios');

exports.getBlockchain = (req, res) => {
  res.status(200).json({ success: true, data: journalChain });
};

exports.mineBlock = async (req, res) => {
  const previousBlock = journalChain.getLastBlock();
  const previousHash = previousBlock.hash;
  const data = {
    data: journalChain.pendingList,
    index: previousBlock.index + 1,
  };
  const nonce = journalChain.proofOfWork(previousHash, data)
  const hash = journalChain.createHash(previousHash, data, nonce)
  const block = journalChain.createBlock(nonce, previousHash, hash)
    
  for (let i = 0; i < journalChain.networkNodes.length; i++) {
    const url = journalChain.networkNodes[i];
    await axios.post(`${url}/api/v1/block`, { block: block });
  }

  res.status(200).json({
    success: true,
    data: block,
  });
};
