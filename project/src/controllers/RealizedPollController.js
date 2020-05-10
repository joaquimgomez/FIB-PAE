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
        enq_id: req.body.enc_id,
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
        console.log("Entro al post");
        let realizedPollObj = getEmployeeFromRec(req);
        console.log("He obtenido el objeto realizedPoll");

        //comprobar que la poll existe y está vacia
        let resultSet = {
            err: "",
            res: ""
        };
        let pollObj = poll.findById(realizedPollObj.enc_id, resultSet);
        if (pollObj == "f") {
            console.log(resultSet.err);
            res.status(404).send(resultSet.err);
            return;
        }
        console.log("Poll verificada");

        //comprobar que el usuario existe
        let userObj = user.findById(realizedPollObj.user_id,  resultSet);
        if (userObj == "f") {
            console.log(resultSet.err);
            res.status(404).send(resultSet.err);
            return;
        }
        console.log("user verificada");

        //comprobar que el enquestador existe
        let pollsterObj = pollster.findById(realizedPollObj.enq_id,  resultSet);
        if (pollsterObj == 'f') {
            console.log(resultSet.err);
            res.status(404).send(resultSet.err);
            return;
        }
        console.log("enquestador verificada");
        //comprobar que el centro existe
        let centerObj = center.findById(realizedPollObj.centr_id,  resultSet);
        console.log(centerObj);
        if (centerObj == 'f') {
            console.log(resultSet.err);
            res.status(404).send(resultSet.err);
            return;
        }
        console.log("center verificada");
        
        //guardar la realizedPoll en la BD
        let realizedPollBool = realizedPoll.create(realizedPollObj, resultSet);
        console.log(realizedPollBool);
        if (realizedPollBool != 'f'){
            console.log("He guardado la realized poll en la BD");
            res.status(201).send("realizedPoll almacenada con éxito");
            return;
        }
        else {
            console.log(resultSet.err);
            res.status(404).send(resultSet.err);
            return;
        }
    } catch (err) {
        console.log(err);
        next(err);
        res.status(503).send(err);
        return;
    }
}