const { journalChain } = require('../utilities/config');

exports.getBlockchain = (req, res) => {
  res.status(200).json({ success: true, data: journalChain });
};

exports.mineBlock = (req, res) => {
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
};
