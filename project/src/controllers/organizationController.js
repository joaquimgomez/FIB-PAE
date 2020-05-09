const organization = require("../models/organizationModel");

exports.create = (req, res) =>{
    if (!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const organization = new organization({
        name: req.body.name,
        adress: req.body.adress,
        phone: req.body.phone,
        web: req.body.web
    });

    organization.create(organization, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Error ocurred while creating organization."
            });
        else res.send(data);
    });
};

exports.findAll = (req, res) =>{
    organization.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Error ocurred while retrieving organizationes."
            });
        else res.send(data);
    })
};

exports.findOne = (req, res) => {
  organization.findById(req.params.organizationId, (err, data) => {
      if (err) {
          if (err.kind === "not_found") {
              res.status(404).send({
                  message: 'Organization with id ${req.params.organizationId} not found'
              });
          } else {
              res.status(500).send({
                  message: err.message || 'Error retrieving organization with id ${req.params.organizationId}'
              });
          }
      } else res.send(data);
  });
};

exports.update = (req, res) => {
    if (!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    organization.updateById(req.params.organizationId, new organization(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Not found organization with id " + req.params.organizationId
                });
            }
            else {
                res.status(500).send({
                    message: "Error updating organization with id " + req.params.organizationId
                });
            }
        } else res.send(data);
    });
};

exports.delete = (req, res) => {
  organization.remove(req.params.organizationId, (err, data) => {
      if (err) {
          if (err.kind === 'not_found'){
              res.status(404).send({
                  message: "Not found organization with id " + req.params.organizationId
              });
          } else {
              res.status(500).send({
                  message: "Error deleting organization with id " + req.params.organizationId
              });
          }
      } else res.send(data);
  });
};

exports.deleteAll = (req, res) => {
    organization.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error ocurred while removing all organization"
            });
        else res.send({ message: 'All organizationes were deleted succesfully!'});
    });
};