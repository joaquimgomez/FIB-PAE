const bd = require("../bd/bd");

//constructor

const center = function(center) {
    this.id = center.id;
    this.name = center.name;
    this.adress = center.adress;
}

center.create = (newcenter, result) => {
    bd.query("INSERT INTO Center SET ?", newcenter, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created center: ", {id: res.insertId, ...newcenter});
        result(null, {id: res.insertId, ...newcenter});
    });
};

center.getAll = result => {
    bd.query("SELECT * FROM Center", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("centers: ", res);
        result(null, res);
    });
};

center.findById = (centerId, result) => {
    bd.query('SELECT * FROM Center WHERE id = ' + centerId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result.err = err;
            result.res = null;
            return "f";
        }
        if (res.length) {
            console.log("found center: ", res[0]);
            result.err = null;
            result.res = res[0];
            return "t";
        }
        result.err = {kind: "not_found"};
        result.res = null;
        return "f";
    });
};

center.updateById = (id, center, result) => {
    bd.query(
      "UPDATE Center SET name = ?, adress = ? WHERE id = ?",
      [center.name, center.adress, center.phone, center.web, id], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found center with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated center: ", { id: id, ...center });
        result(null, { id: id, ...center });
      });
};

center.remove = (id, result) => {
    bd.query("DELETE FROM Center WHERE id = ?", id, (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    if (res.affectedRows == 0) {
        // not found center with the id
        result({ kind: "not_found" }, null);
        return;
    }

    console.log("deleted Center with id: ", id);
    result(null, res);
    });
};

center.removeAll = result => {
    bd.query("DELETE FROM Center", (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    console.log('deleted ' + res.affectedRows + ' centeres');
    result(null, res);
    });
};
  

module.exports = center;
