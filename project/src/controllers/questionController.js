const question = require("../models/questionModel");

exports.remove = function(req, res, next) {
    try{
        console.log("*******************LLEGO AQUI?************")
        question.remove(req.params.pollId, req.params.questionId, (err, questionData) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: 'Question with pollId: ' + req.params.pollId + ' and id: ' + req.params.questionId + 'not found'
                    });
                } else  {
                    res.status(500).send({
                        message: err.message || 'Error retrieving poll with id ${pollObj.org_id}'
                    });
                }
            } 
            else {
                res.status(201).send("question eliminada con exito");
            }
        });
    } catch(err) {
        console.log(err);
        next(err);
        res.status(503).send(err);
        return false;
    }

}