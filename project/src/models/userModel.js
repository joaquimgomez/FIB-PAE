const bd = require("../bd/bd");

//constructor

const user = function(user) {
    this.id = user.id;
    this.name = user.name;
    this.birth_date = user.birth_date;
}

user.create = (newuser, result) => {
    bd.query("INSERT INTO User SET ?", newuser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created user: ", {id: res.insertId, ...newuser});
        result(null, {id: res.insertId, ...newuser});
    });
};

user.getAll = result => {
    bd.query("SELECT * FROM User", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("users: ", res);
        result(null, res);
    });
};

user.findById = (userId, result) => {
    bd.query('SELECT * FROM User WHERE id = ' + userId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err,null);
            return;
        }
        if (res.length) {
            console.log("found user: ", res[0]);
            result(err,res[0])
            return;
        }
        result({kind: "not_found"}, null);
    });
};

user.updateById = (id, user, result) => {
    bd.query(
      "UPDATE User SET name = ?, birth_date = ? WHERE id = ?",
      [user.name, user.adress, user.phone, user.web, id], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found user with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated user: ", { id: id, ...user });
        result(null, { id: id, ...user });
      });
};

user.remove = (id, result) => {
    bd.query("DELETE FROM User WHERE id = ?", id, (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    if (res.affectedRows == 0) {
        // not found user with the id
        result({ kind: "not_found" }, null);
        return;
    }

    console.log("deleted User with id: ", id);
    result(null, res);
    });
};

user.removeAll = result => {
    bd.query("DELETE FROM User", (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    console.log('deleted ' + res.affectedRows + ' useres');
    result(null, res);
    });
};
  

module.exports = user;
