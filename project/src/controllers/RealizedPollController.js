const realizedPoll = require("../models/realizedPollModel");
const poll = require("../models/pollModel");
const user = require("../models/userModel");
const pollster = require("../models/pollsterModel");
const center = require("../models/centerModel");

var bodyParser = require('body-parser');

var jsonParser = bodyParser.json()

function getEmployeeFromRec(req) {
    const realizedPollObj = {
        id: req.body.id,
        user_id: req.body.user_id,
        enc_id: req.body.enc_id,
        centr_id: req.body.centr_id,
        enq_id: req.body.enq_id,
        date: req.body.date,
        respuestas: JSON.stringify(req.body.respuestas)
    };

    return realizedPollObj;
}

exports.post = function(req, res, next) {
    if (!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    try {
        var self = this;

        var realizedPollObj = getEmployeeFromRec(req);

        //comprobar que la poll existe y está vacia
        poll.findById(realizedPollObj.enc_id, (err, pollData) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: 'Poll with id ' + realizedPollObj.enc_id + ' not found'
                    });
                } else  {
                    res.status(500).send({
                        message: err.message || 'Error retrieving poll with id ${realizedPollObj.enc_id}'
                    });
                }
                return;
            } 
        });
        console.log("Poll verificada");

        //comprobar que el usuario existe
        user.findById(realizedPollObj.user_id,  (err, pollData) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: 'User with id ' + realizedPollObj.user_id + ' not found'
                    });
                } else  {
                    res.status(500).send({
                        message: err.message || 'Error retrieving user with id ${realizedPollObj.user_id}'
                    });
                }
                return;
            } 
        });
        console.log("user verificada");

        //comprobar que el enquestador existe
        pollster.findById(realizedPollObj.enq_id,  (err, pollData) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: 'Pollster with id ' + realizedPollObj.enq_id + ' not found'
                    });
                } else  {
                    res.status(500).send({
                        message: err.message || 'Error retrieving pollster with id ${realizedPollObj.enq_id}'
                    });
                }
            } 
        });
        console.log("enquestador verificada");

        //comprobar que el centro existe
        center.findById(realizedPollObj.centr_id,  (err, pollData) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: 'Center with id ' + realizedPollObj.centr_id + ' not found'
                    });
                } else  {
                    res.status(500).send({
                        message: err.message || 'Error retrieving center with id ${realizedPollObj.centr_id}'
                    });
                }
            } 
        });
        console.log("center verificada");
        
        //guardar la realizedPoll en la BD
        realizedPoll.create(realizedPollObj, (err, result) => {
            if (err) {
                res.status(500).send({
                    message: err.message || 'Error creating realizedPoll'
                });
            } 
            else res.status(201).send("realizedPoll created successfully");
        });
        
    } catch (err) {
        console.log(err);
        next(err);
        res.status(503).send(err);
        return next(err);
    }
}

exports.findAll = function(req, res, next) {
    if (!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return next("Content can not be empty!");
    }
    try {
        
    } catch (err) {
        console.log(err);
        next(err);
        res.status(503).send(err);
        return next(err);
    }
}