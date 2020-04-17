const bd = require("../bd/bd");

//constructor

const Organizacion = function(organizacion) {
    this.name = organizacion.name;
    this.adress = organizacion.adress;
    this.phone = organizacion.phone;
    this.web = organizacion.web;
}

Organizacion.create = (newOrganizacion, result) => {
    bd.query("INSERT INTO Organizacion SET ?", newOrganizacion, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created organization: ", {id: res.insertId, ...newOrganizacion});
        result(null, {id: res.insertId, ...newOrganizacion});
    });
};

Organizacion.getAll = result => {
    bd.query("SELECT * FROM Organizacion", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("organizations: ", res);
        result(null, res);
    });
};

Organizacion.findById = (organizacionId, result) => {
    bd.query('SELECT * FROM Organizacion WHERE id = ' + organizacionId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found organizacion: ", res[0]);
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

Organizacion.updateById = (id, organizacion, result) => {
    bd.query(
      "UPDATE Organizacion SET name = ?, adress = ?, phone = ?, web = ? WHERE id = ?",
      [organizacion.name, organizacion.adress, organizacion.phone, organizacion.web, id], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Organization with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated organizacion: ", { id: id, ...organizacion });
        result(null, { id: id, ...organizacion });
      });
};

Organizacion.remove = (id, result) => {
    bd.query("DELETE FROM Organizacion WHERE id = ?", id, (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    if (res.affectedRows == 0) {
        // not found Organization with the id
        result({ kind: "not_found" }, null);
        return;
    }

    console.log("deleted organizacion with id: ", id);
    result(null, res);
    });
};

Organizacion.removeAll = result => {
    bd.query("DELETE FROM Organizacion", (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    console.log('deleted ' + res.affectedRows + ' organizaciones');
    result(null, res);
    });
};
  

module.exports = Organizacion;
