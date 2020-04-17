module.exports = app => {
    const organizacion = require("../controllers/organizacion.controller");

    app.post("/organizacion", organizacion.create);
    app.get("/organizacion", organizacion.findAll);
    app.get("/organizacion/:organizacionId", organizacion.findOne);
    app.put("/organizacion/:organizacionId", organizacion.update);
    app.delete("/organizacion/:organizacionId", organizacion.delete);
    app.delete("/organizacion", organizacion.deleteAll);
};