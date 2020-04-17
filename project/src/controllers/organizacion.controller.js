const Organizacion = require("../models/organizacion.model");

exports.create = (req, res) =>{
    if (!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const organizacion = new Organizacion({
        name: req.body.name,
        adress: req.body.adress,
        phone: req.body.phone,
        web: req.body.web
    });

    Organizacion.create(organizacion, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Error ocurred while creating Organizacion."
            });
        else res.send(data);
    });
};

exports.findAll = (req, res) =>{
    Organizacion.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Error ocurred while retrieving Organizaciones."
            });
        else res.send(data);
    })
};

exports.findOne = (req, res) => {
  Organizacion.findById(req.params.organizacionId, (err, data) => {
      if (err) {
          if (err.kind === "not_found") {
              res.status(404).send({
                  message: 'Organization with id ${req.params.organizacionId} not found'
              });
          } else {
              res.status(500).send({
                  message: err.message || 'Error retrieving Organizacion with id ${req.params.organizacionId}'
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

    Organizacion.updateById(req.params.organizacionId, new Organizacion(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Not found Organizacion with id " + req.params.organizacionId
                });
            }
            else {
                res.status(500).send({
                    message: "Error updating Organizacion with id " + req.params.organizacionId
                });
            }
        } else res.send(data);
    });
};

exports.delete = (req, res) => {
  Organizacion.remove(req.params.organizacionId, (err, data) => {
      if (err) {
          if (err.kind === 'not_found'){
              res.status(404).send({
                  message: "Not found Organizacion with id " + req.params.organizacionId
              });
          } else {
              res.status(500).send({
                  message: "Error deleting Organizacion with id " + req.params.organizacionId
              });
          }
      } else res.send(data);
  });
};

exports.deleteAll = (req, res) => {
    Organizacion.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error ocurred while removing all Organizacion"
            });
        else res.send({ message: 'All Organizaciones were deleted succesfully!'});
    });
};