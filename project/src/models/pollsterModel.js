const bd = require("../bd/bd");

//constructor

const pollster = function(pollster) {
    this.id = pollster.id;
    this.name = pollster.name;
    this.birth_date = pollster.birth_date;
    this.sex = pollster.sex;
    this.email = pollster.email;
    this.phone = pollster.phone;
    this.password = pollster.password;
    this.org_id = pollster.org_id;
}

pollster.create = (newpollster, result) => {
    bd.query("INSERT INTO Pollster SET ?", newpollster, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created pollster: ", {id: res.insertId, ...newpollster});
        result(null, {id: res.insertId, ...newpollster});
    });
};

pollster.getAll = result => {
    bd.query("SELECT * FROM Pollster", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("pollsters: ", res);
        result(null, res);
    });
};

pollster.findById = (pollsterId, result) => {
    bd.query('SELECT * FROM Pollster WHERE id = ' + pollsterId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result.err = err;
            result.res = null;
            return "f";
        }
        if (res.length) {
            console.log("found pollster: ", res[0]);
            result.err = null;
            result.res = res[0];
            return "t";
        }
        result.err = {kind: "not_found"};
        result.res = null;
        return "f";
    });
};

pollster.updateById = (id, pollster, result) => {
    bd.query(
      "UPDATE pollster SET name = ?, birth_date = ?, sex = ?, email = ?, phone = ?, password = ?, org_id = ? WHERE id = ?",
      [pollster.name, pollster.adress, pollster.phone, pollster.web, id], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found pollster with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated pollster: ", { id: id, ...pollster });
        result(null, { id: id, ...pollster });
      });
};

pollster.remove = (id, result) => {
    bd.query("DELETE FROM pollster WHERE id = ?", id, (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    if (res.affectedRows == 0) {
        // not found pollster with the id
        result({ kind: "not_found" }, null);
        return;
    }

    console.log("deleted pollster with id: ", id);
    result(null, res);
    });
};

pollster.removeAll = result => {
    bd.query("DELETE FROM pollster", (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    console.log('deleted ' + res.affectedRows + ' pollsteres');
    result(null, res);
    });
};
  

module.exports = pollster;
