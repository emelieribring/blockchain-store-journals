const Blockchain = require('../models/blockchain');
const { v4: uuidv4 } = require('uuid');

const journalChain = new Blockchain();
const nodeAddress = uuidv4().split('-').join('');

module.exports = { journalChain, nodeAddress };


/* 
JOURNALDATA ATT ANVÄNDA I POSTMAN:
{
    "patient": "Emelie",
    "patientDateOfBirth": "980505",
    "diagnosis": "Halsfluss",
    "medicine": "Pencilin",
    "message": "Tas varje dag i två veckor",
    "sender": "Dr Selma",
    "recipient": "Journaldatabasen"
} */
