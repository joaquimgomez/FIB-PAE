module.exports = app => {
    const checkBox = require("../controllers/checkBoxController");

    app.post("/checkBox", checkBox.create);
    app.get("/checkBox", checkBox.findAll);
    app.get("/checkBox/:checkBoxId", checkBox.findOne);
    app.put("/checkBox/:checkBoxId", checkBox.update);
    app.delete("/checkBox/:checkBoxId", checkBox.delete);
    app.delete("/checkBox", checkBox.deleteAll);
};