module.exports = app => {
    const organization = require("../controllers/organizationController");

    app.post("/organization", organization.create);
    app.get("/organization", organization.findAll);
    app.get("/organization/:organizationId", organization.findOne);
    app.put("/organization/:organizationId", organization.update);
    app.delete("/organization/:organizationId", organization.delete);
    app.delete("/organization", organization.deleteAll);
};