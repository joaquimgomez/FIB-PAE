module.exports = app => {
    const question = require("../controllers/questionController");

    app.post("/question", question.create);
    app.get("/question", question.findAll);
    app.get("/question/:questionId", question.findOne);
    app.put("/question/:questionId", question.update);
    app.delete("/question/:questionId", question.delete);
    app.delete("/question", question.deleteAll);
};