const bd = require("../bd/bd");

//constructor

const checkBox = function(checkBox) {
    this.id = checkBox.id;
    this.pre_id = checkBox.pre_id;
    this.enc_id = checkBox.enc_id;
    this.body = checkBox.body;
    this.image = checkBox.image;
}

checkBox.create = (newcheckBox, result) => {
    bd.query("INSERT INTO CheckBox SET ?", newcheckBox, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created checkBox: ", {id: newcheckBox.id, ...newcheckBox});
        result(null, {id: newcheckBox.id, ...newcheckBox});
    });
};

checkBox.getAll = result => {
    bd.query("SELECT * FROM CheckBox", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("checkBoxs: ", res);
        result(null, res);
    });
};

checkBox.findById = (checkBoxId, result) => {
    bd.query('SELECT * FROM CheckBox WHERE id = ' + checkBoxId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found checkBox: ", res[0]);
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

checkBox.findByPollId = (PollId, result) => {
    bd.query('SELECT * FROM CheckBox WHERE enc_id = ?',[PollId], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.length) {
            //console.log("found checkBoxs: ", res);
            result(null, res);
            return;
        }
        result({kind: "not_found"}, null);
    });
}

checkBox.updateById = (checkBox, result) => {
    bd.query(
      "UPDATE CheckBox SET body = ?, image = ? WHERE id = ? AND pre_id = ? AND enc_id = ?",
      [checkBox.body, checkBox.image, checkBox.id, checkBox.pre_id, checkBox.enc_id], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found checkBox with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated checkBox: ", { id: checkBox.id, ...checkBox });
        result(null, { id: checkBox.id, ...checkBox });
      });
};

checkBox.remove = (pollId, questionId, id, result) => {
    bd.query("DELETE FROM CheckBox WHERE id = ? and enc_id = ? and pre_id = ?", 
    [id, pollId , questionId], (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    if (res.affectedRows == 0) {
        // not found checkBox with the id
        result({ kind: "not_found" }, null);
        return;
    }

    console.log("deleted checkBox with id: ", id);
    result(null, res);
    });
};

checkBox.removeAll = result => {
    bd.query("DELETE FROM CheckBox", (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    console.log('deleted ' + res.affectedRows + ' checkBoxes');
    result(null, res);
    });
};
  

module.exports = checkBox;
