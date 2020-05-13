const poll = require("../models/pollModel");
const question = require("../models/questionModel");
const checkBox = require("../models/checkBoxModel");

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
