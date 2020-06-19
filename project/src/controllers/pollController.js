const poll = require("../models/pollModel");
const question = require("../models/questionModel");
const checkBox = require("../models/checkBoxModel");
const org = require("../models/organizationModel");

exports.findAll = (req, res) =>{
    poll.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Error ocurred while retrieving polls."
            });
        else res.send(data);
    })
};

exports.findOne = (req, res) => {
    poll.findById(req.params.pollId, (err, pollData) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: 'Poll with id ${req.params.pollId} not found'
                });
            } else  {
                res.status(500).send({
                    message: err.message || 'Error retrieving poll with id ${req.params.pollId}'
                });
            }
        } 
        else{
            question.findByPollId(req.params.pollId, (err, questionsData) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: 'Questions of poll with id ${req.params.pollId} not found'
                        });
                    } else  {
                        res.status(500).send({
                            message: err.message || 'Error retrieving questions of poll with id ${req.params.pollId}'
                        });
                    }
                }
                else {
                    pollData.questions = questionsData;
                    for (var q in pollData.questions){
                        if (pollData.questions[q].defined_answers == 1) pollData.questions[q].answers = [];
                    }
                    checkBox.findByPollId(pollData.id, (err, checkBoxData) => {
                        if (err) {
                            if (err.kind === "not_found") {
                                res.send(pollData);
                            } else  {
                                res.status(500).send({
                                    message: err.message || 'Error retrieving checkboxes of poll with id ${req.params.pollId}'
                                });
                            }
                        }
                        else {
                            checkBoxData = JSON.parse(JSON.stringify(checkBoxData));
                            for (var c in checkBoxData){
                                //console.log(checkBoxData[c]);
                                for (var q in pollData.questions){
                                    if (pollData.questions[q].defined_answers == 1 && checkBoxData[c].pre_id == pollData.questions[q].id){
                                        pollData.questions[q].answers.push(checkBoxData[c]);
                                    }
                                }
                            }
                            console.log(pollData);
                            res.send(pollData);
                        }
                    });
                }
            });
        }
    });
};

function getPollObj(req) {
    const pollObj = {
        id: req.body.id,
        name: req.body.name,
        org_id: req.body.org_id,
        created_at: new Date(),
        last_modify: null
    };

    return pollObj;
}

function getPollObjPut(req, poll_id) {
    const pollObj = {
        id: poll_id,
        name: req.body.name,
        org_id: req.body.org_id,
        last_modify: new Date()
    };

    return pollObj;
}

function getQuestionObj(q, pollId) {
    const questionObj = {
        id: q.id,
        enc_id: pollId,
        body: q.body,
        defined_answers: q.defined_answers
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

exports.post = function(req, res, next) {
    if (!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    try {
        var self = this;
        var pollObj = getPollObj(req);
        //comprobar que la poll existe y está vacia
        org.findById(pollObj.org_id, (err, orgData) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: 'Organization with id ' + pollObj.org_id + ' not found'
                    });
                } else  {
                    res.status(500).send({
                        message: err.message || 'Error retrieving poll with id ${pollObj.org_id}'
                    });
                }
                return;
            } 
        });
        
        //guardar la poll en la BD
        poll.create(pollObj, (err, pollData) => {
            if (err) {
                res.status(500).send({
                    message: err.message || 'Error poll'
                });
            } 
            //guardar todas las preguntas y relacionarlas con la nueva poll
            for(i = 0; i < req.body.questions.length; i++) {
                let q = req.body.questions[i];
                let questionObj = getQuestionObj(q, pollData);
                question.create(questionObj, (err, questionData) => {
                    if (err) {
                        res.status(500).send({
                            message: err.message || 'Error question'
                        });
                    }
                    if (q.defined_answers == 1) {
                        //guarda todas las checkBox por cada pregunta
                        for(var j = 0; j < q.answers.length; j++) {
                            var c = q.answers[j];
                            var checkBoxObj = getCheckBoxObj(c, q.id, pollData);
                            checkBox.create(checkBoxObj, (err, checkBoxData) => {
                                if (err) {
                                    res.status(500).send({
                                        message: err.message || 'Error CheckBox'
                                    });
                                }
                            });
                        }
                    }
                });
            }
            res.status(201).send("" + pollData);
        });
        
        
    } catch (err) {
        console.log(err);
        next(err);
        res.status(503).send(err);
        return;
    }
}

exports.update = function(req, res, next) {
    if (!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    try {
        var pollObj = getPollObjPut(req, req.params.pollId);
        //comprovem que existeix la Poll
        poll.findById(pollObj.id, (err, pollData) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: 'Poll with id ' + pollObj.id + ' not found'
                    });
                } else  {
                    res.status(500).send({
                        message: err.message || 'Error retrieving poll with id ${pollObj.org_id}'
                    });
                }
            } 
            else {
                //Comprovem que exixteix la organització
                org.findById(pollObj.org_id, (err, orgData) => {
                    if (err) {
                        if (err.kind === "not_found") {
                            res.status(404).send({
                                message: 'Organization with id ' + pollObj.org_id + ' not found'
                            });
                        } else  {
                            res.status(500).send({
                                message: err.message || 'Error retrieving poll with id ${pollObj.org_id}'
                            });
                        }
                        return false;
                    } 
                    else {
                        //Fem update de la poll
                        poll.updateById(pollObj.id, pollObj, (err, pollData2) => {
                            if (err) {
                                res.status(500).send({
                                    message: err.message || 'Error poll'
                                });
                            }
                            res.status(201).send("poll modificada con exito");
                        });
                    }
                });
            }
        });
    
        
    
    } catch (err) {
        console.log(err);
        next(err);
        res.status(503).send(err);
        return false;
    }
}