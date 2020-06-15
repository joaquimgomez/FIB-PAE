module.exports = app => {
    const realizedPoll = require("../controllers/realizedPollController");

    app.post("/realizedPoll", realizedPoll.post);
    app.get("/realizedPoll/:org?/:pollId?/:dateIni?/:dateFin?", realizedPoll.findAll);
    /*
    app.get('/realizedPoll', realizedPoll.findAll) {
        var org = req.query.org; //either a value or undefined
        var pollId = req.query.pollId;
        var dateIni = req.query.dateIni;
        var dateFin = req.query.dateFin;
    }
    */
    //app.get("/realizedPoll/:realizedPollId", realizedPoll.findOne);
    //app.put("/realizedPoll/:realizedPollId", realizedPoll.update);
    //app.delete("/realizedPoll/:realizedPollId", realizedPoll.delete);
    //app.delete("/realizedPoll", realizedPoll.deleteAll);
};