const { journalChain } = require("../utilities/config");

exports.addJournal = (req, res) => {
    const journaldata = req.body;
    const index = journalChain.addToPendingList(journaldata); 

    res.status(200).json({
        success: true,
        data: index,
      });
  };
  
exports.sendJournal = (req, res) => {
const journalData = journalChain.addJournalData(req.body.patient, req.body.patientDateOfBirth, req.body.diagnosis, req.body.medicine, req.body.message, req.body.sender, req.body.recipient);
journalChain.addToPendingList(journalData);

journalChain.networkNodes.forEach(async(url) => {
    axios.post(`${url}/api/journal`, journalData)
});
    
res.status(200).json({
    success: true,
    data: 'Journaldatan är skapad och uppdaterad',
});
};

exports.findJournal = (req, res) => {
    const result = journalChain.findJournal(req.params.id);
        if (!result) {
            res.status(404).json({ status: 404, success: false, message: 'Kunde inte hitta Journal' });
        } else {
            res.status(200).json({ success: true, data: result });
        }
};

  
