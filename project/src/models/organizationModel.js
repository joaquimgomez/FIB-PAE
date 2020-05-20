const bd = require("../bd/bd");

//constructor

const organization = function(organization) {
    this.name = organization.name;
    this.adress = organization.adress;
    this.phone = organization.phone;
    this.web = organization.web;
}

organization.create = (neworganization, result) => {
    bd.query("INSERT INTO Organization SET ?", neworganization, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created organization: ", {id: res.insertId, ...neworganization});
        result(null, {id: res.insertId, ...neworganization});
    });
};

organization.getAll = result => {
    bd.query("SELECT * FROM Organization", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("organizations: ", res);
        result(null, res);
    });
};

organization.findById = (organizationId, result) => {
    bd.query('SELECT * FROM Organization WHERE id = ' + organizationId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found organization: ", res[0]);
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

organization.updateById = (id, organization, result) => {
    bd.query(
      "UPDATE Organization SET name = ?, adress = ?, phone = ?, web = ? WHERE id = ?",
      [organization.name, organization.adress, organization.phone, organization.web, id], (err, res) => {
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
  
        console.log("updated organization: ", { id: id, ...organization });
        result(null, { id: id, ...organization });
      });
};

organization.remove = (id, result) => {
    bd.query("DELETE FROM Organization WHERE id = ?", id, (err, res) => {
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

    console.log("deleted organization with id: ", id);
    result(null, res);
    });
};

organization.removeAll = result => {
    bd.query("DELETE FROM Organization", (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    console.log('deleted ' + res.affectedRows + ' organizationes');
    result(null, res);
    });
};
  

module.exports = organization;
