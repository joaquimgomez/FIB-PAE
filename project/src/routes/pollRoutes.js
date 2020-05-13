module.exports = app => {
    const poll = require("../controllers/pollController");

    //app.post("/poll", poll.create);
    app.get("/poll", poll.findAll);
    app.get("/poll/:pollId", poll.findOne);
    //app.put("/poll/:pollId", poll.update);
    //app.delete("/poll/:pollId", poll.delete);
    //app.delete("/poll", poll.deleteAll);
};