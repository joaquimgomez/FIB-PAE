module.exports = app => {
    const pollster = require("../controllers/pollsterController");

    app.post("/pollster", pollster.create);
    app.get("/pollster", pollster.findAll);
    app.get("/pollster/:pollsterId", pollster.findOne);
    app.put("/pollster/:pollsterId", pollster.update);
    app.delete("/pollster/:pollsterId", pollster.delete);
    app.delete("/pollster", pollster.deleteAll);
};