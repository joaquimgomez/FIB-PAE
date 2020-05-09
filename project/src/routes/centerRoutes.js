module.exports = app => {
    const center = require("../controllers/centerController");

    app.post("/center", center.create);
    app.get("/center", center.findAll);
    app.get("/center/:centerId", center.findOne);
    app.put("/center/:centerId", center.update);
    app.delete("/center/:centerId", center.delete);
    app.delete("/center", center.deleteAll);
};