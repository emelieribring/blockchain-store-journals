const { journalChain } = require('../utilities/config');

exports.sendNodes = async (req, res) => {
    const urlAdd = req.body.nodeUrl;

    if(journalChain.networkNodes.indexOf(urlAdd) === -1) {
        journalChain.networkNodes.push(urlAdd);
    };

    const networkNodes = journalChain.networkNodes;
        for (let i = 0; i < networkNodes.length; i++) {
        const url = networkNodes[i];
        const body = { nodeUrl: urlAdd };

        try {
            await fetch(`${url}/api/v1/node/register-node`, {
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
    await fetch(`${urlAdd}/api/v1/node/register-nodes`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });

    res.status(201).json({
        success: true, 
        data: 'Ny node tillagd i nätverket'
    });
};

exports.addNode = (req, res) => {
    const url = req.body.nodeUrl;

    if(journalChain.networkNodes.indexOf(url) === -1 && journalChain.nodeUrl !== url){
        journalChain.networkNodes.push(url);
    }

    res.status(201).json({
        success: true, 
        data: 'Ny node tillagd'
    });
};

exports.addNodes = (req, res) => {
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
};
