const checkBox = require("../models/checkBoxModel");

exports.remove = function(req, res, next) {
    try{
        checkBox.remove(req.params.pollId, req.params.questionId, req.params.checkBoxId, (err, questionData) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: 'CheckBox with id: ' + req.params.checkBoxId + ' and pollId: ' + req.params.pollId + ' and questionId: ' + req.params.questionId + ' not found'
                    });
                    return next('CheckBox with id: ' + req.params.checkBoxId + ' and pollId: ' + req.params.pollId + ' and questionId: ' + req.params.questionId + ' not found');
                } else  {
                    res.status(500).send({
                        message: err.message || "No s'ha pogut esborrar la checkbox amb id: " + req.params.checkBoxId + " i questionId: " + req.params.questionId + ' i pollId: ' + req.params.pollId
                    });
                    return next(err.message || "No s'ha pogut esborrar la checkbox amb id: " + req.params.checkBoxId + " i questionId: " + req.params.questionId + ' i pollId: ' + req.params.pollId);
                }
            } 
            else {
                res.status(201).send("question eliminada con exito");
                return next("question eliminada con exito");
            }
        });
    } catch(err) {
        console.log(err);
        next(err);
        res.status(503).send(err);
        return false;
    }
}