const { journalChain } = require('../utilities/config');
const axios = require('axios');

exports.synchronize = async (req, res) => {
    const chainLength = journalChain.chain.length;
    let maxLength = chainLength;
    let longestChain = null;
    let pendingList = null;

    const promises = journalChain.networkNodes.map(async (node) => {
        try {
            const response = await axios(`${node}/api/v1/blockchain`);
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
  };

