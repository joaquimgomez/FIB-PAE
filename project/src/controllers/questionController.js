const question = require("../models/questionModel");
const checkBox = require("../models/checkBoxModel");
const poll = require("../models/pollModel");

exports.remove = function(req, res, next) {
    try{
        question.remove(req.params.pollId, req.params.questionId, (err, questionData) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: 'Question with pollId: ' + req.params.pollId + ' and id: ' + req.params.questionId + ' not found'
                    });
                    return next('Question with pollId: ' + req.params.pollId + ' and id: ' + req.params.questionId + ' not found');
                } else  {
                    res.status(500).send({
                        message: err.message || "No s'ha pogut esborrar la question amb id: " + req.params.questionId + ' i pollId: ' + req.params.pollId
                    });
                    return next(err.message || "No s'ha pogut esborrar la question amb id: " + req.params.questionId + ' i pollId: ' + req.params.pollId);
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

function getQuestionObj(req, pollId, questionId) {
    const questionObj = {
        id: questionId,
        enc_id: pollId,
        body: req.body.body,
        defined_answers: req.body.defined_answers
    }

    return questionObj;
}

function getCheckBoxObj(c, questId, pollId) {
    const checkBoxObj = {
        id: c.id,
        pre_id: questId,
        enc_id: pollId,
        body: c.body,
        image: c.image
    }

    return checkBoxObj;
}

exports.update = function(req, res, next) {
    if (!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return next("Content can not be empty");
    }
    try {
        let questionObj = getQuestionObj(req, req.params.pollId, req.params.questionId);
        
        question.updateById(questionObj, (err, questionData) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: 'Question with pollId: ' + questionObj.id + ' and id: ' + questionObj.enc_id + ' not found'
                    });
                    return next('Question with pollId: ' + questionObj.id + ' and id: ' + questionObj.enc_id + ' not found');
                } else  {
                    res.status(500).send({
                        message: err.message || "No s'ha pogut modificar la question amb id: " + questionObj.enc_id + ' i pollId: ' + questionObj.id
                    });
                    return next(err.message || "No s'ha pogut modificar la question amb id: " + questionObj.enc_id + ' i pollId: ' + questionObj.id);
                }
            } 
            else {
                if (questionObj.defined_answers == 1) {
                    //guarda todas las checkBox por cada pregunta
                    for(var j = 0; j < req.body.answers.length; j++) {
                        var c = req.body.answers[j];
                        let checkBoxObj = getCheckBoxObj(c, questionObj.id, questionObj.enc_id);
                        checkBox.updateById(checkBoxObj, (err, checkBoxData) => {
                            if (err) {
                                if (err.kind === "not_found") {
                                    checkBox.create(checkBoxObj, (err, checkBoxData) => {
                                        if (err)  {
                                            res.status(500).send(err.message || "No s'ha pogut crear cap checkBox amb id: " + checkBoxObj.id + ', questionId: ' + questionObj.id + ' i pollId: ' + questionObj.enc_id);
                                            return next(err.message || "No s'ha pogut crear cap checkBox amb id: " + checkBoxObj.id + ', questionId: ' + questionObj.id + ' i pollId: ' + questionObj.enc_id);
                                        }
                                    });
                                } else  {
                                    res.status(500).send( err.message || "No s'ha pogut ni crear ni modificar la CheckBox amb id: " + checkBoxObj.id + ', questionId: ' + questionObj.id + ' i pollId: ' + questionObj.enc_id);
                                    return next(err.message || "No s'ha pogut ni crear ni modificar la CheckBox amb id: " + checkBoxObj.id + ', questionId: ' + questionObj.id + ' i pollId: ' + questionObj.enc_id);
                                }
                            }
                            return next("CheckBox amb id: " + checkBoxObj.id + ', questionId: ' + questionObj.id + ' i pollId: ' + questionObj.enc_id + " creada amb èxit");
                        });
                    }
                    res.status(201).send("question modificada amb èxit");
                    return next("question modificada amb èxit");
                }
                res.status(201).send("question modificada amb èxit");
                return next("question modificada amb èxit");
            }
        });
    } catch (err) {
        console.log("Error: " + err);
        next(err);
        res.status(503).send(err);
        return false;
    }
}

exports.post = function(req, res, next) {
    if (!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return next("Content can not be empty!");
    }
    try {
        poll.findById(req.params.pollId, (err, pollData) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(500).send({
                        message: err.message || 'Poll with id ' + req.params.pollId + ' not found'
                    });
                    return next('Poll with id ' + req.params.pollId + ' not found');
                } else  {
                    res.status(500).send({
                        message: err.message || 'Error retrieving poll with id: '+ req.params.pollId
                    });
                    return next(err.message || 'Error retrieving poll with id: '+ req.params.pollId);
                }
            } 
            else {
                let questionObj = getQuestionObj(req, req.params.pollId, req.body.id);
                question.findByIdAndPollId(req.params.pollId, questionObj.id, (err3, questionData3) => {
                    if (err3.kind === "not_found") {
                        question.create(questionObj, (err4, questionData) => {
                            if (err4) {
                                res.status(500).send({
                                    message: err4.message || 'Error question'
                                });
                                return next(err4.message || 'Error question');
                            }
                            if (questionObj.defined_answers == 1) {
                                //guarda todas las checkBox por cada pregunta
                                for(var j = 0; j < req.body.answers.length; j++) {
                                    var c = req.body.answers[j];
                                    let checkBoxObj = getCheckBoxObj(c, questionObj.id, req.params.pollId);
                                    checkBox.create(checkBoxObj, (err2, checkBoxData) => {
                                        if (err2) {
                                            res.status(500).send({
                                                message: err2.message || 'Error CheckBox'
                                            });
                                            return next(err2.message || 'Error CheckBox');
                                        }
                                    });
                                }
                            }
                            res.status(201).send("Question creada con exito");
                            return next("Question creada con exito");
                        });
                    }
                    else {
                        res.status(500).send({
                            message: 'question with pollid: ' + req.params.pollId + ' and id: ' + req.body.id + ' is already in the System'
                        });
                        return next("question with pollid: " + req.params.pollId + " and id: " + req.body.id + " is already in the System");
                    }
                });
            }
        }); 
    } catch (err) {
        console.log("Error:" + err);
        next(err);
        res.status(503).send(err);
        return false;
    }
}
