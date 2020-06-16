module.exports = app => {
    const realizedPoll = require("../controllers/realizedPollController");

    app.post("/realizedPoll", realizedPoll.post);
    app.get('/realizedPoll', realizedPoll.findAll);
    //app.get("/realizedPoll/:realizedPollId", realizedPoll.findOne);
    //app.put("/realizedPoll/:realizedPollId", realizedPoll.update);
    //app.delete("/realizedPoll/:realizedPollId", realizedPoll.delete);
    //app.delete("/realizedPoll", realizedPoll.deleteAll);
};