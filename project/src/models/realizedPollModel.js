const bd = require("../bd/bd");

//constructor

const realizedPoll = function(realizedPoll) {
    this.id = realizedPoll.id;
    this.user_id = realizedPoll.user_id;
    this.enc_id = realizedPoll.enc_id;
    this.centr_id = realizedPoll.centr_id;
    this.enq_id = realizedPoll.enq_id;
    this.date = realizedPoll.date;
    this.respuestas = realizedPoll.respuestas;
}

realizedPoll.create = (newrealizedPoll, result) => {
    bd.query("INSERT INTO RealizedPoll SET ?", newrealizedPoll, (err, res) => {
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
    bd.query("SELECT * FROM RealizedPoll", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result.err = err;
            result.res = null;
            return false;
        }
        console.log("realizedPolls: ", res);
        result.err = null;
        result.res = res[0];
    });
};

realizedPoll.findById = (realizedPollId, result) => {
    bd.query('SELECT * FROM RealizedPoll WHERE id = ' + realizedPollId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err,null);
            return;
        }
        if (res.length) {
            console.log("found realizedPoll: ", res[0]);
            result(err,res[0])
            return;
        }
        result({kind: "not_found"}, null);
    });
};

realizedPoll.updateById = (id, realizedPoll, result) => {
    bd.query(
      "UPDATE RealizedPoll SET user_id = ?, enc_id = ?, centr_id = ?, enq_id = ?, date = ?, respuestas = ? WHERE id = ?",
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
    bd.query("DELETE FROM RealizedPoll WHERE id = ?", id, (err, res) => {
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
    bd.query("DELETE FROM RealizedPoll", (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    console.log('deleted ' + res.affectedRows + ' realizedPolles');
    result(null, res);
    });
};
  
realizedPoll.findAllByParams = (org, pollId, dateIni, dateFin, result) => {
    bd.query("SELECT DISTINCT rp.id , rp.centr_id , c.name as center_name, o.name as org_name, rp.`date`, rp.enc_id , rp.respuestas "
            + "FROM RealizedPoll rp right join Center c on rp.centr_id = c.id right join Organization o on c.org_id = o.id  "
            + "WHERE (" + org +" is null or (centr_id = " + org + " and c.id = " + org + ")) "
            + "and (" + pollId + " is null or enc_id = " + pollId + ") and "
            + " ("+ dateIni + " is null or date >= " + dateIni + ") and "
            + "(" + dateFin + " is null or date <= " + dateFin + ")",
        [org, org, pollId, pollId, dateIni, dateIni, dateFin, dateFin], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err,null);
            return;
        }
        if (res.length) {
            console.log("found realizedPolls: ", res);
            result(err,res)
            return;
        }
        result({kind: "not_found"}, null);
    });
};

module.exports = realizedPoll;
