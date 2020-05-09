const bd = require("../bd/bd");

//constructor

const realizedPoll = function(realizedPoll) {
    this.id = realizedPoll.id;
    this.user_id = realizedPoll.user_id;
    this.enc_id = realizedPoll.enc_id;
    this.centr_id = realizedPoll.centr_id;
    this.enq_id = realizedPoll.enq_id;
    this.date = realizedPoll.date;
    this.respuestas = realizedPoll = respuestas;
}

realizedPoll.create = (newrealizedPoll, result) => {
    bd.query("INSERT INTO realizedPoll SET ?", newrealizedPoll, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created realizedPoll: ", {id: res.insertId, ...newrealizedPoll});
        result(null, {id: res.insertId, ...newrealizedPoll});
    });
};

realizedPoll.getAll = result => {
    bd.query("SELECT * FROM realizedPoll", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("realizedPolls: ", res);
        result(null, res);
    });
};

realizedPoll.findById = (realizedPollId, result) => {
    bd.query('SELECT * FROM realizedPoll WHERE id = ' + realizedPollId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found realizedPoll: ", res[0]);
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

realizedPoll.updateById = (id, realizedPoll, result) => {
    bd.query(
      "UPDATE realizedPoll SET user_id = ?, enc_id = ?, centr_id = ?, enq_id = ?, date = ?, respuestas = ? WHERE id = ?",
      [realizedPoll.name, realizedPoll.adress, realizedPoll.phone, realizedPoll.web, id], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found realizedPoll with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated realizedPoll: ", { id: id, ...realizedPoll });
        result(null, { id: id, ...realizedPoll });
      });
};

realizedPoll.remove = (id, result) => {
    bd.query("DELETE FROM realizedPoll WHERE id = ?", id, (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    if (res.affectedRows == 0) {
        // not found realizedPoll with the id
        result({ kind: "not_found" }, null);
        return;
    }

    console.log("deleted realizedPoll with id: ", id);
    result(null, res);
    });
};

realizedPoll.removeAll = result => {
    bd.query("DELETE FROM realizedPoll", (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    console.log('deleted ' + res.affectedRows + ' realizedPolles');
    result(null, res);
    });
};
  

module.exports = realizedPoll;
